import React from 'react';
import { CompanyType, CurrentView } from '../../types';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface RoleSwitcherBannerProps {
  currentType: CompanyType;
  onSwitch?: (type: CompanyType) => void;
  onSwitchRole?: (type: CompanyType) => void;
  currentView?: CurrentView;
}

export const RoleSwitcherBanner: React.FC<RoleSwitcherBannerProps> = ({
  currentType,
  onSwitch,
  onSwitchRole,
  currentView,
}) => {
  const handleSwitch = (type: CompanyType) => {
    if (onSwitchRole) onSwitchRole(type);
    else if (onSwitch) onSwitch(type);
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs py-1.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="font-semibold text-slate-200">Unified FlexGO Architecture:</span>
          <span className="text-slate-400 hidden md:inline">
            One platform & one account. Private workspace adapts based on company type.
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <span className="text-[11px] text-slate-400 font-medium px-2 hidden sm:inline">
            Active Persona:
          </span>
          <button
            id="role-banner-btn-customer"
            onClick={() => handleSwitch('CUSTOMER')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              currentType === 'CUSTOMER'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            Customer (ABC Mfg)
          </button>
          <button
            id="role-banner-btn-supplier"
            onClick={() => handleSwitch('SUPPLIER')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              currentType === 'SUPPLIER'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            Supplier (VinaTrans)
          </button>
          <button
            id="role-banner-btn-both"
            onClick={() => handleSwitch('BOTH')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              currentType === 'BOTH'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            Dual Role (Both)
          </button>
        </div>
      </div>
    </div>
  );
};

