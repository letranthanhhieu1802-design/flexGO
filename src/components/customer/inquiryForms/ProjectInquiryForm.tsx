import React, { useMemo } from 'react';
import { Layers, MapPin, Building2, Zap, Globe, Truck, CheckSquare, Clock, ShieldCheck, FileText, ArrowRight, Plus, Trash2, Sparkles, Store, Boxes, Split } from 'lucide-react';
import { ProjectInquirySpecs } from '../../../types';
import { VASItemDef } from './VASSection';

export const PROJECT_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'p-vas-pod',
    name: 'Quản trị & Thu hồi chứng từ gốc / Biên bản giao nhận POD trong 48h - 72h',
    desc: 'Hệ thống scan POD điện tử tức thì và chuyển phát nhanh bản cứng định kỳ phục vụ đối soát thanh toán.',
    tag: 'Thu hồi POD gốc',
    popular: true,
  },
  {
    id: 'p-vas-api',
    name: 'Tích hợp hệ sinh thái phần mềm WMS / TMS qua kết nối API 2 chiều',
    desc: 'Đẩy đơn hàng tự động, theo dõi trạng thái lộ trình real-time và đồng bộ tồn kho.',
    tag: 'Tích hợp API WMS/TMS',
    popular: true,
  },
  {
    id: 'p-vas-sorting',
    name: 'Dịch vụ chia chọn, phân loại chi tiết theo Store Code & Dán mã vạch Barcode/QR',
    desc: 'Đội ngũ nhân sự chuyên trách dán tem nhãn phụ, phân tuyến và đóng gộp pallet theo từng mã điểm bán.',
    tag: 'Chia chọn Barcode',
    popular: true,
  },
  {
    id: 'p-vas-labor',
    name: 'Đội ngũ nhân công bốc xếp, nâng hạ & Xếp dỡ chuyên nghiệp tại các điểm giao nhận',
    desc: 'Cung cấp nhân sự bốc xếp tận kho, vào siêu thị trung tâm thương mại hoặc dỡ hàng lên tầng.',
    tag: 'Bốc xếp 2 đầu',
    popular: true,
  },
  {
    id: 'p-vas-kam',
    name: 'Điều phối viên hiện trường & Trưởng dự án chuyên trách 24/7 (Dedicated KAM)',
    desc: 'Cử nhân sự điều hành riêng phụ trách giám sát đơn hàng, xử lý phát sinh và báo cáo KPI định kỳ.',
    tag: 'Quản lý dự án riêng',
    popular: true,
  },
  {
    id: 'p-vas-standby',
    name: 'Đội xe vận tải dự phòng đột xuất cho mùa cao điểm (Standby Fleet)',
    desc: 'Cam kết bố trí thêm 20% - 50% phương tiện vận tải bổ sung trong các đợt flash sale / lễ Tết.',
    tag: 'Đội xe dự phòng',
  },
  {
    id: 'p-vas-ins',
    name: 'Bảo hiểm trách nhiệm phân phối hàng hóa & Rủi ro chuỗi cung ứng toàn diện',
    desc: 'Bảo hiểm tổn thất 100% giá trị hàng hóa trong suốt quá trình trung chuyển và phân phối.',
    tag: 'Bảo hiểm dự án',
    popular: true,
  },
  {
    id: 'p-vas-kpi',
    name: 'Báo cáo phân tích hiệu suất SLA & Đánh giá chi phí Logistics định kỳ (Bi-weekly KPI)',
    desc: 'Báo cáo chi tiết tỷ lệ On-Time In-Full (OTIF), thời gian quay vòng xe và đề xuất tối ưu tuyến đường.',
    tag: 'Báo cáo KPI OTIF',
  },
];

interface ProjectInquiryFormProps {
  specs: ProjectInquirySpecs;
  onChange: (specs: ProjectInquirySpecs) => void;
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  cargoClassification?: 'General' | 'Reefer' | 'Hazmat';
}

