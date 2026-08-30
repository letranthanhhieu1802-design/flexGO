import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  FileText, 
  Truck, 
  Ship, 
  Plane, 
  Warehouse, 
  ThermometerSnowflake, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { SupplierCompany, ServiceType } from '../../types';

interface AddCurrentSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSupplier: (supplier: SupplierCompany) => void;
}

const AVAILABLE_SERVICES: ServiceType[] = [
  'Trucking',
  'Sea Freight (FCL)',
  'Sea Freight (LCL)',
  'Air Freight',
  'Cold Chain',
  'Warehousing',
  'Customs Clearance',
  'Cross-border'
];

export const AddCurrentSupplierModal: React.FC<AddCurrentSupplierModalProps> = ({
  isOpen,
  onClose,
  onAddSupplier,
}) => {
  const [name, setName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [tagline, setTagline] = useState('');
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>(['Trucking']);
  const [routes, setRoutes] = useState('');
  const [hubLocations, setHubLocations] = useState('');
  const [headquartersAddress, setHeadquartersAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const toggleService = (srv: ServiceType) => {
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Vui lòng nhập tên nhà cung cấp';
    if (!taxId.trim()) newErrors.taxId = 'Vui lòng nhập Mã số thuế để hệ thống tự động đối soát';
    if (!contactPhone.trim() && !contactEmail.trim()) {
      newErrors.contact = 'Vui lòng cung cấp ít nhất Số điện thoại hoặc Email liên hệ';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate initials logo
    const words = name.trim().split(' ');
    const logo = words.length >= 2 
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();

    const parsedRoutes = routes
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const parsedHubs = hubLocations
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean);

    const newSupplier: SupplierCompany = {
      id: `supp-custom-${Date.now()}`,
      name: name.trim(),
      logo,
      tagline: tagline.trim() || 'Nhà cung cấp hiện tại do khách hàng khai báo vận hành',
      category: 'Current Supplier',
      rating: 4.5,
      reviewsCount: 1,
      verified: false,
      hasFlexGoAccount: false,
      taxId: taxId.trim(),
      headquartersAddress: headquartersAddress.trim() || 'Đang cập nhật',
      annualSpendVND: 0,
      annualSpendDisplay: 'Chưa đối soát',
      activeContractsCount: 1,
      inquiriesHandledCount: 0,
      lastInteractionDate: 'Hôm nay',
      operatingStatus: 'Active',
      source: 'CURRENT_SUPPLIER',
      sourceDetails: {
        sourceType: 'CURRENT_SUPPLIER',
        sourceLabel: 'Current Supplier (Khai báo giá vận hành thực tế)',
        declaredDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        isRegisteredOnFlexGo: false,
        notes: notes.trim() || 'Nhà cung cấp offline do khách hàng tự khai báo từ biểu giá vận hành thực tế. Sẵn sàng tự động liên kết khi có tài khoản trên flexGO.',
      },
      services: selectedServices,
      hubLocations: parsedHubs.length > 0 ? parsedHubs : ['Toàn quốc'],
      fleetSize: 'Đội xe vận hành thực tế',
      warehouseArea: 'Theo biểu giá khai báo',
      establishedYear: 2020,
      contactPerson: contactPerson.trim() || 'Đầu mối vận tải',
      contactEmail: contactEmail.trim() || 'contact@supplier.vn',
      contactPhone: contactPhone.trim() || '0900 000 000',
      totalQuotesSubmitted: 0,
      awardedDealsCount: 0,
      onTimeDeliveryRate: '98.0%',
      description: `Nhà cung cấp hiện tại của doanh nghiệp. ${notes.trim()}`,
      certifications: ['Đối tác vận hành thực tế'],
      preferredRoutes: parsedRoutes.length > 0 ? parsedRoutes : ['Các tuyến chính theo biểu giá'],
    };

    onAddSupplier(newSupplier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="add-current-supplier-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Khai Báo Current Supplier (Nhà Cung Cấp Hiện Tại)</h2>
              <p className="text-xs text-slate-500">
                Ghi nhận các nhà xe, công ty logistics bạn đang hợp tác thực tế chưa có tài khoản trên flexGO
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Notice Banner */}
        <div className="mx-6 mt-4 p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900 leading-relaxed">
            <strong>Cơ chế Current Supplier:</strong> Nhà cung cấp sẽ được ghi nhận vào danh sách của bạn. Khi đơn vị này đăng ký tài khoản trên nền tảng flexGO, hệ thống sẽ tự động đối soát <strong>Mã số thuế (MST)</strong> để liên kết hồ sơ và cập nhật thông tin chuẩn xác.
          </p>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Tên & MST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên Nhà Cung Cấp / Doanh Nghiệp Vận Tải <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Indo-Trans Logistics (ITL Corp)..."
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                  errors.name ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mã Số Thuế (MST) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="VD: 0303889102"
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono ${
                  errors.taxId ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                }`}
              />
              {errors.taxId && <p className="text-xs text-rose-500 mt-1">{errors.taxId}</p>}
              <p className="text-[11px] text-slate-400 mt-1">Dùng để định danh đối soát khi supplier onboard flexGO</p>
            </div>
          </div>

          {/* Dịch vụ cung cấp */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Dịch Vụ Đang Hợp Tác <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SERVICES.map((srv) => {
                const isSelected = selectedServices.includes(srv);
                return (
                  <button
                    key={srv}
                    type="button"
                    onClick={() => toggleService(srv)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {srv}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tuyến đường & Địa bàn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tuyến Đường Vận Hành Chính
              </label>
              <input
                type="text"
                value={routes}
                onChange={(e) => setRoutes(e.target.value)}
                placeholder="VD: HCMC ↔ Hà Nội, Bình Dương ↔ Cát Lái"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Khu Vực Hub / Kho Bãi
              </label>
              <input
                type="text"
                value={hubLocations}
                onChange={(e) => setHubLocations(e.target.value)}
                placeholder="VD: TP.HCM, Bình Dương, Hải Phòng..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Địa chỉ trụ sở */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Địa Chỉ Văn Phòng / Trụ Sở
            </label>
            <input
              type="text"
              value={headquartersAddress}
              onChange={(e) => setHeadquartersAddress(e.target.value)}
              placeholder="VD: 52 Trường Sơn, P.2, Q. Tân Bình, TP. Hồ Chí Minh"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Đầu mối liên hệ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Người Đại Diện / Sales
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="VD: Anh Tuấn Anh (Sales)"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số Điện Thoại / Zalo
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="VD: 0909 666 777"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="VD: contact@supplier.vn"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          {errors.contact && <p className="text-xs text-rose-500">{errors.contact}</p>}

          {/* Ghi chú biểu giá */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ghi Chú Biểu Giá & Vận Hành Thực Tế
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Đang vận hành gói thuê kho 1,200m² tại Sóng Thần 1, đơn giá 110k/m²/tháng..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/70 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lưu Current Supplier</span>
          </button>
        </div>
      </div>
    </div>
  );
};
