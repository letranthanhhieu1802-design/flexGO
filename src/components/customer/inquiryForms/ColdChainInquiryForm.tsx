import React from 'react';
import { ThermometerSnowflake, MapPin } from 'lucide-react';
import { ColdChainInquirySpecs } from '../../../types';
import { VASItemDef } from './VASSection';

export const COLD_CHAIN_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'c-vas-load',
    name: 'Bốc dỡ & Bốc xếp hàng hóa 2 đầu kho bãi (Loading & Unloading Labor)',
    desc: 'Đội ngũ nhân công bốc dỡ, chuyển hàng từ kho lạnh lên/xuống thùng xe nhanh chóng, đúng quy trình.',
    tag: 'Bốc dỡ 2 đầu',
    popular: true,
  },
  {
    id: 'c-vas-1',
    name: 'Làm lạnh trước thùng xe 30-60 phút trước khi bốc hàng (Pre-cooling)',
    desc: 'Đảm bảo không gian thùng xe đạt chuẩn nhiệt độ âm/mát trước khi mở cửa nhận hàng.',
    tag: 'Pre-cooling',
    popular: true,
  },
  {
    id: 'c-vas-2',
    name: 'Thiết bị IoT GPS Data Logger ghi & truyền biểu đồ nhiệt độ online 24/7',
    desc: 'Theo dõi nhiệt độ và vị trí xe theo thời gian thực (Real-time), trích xuất file PDF lịch sử nhiệt.',
    tag: 'IoT Data Logger',
    popular: true,
  },
  {
    id: 'c-vas-multidrop',
    name: 'Giao hàng đa điểm & Kiểm đếm chi tiết tại từng điểm dỡ lạnh (Multi-drop & Counting)',
    desc: 'Giao hàng phân tán nhiều điểm (chuỗi siêu thị, đại lý, kho phụ) và kiểm đếm chi tiết từng thùng/kiện.',
    tag: 'Giao đa điểm',
    popular: true,
  },
  {
    id: 'c-vas-3',
    name: 'Máy phát điện dự phòng Clip-on Genset cấp điện liên tục khi di chuyển',
    desc: 'Đảm bảo giàn lạnh Thermo King / Carrier không bị gián đoạn nguồn điện trên đường dài.',
    tag: 'Máy phát Genset',
    popular: true,
  },
  {
    id: 'c-vas-8',
    name: 'Bảo hiểm rủi ro đứt gãy chuỗi lạnh (Temperature Excursion Insurance)',
    desc: 'Bồi thường 100% giá trị hàng hóa nếu nhiệt độ thùng xe vượt ngưỡng thỏa thuận trong hợp đồng.',
    tag: 'Bảo hiểm chuỗi lạnh',
    popular: true,
  },
  {
    id: 'c-vas-5',
    name: 'Dịch vụ cắm điện lưu bãi tại depot / trạm trung chuyển (Yard Plug-in Fee)',
    desc: 'Duy trì nguồn điện cắm bãi cho container lạnh trong thời gian chờ thông quan/lưu bãi.',
    tag: 'Cắm điện bãi',
  },
  {
    id: 'c-vas-7',
    name: 'Bốc xếp lạnh nhanh qua dock trùm túi khí (Inflatable Shelter Cold Dock)',
    desc: 'Nhân công bốc dỡ nhanh trong phòng đệm cách nhiệt chống sốc nhiệt hàng hóa.',
    tag: 'Bốc dỡ phòng lạnh',
  },
  {
    id: 'c-vas-4',
    name: 'Cung cấp đá gel lạnh, túi giữ nhiệt & Thùng xốp EPS bảo ôn (Gel Ice Packs)',
    desc: 'Vật tư đóng gói giữ nhiệt chuyên dụng cho dược phẩm, vắc-xin và thực phẩm tươi sống.',
    tag: 'Đá gel & Thùng xốp',
  },
  {
    id: 'c-vas-6',
    name: 'Chứng nhận kiểm soát nhiệt độ nghiêm ngặt chuẩn GDP / HACCP',
    desc: 'Hồ sơ kiểm định phương tiện và quy trình phân phối thuốc tốt đạt chuẩn Bộ Y Tế.',
    tag: 'Chuẩn GDP / HACCP',
  },
];

