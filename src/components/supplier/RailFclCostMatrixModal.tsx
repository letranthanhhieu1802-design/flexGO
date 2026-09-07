import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Train,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  DollarSign,
  Check,
  AlertCircle,
} from 'lucide-react';
import { CapabilityRouteItem } from './SupplierServiceCapabilityModal';

// ==========================================
// 1. CONTAINER & TOA XE LOV BY CARGO GROUP (ĐƯỜNG SẮT)
// ==========================================
export const RAIL_FCL_GENERAL_CONTAINER_TYPES_LOV = [
  'Container 40ft GP / 40HC đường sắt —— (76 CBM / 28.5 Tấn)',
  'Container 20ft GP đường sắt —— (33 CBM / 28.0 Tấn tải nặng)',
  'Container 45ft High Cube đường sắt —— (86 CBM / Khổ lớn)',
  'Toa xe chuyên dụng sàn phẳng / Mở nóc —— (Hàng siêu trường/thiết bị)',
];

export const RAIL_FCL_REEFER_CONTAINER_TYPES_LOV = [
  'Container 40RF Lạnh đường sắt —— (Kèm máy phát điện Genset -20°C)',
  'Container 20RF Lạnh đường sắt —— (Kèm máy phát điện Genset -20°C)',
];

export const RAIL_FCL_HAZMAT_CONTAINER_TYPES_LOV = [
  'Container 40ft IMO Hazmat đường sắt —— (Hóa chất đóng pallet/kiện)',
  'Container 20ft IMO Hazmat đường sắt —— (Hóa chất đóng phuy/IBC)',
  'Toa xi-téc bồn hóa chất áp lực cao —— (Tank car chất lỏng/khí hóa lỏng)',
];

export interface LOVItem {
  id: string;
  name: string;
  unit: string;
  defaultPrice?: number;
}

// ==========================================
// 2. SURCHARGES LOV (PHỤ PHÍ GA & ĐƯỜNG SẮT)
// ==========================================
export const RAIL_FCL_GENERAL_SURCHARGES_LOV: LOVItem[] = [
  { id: 'lolo_pol', name: 'Phí nâng hạ cẩu container tại ga bốc (Rail Lo-Lo POL)', unit: 'VND / Cont', defaultPrice: 450000 },
  { id: 'lolo_pod', name: 'Phí nâng hạ cẩu container tại ga dỡ (Rail Lo-Lo POD)', unit: 'VND / Cont', defaultPrice: 450000 },
  { id: 'seal_fee', name: 'Phí kẹp chì niêm phong an ninh đường sắt', unit: 'VND / Cont', defaultPrice: 50000 },
  { id: 'railway_bill', name: 'Phí phát hành vận đơn đường sắt (Railway Bill CIM/SMGS)', unit: 'VND / Bộ', defaultPrice: 100000 },
  { id: 'shunting_fee', name: 'Phí tác nghiệp dồn toa & Ghép đoàn tàu hàng', unit: 'VND / Toa', defaultPrice: 300000 },
  { id: 'demurrage_yard', name: 'Phí lưu bãi ga & Lưu toa xe quá hạn', unit: 'VND / Cont / Ngày', defaultPrice: 150000 },
  { id: 'scale_fee', name: 'Phí cân tải trọng toa xe điện tử tại ga', unit: 'VND / Toa', defaultPrice: 80000 },
  { id: 'staging_fee', name: 'Phí hạ bãi lưu kho tạm chờ ghép chuyến ga', unit: 'VND / Cont', defaultPrice: 200000 },
];

export const RAIL_FCL_REEFER_SURCHARGES_LOV: LOVItem[] = [
  { id: 'genset_fuel', name: 'Phí nhiên liệu & Vận hành máy phát điện Genset trên toa', unit: 'VND / Cont', defaultPrice: 1800000 },
  { id: 'reefer_plug', name: 'Phí cắm điện duy trì bãi ga (Reefer Plug bãi ga)', unit: 'VND / Ngày', defaultPrice: 350000 },
  { id: 'temp_monitoring', name: 'Phí kiểm tra kỹ thuật giàn lạnh & Giám sát nhiệt chặng ga dừng', unit: 'VND / Chuyến', defaultPrice: 400000 },
  { id: 'lolo_reefer_pol', name: 'Phí nâng hạ container lạnh chuyên dụng tại ga bốc', unit: 'VND / Cont', defaultPrice: 550000 },
  { id: 'lolo_reefer_pod', name: 'Phí nâng hạ container lạnh chuyên dụng tại ga dỡ', unit: 'VND / Cont', defaultPrice: 550000 },
  { id: 'clean_reefer', name: 'Phí tẩy rửa khử trùng vỏ cont lạnh đường sắt', unit: 'VND / Cont', defaultPrice: 250000 },
  { id: 'railway_bill', name: 'Phí vận đơn đường sắt & Hồ sơ chuỗi lạnh', unit: 'VND / Bộ', defaultPrice: 100000 },
];

