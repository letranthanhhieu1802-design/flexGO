import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  Trash2, 
  Plus, 
  Check, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  Package, 
  Layers, 
  Boxes,
  Percent,
  Clock,
  Calendar,
  AlertCircle,
  X,
  PlusCircle,
  Edit2,
  HelpCircle,
  Maximize2,
  Minimize2,
  ChevronDown
} from 'lucide-react';
import { WarehouseDetailModalData, PaidSurchargeItem, CapabilityVasItem } from './SupplierServiceCapabilityModal';

export interface WarehouseMatrixColumn {
  id: string;
  name: string;
  unit: string;
  typeKey?: 'area' | 'pallets' | 'volume' | 'custom';
  isCustom?: boolean;
}

export const WAREHOUSE_FREE_UTILITIES_SUGGESTIONS = [
  'Bảo vệ 24/7 & Camera an ninh CCTV giám sát',
  'Hệ thống PCCC tự động Sprinkler đạt chuẩn',
  'Phần mềm WMS quản lý tồn kho Real-time',
  'Miễn phí lưu bãi xe container 2 giờ đầu',
  'Bảo hiểm cháy nổ nhà kho 100%',
  'Chiếu sáng LED công nghiệp tiết kiệm điện',
  'Vệ sinh môi trường & Diệt côn trùng định kỳ (Pest Control)',
  'Hệ thống kiểm soát nhiệt độ & độ ẩm tự động',
];

export const PRESET_WAREHOUSE_COLUMNS: Array<{ name: string; unit: string }> = [
  { name: 'Tải Trọng Sàn (Tấn)', unit: 'Tấn' },
  { name: 'Kệ Selective (Pallet)', unit: 'Pallet' },
  { name: 'Kệ Drive-In (Pallet)', unit: 'Pallet' },
  { name: 'Khu Vực Mezzanine (m²)', unit: 'm²' },
  { name: 'Kho Mát 18°C - 25°C (m²)', unit: 'm²' },
  { name: 'Kho Lạnh 0°C - 5°C (Pallet)', unit: 'Pallet' },
  { name: 'Kho Cấp Đông (-18°C) (m³)', unit: 'm³' },
  { name: 'Bãi Đỗ Xe & Kho Hở (m²)', unit: 'm²' },
];

interface WarehousePricingContinuousTableProps {
  data: WarehouseDetailModalData;
  setData: React.Dispatch<React.SetStateAction<WarehouseDetailModalData | null>>;
  surchargesLov: Array<{ code: string; name: string; category: string; unit: string; defaultPrice: string; isFree?: boolean }>;
  vasLov: Array<{ code: string; name: string; category: string; unit: string; defaultPrice: string; isFree?: boolean }>;
}

// DANH SÁCH LOV PHỤ PHÍ CỐ ĐỊNH TIÊU CHUẨN (SECTION 1B)
export const FIXED_SURCHARGES_LOV = [
  { code: 'FIX-WMS-ADMIN', name: 'Phí quản lý đơn hàng & báo cáo tồn kho định kỳ (WMS / Admin)', unit: 'VND / Tháng', defaultPrice: 2000000, note: 'Bao gồm phân quyền 5 tài khoản WMS' },
  { code: 'FIX-CYCLE-COUNT', name: 'Phí kiểm kê định kỳ theo chu kỳ (Cycle Count)', unit: 'VND / Lần', defaultPrice: 500000, note: 'Kiểm kê định kỳ 1 lần/tháng' },
  { code: 'FIX-PARKING-MONTHLY', name: 'Phí bến bãi đỗ xe chờ giao nhận hàng tháng', unit: 'VND / Xe / Tháng', defaultPrice: 1500000, note: 'Dành cho xe tải thường trực' },
  { code: 'FIX-API-EDI-INTEG', name: 'Phí kết nối dữ liệu API/EDI hệ thống WMS vào ERP khách hàng', unit: 'VND / Tháng', defaultPrice: 0, note: 'Miễn phí tích hợp chuẩn RESTful API' },
  { code: 'FIX-ACCOUNT-MGR', name: 'Phí chuyên viên quản lý tài khoản & CSKH chuyên trách (Dedicated KAM)', unit: 'VND / Tháng', defaultPrice: 3000000, note: 'Nhân sự vận hành túc trực hỗ trợ riêng' },
  { code: 'FIX-SECURITY-CCTV', name: 'Phí tài khoản giám sát an ninh camera CCTV 24/7 riêng biệt', unit: 'VND / Tháng', defaultPrice: 800000, note: 'Cấp link xem camera khu vực hàng riêng' },
  { code: 'FIX-POWER-BACKUP', name: 'Phí duy trì nguồn điện máy phát dự phòng công suất lớn', unit: 'VND / Tháng', defaultPrice: 1200000, note: 'Đảm bảo hoạt động không gián đoạn' },
  { code: 'FIX-PEST-CONTROL', name: 'Phí dịch vụ kiểm soát côn trùng & khử trùng kho định kỳ', unit: 'VND / Tháng', defaultPrice: 700000, note: 'Theo tiêu chuẩn HACCP / ISO 22000' },
  { code: 'FIX-WASTE-DISPOSAL', name: 'Phí xử lý rác thải công nghiệp & bao bì phế liệu kho', unit: 'VND / Tháng', defaultPrice: 500000, note: 'Thu gom & tiêu hủy định kỳ đúng quy chuẩn' },
  { code: 'FIX-STORAGE-MAINT', name: 'Phí bảo dưỡng pallet, sàn & hệ thống giá kệ định kỳ', unit: 'VND / Tháng', defaultPrice: 600000, note: 'Kiểm định an toàn tải trọng định kỳ' },
];

