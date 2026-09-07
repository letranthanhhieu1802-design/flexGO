import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Ship, 
  FileText, 
  Save, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Check,
  Anchor,
  ShieldCheck,
  DollarSign
} from 'lucide-react';
import { CapabilityRouteItem } from './SupplierServiceCapabilityModal';

export interface LOVItem {
  id: string;
  name: string;
  unit: string;
  defaultPrice?: number;
  description?: string;
}

// ==========================================
// 1. CONTAINER TYPES LOV BY CARGO GROUP
// ==========================================
export const OCEAN_FCL_GENERAL_CONTAINER_TYPES_LOV = [
  '20ft General (20DC) —— (33 CBM / 28.2 Tấn)',
  '40ft General (40DC) —— (67 CBM / 28.5 Tấn)',
  '40ft High Cube (40HC) —— (76 CBM / 28.5 Tấn)',
  '45ft High Cube (45HC) —— (86 CBM / 29.0 Tấn)',
  'Open Top 20OT / 40OT (Cẩu hàng từ trên nóc)',
  'Flat Rack 20FR / 40FR (Hàng quá khổ siêu trường)',
  'Bồn ISO Tank (T11/T75 chất lỏng tiêu chuẩn)',
];

export const OCEAN_FCL_REEFER_CONTAINER_TYPES_LOV = [
  '20ft Reefer (20RF Lạnh) —— (28 CBM / -25°C ~ +15°C)',
  '40ft High Cube Reefer (40HR/40RH Lạnh) —— (67 CBM / -25°C ~ +15°C)',
];

export const OCEAN_FCL_HAZMAT_CONTAINER_TYPES_LOV = [
  'Cont 20ft DG IMO (Chuyên chở hóa chất đóng phuy/IBC)',
  'Cont 40ft DG IMO (Chuyên chở hóa chất đóng kiện/pallet)',
  'Bồn ISO Tank Hóa Chất (T11/T50/T75 áp lực cao)',
];

// ==========================================
// 2. SURCHARGES LOV (PHỤ PHÍ HÃNG TÀU & CẢNG BIỂN)
// ==========================================
export const OCEAN_FCL_GENERAL_SURCHARGES_LOV: LOVItem[] = [
  { id: 'thc_pol', name: 'Phí xếp dỡ tại cảng bốc (THC POL)', unit: 'USD / Cont', defaultPrice: 120 },
  { id: 'thc_pod', name: 'Phí xếp dỡ tại cảng dỡ (THC POD)', unit: 'USD / Cont', defaultPrice: 150 },
  { id: 'bl_fee', name: 'Phí phát hành vận đơn (B/L Fee)', unit: 'USD / Set', defaultPrice: 40 },
  { id: 'seal_fee', name: 'Phí chì niêm phong Container (Seal Fee)', unit: 'USD / Cont', defaultPrice: 10 },
  { id: 'ams_isf', name: 'Khai báo an ninh AMS/ISF (Mỹ) / AFR (Nhật)', unit: 'USD / BL', defaultPrice: 35 },
  { id: 'baf_lss', name: 'Phụ phí nhiên liệu xanh BAF / LSS', unit: 'USD / Cont', defaultPrice: 65 },
  { id: 'cleaning_fee', name: 'Phí vệ sinh container (Cleaning Fee)', unit: 'USD / Cont', defaultPrice: 25 },
  { id: 'vgm_manifest', name: 'Phí truyền dữ liệu điện tử VGM & Manifest', unit: 'USD / BL', defaultPrice: 15 },
  { id: 'pss', name: 'Phụ phí cao điểm mùa vụ (Peak Season Surcharge)', unit: 'USD / Cont', defaultPrice: 150 },
  { id: 'telex_release', name: 'Phí điện giao hàng (Telex Release Fee)', unit: 'USD / Set', defaultPrice: 30 },
  { id: 'chassis_split', name: 'Phụ phí kéo vỏ Cont & Hạ bãi chờ kiểm hóa', unit: 'USD / Cont', defaultPrice: 80 },
];

export const OCEAN_FCL_REEFER_SURCHARGES_LOV: LOVItem[] = [
  { id: 'thc_pol', name: 'Phí xếp dỡ tại cảng bốc (THC POL)', unit: 'USD / Cont', defaultPrice: 140 },
  { id: 'thc_pod', name: 'Phí xếp dỡ tại cảng dỡ (THC POD)', unit: 'USD / Cont', defaultPrice: 180 },
  { id: 'bl_fee', name: 'Phí chứng từ vận đơn (B/L Fee)', unit: 'USD / Set', defaultPrice: 40 },
  { id: 'seal_fee', name: 'Phí chì an ninh niêm phong cont lạnh', unit: 'USD / Cont', defaultPrice: 10 },
  { id: 'reefer_plug', name: 'Phí cắm điện duy trì bãi cảng Reefer Plug', unit: 'USD / Ngày', defaultPrice: 65 },
  { id: 'pti_test', name: 'Phí kiểm tra kỹ thuật giàn lạnh (PTI Test Fee)', unit: 'USD / Cont', defaultPrice: 50 },
  { id: 'clean_reefer', name: 'Phí tẩy rửa & Khử trùng vỏ cont lạnh', unit: 'USD / Cont', defaultPrice: 35 },
  { id: 'baf_lss', name: 'Phụ phí nhiên liệu tàu & máy lạnh (BAF/LSS)', unit: 'USD / Cont', defaultPrice: 80 },
  { id: 'vgm_manifest', name: 'Phí truyền dữ liệu điện tử VGM & Manifest', unit: 'USD / BL', defaultPrice: 15 },
  { id: 'ams_isf', name: 'Khai báo an ninh AMS/ISF (Mỹ) / AFR (Nhật)', unit: 'USD / BL', defaultPrice: 35 },
  { id: 'pss', name: 'Phụ phí cao điểm mùa vụ nông thủy sản', unit: 'USD / Cont', defaultPrice: 200 },
];

