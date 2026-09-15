import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  Globe2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Truck,
  UserRound,
  X,
} from 'lucide-react';
import { LOGISTICS_INDUSTRY_LOV } from '../customer/CreateInquiryModal';

export type AuthTestMode = 'login' | 'register';
type RegistrationRole = 'customer' | 'provider';
type FieldErrors = Record<string, string>;

interface AuthTestModalProps {
  isOpen: boolean;
  mode: AuthTestMode;
  onClose: () => void;
  onModeChange: (mode: AuthTestMode) => void;
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  icon,
  className = '',
  ...inputProps
}) => (
  <label className="block">
    <span className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-700">
      {label}
    </span>
    <span className="relative block">
      {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
      <input
        {...inputProps}
        className={`h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${
          icon ? 'pl-10' : ''
        } ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200'} ${className}`}
      />
    </span>
    {error && <span className="mt-1 block text-[11px] font-medium text-rose-600">{error}</span>}
  </label>
);

const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
const isValidPhone = (value: string) => /^[0-9+\s().-]{9,16}$/.test(value);

export const AuthTestModal: React.FC<AuthTestModalProps> = ({ isOpen, mode, onClose, onModeChange }) => {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<RegistrationRole | null>(null);
  const [submitted, setSubmitted] = useState<AuthTestMode | null>(null);
  const [loginErrors, setLoginErrors] = useState<FieldErrors>({});
  const [registerErrors, setRegisterErrors] = useState<FieldErrors>({});
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '', remember: false });
  const [registerForm, setRegisterForm] = useState({
    fullName: '', position: '', email: '', phone: '', companyName: '', taxCode: '', industry: '', password: '', passwordConfirmation: '', agreedToTerms: false,
  });

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (mode === 'register') {
      setRegisterStep(1);
      setSubmitted(null);
    }
  }, [mode]);

  if (!isOpen) return null;

  const updateLoginField = (field: 'identifier' | 'password' | 'remember', value: string | boolean) => {
    setLoginForm((previous) => ({ ...previous, [field]: value }));
    setSubmitted(null);
    if (field !== 'remember') setLoginErrors((previous) => ({ ...previous, [field]: '' }));
  };

  const updateRegisterField = (field: keyof typeof registerForm, value: string | boolean) => {
    setRegisterForm((previous) => ({ ...previous, [field]: value }));
    setSubmitted(null);
    setRegisterErrors((previous) => ({ ...previous, [field]: '' }));
  };

  const resetAndClose = () => {
    setSubmitted(null);
    setLoginErrors({});
    setRegisterErrors({});
    setLoginForm({ identifier: '', password: '', remember: false });
    setRegisterForm({
      fullName: '', position: '', email: '', phone: '', companyName: '', taxCode: '', industry: '', password: '', passwordConfirmation: '', agreedToTerms: false,
    });
    setRole(null);
    setRegisterStep(1);
    setShowLoginPassword(false);
    setShowRegisterPassword(false);
    onClose();
  };

  const switchMode = (nextMode: AuthTestMode) => {
    setSubmitted(null);
    setLoginErrors({});
    setRegisterErrors({});
    onModeChange(nextMode);
  };

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const errors: FieldErrors = {};
    const identifier = loginForm.identifier.trim();
    if (!identifier) errors.identifier = 'Vui lòng nhập email hoặc số điện thoại.';
    else if (!isValidEmail(identifier) && !isValidPhone(identifier)) errors.identifier = 'Email hoặc số điện thoại chưa đúng định dạng.';
    if (!loginForm.password) errors.password = 'Vui lòng nhập mật khẩu.';
    setLoginErrors(errors);
    if (Object.keys(errors).length === 0) setSubmitted('login');
  };

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const errors: FieldErrors = {};
    if (!registerForm.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên.';
    if (!registerForm.position.trim()) errors.position = 'Vui lòng nhập chức vụ hoặc bộ phận.';
    if (!registerForm.email.trim()) errors.email = 'Vui lòng nhập email.';
    else if (!isValidEmail(registerForm.email.trim())) errors.email = 'Email chưa đúng định dạng.';
    if (!registerForm.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại.';
    else if (!isValidPhone(registerForm.phone.trim())) errors.phone = 'Số điện thoại chưa đúng định dạng.';
    if (!registerForm.companyName.trim()) errors.companyName = 'Vui lòng nhập tên doanh nghiệp.';
    if (!registerForm.taxCode.trim()) errors.taxCode = 'Vui lòng nhập mã số thuế.';
    if (role === 'customer' && !registerForm.industry) errors.industry = 'Vui lòng chọn ngành hàng chính.';
    if (registerForm.password.length < 8) errors.password = 'Mật khẩu cần có ít nhất 8 ký tự.';
    if (registerForm.password !== registerForm.passwordConfirmation) errors.passwordConfirmation = 'Xác nhận mật khẩu chưa trùng khớp.';
    if (!registerForm.agreedToTerms) errors.agreedToTerms = 'Vui lòng đồng ý với điều khoản trước khi đăng ký.';
    setRegisterErrors(errors);
    if (Object.keys(errors).length === 0) setSubmitted('register');
  };

  const isLogin = mode === 'login';
  const roleLabel = role === 'customer' ? 'Chủ hàng / Doanh nghiệp XNK' : 'Đơn vị Logistics';
  const controlClass = (error?: string) => `h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 outline-none transition focus:ring-4 ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'}`;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-slate-950/65 p-3 backdrop-blur-sm animate-in fade-in duration-150 sm:p-5" role="dialog" aria-modal="true" aria-labelledby="auth-test-title" onMouseDown={(event) => { if (event.target === event.currentTarget) resetAndClose(); }}>
      <div className="relative my-auto flex w-full max-w-5xl overflow-hidden rounded-3xl border border-white/30 bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <button type="button" onClick={resetAndClose} className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900" aria-label="Đóng biểu mẫu"><X className="h-5 w-5" /></button>
        <aside className="relative hidden w-[39%] shrink-0 overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-9 text-white md:flex md:flex-col">
          <div className="absolute -right-16 -top-12 h-48 w-48 rounded-full border-[28px] border-white/10" /><div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-cyan-300/15 blur-2xl" />
          <div className="relative flex items-center gap-2.5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-lg"><Globe2 className="h-5 w-5" /></div><span className="text-lg font-black tracking-tight">FlexGO</span></div>
          <div className="relative my-auto"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner">{isLogin ? <LockKeyhole className="h-8 w-8" /> : <ShieldCheck className="h-8 w-8" />}</div><p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">FlexGO Account</p><h2 className="mt-3 text-3xl font-black leading-tight">{isLogin ? 'Kết nối chuỗi cung ứng, nhanh hơn.' : 'Bắt đầu kết nối cùng FlexGO.'}</h2><p className="mt-4 max-w-xs text-sm leading-6 text-indigo-100">Nền tảng giúp doanh nghiệp tìm kiếm, kết nối và tối ưu dịch vụ logistics.</p></div>
          <div className="relative rounded-2xl border border-white/15 bg-white/10 p-4 text-xs leading-5 text-indigo-100">Đây là khu vực trải nghiệm form. Dữ liệu nhập sẽ không tạo tài khoản hoặc thay đổi phiên làm việc hiện tại.</div>
        </aside>
        <div className="w-full bg-white md:w-[61%]"><div className="max-h-[calc(100vh-1.5rem)] overflow-y-auto px-5 py-7 sm:px-8 sm:py-8 md:max-h-[82vh]">
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} noValidate>
              <div className="pr-10"><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Chào mừng trở lại</p><h1 id="auth-test-title" className="mt-2 text-2xl font-black tracking-tight text-slate-900">Đăng nhập vào FlexGO</h1><p className="mt-2 text-sm leading-6 text-slate-500">Dùng email hoặc số điện thoại để trải nghiệm biểu mẫu.</p></div>
              {submitted === 'login' && <div className="mt-5 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><p><span className="font-bold">Form hợp lệ.</span> Đây là trạng thái thử nghiệm; chưa có đăng nhập, điều hướng hoặc lưu dữ liệu.</p></div>}
              <div className="mt-6 space-y-4"><InputField label="Email hoặc số điện thoại" value={loginForm.identifier} onChange={(event) => updateLoginField('identifier', event.target.value)} placeholder="email@congty.vn hoặc 0901 234 567" autoComplete="username" error={loginErrors.identifier} icon={<Mail className="h-4 w-4" />} /><div><span className="mb-1.5 flex items-center gap-1 text-xs font-bold text-slate-700">Mật khẩu</span><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type={showLoginPassword ? 'text' : 'password'} value={loginForm.password} onChange={(event) => updateLoginField('password', event.target.value)} placeholder="Nhập mật khẩu" autoComplete="current-password" className={`${controlClass(loginErrors.password)} py-2 pl-10 pr-11`} /><button type="button" onClick={() => setShowLoginPassword((value) => !value)} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={showLoginPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{loginErrors.password && <span className="mt-1 block text-[11px] font-medium text-rose-600">{loginErrors.password}</span>}</div></div>
              <div className="mt-4 flex items-center justify-between gap-3"><label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600"><input type="checkbox" checked={loginForm.remember} onChange={(event) => updateLoginField('remember', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />Ghi nhớ đăng nhập</label><button type="button" className="text-xs font-bold text-indigo-600 transition hover:text-indigo-700">Quên mật khẩu?</button></div>
              <button type="submit" className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/25">Đăng nhập <ArrowRight className="h-4 w-4" /></button><p className="mt-5 text-center text-sm text-slate-500">Chưa có tài khoản? <button type="button" onClick={() => switchMode('register')} className="font-bold text-indigo-600 hover:text-indigo-700">Đăng ký ngay</button></p>
            </form>
          ) : registerStep === 1 ? (
            <section>
              <div className="pr-10"><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Bước 1 / 2</p><h1 id="auth-test-title" className="mt-2 text-2xl font-black tracking-tight text-slate-900">Bạn đến với FlexGO với vai trò nào?</h1><p className="mt-2 text-sm leading-6 text-slate-500">Chọn vai trò chính để xem form đăng ký phù hợp.</p></div>
              <div className="mt-6 grid gap-3"><button type="button" onClick={() => setRole('customer')} className={`relative rounded-2xl border p-4 text-left transition ${role === 'customer' ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/15' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'}`}><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${role === 'customer' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}><Building2 className="h-5 w-5" /></span><span className="mt-3 block text-sm font-black text-slate-900">Chủ hàng / Doanh nghiệp XNK</span><span className="mt-1 block pr-5 text-xs leading-5 text-slate-500">Dành cho doanh nghiệp cần tìm dịch vụ vận tải, lưu kho hoặc khai báo hải quan.</span>{role === 'customer' && <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white"><Check className="h-3.5 w-3.5" /></span>}</button><button type="button" onClick={() => setRole('provider')} className={`relative rounded-2xl border p-4 text-left transition ${role === 'provider' ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/15' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'}`}><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${role === 'provider' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}><Truck className="h-5 w-5" /></span><span className="mt-3 block text-sm font-black text-slate-900">Đơn vị Logistics</span><span className="mt-1 block pr-5 text-xs leading-5 text-slate-500">Dành cho forwarder, 3PL, nhà xe, hãng tàu, kho bãi và các đối tác logistics.</span>{role === 'provider' && <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white"><Check className="h-3.5 w-3.5" /></span>}</button></div>
              <button type="button" disabled={!role} onClick={() => setRegisterStep(2)} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none">Tiếp tục <ArrowRight className="h-4 w-4" /></button><p className="mt-5 text-center text-sm text-slate-500">Đã có tài khoản? <button type="button" onClick={() => switchMode('login')} className="font-bold text-indigo-600 hover:text-indigo-700">Đăng nhập</button></p>
            </section>
          ) : (
            <form onSubmit={handleRegisterSubmit} noValidate>
              <button type="button" onClick={() => setRegisterStep(1)} className="mb-5 flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-indigo-600"><ChevronLeft className="h-4 w-4" /> Quay lại chọn vai trò</button><div className="pr-10"><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Bước 2 / 2 · {roleLabel}</p><h1 id="auth-test-title" className="mt-2 text-2xl font-black tracking-tight text-slate-900">Tạo tài khoản trải nghiệm</h1><p className="mt-2 text-sm leading-6 text-slate-500">Hoàn tất thông tin bên dưới để kiểm tra luồng đăng ký.</p></div>
              {submitted === 'register' && <div className="mt-5 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /><p><span className="font-bold">Form hợp lệ.</span> Đây là trạng thái thử nghiệm; tài khoản chưa được tạo và không có dữ liệu nào được lưu.</p></div>}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InputField label={role === 'customer' ? 'Họ và tên người phụ trách' : 'Họ và tên người đại diện'} value={registerForm.fullName} onChange={(event) => updateRegisterField('fullName', event.target.value)} placeholder="Nguyễn Văn An" autoComplete="name" error={registerErrors.fullName} icon={<UserRound className="h-4 w-4" />} />
                <InputField label={role === 'customer' ? 'Chức vụ' : 'Bộ phận / Chức vụ'} value={registerForm.position} onChange={(event) => updateRegisterField('position', event.target.value)} placeholder={role === 'customer' ? 'Trưởng phòng thu mua' : 'Kinh doanh cước'} error={registerErrors.position} />
                <InputField label="Email công việc" type="email" value={registerForm.email} onChange={(event) => updateRegisterField('email', event.target.value)} placeholder="email@congty.vn" autoComplete="email" error={registerErrors.email} icon={<Mail className="h-4 w-4" />} />
                <InputField label="Số điện thoại" type="tel" value={registerForm.phone} onChange={(event) => updateRegisterField('phone', event.target.value)} placeholder="0901 234 567" autoComplete="tel" error={registerErrors.phone} icon={<Phone className="h-4 w-4" />} />
                <div className="sm:col-span-2"><InputField label={role === 'customer' ? 'Tên doanh nghiệp' : 'Tên công ty logistics'} value={registerForm.companyName} onChange={(event) => updateRegisterField('companyName', event.target.value)} placeholder="Tên pháp lý đầy đủ của doanh nghiệp" autoComplete="organization" error={registerErrors.companyName} icon={<Building2 className="h-4 w-4" />} /></div>
                <InputField label="Mã số thuế" value={registerForm.taxCode} onChange={(event) => updateRegisterField('taxCode', event.target.value)} placeholder="Ví dụ: 0312345678" required error={registerErrors.taxCode} />
              {role === 'customer' && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">Ngành hàng chính</span>
                  <select value={registerForm.industry} onChange={(event) => updateRegisterField('industry', event.target.value)} className={controlClass(registerErrors.industry)}>
                    <option value="">-- Chọn ngành hàng --</option>
                    {LOGISTICS_INDUSTRY_LOV.map((item) => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                  {registerErrors.industry && <span className="mt-1 block text-[11px] font-medium text-rose-600">{registerErrors.industry}</span>}
                </label>
              )}
              <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2"><div><span className="mb-1.5 block text-xs font-bold text-slate-700">Mật khẩu</span><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type={showRegisterPassword ? 'text' : 'password'} value={registerForm.password} onChange={(event) => updateRegisterField('password', event.target.value)} placeholder="Tối thiểu 8 ký tự" autoComplete="new-password" className={`${controlClass(registerErrors.password)} py-2 pl-10 pr-11`} /><button type="button" onClick={() => setShowRegisterPassword((value) => !value)} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={showRegisterPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{registerErrors.password && <span className="mt-1 block text-[11px] font-medium text-rose-600">{registerErrors.password}</span>}</div><InputField label="Xác nhận mật khẩu" type={showRegisterPassword ? 'text' : 'password'} value={registerForm.passwordConfirmation} onChange={(event) => updateRegisterField('passwordConfirmation', event.target.value)} placeholder="Nhập lại mật khẩu" autoComplete="new-password" error={registerErrors.passwordConfirmation} /></div></div>
              <div className="mt-5"><label className="flex cursor-pointer items-start gap-2.5 text-sm leading-5 text-slate-600"><input type="checkbox" checked={registerForm.agreedToTerms} onChange={(event) => updateRegisterField('agreedToTerms', event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /><span>Tôi đồng ý với <span className="font-semibold text-slate-800">Điều khoản sử dụng</span> và <span className="font-semibold text-slate-800">Chính sách bảo mật</span>.</span></label>{registerErrors.agreedToTerms && <span className="mt-1 block text-[11px] font-medium text-rose-600">{registerErrors.agreedToTerms}</span>}</div>
              <button type="submit" disabled={!registerForm.agreedToTerms} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none">Hoàn tất đăng ký <ArrowRight className="h-4 w-4" /></button><p className="mt-5 text-center text-sm text-slate-500">Đã có tài khoản? <button type="button" onClick={() => switchMode('login')} className="font-bold text-indigo-600 hover:text-indigo-700">Đăng nhập</button></p>
            </form>
          )}
        </div></div>
      </div>
    </div>
  );
};