const GENERAL_FLEET_ITEMS = [
  { id: 'fleet-light', label: '🚚 Xe tải nhẹ 1.0T – 2.5T (Thùng kín/bạt - Giao nội đô, phố cấm giờ)' },
  { id: 'fleet-medium', label: '🚚 Xe tải trung 3.5T – 8.0T (Thùng kín/bạt - Giao vệ tinh liên tỉnh)' },
  { id: 'fleet-heavy', label: '🚛 Xe tải nặng 15.0T (3 chân) – 18.0T (4 chân) (Tuyến trục chính Linehaul)' },
  { id: 'fleet-cont', label: '🚛 Đầu kéo Sơ-mi Rơ-moóc Container 40ft (Đường dài liên miền)' },
];

const REEFER_FLEET_ITEMS = [
  { id: 'fleet-reefer-light', label: '❄️ Xe tải lạnh nhỏ 1.0T – 2.5T (Nhiệt độ kiểm soát - Giao siêu thị nội đô)' },
  { id: 'fleet-reefer-medium', label: '❄️ Xe tải lạnh trung 3.5T – 8.0T (Nhiệt độ kiểm soát - Giao kho/đại lý tỉnh)' },
  { id: 'fleet-reefer-heavy', label: '❄️ Xe tải lạnh nặng 14.0T – 15.0T (3 chân lạnh - Tuyến trục chính)' },
  { id: 'fleet-reefer-cont', label: '❄️ Đầu kéo Container Lạnh 40RF / 20RF (Kèm máy phát điện Genset liên tục)' },
];

const HAZMAT_FLEET_ITEMS = [
  { id: 'fleet-hazmat-truck', label: '⚠️ Xe tải chuyên dụng chở hóa chất DG (Có giấy phép PCCC & phù hiệu DG)' },
  { id: 'fleet-hazmat-heavy', label: '⚠️ Xe tải nặng / Đầu kéo cont chở hóa chất (Kèm xích tiếp địa chống tĩnh điện)' },
  { id: 'fleet-hazmat-tanker', label: '⚠️ Xe bồn xitéc chuyên dụng chở hóa chất lỏng (Chemical Tanker)' },
];

