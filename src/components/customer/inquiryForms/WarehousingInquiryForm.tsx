import React from 'react';
import { Building2, MapPin } from 'lucide-react';
import { WarehousingInquirySpecs } from '../../../types';
import { VASItemDef } from './VASSection';

export const WAREHOUSING_VAS_ITEMS: VASItemDef[] = [
  {
    id: 'w-vas-1',
    name: 'Dán nhãn phụ tiếng Việt & In mã vạch Barcode/QR SKU (Sub-labeling)',
    desc: 'Dán tem nhãn phụ hợp quy, nhãn cảnh báo và in dán tem Barcode kiểm soát vị trí.',
    tag: 'Dán tem phụ',
    popular: true,
  },
  {
    id: 'w-vas-2',
    name: 'Đóng gói Kitting, chia chọn combo & Đóng màng co nhiệt (Kitting)',
    desc: 'Tập hợp nhiều SKU thành bộ quà tặng, bọc màng co và dán băng keo thương hiệu.',
    tag: 'Đóng gói Kitting',
    popular: true,
  },
  {
    id: 'w-vas-3',
    name: 'Hoàn tất đơn hàng TMĐT Pick & Pack đa sàn Shopee/Lazada/Tiktok',
    desc: 'Xử lý đơn hàng B2C tự động, in phiếu giao hàng và bàn giao cho các đơn vị vận chuyển 3PL.',
    tag: 'Pick & Pack TMĐT',
    popular: true,
  },
  {
    id: 'w-vas-4',
    name: 'Tích hợp cổng API / EDI kết nối hệ thống WMS thời gian thực',
    desc: 'Đồng bộ tự động dữ liệu tồn kho, trạng thái đơn hàng giữa phần mềm ERP/SAP của khách và WMS.',
    tag: 'API WMS Real-time',
    popular: true,
  },
  {
    id: 'w-vas-5',
    name: 'Kiểm đếm Barcode Serial & Quản lý hạn sử dụng FIFO/FEFO',
    desc: 'Xuất hàng ưu tiên theo ngày hết hạn (FEFO) hoặc ngày nhập kho (FIFO) chống quá đát.',
    tag: 'Quản lý FIFO/FEFO',
    popular: true,
  },
  {
    id: 'w-vas-6',
    name: 'Đóng thùng Carton phân phối B2B và Pallet hóa quấn màng PE',
    desc: 'Phân loại hàng hóa đóng thùng carton theo tiêu chuẩn chuỗi siêu thị/đại lý cấp 1.',
    tag: 'Pallet hóa B2B',
  },
  {
    id: 'w-vas-7',
    name: 'Bảo hiểm cháy nổ & Rủi ro tài sản kho bãi toàn diện 100%',
    desc: 'Bảo hiểm rủi ro tài sản hàng hóa lưu kho theo giá trị thực tế khai báo hàng tháng.',
    tag: 'Bảo hiểm kho 100%',
  },
  {
    id: 'w-vas-8',
    name: 'Dịch vụ xử lý trả hàng hoàn (Reverse Logistics & Return Management)',
    desc: 'Tiếp nhận hàng đổi trả, kiểm tra tình trạng phẩm cấp và nhập kho tái phân phối.',
    tag: 'Xử lý hoàn hàng',
  },
];

interface WarehousingInquiryFormProps {
  specs: WarehousingInquirySpecs;
  onChange: (specs: WarehousingInquirySpecs) => void;
  origin: string;
  setOrigin: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
}