export const RAIL_FCL_HAZMAT_SURCHARGES_LOV: LOVItem[] = [
  { id: 'escort_fee', name: 'Phí áp tải kỹ thuật & Giám sát an toàn hóa chất đường ray', unit: 'VND / Chuyến', defaultPrice: 2000000 },
  { id: 'pccc_guard', name: 'Phí trực ban PCCC & An toàn hóa chất tại bãi ga', unit: 'VND / Ca', defaultPrice: 800000 },
  { id: 'buffer_car', name: 'Phí bố trí toa xe cách ly an toàn (Buffer car)', unit: 'VND / Toa', defaultPrice: 1500000 },
  { id: 'tank_inspection', name: 'Phí kiểm định phương tiện & Bồn xi-téc hóa chất đạt chuẩn', unit: 'VND / Toa', defaultPrice: 600000 },
  { id: 'lolo_haz_pol', name: 'Phí nâng hạ cẩu hàng nguy hiểm tại ga bốc', unit: 'VND / Cont', defaultPrice: 650000 },
  { id: 'lolo_haz_pod', name: 'Phí nâng hạ cẩu hàng nguy hiểm tại ga dỡ', unit: 'VND / Cont', defaultPrice: 650000 },
  { id: 'railway_bill', name: 'Phí vận đơn nguy hiểm & Hồ sơ cấp phép hóa chất đường sắt', unit: 'VND / Bộ', defaultPrice: 150000 },
];

// ==========================================
// 3. VAS LOV (DỊCH VỤ GIÁ TRỊ GIA TĂNG ĐƯỜNG SẮT)
// ==========================================
export const RAIL_FCL_GENERAL_VAS_LOV: LOVItem[] = [
  { id: 'vas_d2d_trucking', name: 'Kéo container First-mile / Last-mile Door-to-Door bằng xe đầu kéo', unit: 'VND / Chuyến', defaultPrice: 1800000 },
  { id: 'vas_lashing', name: 'Chằng buộc lashing chèn lót hàng hóa trên toa xe an toàn', unit: 'VND / Toa', defaultPrice: 500000 },
  { id: 'vas_cargo_insurance', name: 'Bảo hiểm rủi ro hàng hóa đường sắt trọn gói 100%', unit: 'VND / Toa', defaultPrice: 350000 },
  { id: 'vas_stevedoring', name: 'Bốc xếp dỡ hàng & Sang toa tại kho bãi ga', unit: 'VND / Tấn', defaultPrice: 35000 },
  { id: 'vas_tarp', name: 'Phủ bạt trùm bảo vệ hàng trên toa xe mở nóc chống nước mưa', unit: 'VND / Toa', defaultPrice: 200000 },
  { id: 'vas_gps_tracking', name: 'Dịch vụ GPS giám sát đoàn tàu & Cập nhật mốc ga tự động', unit: 'VND / Toa', defaultPrice: 0 },
];

export const RAIL_FCL_REEFER_VAS_LOV: LOVItem[] = [
  { id: 'vas_intermodal_customs', name: 'Thủ tục thông quan liên vận quốc tế sang TQ qua Ga Đồng Đăng', unit: 'VND / Tờ khai', defaultPrice: 850000 },
  { id: 'vas_gauge_change', name: 'Sang toa đổi khổ đường ray tại biên giới Việt - Trung (1000mm ➔ 1435mm)', unit: 'VND / Cont', defaultPrice: 1500000 },
  { id: 'vas_reefer_insurance', name: 'Bảo hiểm đứt gãy nhiệt độ hàng lạnh đường sắt', unit: 'VND / Cont', defaultPrice: 750000 },
  { id: 'vas_data_logger', name: 'Thiết bị Data Logger theo dõi nhiệt độ độc lập trên toa', unit: 'VND / Cont', defaultPrice: 0 },
  { id: 'vas_pre_cooling', name: 'Làm lạnh buồng cont trước khi đóng hàng tại ga (Pre-cooling)', unit: 'VND / Cont', defaultPrice: 0 },
  { id: 'vas_phyto', name: 'Kiểm dịch thực vật / Động vật xuất nhập khẩu tại ga liên vận', unit: 'VND / Lô', defaultPrice: 500000 },
];

export const RAIL_FCL_HAZMAT_VAS_LOV: LOVItem[] = [
  { id: 'vas_tank_pumping', name: 'Bơm rót hóa chất chuyên dụng từ bồn bãi ga sang bồn toa xe', unit: 'VND / Bồn', defaultPrice: 1200000 },
  { id: 'vas_spill_response', name: 'Đội phản ứng sự cố tràn đổ hóa chất trực ban 24/7', unit: 'VND / Chuyến', defaultPrice: 1000000 },
  { id: 'vas_dg_insurance', name: 'Bảo hiểm trách nhiệm sự cố môi trường đường sắt', unit: 'VND / Toa', defaultPrice: 1500000 },
  { id: 'vas_dg_placard', name: 'Dán tem nhãn cảnh báo nguy hiểm IMDG chuyên dụng quanh cont/toa', unit: 'VND / Cont', defaultPrice: 0 },
  { id: 'vas_msds_approval', name: 'Thẩm định hồ sơ hóa chất & Giấy phép vận chuyển nguy hiểm', unit: 'VND / Lô', defaultPrice: 0 },
];

export interface MatrixActiveItem {
  id: string;
  value: number;
}

