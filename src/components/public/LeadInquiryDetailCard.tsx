import React, { useState } from 'react';
import {
  Truck,
  Ship,
  Plane,
  Snowflake,
  Warehouse,
  FileCheck2,
  Globe,
  Train,
  Boxes,
  MapPin,
  Clock,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Download,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  PhoneCall,
  MessageSquare,
  Mail,
  Copy,
  Check,
  KeyRound,
  Coins,
  Building2,
  Phone,
  Bookmark,
  BookmarkCheck,
  BarChart3,
  Send,
  Sparkles,
  Lock,
  Info,
  Share2,
  BadgePercent,
  Receipt,
  Wrench,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { SupplierLeadItem, ServiceType, ProjectInquirySpecs } from '../../types';

interface LeadInquiryDetailCardProps {
  lead: SupplierLeadItem;
  isUnlocked?: boolean;
  maskCompanyName?: (name: string, unlocked?: boolean) => string;
  maskContactPerson?: (name: string, unlocked?: boolean) => string;
  onUnlockClick?: () => void;
  onOpenCreateQuotation?: (lead: SupplierLeadItem) => void;
  onToggleSaveLead?: (lead: SupplierLeadItem, e?: React.MouseEvent) => void;
  onCompareClick?: (lead: SupplierLeadItem) => void;
  isCustomerView?: boolean;
}

export const LeadInquiryDetailCard: React.FC<LeadInquiryDetailCardProps> = ({
  lead,
  isUnlocked = false,
  maskCompanyName = (name: string) => name,
  maskContactPerson = (name: string) => name,
  onUnlockClick,
  onOpenCreateQuotation,
  onToggleSaveLead,
  onCompareClick,
  isCustomerView = false,
}) => {
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedShareLead, setCopiedShareLead] = useState(false);

  const inq = lead.inquiry;
  const specsData = lead.serviceSpecs || inq?.serviceSpecs;
  const sType = lead.serviceType;
  const code = lead.code;

  const phoneValue = lead.contactPhone || inq?.contactPerson || '0908 123 456';
  const emailValue = lead.contactEmail || 'procurement@shipper-logistics.vn';
  const taxIdValue = lead.taxId || '0314892831';

  const handleShareLead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const leadCode = lead.code;
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?tab=lead-board&leadCode=${leadCode}`
      : `https://logistics.vietnam.io/?tab=lead-board&leadCode=${leadCode}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedShareLead(true);
    setTimeout(() => setCopiedShareLead(false), 2500);
  };

  const handleCopyPhone = (value: string) => {
    navigator.clipboard?.writeText(value);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleDownloadFile = (fileName: string) => {
    setDownloadToast(`Đang tải tệp tin: ${fileName}`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3000);
  };

  // Helper to extract or synthesize full inquiry declaration specs tailored to the specific lead and service type
  const getSpecs = () => {
    // 1. TRUCKING SPECS
    if (sType === 'Trucking') {
      const tr = specsData?.trucking;
      const isLtl = tr?.loadType?.includes('LTL') || lead.volumeDisplay?.toLowerCase().includes('ltl') || lead.volumeDisplay?.toLowerCase().includes('ghép');
      
      const grid = [
        {
          label: 'Hình thức vận tải',
          value: tr?.loadType || (isLtl ? 'LTL - Ghép hàng lẻ phân tuyến' : 'FTL - Bao nguyên chuyến (Full Truckload)'),
          sub: 'Vận tải nội địa đường bộ',
          highlight: true,
        },
        {
          label: 'Loại phương tiện & Thùng xe',
          value: tr?.truckType || 'Xe tải thùng kín tiêu chuẩn',
          sub: tr?.internalDimensions ? `Lọt lòng: ${tr.internalDimensions}` : 'Đạt chuẩn kiểm định an toàn',
        },
        {
          label: 'Phân khúc tải trọng / Sức chở',
          value: tr?.tonnageCategory || (isLtl ? `${tr?.ltlGrossWeightKg || 500} kg Gross` : 'Xe tải 8 - 15 Tấn'),
          sub: isLtl && tr?.ltlCbm ? `Thể tích LTL: ${tr.ltlCbm} CBM` : 'Đáp ứng tải trọng lưu hành',
        },
        {
          label: 'Quy cách & Đóng gói hàng hóa',
          value: tr?.ltlPackaging || lead.packaging || inq?.packaging || 'Pallet đóng màng co PE tiêu chuẩn',
          sub: typeof tr?.ltlStackable === 'boolean' ? (tr.ltlStackable ? '✓ Cho phép xếp chồng' : '⚠️ Không được xếp chồng') : 'Chống va đập rung lắc',
        },
        {
          label: 'Điểm lấy hàng (Origin Hub)',
          value: lead.origin,
          sub: 'Kho xuất phát / Nhà máy',
        },
        {
          label: 'Điểm giao hàng (Destination Hub)',
          value: lead.destination,
          sub: 'Kho nhận / Trung tâm phân phối',
        },
        {
          label: 'Nhân công bốc xếp 2 đầu',
          value: (tr?.loadingLaborRequired && tr?.unloadingLaborRequired)
            ? 'Bao gồm nhân công bốc xếp 2 đầu'
            : (tr?.loadingLaborRequired ? 'Cần bốc xếp đầu lấy' : (tr?.unloadingLaborRequired ? 'Cần bốc xếp đầu giao' : 'Chủ hàng tự bốc dỡ forklift')),
          sub: 'Theo yêu cầu đơn hàng',
        },
        {
          label: 'Thiết bị phụ trợ xe tải',
          value: (tr?.tailLiftRequired ? 'Xe bửng nâng thủy lực' : '') + (tr?.craneAssistanceRequired ? ' + Cẩu tự hành' : '') || 'Phương tiện thùng kín tiêu chuẩn',
          sub: tr?.prohibitedHoursPassNeeded ? '✓ Yêu cầu giấy phép giờ cấm phố' : 'Lưu thông tuyến quy chuẩn',
        },
        {
          label: 'Tần suất & Số lượng chuyến',
          value: `${tr?.vehicleCount || tr?.ltlShipmentCount || 1} ${tr?.vehicleCountUnit || tr?.ltlFrequencyUnit || 'chuyến'}`,
          sub: lead.contractTerm || 'Chuyến lẻ theo lô',
        },
      ];

      return {
        serviceCategory: 'Vận tải nội địa đường bộ (Domestic Trucking)',
        serviceIcon: Truck,
        colorTheme: 'blue',
        specsGrid: grid,
        slaChecklist: [
          'GPS Real-time Tracking: Bắt buộc cung cấp định vị hành trình xe 24/7',
          'Lái xe chuyên nghiệp: Đầy đủ GPLX phù hợp, trang bị PPE bảo hộ lao động',
          'Bảo hiểm trách nhiệm hàng hóa: Bảo hiểm 100% giá trị hàng hóa',
          'Biên bản giao nhận hàng (POD): Trả bản cứng có đủ chữ ký con dấu trong vòng 3 ngày',
          'Thời gian dừng chờ bốc xếp: Tối đa 2 giờ miễn phí tại mỗi đầu kho',
        ],
        customerNotes: inq?.description || lead.description || (isLtl 
          ? 'Lô hàng ghép tuyến cần bảo quản khô ráo, không để lẫn với hàng hóa chất hay hàng có mùi. Yêu cầu giao nhận đúng hẹn theo cam kết SLA.'
          : 'Hàng hóa giá trị cao, tài xế kiểm tra niêm phong seal trước khi lăn bánh. Bàn giao đầy đủ phiếu cân và hóa đơn chứng từ kèm theo.'),
        attachments: lead.attachments || inq?.attachments || [
          { id: 'att-1', name: 'Packing_List_Detailed_Shipment.xlsx', size: '280 KB', type: 'excel', uploadedDate: 'Vừa cập nhật' },
          { id: 'att-2', name: 'So_Do_Xep_Hang_Pallet_Layout.pdf', size: '1.4 MB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
          { id: 'att-3', name: 'Quy_Chuan_An_Toan_Giao_Nhan_PPE.pdf', size: '920 KB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
        ],
      };
    }

    // 2. SEA FREIGHT (FCL) SPECS
    if (sType === 'Sea Freight (FCL)') {
      const oc = specsData?.ocean;
      return {
        serviceCategory: 'Vận tải đường biển quốc tế & nội địa nguyên Container (Ocean FCL)',
        serviceIcon: Ship,
        colorTheme: 'cyan',
        specsGrid: [
          {
            label: 'Phương thức vận tải',
            value: 'FCL (Full Container Load) - Hàng nguyên container',
            sub: 'Đóng ghép tại nhà máy / Cảng biển',
            highlight: true,
          },
          {
            label: 'Quy cách & Loại Container',
            value: `${oc?.containerCount || 1}x Container ${oc?.containerType || '40ft High Cube (40HC)'}`,
            sub: 'Vỏ cont tiêu chuẩn Cargo Worthy',
          },
          {
            label: 'Cảng bốc hàng (POL)',
            value: oc?.polPort || lead.origin,
            sub: 'Port of Loading',
          },
          {
            label: 'Cảng dỡ hàng (POD)',
            value: oc?.podPort || lead.destination,
            sub: 'Port of Discharge',
          },
          {
            label: 'Điều kiện giao nhận & Incoterms',
            value: `${oc?.originServiceTerm || 'CY'} ➔ ${oc?.destinationServiceTerm || 'CY'} (${oc?.incoterm || lead.incoterms || 'FOB'})`,
            sub: 'Phân định trách nhiệm & chi phí',
          },
          {
            label: 'Hạn lưu bãi & Vỏ cont (Free Dem/Det)',
            value: oc?.freeDemDetDaysRequested ? `Yêu cầu tối thiểu ${oc.freeDemDetDaysRequested} ngày Free Dem/Det` : 'Tối thiểu 7 - 14 ngày Free Dem/Det',
            sub: 'Hỗ trợ thủ tục thông quan tại cảng',
          },
          {
            label: 'Tổng sản lượng & Tần suất',
            value: `${oc?.containerCount || 1} ${oc?.containerCountUnit || 'Container / Tháng'}`,
            sub: lead.contractTerm || 'Theo lô xuất nhập khẩu',
          },
          {
            label: 'Hãng tàu chỉ định / Ưu tiên',
            value: oc?.preferredShippingLines || 'Hãng tàu uy tín có lịch Direct',
            sub: 'Đảm bảo thời gian hải trình',
          },
        ],
        slaChecklist: [
          'Hãng tàu uy tín: Ưu tiên các line tàu lớn có lịch trình ổn định',
          'Free Dem/Det: Cam kết đủ thời gian Free Demurrage + Detention tại cảng đích',
          'Khai báo VGM & Closing Time: Forwarder theo dõi sát lịch cut-off và nộp VGM đúng hạn',
          'Theo dõi hành trình: Cung cấp Tracking link theo dõi vị trí tàu và ETA cập nhật',
        ],
        customerNotes: inq?.description || lead.description || 'Lô hàng xuất khẩu nguyên container, yêu cầu vỏ cont sạch sẽ không mùi, sàn cont khô ráo. Báo giá trọn gói bao gồm cước biển (O/F) và Local Charges 2 đầu.',
        attachments: lead.attachments || inq?.attachments || [
          { id: 'att-1', name: 'Commercial_Invoice_Packing_List.pdf', size: '1.8 MB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
          { id: 'att-2', name: 'Packing_List_Containers_Breakdown.xlsx', size: '450 KB', type: 'excel', uploadedDate: 'Vừa cập nhật' },
        ],
      };
    }

    // 3. SEA FREIGHT (LCL) SPECS
    if (sType === 'Sea Freight (LCL)') {
      const oc = specsData?.ocean;
      return {
        serviceCategory: 'Vận tải đường biển đóng ghép hàng lẻ kho CFS (Ocean LCL)',
        serviceIcon: Ship,
        colorTheme: 'teal',
        specsGrid: [
          {
            label: 'Phương thức gom hàng',
            value: 'LCL (Less than Container Load) - Hàng lẻ đóng ghép kho CFS',
            sub: 'Tính cước theo Thể tích CBM hoặc Tấn (W/M)',
            highlight: true,
          },
          {
            label: 'Tổng thể tích & Trọng lượng tính cước',
            value: `${oc?.lclCbm || oc?.cbmVolume || 10} CBM | CW: ${oc?.lclChargeableWeightKg ? Number(oc.lclChargeableWeightKg).toLocaleString('vi-VN') + ' kg' : 'Theo CBM'}`,
            sub: oc?.lclRevenueTon ? `Quy đổi: ${oc.lclRevenueTon} RT (Revenue Ton)` : 'Tính cước theo mức lớn hơn',
          },
          {
            label: 'Kho gom hàng bốc (POL CFS)',
            value: oc?.polPort || lead.origin,
            sub: 'Kho CFS tiếp nhận xuất phát',
          },
          {
            label: 'Kho gom hàng dỡ (POD CFS)',
            value: oc?.podPort || lead.destination,
            sub: 'Kho CFS đích phân phối',
          },
          {
            label: 'Điều kiện nhận & giao',
            value: `${oc?.originServiceTerm || 'CFS'} ➔ ${oc?.destinationServiceTerm || 'CFS'} (${oc?.incoterm || lead.incoterms || 'FOB'})`,
            sub: 'Giao nhận tại kho CFS cảng',
          },
          {
            label: 'Số kiện & Quy cách đóng gói',
            value: `${oc?.lclPieces || 10} kiện (${oc?.lclPackaging || lead.packaging || 'Pallet tiêu chuẩn'})`,
            sub: typeof oc?.lclStackable === 'boolean' ? (oc.lclStackable ? '✓ Cho phép xếp chồng' : '⚠️ Không được chồng') : 'Bọc màng PE chống ẩm',
          },
          {
            label: 'Tần suất gửi hàng LCL',
            value: `${oc?.lclShipmentCount || 1} ${oc?.lclFrequencyUnit || 'chuyến / tháng'}`,
            sub: lead.contractTerm || 'Gom hàng lẻ định kỳ',
          },
        ],
        slaChecklist: [
          'CFS Local Charges minh bạch: Báo giá rõ ràng phí CFS fee, D/O, Handling, B/L fee',
          'Kiểm đếm tại kho: Forwarder chụp ảnh tình trạng kiện hàng khi nhập kho CFS',
          'Thời gian hải trình: Lịch tàu Direct ổn định từ 5 - 10 ngày',
        ],
        customerNotes: inq?.description || lead.description || 'Lô hàng lẻ đóng ghép kho CFS, yêu cầu bao bì nguyên vẹn, dán tem nhãn cảnh báo rõ ràng. Cần forwarder có line LCL chuyên tuyến hàng tuần.',
        attachments: lead.attachments || inq?.attachments || [
          { id: 'att-1', name: 'Packing_List_LCL_Cargo.xlsx', size: '210 KB', type: 'excel', uploadedDate: 'Vừa cập nhật' },
          { id: 'att-2', name: 'ISPM15_Pallet_Certificate.pdf', size: '750 KB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
        ],
      };
    }

    // 4. AIR FREIGHT SPECS
    if (sType === 'Air Freight') {
      const air = specsData?.air;
      const isExpress = air?.airServiceType === 'Express / Courier';

      return {
        serviceCategory: isExpress ? 'Chuyển phát nhanh bưu phẩm hàng không (Express Courier)' : 'Vận tải hàng không quốc tế (Air Freight Cargo)',
        serviceIcon: Plane,
        colorTheme: 'sky',
        specsGrid: [
          {
            label: 'Phân loại dịch vụ hàng không',
            value: isExpress ? '⚡ Express / Courier (Door-to-Door)' : '✈️ Air Freight / Cargo (Bay thẳng Direct)',
            sub: air?.serviceLevel || 'Tiêu chuẩn tốc độ cao',
            highlight: true,
          },
          {
            label: 'Sân bay đi (AOD Airport)',
            value: air?.originAirport || lead.origin,
            sub: air?.originPostalCode ? `Mã Zip Đi: ${air.originPostalCode}` : 'Airport of Departure',
          },
          {
            label: 'Sân bay đến (AOA Airport)',
            value: air?.destinationAirport || lead.destination,
            sub: air?.destinationPostalCode ? `Mã Zip Đến: ${air.destinationPostalCode}` : 'Airport of Arrival',
          },
          {
            label: 'Số kiện & Trọng lượng tính cước (CW)',
            value: `${air?.packageCount || 1} kiện | CW: ${air?.chargeableWeightKgs || lead.volumeDisplay || '100 kg'}`,
            sub: air?.volumetricWeightKgs ? `Gross: ${air.grossWeightKgs || 0} kg • VW: ${air.volumetricWeightKgs} kg` : 'Theo tỷ lệ 1:6000 IATA',
          },
          {
            label: 'Điều kiện nhận & giao',
            value: `${air?.originServiceTerm || (isExpress ? 'Door' : 'Airport')} ➔ ${air?.destinationServiceTerm || (isExpress ? 'Door' : 'Airport')}`,
            sub: air?.tradeRole || inq?.tradeRole || 'Xuất khẩu (Export)',
          },
          {
            label: 'Thông quan tại sân bay',
            value: air?.customsAtAirport ? '✓ Bao gồm thủ tục hải quan sân bay' : 'Chủ hàng tự mở tờ khai',
            sub: 'Thông quan nhanh trước giờ cắt máng',
          },
          {
            label: 'Tần suất & Số chuyến bay',
            value: `${air?.shipmentCount || 1} ${air?.frequencyUnit || 'Chuyến / Tuần'}`,
            sub: lead.contractTerm || 'Chuyến bay chỉ định',
          },
        ],
        slaChecklist: [
          'Hãng bay uy tín: Ưu tiên đường bay thẳng không quá cảnh',
          'Vận đơn hàng không AWB: Phát hành Master/House AWB điện tử ngay sau khi cân đo',
          'An toàn bay: Tuân thủ nghiêm ngặt quy định an toàn IATA (Non-DG / MSDS)',
          'Bảo hiểm hàng hóa: Bảo hiểm 100% giá trị khai báo thương mại',
        ],
        customerNotes: inq?.description || lead.description || 'Lô hàng chuyển phát nhanh hàng không, nhạy cảm thời gian. Yêu cầu chuyển giao cẩn thận, không quăng ném, booking chuyến bay sớm nhất.',
        attachments: lead.attachments || inq?.attachments || [
          { id: 'att-1', name: 'Commercial_Invoice_Air_Shipment.pdf', size: '1.2 MB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
          { id: 'att-2', name: 'Non_DG_Declaration_IATA.pdf', size: '890 KB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
        ],
      };
    }

    // 5. COLD CHAIN SPECS
    if (sType === 'Cold Chain') {
      const cc = specsData?.coldChain;
      return {
        serviceCategory: 'Vận tải chuỗi lạnh & Kiểm soát nhiệt độ chuyên sâu (Cold Chain Logistics)',
        serviceIcon: Snowflake,
        colorTheme: 'amber',
        specsGrid: [
          {
            label: 'Dải nhiệt độ bảo quản nghiêm ngặt',
            value: cc?.temperatureRange || inq?.temperatureRequirement || 'Nhiệt độ Mát: +2°C đến +8°C',
            sub: `Dung sai cho phép: ${cc?.temperatureTolerance || '±1.5°C'}`,
            highlight: true,
          },
          {
            label: 'Quy cách phương tiện lạnh',
            value: cc?.coldVehicleType || 'Xe tải lạnh chuyên dụng Foam Composite',
            sub: cc?.gensetRequired ? 'Máy phát điện Genset chạy 100% hành trình' : 'Máy lạnh Thermo King / Carrier',
          },
          {
            label: 'Yêu cầu Pre-cooling thùng',
            value: cc?.preCoolingRequired ? '✓ Bắt buộc hạ nhiệt độ thùng trước khi bốc' : 'Làm lạnh theo quy trình chuẩn',
            sub: 'Kiểm tra nhiệt độ sàn trước khi chất hàng',
          },
          {
            label: 'Giám sát hành trình & IoT Logger',
            value: cc?.iotLoggerRequired ? '✓ Cảm biến nhiệt IoT Real-time + USB Data Logger' : 'Theo dõi nhiệt độ định kỳ',
            sub: 'Xuất biểu đồ nhiệt sau mỗi chuyến giao',
          },
          {
            label: 'Điểm lấy hàng lạnh',
            value: lead.origin,
            sub: 'Kho lạnh nông trường / Nhà máy chế biến',
          },
          {
            label: 'Điểm giao hàng lạnh',
            value: lead.destination,
            sub: 'Kho trung tâm phân phối / Cảng xuất khẩu',
          },
          {
            label: 'Tiêu chuẩn vệ sinh & An toàn',
            value: 'Đạt chuẩn HACCP / ISO 22000',
            sub: 'Thùng xe khử trùng sạch sẽ, không mùi',
          },
        ],
        slaChecklist: [
          'Cam kết nhiệt độ liên tục: Đền bù hư hỏng nếu nhiệt độ vượt ngưỡng cho phép',
          'Biểu đồ nhiệt điện tử: Xuất file dữ liệu từ thiết bị Logger kèm biên bản POD',
          'Lái xe chuyên nghiệp: Được đào tạo quy trình vận hành máy lạnh thùng xe',
        ],
        customerNotes: inq?.description || lead.description || 'Hàng thực phẩm / dược phẩm kiểm soát nhiệt độ nghiêm ngặt. Thùng xe phải được làm lạnh trước và duy trì liên tục suốt hành trình.',
        attachments: lead.attachments || inq?.attachments || [
          { id: 'att-1', name: 'Quy_Trinh_Kiem_Soat_Nhiet_Do.pdf', size: '1.5 MB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
          { id: 'att-2', name: 'HACCP_Food_Safety_Certificate.pdf', size: '890 KB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
        ],
      };
    }

    // 6. WAREHOUSING SPECS
    if (sType === 'Warehousing') {
      const wh = specsData?.warehousing;
      return {
        serviceCategory: 'Dịch vụ kho bãi, lưu trữ & Hoàn tất đơn hàng 3PL (Warehousing & 3PL)',
        serviceIcon: Warehouse,
        colorTheme: 'purple',
        specsGrid: [
          {
            label: 'Loại hình kho bãi yêu cầu',
            value: wh?.warehouseType || 'Kho tiêu chuẩn Grade A (Trần cao cách nhiệt)',
            sub: 'Sàn bê tông xoa phẳng phủ Epoxy',
            highlight: true,
          },
          {
            label: 'Diện tích & Sức chứa cần thuê',
            value: `${wh?.storageAreaM2 || inq?.origin || '2,500'} m² sàn kho chuyên dụng`,
            sub: wh?.palletPositions ? `+ ${wh.palletPositions} vị trí Pallet Racking` : 'Chiều cao thông thủy > 10m',
          },
          {
            label: 'Thời hạn hợp đồng cam kết',
            value: wh?.leaseDurationMonths ? `Hợp đồng ${wh.leaseDurationMonths} tháng` : (lead.contractTerm || 'Hợp đồng dài hạn 12 - 24 tháng'),
            sub: 'Đơn giá cố định theo năm',
          },
          {
            label: 'Lưu lượng Nhập / Xuất (In/Out Flow)',
            value: wh?.inboundFrequency ? `Nhập: ${wh.inboundFrequency}` : 'Nhập xuất hàng ngày theo PO',
            sub: wh?.outboundFrequency ? `Xuất: ${wh.outboundFrequency}` : 'Soạn hàng theo nguyên tắc FIFO/FEFO',
          },
          {
            label: 'Tích hợp phần mềm WMS & Báo cáo',
            value: wh?.wmsIntegrationRequired ? '✓ Bắt buộc tích hợp API WMS kết nối ERP' : 'Báo cáo tồn kho định kỳ',
            sub: 'Kiểm kê chu kỳ Cycle Count',
          },
          {
            label: 'Hệ thống PCCC & An ninh',
            value: wh?.fireSafetyStandard || 'Sprinkler tự động NFPA + Camera CCTV 24/7',
            sub: 'Đầy đủ biên bản nghiệm thu PCCC',
          },
          {
            label: 'Khu vực địa bàn kho mục tiêu',
            value: wh?.targetLocation || lead.origin,
            sub: 'Gần trục giao thông chính',
          },
        ],
        slaChecklist: [
          'Độ chính xác tồn kho (Inventory Accuracy): Cam kết đạt tối thiểu 99.8%',
          'Thời gian hoàn tất đơn hàng (Fulfillment SLA): Xử lý đơn hàng trong ngày',
          'Bảo hiểm cháy nổ: Bảo hiểm kho và hàng hóa lưu kho đầy đủ',
        ],
        customerNotes: inq?.description || lead.description || 'Cần thuê kho sạch sẽ, an ninh 24/7, có cửa Dock Leveler cho xe container cập sàn bốc dỡ. Đơn vị vận hành có WMS chuyên nghiệp.',
        attachments: lead.attachments || inq?.attachments || [
          { id: 'att-1', name: 'Yeu_Cau_Ky_Thuat_Kho_3PL.pdf', size: '2.4 MB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
          { id: 'att-2', name: 'Danh_Muc_SKU_San_Pham.xlsx', size: '640 KB', type: 'excel', uploadedDate: 'Vừa cập nhật' },
        ],
      };
    }

    // 7. CUSTOMS CLEARANCE SPECS
    if (sType === 'Customs Clearance') {
      const cc = specsData?.customs;
      return {
        serviceCategory: 'Dịch vụ khai báo hải quan, C/O & Kiểm tra chuyên ngành (Customs Brokerage)',
        serviceIcon: FileCheck2,
        colorTheme: 'violet',
        specsGrid: [
          {
            label: 'Loại hình tờ khai hải quan',
            value: cc?.declarationType || 'Nhập khẩu Sản xuất Xuất khẩu (E31)',
            sub: 'Hồ sơ thông quan điện tử VNACCS',
            highlight: true,
          },
          {
            label: 'Chi cục Hải quan làm thủ tục',
            value: cc?.customsBranch || lead.origin,
            sub: 'Chi cục Hải quan tiếp nhận tờ khai',
          },
          {
            label: 'Cảng / Cửa khẩu tiếp nhận hàng',
            value: cc?.entryPort || lead.destination,
            sub: 'Địa điểm lưu bãi kiểm hóa',
          },
          {
            label: 'Số lượng dòng hàng & Mã HS',
            value: cc?.itemsCount ? `${cc.itemsCount} Dòng hàng (HS: ${cc.mainHsCodes || 'Biểu thuế XNK'})` : 'Khai báo chuẩn xác tên hàng theo biểu thuế',
            sub: 'Khớp mã HS và thuế suất',
          },
          {
            label: 'Chứng nhận xuất xứ (C/O)',
            value: cc?.coType || 'Hỗ trợ xin cấp / Kiểm tra C/O ưu đãi thuế',
            sub: 'Tối ưu thuế quan xuất nhập khẩu',
          },
          {
            label: 'Kiểm tra chuyên ngành',
            value: cc?.specializedInspection ? `✓ ${cc.specializedInspection}` : 'Hàng thông thường, không kiểm tra chuyên ngành',
            sub: 'Đăng ký Quatest / Kiểm dịch',
          },
        ],
        slaChecklist: [
          'Thời gian thông quan: Giải phóng hàng trong vòng 24 - 36h',
          'Độ chính xác hồ sơ: Tránh sai sót mã HS và định mức tiêu hao',
          'Nhân viên hiện trường: Túc trực trực tiếp tại bãi kiểm hóa mở cont tiếp hải quan',
        ],
        customerNotes: inq?.description || lead.description || 'Doanh nghiệp cần đại lý hải quan uy tín, xử lý nhanh thủ tục thông quan và hướng dẫn tối ưu thuế xuất nhập khẩu.',
        attachments: lead.attachments || inq?.attachments || [
          { id: 'att-1', name: 'Commercial_Invoice_Packing_List.pdf', size: '1.6 MB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
          { id: 'att-2', name: 'Danh_Muc_Dong_Hang_HS_Codes.xlsx', size: '380 KB', type: 'excel', uploadedDate: 'Vừa cập nhật' },
        ],
      };
    }

    // 8. CROSS-BORDER SPECS
    if (sType === 'Cross-border') {
      const cb = specsData?.crossBorder;
      return {
        serviceCategory: 'Vận tải liên vận quốc tế đường bộ xuyên biên giới (Cross-Border Trucking)',
        serviceIcon: Globe,
        colorTheme: 'rose',
        specsGrid: [
          {
            label: 'Cửa khẩu quốc tế thông quan',
            value: cb?.borderGate || 'Cửa khẩu Quốc tế Mộc Bài (VN) ↔ Bavet (Campuchia)',
            sub: 'Hành lang kinh tế liên vận quốc tế',
            highlight: true,
          },
          {
            label: 'Phương thức vận tải liên vận',
            value: cb?.transportMode || 'Xe liên vận chạy thẳng GMS không sang tải',
            sub: 'Xe có Giấy phép vận tải liên vận song phương',
          },
          {
            label: 'Đội xe & Tải trọng huy động',
            value: cb?.fleetType || 'Đội xe tải 15 Tấn thùng kín chạy định kỳ',
            sub: 'Lái xe có hộ chiếu và bằng lái quốc tế',
          },
          {
            label: 'Điểm xuất phát (Origin Hub)',
            value: cb?.originCity || lead.origin,
            sub: 'Kho đóng hàng xuất khẩu tại Việt Nam',
          },
          {
            label: 'Điểm giao hàng đích (Destination)',
            value: cb?.destinationCity || lead.destination,
            sub: 'Kho nhà máy đối tác nước ngoài',
          },
          {
            label: 'Thủ tục hải quan 2 đầu biên giới',
            value: cb?.customsHandling || 'Trọn gói thủ tục hải quan xuất nhập khẩu 2 đầu',
            sub: 'Đại lý xử lý thông quan bến bãi cửa khẩu',
          },
        ],
        slaChecklist: [
          'Thời gian hành trình: Chạy thẳng trong ngày từ kho VN đến kho nước ngoài',
          'Nhân sự cửa khẩu: Có văn phòng đại diện và nhân viên túc trực 24/7 tại 2 bên cửa khẩu',
          'Bảo hiểm vận tải quốc tế: Bảo hiểm hàng hóa toàn tuyến xuyên biên giới',
        ],
        customerNotes: inq?.description || lead.description || 'Vận chuyển liên vận quốc tế, yêu cầu xe chạy thẳng không sang tải tại cửa khẩu để tránh hư hỏng hàng hóa.',
        attachments: lead.attachments || inq?.attachments || [
          { id: 'att-1', name: 'Cross_Border_Scope_Checklist.pdf', size: '2.1 MB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
          { id: 'att-2', name: 'Packing_List_CrossBorder.xlsx', size: '410 KB', type: 'excel', uploadedDate: 'Vừa cập nhật' },
        ],
      };
    }

    // 9. RAIL FREIGHT SPECS
    if (sType === 'Rail Freight') {
      const rail = specsData?.rail;
      return {
        serviceCategory: 'Vận tải đường sắt liên vận & Tuyến trục Bắc - Nam (Rail Freight Logistics)',
        serviceIcon: Train,
        colorTheme: 'blue',
        specsGrid: [
          {
            label: 'Phương thức vận tải đường sắt',
            value: rail?.wagonType || 'Toa Container 40ft / Toa kín G chuyên tuyến',
            sub: 'Tàu hàng nhanh tuyến trục cố định',
            highlight: true,
          },
          {
            label: 'Ga bốc xếp đi (Origin Station)',
            value: rail?.originStation || lead.origin,
            sub: 'Ga đường sắt tiếp nhận hàng',
          },
          {
            label: 'Ga dỡ hàng đến (Destination Station)',
            value: rail?.destinationStation || lead.destination,
            sub: 'Ga đường sắt hạ bãi phân phối',
          },
          {
            label: 'Dịch vụ Drayage kéo cont 2 đầu',
            value: (rail?.drayageFirstMile && rail?.drayageLastMile) ? 'Kéo cont Door-to-Door 2 đầu ga' : ((rail?.drayageFirstMile || rail?.drayageLastMile) ? 'Kéo cont 1 đầu ga' : 'Giao nhận tại bãi ga (Station-to-Station)'),
            sub: 'Kết nối đường bộ & đường sắt',
          },
          {
            label: 'Số lượng toa / cont & Tần suất',
            value: `${rail?.wagonCount || 1} ${rail?.wagonCountUnit || 'Toa cont / Tháng'}`,
            sub: lead.contractTerm || 'Theo chuyến đường sắt định kỳ',
          },
          {
            label: 'Điều kiện thương mại Incoterms',
            value: rail?.incoterm || lead.incoterms || 'FOR (Free on Rail) / Door',
            sub: 'Phân định chi phí nâng hạ bãi ga',
          },
        ],
        slaChecklist: [
          'Lịch tàu ổn định: Tàu hàng chạy đúng hành trình cam kết',
          'Nâng hạ bãi ga: Có cẩu chuyên dụng hạ cont an toàn tại 2 đầu ga',
          'Bảo vệ an ninh: Niêm phong kẹp chì toa cont suốt tuyến hành trình',
        ],
        customerNotes: inq?.description || lead.description || 'Lô hàng vận chuyển đường sắt tuyến trục Bắc Nam, yêu cầu đóng cont cẩn thận, chằng buộc chống xê dịch khi tàu chạy.',
        attachments: lead.attachments || inq?.attachments || [
          { id: 'att-1', name: 'Rail_Transport_Specification.pdf', size: '1.4 MB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
        ],
      };
    }

    // 10. PROJECT CARGO SPECS (4 CATEGORIES)
    if (sType === 'Project Cargo') {
      const pr = specsData?.project;
      const cat = pr?.projectCategory || 'DISTRIBUTION';

      let grid: Array<{ label: string; value: string; sub?: string; highlight?: boolean }> = [];

      if (cat === 'DISTRIBUTION') {
        grid = [
          {
            label: 'Mô hình dự án',
            value: 'Mạng Lưới Phân Phối B2B / Bán Lẻ (Distribution Tender)',
            sub: pr?.distributionChannel || 'Kênh bán lẻ & Đại lý toàn quốc',
            highlight: true,
          },
          {
            label: 'Phạm vi bao phủ (Coverage Scope)',
            value: pr?.coverageScope || 'Toàn quốc (Bắc - Trung - Nam)',
            sub: 'Độ phủ các trung tâm tỉnh thành',
          },
          {
            label: 'Hệ thống kho xuất phát (Origin Warehouses)',
            value: pr?.originWarehouses?.join(', ') || lead.origin,
            sub: 'Điểm gom xuất hàng phân phối',
          },
          {
            label: 'Cơ cấu đội xe huy động (Fleet Structure)',
            value: pr?.fleetRequirements?.join(', ') || 'Đội xe đa tải trọng 1.5T - 15T',
            sub: 'Đội xe chuyên dụng đạt chuẩn',
          },
          {
            label: 'Sản lượng & Tần suất vận hành',
            value: pr?.monthlyTripsOrVolume || `${pr?.tripCount || 100} ${pr?.frequencyUnit || 'chuyến / tháng'}`,
            sub: lead.contractTerm || 'Hợp đồng thầu dài hạn 12 - 24 tháng',
          },
          {
            label: 'Chỉ số cam kết KPI cốt lõi',
            value: pr?.keyKPIRequirements?.slice(0, 2).join(' • ') || 'OTD > 98% • POD trong 48h',
            sub: 'Cam kết tiêu chuẩn chất lượng dịch vụ',
          },
        ];
      } else if (cat === 'CROSS_DOCK') {
        grid = [
          {
            label: 'Mô hình dự án',
            value: 'Trung Chuyển Phân Loại Cross-Docking (Retail Consolidation)',
            sub: pr?.xDockScope || 'Nội vùng & Tuyến trục liên vùng',
            highlight: true,
          },
          {
            label: 'Hub tiếp nhận Inbound Cross-Dock',
            value: pr?.xDockHubLocation || lead.origin,
            sub: 'Trung tâm phân loại hàng lẻ',
          },
          {
            label: 'Hub phân phối Outbound',
            value: pr?.xDockDestinationHub || lead.destination,
            sub: 'Trung tâm phân phối vùng',
          },
          {
            label: 'Đơn vị tính cước định mức',
            value: pr?.xDockPricingMetric || 'VND / Pallet / Kiện',
            sub: 'Tính theo sản lượng thực tế qua trạm',
          },
          {
            label: 'Lưu lượng xe & Hàng Inbound',
            value: `${pr?.xDockInboundVolume || '500'} ${pr?.xDockInboundFrequencyUnit || 'Pallet / Ngày'}`,
            sub: pr?.inboundDailyVolume ? `Sản lượng: ${pr.inboundDailyVolume}` : 'Tiếp nhận liên tục theo ca',
          },
          {
            label: 'Phương tiện trung chuyển',
            value: pr?.inboundVehicleTypes?.join(', ') || 'Xe tải 8T - 15T thùng kín',
            sub: 'Phục vụ chuỗi cung ứng siêu thị',
          },
        ];
      } else if (cat === 'PORT_ICD') {
        grid = [
          {
            label: 'Mô hình dự án',
            value: 'Trung Chuyển Cảng Biển & ICD Depot (Port Shuttling)',
            sub: 'Dịch vụ kéo vỏ cont & giải tỏa cảng',
            highlight: true,
          },
          {
            label: 'Cảng biển kết nối',
            value: pr?.portICDName || lead.origin,
            sub: 'Cảng biển quốc tế tiếp nhận',
          },
          {
            label: 'ICD / Depot chuyển tải',
            value: pr?.portICDDepot || lead.destination,
            sub: 'Bãi hạ trung chuyển nội địa',
          },
          {
            label: 'Cơ cấu phương tiện vận hành',
            value: pr?.shuttleVehicleTypes?.join(', ') || 'Đầu kéo Rơ-moóc xương Cont 40ft/20ft',
            sub: 'Đội xe kéo cont chuyên trách',
          },
          {
            label: 'Sản lượng TEU & Tần suất',
            value: `${pr?.shuttleTeuMonthly || '500'} TEU / Tháng`,
            sub: lead.contractTerm || 'Hợp đồng khung giải tỏa cảng',
          },
        ];
      } else {
        grid = [
          {
            label: 'Mô hình dự án',
            value: 'Vận Tải Đa Phương Thức Toàn Diện (Multimodal Logistics)',
            sub: pr?.multimodalCombination || 'Đường bộ ➔ Đường biển ➔ Đường sắt',
            highlight: true,
          },
          {
            label: 'Cửa ngõ trung chuyển chính',
            value: pr?.multimodalMidMileHub || `${lead.origin} ➔ ${lead.destination}`,
            sub: 'Điểm chuyển đổi phương thức vận tải',
          },
          {
            label: 'Quy cách cont / thiết bị',
            value: pr?.multimodalContainerType || 'Container 40HC / Toa tàu liên vận',
            sub: 'Tối ưu chi phí logistics xanh',
          },
          {
            label: 'Sản lượng vận tải dự án',
            value: pr?.multimodalMonthlyTeuOrVolume || lead.volumeDisplay || 'Quy mô dự án lớn',
            sub: lead.contractTerm || 'Hợp đồng dự án 12 - 36 tháng',
          },
        ];
      }

      return {
        serviceCategory: 'Dự án logistics & Chuỗi cung ứng tổng thể (Project Cargo & Tender)',
        serviceIcon: Layers,
        colorTheme: 'indigo',
        specsGrid: grid,
        slaChecklist: [
          'Cam kết tỷ lệ giao hàng đúng hạn (OTD): Tối thiểu 98.5%',
          'Đội ngũ quản lý dự án Key Account (KAM): Có nhân sự chuyên trách điều phối 24/7',
          'Báo cáo hiệu suất KPI hàng tháng: Cung cấp Dashboard đo lường chi phí và sản lượng',
          'Kế hoạch dự phòng rủi ro: Đảm bảo năng lực điều xe trong các mùa cao điểm (Peak season)',
        ],
        customerNotes: inq?.description || lead.description || (pr?.projectName 
          ? `Gói thầu dự án "${pr.projectName}". Nhà cung cấp cần nộp hồ sơ năng lực (Profile), bảng phân tích định mức chi phí và cam kết SLA chi tiết.`
          : 'Dự án logistics tổng thể, yêu cầu nhà thầu có năng lực phương tiện mạnh mẽ, mạng lưới bao phủ rộng và hệ thống CNTT quản lý chuyên nghiệp.'),
        attachments: lead.attachments || inq?.attachments || [
          { id: 'att-1', name: 'Ho_So_Moi_Thau_RFP_Tender.pdf', size: '3.8 MB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
          { id: 'att-2', name: 'Bang_Ke_San_Luong_Va_Tuyen_Duong.xlsx', size: '1.2 MB', type: 'excel', uploadedDate: 'Vừa cập nhật' },
          { id: 'att-3', name: 'Tieu_Chuan_SLA_Va_Phat_Vi_Pham.pdf', size: '950 KB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
        ],
      };
    }

    // Default Fallback
    return {
      serviceCategory: `Dịch vụ Logistics ${sType}`,
      serviceIcon: Boxes,
      colorTheme: 'indigo',
      specsGrid: [
        { label: 'Loại hình dịch vụ', value: sType, sub: 'Dịch vụ chính', highlight: true },
        { label: 'Điểm lấy hàng', value: lead.origin, sub: 'Pickup point' },
        { label: 'Điểm giao hàng', value: lead.destination, sub: 'Delivery point' },
        { label: 'Hàng hóa chi tiết', value: lead.cargoDetails, sub: 'Quy cách đóng gói' },
      ],
      slaChecklist: [
        'Bảo hiểm trách nhiệm hàng hóa 100%',
        'GPS Real-time Tracking 24/7',
        'Biên bản bàn giao POD trong vòng 3 ngày',
      ],
      customerNotes: inq?.description || lead.description || lead.cargoDetails,
      attachments: lead.attachments || inq?.attachments || [
        { id: 'att-1', name: 'Inquiry_Detailed_Specification.pdf', size: '1.2 MB', type: 'pdf', uploadedDate: 'Vừa cập nhật' },
      ],
    };
  };

  const specs = getSpecs();

  // Extract Requested Surcharges & VAS
  const requestedSurcharges = lead.requestedSurcharges || inq?.requestedSurcharges || [
    'Phí cầu đường BOT / Cao tốc',
    'Phí nâng hạ bãi / Depot (Lift-on/off)',
    'Phí bốc xếp hàng hóa 2 đầu',
  ];

  const selectedVAS = lead.selectedVAS || inq?.selectedVAS || [
    'Bảo hiểm hàng hóa 100% giá trị',
    'Bốc xếp & Đóng gói màng co PE',
    'Kiểm đếm chi tiết số lượng SKU',
  ];

  const surchargesNotes = lead.surchargesNotes || inq?.surchargesNotes;
  const quotationScope = lead.quotationScope || inq?.quotationScope;

  // Domain-specific Route Titles
  const getDomainRouteTitle = () => {
    switch (sType) {
      case 'Air Freight':
        return {
          title: 'Hành Trình Bay (AOD ➔ AOA)',
          originLabel: 'Cất cánh (AOD)',
          destLabel: 'Hạ cánh (AOA)'
        };
      case 'Sea Freight (FCL)':
        return {
          title: 'Hải Trình Đường Biển (POL ➔ POD)',
          originLabel: 'Cảng bốc (POL)',
          destLabel: 'Cảng dỡ (POD)'
        };
      case 'Sea Freight (LCL)':
        return {
          title: 'Hành Trình Gom Hàng Lẻ CFS',
          originLabel: 'CFS Xuất phát',
          destLabel: 'CFS Đích'
        };
      case 'Rail Freight':
        return {
          title: 'Tuyến Trục Đường Sắt (Ga ➔ Ga)',
          originLabel: 'Ga bốc đi',
          destLabel: 'Ga dỡ đến'
        };
      case 'Cross-border':
        return {
          title: 'Tuyến Vận Tải Liên Vận Quốc Tế',
          originLabel: 'Nơi xuất phát',
          destLabel: 'Đích đến'
        };
      case 'Warehousing':
        return {
          title: 'Địa Bàn Kho Bãi Mục Tiêu',
          originLabel: 'Vị trí kho',
          destLabel: 'Phân phối'
        };
      case 'Customs Clearance':
        return {
          title: 'Địa Bàn Làm Thủ Tục Hải Quan',
          originLabel: 'Chi cục HQ',
          destLabel: 'Cửa khẩu/Cảng'
        };
      case 'Project Cargo':
        return {
          title: 'Phạm Vi Mạng Lưới Dự Án',
          originLabel: 'Hub xuất phát',
          destLabel: 'Khu vực phủ'
        };
      default:
        return {
          title: 'Tuyến Đường & Địa Điểm',
          originLabel: 'Lấy hàng',
          destLabel: 'Giao hàng'
        };
    }
  };

  const domainRoute = getDomainRouteTitle();

  return (
    <div className="bg-white rounded-2xl border border-indigo-200/90 shadow-sm overflow-hidden text-slate-900 animate-in fade-in duration-200 space-y-5 p-5">
      {/* 1. TOP ACTION & HEADER BAR: ĐẦU DÒNG CHI TIẾT */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3.5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Thông tin chi tiết</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {isCustomerView
                ? 'Quy chuẩn kỹ thuật, phụ phí, chứng từ và yêu cầu dịch vụ'
                : 'Quy chuẩn kỹ thuật, phụ phí, chứng từ và liên hệ chủ hàng'}
            </p>
          </div>
        </div>

        {/* CỤM THAO TÁC HÀNH ĐỘNG */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Nút Sao Chép Link Lead Board */}
          <button
            type="button"
            id={`detail-share-link-btn-${lead.code}`}
            onClick={handleShareLead}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
              copiedShareLead
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
            title={`Sao chép link trực tiếp Lead Board lọc theo mã ${lead.code}`}
          >
            {copiedShareLead ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Đã Chép Link Lead!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Chia Sẻ Lead ({lead.code})</span>
              </>
            )}
          </button>

          {!isCustomerView && (
            <>
              {/* Nút Mở khóa SĐT & Đối thủ nếu chưa mở khóa */}
              {!isUnlocked ? (
                <button
                  type="button"
                  id={`detail-unlock-btn-${lead.code}`}
                  onClick={onUnlockClick}
                  className="group/unlock inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  title="Mở khóa để xem SĐT Hotline, Zalo, Email và Ma Trận Báo Giá Đối Thủ (50 Credits)"
                >
                  <KeyRound className="w-3.5 h-3.5 group-hover/unlock:rotate-12 transition-transform shrink-0 text-amber-100" />
                  <span>Mở khóa SĐT & Đối thủ</span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/20 text-amber-100 font-black text-[10px]">
                    <Coins className="w-3 h-3 text-amber-300" />
                    50
                  </span>
                </button>
              ) : (
                onCompareClick && (
                  <button
                    type="button"
                    id={`detail-compare-btn-${lead.code}`}
                    onClick={() => onCompareClick(lead)}
                    className="px-3.5 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs group/compare"
                    title="So sánh ma trận giá đối thủ & Phân tích thị trường"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-600 group-hover/compare:scale-110 transition-transform" />
                    <span>So Sánh Đối Thủ</span>
                  </button>
                )
              )}

              {/* Nút Tạo Báo Giá */}
              {onOpenCreateQuotation && (
                <button
                  type="button"
                  id={`detail-quote-btn-${lead.code}`}
                  onClick={() => onOpenCreateQuotation(lead)}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title="Tạo và nộp báo giá cho đơn hàng này"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Báo Giá Ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Nút Lưu Lead */}
              {onToggleSaveLead && (
                <button
                  type="button"
                  id={`detail-save-btn-${lead.code}`}
                  onClick={(e) => onToggleSaveLead(lead, e)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    lead.isSaved
                      ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 shadow-2xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                  }`}
                  title={
                    lead.isSaved
                      ? 'Đã lưu trong My Leads (Click để bỏ lưu)'
                      : 'Lưu tuyến tiềm năng vào My Leads'
                  }
                >
                  {lead.isSaved ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5 fill-amber-500 text-amber-700" />
                      <span>Đã Lưu</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                      <span>Lưu Lead</span>
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* 2. CÁC THÔNG TIN TRỌNG TÂM: 4 SUMMARY CARDS THEO THUẬT NGỮ NGÀNH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Tuyến Đường & Địa Điểm */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-blue-50/40 border border-indigo-200/80 shadow-2xs hover:border-indigo-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{domainRoute.title}</span>
            </span>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
              {lead.serviceType}
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 leading-snug">
              {lead.route}
            </div>
            <div className="text-[11px] text-slate-600 flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                {domainRoute.originLabel}: <strong>{lead.origin}</strong>
              </span>
              {sType !== 'Warehousing' && (
                <>
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
                    {domainRoute.destLabel}: <strong>{lead.destination}</strong>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2. Hàng Hóa & Quy Cách */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/60 to-orange-50/30 border border-amber-200/80 shadow-2xs hover:border-amber-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Hàng Hóa / Quy Cách</span>
            </span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              {lead.urgency === 'Urgent' ? 'Gấp' : lead.urgency === 'High Value' ? 'Giá trị cao' : 'Tiêu chuẩn'}
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-slate-900 leading-snug">
              {lead.cargoDetails}
            </div>
            <div className="text-[11px] text-slate-600">
              Quy cách đóng gói & yêu cầu bảo quản theo tiêu chuẩn chủ hàng
            </div>
          </div>
        </div>

        {/* 3. Sản Lượng & Tần Suất */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/30 border border-emerald-200/80 shadow-2xs hover:border-emerald-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sản Lượng / Tần Suất</span>
            </span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
              lead.pricingType === 'CONTRACT'
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : 'bg-blue-100 text-blue-800 border border-blue-200'
            }`}>
              {lead.pricingType === 'CONTRACT' ? 'Hợp Đồng' : 'Theo Lô / Chuyến'}
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-emerald-950 font-mono leading-snug">
              {lead.volumeDisplay}
            </div>
            <div className="text-[11px] text-slate-600">
              {lead.pricingType === 'CONTRACT' ? (lead.contractTerm || 'Hợp đồng định kỳ dài hạn') : 'Chuyến lẻ / Giao dịch đơn lẻ'}
            </div>
          </div>
        </div>

        {/* 4. Đơn Giá Dự Kiến (Đơn Giá DK) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-violet-50/70 to-indigo-50/40 border border-violet-200/80 shadow-2xs hover:border-violet-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-900 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-violet-600 shrink-0" />
              <span>Đơn Giá DK</span>
            </span>
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
              Target Budget
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-indigo-900 font-mono leading-snug">
              {lead.unitPriceDisplay}
            </div>
            <div className="text-[11px] text-slate-600 flex items-center justify-between">
              <span>Tổng dự kiến:</span>
              <strong className="text-slate-900 font-mono font-bold">{lead.estimatedValueDisplay}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CUSTOMER CONTACT INFORMATION CARD (MÃ HÓA / MỞ KHÓA BẰNG FLEXCREDIT) */}
      {!isCustomerView && (
        <div
          className={`p-4 rounded-2xl border transition-all shadow-xs ${
            isUnlocked
              ? 'bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 border-emerald-300 text-emerald-950 ring-2 ring-emerald-400/30'
              : 'bg-gradient-to-br from-slate-50 to-indigo-50/30 border-slate-200 text-slate-800'
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10.5px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${
                  isUnlocked
                    ? 'bg-emerald-600 text-white border-emerald-600 flex items-center gap-1'
                    : 'bg-slate-200 text-slate-700 border-slate-300'
                }`}
              >
                {isUnlocked ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ĐÃ MỞ KHÓA THÔNG TIN LIÊN HỆ CHỦ HÀNG</span>
                  </>
                ) : (
                  'THÔNG TIN LIÊN HỆ CHỦ HÀNG (ĐANG KHÓA)'
                )}
              </span>

              {isUnlocked && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Doanh nghiệp đã xác thực pháp nhân & MST
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              {/* Doanh nghiệp & MST (Clean text, no copy button on MST) */}
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 text-[10.5px] font-bold uppercase tracking-wider block mb-0.5">
                  Doanh nghiệp phát hành:
                </span>
                <span className="font-extrabold text-slate-900 text-xs block leading-snug">
                  {isUnlocked ? lead.customerCompany : maskCompanyName(lead.customerCompany)}
                </span>
                {isUnlocked && (
                  <div className="mt-1 text-[10.5px] text-slate-600 font-mono font-medium">
                    MST: {taxIdValue}
                  </div>
                )}
              </div>

              {/* Người phụ trách */}
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 text-[10.5px] font-bold uppercase tracking-wider block mb-0.5">
                  Đầu mối phụ trách mua hàng:
                </span>
                <span className="font-extrabold text-slate-900 text-xs block">
                  {isUnlocked ? lead.contactName : maskContactPerson(lead.contactName)}
                </span>
                <span className="text-[10.5px] text-slate-500 block mt-0.5">
                  Chức vụ: <strong>{lead.contactRole}</strong>
                </span>
              </div>

              {/* SĐT Hotline & Zalo */}
              <div className={`p-3 rounded-xl border ${isUnlocked ? 'bg-emerald-50 border-emerald-300' : 'bg-white/80 border-slate-200/80'}`}>
                <span className="text-slate-400 text-[10.5px] font-bold uppercase tracking-wider block mb-0.5">
                  Hotline / Zalo liên hệ:
                </span>
                {isUnlocked ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 font-mono font-black text-emerald-950 text-sm">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{phoneValue}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyPhone(phoneValue)}
                        className="text-slate-400 hover:text-emerald-700 p-0.5"
                        title="Copy số điện thoại"
                      >
                        {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <a
                        href={`https://zalo.me/${phoneValue.replace(/\s+/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat Zalo</span>
                      </a>
                      <a
                        href={`tel:${phoneValue.replace(/\s+/g, '')}`}
                        className="px-2 py-0.5 text-[10px] font-bold bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Gọi Điện</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-bold mt-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    <span>0908 ••• ••• (Bảo mật)</span>
                  </div>
                )}
              </div>

              {/* Email nhận báo giá (Clean text, no Send Email button) */}
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                <span className="text-slate-400 text-[10.5px] font-bold uppercase tracking-wider block mb-0.5">
                  Email nhận hồ sơ:
                </span>
                {isUnlocked ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 mt-1 truncate" title={emailValue}>
                    <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{emailValue}</span>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-slate-400 mt-1 block">••••••@shipper.vn</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. CORE TECHNICAL & OPERATIONAL SPECIFICATIONS (DỮ LIỆU KHÁCH HÀNG KHAI BÁO) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Thông Số Kỹ Thuật & Nghiệp Vụ Do Khách Hàng Khai Báo Cho Dịch Vụ Này</span>
          </h4>
          <span className="text-[11px] text-slate-500 italic">
            Dữ liệu tiêu chuẩn phục vụ tính toán định mức & lập báo giá chi tiết
          </span>
        </div>

        {/* Dynamic Bento Grid of Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 text-xs">
          {specs.specsGrid.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border transition-all ${
                item.highlight
                  ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-200'
                  : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className="text-[10.5px] uppercase font-bold text-slate-400 block mb-1 tracking-tight">
                {item.label}
              </span>
              <span className="font-extrabold text-slate-900 block text-xs leading-snug">
                {item.value}
              </span>
              {item.sub && (
                <span className="text-[10.5px] text-slate-500 block mt-1 leading-tight">
                  {item.sub}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. PHÂN ĐOẠN 2 CỘT: PHỤ PHÍ YÊU CẦU BÁO GIÁ (SURCHARGES) & DỊCH VỤ GIÁ TRỊ GIA TĂNG (VAS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cột 1: Phụ phí yêu cầu báo giá */}
        <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-900 tracking-wider">
              <Receipt className="w-4 h-4 text-amber-700" />
              <span>Phụ Phí Yêu Cầu Báo Giá (Surcharges)</span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
              {requestedSurcharges.length} Phụ phí
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] text-slate-500 block font-medium">
              Các khoản phụ phí khách hàng yêu cầu Supplier chào giá minh bạch:
            </span>
            <div className="flex flex-wrap gap-2">
              {requestedSurcharges.map((sur, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2.5 py-1 text-xs font-bold bg-white text-amber-950 border border-amber-200/90 rounded-xl shadow-2xs flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{sur}</span>
                </span>
              ))}
            </div>

            {surchargesNotes && (
              <div className="mt-2.5 p-2.5 bg-white/90 rounded-xl border border-amber-200/80 text-xs">
                <span className="text-[10.5px] font-bold text-amber-800 block mb-0.5">Ghi chú phụ phí từ chủ hàng:</span>
                <p className="text-slate-700 italic text-xs leading-relaxed">"{surchargesNotes}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Cột 2: Dịch vụ giá trị gia tăng (VAS) */}
        <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-900 tracking-wider">
              <Wrench className="w-4 h-4 text-emerald-700" />
              <span>Dịch Vụ Giá Trị Gia Tăng (VAS)</span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
              {selectedVAS.length} Dịch vụ
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] text-slate-500 block font-medium">
              Các dịch vụ phụ trợ khách hàng đăng ký kèm theo đơn hàng:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedVAS.map((vas, vIdx) => (
                <span
                  key={vIdx}
                  className="px-2.5 py-1 text-xs font-bold bg-white text-emerald-950 border border-emerald-200/90 rounded-xl shadow-2xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{vas}</span>
                </span>
              ))}
            </div>

            {quotationScope && (
              <div className="mt-2.5 p-2 bg-emerald-100/60 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-emerald-800">Phạm vi chào giá yêu cầu:</span>
                <span className="font-extrabold text-emerald-950">{quotationScope}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. SPECIAL OPERATING REQUIREMENTS & SLA CRITERIA (TIÊU CHÍ VẬN HÀNH BẮT BUỘC) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: SLA Checklist */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-800 tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Yêu Cầu Vận Hành & Tiêu Chí Cam Kết (Customer SLA Requirements)</span>
          </div>

          <div className="space-y-2 text-xs">
            {specs.slaChecklist.map((req, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Customer Operating Notes & Attached Documents */}
        <div className="space-y-4">
          {/* Customer Instruction Notes */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-900 tracking-wider">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>Ghi Chú Vận Hành Chi Tiết Từ Khách Hàng (Operating Notes)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-100 italic">
              "{specs.customerNotes}"
            </p>
          </div>

          {/* Attached Files & Drawings */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-800 tracking-wider">
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Tài Liệu & Bảng Kê Đính Kèm ({specs.attachments.length} Tệp tin)</span>
              </div>
              <span className="text-[10.5px] text-slate-400">Tải về để xem chi tiết kích thước</span>
            </div>

            <div className="space-y-1.5">
              {specs.attachments.map((file, fIdx) => (
                <div
                  key={fIdx}
                  className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                      {file.type === 'excel' ? <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-rose-600" />}
                    </span>
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-800 truncate block text-xs">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Dung lượng: {file.size} • {file.uploadedDate || 'Mới cập nhật'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadFile(file.name)}
                    className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3 h-3" />
                    <span>Tải về</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Download Notification Toast inside detail */}
      {downloadToast && (
        <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{downloadToast}</span>
          </div>
          <span className="text-[10px] text-slate-400">Mô phỏng tải tệp tin đính kèm</span>
        </div>
      )}
    </div>
  );
};