export const WarehousePricingContinuousTable: React.FC<WarehousePricingContinuousTableProps> = ({
  data,
  setData,
  surchargesLov,
  vasLov,
}) => {
  // CÁC CỘT MA TRẬN LƯU TRỮ (MẶC ĐỊNH 3 CỘT THEO EXCEL + CHO PHÉP THÊM CỘT NHƯ LTL)
  const [columns, setColumns] = useState<WarehouseMatrixColumn[]>([
    { id: 'col_area', name: '1. Diện Tích Sàn (m²)', unit: 'm²', typeKey: 'area' },
    { id: 'col_pallets', name: '2. Sức Chứa Pallet (Racking)', unit: 'Pallet', typeKey: 'pallets' },
    { id: 'col_volume', name: '3. Thể Tích Chứa (m³ / CBM)', unit: 'm³', typeKey: 'volume' },
  ]);

  // Modal / popover thêm cột mới
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnUnit, setNewColumnUnit] = useState('Pallet');

  // Giá trị theo cột mở rộng cho các cột custom
  const [customValues, setCustomValues] = useState<Record<string, {
    capacity?: number;
    occupied?: number;
    available?: number;
    price?: number;
    minCharge?: number;
  }>>({});

  // Ma trận giá phụ phí biến đổi theo từng cột
  const [surchargeColPrices, setSurchargeColPrices] = useState<Record<string, Record<string, number>>>({
    'pwh-1': { col_area: 35000, col_pallets: 35000, col_volume: 30000 },
    'pwh-2': { col_area: 35000, col_pallets: 35000, col_volume: 30000 },
    'pwh-3': { col_area: 1200000, col_pallets: 1200000, col_volume: 1200000 },
    'pwh-4': { col_area: 500, col_pallets: 500, col_volume: 500 },
    'pwh-5': { col_area: 200000, col_pallets: 200000, col_volume: 200000 },
  });

  // Phụ phí cố định (Section 1B)
  const [fixedSurcharges, setFixedSurcharges] = useState<Array<{
    id: string;
    name: string;
    unit: string;
    price: number;
    note?: string;
  }>>([
    { id: 'fix-1', name: 'Phí quản lý đơn hàng & báo cáo tồn kho định kỳ (WMS / Admin)', unit: 'VND / Tháng', price: 2000000, note: 'Bao gồm phân quyền 5 tài khoản WMS' },
    { id: 'fix-2', name: 'Phí kiểm kê định kỳ theo chu kỳ (Cycle Count)', unit: 'VND / Lần', price: 500000, note: 'Kiểm kê định kỳ 1 lần/tháng' },
    { id: 'fix-3', name: 'Phí bến bãi đỗ xe chờ giao nhận hàng tháng', unit: 'VND / Xe / Tháng', price: 1500000, note: 'Dành cho xe tải thường trực' },
    { id: 'fix-4', name: 'Phí kết nối dữ liệu API/EDI hệ thống WMS vào ERP khách hàng', unit: 'VND / Tháng', price: 0, note: 'Miễn phí tích hợp chuẩn RESTful API' },
  ]);

  // Quản lý chọn thêm từ LOV
  const [selectedSurchargeCode, setSelectedSurchargeCode] = useState<string>('');
  const [selectedVasCode, setSelectedVasCode] = useState<string>('');
  const [selectedFixedCode, setSelectedFixedCode] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modal thêm hạng mục tùy chỉnh (thay thế window.prompt bị chặn bởi sandbox iframe)
  const [customModal, setCustomModal] = useState<{
    isOpen: boolean;
    type: 'variable' | 'fixed' | 'vas';
    name: string;
    unit: string;
    price: string;
    note: string;
  }>({
    isOpen: false,
    type: 'fixed',
    name: '',
    unit: 'VND / Tháng',
    price: '1,000,000',
    note: '',
  });

  const currencySymbol = data.currency === 'USD' ? '$' : '₫';

  // ĐỒNG BỘ THANH CUỘN NGANG GIỮA TOP & BOTTOM (GIỐNG LTL)
  const [tableScrollWidth, setTableScrollWidth] = useState<number>(1350);
  const tableRef = useRef<HTMLTableElement>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingScroll = useRef<boolean>(false);

  useEffect(() => {
    const updateWidth = () => {
      if (tableRef.current) {
        setTableScrollWidth(tableRef.current.scrollWidth);
      }
    };
    updateWidth();
    const timer = setTimeout(updateWidth, 150);
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidth);
    };
  }, [columns, data.paidSurcharges, data.vasItems]);

  const handleTopScroll = () => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    if (bottomScrollRef.current && topScrollRef.current) {
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
    requestAnimationFrame(() => {
      isSyncingScroll.current = false;
    });
  };

  const handleBottomScroll = () => {
    if (isSyncingScroll.current) return;
    isSyncingScroll.current = true;
    if (topScrollRef.current && bottomScrollRef.current) {
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
    }
    requestAnimationFrame(() => {
      isSyncingScroll.current = false;
    });
  };

  // THÊM CỘT MỚI VÀO MA TRẬN
  const handleAddColumn = (nameToAdd: string, unitToAdd: string) => {
    const trimmedName = (nameToAdd || '').trim();
    if (!trimmedName) return;

    const newId = `col_${Date.now()}`;
    const nextIndex = columns.length + 1;
    const formattedName = `${nextIndex}. ${trimmedName}`;

    const newCol: WarehouseMatrixColumn = {
      id: newId,
      name: formattedName,
      unit: unitToAdd || 'Pallet',
      typeKey: 'custom',
      isCustom: true,
    };

    setColumns([...columns, newCol]);

    // Giá trị khởi tạo mặc định cho cột mới
    setCustomValues(prev => ({
      ...prev,
      [newId]: {
        capacity: 1000,
        occupied: 600,
        available: 400,
        price: 150000,
        minCharge: 5000000,
      }
    }));

    setIsAddColumnModalOpen(false);
    setNewColumnName('');
    setNewColumnUnit('Pallet');
  };

  // XÓA CỘT KHỎI MA TRẬN
  const handleRemoveColumn = (colId: string) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter(c => c.id !== colId));
  };

  // ĐỔI TÊN CỘT
  const handleRenameColumn = (colId: string, newName: string) => {
    setColumns(columns.map(c => c.id === colId ? { ...c, name: newName } : c));
  };

  // LẤY GIÁ TRỊ THIẾT KẾ
  const getCapacityVal = (col: WarehouseMatrixColumn): number => {
    if (col.typeKey === 'area') return data.capacityArea ?? 2500;
    if (col.typeKey === 'pallets') return data.capacityPallets ?? 1800;
    if (col.typeKey === 'volume') return data.capacityVolume ?? 3000;
    return customValues[col.id]?.capacity ?? 1000;
  };

  // LẤY GIÁ TRỊ ĐANG CHỨA
  const getOccupiedVal = (col: WarehouseMatrixColumn): number => {
    if (col.typeKey === 'area') return data.occupiedArea ?? 1650;
    if (col.typeKey === 'pallets') return data.occupiedPallets ?? 1200;
    if (col.typeKey === 'volume') return data.occupiedVolume ?? 1900;
    return customValues[col.id]?.occupied ?? 600;
  };

  // LẤY GIÁ TRỊ CÒN TRỐNG
  const getAvailableVal = (col: WarehouseMatrixColumn): number => {
    if (col.typeKey === 'area') return data.availableArea ?? 850;
    if (col.typeKey === 'pallets') return data.availablePallets ?? 600;
    if (col.typeKey === 'volume') return data.availableVolume ?? 1100;
    return customValues[col.id]?.available ?? 400;
  };

  // CẬP NHẬT THIẾT KẾ
  const setCapacityVal = (col: WarehouseMatrixColumn, val: number) => {
    if (col.typeKey === 'area') {
      const occ = data.occupiedArea ?? 1650;
      setData(prev => prev ? ({
        ...prev,
        capacityArea: val,
        availableArea: Math.max(0, val - occ)
      }) : prev);
    } else if (col.typeKey === 'pallets') {
      const occ = data.occupiedPallets ?? 1200;
      setData(prev => prev ? ({
        ...prev,
        capacityPallets: val,
        availablePallets: Math.max(0, val - occ)
      }) : prev);
    } else if (col.typeKey === 'volume') {
      const occ = data.occupiedVolume ?? 1900;
      setData(prev => prev ? ({
        ...prev,
        capacityVolume: val,
        availableVolume: Math.max(0, val - occ)
      }) : prev);
    } else {
      setCustomValues(prev => {
        const cur = prev[col.id] || { capacity: 1000, occupied: 600, available: 400 };
        return {
          ...prev,
          [col.id]: {
            ...cur,
            capacity: val,
            available: Math.max(0, val - (cur.occupied || 0))
          }
        };
      });
    }
  };

  // CẬP NHẬT ĐANG CHỨA (TỰ TÍNH CÒN TRỐNG)
  const setOccupiedVal = (col: WarehouseMatrixColumn, val: number) => {
    if (col.typeKey === 'area') {
      const cap = data.capacityArea ?? 2500;
      setData(prev => prev ? ({
        ...prev,
        occupiedArea: val,
        availableArea: Math.max(0, cap - val)
      }) : prev);
    } else if (col.typeKey === 'pallets') {
      const cap = data.capacityPallets ?? 1800;
      setData(prev => prev ? ({
        ...prev,
        occupiedPallets: val,
        availablePallets: Math.max(0, cap - val)
      }) : prev);
    } else if (col.typeKey === 'volume') {
      const cap = data.capacityVolume ?? 3000;
      setData(prev => prev ? ({
        ...prev,
        occupiedVolume: val,
        availableVolume: Math.max(0, cap - val)
      }) : prev);
    } else {
      setCustomValues(prev => {
        const cur = prev[col.id] || { capacity: 1000, occupied: 600, available: 400 };
        return {
          ...prev,
          [col.id]: {
            ...cur,
            occupied: val,
            available: Math.max(0, (cur.capacity || 1000) - val)
          }
        };
      });
    }
  };

  // CẬP NHẬT CÒN TRỐNG (TỰ TÍNH ĐANG CHỨA)
  const setAvailableVal = (col: WarehouseMatrixColumn, val: number) => {
    if (col.typeKey === 'area') {
      const cap = data.capacityArea ?? 2500;
      setData(prev => prev ? ({
        ...prev,
        availableArea: val,
        occupiedArea: Math.max(0, cap - val)
      }) : prev);
    } else if (col.typeKey === 'pallets') {
      const cap = data.capacityPallets ?? 1800;
      setData(prev => prev ? ({
        ...prev,
        availablePallets: val,
        occupiedPallets: Math.max(0, cap - val)
      }) : prev);
    } else if (col.typeKey === 'volume') {
      const cap = data.capacityVolume ?? 3000;
      setData(prev => prev ? ({
        ...prev,
        availableVolume: val,
        occupiedVolume: Math.max(0, cap - val)
      }) : prev);
    } else {
      setCustomValues(prev => {
        const cur = prev[col.id] || { capacity: 1000, occupied: 600, available: 400 };
        return {
          ...prev,
          [col.id]: {
            ...cur,
            available: val,
            occupied: Math.max(0, (cur.capacity || 1000) - val)
          }
        };
      });
    }
  };

  // LẤY ĐƠN GIÁ THUÊ CƠ BẢN
  const getRentalPriceVal = (col: WarehouseMatrixColumn): number => {
    if (col.typeKey === 'area') return data.pricePerArea ?? 120000;
    if (col.typeKey === 'pallets') return data.pricePerPallet ?? 160000;
    if (col.typeKey === 'volume') return data.pricePerVolume ?? 110000;
    return customValues[col.id]?.price ?? 150000;
  };

  const setRentalPriceVal = (col: WarehouseMatrixColumn, val: number) => {
    if (col.typeKey === 'area') {
      setData(prev => prev ? ({ ...prev, pricePerArea: val }) : prev);
    } else if (col.typeKey === 'pallets') {
      setData(prev => prev ? ({ ...prev, pricePerPallet: val }) : prev);
    } else if (col.typeKey === 'volume') {
      setData(prev => prev ? ({ ...prev, pricePerVolume: val }) : prev);
    } else {
      setCustomValues(prev => ({
        ...prev,
        [col.id]: {
          ...(prev[col.id] || {}),
          price: val
        }
      }));
    }
  };

  // LẤY CƯỚC SÀN TỐI THIỂU (MIN CHARGE / MOQ)
  const getMinChargeVal = (col: WarehouseMatrixColumn): number => {
    if (col.typeKey === 'area') return data.minChargeMonthly ?? 15000000;
    if (col.typeKey === 'pallets') return 10000000;
    if (col.typeKey === 'volume') return 8000000;
    return customValues[col.id]?.minCharge ?? 5000000;
  };

  const setMinChargeVal = (col: WarehouseMatrixColumn, val: number) => {
    if (col.typeKey === 'area') {
      setData(prev => prev ? ({ ...prev, minChargeMonthly: val }) : prev);
    } else {
      setCustomValues(prev => ({
        ...prev,
        [col.id]: {
          ...(prev[col.id] || {}),
          minCharge: val
        }
      }));
    }
  };

  // LẤY GIÁ PHỤ PHÍ THEO CỘT
  const getSurchargePriceForCol = (surchargeId: string, colId: string, defaultTextPrice: string): number => {
    if (surchargeColPrices[surchargeId]?.[colId] !== undefined) {
      return surchargeColPrices[surchargeId][colId];
    }
    const num = parseInt(defaultTextPrice.replace(/[^\d]/g, ''), 10);
    return isNaN(num) ? 35000 : num;
  };

  const setSurchargePriceForCol = (surchargeId: string, colId: string, val: number) => {
    setSurchargeColPrices(prev => ({
      ...prev,
      [surchargeId]: {
        ...(prev[surchargeId] || {}),
        [colId]: val,
      }
    }));
  };

  // THÊM PHỤ PHÍ BIẾN ĐỔI TỪ LOV
  const handleAddSurchargeFromLov = (code: string) => {
    if (!code) return;
    const item = surchargesLov.find(s => s.code === code);
    if (!item) return;

    const newId = `pwh-${Date.now()}`;
    const defaultNum = parseInt(item.defaultPrice.replace(/[^\d]/g, ''), 10) || 35000;

    setData(prev => {
      if (!prev) return prev;
      if (prev.paidSurcharges.some(p => p.code === item.code || p.name.toLowerCase() === item.name.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        paidSurcharges: [
          ...prev.paidSurcharges,
          {
            id: newId,
            code: item.code,
            name: item.name,
            category: item.category,
            unit: item.unit,
            priceText: item.defaultPrice,
            note: 'Phụ phí biến đổi theo vận hành kho',
            isChecked: true,
          }
        ]
      };
    });

    // Set default price for all current columns
    const colMap: Record<string, number> = {};
    columns.forEach(c => { colMap[c.id] = defaultNum; });
    setSurchargeColPrices(prev => ({ ...prev, [newId]: colMap }));

    setSelectedSurchargeCode('');
  };

  // THÊM PHỤ PHÍ BIẾN ĐỔI TÙY CHỈNH (MỞ MODAL NHẬP LIỆU)
  const openCustomVariableModal = () => {
    setCustomModal({
      isOpen: true,
      type: 'variable',
      name: '',
      unit: 'VND / Pallet',
      price: '35000',
      note: '',
    });
  };

  // THÊM PHỤ PHÍ CỐ ĐỊNH TỪ LOV
  const handleAddFixedFromLov = (code: string) => {
    if (!code) return;
    const item = FIXED_SURCHARGES_LOV.find(f => f.code === code);
    if (!item) return;

    if (fixedSurcharges.some(f => f.name.toLowerCase() === item.name.toLowerCase())) {
      setSelectedFixedCode('');
      return;
    }

    setFixedSurcharges(prev => [
      ...prev,
      {
        id: `fix-${Date.now()}`,
        name: item.name,
        unit: item.unit,
        price: item.defaultPrice,
        note: item.note,
      }
    ]);
    setSelectedFixedCode('');
  };

  // THÊM PHỤ PHÍ CỐ ĐỊNH TÙY CHỈNH (MỞ MODAL NHẬP LIỆU)
  const openCustomFixedModal = () => {
    setCustomModal({
      isOpen: true,
      type: 'fixed',
      name: '',
      unit: 'VND / Tháng',
      price: '1000000',
      note: '',
    });
  };

  // THÊM VAS TÙY CHỈNH (MỞ MODAL NHẬP LIỆU)
  const openCustomVasModal = () => {
    setCustomModal({
      isOpen: true,
      type: 'vas',
      name: '',
      unit: 'VND / Kiện',
      price: '30000',
      note: 'Cam kết SLA tiêu chuẩn dịch vụ',
    });
  };

  // XỬ LÝ LƯU HẠNG MỤC TỪ MODAL TÙY CHỈNH (CHO CẢ 1A, 1B VÀ 2)
  const handleSaveCustomItem = () => {
    if (!customModal.name.trim()) return;
    const rawPrice = parseInt(customModal.price.replace(/[^\d]/g, ''), 10) || 0;

    if (customModal.type === 'fixed') {
      setFixedSurcharges(prev => [
        ...prev,
        {
          id: `fix-${Date.now()}`,
          name: customModal.name.trim(),
          unit: customModal.unit.trim() || 'VND / Tháng',
          price: rawPrice,
          note: customModal.note.trim() || undefined,
        }
      ]);
    } else if (customModal.type === 'variable') {
      const newId = `pwh-custom-${Date.now()}`;
      setData(prev => prev ? ({
        ...prev,
        paidSurcharges: [
          ...prev.paidSurcharges,
          {
            id: newId,
            name: customModal.name.trim(),
            category: 'Phụ Phí Vận Hành',
            unit: customModal.unit.trim() || 'VND / Pallet',
            priceText: `${rawPrice.toLocaleString('vi-VN')} ₫`,
            note: customModal.note.trim() || 'Phụ phí biến đổi theo vận hành kho',
            isChecked: true,
          }
        ]
      }) : prev);
      const colMap: Record<string, number> = {};
      columns.forEach(c => { colMap[c.id] = rawPrice; });
      setSurchargeColPrices(prev => ({ ...prev, [newId]: colMap }));
    } else if (customModal.type === 'vas') {
      setData(prev => prev ? ({
        ...prev,
        vasItems: [
          ...prev.vasItems,
          {
            id: `vwh-custom-${Date.now()}`,
            name: customModal.name.trim(),
            category: 'Dịch Vụ Giá Trị Gia Tăng',
            unit: customModal.unit.trim() || 'VND / Kiện',
            priceText: `${rawPrice.toLocaleString('vi-VN')} ₫`,
            slaNote: customModal.note.trim() || 'Cam kết SLA tiêu chuẩn dịch vụ',
            isChecked: true,
          }
        ]
      }) : prev);
    }

    setCustomModal(prev => ({ ...prev, isOpen: false }));
  };

  // XÓA PHỤ PHÍ BIẾN ĐỔI
  const handleRemoveSurcharge = (id: string) => {
    setData(prev => prev ? ({
      ...prev,
      paidSurcharges: prev.paidSurcharges.filter(p => p.id !== id)
    }) : prev);
  };

  // THÊM VAS TỪ LOV
  const handleAddVasFromLov = (code: string) => {
    if (!code) return;
    const item = vasLov.find(v => v.code === code);
    if (!item) return;

    setData(prev => {
      if (!prev) return prev;
      if (prev.vasItems.some(v => v.code === item.code || v.name.toLowerCase() === item.name.toLowerCase())) {
        return prev;
      }
      return {
        ...prev,
        vasItems: [
          ...prev.vasItems,
          {
            id: `vwh-${Date.now()}`,
            code: item.code,
            name: item.name,
            category: item.category,
            unit: item.unit,
            priceText: item.defaultPrice,
            slaNote: 'Cam kết SLA tiêu chuẩn dịch vụ',
            isChecked: true,
          }
        ]
      };
    });
    setSelectedVasCode('');
  };

  // XÓA VAS
  const handleRemoveVas = (id: string) => {
    setData(prev => prev ? ({
      ...prev,
      vasItems: prev.vasItems.filter(v => v.id !== id)
    }) : prev);
  };

  // Lọc các item chưa thêm
  const availableSurcharges = surchargesLov.filter(s => 
    !data.paidSurcharges.some(p => p.code === s.code || p.name.toLowerCase() === s.name.toLowerCase())
  );

  const availableFixedLov = FIXED_SURCHARGES_LOV.filter(f => 
    !fixedSurcharges.some(exist => exist.name.toLowerCase() === f.name.toLowerCase())
  );

  const availableVas = vasLov.filter(v => 
    !data.vasItems.some(item => item.code === v.code || item.name.toLowerCase() === v.name.toLowerCase())
  );

  return (
    <div className={`flex-1 min-h-0 flex flex-col overflow-hidden bg-slate-50/50 ${
      isFullscreen ? 'fixed inset-2 z-[9999] bg-white rounded-2xl shadow-2xl border border-slate-300' : ''
    }`}>
      
      {/* 1. TOP BREADCRUMB SUMMARY BAR (THEO PHONG CÁCH VẬN TẢI ĐƯỜNG BỘ & EXCEL) */}
      <div className="px-5 py-2 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 select-none">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mã Kho:</span>
            <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs shadow-2xs">
              {data.warehouseCode || 'WH-001'}
            </span>
          </div>
          <div className="h-3.5 w-px bg-slate-300 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tên Cơ Sở:</span>
            <strong className="text-slate-900 font-bold">{data.warehouseName}</strong>
          </div>
          <div className="h-3.5 w-px bg-slate-300 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Địa Điểm:</span>
            <span className="text-slate-700 font-medium">{data.address}, {data.province}</span>
          </div>
          <div className="h-3.5 w-px bg-slate-300 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Tiêu Chuẩn:</span>
            <span className="text-indigo-800 font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[11px]">
              {data.isColdStorage ? 'Kho Lạnh 3PL' : data.isChemicalStorage ? 'Kho Hóa Chất DG' : 'Kho Thường Tiêu Chuẩn 3PL'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10.5px] font-bold text-slate-600 uppercase">Tiền tệ:</span>
            <select
              value={data.currency || 'VND'}
              onChange={(e) => setData(prev => prev ? ({ ...prev, currency: e.target.value as 'VND' | 'USD' }) : prev)}
              className="px-2 py-0.5 text-xs font-black bg-white border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
            >
              <option value="VND">VND (₫)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10.5px] font-bold text-slate-600 uppercase">Trạng Thái:</span>
            <select
              value={data.receptionStatus || 'ready'}
              onChange={(e) => setData(prev => prev ? ({ ...prev, receptionStatus: e.target.value as any }) : prev)}
              className={`text-xs font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer shadow-2xs ${
                data.receptionStatus === 'full'
                  ? 'bg-rose-50 text-rose-700 border-rose-300'
                  : data.receptionStatus === 'limited'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              <option value="ready">🟢 Sẵn sàng nhận hàng</option>
              <option value="limited">🟡 Sắp đầy sàn</option>
              <option value="full">🔴 Đã lấp đầy 100%</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. TOOLBAR HÀNH ĐỘNG THÊM CỘT MA TRẬN LƯU TRỮ (TƯƠNG TỰ THÊM BẬC TRONG LTL) */}
      <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
        <div className="flex items-center gap-2 font-medium">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Bảng ma trận dữ liệu kho 2 chiều (Spreadsheet Matrix): 
            <strong className="text-indigo-900 font-bold ml-1">
              {columns.map(c => c.name.replace(/^\d+\.\s*/, '')).join(' • ')}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* NÚT MỞ RỘNG TOÀN MÀN HÌNH KHUNG NHÌN BẢNG DỮ LIỆU */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
              isFullscreen
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
            title={isFullscreen ? "Thu nhỏ lại khung nhìn tiêu chuẩn" : "Mở rộng tối đa toàn màn hình khung nhìn bảng ma trận"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? "Thu Nhỏ Khung Nhìn" : "Mở Rộng Khung Nhìn"}</span>
          </button>

          {/* NÚT THÊM CỘT NHƯ TRONG LTL */}
          <button
            type="button"
            onClick={() => setIsAddColumnModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Thêm cột đo lường hoặc loại hình lưu trữ mới vào ma trận bảng"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-700" />
            <span>+ Thêm Cột Đo Lường / Loại Hình Lưu Trữ</span>
          </button>
        </div>
      </div>

      {/* 3. BẢNG DỮ LIỆU LIỀN MẠCH THEO FILE EXCEL VÀ MÔ HÌNH LTL (KHUNG NHÌN TỐI ĐA) */}
      <div className="flex-1 overflow-hidden bg-white p-3 sm:p-4 flex flex-col min-h-0">
        
        {/* THANH CUỘN NGANG PHÍA TRÊN BẢNG DỮ LIỆU (ĐỒNG BỘ VỚI BẢNG GIỐNG LTL) */}
        <div
          ref={topScrollRef}
          onScroll={handleTopScroll}
          className="w-full overflow-x-auto overflow-y-hidden mb-1.5 rounded-lg bg-slate-100 border border-slate-300 shadow-2xs shrink-0"
          title="Thanh cuộn ngang bảng dữ liệu"
        >
          <div style={{ width: `${tableScrollWidth}px`, height: '1px' }} />
        </div>

        {/* CONTAINER BẢNG DỮ LIỆU EXCEL MA TRẬN - KHUNG NHÌN MỞ RỘNG TOÀN DIỆN */}
        <div 
          ref={bottomScrollRef}
          onScroll={handleBottomScroll}
          className="border border-slate-300 rounded-xl overflow-x-auto overflow-y-auto shadow-xs flex-1 h-full [scrollbar-width:thin]"
        >
          <table ref={tableRef} className="w-full border-collapse text-xs text-left min-w-[1100px]">
            
            {/* THEAD: TIÊU ĐỀ CÁC CỘT (CỘT 1: HẠNG MỤC, CỘT 2: ĐVT, CỘT 3..N: CÁC CỘT LƯU TRỮ) */}
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-800 select-none bg-slate-100/90 sticky top-0 z-40">
                
                {/* CỘT 1 CỐ ĐỊNH TRÁI: HẠNG MỤC CHI PHÍ & THÔNG SỐ KHO */}
                <th className="sticky left-0 z-50 bg-slate-100 border-r-2 border-slate-300 px-4 py-3 min-w-[340px] max-w-[340px] font-black text-slate-800 uppercase tracking-wider text-[11px] shadow-[2px_0_5px_rgba(0,0,0,0.06)] align-middle">
                  <div className="flex items-center justify-between">
                    <span>HẠNG MỤC CHI PHÍ BÁO GIÁ & THÔNG SỐ KHO</span>
                  </div>
                </th>

                {/* CỘT 2: ĐVT */}
                <th className="bg-slate-100 border-r border-slate-300 px-3 py-3 text-center w-24 min-w-[90px] font-black text-slate-800 uppercase tracking-wider text-[11px] align-middle">
                  ĐVT
                </th>

                {/* CÁC CỘT ĐO LƯỜNG / LƯU TRỮ (1. DIỆN TÍCH SÀN, 2. SỨC CHỨA PALLET, 3. THỂ TÍCH...) */}
                {columns.map((col, idx) => (
                  <th 
                    key={col.id} 
                    className="bg-indigo-50/60 border-r border-indigo-200 px-3 py-2 text-center min-w-[200px] align-middle"
                  >
                    <div className="flex items-center justify-between text-[10px] text-indigo-900 font-bold mb-1">
                      <span className="uppercase tracking-wide text-indigo-600 font-extrabold">CỘT #{idx + 1}</span>
                      {columns.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColumn(col.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
                          title="Xóa cột này khỏi ma trận"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    
                    {/* Ô NHẬP HOẶC HIỂN THỊ TÊN CỘT */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={col.name}
                        onChange={(e) => handleRenameColumn(col.id, e.target.value)}
                        className="w-full text-center font-black text-indigo-950 bg-white border border-indigo-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                      />
                    </div>
                    <div className="text-[10px] font-semibold text-indigo-700/80 mt-1">
                      Đơn vị đo: <strong className="text-indigo-900">{col.unit}</strong>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* TBODY: NỘI DUNG THEO ĐÚNG CẤU TRÚC FILE EXCEL CỦA USER */}
            <tbody className="divide-y divide-slate-200">

              {/* DÒNG 1: THIẾT KẾ (DESIGN CAPACITY) */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span className="text-xs font-black text-slate-800">Thiết kế</span>
                    <span className="text-[10px] text-slate-500 font-normal">(Sức chứa tối đa theo thiết kế sàn)</span>
                  </div>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-semibold bg-slate-50/40">
                  Theo cột
                </td>
                {columns.map(col => {
                  const cap = getCapacityVal(col);
                  const occ = getOccupiedVal(col);
                  const pct = cap > 0 ? Math.min(100, Math.round((occ / cap) * 100)) : 0;
                  return (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center">
                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="number"
                            value={cap || ''}
                            onChange={(e) => setCapacityVal(col, parseFloat(e.target.value) || 0)}
                            className="w-full text-center font-black text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            placeholder="0"
                          />
                        </div>
                        <div className="flex items-center justify-center">
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                            pct >= 90 ? 'bg-rose-50 text-rose-700 border-rose-200' : pct >= 70 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}>
                            Đã lấp đầy: {pct}%
                          </span>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* DÒNG 2: ĐANG CHỨA (OCCUPIED CAPACITY) */}
              <tr className="hover:bg-slate-50/70 transition-colors bg-rose-50/20">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold text-rose-900">Đang chứa</span>
                    <span className="text-[10px] text-rose-600 font-normal">(Hiện hữu thực tế đã nhận)</span>
                  </div>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-semibold bg-slate-50/40">
                  Theo cột
                </td>
                {columns.map(col => {
                  const occ = getOccupiedVal(col);
                  return (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center bg-rose-50/10">
                      <input
                        type="number"
                        value={occ || ''}
                        onChange={(e) => setOccupiedVal(col, parseFloat(e.target.value) || 0)}
                        className="w-full text-center font-bold text-rose-900 bg-white border border-rose-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                        placeholder="0"
                      />
                    </td>
                  );
                })}
              </tr>

              {/* DÒNG 3: CÒN TRỐNG (AVAILABLE CAPACITY) */}
              <tr className="hover:bg-slate-50/70 transition-colors bg-emerald-50/20">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-900">Còn trống</span>
                    <span className="text-[10px] text-emerald-700 font-normal">(Sẵn sàng tiếp nhận thêm hàng)</span>
                  </div>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-semibold bg-slate-50/40">
                  Theo cột
                </td>
                {columns.map(col => {
                  const avail = getAvailableVal(col);
                  return (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center bg-emerald-50/10">
                      <input
                        type="number"
                        value={avail || ''}
                        onChange={(e) => setAvailableVal(col, parseFloat(e.target.value) || 0)}
                        className="w-full text-center font-bold text-emerald-900 bg-white border border-emerald-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        placeholder="0"
                      />
                    </td>
                  );
                })}
              </tr>

              {/* PHÂN ĐOẠN 1: CẤU TRÚC ĐƠN GIÁ THUÊ */}
              <tr className="bg-slate-100/90 font-black text-slate-800">
                <td colSpan={columns.length + 2} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>1. CẤU TRÚC ĐƠN GIÁ THUÊ</span>
                </td>
              </tr>

              {/* DÒNG: ĐƠN GIÁ THUÊ */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="text-xs font-black text-slate-900">
                    Đơn giá thuê
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    Đơn giá thuê kho cơ bản theo từng hình thức lưu trữ
                  </div>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-700 font-bold bg-slate-50/40">
                  {currencySymbol} / tháng
                </td>
                {columns.map(col => {
                  const p = getRentalPriceVal(col);
                  return (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center">
                      <div className="relative">
                        <input
                          type="text"
                          value={p ? p.toLocaleString('vi-VN') : ''}
                          onChange={(e) => {
                            const num = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0;
                            setRentalPriceVal(col, num);
                          }}
                          className="w-full text-right font-black text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none pr-6 shadow-2xs"
                          placeholder="0"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[11px] pointer-events-none">
                          {currencySymbol}
                        </span>
                      </div>
                      <span className="text-[9.5px] text-slate-400 block text-right mt-0.5">
                        /{col.unit}/tháng
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* DÒNG: CƯỚC SÀN TỐI THIỂU HÀNG THÁNG (MIN CHARGE / MOQ) */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2.5 font-bold text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="text-xs font-black text-slate-900">
                    Cước sàn tối thiểu hàng tháng (Min Charge / MOQ)
                  </div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    Mức doanh thu cam kết tối thiểu khi thuê theo từng tiêu chuẩn
                  </div>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-700 font-bold bg-slate-50/40">
                  {currencySymbol} / tháng
                </td>
                {columns.map(col => {
                  const mc = getMinChargeVal(col);
                  return (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center">
                      <div className="relative">
                        <input
                          type="text"
                          value={mc ? mc.toLocaleString('vi-VN') : ''}
                          onChange={(e) => {
                            const num = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0;
                            setMinChargeVal(col, num);
                          }}
                          className="w-full text-right font-black text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none pr-6 shadow-2xs"
                          placeholder="0"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[11px] pointer-events-none">
                          {currencySymbol}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* PHÂN ĐOẠN 1A: PHỤ PHÍ BIẾN ĐỔI (VARIABLE SURCHARGES) */}
              <tr className="bg-slate-100/90 font-black text-slate-800">
                <td colSpan={columns.length + 2} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-600" />
                    <span>1A. PHỤ PHÍ BIẾN ĐỔI (BỐC XẾP, NÂNG HẠ & THAO TÁC THEO TỪNG CỘT LƯU TRỮ)</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH DÒNG PHỤ PHÍ BIẾN ĐỔI (VỚI ICON THÙNG RÁC BÊN TRÁI & BADGE LOV BÊN PHẢI THEO MẪU) */}
              {data.paidSurcharges.map((sch) => (
                <tr key={sch.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveSurcharge(sch.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors shrink-0"
                          title="Xóa phụ phí này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-semibold text-xs text-slate-800 truncate">
                          • {sch.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                        LOV
                      </span>
                    </div>
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                    {sch.unit}
                  </td>
                  {columns.map(col => {
                    const priceVal = getSurchargePriceForCol(sch.id, col.id, sch.priceText);
                    return (
                      <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center">
                        <div className="relative">
                          <input
                            type="text"
                            value={priceVal ? priceVal.toLocaleString('vi-VN') : ''}
                            onChange={(e) => {
                              const num = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0;
                              setSurchargePriceForCol(sch.id, col.id, num);
                            }}
                            className="w-full text-right font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none pr-6 shadow-2xs"
                            placeholder="0"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[11px] pointer-events-none">
                            {currencySymbol}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* HÀNG HÀNH ĐỘNG DƯỚI CÙNG 1A: CHỌN PHỤ PHÍ THÊM TỪ LOV HOẶC TÙY CHỈNH (THEO THIẾT KẾ VÍ DỤ) */}
              <tr className="bg-slate-50/30 border-b border-slate-200">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-3 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    {availableSurcharges.length > 0 ? (
                      <div className="relative flex-1">
                        <select
                          value={selectedSurchargeCode}
                          onChange={(e) => handleAddSurchargeFromLov(e.target.value)}
                          className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white hover:bg-indigo-50/30 border-2 border-indigo-400 hover:border-indigo-500 rounded-xl px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none shadow-2xs transition-all pr-8 tracking-wide"
                        >
                          <option value="" className="text-indigo-600 font-bold">
                            + Chọn phụ phí thêm từ LOV ({availableSurcharges.length} mục)...
                          </option>
                          {availableSurcharges.map(s => (
                            <option key={s.code} value={s.code} className="text-slate-800 font-medium">
                              {s.name} ({s.unit})
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-600">
                          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 text-xs text-slate-400 italic px-3 py-2 border-2 border-dashed border-slate-200 rounded-xl text-center">
                        Đã chọn tất cả phụ phí từ LOV
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={openCustomVariableModal}
                      className="px-3 py-2 bg-white hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 border-2 border-indigo-300 hover:border-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 whitespace-nowrap active:scale-95"
                      title="Thêm phụ phí biến đổi tùy chỉnh"
                    >
                      + Tùy chỉnh
                    </button>
                  </div>
                </td>
                <td className="border-r border-slate-200 bg-slate-50/20" />
                {columns.map(col => (
                  <td key={col.id} className="border-r border-slate-200 bg-slate-50/10" />
                ))}
              </tr>

              {/* PHÂN ĐOẠN 1B: PHỤ PHÍ CỐ ĐỊNH (FIXED SURCHARGES) */}
              <tr className="bg-slate-100/90 font-black text-slate-800">
                <td colSpan={columns.length + 2} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    <span>1B. PHỤ PHÍ CỐ ĐỊNH (QUẢN LÝ, KIỂM ĐẾM & PHÍ ĐỊNH KỲ HÀNG THÁNG)</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH PHỤ PHÍ CỐ ĐỊNH */}
              {fixedSurcharges.map((fix) => (
                <tr key={fix.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => setFixedSurcharges(fixedSurcharges.filter(f => f.id !== fix.id))}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors shrink-0"
                          title="Xóa phụ phí này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-slate-800 truncate">• {fix.name}</span>
                          {fix.note && <span className="text-[10px] text-slate-400 block truncate">{fix.note}</span>}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                        Cố định
                      </span>
                    </div>
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                    {fix.unit}
                  </td>
                  {columns.map((col, idx) => (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center">
                      {idx === 0 ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={fix.price ? fix.price.toLocaleString('vi-VN') : ''}
                            onChange={(e) => {
                              const num = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0;
                              setFixedSurcharges(fixedSurcharges.map(f => f.id === fix.id ? { ...f, price: num } : f));
                            }}
                            className="w-full text-right font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none pr-6 shadow-2xs"
                            placeholder="0"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[11px] pointer-events-none">
                            {currencySymbol}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Dùng chung mức phí
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* HÀNG HÀNH ĐỘNG DƯỚI CÙNG 1B: CHỌN PHỤ PHÍ CỐ ĐỊNH TỪ LOV HOẶC THÊM TÙY CHỈNH (THEO THIẾT KẾ MẪU) */}
              <tr className="bg-slate-50/30 border-b border-slate-200">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-3 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    {availableFixedLov.length > 0 ? (
                      <div className="relative flex-1">
                        <select
                          value={selectedFixedCode}
                          onChange={(e) => handleAddFixedFromLov(e.target.value)}
                          className="w-full text-xs font-bold text-amber-700 hover:text-amber-800 bg-white hover:bg-amber-50/30 border-2 border-amber-400 hover:border-amber-500 rounded-xl px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none shadow-2xs transition-all pr-8 tracking-wide"
                        >
                          <option value="" className="text-amber-700 font-bold">
                            + Chọn phụ phí cố định thêm từ LOV ({availableFixedLov.length} mục)...
                          </option>
                          {availableFixedLov.map(f => (
                            <option key={f.code} value={f.code} className="text-slate-800 font-medium">
                              {f.name} ({f.unit})
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-700">
                          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 text-xs text-slate-400 italic px-3 py-2 border-2 border-dashed border-slate-200 rounded-xl text-center">
                        Đã chọn tất cả phụ phí cố định từ LOV
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={openCustomFixedModal}
                      className="px-3 py-2 bg-white hover:bg-amber-50/60 text-amber-700 hover:text-amber-800 border-2 border-amber-400 hover:border-amber-500 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 whitespace-nowrap active:scale-95 flex items-center gap-1.5"
                      title="Thêm phụ phí cố định hàng tháng tùy chỉnh"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>+ Tùy chỉnh</span>
                    </button>
                  </div>
                </td>
                <td className="border-r border-slate-200 bg-slate-50/20" />
                {columns.map(col => (
                  <td key={col.id} className="border-r border-slate-200 bg-slate-50/10" />
                ))}
              </tr>

              {/* PHÂN ĐOẠN 2: GIÁ TRỊ GIA TĂNG (VAS) */}
              <tr className="bg-slate-100/90 font-black text-slate-800">
                <td colSpan={columns.length + 2} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>2. BIỂU PHÍ DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS)</span>
                  </div>
                </td>
              </tr>

              {/* DANH SÁCH DÒNG VAS (VỚI ICON THÙNG RÁC BÊN TRÁI & BADGE VAS BÊN PHẢI THEO MẪU) */}
              {data.vasItems.map((vas) => (
                <tr key={vas.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveVas(vas.id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors shrink-0"
                          title="Xóa dịch vụ VAS này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-semibold text-xs text-slate-800 truncate">• {vas.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                        VAS
                      </span>
                    </div>
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                    {vas.unit}
                  </td>
                  {columns.map((col, idx) => (
                    <td key={col.id} className="border-r border-slate-200 px-3 py-2 text-center">
                      <div className="relative">
                        <input
                          type="text"
                          value={vas.priceText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setData(prev => prev ? ({
                              ...prev,
                              vasItems: prev.vasItems.map(v => v.id === vas.id ? { ...v, priceText: val } : v)
                            }) : prev);
                          }}
                          className="w-full text-center font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none shadow-2xs"
                          placeholder="Mức thu"
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}

              {/* HÀNG HÀNH ĐỘNG DƯỚI CÙNG 2: + CHỌN VAS THÊM TỪ DANH MỤC (THEO THIẾT KẾ VÍ DỤ) */}
              <tr className="bg-slate-50/30 border-b border-slate-200">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-3 py-2 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2">
                    {availableVas.length > 0 ? (
                      <div className="relative flex-1">
                        <select
                          value={selectedVasCode}
                          onChange={(e) => handleAddVasFromLov(e.target.value)}
                          className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white hover:bg-indigo-50/30 border-2 border-indigo-400 hover:border-indigo-500 rounded-xl px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none shadow-2xs transition-all pr-8 tracking-wide"
                        >
                          <option value="" className="text-indigo-600 font-bold">
                            + Chọn VAS thêm từ danh mục ({availableVas.length} mục)...
                          </option>
                          {availableVas.map(v => (
                            <option key={v.code} value={v.code} className="text-slate-800 font-medium">
                              {v.name} ({v.unit})
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-600">
                          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 text-xs text-slate-400 italic px-3 py-2 border-2 border-dashed border-slate-200 rounded-xl text-center">
                        Đã chọn tất cả dịch vụ VAS từ danh mục
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={openCustomVasModal}
                      className="px-3 py-2 bg-white hover:bg-slate-50 text-indigo-600 hover:text-indigo-700 border-2 border-indigo-300 hover:border-indigo-400 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 whitespace-nowrap active:scale-95"
                      title="Thêm dịch vụ VAS tùy chỉnh"
                    >
                      + Tùy chỉnh
                    </button>
                  </div>
                </td>
                <td className="border-r border-slate-200 bg-slate-50/20" />
                {columns.map(col => (
                  <td key={col.id} className="border-r border-slate-200 bg-slate-50/10" />
                ))}
              </tr>

              {/* PHÂN ĐOẠN 3: CAM KẾT VẬN HÀNH (SLA & OPERATION) */}
              <tr className="bg-slate-100/90 font-black text-slate-800">
                <td colSpan={columns.length + 2} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-600" />
                  <span>3. CAM KẾT VẬN HÀNH</span>
                </td>
              </tr>

              {/* DÒNG: KHUNG GIỜ TIẾP NHẬN XE TẢI & CONTAINER */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <span className="font-semibold text-xs text-slate-800">Khung giờ tiếp nhận xe tải & container</span>
                  <span className="text-[10px] text-slate-500 block">Thời gian mở cổng giao nhận xe</span>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                  Khung giờ
                </td>
                <td colSpan={columns.length} className="border-r border-slate-200 px-3 py-2">
                  <input
                    type="text"
                    value={data.operatingHours || '24/7 (Không cấm giờ xe cont)'}
                    onChange={(e) => setData(prev => prev ? ({ ...prev, operatingHours: e.target.value }) : prev)}
                    className="w-full font-bold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                    placeholder="24/7 (Không cấm giờ xe cont)"
                  />
                </td>
              </tr>

              {/* DÒNG: GIỜ CUT-OFF NHẬN LỆNH XUẤT KHO */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <span className="font-semibold text-xs text-slate-800">Giờ Cut-off nhận lệnh xuất kho trong ngày</span>
                  <span className="text-[10px] text-slate-500 block">Thời hạn tiếp nhận đơn hàng SO trong ca</span>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                  Giờ
                </td>
                <td colSpan={columns.length} className="border-r border-slate-200 px-3 py-2">
                  <input
                    type="text"
                    value={data.cutOffTime || '16:30 hàng ngày'}
                    onChange={(e) => setData(prev => prev ? ({ ...prev, cutOffTime: e.target.value }) : prev)}
                    className="w-full font-bold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                    placeholder="16:30 hàng ngày"
                  />
                </td>
              </tr>

              {/* DÒNG: CAM KẾT SLA THỜI GIAN XỬ LÝ */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <span className="font-semibold text-xs text-slate-800">Thời gian xử lý nhập/xuất kho (SLA)</span>
                  <span className="text-[10px] text-slate-500 block">Thời gian giải phóng xe tại dock</span>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                  Giờ
                </td>
                <td colSpan={columns.length} className="border-r border-slate-200 px-3 py-2">
                  <input
                    type="text"
                    value={data.sla || '2 - 4 giờ kể từ khi xe vào dock'}
                    onChange={(e) => setData(prev => prev ? ({ ...prev, sla: e.target.value }) : prev)}
                    className="w-full font-bold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                    placeholder="2 - 4 giờ kể từ khi xe vào dock"
                  />
                </td>
              </tr>

              {/* PHÂN ĐOẠN 4: HIỆU LỰC GIÁ & ĐIỀU KHOẢN THƯƠNG MẠI */}
              <tr className="bg-slate-100/90 font-black text-slate-800">
                <td colSpan={columns.length + 2} className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>HIỆU LỰC GIÁ & ĐIỀU KHOẢN THƯƠNG MẠI</span>
                </td>
              </tr>

              {/* DÒNG: HIỆU LỰC GIÁ */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <span className="font-semibold text-xs text-slate-800">Hiệu lực giá</span>
                  <span className="text-[10px] text-slate-500 block">Thời hạn áp dụng biểu báo giá này</span>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                  Ngày
                </td>
                <td colSpan={columns.length} className="border-r border-slate-200 px-3 py-2">
                  <input
                    type="date"
                    value={data.validUntil || '2026-12-31'}
                    onChange={(e) => setData(prev => prev ? ({ ...prev, validUntil: e.target.value }) : prev)}
                    className="font-bold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                  />
                </td>
              </tr>

              {/* DÒNG: CHIẾT KHẤU HỢP ĐỒNG DÀI HẠN */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <span className="font-semibold text-xs text-slate-800">Ưu đãi / Chiết khấu hợp đồng dài hạn</span>
                  <span className="text-[10px] text-slate-500 block">Giảm giá cho hợp đồng từ 12 tháng trở lên</span>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                  % Giá trị
                </td>
                <td colSpan={columns.length} className="border-r border-slate-200 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={data.promotionPercent || 10}
                      onChange={(e) => setData(prev => prev ? ({ ...prev, promotionPercent: parseFloat(e.target.value) || 0 }) : prev)}
                      className="w-20 text-center font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                    />
                    <span className="text-xs font-bold text-slate-600">%</span>
                  </div>
                </td>
              </tr>

              {/* DÒNG: ĐIỀU KIỆN THANH TOÁN */}
              <tr className="hover:bg-slate-50/70 transition-colors">
                <td className="sticky left-0 z-20 bg-white border-r-2 border-slate-300 px-4 py-2 text-slate-900 shadow-[2px_0_5px_rgba(0,0,0,0.06)]">
                  <span className="font-semibold text-xs text-slate-800">Điều kiện thanh toán & kỳ hạn công nợ</span>
                  <span className="text-[10px] text-slate-500 block">Kỳ hạn đối soát & thanh toán hóa đơn</span>
                </td>
                <td className="border-r border-slate-200 px-3 py-2 text-center text-slate-600 font-medium bg-slate-50/40 text-[11px]">
                  Kỳ hạn
                </td>
                <td colSpan={columns.length} className="border-r border-slate-200 px-3 py-2">
                  <input
                    type="text"
                    value={data.paymentTerms || 'Net 30 ngày'}
                    onChange={(e) => setData(prev => prev ? ({ ...prev, paymentTerms: e.target.value }) : prev)}
                    className="w-full font-bold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
                    placeholder="Net 30 ngày"
                  />
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>

      {/* MODAL THÊM PHỤ PHÍ / VAS TÙY CHỈNH (CHO CẢ 1A, 1B, 2 - KHÔNG DÙNG WINDOW.PROMPT BỊ CHẶN BỞI IFRAME) */}
      {customModal.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className={`px-5 py-3.5 text-white flex items-center justify-between ${
              customModal.type === 'fixed' 
                ? 'bg-gradient-to-r from-amber-700 to-amber-900' 
                : customModal.type === 'vas' 
                  ? 'bg-gradient-to-r from-emerald-700 to-teal-900'
                  : 'bg-gradient-to-r from-indigo-700 to-slate-900'
            }`}>
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-300" />
                <h3 className="text-sm font-black tracking-tight">
                  {customModal.type === 'fixed' && 'Thêm Phụ Phí Cố Định Hàng Tháng'}
                  {customModal.type === 'variable' && 'Thêm Phụ Phí Biến Đổi Vận Hành'}
                  {customModal.type === 'vas' && 'Thêm Dịch Vụ Giá Trị Gia Tăng (VAS)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCustomModal(prev => ({ ...prev, isOpen: false }))}
                className="p-1 text-slate-300 hover:text-white rounded cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5">
              {/* Tên */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {customModal.type === 'fixed' && 'Tên phụ phí cố định (*):'}
                  {customModal.type === 'variable' && 'Tên phụ phí biến đổi (*):'}
                  {customModal.type === 'vas' && 'Tên dịch vụ VAS (*):'}
                </label>
                <input
                  type="text"
                  autoFocus
                  value={customModal.name}
                  onChange={(e) => setCustomModal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={
                    customModal.type === 'fixed'
                      ? 'VD: Phí kiểm đếm WMS & duy trì hệ thống'
                      : customModal.type === 'variable'
                        ? 'VD: Phí phân loại hàng lẻ, quấn màng co'
                        : 'VD: Dán nhãn phụ hàng hóa, đóng gói đặc biệt'
                  }
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs"
                />
              </div>

              {/* Đơn vị tính */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đơn vị tính (ĐVT):
                </label>
                <input
                  type="text"
                  value={customModal.unit}
                  onChange={(e) => setCustomModal(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="VD: VND / Tháng, VND / Lần, VND / Pallet..."
                  className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none mb-1.5 shadow-2xs"
                />
                <div className="flex flex-wrap gap-1 items-center">
                  <span className="text-[10px] text-slate-400 font-medium py-0.5">Gợi ý nhanh:</span>
                  {(customModal.type === 'fixed'
                    ? ['VND / Tháng', 'VND / Lần', 'VND / Xe / Tháng', 'VND / Quý', 'VND / Năm']
                    : customModal.type === 'variable'
                      ? ['VND / Pallet', 'VND / Kiện', 'VND / Tấn', 'VND / Cont', 'VND / Thùng']
                      : ['VND / Tem', 'VND / Hộp', 'VND / Kiện', 'VND / Pallet', 'VND / Lần']
                  ).map((quickUnit) => (
                    <button
                      key={quickUnit}
                      type="button"
                      onClick={() => setCustomModal(prev => ({ ...prev, unit: quickUnit }))}
                      className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 rounded border border-slate-200 transition-colors cursor-pointer"
                    >
                      {quickUnit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mức phí */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {customModal.type === 'fixed' ? 'Mức phí định kỳ (VND):' : 'Đơn giá dự kiến (VND):'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customModal.price ? parseInt(customModal.price.replace(/[^\d]/g, ''), 10).toLocaleString('vi-VN') : ''}
                    onChange={(e) => {
                      const num = parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0;
                      setCustomModal(prev => ({ ...prev, price: num.toString() }));
                    }}
                    placeholder="0"
                    className="w-full px-3 py-2 text-right pr-8 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">
                    {currencySymbol}
                  </span>
                </div>
              </div>

              {/* Ghi chú / Phạm vi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {customModal.type === 'vas' ? 'Cam kết SLA dịch vụ:' : 'Ghi chú / Phạm vi áp dụng (tùy chọn):'}
                </label>
                <input
                  type="text"
                  value={customModal.note}
                  onChange={(e) => setCustomModal(prev => ({ ...prev, note: e.target.value }))}
                  placeholder={
                    customModal.type === 'fixed'
                      ? 'VD: Áp dụng định kỳ ngày 1 hàng tháng'
                      : customModal.type === 'vas'
                        ? 'VD: Thời gian hoàn tất trong vòng 24h'
                        : 'VD: Theo thực tế khối lượng phát sinh'
                  }
                  className="w-full px-3 py-1.5 text-xs text-slate-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none shadow-2xs"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCustomModal(prev => ({ ...prev, isOpen: false }))}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveCustomItem}
                disabled={!customModal.name.trim()}
                className={`px-4 py-2 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-1.5 ${
                  customModal.type === 'fixed'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : customModal.type === 'vas'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Xác nhận thêm</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {isAddColumnModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-300" />
                <h3 className="text-sm font-black tracking-tight">Thêm Cột Đo Lường / Loại Hình Lưu Trữ</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddColumnModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn nhanh từ gợi ý tiêu chuẩn:
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {PRESET_WAREHOUSE_COLUMNS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNewColumnName(preset.name);
                        setNewColumnUnit(preset.unit);
                      }}
                      className="text-left px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-medium text-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="block font-bold text-[11px] text-indigo-950">{preset.name}</span>
                      <span className="text-[10px] text-slate-500">ĐVT: {preset.unit}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên cột đo lường / loại hình lưu trữ:
                  </label>
                  <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="VD: Kệ Drive-In (Pallet) hoặc Tải trọng sàn (Tấn)"
                    className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đơn vị tính (ĐVT):
                  </label>
                  <input
                    type="text"
                    value={newColumnUnit}
                    onChange={(e) => setNewColumnUnit(e.target.value)}
                    placeholder="VD: m², Pallet, m³, Tấn, Hộp..."
                    className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddColumnModalOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => handleAddColumn(newColumnName, newColumnUnit)}
                disabled={!newColumnName.trim()}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              >
                Xác nhận thêm cột
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
