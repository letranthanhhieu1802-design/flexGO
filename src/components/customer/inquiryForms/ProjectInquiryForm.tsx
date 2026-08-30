import React from 'react';
import { Layers, MapPin } from 'lucide-react';
import { ProjectInquirySpecs } from '../../../types';
import { VASItemDef } from './VASSection';

export const PROJECT_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'p-vas-1',
    name: 'Khảo sát tĩnh không & Cầu đường thực địa (Route Survey)',
    desc: 'Đội ngũ kỹ sư khảo sát độ cao tĩnh không, tải trọng cầu cống và lập phương án tuyến.',
    tag: 'Khảo sát tuyến',
    popular: true,
  },
  {
    id: 'p-vas-2',
    name: 'Xin giấy phép lưu hành xe quá khổ quá tải Cục Đường Bộ',
    desc: 'Hồ sơ pháp lý cấp phép vận chuyển hàng siêu trường siêu trọng từ cơ quan quản lý.',
    tag: 'Giấy phép OOG',
    popular: true,
  },
  {
    id: 'p-vas-3',
    name: 'Dịch vụ chằng buộc cố định hàng nặng chuyên dụng (Heavy Lashing)',
    desc: 'Dây cáp thép, xích chịu lực, hàn chêm chống trượt và lót gỗ đệm chịu lực cao.',
    tag: 'Chằng buộc lashing',
    popular: true,
  },
  {
    id: 'p-vas-4',
    name: 'Kỹ sư hiện trường & Xe hoa tiêu dẫn đường (Escort & Field Engineer)',
    desc: 'Giám sát kỹ thuật trực tiếp tại các chặng bốc xếp và xe dẫn đường chuyên dụng.',
    tag: 'Hoa tiêu dẫn đường',
    popular: true,
  },
  {
    id: 'p-vas-5',
    name: 'Cẩu siêu trường tải trọng lớn 50T - 200T phục vụ hạ bệ móng',
    desc: 'Cẩu chuyên dụng hạ đặt chính xác thiết bị máy móc vào bệ móng nhà máy.',
    tag: 'Cẩu 50T-200T',
  },
  {
    id: 'p-vas-6',
    name: 'Bảo hiểm trọn gói rủi ro hàng dự án công nghiệp (Project All Risks)',
    desc: 'Bảo hiểm tổn thất toàn diện cho máy móc dây chuyền giá trị cao.',
    tag: 'Bảo hiểm dự án',
    popular: true,
  },
];

interface ProjectInquiryFormProps {
  specs: ProjectInquirySpecs;
  onChange: (specs: ProjectInquirySpecs) => void;
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
}

export const ProjectInquiryForm: React.FC<ProjectInquiryFormProps> = ({
  specs,
  onChange,
  origin,
  setOrigin,
  destination,
  setDestination,
}) => {
  const updateSpec = <K extends keyof ProjectInquirySpecs>(key: K, value: ProjectInquirySpecs[K]) => {
    onChange({
      ...specs,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Service Header Info */}
      <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl flex items-start gap-3">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div className="text-xs text-indigo-950 flex-1">
          <span className="font-bold block text-sm text-indigo-900">
            Dịch Vụ Hàng Dự Án & Vận Tải Đa Phương Thức (Project Cargo & Multimodal)
          </span>
          <p className="text-indigo-800/80 mt-0.5">
            Vận chuyển hàng siêu trường siêu trọng (OOG), di dời lắp đặt nhà xưởng trọn gói hoặc kết hợp nhiều chặng vận tải.
          </p>
        </div>
      </div>

      {/* Project Type */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Phân Loại Dự Án & Phương Thức Vận Chuyển *
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => updateSpec('projectType', 'Hàng siêu trường siêu trọng (OOG)')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              specs.projectType === 'Hàng siêu trường siêu trọng (OOG)'
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-900 block">🏗️ Hàng OOG Siêu Trường</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Quá khổ, quá tải, Mooc lùn / Rơ-moóc thủy lực</span>
          </button>

          <button
            type="button"
            onClick={() => updateSpec('projectType', 'Vận chuyển thiết bị toàn bộ nhà máy')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              specs.projectType === 'Vận chuyển thiết bị toàn bộ nhà máy'
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-900 block">🏭 Di Dời / Lắp Đặt Nhà Xưởng</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Di chuyển trọn gói dây chuyền máy móc</span>
          </button>

          <button
            type="button"
            onClick={() => updateSpec('projectType', 'Đa phương thức kết hợp (Multimodal)')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              specs.projectType === 'Đa phương thức kết hợp (Multimodal)'
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-slate-900 block">🌐 Đa Phương Thức (Multimodal)</span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Kết hợp Biển + Sắt + Bộ xuyên suốt</span>
          </button>
        </div>
      </div>

      {/* Route / Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>Điểm Khởi Hành / Cảng Xếp Hàng *</span>
          </label>
          <input
            type="text"
            required
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="VD: Cảng Tân Vũ (Hải Phòng) / Nhà máy A"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span>Điểm Đến / Công Trường Nhà Máy *</span>
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="VD: Nhà máy Lọc dầu Dung Quất, Quảng Ngãi"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Dimension & Max Weight */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kích Thước Kiện Lớn Nhất (Dài x Rộng x Cao mét)
          </label>
          <input
            type="text"
            value={specs.cargoDimensions || ''}
            onChange={(e) => updateSpec('cargoDimensions', e.target.value)}
            placeholder="VD: 14.5m x 4.2m x 3.8m"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Trọng Lượng Kiện Nặng Nhất (Tấn)
          </label>
          <input
            type="number"
            min={1}
            value={specs.maxUnitWeightTons ?? ''}
            onChange={(e) => updateSpec('maxUnitWeightTons', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="VD: 45"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
