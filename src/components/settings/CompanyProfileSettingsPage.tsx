import React, { useState } from 'react';
import { 
  UserProfile, 
  CurrentView 
} from '../../types';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Truck, 
  Warehouse, 
  FileCheck, 
  CreditCard, 
  Save, 
  CheckCircle2, 
  Award, 
  ExternalLink 
} from 'lucide-react';

interface CompanyProfileSettingsPageProps {
  currentUser: UserProfile;
  onNavigate: (view: CurrentView) => void;
}

export const CompanyProfileSettingsPage: React.FC<CompanyProfileSettingsPageProps> = ({
  currentUser,
  onNavigate,
}) => {
  const [companyName, setCompanyName] = useState(currentUser.companyName);
  const [taxCode, setTaxCode] = useState('0314892019');
  const [businessType, setBusinessType] = useState('Joint Stock Company (JSC)');
  const [address, setAddress] = useState('Tan Binh Industrial Park, Ward 15, Tan Binh District, HCMC');
  const [hotline, setHotline] = useState('1900 6828');
  const [website, setWebsite] = useState('https://vinatranslogistics.com');
  const [fleetSize, setFleetSize] = useState('120+ Prime Movers & Heavy Trucks');
  const [warehouseSpace, setWarehouseSpace] = useState('35,000 sqm (Grade A Distribution Center)');
  const [bankAccount, setBankAccount] = useState('0071000982189 - Vietcombank (HCMC Branch)');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="cursor-pointer hover:text-indigo-600" onClick={() => onNavigate({ type: 'public', tab: 'home' })}>
              FlexGO
            </span>
            <span>/</span>
            <span className="font-semibold text-slate-700">Settings</span>
            <span>/</span>
            <span className="text-indigo-600 font-bold">Company Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-indigo-600" />
            <span>Enterprise Logistics & Corporate Profile</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Official enterprise registration, verified operational capabilities, billing details, and public directory badges.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate({ type: 'workspace', view: 'supplier-profile-edit' })}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0 self-start sm:self-auto"
        >
          <Award className="w-4 h-4 text-indigo-200" />
          <span>Hồ Sơ Năng Lực & Bảng Cước Khách Xem</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Verification Status Banner */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{companyName}</h3>
                <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase rounded-full">
                  Verified Tier 1
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Tax Code: <span className="font-mono">{taxCode}</span> • Business License Active & Audited
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-indigo-200 font-mono">Trust Score: 99.2%</span>
          </div>
        </div>

        {/* Legal & Corporate Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Corporate Legal Entity Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Registered Enterprise Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Enterprise Tax Identification (MST)</label>
              <input
                type="text"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Company Legal Form</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Official Company Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">Headquarters Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Operational Fleet & Capacity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-600" />
            <span>Operational Assets & Infrastructure</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Fleet Capacity</label>
              <input
                type="text"
                value={fleetSize}
                onChange={(e) => setFleetSize(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Warehouse Square Footage</label>
              <input
                type="text"
                value={warehouseSpace}
                onChange={(e) => setWarehouseSpace(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Billing & Bank Settlement Account */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span>Settlement Bank Account & Escrow Payouts</span>
          </h3>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Primary Settlement Bank Account</label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Used for automatic settlement of contract milestone escrows and shipper freight payments.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          {isSaved ? (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Company profile updated!
            </span>
          ) : (
            <span className="text-xs text-slate-400">Updates sync to the public Verified Directory.</span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Company Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
