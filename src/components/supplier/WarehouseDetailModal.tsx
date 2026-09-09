import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  Thermometer, 
  X, 
  Camera, 
  Sliders, 
  DollarSign, 
  Check, 
  CheckCircle2, 
  Send, 
  Plus, 
  Trash2, 
  Maximize2, 
  ShieldCheck, 
  ChevronRight, 
  Eye, 
  Upload,
  Save
} from 'lucide-react';
import { 
  WarehousePricingContinuousTable,
  WAREHOUSE_FREE_UTILITIES_SUGGESTIONS,
  COLD_FREE_UTILITIES_SUGGESTIONS,
  HAZMAT_FREE_UTILITIES_SUGGESTIONS,
  BONDED_GENERAL_FREE_UTILITIES_SUGGESTIONS,
  BONDED_COLD_FREE_UTILITIES_SUGGESTIONS,
  BONDED_HAZMAT_FREE_UTILITIES_SUGGESTIONS,
  SELF_GENERAL_FREE_UTILITIES_SUGGESTIONS,
  SELF_COLD_FREE_UTILITIES_SUGGESTIONS,
  SELF_HAZMAT_FREE_UTILITIES_SUGGESTIONS,
} from './WarehousePricingContinuousTable';
import {
  WarehouseDetailModalData,
  WarehousePhotoItem,
  WarehouseTechSpecs,
  getWarehousePhotoSlots,
  getWarehouseTechSpecCategories,
  CUSTOMS_AUTHORITIES_LOV,
  WAREHOUSE_SUGGESTED_SURCHARGES,
  COLD_WAREHOUSE_SUGGESTED_SURCHARGES,
  HAZMAT_WAREHOUSE_SUGGESTED_SURCHARGES,
  BONDED_GENERAL_SUGGESTED_SURCHARGES,
  BONDED_COLD_SUGGESTED_SURCHARGES,
  BONDED_HAZMAT_SUGGESTED_SURCHARGES,
  WAREHOUSE_SUGGESTED_VAS,
  COLD_WAREHOUSE_SUGGESTED_VAS,
  HAZMAT_WAREHOUSE_SUGGESTED_VAS,
  BONDED_GENERAL_SUGGESTED_VAS,
  BONDED_COLD_SUGGESTED_VAS,
  BONDED_HAZMAT_SUGGESTED_VAS,
} from './SupplierServiceCapabilityModal';

export interface WarehouseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WarehouseDetailModalData | null;
  onSave?: (savedData: WarehouseDetailModalData) => void;
  isReadOnly?: boolean;
  companyName?: string;
  onRequestQuote?: (data: WarehouseDetailModalData) => void;
  cargoGroupId?: string;
}