export const ProjectInquiryForm: React.FC<ProjectInquiryFormProps> = ({
  specs,
  onChange,
  origin,
  setOrigin,
  destination,
  setDestination,
  cargoClassification = 'General',
}) => {
  const updateSpec = <K extends keyof ProjectInquirySpecs>(key: K, value: ProjectInquirySpecs[K]) => {
    onChange({
      ...specs,
      [key]: value,
    });
  };

  const projectCategory = specs.projectCategory || 'DISTRIBUTION';

  // Determine available fleet items based on Cargo Classification
  const activeFleetItems = useMemo(() => {
    if (cargoClassification === 'Reefer') return REEFER_FLEET_ITEMS;
    if (cargoClassification === 'Hazmat') return HAZMAT_FLEET_ITEMS;
    return GENERAL_FLEET_ITEMS;
  }, [cargoClassification]);

  // Origins for Distribution
  const originWarehouses = useMemo(() => {
    if (specs.originWarehouses && specs.originWarehouses.length > 0) {
      return specs.originWarehouses;
    }
    return [origin || ''];
  }, [specs.originWarehouses, origin]);

  const handleOriginChange = (index: number, val: string) => {
    const next = [...originWarehouses];
    next[index] = val;
    onChange({
      ...specs,
      originWarehouses: next,
    });
    if (index === 0) {
      setOrigin(val);
    }
  };

  const addOrigin = () => {
    if (originWarehouses.length >= 5) return;
    const next = [...originWarehouses, ''];
    onChange({
      ...specs,
      originWarehouses: next,
    });
  };

  const removeOrigin = (index: number) => {
    if (originWarehouses.length <= 1) return;
    const next = originWarehouses.filter((_, i) => i !== index);
    onChange({
      ...specs,
      originWarehouses: next,
    });
    if (next[0] !== undefined) {
      setOrigin(next[0]);
    }
  };

  // Helper toggle for array fields
  const toggleArrayItem = (field: 'fleetRequirements' | 'keyKPIRequirements' | 'inboundVehicleTypes' | 'sortingRequirements', item: string) => {
    const list = (specs[field] as string[]) || [];
    const exists = list.includes(item);
    const updated = exists ? list.filter((i) => i !== item) : [...list, item];
    updateSpec(field, updated as any);
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
            Dịch Vụ Giải Pháp Dự Án & Chuỗi Cung Ứng (Logistics Solutions & Projects)
          </span>
          <p className="text-indigo-800/80 mt-0.5">
            Dành cho các gói thầu Phân phối mạng lưới (Distribution Network), Trạm trung chuyển chia chọn (Cross-Dock) và Vận tải Đa phương thức (Multimodal). Báo giá trọn gói và cam kết SLA/KPI theo hợp đồng.
          </p>
        </div>
      </div>

      {/* 1. Project Category Selection (3 Core Types) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
          <span>1. Phân Loại Mô Hình Dự Án Logistics (Project Category) *</span>
          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100/70 px-2 py-0.5 rounded-md">
            Hợp Đồng Dự Án / Đấu Thầu
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Option 1: Distribution */}
          <div
            onClick={() => updateSpec('projectCategory', 'DISTRIBUTION')}
            className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
              projectCategory === 'DISTRIBUTION'
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/25 font-bold text-indigo-950 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Store className="w-4 h-4 text-indigo-600" />
                <span>Phân Phối Tổng Thể (Distribution)</span>
              </span>
              {projectCategory === 'DISTRIBUTION' && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-normal leading-relaxed">
              Mạng lưới giao hàng đa điểm từ kho tổng/nhà máy tới đại lý, siêu thị, chuỗi cửa hàng bán lẻ toàn quốc.
            </p>
          </div>

          {/* Option 2: Cross-Docking */}
          <div
            onClick={() => updateSpec('projectCategory', 'CROSS_DOCK')}
            className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
              projectCategory === 'CROSS_DOCK'
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/25 font-bold text-indigo-950 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Split className="w-4 h-4 text-indigo-600" />
                <span>Trạm Cross-Docking (X-Dock)</span>
              </span>
              {projectCategory === 'CROSS_DOCK' && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-normal leading-relaxed">
              Hàng tập kết về trạm X-Dock, chia chọn phân loại theo đơn và giao ngay trong ngày. Không lưu kho (Zero-Storage).
            </p>
          </div>

          {/* Option 3: Multimodal */}
          <div
            onClick={() => updateSpec('projectCategory', 'MULTIMODAL')}
            className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
              projectCategory === 'MULTIMODAL'
                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/25 font-bold text-indigo-950 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>Đa Phương Thức (Multimodal)</span>
              </span>
              {projectCategory === 'MULTIMODAL' && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-normal leading-relaxed">
              Kết hợp 2 hoặc nhiều phương thức (Đường Biển + Bộ, Đường Sắt + Bộ, Sà Lan + Sắt, Air + Road).
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2A. SPECIFIC SECTION: DISTRIBUTION NETWORK PROJECT */}
      {/* ========================================================================= */}
      {projectCategory === 'DISTRIBUTION' && (
        <div className="space-y-3.5 p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
            <span className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4 text-indigo-600" />
              <span>Thông Số Dự Án Phân Phối Mạng Lưới (Distribution Specs)</span>
            </span>
            <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100/70 px-2 py-0.5 rounded border border-indigo-200">
              Nhóm hàng: {cargoClassification === 'Reefer' ? '❄️ Hàng Lạnh' : cargoClassification === 'Hazmat' ? '⚠️ Hàng Nguy Hiểm' : '📦 Hàng Thường'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kênh Phân Phối Mục Tiêu (Distribution Channel) *
              </label>
              <select
                value={specs.distributionChannel || 'B2B / Siêu thị (Modern Trade)'}
                onChange={(e) => updateSpec('distributionChannel', e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
              >
                <option value="B2B / Siêu thị (Modern Trade)">🏢 Chuỗi Siêu thị / TTTM (Modern Trade - MT)</option>
                <option value="Đại lý truyền thống (General Trade)">🏪 Hệ thống Nhà phân phối & Đại lý cấp 1 (General Trade - GT)</option>
                <option value="Chuỗi bán lẻ (Retail Chain)">🛍️ Chuỗi Cửa hàng Bán lẻ / Showroom / F&B (Retail Chain)</option>
                <option value="Phân phối Hỗn hợp Toàn diện">🌐 Phân phối Hỗn hợp Toàn diện (Omni-channel)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phạm Vi Địa Lý Phân Phối (Geographical Coverage) *
              </label>
              <select
                value={specs.coverageScope || 'Toàn quốc (Bắc - Trung - Nam)'}
                onChange={(e) => updateSpec('coverageScope', e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
              >
                <option value="Toàn quốc (Bắc - Trung - Nam)">🇻🇳 Mạng lưới Toàn Quốc (Bắc - Trung - Nam)</option>
                <option value="Miền Nam & ĐBSCL">🌴 Khu vực Miền Nam & Đồng Bằng Sông Cửu Long</option>
                <option value="Miền Bắc & Vệ tinh">🏙️ Khu vực Miền Bắc & Các tỉnh Vệ tinh</option>
                <option value="Miền Trung & Tây Nguyên">⛰️ Khu vực Miền Trung & Tây Nguyên</option>
              </select>
            </div>
          </div>

          {/* Origins / Central Distribution Centers (Multi-pickup) */}
          <div className="space-y-2 pt-1 border-t border-indigo-100/60">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>Danh Sách Kho Tổng / Nhà Máy Xuất Hàng Chính (Origin Hubs) *</span>
              </label>
              <span className="text-[10px] text-slate-500 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {originWarehouses.length} Kho Xuất
              </span>
            </div>

            {originWarehouses.map((loc, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{idx === 0 ? 'Kho Tổng / Nhà máy chính 1 *' : `Kho Tổng / Nhà máy vệ tinh ${idx + 1}`}</span>
                  </span>
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => removeOrigin(idx)}
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
                  onChange={(e) => handleOriginChange(idx, e.target.value)}
                  placeholder={idx === 0 ? "VD: Kho Tổng CDC Sóng Thần 1, Dĩ An, Bình Dương" : "VD: Nhà máy KCN Tiên Sơn, Bắc Ninh (Kho phía Bắc)"}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-medium shadow-2xs"
                />
              </div>
            ))}

            {originWarehouses.length < 5 && (
              <button
                type="button"
                onClick={addOrigin}
                className="w-full py-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-100/60 hover:bg-indigo-100 border border-indigo-200/80 border-dashed rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm Kho Tổng / Nhà Máy Xuất Hàng</span>
              </button>
            )}
          </div>

          {/* Fleet Structure Requirements (Bound to Cargo Classification) */}
          <div className="space-y-2 pt-1 border-t border-indigo-100/60">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Cơ Cấu Đội Xe Vận Tải Yêu Cầu Cho Dự Án (Chọn các loại xe cần thiết) *</span>
              </label>
              <span className="text-[10px] text-slate-500 font-normal">
                Theo nhóm: {cargoClassification === 'Reefer' ? 'Xe đông lạnh' : cargoClassification === 'Hazmat' ? 'Xe hóa chất DG' : 'Xe tải bách hóa'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeFleetItems.map((fleet) => {
                const isChecked = ((specs.fleetRequirements || []) as string[]).includes(fleet.label);
                return (
                  <div
                    key={fleet.id}
                    onClick={() => toggleArrayItem('fleetRequirements', fleet.label)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                      isChecked
                        ? 'border-indigo-500 bg-white ring-1 ring-indigo-500/30 font-bold text-indigo-950 shadow-2xs'
                        : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="leading-snug">{fleet.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Structured Volume & Frequency (Aligned with Road Trucking Pattern) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-indigo-100/60">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                1. Số Lượng Chuyến Cần Thuê *
              </label>
              <input
                type="number"
                min={1}
                required
                value={specs.tripCount ?? (specs.monthlyTripsOrVolume ? parseInt(specs.monthlyTripsOrVolume, 10) || 150 : 150)}
                onChange={(e) => {
                  const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                  updateSpec('tripCount', val);
                  updateSpec('monthlyTripsOrVolume', val ? `${val} ${specs.frequencyUnit || 'Tháng (Chuyến / Tháng)'}` : '');
                }}
                placeholder="VD: 150"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                2. Đơn Vị (Tần Suất Vận Chuyển) *
              </label>
              <select
                value={specs.frequencyUnit || 'Tháng (Chuyến / Tháng)'}
                onChange={(e) => {
                  updateSpec('frequencyUnit', e.target.value);
                  const count = specs.tripCount ?? 150;
                  updateSpec('monthlyTripsOrVolume', `${count} ${e.target.value}`);
                }}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
              >
                <option value="Tháng (Chuyến / Tháng)">📅 Tháng (Chuyến / Tháng)</option>
                <option value="Tuần (Chuyến / Tuần)">📅 Tuần (Chuyến / Tuần)</option>
                <option value="Ngày (Chuyến / Ngày)">📅 Ngày (Chuyến / Ngày)</option>
                <option value="Quý (Chuyến / Quý)">📅 Quý (Chuyến / Quý)</option>
                <option value="Năm (Chuyến / Năm)">📅 Năm (Chuyến / Năm)</option>
              </select>
            </div>
          </div>

          {/* Estimated Tender Budget & Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-indigo-100/60">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  Giá Trị Gói Thầu Dự Kiến (Estimated Tender Budget)
                </label>
                <span className="text-[10px] text-slate-400 font-normal">Tùy chọn</span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={specs.estimatedBudget || ''}
                    onChange={(e) => updateSpec('estimatedBudget', e.target.value)}
                    placeholder="VD: 500.000.000 / 2,500,000,000..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-mono font-bold text-slate-900 shadow-2xs placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>
                <select
                  value={specs.budgetCurrency || 'VND'}
                  onChange={(e) => updateSpec('budgetCurrency', e.target.value as any)}
                  className="w-24 px-2 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-500 cursor-pointer shadow-2xs"
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="CNY">CNY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Kế Hoạch Thời Gian Triển Khai (Expected Start Date)
              </label>
              <input
                type="text"
                value={specs.expectedStartDate || ''}
                onChange={(e) => updateSpec('expectedStartDate', e.target.value)}
                placeholder="VD: Bắt đầu từ đầu Quý tới / 01/10/2026..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-medium text-slate-900 shadow-2xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2B. SPECIFIC SECTION: CROSS-DOCKING (X-DOCK) PROJECT */}
      {/* ========================================================================= */}
      {projectCategory === 'CROSS_DOCK' && (
        <div className="space-y-3.5 p-4 bg-purple-50/40 border border-purple-100 rounded-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-purple-100 pb-2">
            <span className="text-xs font-extrabold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
              <Split className="w-4 h-4 text-purple-600" />
              <span>Thông Số Trạm Cross-Docking (Zero-Storage Specs)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-purple-200">
              Cross-Dock Operations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Khu Vực Đặt Trạm Trung Chuyển (X-Dock Hub Location) *
              </label>
              <input
                type="text"
                required
                value={specs.xDockHubLocation || origin || ''}
                onChange={(e) => {
                  updateSpec('xDockHubLocation', e.target.value);
                  setOrigin(e.target.value);
                }}
                placeholder="VD: Khu vực TP.HCM / Bình Dương (hoặc Hà Nội / Bắc Ninh)"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nhiệt Độ Sàn Xử Lý Tại Trạm Cross-Dock *
              </label>
              <select
                value={specs.xDockTemperature || 'Nhiệt độ thường (Ambient)'}
                onChange={(e) => updateSpec('xDockTemperature', e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
              >
                <option value="Nhiệt độ thường (Ambient)">📦 Nhiệt độ thường (Ambient - Hàng khô tiêu dùng / Gia dụng)</option>
                <option value="Kiểm soát mát (Chilled 15°C - 25°C)">❄️ Kiểm soát mát (Chilled 15°C - 25°C - Bánh kẹo, Mỹ phẩm, Thuốc)</option>
                <option value="Lạnh sâu (Cold 2°C - 8°C)">🧊 Sàn lạnh chuyên dụng (Cold 2°C - 8°C - Thực phẩm tươi sống / Sữa)</option>
              </select>
            </div>
          </div>

          {/* Inbound & Outbound Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-purple-100/60">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Sản Lượng Inbound Tập Kết Về X-Dock Hàng Ngày *
              </label>
              <input
                type="text"
                value={specs.inboundDailyVolume || ''}
                onChange={(e) => updateSpec('inboundDailyVolume', e.target.value)}
                placeholder="VD: 5 - 10 xe tải 15T / Container 40ft mỗi ngày"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-medium text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Khung Giờ Xe Inbound Cập Sàn X-Dock
              </label>
              <input
                type="text"
                value={specs.inboundOperatingHours || ''}
                onChange={(e) => updateSpec('inboundOperatingHours', e.target.value)}
                placeholder="VD: 04:00 - 08:00 Sáng hoặc 19:00 - 23:00 Tối"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-medium text-slate-900 shadow-2xs"
              />
            </div>
          </div>

          {/* Sorting & Outbound Delivery Flow */}
          <div className="space-y-2 pt-1 border-t border-purple-100/60">
            <label className="block text-xs font-bold text-slate-800">
              Yêu Cầu Thao Tác Chia Chọn Tại Sàn X-Dock (Chọn các khâu xử lý) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'sort-store', label: '🏷️ Phân loại chi tiết theo Mã Cửa Hàng / Mã Siêu Thị (Store Code)' },
                { id: 'sort-barcode', label: '📲 Quét mã vạch Barcode / QR Code từng kiện hàng' },
                { id: 'sort-label', label: '📝 Dán nhãn phụ / In tem phân tuyến vận chuyển' },
                { id: 'sort-pallet', label: '🪵 Đóng gộp Pallet / Thùng theo từng đơn hàng Outbound' },
              ].map((sort) => {
                const isChecked = ((specs.sortingRequirements || []) as string[]).includes(sort.label);
                return (
                  <div
                    key={sort.id}
                    onClick={() => toggleArrayItem('sortingRequirements', sort.label)}
                    className={`p-2 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                      isChecked
                        ? 'border-purple-500 bg-white ring-1 ring-purple-500/30 font-bold text-purple-950 shadow-2xs'
                        : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="rounded border-slate-300 text-purple-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{sort.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-purple-100/60">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Số Lượng Điểm Giao Hàng Outbound Từ X-Dock *
              </label>
              <input
                type="number"
                min={1}
                value={specs.outboundStoreCount ?? ''}
                onChange={(e) => updateSpec('outboundStoreCount', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                placeholder="VD: 50, 100, 200 điểm..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Thời Gian Giải Tỏa Khỏi Sàn (Max Turnaround Time) *
              </label>
              <select
                value={specs.outboundMaxTurnaroundTime || 'Trong vòng 4 - 8 Giờ'}
                onChange={(e) => updateSpec('outboundMaxTurnaroundTime', e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
              >
                <option value="Dưới 4 Giờ (Hỏa tốc liên tục)">⚡ Dưới 4 Giờ (Hỏa tốc liên tục / Không lưu sàn)</option>
                <option value="Trong vòng 4 - 8 Giờ">⏱️ Trong vòng 4 - 8 Giờ (Tiêu chuẩn ca làm việc)</option>
                <option value="Trong ngày (Same-day Delivery)">🚚 Trong ngày (Same-day Delivery - Giao trước 17:00)</option>
              </select>
            </div>
          </div>

          {/* Cross-Dock Budget & Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-purple-100/60">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  Giá Trị Gói Thầu Dự Kiến (Estimated Tender Budget)
                </label>
                <span className="text-[10px] text-slate-400 font-normal">Tùy chọn</span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={specs.estimatedBudget || ''}
                    onChange={(e) => updateSpec('estimatedBudget', e.target.value)}
                    placeholder="VD: 300.000.000 / 1,500,000,000..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-mono font-bold text-slate-900 shadow-2xs placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>
                <select
                  value={specs.budgetCurrency || 'VND'}
                  onChange={(e) => updateSpec('budgetCurrency', e.target.value as any)}
                  className="w-24 px-2 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-purple-500 cursor-pointer shadow-2xs"
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="CNY">CNY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Kế Hoạch Thời Gian Triển Khai (Expected Start Date)
              </label>
              <input
                type="text"
                value={specs.expectedStartDate || ''}
                onChange={(e) => updateSpec('expectedStartDate', e.target.value)}
                placeholder="VD: Bắt đầu từ đầu Quý tới / 01/10/2026..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-medium text-slate-900 shadow-2xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2C. SPECIFIC SECTION: MULTIMODAL LOGISTICS PROJECT */}
      {/* ========================================================================= */}
      {projectCategory === 'MULTIMODAL' && (
        <div className="space-y-3.5 p-4 bg-teal-50/40 border border-teal-100 rounded-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-teal-100 pb-2">
            <span className="text-xs font-extrabold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-teal-600" />
              <span>Thông Số Vận Tải Đa Phương Thức (Multimodal Routing)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-teal-200">
              Intermodal Freight
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mô Hình Kết Hợp Đa Phương Thức (Combination Model) *
            </label>
            <select
              value={specs.multimodalCombination || 'Đường Biển + Đường Bộ (Sea - Road Freight)'}
              onChange={(e) => updateSpec('multimodalCombination', e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-bold text-teal-950 cursor-pointer shadow-2xs"
            >
              <option value="Đường Biển + Đường Bộ (Sea - Road Freight)">
                🚢 + 🚚 Đường Biển + Đường Bộ (Sea - Road Freight: Cảng biển ↔ Rút ruột/Drayage ↔ Kho xưởng)
              </option>
              <option value="Đường Sắt + Đường Bộ (Rail - Road Freight)">
                🚆 + 🚚 Đường Sắt + Đường Bộ (Rail - Road Freight: Ga Sóng Thần ↔ Ga Yên Viên/Giáp Bát ↔ Last-mile)
              </option>
              <option value="Sà Lan Sông + Đường Sắt (Inland Barge - Rail)">
                🚢 + 🚆 Sà Lan Sông + Đường Sắt (Inland Barge - Rail: ĐBSCL ↔ Cảng sông ↔ Tàu hỏa Bắc Nam)
              </option>
              <option value="Hàng Không + Đường Bộ (Air - Road Express)">
                ✈️ + 🚚 Hàng Không + Đường Bộ (Air - Road Express: Sân bay trục chính ↔ Trucking hỏa tốc)
              </option>
              <option value="Đa phương thức Tùy chỉnh (Custom Multimodal)">
                🌐 Đa Phương Thức Tùy Chỉnh Theo Dự Án Riêng
              </option>
            </select>
          </div>

          {/* 3 Legs: First-mile -> Main-haul -> Last-mile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 border-t border-teal-100/60">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Chặng Đầu (First-Mile) *</span>
              </label>
              <input
                type="text"
                required
                value={specs.multimodalFirstMile || origin || ''}
                onChange={(e) => {
                  updateSpec('multimodalFirstMile', e.target.value);
                  setOrigin(e.target.value);
                }}
                placeholder="VD: Kho xưởng A ➔ Cảng Cát Lái (hoặc Ga Sóng Thần)"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Chặng Chính (Main-Haul) *</span>
              </label>
              <input
                type="text"
                required
                value={specs.multimodalMainHaul || ''}
                onChange={(e) => updateSpec('multimodalMainHaul', e.target.value)}
                placeholder="VD: Tuyến Tàu Biển Cát Lái ↔ Hải Phòng (hoặc Tàu Sắt)"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-medium shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Chặng Cuối (Last-Mile) *</span>
              </label>
              <input
                type="text"
                required
                value={specs.multimodalLastMile || destination || ''}
                onChange={(e) => {
                  updateSpec('multimodalLastMile', e.target.value);
                  setDestination(e.target.value);
                }}
                placeholder="VD: Cảng Hải Phòng ➔ KCN VSIP Bắc Ninh"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-medium shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-teal-100/60">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Quy Cách Vỏ Container / Phương Tiện *
              </label>
              <select
                value={specs.multimodalContainerType || 'Container 40ft High Cube (40HC)'}
                onChange={(e) => updateSpec('multimodalContainerType', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
              >
                <option value="Container 40ft High Cube (40HC)">📦 Container 40ft High Cube (40HC)</option>
                <option value="Container 20ft (20GP)">📦 Container 20ft Tiêu Chuẩn (20GP)</option>
                <option value="Container Lạnh 40RF (Reefer)">❄️ Container Lạnh 40RF (Reefer)</option>
                <option value="Toa xe / Thùng bạt kéo dài">🚛 Xe Tải Thùng Bạt / Toa Xe Ga</option>
                <option value="Hàng rời Breakbulk">🏗️ Hàng rời bách hóa (Breakbulk Cargo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Sản Lượng Cam Kết Hàng Tháng *
              </label>
              <input
                type="text"
                value={specs.multimodalMonthlyTeuOrVolume || ''}
                onChange={(e) => updateSpec('multimodalMonthlyTeuOrVolume', e.target.value)}
                placeholder="VD: 30 - 50 TEU / Tháng (hoặc 800 Tấn / Tháng)"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-bold text-slate-900 shadow-2xs"
              />
            </div>
          </div>

          {/* Multimodal Budget & Start Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-teal-100/60">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  Giá Trị Gói Thầu Dự Kiến (Estimated Tender Budget)
                </label>
                <span className="text-[10px] text-slate-400 font-normal">Tùy chọn</span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={specs.estimatedBudget || ''}
                    onChange={(e) => updateSpec('estimatedBudget', e.target.value)}
                    placeholder="VD: 800.000.000 / 3,000,000,000..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-mono font-bold text-slate-900 shadow-2xs placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>
                <select
                  value={specs.budgetCurrency || 'VND'}
                  onChange={(e) => updateSpec('budgetCurrency', e.target.value as any)}
                  className="w-24 px-2 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-teal-500 cursor-pointer shadow-2xs"
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="CNY">CNY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Kế Hoạch Thời Gian Triển Khai (Expected Start Date)
              </label>
              <input
                type="text"
                value={specs.expectedStartDate || ''}
                onChange={(e) => updateSpec('expectedStartDate', e.target.value)}
                placeholder="VD: Bắt đầu từ đầu Quý tới / 01/10/2026..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-medium text-slate-900 shadow-2xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
