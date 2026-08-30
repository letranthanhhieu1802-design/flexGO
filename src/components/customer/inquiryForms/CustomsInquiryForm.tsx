import React from 'react';
import { FileText, Award, Landmark, ArrowLeftRight } from 'lucide-react';
import { CustomsInquirySpecs } from '../../../types';
import { VASItemDef } from './VASSection';

export const CUSTOMS_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'cu-vas-1',
    name: 'Xin cấp Giấy chứng nhận xuất xứ hàng hóa C/O (Form E, D, EUR.1...)',
    desc: 'Soạn thảo hồ sơ, đăng ký chữ ký số và xin cấp C/O tại VCCI / Phòng Quản lý XNK Bộ Công Thương.',
    tag: 'Cấp C/O',
    popular: true,
  },
  {
    id: 'cu-vas-2',
    name: 'Đăng ký & làm thủ tục Kiểm tra chuyên ngành (Kiểm dịch, VSATTP, CR...)',
    desc: 'Lấy mẫu kiểm tra hiệu suất năng lượng, kiểm tra an toàn thực phẩm, hợp quy CR.',
    tag: 'Kiểm tra chuyên ngành',
    popular: true,
  },
  {
    id: 'cu-vas-3',
    name: 'Hỗ trợ kiểm hóa bốc dỡ thực tế tại bãi kiểm (Nếu luồng Đỏ - Red Channel)',
    desc: 'Cử nhân sự hiện trường mở thùng/container, bốc dỡ kiểm tra cùng công chức hải quan.',
    tag: 'Kiểm hóa luồng đỏ',
    popular: true,
  },
  {
    id: 'cu-vas-4',
    name: 'Đăng ký danh mục thiết bị máy móc miễn thuế tạo tài sản cố định',
    desc: 'Lập hồ sơ ưu đãi miễn thuế nhập khẩu cho các dự án đầu tư nhà máy FDI.',
    tag: 'Miễn thuế dự án',
  },
  {
    id: 'cu-vas-5',
    name: 'Tư vấn xác định trước mã HS Code & Đại diện tham vấn trị giá hải quan',
    desc: 'Chuẩn bị hồ sơ kỹ thuật chứng minh mã HS chuẩn và giải trình trị giá tính thuế.',
    tag: 'HS Code & Trị giá',
    popular: true,
  },
  {
    id: 'cu-vas-6',
    name: 'Hỗ trợ báo cáo quyết toán hải quan hàng năm loại hình SXXK / Gia công',
    desc: 'Đối chiếu định mức nguyên phụ liệu tiêu hao, lập báo cáo quyết toán theo Thông tư 39/2018.',
    tag: 'Quyết toán SXXK',
  },
  {
    id: 'cu-vas-7',
    name: 'Dịch vụ giám định thương mại độc lập tại cảng (SGS / Vinacontrol / Quatest)',
    desc: 'Thu xếp tổ chức giám định số lượng, tình trạng hư hỏng hoặc quy cách phẩm chất lô hàng.',
    tag: 'Giám định độc lập',
  },
  {
    id: 'cu-vas-8',
    name: 'Giao nhận tận nơi bộ tờ khai thông quan gốc và chứng từ nộp thuế',
    desc: 'Hoàn thiện hồ sơ giấy tờ gốc có xác nhận của hải quan gửi trả bộ phận kế toán.',
    tag: 'Bàn giao chứng từ gốc',
  },
];

interface CustomsInquiryFormProps {
  specs: CustomsInquirySpecs;
  onChange: (specs: CustomsInquirySpecs) => void;
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
}

