import React from 'react';
import { Sparkles, Check, Plus, ShieldCheck } from 'lucide-react';

export interface VASItemDef {
  id: string;
  name: string;
  desc: string;
  tag?: string;
  popular?: boolean;
  freeTag?: string;
  isFreeOrIncluded?: boolean;
}

interface VASSectionProps {
  items: VASItemDef[];
  selectedVAS: string[];
  onToggleVAS: (name: string) => void;
  serviceTitle?: string;
  themeColor?: 'blue' | 'cyan' | 'teal' | 'sky' | 'emerald' | 'purple' | 'amber' | 'orange' | 'indigo';
}

export const VASSection: React.FC<VASSectionProps> = ({
  items,
  selectedVAS = [],
  onToggleVAS,
  serviceTitle = 'Dịch Vụ Giá Trị Gia Tăng (VAS)',
  themeColor = 'indigo',
}) => {
  const selectedInCurrentSection = items.filter((item) => selectedVAS.includes(item.name));

  const colorMap = {
    blue: {
      activeBorder: 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 text-blue-950',
      activeCheckbox: 'bg-blue-600 border-blue-600 text-white',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      headerBg: 'text-blue-900',
      tag: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    cyan: {
      activeBorder: 'border-cyan-600 bg-cyan-50/60 ring-2 ring-cyan-500/20 text-cyan-950',
      activeCheckbox: 'bg-cyan-600 border-cyan-600 text-white',
      badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      headerBg: 'text-cyan-900',
      tag: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    },
    teal: {
      activeBorder: 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-500/20 text-teal-950',
      activeCheckbox: 'bg-teal-600 border-teal-600 text-white',
      badge: 'bg-teal-100 text-teal-800 border-teal-200',
      headerBg: 'text-teal-900',
      tag: 'text-teal-700 bg-teal-50 border-teal-200',
    },
    sky: {
      activeBorder: 'border-sky-600 bg-sky-50/60 ring-2 ring-sky-500/20 text-sky-950',
      activeCheckbox: 'bg-sky-600 border-sky-600 text-white',
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      headerBg: 'text-sky-900',
      tag: 'text-sky-700 bg-sky-50 border-sky-200',
    },
    emerald: {
      activeBorder: 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 text-emerald-950',
      activeCheckbox: 'bg-emerald-600 border-emerald-600 text-white',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      headerBg: 'text-emerald-900',
      tag: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    purple: {
      activeBorder: 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20 text-purple-950',
      activeCheckbox: 'bg-purple-600 border-purple-600 text-white',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      headerBg: 'text-purple-900',
      tag: 'text-purple-700 bg-purple-50 border-purple-200',
    },
    amber: {
      activeBorder: 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20 text-amber-950',
      activeCheckbox: 'bg-amber-600 border-amber-600 text-white',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      headerBg: 'text-amber-900',
      tag: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    orange: {
      activeBorder: 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-500/20 text-orange-950',
      activeCheckbox: 'bg-orange-600 border-orange-600 text-white',
      badge: 'bg-orange-100 text-orange-800 border-orange-200',
      headerBg: 'text-orange-900',
      tag: 'text-orange-700 bg-orange-50 border-orange-200',
    },
    indigo: {
      activeBorder: 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 text-indigo-950',
      activeCheckbox: 'bg-indigo-600 border-indigo-600 text-white',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      headerBg: 'text-indigo-900',
      tag: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    },
  }[themeColor];

  return (
    <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              {serviceTitle}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-full">
              Đã chọn: {selectedInCurrentSection.length}/{items.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Tích chọn các tiện ích bổ sung tương ứng để đơn vị cung cấp dịch vụ bóc tách biểu phí minh bạch
          </p>
        </div>
      </div>

      {/* Grid of VAS Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((item) => {
          const isSelected = selectedVAS.includes(item.name);
          return (
            <div
              key={item.id}
              onClick={() => onToggleVAS(item.name)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 select-none ${
                isSelected
                  ? `${colorMap.activeBorder} shadow-2xs`
                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-700'
              }`}
            >
              {/* Checkbox box */}
              <div
                className={`w-4.5 h-4.5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected
                    ? colorMap.activeCheckbox
                    : 'border border-slate-300 bg-slate-50'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>

              {/* Text content - Only Title and Description */}
              <div className="flex-1 min-w-0">
                <span className={`block text-xs font-bold leading-snug ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
                  {item.name}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
