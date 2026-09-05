import React, { useState } from 'react';
import { Layers, Plus, X, ChevronDown, Sparkles } from 'lucide-react';
import { 
  LOGISTICS_INDUSTRY_LOV, 
  IndustryOption 
} from '../../customer/CreateInquiryModal';
import { ThemeColorOption } from './studioTypes';

interface IndustryVerticalsSectionProps {
  selectedIndustryIds?: string[];
  onChange: (ids: string[]) => void;
  isReadOnly?: boolean;
  theme: ThemeColorOption;
  title?: string;
  className?: string;
}

export const IndustryVerticalsSection: React.FC<IndustryVerticalsSectionProps> = ({
  selectedIndustryIds = [],
  onChange,
  isReadOnly = false,
  theme,
  title = 'Nhóm Ngành Hàng Chuyên Sâu',
  className = '',
}) => {
  const [selectedLovId, setSelectedLovId] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Helper to resolve display name
  const getIndustryName = (idOrName: string) => {
    const found = LOGISTICS_INDUSTRY_LOV.find((item) => item.id === idOrName);
    return found ? found.name : idOrName;
  };

  // Options that haven't been selected yet
  const availableOptions = LOGISTICS_INDUSTRY_LOV.filter(
    (item) => !selectedIndustryIds.includes(item.id)
  );

  // Add an industry from LOV
  const handleAddFromLov = () => {
    if (isReadOnly || !selectedLovId) return;
    if (selectedLovId === '__custom__') {
      setIsCustomMode(true);
      return;
    }
    if (!selectedIndustryIds.includes(selectedLovId)) {
      onChange([...selectedIndustryIds, selectedLovId]);
      setSelectedLovId('');
    }
  };

  // Add custom industry
  const handleAddCustom = () => {
    if (isReadOnly || !customInput.trim()) return;
    const trimmed = customInput.trim();
    if (!selectedIndustryIds.includes(trimmed)) {
      onChange([...selectedIndustryIds, trimmed]);
    }
    setCustomInput('');
    setIsCustomMode(false);
    setSelectedLovId('');
  };

  // Remove an industry
  const handleRemove = (idOrName: string) => {
    if (isReadOnly) return;
    onChange(selectedIndustryIds.filter((id) => id !== idOrName));
  };

  // Clear all
  const handleClearAll = () => {
    if (isReadOnly) return;
    onChange([]);
  };

  // =========================================================================
  // READ-ONLY / LIVE PREVIEW VIEW
  // =========================================================================
  if (isReadOnly) {
    if (selectedIndustryIds.length === 0) {
      return null;
    }

    return (
      <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-xs ${className}`}>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>{title}</span>
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600">
            {selectedIndustryIds.length} Ngành hàng
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {selectedIndustryIds.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shadow-2xs"
              style={{
                backgroundColor: `${theme.primary}0D`,
                borderColor: `${theme.primary}30`,
                color: theme.primary,
              }}
            >
              <span className="text-amber-500 font-bold">★</span>
              <span>{getIndustryName(id)}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // EDIT / STUDIO DROPDOWN LOV SELECTOR VIEW
  // =========================================================================
  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {title}
            </h3>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Đã chọn: {selectedIndustryIds.length} ngành hàng
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chọn ngành hàng chuyên sâu từ danh mục LOV bên dưới để thêm vào hồ sơ năng lực của bạn.
          </p>
        </div>

        {selectedIndustryIds.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="self-start sm:self-auto px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* LOV Dropdown Selector Row */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
        {!isCustomMode ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <select
                value={selectedLovId}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsCustomMode(true);
                    setSelectedLovId('');
                  } else {
                    setSelectedLovId(e.target.value);
                  }
                }}
                className="w-full pl-3.5 pr-10 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-hidden transition-all appearance-none cursor-pointer"
              >
                <option value="">-- Chọn ngành hàng từ danh mục LOV --</option>
                {availableOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
                <option value="__custom__">+ Khác (Nhập ngành hàng đặc thù...)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={handleAddFromLov}
              disabled={!selectedLovId}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                selectedLovId
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              style={selectedLovId ? { backgroundColor: theme.primary } : undefined}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm ngành hàng</span>
            </button>
          </div>
        ) : (
          /* Custom Industry Input Mode */
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <input
              type="text"
              autoFocus
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustom();
                }
              }}
              placeholder="Nhập tên ngành hàng chuyên sâu của bạn..."
              className="flex-1 px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-white border border-indigo-400 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-hidden"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleAddCustom}
                disabled={!customInput.trim()}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  customInput.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                style={customInput.trim() ? { backgroundColor: theme.primary } : undefined}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(false);
                  setCustomInput('');
                }}
                className="px-3 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Industries Chips / Badges */}
      <div>
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Danh sách ngành hàng đã chọn ({selectedIndustryIds.length}):
        </div>

        {selectedIndustryIds.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {selectedIndustryIds.map((id) => (
              <div
                key={id}
                className="inline-flex items-center gap-2 pl-3.5 pr-2 py-2 rounded-xl text-xs font-bold border transition-all shadow-2xs group"
                style={{
                  backgroundColor: `${theme.primary}0D`,
                  borderColor: `${theme.primary}30`,
                  color: theme.primary,
                }}
              >
                <span className="text-amber-500 font-bold">★</span>
                <span>{getIndustryName(id)}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(id)}
                  className="p-1 rounded-lg hover:bg-rose-100/80 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer ml-1"
                  title="Xóa ngành hàng này"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400 bg-slate-50/50">
            Chưa có ngành hàng nào được chọn. Hãy chọn ngành hàng từ danh mục LOV ở trên và nhấn nút <strong className="text-slate-600">"Thêm ngành hàng"</strong>.
          </div>
        )}
      </div>
    </div>
  );
};
