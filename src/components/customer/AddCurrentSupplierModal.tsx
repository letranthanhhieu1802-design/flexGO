import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, 
  Search,
  CheckCircle2, 
  AlertCircle,
  ShieldCheck, 
  ShieldAlert, 
  Phone, 
  Mail, 
  User, 
  ChevronDown, 
  Plus 
} from 'lucide-react';
import { SupplierCompany } from '../../types';
import { mockSuppliers } from '../../data/mockData';
import { mockSalesSpecialists } from '../../data/mockSalesSpecialists';

interface AddCurrentSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSupplier: (supplier: SupplierCompany) => void;
  existingSuppliers?: SupplierCompany[];
}

interface SalesmanOption {
  id: string;
  name: string;
  displayName: string;
  avatarInitial: string;
  phone: string;
  email: string;
}

export const AddCurrentSupplierModal: React.FC<AddCurrentSupplierModalProps> = ({
  isOpen,
  onClose,
  onAddSupplier,
  existingSuppliers = mockSuppliers,
}) => {
  const [taxId, setTaxId] = useState('');
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Search status: 'idle' (typing/not searched yet), 'found' (matched on flexGO), 'not_found' (unregistered)
  const [searchStatus, setSearchStatus] = useState<'idle' | 'found' | 'not_found'>('idle');
  const [matchedSupplier, setMatchedSupplier] = useState<SupplierCompany | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Salesman dropdown state
  const [isSalesmanDropdownOpen, setIsSalesmanDropdownOpen] = useState(false);
  const [isCustomSalesman, setIsCustomSalesman] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSalesmanDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler to explicitly search Tax ID on button click or Enter key
  const handleSearchTaxId = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const cleanTax = taxId.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanTax) {
      setErrors((prev) => ({ ...prev, taxId: 'Vui lòng nhập Mã số thuế để tra cứu' }));
      return;
    }

    const found = existingSuppliers.find(
      (s) => s.taxId && s.taxId.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanTax
    ) || null;

    if (found) {
      setMatchedSupplier(found);
      setSearchStatus('found');
      setName(found.name);
      setErrors((prev) => {
        const n = { ...prev };
        delete n.taxId;
        delete n.name;
        return n;
      });
    } else {
      setMatchedSupplier(null);
      setSearchStatus('not_found');
      // Auto focus company name input for convenient typing
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
    }
  };

  // Get list of sales specialists belonging to this matched supplier
  const availableSalesmen = useMemo<SalesmanOption[]>(() => {
    if (!matchedSupplier) return [];

    const suppId = matchedSupplier.id;
    const suppNameLower = matchedSupplier.name.toLowerCase();

    // Match in mockSalesSpecialists
    const matchedSpecs = mockSalesSpecialists.filter(
      (spec) =>
        spec.companyId === suppId ||
        spec.companyName.toLowerCase() === suppNameLower ||
        (suppNameLower.includes('vinatrans') && spec.companyName.toLowerCase().includes('vinatrans')) ||
        (suppNameLower.includes('mekong') && spec.companyName.toLowerCase().includes('mekong')) ||
        (suppNameLower.includes('saigon ocean') && spec.companyName.toLowerCase().includes('ocean'))
    );

    const result: SalesmanOption[] = matchedSpecs.map((spec) => ({
      id: spec.id,
      name: spec.name,
      displayName: spec.vietnameseName ? `${spec.name} (${spec.vietnameseName})` : spec.name,
      avatarInitial: spec.avatarInitial || spec.name.slice(0, 2).toUpperCase(),
      phone: spec.phone || spec.zaloPhone || '',
      email: spec.email || '',
    }));

    // If matchedSupplier has contactPerson not yet in list, include them as well
    if (
      matchedSupplier.contactPerson &&
      !result.some((r) => r.name.toLowerCase() === matchedSupplier.contactPerson.toLowerCase())
    ) {
      const words = matchedSupplier.contactPerson.trim().split(' ');
      const initials = words.length >= 2
        ? `${words[0][0]}${words[1][0]}`.toUpperCase()
        : matchedSupplier.contactPerson.slice(0, 2).toUpperCase();

      result.push({
        id: `supp-pic-${matchedSupplier.id}`,
        name: matchedSupplier.contactPerson,
        displayName: matchedSupplier.contactPerson,
        avatarInitial: initials,
        phone: matchedSupplier.contactPhone || '',
        email: matchedSupplier.contactEmail || '',
      });
    }

    return result;
  }, [matchedSupplier]);

  if (!isOpen) return null;

  // Handle selecting a salesman from dropdown
  const handleSelectSalesman = (salesman: SalesmanOption) => {
    setContactPerson(salesman.displayName);
    setContactPhone(salesman.phone);
    setContactEmail(salesman.email);
    setIsCustomSalesman(false);
    setIsSalesmanDropdownOpen(false);

    // Clear any previous error on contact fields
    setErrors((prev) => {
      const newErr = { ...prev };
      delete newErr.contactPerson;
      delete newErr.contactPhone;
      return newErr;
    });
  };

  const handleSelectCustomSalesman = () => {
    setIsCustomSalesman(true);
    setContactPerson('');
    setContactPhone('');
    setContactEmail('');
    setIsSalesmanDropdownOpen(false);
  };

  const handleResetAndClose = () => {
    setTaxId('');
    setName('');
    setContactPerson('');
    setContactPhone('');
    setContactEmail('');
    setErrors({});
    setIsCustomSalesman(false);
    setIsSalesmanDropdownOpen(false);
    setSearchStatus('idle');
    setMatchedSupplier(null);
    onClose();
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!taxId.trim()) {
      newErrors.taxId = 'Vui lòng nhập Mã số thuế';
    } else if (!/^[0-9-]{10,14}$/.test(taxId.trim())) {
      newErrors.taxId = 'Mã số thuế gồm 10 - 13 chữ số';
    }

    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập tên nhà cung cấp';
    }

    if (!contactPerson.trim()) {
      newErrors.contactPerson = 'Vui lòng chọn hoặc nhập người phụ trách';
    }

    if (!contactPhone.trim()) {
      newErrors.contactPhone = 'Vui lòng nhập Số điện thoại hoặc Zalo';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (matchedSupplier) {
      // Inherit supplier profile from flexGO, tag as CURRENT_SUPPLIER
      const updatedSupplier: SupplierCompany = {
        ...matchedSupplier,
        name: name.trim(),
        taxId: taxId.trim(),
        contactPerson: contactPerson.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim() || matchedSupplier.contactEmail,
        hasFlexGoAccount: true,
        source: 'CURRENT_SUPPLIER',
        sourceDetails: {
          sourceType: 'CURRENT_SUPPLIER',
          sourceLabel: 'Current Supplier (Đã có tài khoản flexGO)',
          declaredDate: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          isRegisteredOnFlexGo: true,
          notes: matchedSupplier.sourceDetails?.notes || 'Nhà cung cấp hiện tại do khách hàng kết nối từ hồ sơ có sẵn trên flexGO.',
        },
      };

      onAddSupplier(updatedSupplier);
    } else {
      // Create new Unclaimed offline supplier
      const words = name.trim().split(' ');
      const logo = words.length >= 2 
        ? `${words[0][0]}${words[1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase();

      const newSupplier: SupplierCompany = {
        id: `supp-current-${Date.now()}`,
        name: name.trim(),
        logo,
        tagline: 'Nhà cung cấp hiện tại do khách hàng tự khai báo',
        category: 'Current Supplier',
        rating: 4.5,
        reviewsCount: 1,
        verified: false,
        hasFlexGoAccount: false,
        taxId: taxId.trim(),
        headquartersAddress: 'Chưa cập nhật',
        annualSpendVND: 0,
        annualSpendDisplay: 'Chưa đối soát',
        activeContractsCount: 1,
        inquiriesHandledCount: 0,
        lastInteractionDate: 'Hôm nay',
        operatingStatus: 'Active',
        source: 'CURRENT_SUPPLIER',
        sourceDetails: {
          sourceType: 'CURRENT_SUPPLIER',
          sourceLabel: 'Current Supplier (Chưa có tài khoản flexGO)',
          declaredDate: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          isRegisteredOnFlexGo: false,
          notes: 'Nhà cung cấp offline do khách hàng tự khai báo để quản lý biểu giá hợp đồng thực tế.',
        },
        services: [],
        hubLocations: ['Theo hợp đồng nội bộ'],
        fleetSize: 'Đội xe vận hành thực tế',
        warehouseArea: 'Theo hợp đồng nội bộ',
        establishedYear: new Date().getFullYear(),
        contactPerson: contactPerson.trim(),
        contactEmail: contactEmail.trim() || 'contact@supplier.vn',
        contactPhone: contactPhone.trim(),
        totalQuotesSubmitted: 0,
        awardedDealsCount: 0,
        onTimeDeliveryRate: '98.0%',
        description: `Nhà cung cấp hiện tại do khách hàng khai báo.`,
        certifications: ['Đối tác vận hành nội bộ'],
        preferredRoutes: ['Tuyến vận hành theo biểu giá'],
      };

      onAddSupplier(newSupplier);
    }

    handleResetAndClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="add-current-supplier-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200 overflow-visible"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-white">Khai Báo Current Supplier</h2>
            <p className="text-xs text-slate-300">
              Thêm nhà xe, đối tác vận tải đang hợp tác thực tế vào danh bạ của bạn
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 flex-1 overflow-visible">
          {/* Status Alert Banner */}
          {searchStatus === 'found' && matchedSupplier ? (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-relaxed">
                <strong>Đã nhận diện trên flexGO:</strong> Doanh nghiệp <strong>{matchedSupplier.name}</strong> đã có profile chính thức. Tên công ty đã được tự động điền, bạn có thể chọn Salesman phụ trách bên dưới.
              </div>
            </div>
          ) : searchStatus === 'not_found' ? (
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Nhà cung cấp chưa có trên flexGO:</strong> Hồ sơ sẽ được tạo ở trạng thái <em>Unclaimed</em>. Khi đơn vị này đăng ký tài khoản flexGO với MST này, hệ thống sẽ tự động đối soát để liên kết.
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <strong>Nhập Mã số thuế (MST) và bấm icon tìm kiếm:</strong> Hệ thống sẽ kiểm tra xem doanh nghiệp đã có tài khoản trên flexGO hay chưa để tự động điền thông tin và gợi ý Salesman.
              </div>
            </div>
          )}

          {/* MST & Tên Công Ty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mã Số Thuế (MST) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => {
                    setTaxId(e.target.value);
                    if (errors.taxId) setErrors((prev) => ({ ...prev, taxId: '' }));
                    if (searchStatus !== 'idle') {
                      setSearchStatus('idle');
                      setMatchedSupplier(null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchTaxId(e);
                    }
                  }}
                  placeholder="VD: 0301428591"
                  className={`w-full pl-3.5 pr-11 py-2.5 text-sm bg-white border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono ${
                    errors.taxId ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20' : 'border-slate-200'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSearchTaxId}
                  title="Tra cứu Mã số thuế trên flexGO (hoặc nhấn Enter)"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg border border-indigo-200 transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 shadow-2xs"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {errors.taxId ? (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.taxId}</p>
              ) : searchStatus === 'found' && matchedSupplier ? (
                <p className="text-[11px] text-emerald-600 mt-1.5 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  Đã tìm thấy trên flexGO: {matchedSupplier.name}
                </p>
              ) : searchStatus === 'not_found' ? (
                <p className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 mt-1.5 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  Nhà cung cấp chưa tồn tại trên flexGO. Hãy tiếp tục khai báo.
                </p>
              ) : (
                <p className="text-[11px] text-slate-400 mt-1">
                  Nhập MST rồi nhấn icon kính lúp hoặc Enter để kiểm tra
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tên Nhà Cung Cấp / Doanh Nghiệp <span className="text-rose-500">*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder="VD: VinaTrans Logistics JSC..."
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                  errors.name ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name}</p>}
            </div>
          </div>

          {/* Thông tin đầu mối liên hệ (PIC & Salesman Selector) */}
          <div className="bg-slate-50/80 p-4.5 rounded-xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>Thông Tin Người Phụ Trách (PIC / Sales)</span>
              </div>
              {matchedSupplier && availableSalesmen.length > 0 && (
                <span className="text-[11px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {availableSalesmen.length} Salesman trên flexGO
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Người phụ trách - Dropdown list Avatar • Họ tên */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Người Phụ Trách <span className="text-rose-500">*</span>
                </label>

                {matchedSupplier && availableSalesmen.length > 0 && !isCustomSalesman ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSalesmanDropdownOpen((prev) => !prev)}
                      className={`w-full px-3.5 py-2 text-xs bg-white border rounded-lg text-left flex items-center justify-between focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors cursor-pointer ${
                        errors.contactPerson ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                      }`}
                    >
                      <span className={`truncate ${contactPerson ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                        {contactPerson || '-- Chọn Salesman flexGO --'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                    </button>

                    {/* Dropdown Items: Avatar • Họ tên only */}
                    {isSalesmanDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full min-w-[260px] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 py-1 max-h-56 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                          Salesman của {matchedSupplier.name}
                        </div>

                        {availableSalesmen.map((spec) => (
                          <button
                            key={spec.id}
                            type="button"
                            onClick={() => handleSelectSalesman(spec)}
                            className="w-full px-3 py-2 text-left hover:bg-indigo-50/80 flex items-center gap-2.5 transition-colors cursor-pointer"
                          >
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200">
                              {spec.avatarInitial}
                            </div>
                            <span className="text-xs font-semibold text-slate-800 truncate">
                              {spec.displayName}
                            </span>
                          </button>
                        ))}

                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            type="button"
                            onClick={handleSelectCustomSalesman}
                            className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-xs font-semibold text-indigo-600 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Nhập người phụ trách khác...</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => {
                        setContactPerson(e.target.value);
                        if (errors.contactPerson) setErrors((prev) => ({ ...prev, contactPerson: '' }));
                      }}
                      placeholder="VD: Anh Tuấn Anh (Sales)"
                      className={`w-full px-3.5 py-2 text-xs bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                        errors.contactPerson ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                      }`}
                    />
                    {matchedSupplier && availableSalesmen.length > 0 && isCustomSalesman && (
                      <button
                        type="button"
                        onClick={() => setIsCustomSalesman(false)}
                        className="text-[10px] text-indigo-600 hover:underline mt-1 block font-medium cursor-pointer"
                      >
                        ← Chọn lại từ danh sách Salesman flexGO
                      </button>
                    )}
                  </div>
                )}
                {errors.contactPerson && <p className="text-[10px] text-rose-500 mt-1">{errors.contactPerson}</p>}
              </div>

              {/* Số Điện Thoại / Zalo */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Số Điện Thoại / Zalo <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => {
                    setContactPhone(e.target.value);
                    if (errors.contactPhone) setErrors((prev) => ({ ...prev, contactPhone: '' }));
                  }}
                  placeholder="VD: 0909 666 777"
                  className={`w-full px-3.5 py-2 text-xs bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                    errors.contactPhone ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                  }`}
                />
                {errors.contactPhone && <p className="text-[10px] text-rose-500 mt-1">{errors.contactPhone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
                  Email Liên Hệ (Tùy chọn)
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="VD: contact@supplier.vn"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/80 rounded-b-2xl">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lưu Current Supplier</span>
          </button>
        </div>
      </div>
    </div>
  );
};

