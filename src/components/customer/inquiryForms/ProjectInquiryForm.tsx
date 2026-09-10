import React, { useMemo } from 'react';
import { Layers, MapPin, Building2, Zap, Globe, Truck, CheckSquare, Clock, ShieldCheck, FileText, ArrowRight, Plus, Trash2, Sparkles, Store, Boxes, Split, Calendar, Anchor, Ship } from 'lucide-react';
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
  { id: 'fleet-hazmat-light', label: '⚠️ Xe tải nhẹ DG 1.0T – 2.5T (Giao xưởng nội đô / Có giấy phép DG & PCCC)' },
  { id: 'fleet-hazmat-medium', label: '⚠️ Xe tải trung DG 3.5T – 8.0T (Tuyến vệ tinh liên tỉnh / KCN)' },
  { id: 'fleet-hazmat-heavy', label: '⚠️ Xe tải nặng DG 15.0T (3 chân) (Vận chuyển số lượng lớn giữa các tổng kho)' },
  { id: 'fleet-hazmat-cont', label: '⚠️ Đầu kéo Cont DG 20ft/40ft & Vận chuyển ISO Tank (Tiếp địa chống tĩnh điện)' },
  { id: 'fleet-hazmat-tanker', label: '⚠️ Xe bồn Xitéc chuyên dụng chở hóa chất lỏng (Chemical Tanker)' },
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
  const toggleArrayItem = (
    field: 'fleetRequirements' | 'keyKPIRequirements' | 'inboundVehicleTypes' | 'sortingRequirements' | 'targetRetailChains' | 'portIcdContainerTypes' | 'portIcdOperations',
    item: string
  ) => {
    const list = (specs[field] as string[]) || [];
    const exists = list.includes(item);
    const updated = exists ? list.filter((i) => i !== item) : [...list, item];
    updateSpec(field, updated as any);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Project Category Selection (4 Core Types) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Phân Loại Mô Hình Dự Án Logistics (Project Category) *</span>
          </label>
          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
            Hợp Đồng Dự Án / Đấu Thầu
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Option 1: Distribution */}
          <div
            onClick={() => updateSpec('projectCategory', 'DISTRIBUTION')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              projectCategory === 'DISTRIBUTION'
                ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Store className="w-4 h-4 text-indigo-600" />
                <span>Phân Phối (Distribution)</span>
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
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              projectCategory === 'CROSS_DOCK'
                ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Split className="w-4 h-4 text-indigo-600" />
                <span>Trạm Cross-Dock (X-Dock)</span>
              </span>
              {projectCategory === 'CROSS_DOCK' && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0"></span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-normal leading-relaxed">
              Gom hàng lẻ, chia chọn theo Store Code và giao ngay siêu thị trong ngày. Không lưu kho (Zero-Storage).
            </p>
          </div>

          {/* Option 3: Port & ICD Project */}
          <div
            onClick={() => updateSpec('projectCategory', 'PORT_ICD')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              projectCategory === 'PORT_ICD'
                ? 'border-sky-600 bg-sky-50/80 font-bold text-sky-950 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Anchor className="w-4 h-4 text-sky-600" />
                <span>Cảng / Cảng Cạn ICD</span>
              </span>
              {projectCategory === 'PORT_ICD' && <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0"></span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-normal leading-relaxed">
              Luân chuyển Cont Cảng ↔ ICD, vận chuyển sà lan, đóng/rút ruột cont bãi và quản lý bãi vỏ rỗng Depot.
            </p>
          </div>

          {/* Option 4: Multimodal */}
          <div
            onClick={() => updateSpec('projectCategory', 'MULTIMODAL')}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              projectCategory === 'MULTIMODAL'
                ? 'border-teal-600 bg-teal-50/80 font-bold text-teal-950 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-teal-600" />
                <span>Đa Phương Thức</span>
              </span>
              {projectCategory === 'MULTIMODAL' && <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0"></span>}
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
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-indigo-600" />
              <span>Kênh Phân Phối & Phạm Vi Địa Lý *</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Kênh Phân Phối Mục Tiêu (Distribution Channel) *
                </label>
                <select
                  value={specs.distributionChannel || 'B2B / Siêu thị (Modern Trade)'}
                  onChange={(e) => updateSpec('distributionChannel', e.target.value as any)}
                  className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="B2B / Siêu thị (Modern Trade)">🏢 Chuỗi Siêu thị / TTTM (Modern Trade - MT)</option>
                  <option value="Đại lý truyền thống (General Trade)">🏪 Hệ thống Nhà phân phối & Đại lý cấp 1 (General Trade - GT)</option>
                  <option value="Chuỗi bán lẻ (Retail Chain)">🛍️ Chuỗi Cửa hàng Bán lẻ / Showroom / F&B (Retail Chain)</option>
                  <option value="Phân phối Hỗn hợp Toàn diện">🌐 Phân phối Hỗn hợp Toàn diện (Omni-channel)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Phạm Vi Địa Lý Phân Phối (Geographical Coverage) *
                </label>
                <select
                  value={specs.coverageScope || 'Toàn quốc (Bắc - Trung - Nam)'}
                  onChange={(e) => updateSpec('coverageScope', e.target.value as any)}
                  className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="Toàn quốc (Bắc - Trung - Nam)">🇻🇳 Mạng lưới Toàn Quốc (Bắc - Trung - Nam)</option>
                  <option value="Miền Nam & ĐBSCL">🌴 Khu vực Miền Nam & Đồng Bằng Sông Cửu Long</option>
                  <option value="Miền Bắc & Vệ tinh">🏙️ Khu vực Miền Bắc & Các tỉnh Vệ tinh</option>
                  <option value="Miền Trung & Tây Nguyên">⛰️ Khu vực Miền Trung & Tây Nguyên</option>
                </select>
              </div>
            </div>
          </div>

          {/* Origins / Central Distribution Centers (Multi-pickup) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>Danh Sách Kho Tổng / Nhà Máy Xuất Hàng Chính (Origin Hubs) *</span>
              </label>
              <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
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
                  className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-medium text-slate-900 shadow-2xs placeholder:text-slate-400"
                />
              </div>
            ))}

            {originWarehouses.length < 5 && (
              <button
                type="button"
                onClick={addOrigin}
                className="w-full py-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 border-dashed rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm Kho Tổng / Nhà Máy Xuất Hàng</span>
              </button>
            )}
          </div>

          {/* Fleet Structure Requirements (Bound to Cargo Classification) */}
          <div className="space-y-1.5">
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
                        ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
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

          {/* Structured Volume & Frequency */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Sản Lượng & Tần Suất Vận Chuyển Dự Án *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Số Lượng Chuyến Cần Thuê *
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
                  className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Đơn Vị (Tần Suất Vận Chuyển) *
                </label>
                <select
                  value={specs.frequencyUnit || 'Tháng (Chuyến / Tháng)'}
                  onChange={(e) => {
                    updateSpec('frequencyUnit', e.target.value);
                    const count = specs.tripCount ?? 150;
                    updateSpec('monthlyTripsOrVolume', `${count} ${e.target.value}`);
                  }}
                  className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="Tháng (Chuyến / Tháng)">📅 Tháng (Chuyến / Tháng)</option>
                  <option value="Tuần (Chuyến / Tuần)">📅 Tuần (Chuyến / Tuần)</option>
                  <option value="Ngày (Chuyến / Ngày)">📅 Ngày (Chuyến / Ngày)</option>
                  <option value="Quý (Chuyến / Quý)">📅 Quý (Chuyến / Quý)</option>
                  <option value="Năm (Chuyến / Năm)">📅 Năm (Chuyến / Năm)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2B. SPECIFIC SECTION: CROSS-DOCKING (X-DOCK) & RETAIL LCL CONSOLIDATION */}
      {/* ========================================================================= */}
      {projectCategory === 'CROSS_DOCK' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* 1. Cross-Dock Scope (Nội Vùng vs Liên Vùng Tuyến Trục) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
              <Split className="w-3.5 h-3.5 text-indigo-600" />
              <span>Phạm Vi Luân Chuyển Mạng Lưới X-Dock (Cross-Dock Scope) *</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  value: 'Nội Vùng (Intra-region X-Dock)',
                  label: '🚚 X-Dock Nội Vùng (Intra-Region)',
                  desc: 'Gom hàng lẻ & giao ngay các chuỗi siêu thị/điểm bán trong cùng 1 miền/khu vực đô thị.',
                },
                {
                  value: 'Liên Vùng Tuyến Trục (Inter-region Linehaul)',
                  label: '🚢 X-Dock Liên Vùng (Hub-to-Hub Linehaul)',
                  desc: 'Gom tại Hub nguồn (Bình Dương/Hà Nội) ➔ Linehaul Biển/Bộ ➔ Chia chọn & Giao tại Hub đích (Đà Nẵng/Hải Phòng).',
                },
              ].map((scope) => {
                const isSelected = (specs.xDockScope || 'Nội Vùng (Intra-region X-Dock)') === scope.value;
                return (
                  <div
                    key={scope.value}
                    onClick={() => updateSpec('xDockScope', scope.value as any)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-2xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="radio"
                        checked={isSelected}
                        readOnly
                        className="text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="font-extrabold text-xs">{scope.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-5 leading-relaxed font-normal">{scope.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Hub Location(s) & Temperature */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Trạm Gom Hàng & Nhiệt Độ Sàn X-Dock *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Trạm Gom Hàng Nguồn *
                </label>
                <input
                  type="text"
                  required
                  value={specs.xDockHubLocation || origin || ''}
                  onChange={(e) => {
                    updateSpec('xDockHubLocation', e.target.value);
                    setOrigin(e.target.value);
                  }}
                  placeholder="VD: Điểm gom Bình Dương / TP.HCM / Bắc Ninh..."
                  className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 shadow-2xs placeholder:text-slate-400"
                />
              </div>

              {specs.xDockScope === 'Liên Vùng Tuyến Trục (Inter-region Linehaul)' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Trạm Phân Phối Đích *
                  </label>
                  <input
                    type="text"
                    required
                    value={specs.xDockDestinationHub || destination || ''}
                    onChange={(e) => {
                      updateSpec('xDockDestinationHub', e.target.value);
                      setDestination(e.target.value);
                    }}
                    placeholder="VD: Hub Đà Nẵng / Hub Hà Nội / Hải Phòng..."
                    className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 shadow-2xs placeholder:text-slate-400"
                  />
                </div>
              )}

              <div className={specs.xDockScope === 'Liên Vùng Tuyến Trục (Inter-region Linehaul)' ? '' : 'md:col-span-2'}>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nhiệt Độ Sàn Xử Lý Tại Trạm Cross-Dock *
                </label>
                <select
                  value={specs.xDockTemperature || 'Nhiệt độ thường (Ambient)'}
                  onChange={(e) => updateSpec('xDockTemperature', e.target.value as any)}
                  className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="Nhiệt độ thường (Ambient)">📦 Nhiệt độ thường (Ambient - FMCG / Gia dụng)</option>
                  <option value="Kiểm soát mát (Chilled 15°C - 25°C)">❄️ Kiểm soát mát (Chilled 15°C - 25°C - Mỹ phẩm, Dược phẩm)</option>
                  <option value="Lạnh sâu (Cold 2°C - 8°C)">🧊 Sàn lạnh chuyên dụng (Cold 2°C - 8°C - Thực phẩm tươi)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Inbound Volume & Pricing Metric Unit */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Sản Lượng & Đơn Vị Tính Cước Inbound *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Sản Lượng Gom Inbound Dự Kiến *
                </label>
                <input
                  type="text"
                  value={specs.xDockInboundVolume || specs.inboundDailyVolume || ''}
                  onChange={(e) => {
                    updateSpec('xDockInboundVolume', e.target.value);
                    updateSpec('inboundDailyVolume', e.target.value);
                  }}
                  placeholder="VD: 5.000, 120, 80..."
                  className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 shadow-2xs placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Đơn Vị Tính Cước Kỳ Vọng *
                </label>
                <select
                  value={specs.xDockPricingMetric || 'VND / kg'}
                  onChange={(e) => updateSpec('xDockPricingMetric', e.target.value as any)}
                  className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="VND / kg">⚖️ VND / kg (Theo khối lượng hàng nặng)</option>
                  <option value="VND / CBM (m³)">📦 VND / CBM m³ (Theo thể tích cồng kềnh)</option>
                  <option value="VND / Pallet">🪵 VND / Pallet (Theo vị trí Pallet chuẩn)</option>
                  <option value="VND / Kiện (Carton)">🛍️ VND / Kiện (Carton - Thùng chia lẻ)</option>
                  <option value="VND / Chuyến xe Inbound">🚚 VND / Chuyến xe Inbound (Nguyên xe gom)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tần Suất Gom Hàng Inbound *
                </label>
                <select
                  value={specs.xDockInboundFrequencyUnit || 'Ngày (Hàng ngày)'}
                  onChange={(e) => updateSpec('xDockInboundFrequencyUnit', e.target.value)}
                  className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="Ngày (Hàng ngày)">📅 Hàng ngày (Daily Inbound)</option>
                  <option value="Tuần (Hàng tuần)">📅 Hàng tuần (Weekly Inbound)</option>
                  <option value="Tháng (Hàng tháng)">📅 Hàng tháng (Monthly Inbound)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Target Retail Chains / Outbound Scope */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Chuỗi Siêu Thị / Tổng Kho DC Đích Phân Phối Outbound *
              </label>
              <span className="text-[11px] text-indigo-700 font-semibold">Chọn các kênh phân phối của bạn</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                { id: 'chain-go', label: '🔴 GO! / Big C (Central Retail)' },
                { id: 'chain-winmart', label: '🔴 WinMart / WinMart+ (Masan Group)' },
                { id: 'chain-aeon', label: '🟣 AEON Mall / AEON Citimart' },
                { id: 'chain-coop', label: '🔴 Saigon Co.op (Co.opmart / Co.op Food)' },
                { id: 'chain-bhx', label: '🟢 Bách Hóa Xanh (MWG)' },
                { id: 'chain-lotte-mm', label: '🔵 Lotte Mart / MM Mega Market' },
                { id: 'chain-custom', label: '🏪 Danh Sách Cửa Hàng / Đại Lý Riêng Của Nhãn Hàng' },
              ].map((chain) => {
                const isChecked = ((specs.targetRetailChains || []) as string[]).includes(chain.label);
                return (
                  <div
                    key={chain.id}
                    onClick={() => toggleArrayItem('targetRetailChains', chain.label)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="truncate">{chain.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Sorting & Value-Added Services at X-Dock */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Yêu Cầu Thao Tác Chia Chọn & Nghiệp Vụ Siêu Thị Tại Sàn X-Dock (Chọn các khâu) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'sort-store', label: '🏷️ Phân loại chi tiết theo Mã Siêu Thị / Cửa Hàng (Store Code)' },
                { id: 'sort-barcode', label: '📲 Quét mã vạch Barcode / QR Code từng kiện hàng' },
                { id: 'sort-label', label: '📝 Dán nhãn phụ / In tem phân tuyến vận chuyển' },
                { id: 'sort-pallet', label: '🪵 Đóng gộp Pallet & Quấn màng PE theo đơn Outbound' },
                { id: 'sort-slot', label: '⏱️ Đặt lịch hẹn giao Booking Slot theo chuẩn siêu thị' },
                { id: 'sort-pod', label: '📑 Thu hồi biên bản giao nhận POD gốc & Hóa đơn GTGT' },
              ].map((sort) => {
                const isChecked = ((specs.sortingRequirements || []) as string[]).includes(sort.label);
                return (
                  <div
                    key={sort.id}
                    onClick={() => toggleArrayItem('sortingRequirements', sort.label)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{sort.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. Turnaround Time & Operating Hours */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Thời Gian Giải Tỏa & Khung Giờ Hoạt Động *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Thời Gian Giải Tỏa Khỏi Sàn (Max Turnaround Time) *
                </label>
                <select
                  value={specs.outboundMaxTurnaroundTime || 'Trong vòng 4 - 8 Giờ'}
                  onChange={(e) => updateSpec('outboundMaxTurnaroundTime', e.target.value)}
                  className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="Dưới 4 Giờ (Hỏa tốc liên tục)">⚡ Dưới 4 Giờ (Hỏa tốc liên tục / Không lưu sàn)</option>
                  <option value="Trong vòng 4 - 8 Giờ">⏱️ Trong vòng 4 - 8 Giờ (Tiêu chuẩn ca làm việc)</option>
                  <option value="Trong ngày (Same-day Delivery)">🚚 Trong ngày (Same-day Delivery - Giao trước 17:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Khung Giờ Xe Inbound Cập Sàn X-Dock
                </label>
                <input
                  type="text"
                  value={specs.inboundOperatingHours || ''}
                  onChange={(e) => updateSpec('inboundOperatingHours', e.target.value)}
                  placeholder="VD: 04:00 - 08:00 Sáng hoặc 19:00 - 23:00 Tối"
                  className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-indigo-500 font-medium text-slate-900 shadow-2xs placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2C. SPECIFIC SECTION: PORT & ICD LOGISTICS PROJECT */}
      {/* ========================================================================= */}
      {projectCategory === 'PORT_ICD' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* 1. Origin Port & Destination ICD */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Anchor className="w-3.5 h-3.5 text-sky-600" />
              <span>Cảng Gốc & Cảng Cạn ICD Đích *</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Cảng Biển / Cảng Gốc (Origin Seaport / Terminal) *
                </label>
                <input
                  type="text"
                  required
                  value={specs.portIcdOriginPort || origin || ''}
                  onChange={(e) => {
                    updateSpec('portIcdOriginPort', e.target.value);
                    setOrigin(e.target.value);
                  }}
                  placeholder="VD: Cảng Quốc Tế Cái Mép (CMIT / TCIT) / Cát Lái / Lạch Huyện..."
                  className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-sky-500 font-bold text-slate-900 shadow-2xs placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Cảng Cạn ICD / Depot Vệ Tinh Đích (Destination ICD / Depot) *
                </label>
                <input
                  type="text"
                  required
                  value={specs.portIcdDestinationIcd || destination || ''}
                  onChange={(e) => {
                    updateSpec('portIcdDestinationIcd', e.target.value);
                    setDestination(e.target.value);
                  }}
                  placeholder="VD: ICD Sóng Thần / Tân Cảng Long Bình / ICD Tiên Sơn..."
                  className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-sky-500 font-bold text-slate-900 shadow-2xs placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* 2. Shuttle Mode & Monthly Tender Volume */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Hình Thức Luân Chuyển & Sản Lượng Container *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Hình Thức Luân Chuyển Shuttling Cảng ↔ ICD *
                </label>
                <select
                  value={specs.portIcdShuttleMode || 'Đầu kéo Sơ-mi Rơ-moóc chuyên tuyến (Dedicated Drayage)'}
                  onChange={(e) => updateSpec('portIcdShuttleMode', e.target.value as any)}
                  className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-sky-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="Đầu kéo Sơ-mi Rơ-moóc chuyên tuyến (Dedicated Drayage)">🚛 Đầu kéo Sơ-mi Rơ-moóc chuyên tuyến (Dedicated Drayage)</option>
                  <option value="Sà lan sông kết nối Cảng - ICD (Inland Barge)">🚢 Sà lan sông kết nối Cảng - ICD (Inland Barge 72 - 128 TEU)</option>
                  <option value="Kết hợp Sà Lan + Đầu kéo (Barge - Road Hybrid)">🔄 Kết hợp Sà Lan + Đầu kéo (Barge - Road Hybrid Shuttle)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Sản Lượng Container Cam Kết Trong Gói Thầu *
                </label>
                <input
                  type="text"
                  value={specs.portIcdMonthlyTeuOrVolume || ''}
                  onChange={(e) => updateSpec('portIcdMonthlyTeuOrVolume', e.target.value)}
                  placeholder="VD: 500 - 1.000 TEU / Tháng (hoặc 30 - 50 Cont / Ngày)"
                  className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-sky-500 font-bold text-slate-900 shadow-2xs placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* 3. Container Types */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Quy Cách & Chủng Loại Container Cần Khai Thác (Chọn các loại) *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cont-20gp', label: '📦 Container 20ft GP (Thường)' },
                { id: 'cont-40hc', label: '📦 Container 40ft GP / 40HC' },
                { id: 'cont-reefer', label: '❄️ Container Lạnh 40RF / 20RF' },
                { id: 'cont-oog', label: '🏗️ Flatrack / Open Top / ISO Tank' },
              ].map((cType) => {
                const isChecked = ((specs.portIcdContainerTypes || []) as string[]).includes(cType.label);
                return (
                  <div
                    key={cType.id}
                    onClick={() => toggleArrayItem('portIcdContainerTypes', cType.label)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                      isChecked
                        ? 'border-sky-600 bg-sky-50/80 font-bold text-sky-950 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="rounded border-slate-300 text-sky-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="truncate">{cType.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Yard & Terminal Operations / Scope */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Gói Nghiệp Vụ Bãi & Khai Thác Tại Cảng / ICD (Chọn các khâu thực hiện) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'op-lolo', label: '🏗️ Nâng hạ Container tại Cảng & ICD (LoLo Lift On / Off)' },
                { id: 'op-stuffing', label: '📦 Đóng hàng (Stuffing) / Rút ruột (Unstuffing) tại bãi ICD' },
                { id: 'op-empty', label: '🔄 Quản lý bãi vỏ rỗng & Cấp phát vỏ (Empty Depot)' },
                { id: 'op-mr', label: '🛠️ Giám định, Vệ sinh & Sửa chữa vỏ container (M&R)' },
                { id: 'op-reefer', label: '❄️ Bãi cắm điện & Giám sát nhiệt độ Cont lạnh 24/7 (PTI)' },
                { id: 'op-olt', label: '📑 Thủ tục chuyển cửa khẩu OLT & Vận chuyển Cảng - ICD' },
              ].map((op) => {
                const isChecked = ((specs.portIcdOperations || []) as string[]).includes(op.label);
                return (
                  <div
                    key={op.id}
                    onClick={() => toggleArrayItem('portIcdOperations', op.label)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                      isChecked
                        ? 'border-sky-600 bg-sky-50/80 font-bold text-sky-950 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="rounded border-slate-300 text-sky-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{op.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2D. SPECIFIC SECTION: MULTIMODAL LOGISTICS PROJECT */}
      {/* ========================================================================= */}
      {projectCategory === 'MULTIMODAL' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span>Mô Hình Kết Hợp Đa Phương Thức (Combination Model) *</span>
            </label>
            <select
              value={specs.multimodalCombination || 'Đường Biển + Đường Bộ (Sea - Road Freight)'}
              onChange={(e) => updateSpec('multimodalCombination', e.target.value as any)}
              className="w-full h-10 px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-bold text-teal-950 cursor-pointer shadow-2xs"
            >
              <option value="Đường Biển + Đường Bộ (Sea - Road Freight)">
                🚢 + 🚚 Đường Biển + Đường Bộ (Sea - Road: Cảng biển ↔ Drayage ↔ Kho xưởng)
              </option>
              <option value="Đường Sắt + Đường Bộ (Rail - Road Freight)">
                🚆 + 🚚 Đường Sắt + Đường Bộ (Rail - Road: Ga Sóng Thần ↔ Ga Giáp Bát ↔ Last-mile)
              </option>
              <option value="Sà Lan Sông + Đường Sắt (Inland Barge - Rail)">
                🚢 + 🚆 Sà Lan Sông + Đường Sắt (Inland Barge - Rail: ĐBSCL ↔ Cảng sông ↔ Tàu hỏa)
              </option>
              <option value="Hàng Không + Đường Bộ (Air - Road Express)">
                ✈️ + 🚚 Hàng Không + Đường Bộ (Air - Road Express: Sân bay ↔ Trucking hỏa tốc)
              </option>
              <option value="Đa phương thức Tùy chỉnh (Custom Multimodal)">
                🌐 Đa Phương Thức Tùy Chỉnh Theo Dự Án Riêng
              </option>
            </select>
          </div>

          {/* 3 Legs: First-mile -> Main-haul -> Last-mile */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Hành Trình 3 Chặng Đa Phương Thức *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
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
                  placeholder="VD: Kho xưởng A ➔ Cảng Cát Lái"
                  className="w-full h-10 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-medium text-slate-900 shadow-2xs placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Chặng Chính (Main-Haul) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={specs.multimodalMainHaul || ''}
                  onChange={(e) => updateSpec('multimodalMainHaul', e.target.value)}
                  placeholder="VD: Tàu Biển Cát Lái ↔ Hải Phòng"
                  className="w-full h-10 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-medium text-slate-900 shadow-2xs placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
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
                  placeholder="VD: Cảng Hải Phòng ➔ KCN VSIP"
                  className="w-full h-10 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-medium text-slate-900 shadow-2xs placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Quy Cách & Sản Lượng Cam Kết *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Quy Cách Vỏ Container / Phương Tiện *
                </label>
                <select
                  value={specs.multimodalContainerType || 'Container 40ft High Cube (40HC)'}
                  onChange={(e) => updateSpec('multimodalContainerType', e.target.value)}
                  className="w-full h-10 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="Container 40ft High Cube (40HC)">📦 Container 40ft High Cube (40HC)</option>
                  <option value="Container 20ft (20GP)">📦 Container 20ft Tiêu Chuẩn (20GP)</option>
                  <option value="Container Lạnh 40RF (Reefer)">❄️ Container Lạnh 40RF (Reefer)</option>
                  <option value="Toa xe / Thùng bạt kéo dài">🚛 Xe Tải Thùng Bạt / Toa Xe Ga</option>
                  <option value="Hàng rời Breakbulk">🏗️ Hàng rời bách hóa (Breakbulk Cargo)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Sản Lượng Cam Kết Hàng Tháng *
                </label>
                <input
                  type="text"
                  value={specs.multimodalMonthlyTeuOrVolume || ''}
                  onChange={(e) => updateSpec('multimodalMonthlyTeuOrVolume', e.target.value)}
                  placeholder="VD: 30 - 50 TEU / Tháng (hoặc 800 Tấn / Tháng)"
                  className="w-full h-10 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-teal-500 font-bold text-slate-900 shadow-2xs placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
