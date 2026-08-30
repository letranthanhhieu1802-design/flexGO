import React from 'react';
import { 
  Building2, 
  Truck, 
  Ship, 
  Plane, 
  Warehouse, 
  Snowflake, 
  FileText, 
  Globe, 
  ShieldCheck, 
  Award, 
  Check, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  FileCheck, 
  Layers, 
  Sparkles,
  TrendingUp,
  Package,
  Send,
  Users2
} from 'lucide-react';
import { SalesSpecialistProfile } from '../../../types';

interface SupplierProfileCompanyTabProps {
  specialist: SalesSpecialistProfile;
  onOpenRFQForService: (service: any) => void;
}

export const SupplierProfileCompanyTab: React.FC<SupplierProfileCompanyTabProps> = ({
  specialist,
  onOpenRFQForService,
}) => {
  return (
    <div id="supplier-profile-company-tab" className="space-y-8 animate-in fade-in duration-300">
      
      {/* =========================================================================
          SECTION 1: TỔNG QUAN DOANH NGHIỆP ĐANG CÔNG TÁC (COMPANY OVERVIEW & INFO)
         ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 font-black text-white text-2xl shadow-sm shrink-0">
              {specialist.companyLogo || specialist.companyName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {specialist.companyName}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Doanh Nghiệp Xác Thực flexGO
                </span>
              </div>
              <p className="text-sm font-semibold text-blue-700 mt-1">
                Tập đoàn dịch vụ Logistics & Vận tải Đa phương thức Toàn diện
              </p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>Trụ sở chính: Tòa nhà VinaTrans Tower, TP. Hồ Chí Minh • Mạng lưới 8 chi nhánh toàn quốc</span>
              </p>
            </div>
          </div>

          {/* Key Facts badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Thành lập</span>
              <span className="text-base font-extrabold text-slate-900">2012</span>
              <span className="text-[10px] text-slate-500 block">14+ năm hoạt động</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Quy mô nhân sự</span>
              <span className="text-base font-extrabold text-slate-900">350+</span>
              <span className="text-[10px] text-slate-500 block">Chuyên viên logistics</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Mã số thuế</span>
              <span className="text-xs font-bold text-blue-700">0312456789</span>
              <span className="text-[10px] text-emerald-600 font-semibold block">AEO Customs Verified</span>
            </div>
          </div>
        </div>

        {/* Giới thiệu chi tiết & Sứ mệnh, Tầm nhìn */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-blue-700">
              Giới Thiệu Về Doanh Nghiệp
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {specialist.companyName} là một trong những đơn vị vận tải và cung ứng chuỗi logistics hàng đầu tại Việt Nam, sở hữu hệ sinh thái khép kín từ đội xe tải đường bộ FTL/LTL, đội xe đầu kéo container cảng biển, chuỗi kho bãi 3PL tiêu chuẩn Grade A, đến các hợp đồng đại lý hàng không và hãng tàu quốc tế.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Với phương châm <em>"Hiệu quả – An toàn – Chuẩn xác từng hành trình"</em>, công ty luôn tiên phong ứng dụng công nghệ quản lý vận tải TMS (Transportation Management System) và WMS (Warehouse Management System) tích hợp GPS/IoT thời gian thực, mang lại sự an tâm tuyệt đối cho khách hàng doanh nghiệp.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Sứ Mệnh & Giá Trị Cốt Lõi
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Đúng hẹn (SLA):</strong> Cam kết giao hàng chuẩn xác 99.6%.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Minh bạch:</strong> Báo giá chuẩn, không phát sinh chi phí ẩn.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>An toàn tuyệt đối:</strong> Bảo hiểm hàng hóa 100% toàn hành trình.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: CÁC DỊCH VỤ CÔNG TY CUNG CẤP (COMPANY SERVICES ECOSYSTEM)
         ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Truck className="h-4 w-4" />
              <span>Hệ Sinh Thái Dịch Vụ</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              Các Dịch Vụ Logistics Công Ty Cung Cấp
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Hạ tầng phương tiện & kho bãi chính chủ
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialist.services.map((srv) => (
            <div 
              key={srv.id} 
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="space-y-4">
                {/* Service Header */}
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {srv.serviceType === 'Trucking' && <Truck className="h-5 w-5" />}
                    {srv.serviceType === 'Sea Freight (FCL)' && <Ship className="h-5 w-5" />}
                    {srv.serviceType === 'Air Freight' && <Plane className="h-5 w-5" />}
                    {srv.serviceType === 'Cold Chain' && <Snowflake className="h-5 w-5" />}
                    {srv.serviceType === 'Customs Clearance' && <FileText className="h-5 w-5" />}
                    {srv.serviceType === 'Warehousing' && <Warehouse className="h-5 w-5" />}
                    {srv.serviceType === 'Cross-border' && <Globe className="h-5 w-5" />}
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {srv.serviceType}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {srv.title}
                  </h4>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">
                    {srv.highlight}
                  </p>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                {/* Key specs list */}
                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quy chuẩn dịch vụ:</p>
                  <ul className="space-y-1">
                    {srv.keySpecs.map((spec, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">Cam kết SLA: </span>
                  {srv.slaCommitment}
                </div>
              </div>

              {/* Action footer */}
              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Đơn giá tham khảo:</span>
                  <span className="text-xs font-bold text-blue-700">{srv.pricingSummary}</span>
                </div>
                <button
                  onClick={() => onOpenRFQForService(srv)}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <span>Gửi RFQ</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: NĂNG LỰC VẬN HÀNH & CƠ SỞ HẠ TẦNG (OPERATIONAL CAPACITY)
         ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Layers className="h-4 w-4" />
            <span>Quy Mô & Năng Lực Hạ Tầng</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            Năng Lực Vận Hành & Hạ Tầng Kỹ Thuật
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Trực tiếp sở hữu và vận hành phương tiện, kho bãi theo tiêu chuẩn quản lý quốc tế
          </p>
        </div>

        {/* 4 Pillars of Operational Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Pillar 1: Fleet */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-blue-600">
              <Truck className="h-6 w-6" />
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">240+ Phương tiện</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Đội Xe Vận Tải Trực Thuộc</h4>
            <p className="text-xs text-slate-600">
              Xe tải thùng kín 5T, 8T, 15T, xe đầu kéo container 40ft/45ft và xe tải lạnh Thermo King. 100% đạt chuẩn khí thải Euro 5.
            </p>
          </div>

          {/* Pillar 2: Warehouse */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-indigo-600">
              <Warehouse className="h-6 w-6" />
              <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">65,000 m²</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Hệ Thống Kho Bãi 3PL Grade A</h4>
            <p className="text-xs text-slate-600">
              Kho trung tâm tại KCN Sóng Thần (Bình Dương), Long Hậu (Long An), VSIP (Bắc Ninh) và Cảng Đình Vũ (Hải Phòng).
            </p>
          </div>

          {/* Pillar 3: Technology */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-emerald-600">
              <Sparkles className="h-6 w-6" />
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">TMS & WMS</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Công Nghệ Định Vị IoT & WMS</h4>
            <p className="text-xs text-slate-600">
              Tích hợp API kết nối hệ thống ERP của khách hàng, theo dõi vị trí GPS và cảm biến nhiệt độ tự động từng 5 phút.
            </p>
          </div>

          {/* Pillar 4: Certifications */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-amber-600">
              <Award className="h-6 w-6" />
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">ISO / AEO</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Chứng Chỉ Tiêu Chuẩn Quốc Tế</h4>
            <p className="text-xs text-slate-600">
              ISO 9001:2015, AEO Authorized Economic Operator của Tổng Cục Hải Quan, thành viên chính thức của VLA, FIATA & IATA.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: SHOWCASE CÔNG TY CÔNG TÁC (PROJECT SHOWCASE & CASE STUDIES)
         ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
            <FileCheck className="h-4 w-4" />
            <span>Showcase Dự Án Tiêu Biểu</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            Các Dự Án Vận Tải Lớn Đã Triển Khai Thành Công
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Minh chứng năng lực qua các hợp đồng chuỗi cung ứng quy mô lớn cho tập đoàn đa quốc gia
          </p>
        </div>

        {/* 3 Case Studies Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="rounded bg-blue-100 px-2 py-0.5 font-bold text-blue-800">Điện Tử & High-Tech</span>
              <span className="text-slate-400">2024 - 2026</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Vận Chuyển 320 Container Máy Móc Dự Án Nhà Máy Bắc Ninh
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tiếp nhận từ Cảng Hải Phòng, vận chuyển hàng siêu trọng thiết bị bán dẫn với yêu cầu giảm chấn đặc biệt và thông quan hải quan luồng xanh trong ngày.
            </p>
            <div className="rounded-lg bg-slate-50 p-2 text-[11px] text-emerald-700 font-semibold">
              ✓ Kết quả: 100% lô hàng an toàn tuyệt đối, rút ngắn 24h tiến độ lắp đặt.
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="rounded bg-indigo-100 px-2 py-0.5 font-bold text-indigo-800">Chuỗi Lạnh Thủy Sản</span>
              <span className="text-slate-400">2025</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Xuất Khẩu 850 Tấn Tôm Đông Lạnh (-20°C) Sang Thị Trường Mỹ
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vận chuyển từ Cần Thơ về Cảng Cái Mép, cắm điện reefer tại bãi và booking chỗ ưu tiên tuyến Direct Service đi Bờ Tây nước Mỹ.
            </p>
            <div className="rounded-lg bg-slate-50 p-2 text-[11px] text-emerald-700 font-semibold">
              ✓ Kết quả: Giữ vững nhiệt độ -20°C 100% lộ trình, không rớt tàu.
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="rounded bg-amber-100 px-2 py-0.5 font-bold text-amber-800">FMCG Phân Phối 3PL</span>
              <span className="text-slate-400">Dài hạn</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Lưu Kho & Phân Phối 120 Điểm Siêu Thị Toàn Miền Nam
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quản lý 8,000 pallet hàng tiêu dùng nhanh tại kho Sóng Thần, xử lý xuất kho theo đơn hàng trong vòng 60 phút và giao nhận đa điểm (Multi-drop).
            </p>
            <div className="rounded-lg bg-slate-50 p-2 text-[11px] text-emerald-700 font-semibold">
              ✓ Kết quả: Độ chính xác tồn kho 99.98%, giảm 14% chi phí logistics.
            </div>
          </div>

        </div>

        {/* Trusted Shipper Brand Logos */}
        <div className="border-t border-slate-100 pt-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Khách Hàng Doanh Nghiệp & Đối Tác Chiến Lược Tin Cậy
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
            {['Samsung Electronics', 'VinFast Logistics', 'Nestlé Vietnam', 'Masan Group', 'Foxconn Precision', 'CP Group', 'Minh Phu Seafood'].map((partner, i) => (
              <span key={i} className="rounded-lg bg-slate-100 px-3 py-1.5 text-slate-700">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
