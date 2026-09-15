import React, { useRef } from 'react';
import { Building2, CalendarDays, FileText, Globe2, MapPin, Upload } from 'lucide-react';

export interface CompanyIdentityBannerData {
  companyName: string;
  taxId: string;
  logoUrl: string;
  yearEstablished: string;
  websiteUrl: string;
  address: string;
}

interface CompanyIdentityBannerProps {
  data: CompanyIdentityBannerData;
  onChange: (data: CompanyIdentityBannerData) => void;
}

interface PublicCompanyIdentityBannerProps {
  data: CompanyIdentityBannerData;
}

const getCompanyInitials = (companyName: string) =>
  companyName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase() || 'CO';

export const PublicCompanyIdentityBanner: React.FC<PublicCompanyIdentityBannerProps> = ({ data }) => {
  const initials = getCompanyInitials(data.companyName);
  const details = [
    data.taxId && { icon: FileText, label: 'Mã số thuế', value: data.taxId },
    data.yearEstablished && { icon: CalendarDays, label: 'Năm thành lập', value: data.yearEstablished },
    data.websiteUrl && { icon: Globe2, label: 'Website', value: data.websiteUrl },
    data.address && { icon: MapPin, label: 'Địa chỉ', value: data.address },
  ].filter(Boolean) as { icon: React.ElementType; label: string; value: string }[];

  return (
    <section className="overflow-hidden rounded-3xl border border-indigo-800 bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 shadow-lg">
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[112px_minmax(0,1fr)] lg:items-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/35 bg-white/10 text-3xl font-black text-white shadow-inner">
          {data.logoUrl ? <img src={data.logoUrl} alt={`Logo ${data.companyName || 'công ty'}`} className="h-full w-full object-cover" /> : <span>{initials}</span>}
        </div>

        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2 text-indigo-200">
            <Building2 className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Thông tin doanh nghiệp</span>
          </div>
          <h1 className="break-words text-xl font-black text-white sm:text-2xl">
            {data.companyName || 'Tên doanh nghiệp'}
          </h1>

          {details.length > 0 && (
            <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex min-w-0 items-start gap-2 text-indigo-100">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-300" />
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold text-indigo-200">{label}</dt>
                    <dd className="break-words font-medium text-white">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
};

export const CompanyIdentityBanner: React.FC<CompanyIdentityBannerProps> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = getCompanyInitials(data.companyName);
  const update = (field: keyof CompanyIdentityBannerData, value: string) => onChange({ ...data, [field]: value });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => update('logoUrl', typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const inputClass = 'h-10 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-sm font-medium text-white outline-none placeholder:text-indigo-200/70 transition focus:border-white/60 focus:bg-white/15 focus:ring-2 focus:ring-white/20';

  return (
    <section className="overflow-hidden rounded-3xl border border-indigo-800 bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 shadow-lg">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[148px_minmax(0,1fr)]">
        <div className="flex flex-col items-center justify-start gap-3">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/35 bg-white/10 text-3xl font-black text-white shadow-inner">
            {data.logoUrl ? <img src={data.logoUrl} alt="Logo công ty" className="h-full w-full object-cover" /> : <span>{initials}</span>}
          </div>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleLogoUpload} />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/20">
            <Upload className="h-3.5 w-3.5" />
            Tải logo
          </button>
        </div>

        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Building2 className="h-5 w-5 text-indigo-200" />
            <h2 className="text-base font-black">Thông tin doanh nghiệp</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-bold text-indigo-100">Tên công ty</span>
              <input value={data.companyName} onChange={(event) => update('companyName', event.target.value)} placeholder="Nhập tên công ty" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-indigo-100"><FileText className="h-3.5 w-3.5" /> Mã số thuế</span>
              <input value={data.taxId} onChange={(event) => update('taxId', event.target.value)} placeholder="Nhập mã số thuế" className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-indigo-100"><CalendarDays className="h-3.5 w-3.5" /> Năm thành lập</span>
              <input type="number" min="1800" max="2100" value={data.yearEstablished} onChange={(event) => update('yearEstablished', event.target.value)} placeholder="Ví dụ: 2008" className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-indigo-100"><Globe2 className="h-3.5 w-3.5" /> URL website</span>
              <input type="url" value={data.websiteUrl} onChange={(event) => update('websiteUrl', event.target.value)} placeholder="https://congty.vn" className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-indigo-100"><MapPin className="h-3.5 w-3.5" /> Địa chỉ công ty</span>
              <input value={data.address} onChange={(event) => update('address', event.target.value)} placeholder="Nhập địa chỉ công ty" className={inputClass} />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};