export const WarehousingInquiryForm: React.FC<WarehousingInquiryFormProps> = ({
  specs,
  onChange,
  origin,
  setOrigin,
  destination,
  setDestination,
}) => {
  const updateSpec = <K extends keyof WarehousingInquirySpecs>(key: K, value: WarehousingInquirySpecs[K]) => {
    onChange({
      ...specs,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Service Header Info */}
      <div className="p-3.5 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex items-start gap-3">
        <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div className="text-xs text-purple-950 flex-1">
          <span className="font-bold block text-sm text-purple-900">
            Dịch Vụ Kho Bãi 3PL & Trung Tâm Phân Phối (3PL Warehousing & Fulfillment)
          </span>
          <p className="text-purple-800/80 mt-0.5">
            Lựa chọn loại hình kho phù hợp: Kho Thường Grade A, Kho Ngoại Quan (Bonded), Kho Lạnh/Mát, Kho Hàng Nguy Hiểm (DG), Kho Fulfillment TMĐT hoặc Kho Tự Quản.
          </p>
        </div>
      </div>

      {/* Warehouse Model (6 Models) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
          <span>Mô Hình & Loại Hình Kho Bãi Chuyên Biệt (Warehouse Category) *</span>
          <span className="text-[11px] font-normal text-purple-600">6 Mô hình chuẩn hóa</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {[
            {
              type: 'Kho thường (Grade A Dry)',
              title: '🏬 Kho Thường Grade A',
              desc: 'Hàng bách hóa, tiêu dùng FMCG, máy móc công nghiệp, sàn bê tông chịu lực 5T/m2',
            },
            {
              type: 'Kho ngoại quan (Bonded)',
              title: '🔒 Kho Ngoại Quan (Bonded)',
              desc: 'Tạm hoãn thuế XNK, lưu trữ hàng chờ xuất khẩu hoặc chuyển khẩu quốc tế',
            },
            {
              type: 'Kho lạnh / Kho mát (Cold Storage)',
              title: '❄️ Kho Lạnh / Mát (Reefer)',
              desc: 'Dải nhiệt kiểm soát -20°C đến +15°C cho thực phẩm, hóa mỹ phẩm & thuốc GDP',
            },
            {
              type: 'Kho hàng nguy hiểm (DG Warehouse)',
              title: '⚠️ Kho Hàng Nguy Hiểm (DG)',
              desc: 'Hóa chất, sơn, dung môi, pin Lithium đạt chuẩn PCCC hóa chất chuyên dụng',
            },
            {
              type: 'Kho TMĐT / Fulfillment',
              title: '📦 Kho Fulfillment TMĐT',
              desc: 'Tích hợp hệ thống WMS, chia chọn Pick & Pack xử lý đơn hàng B2C đa sàn',
            },
            {
              type: 'Kho tự quản (Self-Storage)',
              title: '🔑 Kho Tự Quản (Self-Storage)',
              desc: 'Phân lô khoang riêng biệt có khóa riêng cho khách hàng tự quản lý xuất nhập',
            },
          ].map((item) => {
            const isSelected = specs.warehouseType === item.type;
            return (
              <div
                key={item.type}
                onClick={() => updateSpec('warehouseType', item.type as any)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/80 ring-2 ring-purple-500/20 text-purple-950 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Location Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>Khu Vực / Tỉnh Thành Mong Muốn Đặt Kho *</span>
          </label>
          <input
            type="text"
            required
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="VD: KCN Sóng Thần 1, Dĩ An, Bình Dương hoặc KCN Hiệp Phước, TP.HCM"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span>Phạm Vi & Bán Kính Phân Phối Trọng Tâm *</span>
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="VD: Toàn bộ khu vực TP.HCM, Bình Dương, Đồng Nai & Miền Tây"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Storage Volume: M2, Pallet, Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Diện Tích Thuê (m²)
          </label>
          <input
            type="text"
            value={specs.storageAreaSqm ? specs.storageAreaSqm.toLocaleString('vi-VN') : ''}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              updateSpec('storageAreaSqm', val ? parseInt(val, 10) : undefined);
            }}
            placeholder="VD: 500"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Số Vị Trí Pallet (Pallet Positions)
          </label>
          <input
            type="text"
            value={specs.palletPositions ? specs.palletPositions.toLocaleString('vi-VN') : ''}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              updateSpec('palletPositions', val ? parseInt(val, 10) : undefined);
            }}
            placeholder="VD: 350"
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Thời Hạn Thuê Dự Kiến
          </label>
          <select
            value={specs.rentalDurationMonths || 12}
            onChange={(e) => updateSpec('rentalDurationMonths', parseInt(e.target.value) || 12)}
            className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-purple-500 font-bold text-purple-900"
          >
            <option value={1}>1 Tháng (Lưu tạm thời vụ)</option>
            <option value={3}>3 Tháng (Ngắn hạn)</option>
            <option value={6}>6 Tháng (Trung hạn)</option>
            <option value={12}>12 Tháng (Hợp đồng 1 năm)</option>
            <option value={24}>24 Tháng (Dài hạn 2 năm)</option>
            <option value={36}>36 Tháng (Dài hạn 3 năm)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