export interface RailContainerPricingMatrixColumn {
  id: string;
  containerType: string;
  customContainerType?: string;
  baseRailFreight: number; // Cước đường ray cơ bản (VND)
  activeSurcharges: MatrixActiveItem[];
  totalPrice: number; // baseRailFreight + sum(activeSurcharges)
  activeVas: MatrixActiveItem[];
  departureSchedule: string; // Lịch tàu chạy (VD: Thứ 3, Thứ 6 hàng tuần (Cắt bãi ga 18:00))
  transitType: 'Direct' | 'Transit'; // Direct hoặc Transit
  transitTimeDisplay: string; // Thời gian hành trình (VD: 65 - 72 Giờ)
  freeDemDetDays: number; // Số ngày miễn phí lưu bãi ga
  validUntil: string;
  notes?: string;
}

export const calculateRailContainerColumnTotalPrice = (col: Partial<RailContainerPricingMatrixColumn>): number => {
  const base = Number(col.baseRailFreight) || 0;
  const surchargesSum = (col.activeSurcharges || []).reduce((acc, item) => acc + (Number(item.value) || 0), 0);
  return base + surchargesSum;
};

export const createDefaultRailContainerPricingColumn = (
  containerType?: string,
  basePrice?: number,
  cargoType?: 'general' | 'reefer' | 'hazmat',
  defaultSchedule?: string,
  defaultTransitType?: 'Direct' | 'Transit',
  defaultTransitTime?: string,
  defaultFreeDemDetDays?: number
): RailContainerPricingMatrixColumn => {
  const contLov = cargoType === 'reefer'
    ? RAIL_FCL_REEFER_CONTAINER_TYPES_LOV
    : cargoType === 'hazmat'
    ? RAIL_FCL_HAZMAT_CONTAINER_TYPES_LOV
    : RAIL_FCL_GENERAL_CONTAINER_TYPES_LOV;

  const chosenType = containerType && contLov.includes(containerType)
    ? containerType
    : contLov[0];

  const targetTotal = basePrice && basePrice > 0 
    ? basePrice 
    : (cargoType === 'reefer' ? 34000000 : cargoType === 'hazmat' ? 38000000 : 21000000);

  const defaultSurcharges: MatrixActiveItem[] = cargoType === 'reefer'
    ? [
        { id: 'genset_fuel', value: 1800000 },
        { id: 'reefer_plug', value: 350000 },
        { id: 'temp_monitoring', value: 400000 },
        { id: 'lolo_reefer_pol', value: 550000 },
      ]
    : cargoType === 'hazmat'
    ? [
        { id: 'escort_fee', value: 2000000 },
        { id: 'pccc_guard', value: 800000 },
        { id: 'buffer_car', value: 1500000 },
        { id: 'tank_inspection', value: 600000 },
      ]
    : [
        { id: 'lolo_pol', value: 450000 },
        { id: 'lolo_pod', value: 450000 },
        { id: 'seal_fee', value: 50000 },
        { id: 'railway_bill', value: 100000 },
        { id: 'shunting_fee', value: 300000 },
      ];

  const surchargesSum = defaultSurcharges.reduce((acc, s) => acc + s.value, 0);
  const base = targetTotal > surchargesSum ? targetTotal - surchargesSum : targetTotal;

  const defaultVas: MatrixActiveItem[] = cargoType === 'reefer'
    ? [
        { id: 'vas_data_logger', value: 0 },
        { id: 'vas_pre_cooling', value: 0 },
        { id: 'vas_intermodal_customs', value: 850000 },
      ]
    : cargoType === 'hazmat'
    ? [
        { id: 'vas_dg_placard', value: 0 },
        { id: 'vas_msds_approval', value: 0 },
        { id: 'vas_spill_response', value: 1000000 },
      ]
    : [
        { id: 'vas_d2d_trucking', value: 1800000 },
        { id: 'vas_lashing', value: 500000 },
        { id: 'vas_gps_tracking', value: 0 },
      ];

  const col: RailContainerPricingMatrixColumn = {
    id: `rail-col-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    containerType: chosenType,
    baseRailFreight: base,
    activeSurcharges: defaultSurcharges,
    totalPrice: 0,
    activeVas: defaultVas,
    departureSchedule: defaultSchedule || 'Thứ 3, Thứ 6 hàng tuần (Cắt bãi ga 18:00)',
    transitType: defaultTransitType || 'Direct',
    transitTimeDisplay: defaultTransitTime || '65 - 72 Giờ',
    freeDemDetDays: defaultFreeDemDetDays ?? 7,
    validUntil: '2026-12-31',
    notes: '',
  };

  col.totalPrice = calculateRailContainerColumnTotalPrice(col);
  return col;
};

// ==========================================
// 4. SCHEDULE MODAL CONSTANTS (LỊCH TÀU CHẠY ĐƯỜNG SẮT)
// ==========================================
export const RAIL_FCL_SCHEDULE_PRESETS = [
  { label: 'Hàng ngày', days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'] },
  { label: 'T2 - T6', days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'] },
  { label: 'T2, T4, T6', days: ['Thứ 2', 'Thứ 4', 'Thứ 6'] },
  { label: 'T3, T5, T7', days: ['Thứ 3', 'Thứ 5', 'Thứ 7'] },
  { label: 'T2 - T7', days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'] },
];

export const RAIL_FCL_DAYS_OF_WEEK_LOV = [
  { id: 'T2', name: 'Thứ 2' },
  { id: 'T3', name: 'Thứ 3' },
  { id: 'T4', name: 'Thứ 4' },
  { id: 'T5', name: 'Thứ 5' },
  { id: 'T6', name: 'Thứ 6' },
  { id: 'T7', name: 'Thứ 7' },
  { id: 'CN', name: 'Chủ Nhật' },
];

export const RAIL_FCL_CUTOFF_TIMES_LOV = [
  { time: '18:00', label: '18:00 (Cắt hàng bãi ga ca chiều)' },
  { time: '12:00', label: '12:00 (Cắt hàng bãi ga ca trưa)' },
  { time: '09:00', label: '09:00 (Cắt hàng bãi ga ca sáng)' },
  { time: '20:00', label: '20:00 (Đoàn tàu xuất bến ca tối)' },
  { time: 'Trước giờ tàu 4h', label: 'Trước giờ tàu 4h (Cut-off 4h)' },
  { time: 'Trước giờ tàu 6h', label: 'Trước giờ tàu 6h (Cut-off 6h)' },
];

export const generateRailScheduleString = (selectedDays: string[], cutoffTime: string): string => {
  if (selectedDays.length === 0) {
    return cutoffTime ? `Cắt bãi ga ${cutoffTime}` : 'Chưa thiết lập';
  }
  const prefix = 'Cắt bãi ga';
  if (selectedDays.length === 7) {
    return cutoffTime ? `Hàng ngày (${prefix} ${cutoffTime})` : 'Hàng ngày';
  }
  return cutoffTime 
    ? `${selectedDays.join(', ')} (${prefix} ${cutoffTime})`
    : selectedDays.join(', ');
};

export interface RailFclCostMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: CapabilityRouteItem | null;
  onSave: (routeId: string, matrix: RailContainerPricingMatrixColumn[]) => void;
  cargoType?: 'general' | 'reefer' | 'hazmat';
}

export const RailFclCostMatrixModal: React.FC<RailFclCostMatrixModalProps> = ({
  isOpen,
  onClose,
  route,
  onSave,
  cargoType = 'general',
}) => {
  const [columns, setColumns] = useState<RailContainerPricingMatrixColumn[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [scheduleModalState, setScheduleModalState] = useState<{
    targetColumnId: string;
    selectedDays: string[];
    departureTime: string;
    applyToAll: boolean;
  } | null>(null);

  const effectiveCargoType: 'general' | 'reefer' | 'hazmat' = 
    (cargoType as 'general' | 'reefer' | 'hazmat') || 
    (route?.cargoType as 'general' | 'reefer' | 'hazmat') || 
    (route?.vehicleType?.toLowerCase().includes('lạnh') || route?.route?.toLowerCase().includes('lạnh') || route?.origin?.toLowerCase().includes('lạnh')
      ? 'reefer'
      : route?.vehicleType?.toLowerCase().includes('imo') || route?.vehicleType?.toLowerCase().includes('nguy hiểm') || route?.route?.toLowerCase().includes('nguy hiểm')
      ? 'hazmat'
      : 'general');

  const activeContainerTypesLov = effectiveCargoType === 'reefer'
    ? RAIL_FCL_REEFER_CONTAINER_TYPES_LOV
    : effectiveCargoType === 'hazmat'
    ? RAIL_FCL_HAZMAT_CONTAINER_TYPES_LOV
    : RAIL_FCL_GENERAL_CONTAINER_TYPES_LOV;

  const activeSurchargesLov = effectiveCargoType === 'reefer'
    ? RAIL_FCL_REEFER_SURCHARGES_LOV
    : effectiveCargoType === 'hazmat'
    ? RAIL_FCL_HAZMAT_SURCHARGES_LOV
    : RAIL_FCL_GENERAL_SURCHARGES_LOV;

  const activeVasLov = effectiveCargoType === 'reefer'
    ? RAIL_FCL_REEFER_VAS_LOV
    : effectiveCargoType === 'hazmat'
    ? RAIL_FCL_HAZMAT_VAS_LOV
    : RAIL_FCL_GENERAL_VAS_LOV;

  useEffect(() => {
    if (isOpen && route) {
      if (route.railContainerPricingMatrix && route.railContainerPricingMatrix.length > 0) {
        setColumns(
          route.railContainerPricingMatrix.map((c) => {
            const col: RailContainerPricingMatrixColumn = {
              ...c,
              totalPrice: calculateRailContainerColumnTotalPrice(c),
            };
            return col;
          })
        );
      } else {
        const col1 = createDefaultRailContainerPricingColumn(
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
    const usedTypes = columns.map((c) => c.containerType);
    let chosenType = activeContainerTypesLov[0];
    const unused = activeContainerTypesLov.find((t) => !usedTypes.includes(t));
    if (unused) {
      chosenType = unused;
    }

    const currentSurcharges = columns.length > 0 && columns[0].activeSurcharges
      ? columns[0].activeSurcharges.map((it) => ({ ...it, value: it.value }))
      : undefined;
    const currentVas = columns.length > 0 && columns[0].activeVas
      ? columns[0].activeVas.map((it) => ({ ...it, value: 0 }))
      : undefined;

    const newCol = createDefaultRailContainerPricingColumn(
      chosenType,
      columns.length > 0 ? columns[0].totalPrice : 15400000,
      effectiveCargoType,
      columns.length > 0 ? columns[0].departureSchedule : route.departureSchedule,
      columns.length > 0 ? columns[0].transitType : (route.transitType as 'Direct' | 'Transit') || 'Direct',
      columns.length > 0 ? columns[0].transitTimeDisplay : route.sla,
      columns.length > 0 ? columns[0].freeDemDetDays : route.freeDemDetDays
    );

    if (currentSurcharges) newCol.activeSurcharges = currentSurcharges;
    if (currentVas) newCol.activeVas = currentVas;
    newCol.totalPrice = calculateRailContainerColumnTotalPrice(newCol);

    setColumns((prev) => [...prev, newCol]);

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
      alert('Tuyến đường sắt FCL cần tối thiểu ít nhất 1 cấu hình toa xe / container để chào giá!');
      return;
    }
    setColumns((prev) => prev.filter((c) => c.id !== colId));
  };

  // Update baseRailFreight
  const handleUpdateBaseRailFreight = (colId: string, val: number) => {
    setColumns((prev) =>
      prev.map((c) => {
        if (c.id !== colId) return c;
        const updated = { ...c, baseRailFreight: val };
        updated.totalPrice = calculateRailContainerColumnTotalPrice(updated);
        return updated;
      })
    );
  };

  // Update containerType
  const handleContainerTypeChange = (colId: string, newType: string) => {
    setColumns((prev) =>
      prev.map((c) => {
        if (c.id !== colId) return c;
        return { ...c, containerType: newType };
      })
    );
  };

  // Update column field (like transitType, transitTimeDisplay, etc.)
  const handleUpdateColumnField = <K extends keyof RailContainerPricingMatrixColumn>(
    colId: string,
    field: K,
    val: RailContainerPricingMatrixColumn[K]
  ) => {
    setColumns((prev) =>
      prev.map((c) => {
        if (c.id !== colId) return c;
        const updated = { ...c, [field]: val };
        return updated;
      })
    );
  };

  // Add Surcharge from LOV to all columns
  const handleAddSurchargeFromLOV = (lovId: string) => {
    const lovItem = activeSurchargesLov.find((it) => it.id === lovId);
    if (!lovItem) return;

    setColumns((prev) =>
      prev.map((col) => {
        const currentList = col.activeSurcharges || [];
        if (currentList.some((it) => it.id === lovId)) return col;
        const defaultVal = lovItem.defaultPrice || 0;
        const updatedList = [...currentList, { id: lovId, value: defaultVal }];
        const updatedCol = {
          ...col,
          activeSurcharges: updatedList,
        };
        updatedCol.totalPrice = calculateRailContainerColumnTotalPrice(updatedCol);
        return updatedCol;
      })
    );
  };

  // Delete Surcharge from all columns
  const handleDeleteSurcharge = (lovId: string) => {
    setColumns((prev) =>
      prev.map((col) => {
        const currentList = col.activeSurcharges || [];
        const updatedList = currentList.filter((it) => it.id !== lovId);
        const updatedCol = {
          ...col,
          activeSurcharges: updatedList,
        };
        updatedCol.totalPrice = calculateRailContainerColumnTotalPrice(updatedCol);
        return updatedCol;
      })
    );
  };

  // Update Surcharge value for specific column
  const handleUpdateSurchargeValue = (colId: string, lovId: string, val: number) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id !== colId) return col;
        const currentList = col.activeSurcharges || [];
        const updatedList = currentList.map((it) =>
          it.id === lovId ? { ...it, value: val } : it
        );
        const updatedCol = {
          ...col,
          activeSurcharges: updatedList,
        };
        updatedCol.totalPrice = calculateRailContainerColumnTotalPrice(updatedCol);
        return updatedCol;
      })
    );
  };

  // Add VAS from LOV to all columns
  const handleAddVasFromLOV = (lovId: string) => {
    const lovItem = activeVasLov.find((it) => it.id === lovId);
    if (!lovItem) return;

    setColumns((prev) =>
      prev.map((col) => {
        const currentList = col.activeVas || [];
        if (currentList.some((it) => it.id === lovId)) return col;
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
    setColumns((prev) =>
      prev.map((col) => {
        const currentList = col.activeVas || [];
        const updatedList = currentList.filter((it) => it.id !== lovId);
        return {
          ...col,
          activeVas: updatedList,
        };
      })
    );
  };

  // Update VAS value for specific column
  const handleUpdateVasValue = (colId: string, lovId: string, val: number) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id !== colId) return col;
        const currentList = col.activeVas || [];
        const updatedList = currentList.map((it) =>
          it.id === lovId ? { ...it, value: val } : it
        );
        return {
          ...col,
          activeVas: updatedList,
        };
      })
    );
  };

  // Schedule Modal Handlers
  const handleOpenScheduleConfigModal = (columnId: string) => {
    const col = columns.find((c) => c.id === columnId);
    const currentStr = col?.departureSchedule || '';

    let parsedDays: string[] = [];
    if (currentStr.toLowerCase().includes('hàng ngày') || currentStr.includes('T2 - CN')) {
      parsedDays = RAIL_FCL_DAYS_OF_WEEK_LOV.map((d) => d.name);
    } else {
      parsedDays = RAIL_FCL_DAYS_OF_WEEK_LOV.filter((d) => currentStr.includes(d.name)).map((d) => d.name);
      if (parsedDays.length === 0) {
        parsedDays = ['Thứ 3', 'Thứ 6'];
      }
    }

    let parsedTime = '18:00';
    const matchedPreset = RAIL_FCL_CUTOFF_TIMES_LOV.find((t) => currentStr.includes(t.time));
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
    const scheduleString = generateRailScheduleString(selectedDays, departureTime);

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

  const handleSave = () => {
    if (columns.length === 0) return;
    onSave(route.id, columns);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* =========================================================================
            1. MODAL HEADER (ĐỒNG BỘ 1:1 VỚI OCEAN FCL)
        ========================================================================= */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black tracking-tight flex items-center gap-2">
                  <span>Ma Trận Biểu Phí Đường Sắt FCL (Nguyên Toa / Container)</span>
                </h3>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                  effectiveCargoType === 'reefer'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                    : effectiveCargoType === 'hazmat'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                }`}>
                  {effectiveCargoType === 'reefer'
                    ? 'Container Lạnh Đường Sắt (Reefer Rail FCL)'
                    : effectiveCargoType === 'hazmat'
                    ? 'Toa Xe / Cont Nguy Hiểm (Hazmat Rail FCL)'
                    : 'Container Hàng Thường (Dry Rail FCL)'}
                </span>
                {route.shippingLine && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/10 text-slate-200 border border-white/20">
                    Đơn vị vận hành: {route.shippingLine}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5 flex items-center gap-2 flex-wrap">
                <span>Tuyến: <strong className="text-white">{route.origin} (Ga Đi) ⇄ {route.destination} (Ga Đến)</strong></span>
                <span className="text-slate-400">•</span>
                <span>Mã tuyến: <code className="text-emerald-300 font-mono font-bold">{route.routeCode || 'RC-RAIL-001'}</code></span>
                <span className="text-slate-400">•</span>
                <span>Đơn vị: <span className="text-emerald-400 font-bold">VND / Container</span></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddColumn}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Thêm Cấu Hình Cont / Toa</span>
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
            2. MODAL BODY (SCROLLABLE DATA MATRIX TABLE - ĐỒNG BỘ 1:1 OCEAN FCL)
        ========================================================================= */}
        <div ref={scrollContainerRef} className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
          <table className="w-full border-separate border-spacing-0 text-xs text-slate-800 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <thead>
              {/* CÁC CỘT CONTAINER / TOA XE */}
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
                      <span className="text-[10.5px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Cont/Toa #{idx + 1}
                      </span>
                      {columns.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteColumn(col.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa cấu hình container/toa xe này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* CHỌN LOẠI VỎ CONTAINER / TOA XE TỪ LOV */}
                    <div className="mt-1">
                      <select
                        value={col.containerType}
                        onChange={(e) => handleContainerTypeChange(col.id, e.target.value)}
                        className="w-full px-2 py-1.5 text-xs font-bold text-slate-900 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs truncate"
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

              {/* TỔNG CƯỚC DỰ KIẾN (ALL-IN - ĐẶT NGAY TRÊN ĐẦU BẢNG NHƯ ĐƯỜNG BIỂN) */}
              <tr className="bg-emerald-50/80 border-b border-emerald-200">
                <td className="sticky left-0 z-30 bg-emerald-50 text-left px-4 py-3 font-black text-emerald-950 text-xs border-r border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>TỔNG CƯỚC DỰ KIẾN (CƯỚC ĐƯỜNG RAY + PHỤ PHÍ)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Cước đường ray cơ bản cộng toàn bộ phụ phí bắt buộc
                  </p>
                </td>
                {columns.map((col) => (
                  <td
                    key={`total-${col.id}`}
                    className="px-4 py-3 text-center border-r last:border-r-0 border-slate-200 bg-emerald-50/40 align-middle"
                  >
                    <div className="font-mono font-black text-base text-emerald-950">
                      {col.totalPrice.toLocaleString('vi-VN')} ₫
                    </div>
                    <div className="text-[10px] font-bold text-emerald-700 mt-0.5">
                      VND / Cont
                    </div>
                  </td>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* ===================================================================
                  CƯỚC ĐƯỜNG RAY CƠ BẢN (BASE RAIL FREIGHT)
              =================================================================== */}
              <tr className="bg-white hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Train className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cước Đường Ray Cơ Bản (Base Rail Freight) *</span>
                    </div>
                    <span className="text-[9.5px] px-1.5 py-0.5 bg-rose-50 text-rose-700 font-bold rounded border border-rose-200">
                      Bắt buộc
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Đơn giá cước vận chuyển chặng đường ray ga-ga (VND / Cont)
                  </p>
                </td>
                {columns.map((col) => (
                  <td
                    key={`base-${col.id}`}
                    className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200"
                  >
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₫</span>
                      <input
                        type="number"
                        min="0"
                        step="100000"
                        value={col.baseRailFreight || ''}
                        onChange={(e) => handleUpdateBaseRailFreight(col.id, parseFloat(e.target.value) || 0)}
                        placeholder="17500000"
                        className="w-full pl-6 pr-3 py-1.5 text-xs font-bold text-slate-900 text-right bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-mono"
                      />
                    </div>
                  </td>
                ))}
              </tr>

              {/* ===================================================================
                  MỤC 1: PHỤ PHÍ GA & ĐƯỜNG SẮT (SURCHARGES)
              =================================================================== */}
              <tr className="bg-slate-100/90 border-y border-slate-200">
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-2 font-black text-slate-700 text-[11px] tracking-wide uppercase bg-slate-100"
                >
                  <div className="sticky left-4 inline-flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1. PHỤ PHÍ GA & ĐƯỜNG SẮT (SURCHARGES)</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH CÁC PHỤ PHÍ CHỌN TỪ LOV */}
              {(columns[0]?.activeSurcharges || []).map((surcharge) => {
                const lovItem = activeSurchargesLov.find((it) => it.id === surcharge.id) || {
                  id: surcharge.id,
                  name: surcharge.id,
                  unit: 'VND / Cont',
                };

                return (
                  <tr key={`surcharge-row-${surcharge.id}`} className="hover:bg-emerald-50/20 transition-colors">
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
                      const itemVal = col.activeSurcharges?.find((it) => it.id === surcharge.id)?.value ?? 0;
                      return (
                        <td
                          key={`surch-${surcharge.id}-${col.id}`}
                          className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200"
                        >
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₫</span>
                            <input
                              type="number"
                              min="0"
                              step="50000"
                              value={itemVal || ''}
                              onChange={(e) =>
                                handleUpdateSurchargeValue(col.id, surcharge.id, parseFloat(e.target.value) || 0)
                              }
                              placeholder="0"
                              className="w-full pl-6 pr-3 py-1.5 text-xs font-bold text-slate-900 text-right bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-mono"
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* HÀNG THÊM PHỤ PHÍ GA / ĐƯỜNG SẮT TỪ LOV */}
              <tr className="bg-slate-50/60 border-b border-slate-200">
                <td className="sticky left-0 z-20 bg-slate-50 px-4 py-2.5 border-r border-slate-200">
                  {(() => {
                    const currentIds = (columns[0]?.activeSurcharges || []).map((s) => s.id);
                    const unadded = activeSurchargesLov.filter((it) => !currentIds.includes(it.id));

                    if (unadded.length === 0) {
                      return (
                        <span className="text-xs text-slate-400 italic">
                          Đã thêm toàn bộ {activeSurchargesLov.length} phụ phí khả dụng
                        </span>
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
                          className="w-full px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-dashed border-emerald-400 rounded-lg hover:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                        >
                          <option value="" disabled>
                            + Chọn thêm phụ phí ga / đường sắt ({unadded.length} mục có sẵn)...
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
                const lovItem = activeVasLov.find((it) => it.id === vas.id) || {
                  id: vas.id,
                  name: vas.id,
                  unit: 'VND / Cont',
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
                      const itemVal = col.activeVas?.find((it) => it.id === vas.id)?.value ?? 0;
                      return (
                        <td
                          key={`vas-${vas.id}-${col.id}`}
                          className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200"
                        >
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₫</span>
                            <input
                              type="number"
                              min="0"
                              step="50000"
                              value={itemVal || ''}
                              onChange={(e) =>
                                handleUpdateVasValue(col.id, vas.id, parseFloat(e.target.value) || 0)
                              }
                              placeholder="0"
                              className="w-full pl-6 pr-3 py-1.5 text-xs font-bold text-slate-900 text-right bg-white border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs font-mono"
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* HÀNG THÊM TIỆN ÍCH VAS TỪ LOV */}
              <tr className="bg-slate-50/60 border-b border-slate-200">
                <td className="sticky left-0 z-20 bg-slate-50 px-4 py-2.5 border-r border-slate-200">
                  {(() => {
                    const currentIds = (columns[0]?.activeVas || []).map((v) => v.id);
                    const unadded = activeVasLov.filter((it) => !currentIds.includes(it.id));

                    if (unadded.length === 0) {
                      return (
                        <span className="text-xs text-slate-400 italic">
                          Đã thêm toàn bộ {activeVasLov.length} tiện ích VAS khả dụng
                        </span>
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
                    <Train className="w-3.5 h-3.5 text-emerald-700" />
                    <span>3. CAM KẾT LỊCH TÀU & ĐIỀU KHOẢN VẬN CHUYỂN</span>
                  </div>
                </td>
              </tr>

              {/* 1. Lịch tàu chạy & Giờ cắt hàng bãi ga (Schedule & Cut-off) */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1. Lịch Tàu Chạy & Giờ Cắt Hàng Bãi Ga (Closing/Cut-off)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Ngày tàu chạy trong tuần và giờ hạn chót hạ bãi ga
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
                      className="w-full px-2.5 py-1.5 text-xs text-center font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50/20 hover:text-emerald-900 transition-all shadow-2xs flex items-center justify-between gap-1.5 group cursor-pointer"
                      title="Nhấp để cấu hình chi tiết lịch tàu chạy và giờ cắt hàng bãi ga"
                    >
                      <span className="truncate flex-1 text-center font-medium">
                        {col.departureSchedule || 'Thứ 3, Thứ 6 (Cắt bãi ga 18:00)'}
                      </span>
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
                    </button>
                  </td>
                ))}
              </tr>

              {/* 2. Loại Tuyến (Transit Type): Direct hoặc Transit ⭐ YÊU CẦU CỦA USER ⭐ */}
              <tr className="hover:bg-slate-50/60 transition-colors bg-emerald-50/20">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2. Loại Tuyến (Transit Type)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Đoàn tàu chạy thẳng suốt tuyến hay có sang toa / chuyển ga
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
                      className={`w-full px-2.5 py-1.5 text-xs font-bold text-center rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs cursor-pointer ${
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
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3. Thời Gian Hành Trình (Transit Time)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Thời gian đoàn tàu di chuyển từ ga bốc đến ga dỡ
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
                      placeholder={col.transitType === 'Direct' ? '65 - 72 Giờ' : '4 - 5 Ngày'}
                      className="w-full px-2.5 py-1.5 text-xs text-center font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />
                  </td>
                ))}
              </tr>

              {/* 4. Số Ngày Free Demurrage Bãi Ga */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>4. Số Ngày Miễn Phí Lưu Bãi Ga (Free Demurrage Bãi Ga)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Số ngày lưu container / toa xe miễn phí tại bãi ga (Ngày)
                  </p>
                </td>
                {columns.map((col) => (
                  <td
                    key={`demdet-${col.id}`}
                    className="px-4 py-2 text-center border-r last:border-r-0 border-slate-200"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={col.freeDemDetDays ?? 7}
                        onChange={(e) => handleUpdateColumnField(col.id, 'freeDemDetDays', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1.5 text-xs text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs font-mono"
                      />
                      <span className="text-xs text-slate-500 font-medium">Ngày</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* 5. Thời Hạn Hiệu Lực Giá */}
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>5. Thời Hạn Hiệu Lực Giá (Valid Until)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Mức giá trên có giá trị áp dụng đến ngày
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
                      className="px-2.5 py-1.5 text-xs text-center font-medium text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* =========================================================================
            3. MODAL FOOTER (ĐỒNG BỘ 1:1 OCEAN FCL)
        ========================================================================= */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500">
            Đang cấu hình <strong className="text-slate-800">{columns.length}</strong> loại container/toa xe cho tuyến này.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Ma Trận Biểu Phí Đường Sắt</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            4. POPUP HỘP THOẠI CẤU HÌNH LỊCH TÀU CHẠY ĐƯỜNG SẮT
        ========================================================================= */}
        {scheduleModalState && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
              
              {/* Modal Header */}
              <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-tight">
                      Cấu Hình Lịch Tàu Chạy & Giờ Cắt Hàng Bãi Ga
                    </h4>
                    <p className="text-[11px] text-emerald-200/80">
                      Tuyến: {route.origin} ⇄ {route.destination}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setScheduleModalState(null)}
                  className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                
                {/* 1. Chọn Nhanh Tần Suất (Presets) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>1. Chọn nhanh tần suất:</span>
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {RAIL_FCL_SCHEDULE_PRESETS.map((preset, pIdx) => {
                      const isMatching =
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
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            isMatching
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Lưới 7 Ngày Trong Tuần */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      2. Các ngày chạy trong tuần ({scheduleModalState.selectedDays.length}/7 ngày):
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (scheduleModalState.selectedDays.length === 7) {
                          setScheduleModalState({ ...scheduleModalState, selectedDays: [] });
                        } else {
                          setScheduleModalState({
                            ...scheduleModalState,
                            selectedDays: RAIL_FCL_DAYS_OF_WEEK_LOV.map((d) => d.name),
                          });
                        }
                      }}
                      className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      {scheduleModalState.selectedDays.length === 7 ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {RAIL_FCL_DAYS_OF_WEEK_LOV.map((day) => {
                      const isChecked = scheduleModalState.selectedDays.includes(day.name);
                      return (
                        <label
                          key={day.id}
                          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer select-none transition-all ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 ring-1 ring-emerald-500/30'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              let current = [...scheduleModalState.selectedDays];
                              if (e.target.checked) {
                                current.push(day.name);
                              } else {
                                current = current.filter((d) => d !== day.name);
                              }
                              const sorted = RAIL_FCL_DAYS_OF_WEEK_LOV.filter((d) =>
                                current.includes(d.name)
                              ).map((d) => d.name);

                              setScheduleModalState({
                                ...scheduleModalState,
                                selectedDays: sorted,
                              });
                            }}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>{day.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Giờ Cắt Hàng Bãi Ga (Closing / Cut-off Time) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    3. Thời gian cắt hàng bãi ga / Cut-off time:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {RAIL_FCL_CUTOFF_TIMES_LOV.map((dt, dtIdx) => {
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
                          className={`px-3 py-2 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                            isChosen
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-500/30'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-mono text-xs text-emerald-700">{dt.time}</div>
                          <div className="text-[10px] text-slate-500 truncate">{dt.label}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Hoặc nhập giờ khác */}
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Hoặc nhập giờ Cut-off khác:</span>
                    <input
                      type="text"
                      placeholder="VD: 16:30 hoặc Trước giờ tàu 3h"
                      value={scheduleModalState.departureTime}
                      onChange={(e) =>
                        setScheduleModalState({
                          ...scheduleModalState,
                          departureTime: e.target.value,
                        })
                      }
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono w-52"
                    />
                  </div>
                </div>

                {/* 4. Xem Trước Chuỗi Kết Quả (Live Preview) */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Xem trước hiển thị trên biểu giá:
                  </span>
                  <div className="text-xs font-bold text-emerald-900 border-emerald-200 bg-white border rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {generateRailScheduleString(
                        scheduleModalState.selectedDays,
                        scheduleModalState.departureTime
                      )}
                    </span>
                  </div>
                </div>

                {/* 5. Tùy chọn áp dụng cho tất cả container/toa xe */}
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
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Áp dụng lịch tàu này cho tất cả loại Container / Toa xe trên tuyến</span>
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
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
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