interface ColdChainInquiryFormProps {
  specs: ColdChainInquirySpecs;
  onChange: (specs: ColdChainInquirySpecs) => void;
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
}

export const ColdChainInquiryForm: React.FC<ColdChainInquiryFormProps> = ({
  specs,
  onChange,
  origin,
  setOrigin,
  destination,
  setDestination,
}) => {
  const updateSpec = <K extends keyof ColdChainInquirySpecs>(key: K, value: ColdChainInquirySpecs[K]) => {
    onChange({
      ...specs,
      [key]: value,
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Cold Storage Route */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tuyến Đường & Địa Điểm Kho Lạnh (Cold Chain Corridor) *</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kho Lạnh Xuất Phát (Cold Storage Origin) *
            </label>
            <input
              type="text"
              required
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="VD: Kho Lạnh Hoàng Lai, KCN Tân Tạo, Bình Tân, TP.HCM"
              className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-500 font-medium text-slate-900 shadow-2xs placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kho Lạnh Đích / Điểm Giao (Cold Storage Destination) *
            </label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="VD: Trung tâm phân phối WinCommerce, KCN Quang Minh, Hà Nội"
              className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-500 font-medium text-slate-900 shadow-2xs placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* 2. Temperature Range & Vehicle Type */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <ThermometerSnowflake className="w-3.5 h-3.5 text-emerald-600" />
          <span>Yêu Cầu Nhiệt Độ & Cấu Hình Phương Tiện *</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Dải Nhiệt Độ Yêu Cầu (Temperature Category) *
            </label>
            <select
              value={specs.temperatureCategory || ''}
              onChange={(e) => updateSpec('temperatureCategory', e.target.value as any)}
              className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-500 font-bold text-emerald-950 shadow-2xs cursor-pointer"
            >
              <option value="">-- Chọn Dải Nhiệt Độ --</option>
              <option value="Frozen (-25°C to -18°C: Kem, Thủy hải sản)">❄️ Đông Sâu (-25°C đến -18°C) - Thủy hải sản, Kem</option>
              <option value="Chilled (0°C to +4°C: Thịt tươi, Sữa)">🥦 Hàng Mát (0°C đến +4°C) - Sữa chua, Trái cây, Thịt tươi</option>
              <option value="Cool (+8°C to +15°C: Rau củ, Trái cây)">🍫 Mát Nhẹ (+8°C đến +15°C) - Socola, Bánh kẹo, Rượu vang</option>
              <option value="Pharma GDP (+2°C to +8°C / +15°C to +25°C)">💊 Dược Phẩm GDP (+2°C đến +8°C) - Vắc-xin, Sinh phẩm</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Loại Xe / Container Lạnh *
            </label>
            <select
              value={specs.vehicleOrContType || ''}
              onChange={(e) => updateSpec('vehicleOrContType', e.target.value as any)}
              className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-500 font-bold text-slate-800 shadow-2xs cursor-pointer"
            >
              <option value="">-- Chọn Loại Xe / Container Lạnh --</option>
              <option value="Xe tải lạnh 1.5T">Xe Tải Lạnh 1.5T</option>
              <option value="Xe tải lạnh 3.5T">Xe Tải Lạnh 3.5T</option>
              <option value="Xe tải lạnh 8T-15T">Xe Tải Lạnh Nặng 8T - 15T</option>
              <option value="Container Lạnh 20RF">Container Lạnh 20RF (Reefer)</option>
              <option value="Container Lạnh 40RF">Container Lạnh 40RF (Reefer)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
