import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Ship, 
  Plane, 
  Building2, 
  Users, 
  Flame, 
  BarChart3, 
  CheckCircle2, 
  Layers,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { CurrentView, UserPersona, PublicTab } from '../../types';

interface HomePageProps {
  currentUser: UserPersona;
  onNavigate: (view: CurrentView) => void;
  onOpenCreateInquiry: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentUser,
  onNavigate,
  onOpenCreateInquiry,
}) => {
  return (
    <div className="animate-in fade-in duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Tagline */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-xs font-semibold text-indigo-300 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Vietnam & Regional Logistics Ecosystem & Unified Workspace</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              One Logistics Network.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-indigo-300">
                Infinite Capacity.
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Connect directly with verified freight forwarders, carriers, and enterprise shippers. Seamlessly publish RFQs, negotiate itemized tariffs, and track opportunities within one unified platform.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                id="hero-create-inquiry-btn"
                onClick={onOpenCreateInquiry}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
              >
                <span>Post Freight Inquiry (RFQ)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-browse-leads-btn"
                onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 backdrop-blur-md transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Explore Live Lead Board</span>
              </button>
            </div>

            {/* Quick Workspace Switcher Prompt */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 text-xs text-indigo-200">
              <span>Logged in as <strong>{currentUser.companyName}</strong></span>
              <span className="text-slate-400">•</span>
              <span className="bg-indigo-600/40 px-2 py-0.5 rounded text-white font-mono">
                {currentUser.companyType} ACCOUNT
              </span>
              <span className="text-slate-400">•</span>
              <button
                onClick={() => {
                  if (currentUser.companyType === 'CUSTOMER') {
                    onNavigate({ type: 'workspace', view: 'customer-inquiries' });
                  } else if (currentUser.companyType === 'SUPPLIER') {
                    onNavigate({ type: 'workspace', view: 'supplier-leads' });
                  } else {
                    onNavigate({ type: 'workspace', view: 'dual-hub' });
                  }
                }}
                className="text-orange-300 font-bold hover:underline flex items-center space-x-1"
              >
                <span>Open Private Workspace</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2 Core Flows Showcase (Customer vs Supplier) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Card */}
          <div 
            id="home-customer-workflow-card"
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl flex flex-col justify-between hover:border-indigo-300 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                  For Shippers & Cargo Owners
                </span>
                <span className="text-xs font-mono text-slate-400">CUSTOMER FLOW</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Procure Freight with Decision Matrix Clarity
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Create structured multi-modal RFQs, receive itemized bids from verified logistics suppliers, and evaluate side-by-side using FlexGO's Quotation Comparison Matrix.
              </p>

              <div className="mt-4 space-y-2 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Interactive 4-step Inquiry creation with auto-calculated volume</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Itemized cost breakdowns: Base Freight, BAF, THC, EDI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Side-by-side best price, transit speed, and supplier rating metrics</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                id="launch-customer-inquiries-btn"
                onClick={() => onNavigate({ type: 'workspace', view: 'customer-inquiries' })}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>Launch Inquiries Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                id="launch-compare-quotes-btn"
                onClick={() => onNavigate({ type: 'workspace', view: 'customer-compare' })}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Open Quote Comparison
              </button>
            </div>
          </div>

          {/* Supplier Card */}
          <div 
            id="home-supplier-workflow-card"
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl flex flex-col justify-between hover:border-emerald-300 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                  For Forwarders & Carriers
                </span>
                <span className="text-xs font-mono text-slate-400">SUPPLIER FLOW</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Acquire High-Value Shippers & Drive Pipeline
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Discover matching freight inquiries on the Lead Board, submit competitive tariffs via the Quotation Builder, and manage deals inside a dedicated Opportunity Kanban CRM.
              </p>

              <div className="mt-4 space-y-2 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time logistics lead board with 90%+ matching scores</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Integrated tariff calculator for rapid formal quotes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mini CRM with 360° customer timeline and sales pipeline kanban</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                id="launch-supplier-leads-btn"
                onClick={() => onNavigate({ type: 'workspace', view: 'supplier-leads' })}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 cursor-pointer"
              >
                <span>Launch Supplier Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                id="launch-pipeline-btn"
                onClick={() => onNavigate({ type: 'workspace', view: 'supplier-pipeline' })}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Open Kanban Pipeline
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Public Discovery Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-2xl font-bold text-slate-900">
            Open Ecosystem Directory
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Explore verified network participants, active trade corridors, and public freight requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            onClick={() => onNavigate({ type: 'public', tab: 'lead-board' })}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Lead Board</h4>
            <p className="text-xs text-slate-500 mt-1">
              Browse live logistics inquiries published by manufacturers and trading corporations.
            </p>
            <span className="text-xs font-bold text-indigo-600 mt-4 inline-flex items-center space-x-1">
              <span>View Leads</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => onNavigate({ type: 'public', tab: 'hot-promotion' })}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Hot Promotion</h4>
              <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-rose-100 text-rose-600 rounded-full animate-pulse">
                HOT
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Sàn cước khuyến mãi, tuyến chiều về giảm đến 30% và các ưu đãi dịch vụ trực tiếp từ PIC.
            </p>
            <span className="text-xs font-bold text-orange-600 mt-4 inline-flex items-center space-x-1">
              <span>Săn Khuyến Mãi</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => onNavigate({ type: 'public', tab: 'supplier-profile' })}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Supplier Profiles</h4>
            <p className="text-xs text-slate-500 mt-1">
              Explore verified specialists, fleet specifications, warehouse footprints, and audited ratings.
            </p>
            <span className="text-xs font-bold text-indigo-600 mt-4 inline-flex items-center space-x-1">
              <span>Explore Specialists</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div 
            onClick={() => onNavigate({ type: 'public', tab: 'company' })}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">FlexGO Company Hub</h4>
            <p className="text-xs text-slate-500 mt-1">
              Khám phá sứ mệnh, bảng giá gói dịch vụ, cẩm nang logistics, công cụ tính CBM và tiêu chuẩn bảo mật.
            </p>
            <span className="text-xs font-bold text-indigo-600 mt-4 inline-flex items-center space-x-1">
              <span>About & Pricing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