export const OCEAN_FCL_HAZMAT_SURCHARGES_LOV: LOVItem[] = [
  { id: 'thc_pol', name: 'Phí THC bãi cảng hàng nguy hiểm POL', unit: 'USD / Cont', defaultPrice: 160 },
  { id: 'thc_pod', name: 'Phí THC bãi cảng hàng nguy hiểm POD', unit: 'USD / Cont', defaultPrice: 200 },
  { id: 'dg_surcharge', name: 'Phụ phí hàng nguy hiểm DG Surcharge', unit: 'USD / Cont', defaultPrice: 150 },
  { id: 'bl_fee', name: 'Phí chứng từ & Quản lý hồ sơ hóa chất Dangerous', unit: 'USD / Set', defaultPrice: 45 },
  { id: 'seal_fee', name: 'Phí kẹp chì niêm phong an toàn hóa chất', unit: 'USD / Cont', defaultPrice: 10 },
  { id: 'port_security', name: 'Phí giám sát an toàn cảng vụ & PCCC tại bãi', unit: 'USD / Cont', defaultPrice: 45 },
  { id: 'msds_audit', name: 'Phí thẩm định & Phê duyệt bảng an toàn MSDS', unit: 'USD / Lô', defaultPrice: 50 },
  { id: 'baf_lss', name: 'Phụ phí nhiên liệu xanh BAF / LSS', unit: 'USD / Cont', defaultPrice: 70 },
  { id: 'vgm_manifest', name: 'Phí truyền dữ liệu điện tử VGM & DG Manifest', unit: 'USD / BL', defaultPrice: 20 },
  { id: 'ams_isf', name: 'Khai báo an ninh AMS/ISF (Mỹ) / AFR (Nhật)', unit: 'USD / BL', defaultPrice: 35 },
];

// ==========================================
// 3. VAS LOV (DỊCH VỤ GIÁ TRỊ GIA TĂNG)
// ==========================================
export const OCEAN_FCL_GENERAL_VAS_LOV: LOVItem[] = [
  { id: 'vas_free_dem_det', name: 'Chính sách Free Demurrage & Detention (14-21 ngày)', unit: 'USD / Cont', defaultPrice: 0 },
  { id: 'vas_ebl', name: 'Phát hành vận đơn điện tử e-BL / Seaway Bill', unit: 'USD / Set', defaultPrice: 0 },
  { id: 'vas_lashing', name: 'Lashing chằng buộc gia cố hàng trong container', unit: 'USD / Cont', defaultPrice: 80 },
  { id: 'vas_marine_insurance', name: 'Bảo hiểm hàng hải quốc tế All-Risks (Loại A)', unit: 'USD / Lô', defaultPrice: 60 },
  { id: 'vas_fumigation', name: 'Hun trùng kiểm dịch gỗ ISPM 15 & Cấp chứng thư', unit: 'USD / Cont', defaultPrice: 35 },
  { id: 'vas_customs', name: 'Thủ tục thông quan hải quan trọn gói tại cảng', unit: 'USD / Tờ khai', defaultPrice: 40 },
  { id: 'vas_origin_cert', name: 'Thủ tục xin cấp chứng nhận xuất xứ C/O (Form A, B, D, E, AK...)', unit: 'USD / Bộ', defaultPrice: 45 },
  { id: 'vas_tracking', name: 'Dịch vụ GPS Container Tracking & Cập nhật mốc tàu tự động', unit: 'USD / Cont', defaultPrice: 0 },
];

export const OCEAN_FCL_REEFER_VAS_LOV: LOVItem[] = [
  { id: 'vas_data_logger', name: 'Thiết bị Data Logger theo dõi nhiệt độ & độ ẩm 24/7', unit: 'USD / Cont', defaultPrice: 0 },
  { id: 'vas_pre_cooling', name: 'Làm lạnh buồng cont trước khi đóng hàng (Pre-cooling)', unit: 'USD / Cont', defaultPrice: 0 },
  { id: 'vas_free_dem_det', name: 'Gia hạn Free Dem/Det lạnh tại cảng đến (7-14 ngày)', unit: 'USD / Cont', defaultPrice: 0 },
  { id: 'vas_ebl', name: 'Phát hành vận đơn điện tử e-BL / Telex Release', unit: 'USD / Set', defaultPrice: 0 },
  { id: 'vas_cold_insurance', name: 'Bảo hiểm đứt gãy chuỗi lạnh hàng hải 100%', unit: 'USD / Cont', defaultPrice: 75 },
  { id: 'vas_phyto', name: 'Kiểm dịch thực vật / Động vật xuất khẩu tại cảng', unit: 'USD / Lô', defaultPrice: 50 },
  { id: 'vas_plug_247', name: 'Cắm điện bãi cảng Reefer Plug 24/7 & Giám sát nhiệt', unit: 'USD / Ngày', defaultPrice: 65 },
  { id: 'vas_cold_customs', name: 'Thông quan hải quan luồng xanh hàng lạnh ưu tiên', unit: 'USD / Tờ khai', defaultPrice: 40 },
];

export const OCEAN_FCL_HAZMAT_VAS_LOV: LOVItem[] = [
  { id: 'vas_msds_approval', name: 'Duyệt bảng dữ liệu an toàn MSDS với DG Hãng tàu', unit: 'USD / Lô', defaultPrice: 0 },
  { id: 'vas_imo_placard', name: 'Dán tem nhãn cảnh báo Placard IMO 4 mặt quanh cont', unit: 'USD / Cont', defaultPrice: 0 },
  { id: 'vas_dg_lashing', name: 'Chằng buộc lashing chuyên dụng chống va đập phuy/IBC Tank', unit: 'USD / Cont', defaultPrice: 100 },
  { id: 'vas_imdg_decl', name: 'Khai báo an toàn hàng hải nguy hiểm (IMDG Code)', unit: 'USD / Lô', defaultPrice: 45 },
  { id: 'vas_dg_insurance', name: 'Bảo hiểm trách nhiệm môi trường & Rủi ro hóa chất', unit: 'USD / Cont', defaultPrice: 90 },
  { id: 'vas_free_dem_det', name: 'Hỗ trợ Free Demurrage bãi cont nguy hiểm (7-10 ngày)', unit: 'USD / Cont', defaultPrice: 0 },
  { id: 'vas_dg_customs', name: 'Thủ tục kiểm tra chuyên ngành hóa chất & Thông quan cảng', unit: 'USD / Tờ khai', defaultPrice: 55 },
];

export interface MatrixActiveItem {
  id: string;
  value: number;
}

export interface ContainerPricingMatrixColumn {
  id: string;
  containerType: string;
  customContainerType?: string;
  baseOceanFreight: number; // Cước biển cơ bản (OF) tính bằng USD
  activeSurcharges: MatrixActiveItem[];
  totalPrice: number;
  activeVas: MatrixActiveItem[];
  departureSchedule: string; // Lịch tàu chạy (VD: Thứ 4, Thứ 7 hàng tuần)
  transitType: 'Direct' | 'Transit'; // Direct hoặc Transit
  transitTimeDisplay: string; // Thời gian hành trình (VD: 28 - 32 Ngày)
  freeDemDetDays: number; // Số ngày Free Dem/Det
  validUntil: string;
  notes?: string;
}