export const WarehouseDetailModal: React.FC<WarehouseDetailModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  isReadOnly = false,
  companyName,
  onRequestQuote,
  cargoGroupId,
}) => {
  const [localData, setLocalData] = useState<WarehouseDetailModalData | null>(data);
  const [activeTab, setActiveTab] = useState<'photos' | 'techSpecs' | 'pricing'>('photos');
  const [activeTechCategory, setActiveTechCategory] = useState<string>('structure');
  const [zoomedPhoto, setZoomedPhoto] = useState<WarehousePhotoItem | null>(null);
  const [activePhotoUploadSlot, setActivePhotoUploadSlot] = useState<{ key: string; label: string } | null>(null);
  const warehousePhotoUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalData(data);
    if (data) {
      const cats = getWarehouseTechSpecCategories(data.modelId, cargoGroupId);
      if (cats.length > 0) {
        setActiveTechCategory(cats[0].id);
      }
    }
  }, [data, cargoGroupId]);

  if (!isOpen || !localData) return null;

  const handleUploadWarehousePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly || !e.target.files || e.target.files.length === 0 || !activePhotoUploadSlot) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setLocalData(prev => {
        if (!prev) return prev;
        const filtered = prev.photos.filter(p => p.slotKey !== activePhotoUploadSlot.key && p.tag !== activePhotoUploadSlot.label);
        return {
          ...prev,
          photos: [
            ...filtered,
            {
              id: `ph-${Date.now()}`,
              url,
              name: activePhotoUploadSlot.label,
              tag: activePhotoUploadSlot.label,
              slotKey: activePhotoUploadSlot.key,
              isCover: filtered.length === 0,
            }
          ]
        };
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-hidden animate-in fade-in duration-150">
      <div className="w-full max-w-[96vw] 2xl:max-w-[1560px] h-[94vh] max-h-[95vh] bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-150">
            {/* 1. Modal Header */}
            <div className="px-5 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50 shrink-0 select-none">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shrink-0 shadow-inner">
                  <Building2 className="w-5 h-5 text-indigo-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Biểu Phí & Hồ Sơ Cơ Sở Kho</span>
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isReadOnly && onRequestQuote && (
                  <button
                    type="button"
                    onClick={() => onRequestQuote(localData)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Yêu Cầu Báo Giá Kho Này</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ROUTE / WAREHOUSE SUMMARY BREADCRUMB BANNER */}
            <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 select-none">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10.5px] font-bold text-slate-500 uppercase">Mã Kho:</span>
                  <span className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-xs shadow-2xs">
                    {localData.warehouseCode || 'WH-001'}
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[10.5px] font-bold text-slate-500 uppercase">Tên Kho:</span>
                  <strong className="text-slate-900 font-bold">{localData.warehouseName}</strong>
                </div>
                <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <span className="text-[10.5px] font-bold text-slate-500 uppercase">Vị Trí:</span>
                  <span className="text-slate-800 font-semibold">{localData.address}, {localData.province}</span>
                </div>
              </div>
            </div>

            {/* 2. Top Tab Bar - 3 Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-6 py-2.5 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto">
                {/* Tab 1: Album ảnh thực tế */}
                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'photos'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>1. Album Ảnh Thực Tế</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'photos' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {localData.photos.length}
                  </span>
                </button>

                {/* Tab 2: Thông số kỹ thuật, vận hành, tiện ích */}
                <button
                  type="button"
                  onClick={() => setActiveTab('techSpecs')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'techSpecs'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>2. Thông Số Kỹ Thuật, Vận Hành, Tiện Ích</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'techSpecs' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {getWarehouseTechSpecCategories(localData.modelId || (localData.modelId || 'wh-gen-std'), cargoGroupId).length} Nhóm
                  </span>
                </button>

                {/* Tab 3: Giá, phụ phí và vas */}
                <button
                  type="button"
                  onClick={() => setActiveTab('pricing')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'pricing'
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>3. Giá, Phụ Phí và VAS</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'pricing' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {localData.paidSurcharges.filter(s => s.isChecked).length + localData.vasItems.filter(v => v.isChecked).length} mục
                  </span>
                </button>
              </div>
            </div>

            {/* 3. Modal Body */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-slate-50/40">
              {/* TAB 1: ALBUM ẢNH KHO THEO TỪNG PHÂN LOẠI GÓC ẢNH GỢI Ý SẴN */}
              {activeTab === 'photos' && (() => {
                const currentPhotoSlots = getWarehousePhotoSlots(localData.modelId || (localData.modelId || 'wh-gen-std'), cargoGroupId);
                const uploadedCount = currentPhotoSlots.filter(s => 
                  localData.photos.some(p => p.tag === s.label || p.slotKey === s.key)
                ).length;

                return (
                  <div className="flex-1 min-h-0 p-6 overflow-y-auto space-y-5">
                    <input
                      type="file"
                      ref={warehousePhotoUploadRef}
                      accept="image/*"
                      disabled={isReadOnly} onChange={handleUploadWarehousePhotos}
                      className="hidden"
                    />

                    {/* Banner Tiêu Đề & Tiến Độ Hoàn Thiện */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                          <Camera className="w-4 h-4 text-indigo-600" />
                          <span>Hình Ảnh Thực Tế Theo Từng Phân Loại Góc Ảnh</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Tải ảnh thực tế vào đúng từng ô phân loại bên dưới tương ứng với mô hình kho này.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                          Đã hoàn thành: <span className="text-indigo-600 font-extrabold">{uploadedCount}</span> / {currentPhotoSlots.length} góc ảnh
                        </span>
                      </div>
                    </div>

                    {/* Pre-defined Slot Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4.5">
                      {currentPhotoSlots.map((slot) => {
                        const matchingPhoto = localData.photos.find(
                          (p) => p.tag === slot.label || p.slotKey === slot.key
                        );

                        return (
                          <div
                            key={slot.key}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col transition-all hover:border-slate-300"
                          >
                            {/* Slot Header / Fixed Caption */}
                            <div className="px-3.5 py-2.5 bg-slate-50/90 border-b border-slate-100">
                              <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                <span className="text-sm">{slot.icon}</span>
                                <span className="truncate">{slot.label}</span>
                              </h5>
                              <p className="text-[10px] text-slate-500 truncate mt-0.5" title={slot.description}>
                                {slot.description}
                              </p>
                            </div>

                            {/* Slot Upload / Preview Area */}
                            <div className="p-3.5 flex-1 flex flex-col justify-center">
                              {matchingPhoto ? (
                                <div className="space-y-2">
                                  {/* Uploaded Image Preview */}
                                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                                    <img
                                      src={matchingPhoto.url}
                                      alt={slot.label}
                                      className="w-full h-full object-cover"
                                    />
                                    
                                    {/* Action buttons on hover */}
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActivePhotoUploadSlot({ key: slot.key, label: slot.label });
                                          warehousePhotoUploadRef.current?.click();
                                        }}
                                        className="px-2.5 py-1 bg-white/95 hover:bg-white text-slate-800 text-[11px] font-bold rounded-lg shadow-sm transition-all cursor-pointer inline-flex items-center gap-1"
                                      >
                                        <Upload className="w-3 h-3" />
                                        <span>Đổi ảnh</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setLocalData((prev) => {
                                            if (!prev) return prev;
                                            return {
                                              ...prev,
                                              photos: prev.photos.filter((p) => p.tag !== slot.label && p.slotKey !== slot.key),
                                            };
                                          });
                                        }}
                                        className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm transition-all cursor-pointer"
                                        title="Xóa ảnh này"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Note input */}
                                  <input
                                    type="text"
                                    value={matchingPhoto.name === slot.label ? '' : matchingPhoto.name}
                                    disabled={isReadOnly} onChange={(e) => {
                                      const newName = e.target.value;
                                      setLocalData((prev) => {
                                        if (!prev) return prev;
                                        return {
                                          ...prev,
                                          photos: prev.photos.map((p) =>
                                            (p.tag === slot.label || p.slotKey === slot.key) ? { ...p, name: newName } : p
                                          ),
                                        };
                                      });
                                    }}
                                    placeholder="Ghi chú chi tiết góc chụp (tùy chọn)..."
                                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                              ) : (
                                /* Empty Upload Dropzone Box */
                                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/20 rounded-xl p-4 text-center transition-all flex flex-col items-center justify-center min-h-[145px]">
                                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                                    <Camera className="w-4 h-4" />
                                  </div>
                                  <p className="text-[11px] font-semibold text-slate-500 mb-2.5">
                                    Chưa có ảnh cho phân loại này
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActivePhotoUploadSlot({ key: slot.key, label: slot.label });
                                      warehousePhotoUploadRef.current?.click();
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                                  >
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Tải Ảnh Lên</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* TAB 2: 2-COLUMN MASTER-DETAIL TECH SPECS (CHỈ HIỂN THỊ CÁC THÔNG SỐ TƯƠNG ỨNG VỚI LOẠI KHO) */}
              {activeTab === 'techSpecs' && (() => {
                const currentModelId = localData.modelId || (localData.modelId || 'wh-gen-std');
                const techCategories = getWarehouseTechSpecCategories(currentModelId, cargoGroupId);
                const activeCatId = techCategories.some(c => c.id === activeTechCategory)
                  ? activeTechCategory
                  : (techCategories[0]?.id || 'structure');

                return (
                  <div className="flex-1 min-h-0 flex overflow-hidden">
                    {/* Left Column: Category Navigation (Tailored for this warehouse type) */}
                    <div className="w-64 shrink-0 bg-slate-50/90 border-r border-slate-200 p-3 overflow-y-auto space-y-1.5">
                      <div className="px-2 pb-1 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Nhóm Thông Số Kỹ Thuật
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-200">
                          {techCategories.length} Nhóm
                        </span>
                      </div>

                      {techCategories.map((cat) => {
                        const isActive = activeCatId === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setActiveTechCategory(cat.id)}
                            className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-2.5 ${
                              isActive
                                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                                : 'hover:bg-slate-200/70 text-slate-700'
                            }`}
                          >
                            <span className="text-base mt-0.5">{cat.icon}</span>
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                {cat.label}
                              </p>
                              <p className={`text-[10px] truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                                {cat.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column: Active Category Form Fields */}
                    <div className="flex-1 p-6 overflow-y-auto bg-white">
                      {/* =========================================================================
                          A. KHO THƯỜNG TIÊU CHUẨN (STANDARD GENERAL WAREHOUSE)
                      ========================================================================= */}
                      {activeCatId === 'structure' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🏗️</span> Kết Cấu Xây Dựng & Mặt Sàn Kho
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Khai báo các thông số cơ bản về độ cao, tải trọng và xử lý bề mặt sàn.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Chiều cao thông thủy trần (Clear Height)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="3"
                                  max="30"
                                  value={localData.techSpecs.clearHeight || 10.5}
                                  disabled={isReadOnly} onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, clearHeight: val } }) : prev);
                                  }}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Mét (m)</span>
                              </div>
                              <span className="text-[10px] text-slate-400">Kho chuẩn Grade A thường từ 9.0m - 14.0m</span>
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Tải trọng thiết kế mặt sàn (Floor Load)
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="1"
                                  max="20"
                                  value={localData.techSpecs.floorLoad || 5.0}
                                  disabled={isReadOnly} onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, floorLoad: val } }) : prev);
                                  }}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Tấn / m²</span>
                              </div>
                              <span className="text-[10px] text-slate-400">Tiêu chuẩn lưu kho thông thường: 3 - 5 tấn/m²</span>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Loại hoàn thiện mặt sàn (Floor Type)
                            </label>
                            <select
                              value={localData.techSpecs.floorType || 'Bê tông xoa Hardener chống bụi'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, floorType: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            >
                              <option value="Bê tông xoa Hardener chống bụi">Bê tông xoa phẳng phủ phụ gia Hardener (Chống bụi tiêu chuẩn)</option>
                              <option value="Bê tông sơn phủ Epoxy chống tĩnh điện">Bê tông sơn phủ Epoxy 3 lớp (Chống ẩm, kháng khuẩn, bụi tuyệt đối)</option>
                              <option value="Bê tông siêu phẳng Superflat chuyên dụng VNA">Bê tông siêu phẳng Superflat (Phù hợp xe nâng tầm cao VNA)</option>
                              <option value="Bê tông thường láng xi măng">Bê tông láng xi măng thông thường</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Khẩu độ bước cột (Column Grid)
                              </label>
                              <input
                                type="text"
                                value={localData.techSpecs.columnGrid || '12m × 18m'}
                                disabled={isReadOnly} onChange={(e) => {
                                  const val = e.target.value;
                                  setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, columnGrid: val } }) : prev);
                                }}
                                placeholder="VD: 12m × 18m, 18m × 24m hoặc Không cột"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Hệ thống thông gió làm mát
                              </label>
                              <input
                                type="text"
                                value={localData.techSpecs.ventilation || 'Quả cầu hút nhiệt & Lam gió tự nhiên'}
                                disabled={isReadOnly} onChange={(e) => {
                                  const val = e.target.value;
                                  setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, ventilation: val } }) : prev);
                                }}
                                placeholder="VD: Quạt trần HVLS, Quả cầu xoay, Quạt hút..."
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'racking' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📦</span> Hệ Thống Giá Kệ & Sức Chứa Pallet
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Chi tiết cấu hình kệ Racking, số tầng và giới hạn tải trọng mỗi vị trí pallet.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">
                              Các loại kệ Racking trang bị tại cơ sở:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {['Kệ Selective', 'Kệ Drive-in', 'Kệ Double Deep', 'Kệ Narrow Aisle (VNA)', 'Kệ Sàn Tầng Lửng (Mezzanine)', 'Sàn xếp khối Floor Block'].map((rack) => {
                                const list = localData.techSpecs.rackingTypes || [];
                                const isChecked = list.includes(rack);
                                return (
                                  <label
                                    key={rack}
                                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                      isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      disabled={isReadOnly} onChange={(e) => {
                                        const updated = e.target.checked
                                          ? [...list, rack]
                                          : list.filter(r => r !== rack);
                                        setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, rackingTypes: updated } }) : prev);
                                      }}
                                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-xs">{rack}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Số tầng kệ lưu trữ (Racking Levels)
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="15"
                                value={localData.techSpecs.rackingLevels || 5}
                                disabled={isReadOnly} onChange={(e) => {
                                  const val = parseInt(e.target.value) || 1;
                                  setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, rackingLevels: val } }) : prev);
                                }}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Tải trọng thiết kế tối đa mỗi Pallet
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="50"
                                  min="200"
                                  max="3000"
                                  value={localData.techSpecs.palletLoadLimit || 1000}
                                  disabled={isReadOnly} onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, palletLoadLimit: val } }) : prev);
                                  }}
                                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Kg / Pallet</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Quy cách kích thước Pallet tương thích:
                            </label>
                            <input
                              type="text"
                              value={(localData.techSpecs.compatiblePalletSizes || []).join(', ')}
                              disabled={isReadOnly} onChange={(e) => {
                                const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, compatiblePalletSizes: arr } }) : prev);
                              }}
                              placeholder="VD: 1.0m × 1.2m (ISO standard), 1.1m × 1.1m"
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {activeCatId === 'dock' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🚛</span> Cửa Dock Xuất Nhập & Sân Bãi Xe Container
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Cấu hình năng lực tiếp nhận xe tải lớn, container 20ft/40ft và cầu nâng thủy lực.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">
                                Số lượng cửa Dock bốc xếp
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={localData.techSpecs.dockDoorsCount || 6}
                                disabled={isReadOnly} onChange={(e) => {
                                  const val = parseInt(e.target.value) || 1;
                                  setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, dockDoorsCount: val } }) : prev);
                                }}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div className="space-y-2 pt-4">
                              <label className="flex items-center gap-2.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={localData.techSpecs.hasDockLeveler ?? true}
                                  disabled={isReadOnly} onChange={(e) => {
                                    const checked = e.target.checked;
                                    setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasDockLeveler: checked } }) : prev);
                                  }}
                                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-xs font-bold text-slate-800">Trang bị Cầu nâng thủy lực (Dock Leveler)</span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Không gian sân bãi quay đầu xe Container
                            </label>
                            <input
                              type="text"
                              value={localData.techSpecs.yardTurnaround || 'Sân bê tông rộng 35m, xe cont 40ft/45ft quay đầu dễ dàng 24/7'}
                              disabled={isReadOnly} onChange={(e) => {
                                const val = e.target.value;
                                setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, yardTurnaround: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Khung giờ tiếp nhận xe tải & Container
                            </label>
                            <input
                              type="text"
                              value={localData.techSpecs.operatingHoursTrucks || 'Tiếp nhận 24/7, không bị cấm giờ tải trọng'}
                              disabled={isReadOnly} onChange={(e) => {
                                const val = e.target.value;
                                setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, operatingHoursTrucks: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {activeCatId === 'fire' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔥</span> Hệ Thống Phòng Cháy Chữa Cháy (PCCC) & An Ninh
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Tiêu chuẩn an toàn PCCC và camera an ninh 24/7.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Hệ thống PCCC trang bị tại kho
                            </label>
                            <select
                              value={localData.techSpecs.fireProtectionSystem || 'PCCC tự động Sprinkler (Đã nghiệm thu PCCC)'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, fireProtectionSystem: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            >
                              <option value="PCCC tự động Sprinkler (Đã nghiệm thu PCCC)">Hệ thống PCCC tự động đầu phun Sprinkler (Chuẩn QCVN 06:2022)</option>
                              <option value="Họng nước vách tường & Hệ thống cảnh báo khói tự động">Họng nước vách tường & Đầu báo khói báo nhiệt tự động</option>
                              <option value="Bình bọt xách tay & Tiêu lệnh cơ bản">Bình chữa cháy xách tay và tiêu lệnh nội bộ</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Số biên bản / Giấy phép nghiệm thu PCCC (Nếu có)
                            </label>
                            <input
                              type="text"
                              value={localData.techSpecs.fireProtectionApprovalNo || 'Số 148/TD-PCCC cấp bởi Cảnh sát PCCC'}
                              disabled={isReadOnly} onChange={(e) => {
                                const val = e.target.value;
                                setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, fireProtectionApprovalNo: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Camera giám sát an ninh (CCTV)
                            </label>
                            <input
                              type="text"
                              value={localData.techSpecs.cctvSurveillance || 'CCTV 24/7 phủ kín lối đi & cửa dock, lưu trữ video 60 ngày'}
                              disabled={isReadOnly} onChange={(e) => {
                                const val = e.target.value;
                                setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, cctvSurveillance: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Lực lượng an ninh & Bảo vệ
                            </label>
                            <input
                              type="text"
                              value={localData.techSpecs.securityGuards || 'Bảo vệ chuyên nghiệp 2 lớp 24/7, cổng barie kiểm soát'}
                              disabled={isReadOnly} onChange={(e) => {
                                const val = e.target.value;
                                setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, securityGuards: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {activeCatId === 'wms' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>💻</span> Hệ Thống WMS Quản Lý Kho & Công Nghệ Số Hóa
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Số hóa vận hành, quản lý SKU và cổng thông tin khách hàng.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              Tên phần mềm Quản lý Kho (WMS) đang ứng dụng
                            </label>
                            <input
                              type="text"
                              value={localData.techSpecs.wmsSoftwareName || 'WMS Real-time Cloud'}
                              disabled={isReadOnly} onChange={(e) => {
                                const val = e.target.value;
                                setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, wmsSoftwareName: val } }) : prev);
                              }}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">
                              Công nghệ quét mã & Nhận diện:
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {['Barcode 1D/2D', 'Mã QR Code', 'RFID UHF Tự Động', 'Pick-to-Light'].map((tech) => {
                                const list = localData.techSpecs.scanningTechnologies || [];
                                const isChecked = list.includes(tech);
                                return (
                                  <label
                                    key={tech}
                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                      isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      disabled={isReadOnly} onChange={(e) => {
                                        const updated = e.target.checked ? [...list, tech] : list.filter(t => t !== tech);
                                        setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, scanningTechnologies: updated } }) : prev);
                                      }}
                                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{tech}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasApiIntegration ?? true}
                                disabled={isReadOnly} onChange={(e) => {
                                  const checked = e.target.checked;
                                  setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasApiIntegration: checked } }) : prev);
                                }}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Tích hợp API với ERP</span>
                                <span className="text-[11px] text-slate-500">Hỗ trợ REST API đồng bộ đơn hàng với SAP, Oracle, Odoo...</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.realtimeWebPortal ?? true}
                                disabled={isReadOnly} onChange={(e) => {
                                  const checked = e.target.checked;
                                  setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, realtimeWebPortal: checked } }) : prev);
                                }}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Web Portal cho Khách hàng</span>
                                <span className="text-[11px] text-slate-500">Theo dõi tồn kho real-time 24/7.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'cert' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📜</span> Giấy Phép, Tiêu Chuẩn Chất Lượng & Bảo Hiểm
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Các chứng nhận quốc tế chứng minh năng lực vận hành.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">
                              Các chứng nhận tiêu chuẩn chất lượng cơ sở đạt được:
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {['ISO 9001:2015', 'ISO 14001', 'LEED Gold', 'OHSAS 18001'].map((cert) => {
                                const list = localData.techSpecs.certifications || [];
                                const isChecked = list.includes(cert);
                                return (
                                  <label
                                    key={cert}
                                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                      isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      disabled={isReadOnly} onChange={(e) => {
                                        const updated = e.target.checked ? [...list, cert] : list.filter(c => c !== cert);
                                        setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, certifications: updated } }) : prev);
                                      }}
                                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{cert}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={localData.techSpecs.hasFullInsurance ?? true}
                              disabled={isReadOnly} onChange={(e) => {
                                const checked = e.target.checked;
                                setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasFullInsurance: checked } }) : prev);
                              }}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-emerald-950 block">Bảo hiểm kho bãi & Trách nhiệm dân sự 100%</span>
                              <span className="text-[11px] text-emerald-800">Cơ sở được mua bảo hiểm cháy nổ bắt buộc và bảo hiểm trách nhiệm trông coi hàng hóa 100%.</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* =========================================================================
                          B. KHO LẠNH & KHO MÁT (COLD STORAGE)
                      ========================================================================= */}
                      {activeCatId === 'cold_temperature' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>❄️</span> Kiểm Soát Dải Nhiệt Độ & Cụm Máy Lạnh
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Dải nhiệt độ, dàn lạnh, cảm biến IoT và máy phát điện dự phòng ATS.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Dải nhiệt độ duy trì</label>
                              <input
                                type="text"
                                value={localData.techSpecs.temperatureRange || '-25°C ~ -18°C (Đông) / +2°C ~ +8°C (Mát)'}
                                disabled={isReadOnly} onChange={(e) => {
                                  const val = e.target.value;
                                  setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, temperatureRange: val } }) : prev);
                                }}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Thương hiệu máy nén & dàn lạnh</label>
                              <input
                                type="text"
                                value={localData.techSpecs.coolingSystemBrand || 'Bitzer (Đức) / Dàn lạnh Guentner'}
                                disabled={isReadOnly} onChange={(e) => {
                                  const val = e.target.value;
                                  setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, coolingSystemBrand: val } }) : prev);
                                }}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasAutoDataLogger ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasAutoDataLogger: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Cảm biến IoT & Data Logger</span>
                                <span className="text-[11px] text-slate-500">Tự động ghi biểu đồ nhiệt độ và gửi cảnh báo SMS/Email 24/7.</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasBackupGeneratorAts ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasBackupGeneratorAts: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Máy phát điện tự động ATS</span>
                                <span className="text-[11px] text-slate-500">Tự động đóng điện ATS trong vòng 15 giây khi mất điện lưới.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'cold_structure' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🏗️</span> Kết Cấu Panel & Vỏ Kho Cách Nhiệt
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Panel PIR/PU, sưởi nền chống đông cứng và phòng đệm giữ nhiệt Anteroom.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Loại Panel cách nhiệt vỏ kho</label>
                            <input
                              type="text"
                              value={localData.techSpecs.insulationPanelType || 'Panel PIR chống cháy độ dày 125mm - 150mm'}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, insulationPanelType: e.target.value } }) : prev)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasUnderfloorHeating ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasUnderfloorHeating: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Sưởi nền chống đông băng</span>
                                <span className="text-[11px] text-slate-500">Hệ thống sưởi dưới đáy bê tông chống phù nề nứt sàn lạnh.</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasAnteroomFastDoor ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasAnteroomFastDoor: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Phòng đệm & Cửa cuốn nhanh</span>
                                <span className="text-[11px] text-slate-500">Phòng đệm Anteroom và cửa trượt cách nhiệt tốc độ cao.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'cold_racking' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📦</span> Giá Kệ Kho Lạnh & Quản Lý FIFO/FEFO
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Giá kệ chuyên dụng âm nhiệt và phần mềm quản lý hạn dùng hàng thực phẩm/nông sản.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Số tầng kệ kho lạnh</label>
                              <input
                                type="number"
                                value={localData.techSpecs.rackingLevels || 6}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, rackingLevels: parseInt(e.target.value) || 1 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Tải trọng pallet kho lạnh (kg)</label>
                              <input
                                type="number"
                                value={localData.techSpecs.palletLoadLimit || 1200}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, palletLoadLimit: parseInt(e.target.value) || 0 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={localData.techSpecs.hasFefoFifoWms ?? true}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasFefoFifoWms: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">WMS quản lý hạn sử dụng FEFO / FIFO tự động</span>
                              <span className="text-[11px] text-slate-500">Tự động cảnh báo cận date, ưu tiên xuất hàng theo hạn sử dụng và số lô sản xuất (Batch/Lot).</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {activeCatId === 'cold_dock' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🚛</span> Cửa Dock Lạnh & Đệm Khí Dock Shelter
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Tiếp nhận xe cont lạnh không bị thoát nhiệt ra môi trường ngoài.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Số lượng cửa Dock lạnh</label>
                              <input
                                type="number"
                                value={localData.techSpecs.dockDoorsCount || 8}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, dockDoorsCount: parseInt(e.target.value) || 1 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div className="pt-4 space-y-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={localData.techSpecs.hasDockShelter ?? true}
                                  disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasDockShelter: e.target.checked } }) : prev)}
                                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-xs font-bold text-slate-800">Trùm đệm khí cửa cont (Dock Shelter)</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'cold_fire' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔥</span> PCCC Kho Lạnh & An Toàn Vận Hành
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              PCCC Sprinkler đường ống khô và chốt mở cửa thoát hiểm khẩn cấp.
                            </p>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={localData.techSpecs.hasEmergencyChamberRelease ?? true}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasEmergencyChamberRelease: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Chốt an toàn mở cửa từ bên trong có sưởi nhiệt</span>
                              <span className="text-[11px] text-slate-500">Bảo đảm an toàn tuyệt đối cho nhân viên vận hành bên trong buồng lạnh âm sâu.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {activeCatId === 'cold_cert' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📜</span> Chứng Nhận An Toàn Thực Phẩm & Dược Phẩm
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              HACCP, ISO 22000, GDP Dược phẩm và bảo hiểm suy giảm chất lượng.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {['HACCP', 'ISO 22000', 'BRC Global Standard', 'GDP Dược Phẩm', 'GSP', 'VietGAP'].map((cert) => {
                              const list = localData.techSpecs.certifications || [];
                              const isChecked = list.includes(cert);
                              return (
                                <label
                                  key={cert}
                                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                    isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    disabled={isReadOnly} onChange={(e) => {
                                      const updated = e.target.checked ? [...list, cert] : list.filter(c => c !== cert);
                                      setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, certifications: updated } }) : prev);
                                    }}
                                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span>{cert}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* =========================================================================
                          C. KHO HÀNG NGUY HIỂM & HÓA CHẤT (HAZMAT STORAGE)
                      ========================================================================= */}
                      {activeCatId === 'haz_license' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>☣️</span> Giấy Phép & Phân Nhóm Hóa Chất Được Lưu Kho
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Giấy phép Sở Công Thương / Cục Hóa Chất và các Class nguy hiểm.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Số Giấy phép lưu trữ hóa chất</label>
                            <input
                              type="text"
                              value={localData.techSpecs.hazmatLicenseNo || 'Số 89/GP-HC do Sở Công Thương cấp'}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hazmatLicenseNo: e.target.value } }) : prev)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">Các Class nguy hiểm được phép lưu kho:</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {['Class 2 (Khí gas)', 'Class 3 (Chất lỏng dễ cháy)', 'Class 4 (Chất rắn dễ cháy)', 'Class 5 (Chất oxy hóa)', 'Class 8 (Chất ăn mòn)', 'Class 9 (Hàng nguy hiểm khác)'].map((cls) => {
                                const list = localData.techSpecs.permittedHazmatClasses || [];
                                const isChecked = list.includes(cls);
                                return (
                                  <label
                                    key={cls}
                                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                      isChecked ? 'bg-amber-50 border-amber-200 text-amber-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      disabled={isReadOnly} onChange={(e) => {
                                        const updated = e.target.checked ? [...list, cls] : list.filter(c => c !== cls);
                                        setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, permittedHazmatClasses: updated } }) : prev);
                                      }}
                                      className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500"
                                    />
                                    <span>{cls}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'haz_structure' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🏗️</span> Kết Cấu Cách Ly & Rãnh Chống Tràn Hóa Chất
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Sàn kháng axit/kiềm, rãnh gom sự cố và tường ngăn cách ly chống cháy.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasSpillContainment ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasSpillContainment: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Rãnh thu gom hóa chất và hố ga sự cố (Spill containment)</span>
                                <span className="text-[11px] text-slate-500">Ngăn chặn 100% rủi ro hóa chất tràn đổ ra cống thoát nước và môi trường xung quanh.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'haz_fire' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔥</span> PCCC Chuyên Dụng Bọt Foam / Khí CO2
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Hệ thống chữa cháy chuyên dụng cho hóa chất và quạt thông gió chống nổ.
                            </p>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={localData.techSpecs.hasExplosionProofFans ?? true}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasExplosionProofFans: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Quạt thông gió chống cháy nổ (Explosion-proof) 24/7</span>
                              <span className="text-[11px] text-slate-500">Hút khí độc và hơi dung môi liên tục, ngăn ngừa tạo môi trường nổ.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {activeCatId === 'haz_ppe' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🦺</span> Ứng Phó Sự Cố & Trang Bị Bảo Hộ (PPE)
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Trạm rửa mắt khẩn cấp, bộ Spill kit và nhân sự có chứng chỉ an toàn hóa chất.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasEmergencyEyewashShower ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasEmergencyEyewashShower: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Bồn rửa mắt & Vòi tắm khẩn cấp (Emergency Eyewash)</span>
                                <span className="text-[11px] text-slate-500">Sẵn sàng tại các vị trí lối thoát hiểm kho hóa chất.</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasCertifiedHazmatStaff ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasCertifiedHazmatStaff: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">100% Nhân sự có Chứng chỉ Huấn luyện An toàn Hóa chất</span>
                                <span className="text-[11px] text-slate-500">Đào tạo định kỳ theo Nghị định 113/2017/NĐ-CP.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'haz_security' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📜</span> An Ninh & Bảo Hiểm Ô Nhiễm Môi Trường
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Bảo hiểm trách nhiệm bồi thường sự cố môi trường và camera an ninh 24/7.
                            </p>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={localData.techSpecs.hasEnvironmentalInsurance ?? true}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasEnvironmentalInsurance: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Bảo hiểm trách nhiệm ô nhiễm môi trường & Cháy nổ hóa chất</span>
                              <span className="text-[11px] text-slate-500">Bồi thường thiệt hại bên thứ ba và xử lý sự cố tràn đổ hóa chất.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {/* =========================================================================
                          D. KHO NGOẠI QUAN (BONDED WAREHOUSE)
                      ========================================================================= */}
                      {activeCatId === 'bon_customs' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🏛️</span> Tiêu Chuẩn Hải Quan & Khu Biệt Lập
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Chi cục Hải quan quản lý, số quyết định thành lập và niêm phong biệt lập.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Chi cục Hải quan quản lý trực tiếp</label>
                              <input
                                type="text"
                                value={localData.techSpecs.customsAuthorityName || 'Chi cục Hải quan Cửa khẩu Cảng Cát Lái'}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, customsAuthorityName: e.target.value } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Số QĐ thành lập kho ngoại quan</label>
                              <input
                                type="text"
                                value={localData.techSpecs.bondedDecisionNo || 'Số 1205/QĐ-TCHQ'}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, bondedDecisionNo: e.target.value } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={localData.techSpecs.hasCustomsSealingArea ?? true}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasCustomsSealingArea: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Hàng rào cách ly kiên cố & Cửa niêm chì Hải quan</span>
                              <span className="text-[11px] text-slate-500">Đạt chuẩn giám sát theo quy định của Tổng cục Hải quan.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {activeCatId === 'bon_structure' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🏗️</span> Kết Cấu Kho & Sân Bãi Container Ngoại Quan
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Chiều cao, tải trọng sàn và khoảng cách kết nối tới cảng biển/cửa khẩu.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Cự ly tới Cảng biển / Cửa khẩu (km)</label>
                              <input
                                type="number"
                                value={localData.techSpecs.distanceToPortKm || 3.5}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, distanceToPortKm: parseFloat(e.target.value) || 0 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Chiều cao trần (m)</label>
                              <input
                                type="number"
                                value={localData.techSpecs.clearHeight || 11.5}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, clearHeight: parseFloat(e.target.value) || 0 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'bon_racking' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📦</span> Quản Lý Lưu Trữ Theo Tờ Khai Hải Quan
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Phân chia khu vực lưu trữ theo từng tờ khai và bàn kiểm hóa HQ.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Số tầng kệ Racking</label>
                              <input
                                type="number"
                                value={localData.techSpecs.rackingLevels || 5}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, rackingLevels: parseInt(e.target.value) || 1 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Tải trọng pallet (kg)</label>
                              <input
                                type="number"
                                value={localData.techSpecs.palletLoadLimit || 1000}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, palletLoadLimit: parseInt(e.target.value) || 0 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'bon_cctv' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>📹</span> Camera Giám Sát Hải Quan & Dữ Liệu VASSCM
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Camera 3 lớp lưu trữ tối thiểu 12 tháng và kết nối hệ thống VASSCM.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasCustomsDirectCctvFeed ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasCustomsDirectCctvFeed: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Truyền luồng hình ảnh Camera 24/7 trực tiếp về Chi cục HQ</span>
                                <span className="text-[11px] text-slate-500">Camera 3 lớp bao quát 100% cổng ra vào, cửa kho và từng dãy kệ hàng.</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasVasscmConnected ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasVasscmConnected: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">WMS kết nối Hệ thống Giám sát Tự động Hải quan (VASSCM)</span>
                                <span className="text-[11px] text-slate-500">Tự động đồng bộ trạng thái thông quan và trừ lùi tờ khai điện tử.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'bon_fire' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔥</span> PCCC & An Ninh Bảo Vệ Kho Ngoại Quan
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              PCCC nghiệm thu và cổng kiểm soát bảo vệ barie 2 lớp 24/7.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Hệ thống PCCC</label>
                            <input
                              type="text"
                              value={localData.techSpecs.fireProtectionSystem || 'PCCC tự động Sprinkler (Đã nghiệm thu PCCC)'}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, fireProtectionSystem: e.target.value } }) : prev)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* =========================================================================
                          E. KHO TMĐT / FULFILLMENT
                      ========================================================================= */}
                      {activeCatId === 'ful_capacity' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>⚡</span> Năng Lực Xử Lý Đơn Hàng & Pick-Pack
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Công suất xử lý đơn/ngày, số bàn đóng gói và SLA bàn giao đơn vị vận chuyển.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Công suất xử lý tối đa (Đơn / Ngày)</label>
                              <input
                                type="number"
                                value={localData.techSpecs.dailyOrderCapacity || 12000}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, dailyOrderCapacity: parseInt(e.target.value) || 0 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Số lượng bàn đóng gói (Packing Stations)</label>
                              <input
                                type="number"
                                value={localData.techSpecs.packingStationCount || 16}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, packingStationCount: parseInt(e.target.value) || 1 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Cam kết SLA bàn giao đơn hàng</label>
                            <input
                              type="text"
                              value={localData.techSpecs.fulfillmentSlaHours || 'Đóng gói & Bàn giao ĐVVC trong vòng 12 giờ'}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, fulfillmentSlaHours: e.target.value } }) : prev)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {activeCatId === 'ful_tech' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>💻</span> Tích Hợp Đa Sàn TMĐT & WMS/OMS
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Tự động kết nối API Shopee, TikTok Shop, Lazada và quét mã từng sản phẩm.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">Các sàn TMĐT đã tích hợp sẵn API:</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {['Shopee', 'TikTok Shop', 'Lazada', 'Tiki', 'Shopify', 'WooCommerce'].map((platform) => {
                                const list = localData.techSpecs.connectedEcommercePlatforms || ['Shopee', 'TikTok Shop', 'Lazada'];
                                const isChecked = list.includes(platform);
                                return (
                                  <label
                                    key={platform}
                                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                      isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      disabled={isReadOnly} onChange={(e) => {
                                        const updated = e.target.checked ? [...list, platform] : list.filter(p => p !== platform);
                                        setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, connectedEcommercePlatforms: updated } }) : prev);
                                      }}
                                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{platform}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={localData.techSpecs.hasItemBarcodeVerification ?? true}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasItemBarcodeVerification: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Quét Barcode kiểm tra từng món hàng (Item-level Scan)</span>
                              <span className="text-[11px] text-slate-500">Giảm tỷ lệ đóng nhầm hàng xuống dưới 0.05%.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {activeCatId === 'ful_reverse' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔄</span> Xử Lý Hàng Hoàn Trả (Reverse Logistics)
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Khu vực kiểm tra ngoại quan, phân loại và nhập lại tồn kho hàng hoàn.
                            </p>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={localData.techSpecs.hasReverseLogisticsArea ?? true}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasReverseLogisticsArea: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Bàn chuyên trách kiểm tra hàng hoàn & Nhập lại kho</span>
                              <span className="text-[11px] text-slate-500">Chụp ảnh đối soát bưu phẩm hư hỏng, cập nhật tồn kho real-time.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {activeCatId === 'ful_dock' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🚛</span> Cửa Giao Nhận Nhanh Đơn Vị Vận Chuyển
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Khu vực tiếp nhận xe tải nhỏ, xe van và nhân viên lấy hàng hỏa tốc.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-bold text-slate-700 block mb-1">Số lượng cửa giao nhận xe van/xe tải</label>
                              <input
                                type="number"
                                value={localData.techSpecs.dockDoorsCount || 6}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, dockDoorsCount: parseInt(e.target.value) || 1 } }) : prev)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'ful_fire' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔥</span> PCCC & Giám Sát An Ninh Bàn Đóng Gói
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Hệ thống camera soi từng bàn đóng hàng và PCCC tự động.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Camera soi bàn đóng gói (CCTV Packing)</label>
                            <input
                              type="text"
                              value={localData.techSpecs.cctvSurveillance || 'Camera Full HD soi 100% từng bàn đóng gói, lưu trữ 60 ngày'}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, cctvSurveillance: e.target.value } }) : prev)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* =========================================================================
                          F. KHO TỰ QUẢN (SELF-STORAGE)
                      ========================================================================= */}
                      {activeCatId === 'self_units' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🚪</span> Quy Cách Khoang Sàn Phân Lô
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Dải diện tích & thể tích khoang sàn tự quản và hệ thống cửa khóa riêng.
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">Các kích thước khoang phân lô có sẵn:</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {['Khoang 1m³ (Mini)', 'Khoang 3m³ (Nhỏ)', 'Khoang 6m³ (Vừa)', 'Khoang 12m³ (Lớn)', 'Khoang 20m³ (Đại)', 'Khoang 30m³ (Doanh nghiệp)'].map((vol) => {
                                const list = localData.techSpecs.unitVolumeRanges || ['Khoang 1m³ (Mini)', 'Khoang 3m³ (Nhỏ)', 'Khoang 6m³ (Vừa)', 'Khoang 12m³ (Lớn)'];
                                const isChecked = list.includes(vol);
                                return (
                                  <label
                                    key={vol}
                                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                                      isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      disabled={isReadOnly} onChange={(e) => {
                                        const updated = e.target.checked ? [...list, vol] : list.filter(v => v !== vol);
                                        setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, unitVolumeRanges: updated } }) : prev);
                                      }}
                                      className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>{vol}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'self_access' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔑</span> Ra Vào Tự Do 24/7 & Khóa Độc Lập
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Kiểm soát vào ra bằng thẻ từ/vân tay và khách hàng tự giữ khóa riêng.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.has247CardAccess ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, has247CardAccess: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Cổng kiểm soát ra vào 24/7 bằng Thẻ từ / Vân tay / Mã PIN</span>
                                <span className="text-[11px] text-slate-500">Khách hàng chủ động đến lấy/cất đồ bất kỳ lúc nào kể cả ngày lễ, ban đêm.</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasIndependentKeyLock ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasIndependentKeyLock: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Khách hàng giữ chìa khóa/mã số độc lập 100%</span>
                                <span className="text-[11px] text-slate-500">Nhân viên kho không giữ khóa, đảm bảo tính riêng tư tuyệt đối.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'self_amenities' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🧹</span> Tiện Ích Nội Bộ & Vật Tư Đóng Gói
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Xe đẩy bốc dỡ nội bộ miễn phí và máy hút ẩm chống ẩm mốc.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasFreeHandlingTrolleys ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasFreeHandlingTrolleys: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Xe đẩy hàng 4 bánh & Xe nâng tay miễn phí</span>
                                <span className="text-[11px] text-slate-500">Sẵn sàng tại lối vào để khách hàng di chuyển đồ đạc dễ dàng.</span>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                              <input
                                type="checkbox"
                                checked={localData.techSpecs.hasDehumidifierClimateControl ?? true}
                                disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasDehumidifierClimateControl: e.target.checked } }) : prev)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800 block">Hệ thống máy hút ẩm & Kiểm soát không khí sạch</span>
                                <span className="text-[11px] text-slate-500">Bảo vệ tài sản, sách vở, hồ sơ và đồ gia dụng không bị ẩm mốc.</span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}

                      {activeCatId === 'self_fire' && (
                        <div className="space-y-4 max-w-2xl">
                          <div className="border-b border-slate-100 pb-3">
                            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              <span>🔥</span> PCCC & Bảo Hiểm Tài Sản Khoang Tự Quản
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              PCCC tự động Sprinkler tại từng khoang và bảo hiểm tài sản cá nhân.
                            </p>
                          </div>

                          <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={localData.techSpecs.hasFullInsurance ?? true}
                              disabled={isReadOnly} onChange={(e) => setLocalData(prev => prev ? ({ ...prev, techSpecs: { ...prev.techSpecs, hasFullInsurance: e.target.checked } }) : prev)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                            />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block">Bảo hiểm cháy nổ & Mất mát tài sản khoang tự quản</span>
                              <span className="text-[11px] text-slate-500">Được bảo hiểm 100% theo hợp đồng thuê khoang.</span>
                            </div>
                          </label>
                        </div>
                      )}

                      {/* NHÓM TIỆN ÍCH MIỄN PHÍ ĐÃ DI CHUYỂN TỪ TAB 3 SANG TAB 2 */}
                      {activeCatId === 'utilities' && (
                        <div className="space-y-5 max-w-3xl animate-in fade-in duration-200">
                          <div className="border-b border-slate-200 pb-3.5 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                                <span>🎁</span> Tiện Ích & Dịch Vụ Miễn Phí (Bao Gồm Trong Giá Thuê)
                              </h4>
                              <p className="text-xs text-slate-500 mt-1">
                                Các dịch vụ phụ trợ, hạ tầng cơ sở và tiện ích được cung cấp miễn phí 100% cho khách hàng thuê kho.
                              </p>
                            </div>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
                              {localData.freeSurcharges.length} Tiện ích đã kích hoạt
                            </span>
                          </div>

                          {/* DANH SÁCH TIỆN ÍCH ĐANG ÁP DỤNG */}
                          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 shadow-2xs">
                            <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Đang Cung Cấp Miễn Phí ({localData.freeSurcharges.length}):</span>
                            </h5>
                            {localData.freeSurcharges.length === 0 ? (
                              <p className="text-xs text-slate-500 italic py-2">
                                Chưa có tiện ích miễn phí nào được chọn. Hãy tick chọn các tiện ích đề xuất bên dưới hoặc tự thêm mới.
                              </p>
                            ) : (
                              <div className="flex flex-wrap gap-2.5">
                                {localData.freeSurcharges.map((fName, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-2 bg-white text-emerald-950 px-3.5 py-1.5 rounded-xl text-xs font-bold border border-emerald-200 shadow-2xs group hover:border-emerald-300 transition-colors"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>{fName}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setLocalData(prev => prev ? ({
                                          ...prev,
                                          freeSurcharges: prev.freeSurcharges.filter(f => f !== fName)
                                        }) : prev);
                                      }}
                                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors ml-0.5"
                                      title="Xóa tiện ích này"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* BẢNG CHỌN TIỆN ÍCH TIÊU CHUẨN 3PL */}
                          <div>
                            <div className="flex items-center justify-between mb-2.5">
                              <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                                {localData.isBondedStorage
                                  ? (localData.isColdStorage
                                      ? 'Tiện Ích Miễn Phí Kho Ngoại Quan Lạnh & Kiểm Dịch (Tick để bật / tắt):'
                                      : (localData.isChemicalStorage
                                          ? 'Tiện Ích Miễn Phí Kho Ngoại Quan Hóa Chất (Tick để bật / tắt):'
                                          : 'Tiện Ích Miễn Phí Kho Ngoại Quan & CFS Tiêu Chuẩn (Tick để bật / tắt):'))
                                  : (localData.isColdStorage
                                      ? 'Tiện Ích Tiêu Chuẩn Chuỗi Lạnh (Tick để bật / tắt):'
                                      : (localData.isChemicalStorage
                                          ? 'Tiện Ích An Toàn Kho Hóa Chất & Nguy Hiểm (Tick để bật / tắt):'
                                          : 'Tiện Ích Tiêu Chuẩn 3PL Phổ Biến (Tick để bật / tắt):'))}
                              </h5>
                              <span className="text-[11px] text-slate-500">Bấm trực tiếp vào từng ô để kích hoạt nhanh</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {(localData.isBondedStorage
                                ? (localData.isColdStorage
                                    ? BONDED_COLD_FREE_UTILITIES_SUGGESTIONS
                                    : (localData.isChemicalStorage
                                        ? BONDED_HAZMAT_FREE_UTILITIES_SUGGESTIONS
                                        : BONDED_GENERAL_FREE_UTILITIES_SUGGESTIONS))
                                : (localData.isColdStorage
                                    ? COLD_FREE_UTILITIES_SUGGESTIONS
                                    : (localData.isChemicalStorage
                                        ? HAZMAT_FREE_UTILITIES_SUGGESTIONS
                                        : WAREHOUSE_FREE_UTILITIES_SUGGESTIONS))
                              ).map((utilName) => {
                                const isChecked = localData.freeSurcharges.includes(utilName);
                                return (
                                  <label
                                    key={utilName}
                                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                                      isChecked
                                        ? 'bg-emerald-50/80 border-emerald-400 text-emerald-950 shadow-xs font-bold'
                                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      disabled={isReadOnly} onChange={(e) => {
                                        if (e.target.checked) {
                                          setLocalData(prev => prev ? ({
                                            ...prev,
                                            freeSurcharges: [...prev.freeSurcharges, utilName]
                                          }) : prev);
                                        } else {
                                          setLocalData(prev => prev ? ({
                                            ...prev,
                                            freeSurcharges: prev.freeSurcharges.filter(f => f !== utilName)
                                          }) : prev);
                                        }
                                      }}
                                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 mt-0.5 accent-emerald-600"
                                    />
                                    <span className="text-xs leading-relaxed">{utilName}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* THÊM TIỆN ÍCH TÙY CHỈNH */}
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <h5 className="text-xs font-bold text-slate-800 mb-2.5">
                              Thêm Tiện Ích / Dịch Vụ Tùy Chỉnh Khác:
                            </h5>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                id="warehouse-custom-utility-input"
                                placeholder="VD: Miễn phí pallet gỗ tiêu chuẩn, Trà cà phê tiếp khách, Khu vực locker cá nhân..."
                                className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = (e.currentTarget.value || '').trim();
                                    if (val && !localData.freeSurcharges.includes(val)) {
                                      setLocalData(prev => prev ? ({
                                        ...prev,
                                        freeSurcharges: [...prev.freeSurcharges, val]
                                      }) : prev);
                                      e.currentTarget.value = '';
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById('warehouse-custom-utility-input') as HTMLInputElement;
                                  if (input && input.value.trim()) {
                                    const val = input.value.trim();
                                    if (!localData.freeSurcharges.includes(val)) {
                                      setLocalData(prev => prev ? ({
                                        ...prev,
                                        freeSurcharges: [...prev.freeSurcharges, val]
                                      }) : prev);
                                      input.value = '';
                                    }
                                  }
                                }}
                                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
                              >
                                + Thêm Tiện Ích
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* TAB 3: GIÁ, PHỤ PHÍ VÀ VAS (UNIFIED CONTINUOUS TABLE LIKE ROAD FREIGHT) */}
              {activeTab === 'pricing' && (
                <WarehousePricingContinuousTable
                  data={localData}
                  setData={setLocalData}
                  isReadOnly={isReadOnly}
                  surchargesLov={
                    localData.isBondedStorage
                      ? (localData.isColdStorage
                          ? BONDED_COLD_SUGGESTED_SURCHARGES
                          : (localData.isChemicalStorage
                              ? BONDED_HAZMAT_SUGGESTED_SURCHARGES
                              : BONDED_GENERAL_SUGGESTED_SURCHARGES))
                      : (localData.isColdStorage
                          ? COLD_WAREHOUSE_SUGGESTED_SURCHARGES
                          : (localData.isChemicalStorage
                              ? HAZMAT_WAREHOUSE_SUGGESTED_SURCHARGES
                              : WAREHOUSE_SUGGESTED_SURCHARGES))
                  }
                  vasLov={
                    localData.isBondedStorage
                      ? (localData.isColdStorage
                          ? BONDED_COLD_SUGGESTED_VAS
                          : (localData.isChemicalStorage
                              ? BONDED_HAZMAT_SUGGESTED_VAS
                              : BONDED_GENERAL_SUGGESTED_VAS))
                      : (localData.isColdStorage
                          ? COLD_WAREHOUSE_SUGGESTED_VAS
                          : (localData.isChemicalStorage
                              ? HAZMAT_WAREHOUSE_SUGGESTED_VAS
                              : WAREHOUSE_SUGGESTED_VAS))
                  }
                />
              )}
            </div>

            {/* 4. Modal Footer */}
            <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-end gap-2 shrink-0 shadow-lg select-none">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer"
              >
                {isReadOnly ? 'Đóng' : 'Hủy Bỏ'}
              </button>

              {isReadOnly ? (
                onRequestQuote && (
                  <button
                    type="button"
                    onClick={() => onRequestQuote(localData)}
                    className="inline-flex items-center gap-1.5 px-6 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow hover:shadow-emerald-600/30 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Yêu Cầu Báo Giá Kho Này</span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => onSave && onSave(localData)}
                  className="inline-flex items-center gap-1.5 px-6 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow hover:shadow-indigo-600/30 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Cấu Hình Biểu Phí</span>
                </button>
              )}
            </div>
          </div>
        </div>
  );
};
