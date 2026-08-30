import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Download, 
  FileCheck, 
  Truck, 
  Scale, 
  Warehouse, 
  Percent, 
  BarChart3, 
  Search, 
  Package, 
  Clock, 
  TrendingDown, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  Ship, 
  Snowflake, 
  Calculator,
  ChevronRight,
  Filter,
  Globe2,
  Anchor,
  Compass,
  CheckSquare,
  Square,
  Sparkles,
  Plane
} from 'lucide-react';
import { SalesSpecialistProfile, InternationalTradeLaneRegion } from '../../../types';
import { MAIN_INTERNATIONAL_TRADE_LANES } from '../../../data/tradeLanesData';

interface SupplierProfilePricingTabProps {
  specialist: SalesSpecialistProfile;
  onOpenRFQForRate: (rateItem: any) => void;
  onOpenConsult: () => void;
  onDownloadRateSheet: (type: 'rateSheet' | 'contractTemplate') => void;
}

export const SupplierProfilePricingTab: React.FC<SupplierProfilePricingTabProps> = ({
  specialist,
  onOpenRFQForRate,
  onOpenConsult,
  onDownloadRateSheet,
}) => {
  // Pricing Sub-Tabs: 'routes' | 'surcharges' | 'warehousing' | 'tiers' | 'modalCompare'
  const [pricingSubTab, setPricingSubTab] = useState<'routes' | 'surcharges' | 'warehousing' | 'tiers' | 'modalCompare'>('routes');

  // Rate Card Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTradeLanes, setSelectedTradeLanes] = useState<string[]>([]);
  const [rateSearchTerm, setRateSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'timeFastest'>('popular');

  // Trade Lane Checkbox Toggle Handler
  const toggleTradeLane = (laneId: string) => {
    setSelectedTradeLanes((prev) => 
      prev.includes(laneId) ? prev.filter((id) => id !== laneId) : [...prev, laneId]
    );
  };

  const handleSelectAllTradeLanes = () => {
    if (selectedTradeLanes.length === MAIN_INTERNATIONAL_TRADE_LANES.length + 1) {
      setSelectedTradeLanes([]);
    } else {
      setSelectedTradeLanes([...MAIN_INTERNATIONAL_TRADE_LANES.map(l => l.id), 'Domestic']);
    }
  };

  // Quick Freight Estimator State
  const [calcService, setCalcService] = useState<'Trucking' | 'Ocean' | 'ColdChain' | 'Air'>('Trucking');
  const [calcOrigin, setCalcOrigin] = useState<string>('HCMC');
  const [calcDest, setCalcDest] = useState<string>('Hanoi');
  const [calcWeightTons, setCalcWeightTons] = useState<number>(15);
  const [calcTripType, setCalcTripType] = useState<'oneWay' | 'roundTrip' | 'backhaul'>('oneWay');
  const [calcDropPoints, setCalcDropPoints] = useState<number>(1);
  const [calcInsurance, setCalcInsurance] = useState<boolean>(true);
  const [calcGPS, setCalcGPS] = useState<boolean>(true);
  const [calcLoadingSupport, setCalcLoadingSupport] = useState<boolean>(false);

  // Filtered & Sorted Rate Card items
  const filteredRateCards = useMemo(() => {
    let list = specialist.rateCard.filter((item) => {
      // Category filter
      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      
      // Trade Lane filter
      const matchesTradeLane = 
        selectedTradeLanes.length === 0 || 
        (item.tradeLaneRegion && selectedTradeLanes.includes(item.tradeLaneRegion)) ||
        (!item.tradeLaneRegion && selectedTradeLanes.includes('Domestic'));

      // Search text filter
      const term = rateSearchTerm.toLowerCase().trim();
      const matchesSearch = !term || 
        item.routeOrService.toLowerCase().includes(term) ||
        item.vehicleOrUnit.toLowerCase().includes(term) ||
        item.priceNotes.toLowerCase().includes(term) ||
        (item.shippingLine && item.shippingLine.toLowerCase().includes(term)) ||
        (item.pol && item.pol.toLowerCase().includes(term)) ||
        (item.pod && item.pod.toLowerCase().includes(term)) ||
        (item.distanceKm && item.distanceKm.toLowerCase().includes(term));

      return matchesCat && matchesTradeLane && matchesSearch;
    });

    if (sortBy === 'popular') {
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    } else if (sortBy === 'priceAsc') {
      list.sort((a, b) => a.benchmarkPriceVND - b.benchmarkPriceVND);
    } else if (sortBy === 'priceDesc') {
      list.sort((a, b) => b.benchmarkPriceVND - a.benchmarkPriceVND);
    } else if (sortBy === 'timeFastest') {
      list.sort((a, b) => (a.transitTime.includes('Giờ') ? -1 : 1));
    }

    return list;
  }, [specialist, selectedCategory, selectedTradeLanes, rateSearchTerm, sortBy]);

  // Instant Rate Calculator formula with itemized receipt breakdown
  const calculatedEstimate = useMemo(() => {
    let baseFreight = 0;
    let tollsAndFuel = 0;
    let time = '2 - 3 Ngày';
    let distance = '1,720 km';
    
    if (calcService === 'Trucking') {
      if (calcOrigin === 'HCMC' && calcDest === 'Hanoi') {
        baseFreight = calcWeightTons <= 5 ? 12000000 : calcWeightTons <= 10 ? 19000000 : 28000000;
        tollsAndFuel = calcWeightTons <= 5 ? 6000000 : calcWeightTons <= 10 ? 9000000 : 14000000;
        time = '48 Giờ (2 Ngày)';
        distance = '1,720 km';
      } else if (calcOrigin === 'HCMC' && calcDest === 'DaNang') {
        baseFreight = calcWeightTons <= 5 ? 7500000 : calcWeightTons <= 10 ? 11000000 : 16000000;
        tollsAndFuel = calcWeightTons <= 5 ? 3500000 : calcWeightTons <= 10 ? 5000000 : 8000000;
        time = '24 - 30 Giờ';
        distance = '960 km';
      } else {
        baseFreight = calcWeightTons <= 5 ? 2500000 : calcWeightTons <= 10 ? 3800000 : 5800000;
        tollsAndFuel = calcWeightTons <= 5 ? 1000000 : calcWeightTons <= 10 ? 1700000 : 2700000;
        time = 'Trong ngày (4 - 8 Giờ)';
        distance = '65 - 180 km';
      }
    } else if (calcService === 'ColdChain') {
      if (calcOrigin === 'HCMC' && calcDest === 'Hanoi') {
        baseFreight = calcWeightTons <= 5 ? 18000000 : calcWeightTons <= 10 ? 26000000 : 38000000;
        tollsAndFuel = calcWeightTons <= 5 ? 8000000 : calcWeightTons <= 10 ? 12000000 : 18000000;
        time = '48 Giờ (Đông sâu -18°C)';
        distance = '1,720 km';
      } else {
        baseFreight = calcWeightTons <= 5 ? 3800000 : calcWeightTons <= 10 ? 6800000 : 10000000;
        tollsAndFuel = calcWeightTons <= 5 ? 1700000 : calcWeightTons <= 10 ? 3000000 : 4500000;
        time = 'Trong ngày';
        distance = '120 - 300 km';
      }
    } else if (calcService === 'Ocean') {
      baseFreight = calcOrigin === 'HCMC' && calcDest === 'Hanoi' ? 6200000 : 58000000;
      tollsAndFuel = calcOrigin === 'HCMC' && calcDest === 'Hanoi' ? 2300000 : 13500000;
      time = calcOrigin === 'HCMC' && calcDest === 'Hanoi' ? '3 - 4 Ngày' : '17 - 22 Ngày';
      distance = calcOrigin === 'HCMC' && calcDest === 'Hanoi' ? '920 Hải lý (Biển)' : '6,200 Hải lý (US)';
    } else if (calcService === 'Air') {
      const kg = calcWeightTons * 1000;
      baseFreight = kg * 22000;
      tollsAndFuel = kg * 6000;
      time = '6 - 12 Giờ (Next-Flight-Out)';
      distance = '1,160 km Đường bay';
    }

    let subtotal = baseFreight + tollsAndFuel;

    // Backhaul discount / Roundtrip logic
    let discount = 0;
    if (calcTripType === 'backhaul') {
      discount = subtotal * 0.35; // Giảm 35% cho chiều về xe rỗng
    } else if (calcTripType === 'roundTrip') {
      subtotal = subtotal * 1.65; // Khứ hồi tiết kiệm 35%
    }

    // Add-on fees
    let insuranceFee = 0;
    if (calcInsurance) {
      insuranceFee = Math.max(300000, subtotal * 0.012); // 1.2% bảo hiểm
    }

    let iotFee = calcGPS ? 350000 : 0;
    let loadingFee = calcLoadingSupport ? (calcWeightTons <= 5 ? 600000 : calcWeightTons <= 10 ? 1200000 : 2000000) : 0;
    let extraDropFee = (calcDropPoints - 1) * 500000;

    const totalBeforeVAT = subtotal - discount + insuranceFee + iotFee + loadingFee + extraDropFee;
    const vatAmount = totalBeforeVAT * 0.08;
    const finalTotal = totalBeforeVAT + vatAmount;

    return {
      baseFreight: Math.round(baseFreight),
      tollsAndFuel: Math.round(tollsAndFuel),
      discount: Math.round(discount),
      insuranceFee: Math.round(insuranceFee),
      iotFee: Math.round(iotFee),
      loadingFee: Math.round(loadingFee),
      extraDropFee: Math.round(extraDropFee),
      totalBeforeVAT: Math.round(totalBeforeVAT),
      vatAmount: Math.round(vatAmount),
      finalTotal: Math.round(finalTotal),
      priceDisplay: `${Math.round(finalTotal).toLocaleString('vi-VN')} VND`,
      time,
      distance,
      savingsNote: calcTripType === 'backhaul' 
        ? '⚡ Đã áp dụng chiết khấu 35% cho tuyến chiều về xe rỗng!'
        : 'Cam kết giá benchmark niêm yết cố định, không phát sinh phụ phí.'
    };
  }, [calcService, calcOrigin, calcDest, calcWeightTons, calcTripType, calcDropPoints, calcInsurance, calcGPS, calcLoadingSupport]);

  return (
    <div id="supplier-profile-pricing-tab" className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header with PDF Downloads */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Receipt className="h-4 w-4" />
            <span>Biểu Cước Minh Bạch & Tuyến Vận Chuyển Quốc Tế</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Bảng Giá Niêm Yết Theo Tuyến & Dịch Vụ Logistics
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Đơn giá được áp dụng trực tiếp từ {specialist.companyName} • Cam kết 100% không phát sinh chi phí ẩn
          </p>
        </div>

        {/* Action Buttons: Download PDF Rate Card & Sample Contract */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onDownloadRateSheet('rateSheet')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4 text-blue-600" />
            <span>Tải Bảng Giá PDF (2026)</span>
          </button>

          <button
            onClick={() => onDownloadRateSheet('contractTemplate')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
          >
            <FileCheck className="h-4 w-4 text-emerald-600" />
            <span>Mẫu Hợp Đồng Vận Chuyển</span>
          </button>
        </div>
      </div>

      {/* Pricing Sub-Tabs Navigation */}
      <div className="border-b border-slate-200 bg-white rounded-xl p-1.5 shadow-2xs flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setPricingSubTab('routes')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            pricingSubTab === 'routes'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>1. Tuyến Vận Tải Quốc Tế & Nội Địa ({specialist.rateCard.length} Tuyến)</span>
        </button>

        <button
          onClick={() => setPricingSubTab('surcharges')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            pricingSubTab === 'surcharges'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Scale className="h-4 w-4" />
          <span>2. Biểu Phí Phụ Thu & Local Charges</span>
        </button>

        <button
          onClick={() => setPricingSubTab('warehousing')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            pricingSubTab === 'warehousing'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Warehouse className="h-4 w-4" />
          <span>3. Kho Bãi & Dịch Vụ 3PL</span>
        </button>

        <button
          onClick={() => setPricingSubTab('tiers')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            pricingSubTab === 'tiers'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Percent className="h-4 w-4" />
          <span>4. Chiết Khấu Sản Lượng & Công Nợ</span>
        </button>

        <button
          onClick={() => setPricingSubTab('modalCompare')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
            pricingSubTab === 'modalCompare'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>5. So Sánh Phương Thức Vận Tải</span>
        </button>
      </div>

      {/* Main Grid: 2/3 Content + 1/3 Quick Freight Estimator */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left 2 Cols: The Selected Detailed Sub-Tab */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* =========================================================================
              SUB-TAB 1: FREIGHT ROUTES RATE CARD (WITH 7 MAIN TRADE LANES)
             ========================================================================= */}
          {pricingSubTab === 'routes' && (
            <div className="space-y-5">
              
              {/* =========================================================================
                  CÁC TUYẾN CHÍNH (7 MAIN INTERNATIONAL TRADE LANES) WIDGET
                 ========================================================================= */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-blue-600" />
                    <h4 className="text-sm font-black text-slate-900">
                      Các tuyến chính
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      (17,208+ tuyến kết nối toàn cầu)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectAllTradeLanes}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {selectedTradeLanes.length === MAIN_INTERNATIONAL_TRADE_LANES.length + 1 ? 'Bỏ chọn tất cả' : 'Chọn tất cả tuyến'}
                  </button>
                </div>

                {/* Trade Lanes Checkboxes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-3.5">
                  {MAIN_INTERNATIONAL_TRADE_LANES.map((lane) => {
                    const isChecked = selectedTradeLanes.includes(lane.id);
                    return (
                      <label
                        key={lane.id}
                        onClick={() => toggleTradeLane(lane.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none text-xs ${
                          isChecked
                            ? 'bg-blue-50/70 border-blue-400 text-blue-900 font-bold shadow-2xs'
                            : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by parent onClick
                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer pointer-events-none"
                          />
                          <span>{lane.label}</span>
                        </div>
                        <span className={`text-[11px] px-1.5 py-0.5 rounded font-bold ${
                          isChecked ? 'bg-blue-200/80 text-blue-900' : 'bg-slate-200/70 text-slate-600'
                        }`}>
                          {lane.count.toLocaleString()}
                        </span>
                      </label>
                    );
                  })}

                  {/* Domestic Checkbox */}
                  <label
                    onClick={() => toggleTradeLane('Domestic')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none text-xs ${
                      selectedTradeLanes.includes('Domestic')
                        ? 'bg-blue-50/70 border-blue-400 text-blue-900 font-bold shadow-2xs'
                        : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTradeLanes.includes('Domestic')}
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer pointer-events-none"
                      />
                      <span>Tuyến Nội Địa VN</span>
                    </div>
                    <span className={`text-[11px] px-1.5 py-0.5 rounded font-bold ${
                      selectedTradeLanes.includes('Domestic') ? 'bg-blue-200/80 text-blue-900' : 'bg-slate-200/70 text-slate-600'
                    }`}>
                      1,450
                    </span>
                  </label>
                </div>
              </div>

              {/* Category Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'ALL', label: 'Tất cả dịch vụ' },
                    { id: 'Ocean', label: '🚢 Đường biển FCL/LCL' },
                    { id: 'Trucking', label: '🚛 Đường bộ FTL' },
                    { id: 'ColdChain', label: '❄️ Vận tải lạnh' },
                    { id: 'Air', label: '✈️ Hàng không' },
                    { id: 'Customs', label: '📋 Hải quan' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-48">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={rateSearchTerm}
                      onChange={(e) => setRateSearchTerm(e.target.value)}
                      placeholder="Tìm cảng, tuyến, hãng tàu..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="popular">Phổ biến</option>
                    <option value="priceAsc">Giá tăng dần</option>
                    <option value="priceDesc">Giá giảm dần</option>
                    <option value="timeFastest">Nhanh nhất</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Indicators */}
              {(selectedTradeLanes.length > 0 || selectedCategory !== 'ALL' || rateSearchTerm) && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Đang lọc theo:</span>
                  {selectedTradeLanes.map((laneId) => {
                    const meta = MAIN_INTERNATIONAL_TRADE_LANES.find(m => m.id === laneId);
                    const name = meta ? meta.label : 'Tuyến Nội Địa';
                    return (
                      <span key={laneId} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md text-[11px]">
                        <span>{name}</span>
                        <button onClick={() => toggleTradeLane(laneId)} className="hover:text-blue-900 cursor-pointer">×</button>
                      </span>
                    );
                  })}
                  {selectedCategory !== 'ALL' && (
                    <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-md text-[11px]">
                      <span>{selectedCategory}</span>
                      <button onClick={() => setSelectedCategory('ALL')} className="hover:text-slate-900 cursor-pointer">×</button>
                    </span>
                  )}
                  {rateSearchTerm && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md text-[11px]">
                      <span>"{rateSearchTerm}"</span>
                      <button onClick={() => setRateSearchTerm('')} className="hover:text-amber-900 cursor-pointer">×</button>
                    </span>
                  )}
                  <button 
                    onClick={() => {
                      setSelectedTradeLanes([]);
                      setSelectedCategory('ALL');
                      setRateSearchTerm('');
                    }}
                    className="text-[11px] text-rose-600 hover:underline font-bold ml-1 cursor-pointer"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </div>
              )}

              {/* Route Items Rich List */}
              <div className="space-y-4">
                {filteredRateCards.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
                    <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">Không tìm thấy tuyến giá phù hợp theo bộ lọc đã chọn.</p>
                    <p className="text-xs text-slate-400 mt-1">Vui lòng chọn lại các tuyến chính hoặc nhập từ khóa tìm kiếm khác.</p>
                    <button
                      onClick={() => {
                        setSelectedTradeLanes([]);
                        setSelectedCategory('ALL');
                        setRateSearchTerm('');
                      }}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Hiển Thị Tất Cả Tuyến Cước
                    </button>
                  </div>
                ) : (
                  filteredRateCards.map((rate) => {
                    const isInternational = rate.tradeLaneRegion && rate.tradeLaneRegion !== 'Domestic';
                    const laneMeta = MAIN_INTERNATIONAL_TRADE_LANES.find(m => m.id === rate.tradeLaneRegion);

                    return (
                      <div 
                        key={rate.id}
                        className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        {/* Route Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-100 pb-3.5">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                rate.category === 'Trucking' ? 'bg-blue-100 text-blue-800' :
                                rate.category === 'Ocean' ? 'bg-cyan-100 text-cyan-800' :
                                rate.category === 'ColdChain' ? 'bg-indigo-100 text-indigo-800' :
                                rate.category === 'Air' ? 'bg-sky-100 text-sky-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {rate.category}
                              </span>

                              {/* International Trade Lane Region Badge */}
                              {isInternational && laneMeta && (
                                <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                                  <Globe2 className="w-3 h-3" />
                                  <span>Tuyến {laneMeta.label}</span>
                                </span>
                              )}

                              {rate.shippingLine && (
                                <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                  <Anchor className="w-3 h-3 text-slate-500" />
                                  <span>{rate.shippingLine}</span>
                                </span>
                              )}
                              
                              <h4 className="text-base font-bold text-slate-900 w-full sm:w-auto mt-1 sm:mt-0">
                                {rate.routeOrService}
                              </h4>
                              
                              {rate.isPopular && (
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                                  ⭐ Tuyến Trọng Điểm
                                </span>
                              )}
                            </div>

                            {/* Ports breakdown for International routes */}
                            {(rate.pol || rate.pod) && (
                              <div className="flex items-center gap-2 mt-2 text-xs bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 font-medium text-slate-700">
                                <span className="text-slate-500">Cảng bốc (POL): <strong className="text-slate-900">{rate.pol}</strong></span>
                                <span className="text-blue-500 font-bold">➔</span>
                                <span className="text-slate-500">Cảng dỡ (POD): <strong className="text-blue-700">{rate.pod}</strong></span>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
                              <span className="font-semibold text-slate-800">Quy cách: {rate.vehicleOrUnit}</span>
                              <span className="text-slate-300">•</span>
                              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                                <Clock className="h-3.5 w-3.5" />
                                Thời gian: {rate.transitTime}
                              </span>
                              {rate.distanceKm && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-slate-500">Cự ly: {rate.distanceKm}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Benchmark Price */}
                          <div className="text-left sm:text-right shrink-0 bg-blue-50/50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl">
                            <span className="text-[11px] text-slate-400 block font-medium">Đơn giá niêm yết chuẩn:</span>
                            <span className="text-lg sm:text-xl font-extrabold text-blue-700">
                              {rate.benchmarkPriceDisplay}
                            </span>
                            {rate.usdPrice && (
                              <span className="text-[11px] text-emerald-700 font-bold block">
                                Cước O/F: ~${rate.usdPrice.toLocaleString()} USD
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Middle Body: Backhaul discount, Itemized breakdown, and Perks */}
                        <div className="py-3.5 space-y-3">
                          {rate.backhaulPriceDisplay ? (
                            <div className="flex items-center justify-between rounded-xl bg-emerald-50/80 px-3.5 py-2 border border-emerald-200 text-xs">
                              <div className="flex items-center gap-2 text-emerald-900 font-medium">
                                <TrendingDown className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>{rate.backhaulPriceDisplay}</span>
                              </div>
                              <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                Tiết kiệm 35%
                              </span>
                            </div>
                          ) : (
                            <div className="rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-100">
                              💡 <strong className="text-slate-800">Ghi chú cước & điều kiện: </strong>{rate.priceNotes}
                            </div>
                          )}

                          {/* Itemized Cost Breakdown Grid */}
                          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                              Cơ cấu chi phí bóc tách minh bạch:
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              <div className="rounded-lg bg-white p-2 border border-slate-100">
                                <span className="text-[10px] text-slate-400 block">{isInternational ? 'Cước biển O/F' : 'Cước cơ sở'}</span>
                                <span className="font-bold text-slate-800">
                                  {rate.costBreakdown?.baseFreight || `${Math.round(rate.benchmarkPriceVND * 0.65).toLocaleString('vi-VN')} VND`}
                                </span>
                              </div>
                              <div className="rounded-lg bg-white p-2 border border-slate-100">
                                <span className="text-[10px] text-slate-400 block">{isInternational ? 'Phụ phí BAF/LSS' : 'Phí BOT & Nhiên liệu'}</span>
                                <span className="font-bold text-slate-800">
                                  {rate.costBreakdown?.fuelAndTolls || `${Math.round(rate.benchmarkPriceVND * 0.28).toLocaleString('vi-VN')} VND`}
                                </span>
                              </div>
                              <div className="rounded-lg bg-white p-2 border border-slate-100">
                                <span className="text-[10px] text-slate-400 block">Bảo hiểm / Giữ chỗ</span>
                                <span className="font-bold text-emerald-700">
                                  {rate.costBreakdown?.insurance || 'Cam kết chỗ mùa cao điểm'}
                                </span>
                              </div>
                              <div className="rounded-lg bg-white p-2 border border-slate-100">
                                <span className="text-[10px] text-slate-400 block">Thủ tục & Chứng từ</span>
                                <span className="font-bold text-slate-800">
                                  {rate.costBreakdown?.handling || 'Hỗ trợ VGM / SI / C/O'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Included Perks badges */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-400 mr-1">Đặc quyền đi kèm:</span>
                            {rate.includedPerks.map((perk, i) => (
                              <span key={i} className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                <Check className="h-3 w-3 text-emerald-600" />
                                {perk}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Footer Action */}
                        <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Cam kết giữ giá niêm yết cố định & bồi thường 100% nếu trễ hẹn
                          </span>
                          <button
                            onClick={() => onOpenRFQForRate(rate)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 transition-colors cursor-pointer"
                          >
                            <span>Chọn Tuyến Này & Gửi RFQ</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* =========================================================================
              SUB-TAB 2: SURCHARGES & LOCAL CHARGES
             ========================================================================= */}
          {pricingSubTab === 'surcharges' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Biểu Phí Phụ Thu & Local Charges Minh Bạch
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Mọi khoản phụ phí đều được niêm yết rõ ràng, không phát sinh bất kỳ khoản phí ngoài thỏa thuận.
                </p>
              </div>

              {/* 1. Phụ Phí Vận Tải Quốc Tế & Cảng Biển */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Ship className="h-3.5 w-3.5 text-blue-600" />
                  1. Biểu Phí Local Charges Hàng Hải & Đường Biển Quốc Tế (Cát Lái / Cái Mép / Hải Phòng)
                </h5>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                      <tr>
                        <th className="p-3">Hạng mục phụ phí</th>
                        <th className="p-3">Mức giá quy định</th>
                        <th className="p-3">Ghi chú & Áp dụng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">THC (Terminal Handling Charge)</td>
                        <td className="p-3 font-bold text-blue-700">$120 / 20ft • $185 / 40ft</td>
                        <td className="p-3 text-slate-500">Phí xếp dỡ tại cảng theo biểu phí hãng tàu chỉ định</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">D/O (Delivery Order Fee)</td>
                        <td className="p-3 font-bold text-blue-700">850,000 - 1,100,000 VND / Bill</td>
                        <td className="p-3 text-slate-500">Phát hành lệnh giao hàng điện tử e-D/O</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Seal Fee & B/L Fee</td>
                        <td className="p-3 font-bold text-blue-700">250,000 VND / chì • $45 / Bill</td>
                        <td className="p-3 text-slate-500">Chì hãng tàu đạt chuẩn C-TPAT và phát hành House B/L</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Khai AMS / ISF (Tuyến Bắc Mỹ)</td>
                        <td className="p-3 font-bold text-blue-700">$35 / lô hàng</td>
                        <td className="p-3 text-slate-500">Khai báo trước 24h tàu rời cảng theo luật hải quan Hoa Kỳ</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Khai ENS / AFR (Tuyến Châu Âu & Nhật Bản)</td>
                        <td className="p-3 font-bold text-blue-700">$30 - $35 / lô hàng</td>
                        <td className="p-3 text-slate-500">Khai báo an ninh trước vận chuyển (Advance Cargo Manifest)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Phụ Phí Đường Bộ */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-blue-600" />
                  2. Biểu Phí Vận Tải Đường Bộ & Container Drayage
                </h5>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                      <tr>
                        <th className="p-3">Hạng mục phụ phí</th>
                        <th className="p-3">Mức giá quy định</th>
                        <th className="p-3">Điều kiện miễn phí / Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Phí lưu ca xe chờ bốc xếp (Overnight Demurrage)</td>
                        <td className="p-3 font-bold text-blue-700">300,000 - 500,000 VND / ca</td>
                        <td className="p-3 text-slate-500">Miễn phí 12 giờ đầu tiên cho tất cả các chuyến FTL</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Phí điểm giao trả phụ (Multi-drop point)</td>
                        <td className="p-3 font-bold text-blue-700">400,000 - 600,000 VND / điểm</td>
                        <td className="p-3 text-slate-500">Trong bán kính 15km quanh điểm giao hàng chính</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-900">Phí hỗ trợ tài xế bốc dỡ hàng nặng</td>
                        <td className="p-3 font-bold text-blue-700">200,000 - 400,000 VND / xe</td>
                        <td className="p-3 text-slate-500">Tài xế và phụ xe tham gia bốc xếp, phân loại hàng thùng carton</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SUB-TAB 3: WAREHOUSING & 3PL
             ========================================================================= */}
          {pricingSubTab === 'warehousing' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-blue-600" />
                  Biểu Phí Lưu Kho & Hoàn Tất Đơn Hàng (Fulfillment 3PL)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Kho ngoại quan, kho thường và kho lạnh đạt chuẩn ISO & HACCP tại KCN Sóng Thần, Cát Lái và Bắc Ninh.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                  <span className="font-bold text-slate-900 text-sm block">1. Lưu Kho Thường & Ngoại Quan</span>
                  <div className="text-xs space-y-1.5 text-slate-700">
                    <p className="flex justify-between">
                      <span>Thuê theo Pallet chuẩn:</span>
                      <strong className="text-blue-700">6,500 VND / Pallet / Ngày</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Thuê kho trọn gói (m²):</span>
                      <strong className="text-blue-700">125,000 VND / m² / Tháng</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Nâng hạ Pallet xuất/nhập:</span>
                      <strong className="text-slate-800">25,000 VND / Pallet</strong>
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                  <span className="font-bold text-slate-900 text-sm block">2. Lưu Kho Lạnh (-18°C đến +5°C)</span>
                  <div className="text-xs space-y-1.5 text-slate-700">
                    <p className="flex justify-between">
                      <span>Lưu pallet đông sâu (-18°C):</span>
                      <strong className="text-blue-700">14,000 VND / Pallet / Ngày</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Lưu kho mát rau quả (+2°C đến +8°C):</span>
                      <strong className="text-blue-700">11,000 VND / Pallet / Ngày</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Cấp đông nhanh (Blast Freezing):</span>
                      <strong className="text-slate-800">450 VND / Kg</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SUB-TAB 4: VOLUME TIERS & CREDIT TERMS
             ========================================================================= */}
          {pricingSubTab === 'tiers' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Percent className="h-5 w-5 text-blue-600" />
                  Chính Sách Chiết Khấu Sản Lượng & Công Nợ Doanh Nghiệp
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Ưu đãi tài chính đặc biệt dành riêng cho khách hàng ký hợp đồng nguyên tắc năm (Master Agreement).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200 p-5 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-[11px] font-bold">Standard</span>
                    <span className="text-sm font-extrabold text-slate-900">Từ 50 Tr/tháng</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-center gap-1.5">✓ Chiết khấu 3% trên tổng cước</li>
                    <li className="flex items-center gap-1.5">✓ Công nợ Net 15 ngày</li>
                    <li className="flex items-center gap-1.5">✓ Điều phối viên riêng 24/7</li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-blue-500 p-5 bg-blue-50/30 space-y-3 relative shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-black">Enterprise VIP</span>
                    <span className="text-sm font-extrabold text-blue-900">Từ 200 Tr/tháng</span>
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2">
                    <li className="flex items-center gap-1.5 font-bold">✓ Chiết khấu 8.5% trên tổng cước</li>
                    <li className="flex items-center gap-1.5 font-bold">✓ Công nợ Net 30 - 45 ngày</li>
                    <li className="flex items-center gap-1.5">✓ Cam kết giữ 100% vỏ cont & xe mùa cao điểm</li>
                    <li className="flex items-center gap-1.5">✓ Miễn phí 100% bảo hiểm đến 5 Tỷ VND</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold">Strategic Partner</span>
                    <span className="text-sm font-extrabold text-slate-900">&gt; 500 Tr/tháng</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-center gap-1.5">✓ Giá thỏa thuận riêng đặc thù (Tailored)</li>
                    <li className="flex items-center gap-1.5">✓ Công nợ Net 60 ngày hoặc theo quý</li>
                    <li className="flex items-center gap-1.5">✓ Tích hợp API ERP/TMS trực tiếp</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              SUB-TAB 5: MODAL COMPARISON (TRUCKING VS SEA VS AIR)
             ========================================================================= */}
          {pricingSubTab === 'modalCompare' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Bảng So Sánh Chi Phí & Thời Gian Vận Chuyển Bắc - Nam (HCMC ↔ Hà Nội)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Giúp doanh nghiệp lựa chọn phương thức vận chuyển cân bằng tối ưu giữa chi phí và tốc độ giao hàng.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                    <tr>
                      <th className="p-3">Phương thức</th>
                      <th className="p-3">Thời gian giao</th>
                      <th className="p-3">Chi phí cho 15 Tấn</th>
                      <th className="p-3">Mức độ phát thải CO₂</th>
                      <th className="p-3">Mặt hàng khuyến nghị</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="bg-blue-50/30 font-medium">
                      <td className="p-3 font-bold text-blue-900 flex items-center gap-1.5">
                        <Truck className="h-4 w-4 text-blue-600" />
                        Đường bộ FTL (Xe tải 15T)
                      </td>
                      <td className="p-3 font-bold text-emerald-700">48 Giờ</td>
                      <td className="p-3 font-bold text-slate-900">42,000,000 VND</td>
                      <td className="p-3 text-amber-600">Trung bình (~1.8 tấn CO₂)</td>
                      <td className="p-3 text-slate-600">Hàng cần giao gấp, điện tử, FMCG</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-cyan-900 flex items-center gap-1.5">
                        <Ship className="h-4 w-4 text-cyan-600" />
                        Đường biển FCL (Cont 40ft Cát Lái - Hải Phòng)
                      </td>
                      <td className="p-3 text-slate-700">3 - 4 Ngày</td>
                      <td className="p-3 font-bold text-emerald-700">8,500,000 VND (Tiết kiệm 75%)</td>
                      <td className="p-3 text-emerald-700 font-bold">Thấp nhất (~0.35 tấn CO₂)</td>
                      <td className="p-3 text-slate-600">Hàng nặng, nguyên liệu, sắt thép, gạch</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-sky-900 flex items-center gap-1.5">
                        <Plane className="h-4 w-4 text-sky-600" />
                        Đường hàng không (Air Cargo Tân Sơn Nhất - Nội Bài)
                      </td>
                      <td className="p-3 font-bold text-emerald-700">6 - 12 Giờ</td>
                      <td className="p-3 font-bold text-slate-900">Theo đơn giá Kg (28,000/kg)</td>
                      <td className="p-3 text-rose-600">Cao nhất</td>
                      <td className="p-3 text-slate-600">Dược phẩm, linh kiện chip, chứng từ hỏa tốc</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* =========================================================================
            RIGHT COL 1/3: INSTANT FREIGHT ESTIMATOR (CÔNG CỤ TÍNH GIÁ NHANH TRỰC TUYẾN)
           ========================================================================= */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs sticky top-24">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">
                  Công Cụ Tính Giá Nhanh
                </h4>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Realtime Calculator
              </span>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Service selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Dịch Vụ Vận Tải</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'Trucking', label: '🚛 Đường bộ FTL' },
                    { id: 'Ocean', label: '🚢 Đường biển FCL' },
                    { id: 'ColdChain', label: '❄️ Vận tải lạnh' },
                    { id: 'Air', label: '✈️ Hàng không' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCalcService(s.id as any)}
                      className={`p-2 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        calcService === s.id
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Origin & Destination */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Điểm Đi (Origin)</label>
                  <select
                    value={calcOrigin}
                    onChange={(e) => setCalcOrigin(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="HCMC">TP. Hồ Chí Minh / Cát Lái</option>
                    <option value="CaiMep">Cái Mép - Vũng Tàu</option>
                    <option value="BinhDuong">Bình Dương / Đồng Nai</option>
                    <option value="HaiPhong">Hải Phòng / Đình Vũ</option>
                    <option value="Hanoi">Hà Nội / Nội Bài</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Điểm Đến (Dest)</label>
                  <select
                    value={calcDest}
                    onChange={(e) => setCalcDest(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Hanoi">Hà Nội / Bắc Ninh</option>
                    <option value="HaiPhong">Hải Phòng / Lạch Huyện</option>
                    <option value="DaNang">Đà Nẵng / Miền Trung</option>
                    <option value="CanTho">Cần Thơ / Miền Tây</option>
                    <option value="US">Los Angeles (Bắc Mỹ)</option>
                    <option value="EU">Rotterdam (Châu Âu)</option>
                  </select>
                </div>
              </div>

              {/* Weight / Payload */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700">Khối Lượng / Tải Trọng:</label>
                  <span className="font-extrabold text-blue-700">{calcWeightTons} Tấn</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={calcWeightTons}
                  onChange={(e) => setCalcWeightTons(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 Tấn (Xe nhỏ)</span>
                  <span>15 Tấn (FTL)</span>
                  <span>30 Tấn (Cont 40ft)</span>
                </div>
              </div>

              {/* Trip type: One-way vs Backhaul vs Roundtrip */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hình Thức Chuyến</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'oneWay', label: '1 Chiều' },
                    { id: 'backhaul', label: 'Chiều Về (-35%)' },
                    { id: 'roundTrip', label: 'Khứ Hồi' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCalcTripType(t.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-center font-bold text-[11px] transition-colors cursor-pointer ${
                        calcTripType === t.id
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons checkboxes */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={calcInsurance}
                    onChange={(e) => setCalcInsurance(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded"
                  />
                  <span>Bảo hiểm hàng hóa giá trị cao (1.2%)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={calcGPS}
                    onChange={(e) => setCalcGPS(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded"
                  />
                  <span>GPS Realtime + Cảm biến nhiệt độ IoT</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={calcLoadingSupport}
                    onChange={(e) => setCalcLoadingSupport(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded"
                  />
                  <span>Hỗ trợ bốc xếp & nâng hạ 2 đầu</span>
                </label>
              </div>

              {/* Estimate Receipt Box */}
              <div className="mt-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-4 text-white space-y-3 shadow-md">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                  <span className="text-slate-300">Tổng cước ước tính (Đã gồm VAT):</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Cam kết cố định</span>
                </div>

                <div className="text-2xl font-black text-emerald-400">
                  {calculatedEstimate.priceDisplay}
                </div>

                <div className="text-[11px] space-y-1 text-slate-300 border-t border-white/10 pt-2">
                  <div className="flex justify-between">
                    <span>Thời gian hành trình dự kiến:</span>
                    <strong className="text-white">{calculatedEstimate.time}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Khoảng cách / Lộ trình:</span>
                    <strong className="text-white">{calculatedEstimate.distance}</strong>
                  </div>
                </div>

                <p className="text-[10px] text-indigo-200 italic pt-1">
                  {calculatedEstimate.savingsNote}
                </p>

                <button
                  type="button"
                  onClick={() => onOpenRFQForRate({
                    routeOrService: `${calcOrigin} ↔ ${calcDest} (${calcWeightTons} Tấn ${calcService})`,
                    benchmarkPriceDisplay: calculatedEstimate.priceDisplay,
                    transitTime: calculatedEstimate.time,
                    category: calcService,
                    vehicleOrUnit: `Tải trọng ${calcWeightTons} Tấn`
                  })}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer mt-2"
                >
                  <FileCheck className="h-4 w-4" />
                  <span>Yêu Cầu Báo Giá Chính Xác (RFQ)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

