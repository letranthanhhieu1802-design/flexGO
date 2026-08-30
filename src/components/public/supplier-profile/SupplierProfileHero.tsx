import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { SalesSpecialistProfile } from '../../../types';

interface SupplierProfileHeroProps {
  specialist: SalesSpecialistProfile;
  onOpenRFQ?: () => void;
  onOpenConsult?: () => void;
  onCopy?: (text: string, label: string) => void;
}

export const SupplierProfileHero: React.FC<SupplierProfileHeroProps> = ({
  specialist,
}) => {
  return (
    <div className="space-y-4">
      {/* =========================================================================
          1. BANNER FRAME (Khung Banner đại diện doanh nghiệp & phong cách vận hành)
         ========================================================================= */}
      <div className="relative h-36 sm:h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 shadow-md border border-slate-200/50">
        {/* Background decorative patterns & glow */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"></div>

        {/* Banner Content overlay */}
        <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md border border-white/15">
              <Building2 className="h-4 w-4 text-sky-400" />
              <span>{specialist.companyName}</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-400 font-medium">Hạ Tầng Logistics Chính Chủ</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2.5 py-1 font-bold text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Supplier Partner
              </span>
            </div>
          </div>

          <div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-sky-400">Logistics Solutions & Freight Management</p>
            <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 tracking-tight">
              Hồ Sơ Chuyên Viên Quản Lý Vận Tải Doanh Nghiệp
            </h2>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. PROFILE IDENTITY & SCRIPT GIỚI THIỆU
         ========================================================================= */}
      <div className="relative rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
          
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 font-black text-white shadow-md text-2xl sm:text-3xl ring-4 ring-white">
              {specialist.avatarInitial}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs ring-2 ring-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white"></span>
              ONLINE
            </div>
          </div>

          {/* Name & Introduction */}
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  {specialist.vietnameseName}
                </h1>
                <span className="text-sm sm:text-base font-medium text-slate-500">
                  ({specialist.name})
                </span>
              </div>

              {/* Title & Company */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm">
                <span className="font-bold text-blue-700">
                  {specialist.title}
                </span>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>{specialist.companyName}</span>
                </div>
              </div>
            </div>

            {/* Motto */}
            <blockquote className="rounded-xl bg-slate-50 p-3.5 border-l-4 border-blue-600 text-xs sm:text-sm text-slate-700 italic">
              "{specialist.motto.replace(/^["'“”]+|["'“”]+$/g, '')}"
            </blockquote>

            {/* Bio */}
            <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
              {specialist.bio}
            </p>

            {/* Core Specialties */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-500 mr-1">Thế mạnh cốt lõi:</span>
              {specialist.specialties.map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-50/80 px-2.5 py-1 text-xs font-medium text-blue-800 border border-blue-100"
                >
                  <CheckCircle2 className="h-3 w-3 text-blue-600" />
                  {spec}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