export const CustomsInquiryForm: React.FC<CustomsInquiryFormProps> = ({
  specs,
  onChange,
  origin,
  setOrigin,
  destination,
  setDestination,
}) => {
  const updateSpec = <K extends keyof CustomsInquirySpecs>(key: K, value: CustomsInquirySpecs[K]) => {
    onChange({
      ...specs,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Service Header Info */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-600 text-white shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="text-xs text-amber-950 flex-1">
          <span className="font-bold block text-sm text-amber-900">
            Dịch Vụ Khai Báo Hải Quan & Thủ Tục Xuất Nhập Khẩu (Customs Brokerage & Clearance)
          </span>
          <p className="text-amber-800/80 mt-0.5">
            Cung cấp mã loại hình tờ khai (A11, E21, E31, B11), Chi cục Hải quan mở tờ khai, Mã HS Code và Form C/O ưu đãi.
          </p>
        </div>
      </div>

      {/* Trade Role Selection: Nhập Khẩu vs Xuất Khẩu */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-700" />
            <span>Vai Trò Doanh Nghiệp Trong Tờ Khai Hải Quan *</span>
          </label>
          <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
            {specs.tradeRole === 'Xuất khẩu (Export)'
              ? '🛫 Mở tờ khai Hải quan đầu Xuất (Export Clearance)'
              : '🛬 Mở tờ khai Hải quan đầu Nhập (Import Clearance)'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            {
              role: 'Nhập khẩu (Import)',
              title: '🛬 Thủ Tục Nhập Khẩu (Import)',
              sub: 'Mở tờ khai A11, E21, E31, H11...',
            },
            {
              role: 'Xuất khẩu (Export)',
              title: '🛫 Thủ Tục Xuất Khẩu (Export)',
              sub: 'Mở tờ khai B11, E62, G11...',
            },
          ].map((item) => {
            const isSelected = (specs.tradeRole || 'Nhập khẩu (Import)') === item.role;
            return (
              <button
                type="button"
                key={item.role}
                onClick={() => updateSpec('tradeRole', item.role as any)}
                className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/25 font-bold text-amber-950 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{item.title}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0"></span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 font-normal truncate">
                  {item.sub}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Declaration Type & Customs Branch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Loại Hình Tờ Khai Hải Quan (Declaration Type) *
          </label>
          <select
            value={specs.declarationType}
            onChange={(e) => updateSpec('declarationType', e.target.value as any)}
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-500 font-bold text-amber-900"
          >
            <option value="Nhập khẩu kinh doanh (A11)">A11 - Nhập khẩu kinh doanh tiêu dùng</option>
            <option value="Nhập gia công (E21)">E21 - Nhập nguyên liệu gia công cho thương nhân nước ngoài</option>
            <option value="Nhập SXXK (E31)">E31 - Nhập nguyên liệu sản xuất xuất khẩu</option>
            <option value="Xuất khẩu kinh doanh (B11)">B11 - Xuất khẩu kinh doanh thương mại</option>
            <option value="Xuất SXXK (E62)">E62 - Xuất sản phẩm sản xuất xuất khẩu</option>
            <option value="Tạm nhập tái xuất (G11)">G11 - Tạm nhập tái xuất hàng hóa</option>
            <option value="Phi mậu dịch (H11)">H11 - Hàng quà biếu, mẫu thử phi mậu dịch</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-amber-600" />
            <span>Chi Cục Hải Quan Mở Tờ Khai *</span>
          </label>
          <input
            type="text"
            required
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              updateSpec('customsSubDepartment', e.target.value);
            }}
            placeholder="VD: Chi cục HQ Cửa khẩu Cảng Sài Gòn KV1 (Cát Lái) hoặc KV4 (ICD Phước Long)"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:outline-hidden font-medium"
          />
        </div>
      </div>

      {/* HS Code, Invoice Value & C/O Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Mã HS Code Tham Khảo (6-8 Số)
          </label>
          <input
            type="text"
            value={specs.hsCodePrimary || ''}
            onChange={(e) => updateSpec('hsCodePrimary', e.target.value)}
            placeholder="VD: 8471.30.20 hoặc 3901.10.12"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-500 font-mono font-bold text-amber-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tổng Trị Giá Hóa Đơn (Invoice USD)
          </label>
          <input
            type="text"
            value={specs.invoiceValueUSD ? specs.invoiceValueUSD.toLocaleString('vi-VN') : ''}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              updateSpec('invoiceValueUSD', val ? parseInt(val, 10) : undefined);
            }}
            placeholder="VD: 50.000"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-500 font-bold text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Form C/O Ưu Đãi Yêu Cầu</span>
          </label>
          <select
            value={specs.coFormRequested || 'Không yêu cầu'}
            onChange={(e) => updateSpec('coFormRequested', e.target.value as any)}
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-amber-500 font-medium"
          >
            <option value="Không yêu cầu">Không yêu cầu C/O</option>
            <option value="Form E (ASEAN-China)">Form E (ASEAN - Trung Quốc)</option>
            <option value="Form D (ASEAN)">Form D (Nội khối ASEAN)</option>
            <option value="Form EUR.1 (EVFTA)">Form EUR.1 (Hiệp định EVFTA Châu Âu)</option>
            <option value="Form AK (Korea)">Form AK (Việt - Hàn)</option>
            <option value="Form VJ (Japan)">Form VJ (Việt - Nhật)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
