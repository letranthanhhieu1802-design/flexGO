import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Truck, 
  Ship, 
  Plane, 
  Warehouse, 
  ThermometerSnowflake, 
  Globe, 
  FileText, 
  CheckCircle2, 
  Trophy, 
  Coins, 
  Sparkles, 
  ExternalLink, 
  AlertCircle,
  Copy,
  Check,
  Send,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Tag
} from 'lucide-react';
import { SupplierCompany, ServiceType, CurrentView } from '../../types';

interface Supplier360DrawerProps {
  supplier: SupplierCompany | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateInquiry?: (supplierId?: string) => void;
  onNavigate?: (view: CurrentView) => void;
}

export const Supplier360Drawer: React.FC<Supplier360DrawerProps> = ({
  supplier,
  isOpen,
  onClose,
  onOpenCreateInquiry,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'contacts'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inviteSent, setInviteSent] = useState(false);

  if (!isOpen || !supplier) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendInvite = () => {
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 4000);
  };

  const renderSourcePill = () => {
    const source = supplier.source || 'AWARDED_QUOTE';
    switch (source) {
      case 'AWARDED_QUOTE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Trophy className="w-3.5 h-3.5 text-indigo-600" />
            <span>Awarded</span>
          </span>
        );
      case 'DIRECT_PROFILE_REQUEST':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Direct RFQ</span>
          </span>
        );
      case 'CURRENT_SUPPLIER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Current Supplier</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        id="supplier-360-drawer"
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250"
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white font-black text-xl flex items-center justify-center shadow-md shrink-0">
              {supplier.logo || 'VT'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{supplier.name}</h2>
                {supplier.hasFlexGoAccount !== false ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>flexGO Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Current Supplier (Chưa có TK flexGO)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{supplier.tagline}</p>
              
              <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-slate-500">
                {supplier.code && (
                  <span className="font-mono bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-md font-bold text-xs shadow-2xs">
                    Mã NCC: {supplier.code}
                  </span>
                )}
                {supplier.taxId && (
                  <span className="font-mono bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 font-semibold text-xs">
                    MST: {supplier.taxId}
                  </span>
                )}
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{supplier.rating}</span>
                  <span className="text-slate-400 font-normal">({supplier.reviewsCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Supplier Special Info Banner */}
        {supplier.hasFlexGoAccount === false && (
          <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 border border-blue-200 rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Nhà cung cấp ngoại sàn (Current Supplier)</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Đây là nhà cung cấp do Quý doanh nghiệp khai báo từ biểu giá vận hành thực tế (chưa có tài khoản trên nền tảng flexGO). Khi nhà cung cấp đăng ký và xác thực tài khoản trên flexGO, hệ thống sẽ tự động đối soát Mã số thuế (<strong>{supplier.taxId}</strong>) để đồng bộ năng lực chính thức.
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-center justify-between">
              <span className="text-[11px] text-blue-700 font-medium">
                {inviteSent ? '✓ Đã gửi thư mời đăng ký flexGO qua Email & Zalo!' : 'Mời nhà cung cấp đăng ký tài khoản flexGO để số hóa quy trình'}
              </span>
              <button
                onClick={handleSendInvite}
                disabled={inviteSent}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  inviteSent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <Send className="w-3 h-3" />
                <span>{inviteSent ? 'Đã Gửi Thư Mời' : 'Mời Onboard flexGO'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Drawer Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-6 mt-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Tổng Quan Năng Lực
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'contracts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Nguồn Gốc & Hồ Sơ Liên Kết
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'contacts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Đầu Mối Liên Hệ & SLA
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Sourcing Channel Pill */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500">Kênh Nguồn Supplier:</span>
                {renderSourcePill()}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Giới Thiệu Doanh Nghiệp</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
                  {supplier.description}
                </p>
              </div>

              {/* Services Badges */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Dịch Vụ Cung Cấp</h4>
                <div className="flex flex-wrap gap-2">
                  {supplier.services.map((srv) => (
                    <span 
                      key={srv} 
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50/70 text-indigo-700 border border-indigo-100"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capability Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <p className="text-[11px] text-slate-400 font-medium">Quy mô Đội xe / Phương tiện</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">{supplier.fleetSize || 'Chưa cập nhật'}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <p className="text-[11px] text-slate-400 font-medium">Hạ tầng Kho bãi</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">{supplier.warehouseArea || 'Chưa cập nhật'}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <p className="text-[11px] text-slate-400 font-medium">Tỷ lệ Giao hàng đúng hạn (SLA)</p>
                  <p className="text-xs font-bold text-emerald-600 mt-1">{supplier.onTimeDeliveryRate || '98.5%'}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <p className="text-[11px] text-slate-400 font-medium">Năm thành lập</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">{supplier.establishedYear || '2015'}</p>
                </div>
              </div>

              {/* Preferred Routes */}
              {supplier.preferredRoutes && supplier.preferredRoutes.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tuyến Vận Tải Trọng Điểm</h4>
                  <div className="space-y-1.5">
                    {supplier.preferredRoutes.map((route, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 p-2.5 rounded-lg bg-slate-50 border border-slate-100 font-medium">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{route}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hub Locations */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Mạng Lưới Hubs / Điểm Vận Hành</h4>
                <div className="flex flex-wrap gap-1.5">
                  {supplier.hubLocations.map((hub) => (
                    <span key={hub} className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-700 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{hub}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {supplier.certifications && supplier.certifications.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Chứng Nhận Chất Lượng & Pháp Lý</h4>
                  <div className="flex flex-wrap gap-2">
                    {supplier.certifications.map((cert) => (
                      <span key={cert} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{cert}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONTRACTS & SOURCING DETAILS */}
          {activeTab === 'contracts' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Chi Tiết Nguồn Gốc Hồ Sơ</span>
                  {renderSourcePill()}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Ngày ghi nhận / Liên kết:</span>
                    <span className="font-semibold text-slate-800">{supplier.sourceDetails?.declaredDate || '2026'}</span>
                  </div>

                  {supplier.sourceDetails?.inquiryCode && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Mã Inquiry gốc:</span>
                      <span className="font-mono font-bold text-indigo-600">{supplier.sourceDetails.inquiryCode}</span>
                    </div>
                  )}

                  {supplier.sourceDetails?.quoteCode && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Mã Báo giá:</span>
                      <span className="font-mono font-bold text-slate-800">{supplier.sourceDetails.quoteCode}</span>
                    </div>
                  )}

                  {supplier.sourceDetails?.contractCode && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Mã Hợp đồng:</span>
                      <span className="font-mono font-bold text-emerald-600">{supplier.sourceDetails.contractCode}</span>
                    </div>
                  )}

                  {supplier.sourceDetails?.rateCode && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Mã Biểu giá khai báo:</span>
                      <span className="font-mono font-bold text-blue-600">{supplier.sourceDetails.rateCode}</span>
                    </div>
                  )}
                </div>

                {supplier.sourceDetails?.notes && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100">
                    <span className="font-bold text-slate-800 block mb-1">Ghi chú đối soát:</span>
                    {supplier.sourceDetails.notes}
                  </div>
                )}
              </div>

              {/* Spend overview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                  <p className="text-[11px] text-slate-500 font-medium">Tổng Chi Tiêu Vận Hành</p>
                  <p className="text-base font-black text-slate-900 mt-1">{supplier.annualSpendDisplay || 'Chưa đối soát'}</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                  <p className="text-[11px] text-slate-500 font-medium">Hợp Đồng Đang Vận Hành</p>
                  <p className="text-base font-black text-indigo-600 mt-1">{supplier.activeContractsCount || 1} Hợp đồng</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACTS & SLA */}
          {activeTab === 'contacts' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Đầu Mối Phụ Trách</h4>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                    {supplier.contactPerson ? supplier.contactPerson[0] : 'S'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{supplier.contactPerson}</p>
                    <p className="text-xs text-slate-500">Đại diện kinh doanh / Điều hành logistics</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Điện thoại:</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{supplier.contactPhone}</span>
                      <button
                        onClick={() => copyToClipboard(supplier.contactPhone, 'phone')}
                        className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                      >
                        {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email:</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{supplier.contactEmail}</span>
                      <button
                        onClick={() => copyToClipboard(supplier.contactEmail, 'email')}
                        className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                      >
                        {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {supplier.headquartersAddress && (
                    <div className="flex items-start justify-between py-1 gap-2">
                      <span className="text-slate-500 flex items-center gap-2 shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Trụ sở chính:</span>
                      </span>
                      <span className="font-medium text-slate-800 text-right">{supplier.headquartersAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Communication Actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${supplier.contactPhone}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gọi Điện Ngay</span>
                </a>

                <a
                  href={`mailto:${supplier.contactEmail}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 rounded-xl text-xs font-bold border border-indigo-200 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Gửi Email RFQ</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onOpenCreateInquiry) onOpenCreateInquiry(supplier.id);
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi Yêu Cầu Báo Giá (Direct RFQ)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