export const calculateContainerColumnTotalPrice = (col: Partial<ContainerPricingMatrixColumn>): number => {
  const base = Number(col.baseOceanFreight) || 0;
  const surchargesSum = (col.activeSurcharges || []).reduce((acc, item) => acc + (Number(item.value) || 0), 0);
  return base + surchargesSum;
};

export const createDefaultContainerPricingColumn = (
  containerType?: string,
  basePrice?: number,
  cargoType?: 'general' | 'reefer' | 'hazmat',
  defaultSchedule?: string,
  defaultTransitType?: 'Direct' | 'Transit',
  defaultTransitTime?: string,
  defaultFreeDemDetDays?: number
): ContainerPricingMatrixColumn => {
  const contLov = cargoType === 'reefer'
    ? OCEAN_FCL_REEFER_CONTAINER_TYPES_LOV
    : cargoType === 'hazmat'
    ? OCEAN_FCL_HAZMAT_CONTAINER_TYPES_LOV
    : OCEAN_FCL_GENERAL_CONTAINER_TYPES_LOV;

  const chosenType = containerType && contLov.includes(containerType)
    ? containerType
    : contLov[0];

  const targetTotal = basePrice && basePrice > 0 
    ? basePrice 
    : (cargoType === 'reefer' ? 1850 : cargoType === 'hazmat' ? 2450 : 1450);

  const thcVal = cargoType === 'reefer' ? 140 : cargoType === 'hazmat' ? 160 : 120;
  const blVal = 40;
  const sealVal = 10;
  const bafVal = 65;
  const surchargesSum = thcVal + blVal + sealVal + bafVal;
  const base = targetTotal > surchargesSum ? targetTotal - surchargesSum : targetTotal;

  const defaultSurcharges: MatrixActiveItem[] = cargoType === 'reefer'
    ? [
        { id: 'thc_pol', value: 140 },
        { id: 'bl_fee', value: 40 },
        { id: 'seal_fee', value: 10 },
        { id: 'baf_lss', value: 80 },
        { id: 'reefer_plug', value: 65 },
      ]
    : cargoType === 'hazmat'
    ? [
        { id: 'thc_pol', value: 160 },
        { id: 'dg_surcharge', value: 150 },
        { id: 'bl_fee', value: 45 },
        { id: 'seal_fee', value: 10 },
        { id: 'port_security', value: 45 },
      ]
    : [
        { id: 'thc_pol', value: thcVal },
        { id: 'bl_fee', value: blVal },
        { id: 'seal_fee', value: sealVal },
        { id: 'baf_lss', value: bafVal },
      ];

  const defaultVas: MatrixActiveItem[] = cargoType === 'reefer'
    ? [
        { id: 'vas_data_logger', value: 0 },
        { id: 'vas_pre_cooling', value: 0 },
        { id: 'vas_free_dem_det', value: 0 },
      ]
    : cargoType === 'hazmat'
    ? [
        { id: 'vas_msds_approval', value: 0 },
        { id: 'vas_imo_placard', value: 0 },
        { id: 'vas_free_dem_det', value: 0 },
      ]
    : [
        { id: 'vas_free_dem_det', value: 0 },
        { id: 'vas_ebl', value: 0 },
        { id: 'vas_tracking', value: 0 },
      ];

  const col: ContainerPricingMatrixColumn = {
    id: `cont-col-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    containerType: chosenType,
    baseOceanFreight: base,
    activeSurcharges: defaultSurcharges,
    totalPrice: 0,
    activeVas: defaultVas,
    departureSchedule: defaultSchedule || 'Thứ 4, Thứ 7 hàng tuần (Cut-off 17:00)',
    transitType: defaultTransitType || 'Direct',
    transitTimeDisplay: defaultTransitTime || '28 - 32 Ngày',
    freeDemDetDays: defaultFreeDemDetDays ?? 14,
    validUntil: '2026-12-31',
    notes: '',
  };

  col.totalPrice = calculateContainerColumnTotalPrice(col);
  return col;
};


export const FCL_SCHEDULE_PRESETS = [
  { label: 'Hàng ngày', days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'] },
  { label: 'T2 - T6', days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'] },
  { label: 'T2, T4, T6', days: ['Thứ 2', 'Thứ 4', 'Thứ 6'] },
  { label: 'T3, T5, T7', days: ['Thứ 3', 'Thứ 5', 'Thứ 7'] },
  { label: 'T2 - T7', days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'] },
];

export const FCL_DAYS_OF_WEEK_LOV = [
  { id: 'T2', name: 'Thứ 2' },
  { id: 'T3', name: 'Thứ 3' },
  { id: 'T4', name: 'Thứ 4' },
  { id: 'T5', name: 'Thứ 5' },
  { id: 'T6', name: 'Thứ 6' },
  { id: 'T7', name: 'Thứ 7' },
  { id: 'CN', name: 'Chủ Nhật' },
];

export const FCL_CUTOFF_TIMES_LOV = [
  { time: '17:00', label: '17:00 (Cắt máng cảng - Closing Time)' },
  { time: '12:00', label: '12:00 (Cắt máng ca trưa)' },
  { time: '09:00', label: '09:00 (Cắt máng ca sáng)' },
  { time: '20:00', label: '20:00 (Tàu chạy / Xuất bến ca tối)' },
  { time: 'Trước ETD 24h', label: 'Trước ETD 24h (Cut-off 24h)' },
  { time: 'Trước ETD 48h', label: 'Trước ETD 48h (Cut-off 48h)' },
];

export const generateFclScheduleString = (selectedDays: string[], cutoffTime: string): string => {
  if (selectedDays.length === 0) {
    return cutoffTime ? `Cut-off ${cutoffTime}` : 'Chưa thiết lập';
  }
  const prefix = 'Cut-off';
  if (selectedDays.length === 7) {
    return cutoffTime ? `Hàng ngày (${prefix} ${cutoffTime})` : 'Hàng ngày';
  }
  return cutoffTime 
    ? `${selectedDays.join(', ')} (${prefix} ${cutoffTime})`
    : selectedDays.join(', ');
};

export interface OceanFclCostMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: CapabilityRouteItem | null;
  onSave: (routeId: string, matrix: ContainerPricingMatrixColumn[]) => void;
  cargoType?: 'general' | 'reefer' | 'hazmat';
}

export const OceanFclCostMatrixModal: React.FC<OceanFclCostMatrixModalProps> = ({
  isOpen,
  onClose,
  route,
  onSave,
  cargoType = 'general',
}) => {
  const [columns, setColumns] = useState<ContainerPricingMatrixColumn[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scheduleModalState, setScheduleModalState] = useState<{
    targetColumnId: string;
    selectedDays: string[];
    departureTime: string;
    applyToAll: boolean;
  } | null>(null);

  const handleOpenScheduleConfigModal = (columnId: string) => {
    const col = columns.find((c) => c.id === columnId);
    const currentStr = col?.departureSchedule || '';

    let parsedDays: string[] = [];
    if (currentStr.toLowerCase().includes('hàng ngày') || currentStr.includes('T2 - CN')) {
      parsedDays = FCL_DAYS_OF_WEEK_LOV.map((d) => d.name);
    } else {
      parsedDays = FCL_DAYS_OF_WEEK_LOV.filter((d) => currentStr.includes(d.name)).map((d) => d.name);
      if (parsedDays.length === 0) {
        parsedDays = ['Thứ 4', 'Thứ 7'];
      }
    }

    let parsedTime = '17:00';
    const matchedPreset = FCL_CUTOFF_TIMES_LOV.find((t) => currentStr.includes(t.time));
    if (matchedPreset) {
      parsedTime = matchedPreset.time;
    } else {
      const timeMatch = currentStr.match(/(\d{1,2}:\d{2})/);
      if (timeMatch) {
        parsedTime = timeMatch[1];
      }
    }

    setScheduleModalState({
      targetColumnId: columnId,
      selectedDays: parsedDays,
      departureTime: parsedTime,
      applyToAll: true,
    });
  };

  const handleSaveScheduleConfig = () => {
    if (!scheduleModalState) return;
    const { targetColumnId, selectedDays, departureTime, applyToAll } = scheduleModalState;
    const scheduleString = generateFclScheduleString(selectedDays, departureTime);

    if (applyToAll) {
      setColumns((prev) =>
        prev.map((c) => ({
          ...c,
          departureSchedule: scheduleString,
        }))
      );
    } else {
      setColumns((prev) =>
        prev.map((c) =>
          c.id === targetColumnId
            ? {
                ...c,
                departureSchedule: scheduleString,
              }
            : c
        )
      );
    }
    setScheduleModalState(null);
  };


  const effectiveCargoType: 'general' | 'reefer' | 'hazmat' = 
    (cargoType as 'general' | 'reefer' | 'hazmat') || 
    (route?.cargoType as 'general' | 'reefer' | 'hazmat') || 
    (route?.vehicleType?.toLowerCase().includes('lạnh') || route?.route?.toLowerCase().includes('lạnh') || route?.origin?.toLowerCase().includes('lạnh')
      ? 'reefer'
      : route?.vehicleType?.toLowerCase().includes('imo') || route?.vehicleType?.toLowerCase().includes('dg') || route?.route?.toLowerCase().includes('nguy hiểm')
      ? 'hazmat'
      : 'general');

  const activeContainerTypesLov = effectiveCargoType === 'reefer'
    ? OCEAN_FCL_REEFER_CONTAINER_TYPES_LOV
    : effectiveCargoType === 'hazmat'
    ? OCEAN_FCL_HAZMAT_CONTAINER_TYPES_LOV
    : OCEAN_FCL_GENERAL_CONTAINER_TYPES_LOV;

  const activeSurchargesLov = effectiveCargoType === 'reefer'
    ? OCEAN_FCL_REEFER_SURCHARGES_LOV
    : effectiveCargoType === 'hazmat'
    ? OCEAN_FCL_HAZMAT_SURCHARGES_LOV
    : OCEAN_FCL_GENERAL_SURCHARGES_LOV;

  const activeVasLov = effectiveCargoType === 'reefer'
    ? OCEAN_FCL_REEFER_VAS_LOV
    : effectiveCargoType === 'hazmat'
    ? OCEAN_FCL_HAZMAT_VAS_LOV
    : OCEAN_FCL_GENERAL_VAS_LOV;

  useEffect(() => {
    if (isOpen && route) {
      if (route.containerPricingMatrix && route.containerPricingMatrix.length > 0) {
        setColumns(
          route.containerPricingMatrix.map(c => {
            const col: ContainerPricingMatrixColumn = {
              ...c,
              totalPrice: calculateContainerColumnTotalPrice(c),
            };
            return col;
          })
        );
      } else {
        const col1 = createDefaultContainerPricingColumn(
          route.vehicleType,
          route.price,
          effectiveCargoType,
          route.departureSchedule,
          (route.transitType as 'Direct' | 'Transit') || 'Direct',
          route.sla,
          route.freeDemDetDays
        );
        setColumns([col1]);
      }
    }
  }, [isOpen, route, effectiveCargoType]);

  if (!isOpen || !route) return null;

  // Add new container column
  const handleAddColumn = () => {
    const usedTypes = columns.map(c => c.containerType);
    let chosenType = activeContainerTypesLov[0];
    const unused = activeContainerTypesLov.find(t => !usedTypes.includes(t));
    if (unused) {
      chosenType = unused;
    }

    const currentSurcharges = columns.length > 0 && columns[0].activeSurcharges
      ? columns[0].activeSurcharges.map(it => ({ ...it, value: it.value }))
      : undefined;
    const currentVas = columns.length > 0 && columns[0].activeVas
      ? columns[0].activeVas.map(it => ({ ...it, value: 0 }))
      : undefined;

    const newCol = createDefaultContainerPricingColumn(
      chosenType,
      columns.length > 0 ? columns[0].totalPrice : 1450,
      effectiveCargoType,
      columns.length > 0 ? columns[0].departureSchedule : route.departureSchedule,
      columns.length > 0 ? columns[0].transitType : (route.transitType as 'Direct' | 'Transit') || 'Direct',
      columns.length > 0 ? columns[0].transitTimeDisplay : route.sla,
      columns.length > 0 ? columns[0].freeDemDetDays : route.freeDemDetDays
    );

    if (currentSurcharges) newCol.activeSurcharges = currentSurcharges;
    if (currentVas) newCol.activeVas = currentVas;
    newCol.totalPrice = calculateContainerColumnTotalPrice(newCol);

    setColumns(prev => [...prev, newCol]);

    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          left: scrollContainerRef.current.scrollWidth,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  // Delete column
  const handleDeleteColumn = (colId: string) => {
    if (columns.length <= 1) {
      alert('Tuyến đường biển FCL cần tối thiểu ít nhất 1 cấu hình vỏ container để chào giá!');
      return;
    }
    setColumns(prev => prev.filter(c => c.id !== colId));
  };

  // Update baseOceanFreight
  const handleUpdateBaseOceanFreight = (colId: string, val: number) => {
    setColumns(prev =>
      prev.map(c => {
        if (c.id !== colId) return c;
        const updated = { ...c, baseOceanFreight: val };
        updated.totalPrice = calculateContainerColumnTotalPrice(updated);
        return updated;
      })
    );
  };

  // Update column field (like transitType, transitTimeDisplay, etc.)
  const handleUpdateColumnField = <K extends keyof ContainerPricingMatrixColumn>(
    colId: string,
    field: K,
    val: ContainerPricingMatrixColumn[K]
  ) => {
    setColumns(prev =>
      prev.map(c => {
        if (c.id !== colId) return c;
        const updated = { ...c, [field]: val };
        return updated;
      })
    );
  };

  // Add Surcharge from LOV to all columns
  const handleAddSurchargeFromLOV = (lovId: string) => {
    const lovItem = activeSurchargesLov.find(it => it.id === lovId);
    if (!lovItem) return;

    setColumns(prev =>
      prev.map(col => {
        const currentList = col.activeSurcharges || [];
        if (currentList.some(it => it.id === lovId)) return col;
        const defaultVal = lovItem.defaultPrice || 0;
        const updatedList = [...currentList, { id: lovId, value: defaultVal }];
        const updatedCol = {
          ...col,
          activeSurcharges: updatedList,
        };
        updatedCol.totalPrice = calculateContainerColumnTotalPrice(updatedCol);
        return updatedCol;
      })
    );
  };

  // Delete Surcharge from all columns
  const handleDeleteSurcharge = (lovId: string) => {
    setColumns(prev =>
      prev.map(col => {
        const currentList = col.activeSurcharges || [];
        const updatedList = currentList.filter(it => it.id !== lovId);
        const updatedCol = {
          ...col,
          activeSurcharges: updatedList,
        };
        updatedCol.totalPrice = calculateContainerColumnTotalPrice(updatedCol);
        return updatedCol;
      })
    );
  };

  // Update Surcharge value for specific column
  const handleUpdateSurchargeValue = (colId: string, lovId: string, val: number) => {
    setColumns(prev =>
      prev.map(col => {
        if (col.id !== colId) return col;
        const currentList = col.activeSurcharges || [];
        const updatedList = currentList.map(it =>
          it.id === lovId ? { ...it, value: val } : it
        );
        const updatedCol = {
          ...col,
          activeSurcharges: updatedList,
        };
        updatedCol.totalPrice = calculateContainerColumnTotalPrice(updatedCol);
        return updatedCol;
      })
    );
  };

  // Add VAS from LOV to all columns
  const handleAddVasFromLOV = (lovId: string) => {
    const lovItem = activeVasLov.find(it => it.id === lovId);
    if (!lovItem) return;

    setColumns(prev =>
      prev.map(col => {
        const currentList = col.activeVas || [];
        if (currentList.some(it => it.id === lovId)) return col;
        const defaultVal = lovItem.defaultPrice || 0;
        const updatedList = [...currentList, { id: lovId, value: defaultVal }];
        return {
          ...col,
          activeVas: updatedList,
        };
      })
    );
  };

  // Delete VAS from all columns
  const handleDeleteVas = (lovId: string) => {
    setColumns(prev =>
      prev.map(col => {
        const currentList = col.activeVas || [];
        const updatedList = currentList.filter(it => it.id !== lovId);
        return {
          ...col,
          activeVas: updatedList,
        };
      })
    );
  };

  // Update VAS value for specific column
  const handleUpdateVasValue = (colId: string, lovId: string, val: number) => {
    setColumns(prev =>
      prev.map(col => {
        if (col.id !== colId) return col;
        const currentList = col.activeVas || [];
        const updatedList = currentList.map(it =>
          it.id === lovId ? { ...it, value: val } : it
        );
        return {
          ...col,
          activeVas: updatedList,
        };
      })
    );
  };

  // Change container type
  const handleContainerTypeChange = (colId: string, newType: string) => {
    setColumns(prev =>
      prev.map(c => {
        if (c.id !== colId) return c;
        return {
          ...c,
          containerType: newType,
        };
      })
    );
  };

  // Save matrix
  const handleSave = () => {
    onSave(route.id, columns);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* =========================================================================
            1. MODAL HEADER
        ========================================================================= */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shadow-inner">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                  <span>Ma Trận Biểu Phí Đường Biển FCL (Nguyên Container)</span>
                </h3>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                  effectiveCargoType === 'reefer'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : effectiveCargoType === 'hazmat'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                }`}>
                  {effectiveCargoType === 'reefer'
                    ? 'Container Lạnh (Reefer FCL)'
                    : effectiveCargoType === 'hazmat'
                    ? 'Container Nguy Hiểm (IMO / DG FCL)'
                    : 'Container Hàng Thường (Dry FCL)'}
                </span>
                {route.shippingLine && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/10 text-slate-200 border border-white/20">
                    Hãng tàu: {route.shippingLine}
                  </span>
                )}
              </div>
              <p className="text-xs text-sky-200/80 mt-0.5 flex items-center gap-2">
                <span>Tuyến: <strong className="text-white">{route.origin} (POL) ⇄ {route.destination} (POD)</strong></span>
                <span className="text-slate-400">•</span>
                <span>Mã tuyến: <code className="text-sky-300 font-mono font-bold">{route.routeCode || 'RC-FCL-001'}</code></span>
                <span className="text-slate-400">•</span>
                <span>Đơn vị: <span className="text-emerald-400 font-bold">USD / Container</span></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddColumn}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Thêm Cấu Hình Cont</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. MODAL BODY (SCROLLABLE DATA MATRIX TABLE)
        ========================================================================= */}
        <div ref={scrollContainerRef} className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <table className="w-full border-separate border-spacing-0 text-xs text-slate-800 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <thead>
              {/* CÁC CỘT CONTAINER */}
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="sticky left-0 z-30 bg-slate-100 text-left px-4 py-3.5 font-black text-slate-700 text-xs uppercase tracking-wider w-72 min-w-[280px] border-r border-slate-200">
                  Hạng Mục / Cấu Hình Container
                </th>
                {columns.map((col, idx) => (
                  <th
                    key={col.id}
                    className="px-4 py-3 text-center border-r last:border-r-0 border-slate-200 min-w-[240px] max-w-[280px] bg-slate-100/90"
                  >
                    <div className="flex items-center justify-between gap-1 pb-1">
                      <span className="text-[10.5px] font-black text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                        Cont #{idx + 1}
                      </span>
                      {columns.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteColumn(col.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa cấu hình container này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* CHỌN LOẠI VỎ CONTAINER TỪ LOV */}
                    <div className="mt-1">
                      <select
                        value={col.containerType}
                        onChange={(e) => handleContainerTypeChange(col.id, e.target.value)}
                        className="w-full px-2 py-1.5 text-xs font-bold text-slate-900 bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs truncate"
                        title={col.containerType}
                      >
                        {activeContainerTypesLov.map((type, tIdx) => (
                          <option key={tIdx} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </th>
                ))}
              </tr>

              {/* TỔNG CƯỚC THAM CHIẾU (ALL-IN) */}
              <tr className="bg-sky-50/80 border-b border-sky-200">
                <td className="sticky left-0 z-30 bg-sky-50 text-left px-4 py-3 font-black text-sky-950 text-xs border-r border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-sky-600" />
                    <span>TỔNG CƯỚC DỰ KIẾN (OF + PHỤ PHÍ)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Cước biển cơ bản cộng toàn bộ phụ phí bắt buộc
                  </p>
                </td>
                {columns.map((col) => (
                  <td
                    key={`total-${col.id}`}
                    className="px-4 py-3 text-center border-r last:border-r-0 border-slate-200 bg-sky-50/40 align-middle"
                  >
                    <div className="font-mono font-black text-base text-sky-950">
                      ${col.totalPrice.toLocaleString('en-US')}
                    </div>
                    <div className="text-[10px] font-bold text-sky-700 mt-0.5">
                      USD / Cont
                    </div>
                  </td>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* ===================================================================
                  CƯỚC BIỂN CƠ BẢN (BASE OCEAN FREIGHT - OF)
              =================================================================== */}
              <tr className="bg-white hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Ship className="w-3.5 h-3.5 text-sky-600" />
                      <span>Cước Biển Cơ Bản (Ocean Freight - OF) *</span>
                    </div>
                    <span className="text-[9.5px] px-1.5 py-0.5 bg-rose-50 text-rose-700 font-bold rounded border border-rose-200">
                      Bắt buộc
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Đơn giá cước vận chuyển chặng biển (USD / Cont)
                  </p>
                </td>
                {columns.map((col) => (
                  <td
                    key={`base-${col.id}`}
                    className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200"
                  >
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        min="0"
                        value={col.baseOceanFreight || ''}
                        onChange={(e) => handleUpdateBaseOceanFreight(col.id, parseFloat(e.target.value) || 0)}
                        placeholder="1450"
                        className="w-full pl-6 pr-3 py-1.5 text-xs font-bold text-slate-900 text-right bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs font-mono"
                      />
                    </div>
                  </td>
                ))}
              </tr>

              {/* ===================================================================
                  MỤC 1: PHỤ PHÍ HÃNG TÀU & CẢNG BIỂN (SURCHARGES)
              =================================================================== */}
              <tr className="bg-slate-100/90 border-y border-slate-200">
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-2 font-black text-slate-700 text-[11px] tracking-wide uppercase bg-slate-100"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                    <span>1. PHỤ PHÍ HÃNG TÀU & CẢNG BIỂN (SURCHARGES)</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH CÁC PHỤ PHÍ CHỌN TỪ LOV */}
              {(columns[0]?.activeSurcharges || []).map((surcharge) => {
                const lovItem = activeSurchargesLov.find(it => it.id === surcharge.id) || {
                  id: surcharge.id,
                  name: surcharge.id,
                  unit: 'USD / Cont',
                };

                return (
                  <tr key={`surcharge-row-${surcharge.id}`} className="hover:bg-sky-50/20 transition-colors">
                    <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2 font-medium text-slate-800">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteSurcharge(surcharge.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer shrink-0"
                            title={`Xóa phụ phí "${lovItem.name}"`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="truncate text-xs font-semibold text-slate-800" title={lovItem.name}>
                            {lovItem.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 border border-slate-200">
                          {lovItem.unit}
                        </span>
                      </div>
                    </td>

                    {columns.map((col) => {
                      const itemVal = col.activeSurcharges?.find(it => it.id === surcharge.id)?.value ?? 0;
                      return (
                        <td
                          key={`surch-${col.id}-${surcharge.id}`}
                          className="px-4 py-1.5 text-center border-r last:border-r-0 border-slate-200"
                        >
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              min="0"
                              value={itemVal}
                              onChange={(e) => handleUpdateSurchargeValue(col.id, surcharge.id, parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className={`w-full pl-6 pr-3 py-1 text-xs text-right rounded-lg border font-mono transition-all ${
                                itemVal > 0 
                                  ? 'border-sky-300 font-bold text-slate-900 bg-white focus:ring-2 focus:ring-sky-500' 
                                  : 'border-slate-200 text-slate-400 bg-slate-50/50'
                              }`}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* HÀNG THÊM PHỤ PHÍ TỪ LOV */}
              <tr className="bg-slate-50/80 border-b border-sky-100 hover:bg-sky-50/30 transition-colors">
                <td className="sticky left-0 z-20 bg-slate-50/95 border-r border-slate-200 px-4 py-2">
                  {(() => {
                    const activeIds = (columns[0]?.activeSurcharges || []).map(a => a.id);
                    const unadded = activeSurchargesLov.filter(l => !activeIds.includes(l.id));

                    if (unadded.length === 0) {
                      return (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 py-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Đã thêm toàn bộ phụ phí từ danh mục chuẩn</span>
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddSurchargeFromLOV(e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="w-full px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-dashed border-sky-400 rounded-lg hover:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                        >
                          <option value="" disabled>
                            + Chọn thêm phụ phí hãng tàu / cảng biển ({unadded.length} mục có sẵn)...
                          </option>
                          {unadded.map((item) => (
                            <option key={item.id} value={item.id}>
                              + {item.name} ({item.unit})
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })()}
                </td>
                {columns.map((col) => (
                  <td key={`add-surch-placeholder-${col.id}`} className="border-r last:border-r-0 border-slate-200 bg-slate-50/30"></td>
                ))}
              </tr>

              {/* ===================================================================
                  MỤC 2: DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) & TIỆN ÍCH KÈM THEO
              =================================================================== */}
              <tr className="bg-slate-100/90 border-y border-slate-200">
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-2 font-black text-slate-700 text-[11px] tracking-wide uppercase bg-slate-100"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>2. DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) & TIỆN ÍCH KÈM THEO</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH VAS CHỌN TỪ LOV */}
              {(columns[0]?.activeVas || []).map((vas) => {
                const lovItem = activeVasLov.find(it => it.id === vas.id) || {
                  id: vas.id,
                  name: vas.id,
                  unit: 'USD / Cont',
                  defaultPrice: 0,
                };

                return (
                  <tr key={`vas-row-${vas.id}`} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2 font-medium text-slate-800">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => handleDeleteVas(vas.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer shrink-0"
                            title={`Xóa dịch vụ "${lovItem.name}"`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="truncate text-xs font-semibold text-slate-800" title={lovItem.name}>
                            {lovItem.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 border border-slate-200">
                          {lovItem.unit}
                        </span>
                      </div>
                    </td>

                    {columns.map((col) => {
                      const itemVal = col.activeVas?.find(it => it.id === vas.id)?.value ?? 0;
                      return (
                        <td
                          key={`vas-${col.id}-${vas.id}`}
                          className="px-4 py-1.5 text-center border-r last:border-r-0 border-slate-200"
                        >
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                            <input
                              type="number"
                              min="0"
                              value={itemVal}
                              onChange={(e) => handleUpdateVasValue(col.id, vas.id, parseFloat(e.target.value) || 0)}
                              placeholder="0 (Miễn phí)"
                              className={`w-full pl-6 pr-3 py-1 text-xs text-right rounded-lg border font-mono transition-all ${
                                itemVal > 0 
                                  ? 'border-indigo-300 font-bold text-slate-900 bg-white focus:ring-2 focus:ring-indigo-500' 
                                  : 'border-slate-200 text-slate-400 bg-slate-50/50'
                              }`}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* HÀNG THÊM VAS TỪ LOV */}
              <tr className="bg-slate-50/80 border-b border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                <td className="sticky left-0 z-20 bg-slate-50/95 border-r border-slate-200 px-4 py-2">
                  {(() => {
                    const activeIds = (columns[0]?.activeVas || []).map(a => a.id);
                    const unadded = activeVasLov.filter(l => !activeIds.includes(l.id));

                    if (unadded.length === 0) {
                      return (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 py-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Đã thêm toàn bộ tiện ích VAS từ danh mục chuẩn</span>
                        </div>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddVasFromLOV(e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="w-full px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-dashed border-indigo-400 rounded-lg hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="" disabled>
                            + Chọn thêm tiện ích VAS ({unadded.length} mục có sẵn)...
                          </option>
                          {unadded.map((item) => (
                            <option key={item.id} value={item.id}>
                              + {item.name} ({item.unit})
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })()}
                </td>
                {columns.map((col) => (
                  <td key={`add-vas-placeholder-${col.id}`} className="border-r last:border-r-0 border-slate-200 bg-slate-50/30"></td>
                ))}
              </tr>

              {/* ===================================================================
                  MỤC 3: CAM KẾT LỊCH TÀU & ĐIỀU KHOẢN VẬN CHUYỂN
              =================================================================== */}
              <tr className="bg-slate-100/90 border-y border-slate-200">
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-2 font-black text-slate-700 text-[11px] tracking-wide uppercase bg-slate-100"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Anchor className="w-3.5 h-3.5 text-sky-700" />
                    <span>3. CAM KẾT LỊCH TÀU & ĐIỀU KHOẢN VẬN CHUYỂN</span>
                  </div>
                </td>
              </tr>

              {/* 1. Lịch tàu chạy & Giờ cắt máng (Schedule & Cut-off) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>1. Lịch Tàu Chạy & Giờ Cắt Máng (Closing/Cut-off)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Ngày tàu chạy trong tuần và giờ hạn chót giao cont cảng
                  </p>
                </td>
                {columns.map((col) => (
                  <td
                    key={`sched-${col.id}`}
                    className="px-3 py-2 text-center border-r last:border-r-0 border-slate-200"
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenScheduleConfigModal(col.id)}
                      className="w-full px-2.5 py-1.5 text-xs text-center font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50/20 hover:text-indigo-900 transition-all shadow-2xs flex items-center justify-between gap-1.5 group cursor-pointer"
                      title="Nhấp để cấu hình chi tiết lịch tàu chạy và giờ cắt máng"
                    >
                      <span className="truncate flex-1 text-center font-medium">
                        {col.departureSchedule || 'Thứ 4, Thứ 7 (Cut-off 17:00)'}
                      </span>
                      <Calendar className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform shrink-0" />
                    </button>
                  </td>
                ))}
              </tr>

              {/* 2. Loại Tuyến (Transit Type): Direct hoặc Transit ⭐ YÊU CẦU CỦA USER ⭐ */}
              <tr className="hover:bg-slate-50/60 transition-colors bg-sky-50/20">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Ship className="w-3.5 h-3.5 text-sky-600" />
                    <span>2. Loại Tuyến (Transit Type)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Tàu chạy thẳng trực tiếp hay có ghé cảng chuyển tải
                  </p>
                </td>
                {columns.map((col) => (
                  <td
                    key={`trtype-${col.id}`}
                    className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200"
                  >
                    <select
                      value={col.transitType || 'Direct'}
                      onChange={(e) => handleUpdateColumnField(col.id, 'transitType', e.target.value as 'Direct' | 'Transit')}
                      className={`w-full px-2.5 py-1.5 text-xs font-bold text-center rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs cursor-pointer ${
                        col.transitType === 'Direct' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="Direct">Direct</option>
                      <option value="Transit">Transit</option>
                    </select>
                  </td>
                ))}
              </tr>

              {/* 3. Thời Gian Hành Trình (Transit Time) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>3. Thời Gian Hành Trình (Transit Time)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Số ngày tàu chạy từ cảng bốc đến cảng đích
                  </p>
                </td>
                {columns.map((col) => (
                  <td
                    key={`ttime-${col.id}`}
                    className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200"
                  >
                    <input
                      type="text"
                      value={col.transitTimeDisplay}
                      onChange={(e) => handleUpdateColumnField(col.id, 'transitTimeDisplay', e.target.value)}
                      placeholder={col.transitType === 'Direct' ? '16 - 18 Ngày' : '28 - 32 Ngày'}
                      className="w-full px-2.5 py-1.5 text-xs text-center font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                    />
                  </td>
                ))}
              </tr>

              {/* 4. Số Ngày Free Demurrage & Detention */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>4. Số Ngày Miễn Phí Lưu Bãi & Vỏ (Free Dem/Det)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Số ngày lưu container miễn phí tại cảng đến (Ngày)
                  </p>
                </td>
                {columns.map((col) => (
                  <td
                    key={`demdet-${col.id}`}
                    className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200"
                  >
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        min="0"
                        value={col.freeDemDetDays}
                        onChange={(e) => handleUpdateColumnField(col.id, 'freeDemDetDays', parseInt(e.target.value) || 0)}
                        placeholder="14"
                        className="w-20 px-2 py-1.5 text-xs text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs font-mono"
                      />
                      <span className="text-xs font-semibold text-slate-500">Ngày</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* 5. Thời Hạn Hiệu Lực Giá */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>5. Thời Hạn Hiệu Lực Giá (Valid Until)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Mốc ngày kết thúc áp dụng biểu cước này
                  </p>
                </td>
                {columns.map((col) => (
                  <td
                    key={`valid-${col.id}`}
                    className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200"
                  >
                    <input
                      type="date"
                      value={col.validUntil || '2026-12-31'}
                      onChange={(e) => handleUpdateColumnField(col.id, 'validUntil', e.target.value)}
                      className="px-2.5 py-1.5 text-xs text-center font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            3. MODAL FOOTER
        ========================================================================= */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Đang cấu hình <strong className="text-slate-800">{columns.length}</strong> loại container cho tuyến này.
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-md shadow-sky-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Ma Trận Biểu Phí Cont</span>
            </button>
          </div>
        </div>


      {/* MODAL CON: CẤU HÌNH LỊCH TÀU CHẠY & GIỜ CẮT MÁNG (FCL) */}
      {scheduleModalState && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 via-white to-indigo-50/40 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 shadow-indigo-600/20 text-white flex items-center justify-center shadow-md shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Cấu Hình Lịch Tàu Chạy & Giờ Cắt Máng (FCL)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Tuyến: <strong className="text-indigo-700">{route?.route || `${route?.origin} ⇄ ${route?.destination}`}</strong> ({route?.origin} ⇄ {route?.destination})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setScheduleModalState(null)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
              {/* 1. Chọn Nhanh Tần Suất */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                  1. Chọn nhanh tần suất
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FCL_SCHEDULE_PRESETS.map((preset, pIdx) => {
                    const isSelected =
                      preset.days.every((d) => scheduleModalState.selectedDays.includes(d)) &&
                      scheduleModalState.selectedDays.length === preset.days.length;
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setScheduleModalState({
                            ...scheduleModalState,
                            selectedDays: [...preset.days],
                          });
                        }}
                        className={`px-3 py-1.5 text-xs rounded-xl border font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-800'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. LOV Các Thứ Trong Tuần (7 Ngày) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    2. Các ngày chạy trong tuần ({scheduleModalState.selectedDays.length}/7 ngày)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (scheduleModalState.selectedDays.length === 7) {
                        setScheduleModalState({ ...scheduleModalState, selectedDays: [] });
                      } else {
                        setScheduleModalState({
                          ...scheduleModalState,
                          selectedDays: FCL_DAYS_OF_WEEK_LOV.map((d) => d.name),
                        });
                      }
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    {scheduleModalState.selectedDays.length === 7 ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FCL_DAYS_OF_WEEK_LOV.map((day) => {
                    const isChecked = scheduleModalState.selectedDays.includes(day.name);
                    return (
                      <label
                        key={day.id}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all select-none ${
                          isChecked
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-2xs ring-1 ring-indigo-500/20'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let current = [...scheduleModalState.selectedDays];
                            if (e.target.checked) {
                              if (!current.includes(day.name)) current.push(day.name);
                            } else {
                              current = current.filter((d) => d !== day.name);
                            }
                            const sorted = FCL_DAYS_OF_WEEK_LOV.filter((d) =>
                              current.includes(d.name)
                            ).map((d) => d.name);
                            setScheduleModalState({
                              ...scheduleModalState,
                              selectedDays: sorted,
                            });
                          }}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                        <span>{day.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 3. Thời Gian Cắt Máng Cảng / Cut-off time */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>3. Thời gian cắt máng cảng / Cut-off time</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {FCL_CUTOFF_TIMES_LOV.map((dt, dtIdx) => {
                    const isChosen = scheduleModalState.departureTime === dt.time;
                    return (
                      <button
                        key={dtIdx}
                        type="button"
                        onClick={() => {
                          setScheduleModalState({
                            ...scheduleModalState,
                            departureTime: dt.time,
                          });
                        }}
                        className={`px-2.5 py-1.5 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                          isChosen
                            ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 font-medium hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className="block font-bold">{dt.time}</span>
                        <span
                          className={`text-[10px] block truncate ${
                            isChosen ? 'text-indigo-100' : 'text-slate-500'
                          }`}
                        >
                          {dt.label.replace(`${dt.time} `, '')}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                    Hoặc nhập giờ Cut-off khác:
                  </span>
                  <div className="relative inline-flex items-center">
                    <input
                      type="time"
                      value={scheduleModalState.departureTime}
                      onChange={(e) =>
                        setScheduleModalState({
                          ...scheduleModalState,
                          departureTime: e.target.value,
                        })
                      }
                      className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Xem Trước Chuỗi Kết Quả (Live Preview) */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Xem trước hiển thị trên biểu giá:
                </span>
                <div className="text-xs font-bold text-indigo-900 border-indigo-200 bg-white border rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs">
                  <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    {generateFclScheduleString(
                      scheduleModalState.selectedDays,
                      scheduleModalState.departureTime
                    )}
                  </span>
                </div>
              </div>

              {/* 5. Tùy chọn áp dụng cho tất cả container */}
              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={scheduleModalState.applyToAll}
                    onChange={(e) =>
                      setScheduleModalState({
                        ...scheduleModalState,
                        applyToAll: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Áp dụng lịch tàu này cho tất cả loại Container trên tuyến</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setScheduleModalState(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>

              <button
                type="button"
                onClick={handleSaveScheduleConfig}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận & Lưu Lịch Tàu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
