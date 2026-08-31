import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock, 
  Plus, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Send,
  MessageSquare,
  Sparkles,
  Coins,
  Globe,
  Trophy,
  Info,
  ShieldCheck,
  Zap,
  ExternalLink,
  Lock,
  Unlock,
  KeyRound,
  Copy,
  Check,
  Search,
  Filter,
  Truck,
  Ship,
  Plane,
  Snowflake,
  Warehouse,
  BarChart3,
  BadgeAlert,
  Sliders,
  Users,
  Briefcase,
  AlertCircle,
  TrendingDown,
  Layers,
  Eye,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { 
  CRMCustomer, 
  ActivityLog, 
  CurrentView, 
  QuotationItem, 
  SupplierLeadItem, 
  InquiryItem, 
  UserPersona, 
  FlexCreditWallet,
  ServiceType,
  LeadStatus
} from '../../types';
import { mockCustomerTimeline, initialSupplierLeads } from '../../data/mockData';
import { SupplierLeadCompareModal } from './SupplierLeadCompareModal';
import { LeadInquiryDetailCard } from '../public/LeadInquiryDetailCard';

interface CustomerDetailPageProps {
  customer: CRMCustomer;
  leads?: SupplierLeadItem[];
  inquiries?: InquiryItem[];
  quotations?: QuotationItem[];
  currentUser?: UserPersona;
  wallet?: FlexCreditWallet;
  initialTab?: 'overview' | 'inquiries';
  viewedInquiryCodes?: string[];
  onMarkInquiryAsViewed?: (inquiryCode: string) => void;
  onBack: () => void;
  onOpenCreateQuotation?: (leadOrCustomer?: any) => void;
  onNavigate: (view: CurrentView) => void;
  onUnlockLead?: (leadId: string, creditCost?: number) => boolean;
  onToggleSaveLead?: (leadId: string) => void;
  onSubmitQuotation?: (quote: Partial<QuotationItem>) => void;
}

export const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({
  customer,
  leads = initialSupplierLeads,
  inquiries = [],
  quotations = [],
  currentUser = { id: 'usr-supplier-01', name: 'Minh Tran', role: 'Supplier' as any, companyName: 'Global Dual Logistics & Trade Corp', email: 'minh.tran@globalduallogistics.vn', phone: '0908123456', avatar: '', preferences: { language: 'vi', theme: 'light', notifications: { email: true, push: true, sms: false, marketing: false }, defaultCurrency: 'VND', homeHub: 'SUPPLIER' } },
  wallet = { balanceCredits: 15400, balanceVND: 15400000, bonusCredits: 1800, tierName: 'Gold', discountOnLeads: 15, monthlySpentCredits: 3200, autoTopUpEnabled: true, autoTopUpThreshold: 2000, autoTopUpAmount: 5000 },
  initialTab = 'overview',
  viewedInquiryCodes = [],
  onMarkInquiryAsViewed,
  onBack,
  onOpenCreateQuotation,
  onNavigate,
  onUnlockLead,
  onToggleSaveLead,
  onSubmitQuotation,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [activities, setActivities] = useState<ActivityLog[]>(mockCustomerTimeline);
  const [newNote, setNewNote] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Inquiries Tab State
  const [inquirySearch, setInquirySearch] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLeadForCompare, setSelectedLeadForCompare] = useState<SupplierLeadItem | null>(null);
  const [expandedLeadIds, setExpandedLeadIds] = useState<Set<string>>(new Set());

  const toggleExpandLead = (leadId: string) => {
    // When supplier expands to see details, mark this inquiry as viewed globally!
    const target = (leads || []).find((l) => l.id === leadId || l.code === leadId || l.inquiryCode === leadId);
    if (onMarkInquiryAsViewed) {
      onMarkInquiryAsViewed(target ? (target.code || target.inquiryCode || leadId) : leadId);
    }

    setExpandedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeDisplay: 'Vừa xong',
      type: 'call',
      title: 'Ghi chú tương tác / Chăm sóc khách hàng',
      description: newNote.trim(),
      actor: currentUser.name || 'Minh Tran',
    };
    setActivities([newAct, ...activities]);
    setNewNote('');
  };

  // Filter inquiries belonging to this customer
  const customerLeads = useMemo(() => {
    const normalizeStr = (str: string) =>
      (str || '')
        .toLowerCase()
        .replace(/[.,\-_/()&]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const targetCompany = normalizeStr(customer.companyName);
    const targetShort = customer.companyShortName ? normalizeStr(customer.companyShortName) : '';
    const targetPerson = customer.contactPerson ? normalizeStr(customer.contactPerson) : '';
    const targetSourceLead = customer.sourceDetails?.leadCode || '';
    const targetSourceInq = customer.sourceDetails?.inquiryCode || '';

    // Core keyword from company name (e.g., 'abc manufacturing', 'vinamilk', 'samsung')
    const cleanTarget = targetCompany
      .replace(/\b(co|ltd|vietnam|vn|jsc|corp|company|corporation|group|cong ty|tnhh|cp)\b/g, '')
      .trim();

    const isCustomerMatch = (company?: string, person?: string, code?: string, inqId?: string) => {
      if (code && (code === targetSourceLead || code === targetSourceInq)) return true;
      if (inqId && inqId === customer.id) return true;

      if (company) {
        const compNorm = normalizeStr(company);
        if (compNorm.includes(targetCompany) || targetCompany.includes(compNorm)) return true;
        if (targetShort && (compNorm.includes(targetShort) || targetShort.includes(compNorm))) return true;

        const cleanComp = compNorm
          .replace(/\b(co|ltd|vietnam|vn|jsc|corp|company|corporation|group|cong ty|tnhh|cp)\b/g, '')
          .trim();
        if (cleanComp.length >= 3 && cleanTarget.length >= 3) {
          if (cleanComp.includes(cleanTarget) || cleanTarget.includes(cleanComp)) return true;
        }
      }

      if (person && targetPerson) {
        const personNorm = normalizeStr(person);
        if (personNorm.includes(targetPerson) || targetPerson.includes(personNorm)) return true;
      }

      return false;
    };

    const parseCurrencyNumber = (val?: string): number => {
      if (!val) return 0;
      const num = parseInt(val.replace(/[^\d]/g, ''), 10);
      return isNaN(num) ? 0 : num;
    };

    const matchedMap = new Map<string, SupplierLeadItem>();

    // 1. Process matching inquiries first (including newly created ones)
    inquiries.forEach((inq) => {
      if (isCustomerMatch(inq.customerCompany, inq.contactPerson, inq.code, inq.customerId)) {
        // Look for corresponding lead in leads array
        const existingLead = leads.find(
          (l) => l.inquiryCode === inq.code || l.code === inq.code || l.id === inq.id
        );

        const quotesForThisInq = quotations.filter((q) => q.inquiryCode === inq.code);
        const quotesCount = quotesForThisInq.length || inq.responsesCount || (existingLead ? existingLead.quotesCount : 0);
        const myQuote = quotesForThisInq.find((q) => q.supplierId === currentUser.id);

        let status: LeadStatus = 'Open';
        if (inq.status === 'Awarded' || inq.status === 'Won') {
          status = 'Won';
        } else if (myQuote || inq.status === 'Quoted' || inq.status === 'Under Review') {
          status = 'Quoted';
        } else if (inq.status === 'Closed') {
          status = 'Closed';
        }

        const isContract =
          (inq.title || '').toLowerCase().includes('contract') ||
          (inq.title || '').toLowerCase().includes('hợp đồng') ||
          (inq.targetBudget || '').toLowerCase().includes('tháng') ||
          (inq.targetBudget || '').toLowerCase().includes('năm') ||
          (inq.serviceSpecs?.trucking?.pricingType === 'CONTRACT') ||
          (inq.serviceSpecs?.ocean?.pricingType === 'CONTRACT');

        const budgetNum = parseCurrencyNumber(inq.targetBudget) || (existingLead ? existingLead.unitPriceVND : 48000000);
        const estimatedVal = isContract ? budgetNum * 12 : budgetNum;

        const leadItem: SupplierLeadItem = {
          id: existingLead ? existingLead.id : (inq.id ? `lead-${inq.id}` : `lead-inq-${inq.code}`),
          code: existingLead ? existingLead.code : inq.code,
          inquiryCode: inq.code,
          customerCompany: inq.customerCompany || customer.companyName,
          contactName: inq.contactPerson || customer.contactPerson,
          contactRole: existingLead?.contactRole || customer.contactRole || 'Procurement Specialist',
          contactPhone: customer.contactPhone || existingLead?.contactPhone || '0909 123 456',
          contactEmail: customer.contactEmail || existingLead?.contactEmail || 'procurement@company.com',
          serviceType: inq.serviceType,
          origin: inq.origin,
          destination: inq.destination,
          route: inq.route || `${inq.origin} → ${inq.destination}`,
          pricingType: isContract ? 'CONTRACT' : 'SPOT',
          contractTerm: isContract ? 'Hợp đồng định kỳ 12 tháng' : 'Theo chuyến / Lô',
          volumeDisplay: inq.weightVolume || existingLead?.volumeDisplay || '1 Lô hàng FCL',
          unitPriceVND: budgetNum,
          unitPriceDisplay: inq.targetBudget || `${budgetNum.toLocaleString('vi-VN')} ₫ / lô`,
          estimatedValueVND: estimatedVal,
          estimatedValueDisplay: inq.targetBudget ? inq.targetBudget : `${estimatedVal.toLocaleString('vi-VN')} ₫`,
          createdDate: inq.createdDate || 'Hôm nay',
          dueDate: inq.expiryDate || inq.deliveryDate || '2026-09-10',
          status: status,
          cargoDetails: `${inq.cargoType || inq.title || 'Hàng hóa sản xuất & gia công'} ${inq.weightVolume ? `(${inq.weightVolume})` : ''}`,
          urgency: 'High Value',
          matchScore: existingLead?.matchScore || 98,
          quotesCount: quotesCount,
          viewsCount: inq.viewsCount || existingLead?.viewsCount || 15,
          isUnlocked: Boolean(existingLead?.isUnlocked || customer.source === 'FLEXCREDIT_UNLOCKED' || inq.code === 'FG-2608250001'),
          isSaved: true,
        };

        const key = inq.code || leadItem.id;
        matchedMap.set(key, leadItem);
      }
    });

    // 2. Process any other matching leads from the leads array
    leads.forEach((lead) => {
      if (isCustomerMatch(lead.customerCompany, lead.contactName, lead.code) || (lead.inquiryCode && isCustomerMatch(undefined, undefined, lead.inquiryCode))) {
        const key = lead.inquiryCode || lead.code || lead.id;
        if (!matchedMap.has(key)) {
          const quotesForThisLead = quotations.filter((q) => q.inquiryCode === lead.inquiryCode || q.inquiryCode === lead.code);
          const quotesCount = quotesForThisLead.length || lead.quotesCount;
          const myQuote = quotesForThisLead.find((q) => q.supplierId === currentUser.id);

          matchedMap.set(key, {
            ...lead,
            quotesCount: quotesCount,
            status: myQuote ? 'Quoted' : lead.status,
            isUnlocked: Boolean(lead.isUnlocked || customer.source === 'FLEXCREDIT_UNLOCKED' || lead.inquiryCode === 'FG-2608250001'),
          });
        }
      }
    });

    let result = Array.from(matchedMap.values());

    // 3. If no exact match found, provide tailored lead from customer's profile so leaderboard is never empty
    if (result.length === 0) {
      const fallbackLead: SupplierLeadItem = {
        id: `lead-cust-${customer.id}-01`,
        code: `FG-2608${String(10 + Math.abs(customer.companyName.length % 20)).padStart(2, '0')}0001`,
        inquiryCode: `FG-2608${String(10 + Math.abs(customer.companyName.length % 20)).padStart(2, '0')}0001`,
        customerCompany: customer.companyName,
        contactName: customer.contactPerson,
        contactRole: customer.contactRole,
        contactPhone: customer.contactPhone,
        contactEmail: customer.contactEmail,
        serviceType: (customer.preferredModes?.[0]?.includes('Sea') ? 'Sea Freight (FCL)' : customer.preferredModes?.[0]?.includes('Air') ? 'Air Freight' : customer.preferredModes?.[0]?.includes('Lạnh') ? 'Cold Chain' : 'Trucking') as any,
        origin: customer.location || 'TP. Hồ Chí Minh',
        destination: customer.operatingMarkets?.[0] || 'Hà Nội (KCN Thăng Long)',
        route: customer.keyRoutes?.[0] || `${customer.location} → Hà Nội`,
        pricingType: 'CONTRACT',
        contractTerm: 'Hợp đồng định kỳ 12 tháng',
        volumeDisplay: customer.monthlyVolumeEst || '25 Chuyến / Tháng',
        unitPriceVND: 18000000,
        unitPriceDisplay: '18,000,000 ₫ / Chuyến',
        estimatedValueVND: customer.estimatedValueVND || 450000000,
        estimatedValueDisplay: customer.estimatedValueDisplay || '450,000,000 ₫',
        createdDate: 'Hôm nay',
        dueDate: '2026-09-05',
        status: 'Open',
        cargoDetails: customer.primaryCargo || 'Hàng công nghiệp tiêu chuẩn',
        urgency: 'High Value',
        matchScore: 98,
        quotesCount: 3,
        viewsCount: 142,
        isUnlocked: customer.source === 'FLEXCREDIT_UNLOCKED',
        isSaved: true,
      };
      result = [fallbackLead];
    }

    // Sort result: most recent/newest createdDate first
    return result.sort((a, b) => {
      const isANew = a.createdDate?.includes('Hôm nay') || a.createdDate?.includes('Vừa xong');
      const isBNew = b.createdDate?.includes('Hôm nay') || b.createdDate?.includes('Vừa xong');
      if (isANew && !isBNew) return -1;
      if (!isANew && isBNew) return 1;
      return (b.id || '').localeCompare(a.id || '');
    });
  }, [inquiries, leads, quotations, customer, currentUser.id]);

  // Filtered customer leads for leaderboard table
  const filteredCustomerLeads = useMemo(() => {
    return customerLeads.filter((lead) => {
      const matchSearch =
        inquirySearch === '' ||
        lead.code.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        (lead.inquiryCode && lead.inquiryCode.toLowerCase().includes(inquirySearch.toLowerCase())) ||
        lead.route.toLowerCase().includes(inquirySearch.toLowerCase()) ||
        lead.cargoDetails.toLowerCase().includes(inquirySearch.toLowerCase());

      const matchService = serviceFilter === 'ALL' || lead.serviceType === serviceFilter;
      const matchStatus = statusFilter === 'ALL' || lead.status === statusFilter;

      return matchSearch && matchService && matchStatus;
    });
  }, [customerLeads, inquirySearch, serviceFilter, statusFilter]);

  const handleUnlockInquiryWithDiscount = (leadId: string) => {
    if (onUnlockLead) {
      // Apply 25 FlexCredits rule for Customer 360 inquiries
      return onUnlockLead(leadId, 25);
    }
    return true;
  };

  // Helper Badge Style cho Nhóm Dịch Vụ
  const getServiceBadgeStyle = (service: string) => {
    switch (service) {
      case 'Trucking':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Sea Freight (FCL)':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200/80';
      case 'Sea Freight (LCL)':
        return 'bg-teal-50 text-teal-700 border-teal-200/80';
      case 'Air Freight':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'Rail Freight':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Cold Chain':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Warehousing':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'Customs Clearance':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'Cross-border':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Project Cargo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Helper Badge Style cho Phân loại hàng hóa
  const getCargoBadgeStyle = (classification?: string) => {
    switch (classification) {
      case 'Reefer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Hazmat':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getCargoLabel = (classification?: string) => {
    switch (classification) {
      case 'Reefer':
        return 'Hàng lạnh';
      case 'Hazmat':
        return 'Hàng nguy hiểm';
      default:
        return 'Hàng thường';
    }
  };

  // Helper xác định Hình Thức / Mô Hình dịch vụ theo chuẩn rút gọn
  const getOperationModeDisplay = (lead: SupplierLeadItem) => {
    const sType = lead.serviceType;
    const specs = lead.serviceSpecs || lead.inquiry?.serviceSpecs;
    const textContext = `${lead.inquiry?.title || ''} ${lead.volumeDisplay || ''} ${lead.cargoDetails || ''} ${lead.contractTerm || ''}`.toLowerCase();

    // 1. Đường bộ (Trucking & Cold Chain)
    if (sType === 'Trucking' || sType === 'Cold Chain') {
      const loadType = specs?.trucking?.loadType;
      if (loadType?.includes('LTL') || textContext.includes('ltl') || textContext.includes('hàng ghép') || textContext.includes('ghép hàng')) {
        return 'LTL';
      }
      return 'FTL';
    }

    // 2. Đường biển (Sea Freight FCL & LCL)
    if (sType === 'Sea Freight (FCL)' || sType === 'Sea Freight (LCL)') {
      if (sType === 'Sea Freight (LCL)' || specs?.ocean?.mode?.includes('LCL') || textContext.includes('lcl') || textContext.includes('gom lẻ')) {
        return 'LCL';
      }
      return 'FCL';
    }

    // 3. Hàng không (Air Freight)
    if (sType === 'Air Freight') {
      const isExpress = specs?.air?.airServiceType === 'Express / Courier' || 
                        specs?.air?.serviceLevel?.toLowerCase().includes('priority') ||
                        textContext.includes('express') || 
                        textContext.includes('hỏa tốc') || 
                        textContext.includes('chuyển phát');
      return isExpress ? 'Express' : 'Air Freight';
    }

    // 4. Đường sắt (Rail Freight)
    if (sType === 'Rail Freight') {
      const isLcl = specs?.rail?.mode?.includes('LCL') || textContext.includes('lcl') || textContext.includes('hàng lẻ') || textContext.includes('ghép');
      return isLcl ? 'LCL' : 'FCL';
    }

    // 5. Kho bãi (Warehousing)
    if (sType === 'Warehousing') {
      const whType = (specs?.warehousing?.warehouseType || textContext).toLowerCase();
      if (whType.includes('ngoại quan') || whType.includes('bonded')) return 'Kho ngoại quan';
      if (whType.includes('lạnh') || whType.includes('mát') || whType.includes('cold')) return 'Kho lạnh';
      if (whType.includes('nguy hiểm') || whType.includes('dg') || whType.includes('hóa chất')) return 'Kho hàng nguy hiểm';
      if (whType.includes('fulfillment') || whType.includes('tmđt') || whType.includes('thương mại điện tử')) return 'Kho Fulfillment';
      if (whType.includes('tự quản') || whType.includes('self-storage')) return 'Kho tự quản';
      return 'Kho thường';
    }

    // 6. Thủ tục hải quan (Customs Clearance)
    if (sType === 'Customs Clearance') {
      const tradeRole = (specs?.customs?.tradeRole || lead.inquiry?.tradeRole || textContext).toLowerCase();
      const decType = (specs?.customs?.declarationType || '').toLowerCase();
      if (tradeRole.includes('xuất') || tradeRole.includes('export') || decType.includes('xuất') || decType.includes('b11')) {
        return 'Xuất khẩu';
      }
      return 'Nhập khẩu';
    }

    // 7. Xuyên biên giới (Cross-border)
    if (sType === 'Cross-border') {
      if (textContext.includes('ltl') || textContext.includes('hàng ghép') || textContext.includes('ghép')) {
        return 'LTL';
      }
      return 'FTL';
    }

    // 8. Logistics Dự án (Project Cargo)
    if (sType === 'Project Cargo') {
      const cat = specs?.project?.projectCategory;
      if (cat === 'DISTRIBUTION' || textContext.includes('phân phối')) return 'Phân phối';
      if (cat === 'CROSS_DOCK' || textContext.includes('cross-dock') || textContext.includes('chia chọn')) return 'Cross-dock';
      if (cat === 'PORT_ICD' || textContext.includes('cảng') || textContext.includes('icd') || textContext.includes('con thoi')) return 'Cảng';
      if (cat === 'MULTIMODAL' || textContext.includes('đa phương thức')) return 'Đa phương thức';
      return 'Phân phối';
    }

    return 'FTL';
  };

  // Helper Badge Style cho Trạng thái Lead
  const getStatusBadgeStyle = (status: LeadStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Quoted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Won':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Lost':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusDisplay = (status: LeadStatus) => {
    switch (status) {
      case 'Open':
        return 'Open';
      case 'Quoted':
        return 'Quoted';
      case 'Won':
        return 'Won';
      case 'Lost':
        return 'Lost';
      case 'Closed':
        return 'Closed';
      default:
        return status;
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'Trucking':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'Sea Freight (FCL)':
      case 'Sea Freight (LCL)':
        return <Ship className="w-4 h-4 text-cyan-600" />;
      case 'Air Freight':
        return <Plane className="w-4 h-4 text-indigo-600" />;
      case 'Cold Chain':
        return <Snowflake className="w-4 h-4 text-teal-600" />;
      case 'Warehousing':
        return <Warehouse className="w-4 h-4 text-amber-600" />;
      default:
        return <Truck className="w-4 h-4 text-slate-600" />;
    }
  };

  const renderSourceCard = () => {
    const source = customer.source || 'FLEXCREDIT_UNLOCKED';
    const details = customer.sourceDetails;

    switch (source) {
      case 'FLEXCREDIT_UNLOCKED':
        return (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-2xl border border-amber-200 p-5 shadow-2xs">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                    Nguồn Khách Hàng: Mở Khóa FlexCredit
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Mở khóa Lead Board bằng FlexCredit</h4>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-black bg-amber-100 text-amber-800 rounded-lg border border-amber-300/80">
                -50 FlexCredits
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {details?.notes || 'Bạn đã sử dụng FlexCredit để chủ động mở khóa hồ sơ nhu cầu và số điện thoại của chủ hàng từ sàn Lead Board công khai.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-amber-200/60 text-xs">
              <div>
                <span className="text-[10px] text-amber-700 uppercase font-semibold">Mã Lead Gốc:</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{details?.leadCode || 'FG-2608250001'}</p>
              </div>
              <div>
                <span className="text-[10px] text-amber-700 uppercase font-semibold">Ngày Mở Khóa:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{details?.unlockedDate || 'Gần đây'}</p>
              </div>
              <div>
                <span className="text-[10px] text-amber-700 uppercase font-semibold">Trạng Thái Mở Khóa:</span>
                <p className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã mở khóa đầy đủ</span>
                </p>
              </div>
            </div>
          </div>
        );

      case 'AWARDED_QUOTE':
        return (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50/40 rounded-2xl border border-indigo-200 p-5 shadow-2xs">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                    Nguồn Khách Hàng: Trao Thầu Báo Giá
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Khách hàng trao thầu chính thức (Awarded Deal)</h4>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-black bg-indigo-100 text-indigo-800 rounded-lg border border-indigo-300">
                Miễn phí 0 Credit
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {details?.notes || 'Khách hàng đã chấp thuận và trao thầu báo giá của bạn từ gói thầu. Hệ thống tự động tạo hồ sơ khách hàng 360.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-indigo-200/60 text-xs">
              <div>
                <span className="text-[10px] text-indigo-700 uppercase font-semibold">Mã Yêu Cầu (Inquiry):</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{details?.inquiryCode || 'FG-2608250001'}</p>
              </div>
              <div>
                <span className="text-[10px] text-indigo-700 uppercase font-semibold">Ngày Trao Thầu:</span>
                <p className="font-medium text-slate-900 mt-0.5">{details?.declaredDate || 'Aug 21, 2026'}</p>
              </div>
              <div>
                <span className="text-[10px] text-indigo-700 uppercase font-semibold">Trạng Thái:</span>
                <p className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đối tác chính thức</span>
                </p>
              </div>
            </div>
          </div>
        );

      case 'DIRECT_PROFILE_REQUEST':
        return (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-2xl border border-emerald-200 p-5 shadow-2xs">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    Nguồn Khách Hàng: Inbound Trực Tiếp
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Gửi RFQ trực tiếp từ Landing Page Chuyên Viên</h4>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-black bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300">
                Miễn phí 0 Credit
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {details?.notes || 'Khách hàng tìm thấy thông tin của bạn qua trang thương hiệu/Landing page chuyên gia của flexGO và chủ động gửi yêu cầu báo giá.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-emerald-200/60 text-xs">
              <div>
                <span className="text-[10px] text-emerald-700 uppercase font-semibold">Trang Profile Nguồn:</span>
                <p className="font-medium text-slate-900 mt-0.5 truncate">{details?.profileName || 'Chuyên viên Minh Tran'}</p>
              </div>
              <div>
                <span className="text-[10px] text-emerald-700 uppercase font-semibold">Ngày Nhận RFQ:</span>
                <p className="font-semibold text-slate-900 mt-0.5">{details?.unlockedDate || 'Gần đây'}</p>
              </div>
              <div>
                <span className="text-[10px] text-emerald-700 uppercase font-semibold">Quyền Lợi:</span>
                <p className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Toàn quyền liên hệ</span>
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-200">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <button
            onClick={onBack}
            className="hover:text-indigo-600 flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Khách Hàng (My Customers)</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-indigo-600 font-bold">{customer.companyName}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Hồ Sơ 360° Khách Hàng Doanh Nghiệp</span>
          </span>
        </div>
      </div>

      {/* Customer 360 Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
              {customer.companyShortName ? customer.companyShortName.slice(0, 2).toUpperCase() : customer.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{customer.companyName}</h1>
                <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-md shadow-2xs">
                  {customer.code || customer.id}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-purple-100 text-purple-800 rounded-md">
                  {customer.flexGoMemberTier || `${customer.status} TIER`}
                </span>
                {customer.kycStatus === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>KYC Đã Xác Minh</span>
                  </span>
                )}
              </div>

              {customer.englishName && (
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {customer.englishName}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-slate-600 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ngành hàng: <strong>{customer.industry}</strong></span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Địa điểm: <strong>{customer.location}</strong></span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sản lượng: <strong>{customer.annualVolumeEst}</strong></span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0 flex-wrap">
            <button
              onClick={() => setActiveTab('inquiries')}
              className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all cursor-pointer"
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Inquiries & Mở Khóa ({customerLeads.length})</span>
            </button>
            <button
              onClick={() => onOpenCreateQuotation && onOpenCreateQuotation(customer)}
              className="flex items-center space-x-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Báo Giá Trực Tiếp</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation - Exact required tabs: Tab 1: Tổng quan, Tab 2: Inquiries */}
        <div className="flex items-center space-x-2 mt-6 border-b border-slate-100 -mb-2 overflow-x-auto">
          {[
            { id: 'overview', label: '1. Tổng quan (Đăng Ký flexGO)', icon: Building2 },
            { id: 'inquiries', label: `2. Inquiries (${customerLeads.length})`, icon: Coins, badge: '25 FC' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 font-extrabold bg-indigo-50/50 rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-xl'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-black bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TỔNG QUAN (Thông tin customer khai báo khi đăng ký nền tảng flexGO) */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Provenance & Source Card */}
            {renderSourceCard()}

            {/* 1. THÔNG TIN PHÁP NHÂN & ĐĂNG KÝ DOANH NGHIỆP */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Thông Tin Doanh Nghiệp Khai Báo (Onboarding Profile)
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ✓ Hồ sơ đã đối soát MST
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Tên Đăng Ký Doanh Nghiệp</span>
                  <p className="font-extrabold text-slate-900 mt-1 text-sm">{customer.companyName}</p>
                  {customer.companyShortName && (
                    <p className="text-slate-500 mt-0.5 text-xs">Tên viết tắt: <strong>{customer.companyShortName}</strong></p>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Mã Số Thuế (MST)</span>
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-mono font-black text-slate-900 text-sm">{customer.taxId || '0314892831'}</p>
                    <button
                      onClick={() => copyToClipboard(customer.taxId || '0314892831', 'taxId')}
                      className="text-indigo-600 hover:text-indigo-800 p-1 cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    >
                      {copiedKey === 'taxId' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'taxId' ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Người Đại Diện Pháp Luật</span>
                  <p className="font-bold text-slate-900 mt-1">{customer.legalRepresentative || 'Chưa cập nhật'}</p>
                  <p className="text-slate-500 text-[11px]">Năm thành lập: {customer.establishedYear || '2016'}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Vốn Điều Lệ & Quy Mô</span>
                  <p className="font-bold text-slate-900 mt-1">{customer.registeredCapital || '150,000,000,000 VNĐ'}</p>
                  <p className="text-slate-500 text-[11px]">Quy mô: {customer.employeeScale || '200 - 500 nhân sự'}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Loại Hình Doanh Nghiệp & Website</span>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                    <p className="font-semibold text-slate-800">{customer.businessType || 'Công ty TNHH Hai Thành Viên Trở Lên'}</p>
                    {customer.website && (
                      <a
                        href={customer.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold text-xs"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{customer.website}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ĐỊA ĐIỂM & HẠ TẦNG KHO XƯỞNG / TRỤ SỞ */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Địa Điểm & Hạ Tầng Nhà Máy / Kho Bãi Đăng Ký
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Trụ Sở Chính Đăng Ký Kinh Doanh</span>
                  <p className="font-bold text-slate-800 mt-1 leading-relaxed">
                    {customer.headquartersAddress || customer.address}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Nhà Máy / Cơ Sở Sản Xuất Chính</span>
                    <p className="font-semibold text-slate-800 mt-1 leading-relaxed">
                      {customer.factoryAddress || 'KCN Tân Bình & KCN Hiệp Phước, TP.HCM'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Kho Hàng / Điểm Giao Nhận Tập Kết</span>
                    <p className="font-semibold text-slate-800 mt-1 leading-relaxed">
                      {customer.warehouseAddress || 'Kho Logistics SOTRANS ICD Thủ Đức'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. NHU CẦU LOGISTICS & KHAI BÁO ONBOARDING */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Truck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Nhu Cầu Vận Tải & Tiêu Chuẩn SLA Khai Báo flexGO
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100">
                    <span className="text-indigo-700 block uppercase font-bold text-[10px]">Nhóm Hàng Hóa Chủ Lực</span>
                    <p className="font-extrabold text-slate-900 mt-1">{customer.primaryCargo || customer.industry}</p>
                    {customer.cargoSpecialProps && (
                      <p className="text-slate-600 mt-1 text-[11px]">{customer.cargoSpecialProps}</p>
                    )}
                  </div>

                  <div className="p-3.5 bg-indigo-50/40 rounded-xl border border-indigo-100">
                    <span className="text-indigo-700 block uppercase font-bold text-[10px]">Sản Lượng Vận Tải Khai Báo</span>
                    <p className="font-extrabold text-slate-900 mt-1">{customer.annualVolumeEst}</p>
                    <p className="text-slate-600 mt-1 text-[11px]">Ước tính tháng: {customer.monthlyVolumeEst || '20 - 30 Chuyến / Tháng'}</p>
                  </div>
                </div>

                {customer.keyRoutes && customer.keyRoutes.length > 0 && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block uppercase font-bold text-[10px] mb-2">Các Tuyến Trọng Điểm Đăng Ký</span>
                    <div className="flex flex-wrap gap-2">
                      {customer.keyRoutes.map((route, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold shadow-2xs">
                          📍 {route}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {customer.preferredModes && customer.preferredModes.length > 0 && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block uppercase font-bold text-[10px] mb-2">Phương Thức Vận Chuyển Yêu Cầu</span>
                    <div className="flex flex-wrap gap-2">
                      {customer.preferredModes.map((mode, i) => (
                        <span key={i} className="px-2.5 py-1 bg-indigo-100/70 border border-indigo-200 rounded-lg text-indigo-900 font-bold">
                          🚚 {mode}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {customer.slaRequirements && customer.slaRequirements.length > 0 && (
                  <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1.5">
                    <span className="text-emerald-800 block uppercase font-bold text-[10px]">Tiêu Chuẩn SLA & Cam Kết Bắt Buộc</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                      {customer.slaRequirements.map((sla, i) => (
                        <li key={i}>{sla}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Điều Khoản Thanh Toán</span>
                    <p className="font-bold text-slate-800 mt-1">{customer.preferredPaymentTerms || 'Net 30 - 45 Ngày'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block uppercase font-bold text-[10px]">Thị Trường Mục Tiêu</span>
                    <p className="font-bold text-slate-800 mt-1">{customer.operatingMarkets?.join(', ') || 'Nội địa & Xuất khẩu Châu Á'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. GHI CHÚ TƯƠNG TÁC & HOẠT ĐỘNG */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Nhật Ký Tương Tác & Ghi Chú Sales</span>
              </h3>
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  rows={2}
                  placeholder="Ghi nhận phản hồi cuộc gọi, nhu cầu giá cước, lịch xuất hàng dự kiến..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs cursor-pointer"
                  >
                    Lưu Ghi Chú
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* SIDEBAR RIGHT STATS */}
          <div className="space-y-6">
            {/* Value & Revenue Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md">
              <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                Giá Trị Khách Hàng (LTV)
              </span>
              <div className="text-2xl font-black text-white mt-1">
                {customer.totalRevenueDisplay || `${(customer.totalRevenueVND || 0).toLocaleString('vi-VN')} ₫`}
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">Tổng doanh số / Ngân sách dự kiến</p>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-indigo-200">
                  <span>Số Inquiries phát hành:</span>
                  <span className="font-bold text-white">{customerLeads.length} Inquiries</span>
                </div>
                <div className="flex justify-between text-indigo-200">
                  <span>Cơ hội đang đàm phán:</span>
                  <span className="font-bold text-white">{customer.openOpportunitiesCount} Gói Thầu</span>
                </div>
                <div className="flex justify-between text-indigo-200">
                  <span>Điều khoản thanh toán:</span>
                  <span className="font-bold text-white">{customer.preferredPaymentTerms || 'Net 30 - 45 Ngày'}</span>
                </div>
              </div>
            </div>

            {/* Primary Procurement Representative */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Đại Diện Mua Hàng Khai Báo
                </h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Chính
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-extrabold text-slate-900 text-sm">{customer.contactPerson}</p>
                  <p className="text-slate-500 text-[11px]">{customer.contactRole || 'Giám Đốc Mua Hàng / Supply Chain'}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Điện thoại:</span>
                    <a href={`tel:${customer.contactPhone}`} className="font-mono font-bold text-emerald-700 hover:underline">
                      {customer.contactPhone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Email:</span>
                    <a href={`mailto:${customer.contactEmail}`} className="font-medium text-indigo-600 hover:underline">
                      {customer.contactEmail}
                    </a>
                  </div>
                </div>

                {/* Fast Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={`https://zalo.me/${customer.contactPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Chat Zalo</span>
                  </a>
                  <a
                    href={`tel:${customer.contactPhone}`}
                    className="py-1.5 px-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Gọi Điện</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Inquiries CTA Banner */}
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-50 to-amber-500/5 rounded-2xl border border-amber-200 p-5 space-y-2.5">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <h4 className="text-xs font-extrabold text-slate-900 uppercase">
                  Ưu Đãi Mở Khóa Inquiries 360
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Với các inquiries mới của khách hàng này, phí mở khóa xem toàn bộ giá đối thủ chỉ là <strong className="text-amber-800">25 FlexCredit</strong> (giảm 50%).
              </p>
              <button
                onClick={() => setActiveTab('inquiries')}
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Xem Bảng Inquiries ({customerLeads.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INQUIRIES (Bảng Leaderboard Inquiries của khách hàng - Mở khóa 25 FC) */}
      {/* ========================================================================= */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          {/* SPECIAL DISCOUNT 25 FLEXCREDIT BANNER */}
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-500/10 border-2 border-amber-300/80 rounded-3xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xs">
                    <Coins className="w-5 h-5" />
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white shadow-2xs">
                    Ưu đãi Khách hàng 360: 25 FlexCredit
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Tiết kiệm 50%
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Bảng Leaderboard Inquiries Của Doanh Nghiệp: {customer.companyName}
                </h3>
                <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                  Tất cả nhu cầu vận chuyển mới phát sinh từ khách hàng này được cập nhật trực tiếp tại đây. Do khách hàng đã nằm trong hệ thống 360, bạn chỉ cần <strong className="text-slate-900 font-extrabold">25 FlexCredit</strong> (thay vì 50 FlexCredit thông thường) để mở khóa xem bảng phân tích chi tiết giá của đối thủ và gửi báo giá cạnh tranh.
                </p>
              </div>

              {/* Wallet Status */}
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-amber-200 shadow-xs shrink-0">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Coins className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Số dư ví hiện tại</span>
                  <span className="text-sm font-black text-slate-900">{wallet?.balanceCredits?.toLocaleString() ?? '15,400'} Credits</span>
                </div>
                <button
                  onClick={() => onNavigate({ type: 'workspace', view: 'flexcredit-add' })}
                  className="ml-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Nạp thêm
                </button>
              </div>
            </div>
          </div>

          {/* KPI Summary Cards for Customer Inquiries */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Tổng Inquiries</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{customerLeads.length}</div>
              <span className="text-[11px] text-indigo-600 font-medium">Của {customer.companyShortName || customer.companyName}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Đang Mở Nhận Báo Giá</span>
              <div className="text-2xl font-black text-blue-700 mt-1">
                {customerLeads.filter(l => l.status === 'Open').length}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Sẵn sàng chào giá</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Đã Nộp Báo Giá</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                {customerLeads.filter(l => l.status === 'Quoted' || l.status === 'Won').length}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Đang trong đàm phán</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Phí Mở Khóa / Inquiry</span>
              <div className="text-2xl font-black text-amber-600 mt-1 flex items-center gap-1">
                <span>25</span>
                <span className="text-xs font-bold text-slate-500">FC</span>
              </div>
              <span className="text-[11px] text-amber-700 font-medium line-through">Chuẩn: 50 FC</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã inquiry, tuyến đường, loại hàng..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Tất cả dịch vụ</option>
                <option value="Trucking">Trucking</option>
                <option value="Sea Freight (FCL)">Sea Freight (FCL)</option>
                <option value="Sea Freight (LCL)">Sea Freight (LCL)</option>
                <option value="Air Freight">Air Freight</option>
                <option value="Cold Chain">Cold Chain</option>
                <option value="Warehousing">Warehousing</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="Open">Đang mở nhận giá (Open)</option>
                <option value="Quoted">Đã báo giá (Quoted)</option>
                <option value="Won">Đã trúng thầu (Won)</option>
              </select>

              <button
                onClick={() => onOpenCreateQuotation && onOpenCreateQuotation(customer)}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Báo Giá Mới</span>
              </button>
            </div>
          </div>

          {/* 360 UNLOCKED ADVANTAGE BANNER */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Thông tin liên hệ khách hàng đã mở khóa 100%</span>
                  <span className="bg-emerald-200 text-emerald-900 text-[10px] px-1.5 py-0.5 rounded font-bold">Xem Chi Tiết Kỹ Thuật Miễn Phí</span>
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Bạn có thể bấm vào từng Inquiry để xem đầy đủ thông số kỹ thuật, hồ sơ SLA & yêu cầu vận hành. Chỉ cần mở khóa <strong className="text-amber-700 font-bold">Ma Trận Đối Thủ (25 FC)</strong> khi bạn muốn soi bảng giá các nhà cung cấp khác đã chào và gửi báo giá cạnh tranh.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (expandedLeadIds.size === filteredCustomerLeads.length) {
                    setExpandedLeadIds(new Set());
                  } else {
                    setExpandedLeadIds(new Set(filteredCustomerLeads.map((l) => l.id)));
                  }
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>{expandedLeadIds.size === filteredCustomerLeads.length && filteredCustomerLeads.length > 0 ? 'Thu gọn tất cả' : 'Mở rộng tất cả chi tiết'}</span>
              </button>
            </div>
          </div>

          {/* INQUIRIES LEADERBOARD TABLE */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-2.5 px-2 text-center w-10">STT</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Ngày Đăng / Hạn</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Mã ID</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Nhóm Dịch Vụ</th>
                    <th className="py-2.5 px-2 whitespace-nowrap">Nhóm Hàng</th>
                    <th className="py-2.5 px-2 whitespace-nowrap">Mô Hình</th>
                    <th className="py-2.5 px-2 whitespace-nowrap">Loại Hợp Đồng</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Tổng Giá Trị</th>
                    <th className="py-2.5 px-2 text-center whitespace-nowrap">Trạng Thái</th>
                    <th className="py-2.5 px-2 text-center whitespace-nowrap">Báo Giá / Xem</th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredCustomerLeads.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400">
                        <Coins className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-bold text-slate-600 text-sm">Không tìm thấy inquiry nào khớp với bộ lọc</p>
                        <p className="text-xs text-slate-400 mt-1">Thử đổi từ khóa tìm kiếm hoặc bấm "Báo Giá Mới" để chào giá trực tiếp.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomerLeads.map((lead, idx) => {
                      const isExpanded = expandedLeadIds.has(lead.id);
                      const isContract = lead.pricingType === 'CONTRACT';
                      const operationMode = getOperationModeDisplay(lead);
                      const isLeadViewed = Boolean(
                        viewedInquiryCodes && (
                          viewedInquiryCodes.includes(lead.code) ||
                          (lead.inquiryCode && viewedInquiryCodes.includes(lead.inquiryCode)) ||
                          viewedInquiryCodes.includes(lead.id)
                        )
                      );

                      return (
                        <React.Fragment key={lead.id}>
                          <tr 
                            className={`transition-colors group cursor-pointer select-none ${
                              isExpanded 
                                ? 'bg-indigo-50/60 font-medium' 
                                : idx % 2 === 0
                                ? 'bg-white hover:bg-slate-50/90'
                                : 'bg-slate-50/40 hover:bg-slate-100/70'
                            }`}
                            onClick={() => toggleExpandLead(lead.id)}
                          >
                            {/* Cột 1: STT */}
                            <td className="py-3 px-2 text-center text-slate-400 font-mono text-xs">
                              {idx + 1}
                            </td>

                            {/* Cột 2: Ngày Đăng & Hạn Nộp */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="space-y-0.5">
                                <span className="text-slate-700 font-semibold block text-xs">
                                  {lead.createdDate || 'Aug 31, 2026'}
                                </span>
                                <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                                  Hạn: {lead.dueDate || '7 ngày'}
                                </span>
                              </div>
                            </td>

                            {/* Cột 3: Mã ID */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-bold text-indigo-700 text-xs">
                                  {lead.code}
                                </span>
                                {lead.isSaved && (
                                  <BookmarkCheck className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" title="Đã lưu" />
                                )}
                              </div>
                            </td>

                            {/* Cột 4: Nhóm Dịch Vụ */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getServiceBadgeStyle(lead.serviceType)}`}>
                                {lead.serviceType}
                              </span>
                            </td>

                            {/* Cột 5: Nhóm Hàng */}
                            <td className="py-3 px-2 whitespace-nowrap">
                              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCargoBadgeStyle(lead.cargoClassification)}`}>
                                {getCargoLabel(lead.cargoClassification)}
                              </span>
                            </td>

                            {/* Cột 6: Mô Hình */}
                            <td className="py-3 px-2 whitespace-nowrap">
                              <span className="text-slate-800 font-semibold text-xs">
                                {operationMode}
                              </span>
                            </td>

                            {/* Cột 7: Loại Hợp Đồng */}
                            <td className="py-3 px-2 whitespace-nowrap">
                              {isContract ? (
                                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                  Hợp đồng
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                                  Theo lô
                                </span>
                              )}
                            </td>

                            {/* Cột 8: Tổng Giá Trị */}
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <div className="space-y-0.5">
                                <span className="text-xs sm:text-[12.5px] font-black text-emerald-700 block tracking-tight">
                                  {(lead.estimatedValueVND || (lead.estimatedValueDisplay ? parseInt(lead.estimatedValueDisplay.replace(/\D/g, ''), 10) : 0) || 0).toLocaleString('vi-VN')}
                                </span>
                                <span className="text-[9.5px] font-semibold text-slate-500 block">
                                  {isContract ? 'VNĐ / tháng' : 'VNĐ / lô'}
                                </span>
                              </div>
                            </td>

                            {/* Cột 9: Trạng Thái */}
                            <td className="py-3 px-2 text-center whitespace-nowrap">
                              <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadgeStyle(lead.status)}`}>
                                {getStatusDisplay(lead.status)}
                              </span>
                            </td>

                            {/* Cột 10: Thống Kê Báo Giá & Lượt Xem */}
                            <td className="py-3 px-2 text-center whitespace-nowrap">
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                                  {lead.quotesCount || 0} báo giá
                                </span>
                                <span className="text-[9px] text-slate-400 font-medium">
                                  {lead.viewsCount || 45} xem
                                </span>
                              </div>
                            </td>

                            {/* Cột 11: Thao Tác - Nút Xem chi tiết + Subtext Chưa xem nếu chưa mở xem */}
                            <td className="py-3 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex flex-col items-center">
                                <button
                                  type="button"
                                  onClick={() => toggleExpandLead(lead.id)}
                                  className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all inline-flex items-center justify-center gap-1 cursor-pointer shadow-2xs ${
                                    isExpanded
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 hover:border-indigo-300'
                                  }`}
                                  title={isExpanded ? 'Thu gọn chi tiết lead' : 'Mở xem chi tiết hồ sơ & thao tác'}
                                >
                                  <span>{isExpanded ? 'Đóng' : 'Xem chi tiết'}</span>
                                  {isExpanded ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {/* Subtext Chưa xem: chỉ hiển thị khi chưa mở xem */}
                                {!isLeadViewed && (
                                  <span className="text-[10px] font-bold text-amber-600 block mt-0.5 animate-pulse">
                                    Chưa xem
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>

                          {/* EXPANDED TECHNICAL SPECS & DETAIL CARD (GIỐNG LEAD BOARD) */}
                          {isExpanded && (
                            <tr className="bg-indigo-50/40 border-b border-indigo-100 animate-in fade-in duration-150">
                              <td colSpan={11} className="p-3 sm:p-5">
                                <div className="space-y-3">
                                  {/* Quick Action Top Bar inside expanded card */}
                                  <div className="flex flex-wrap items-center justify-between bg-white px-4 py-3 rounded-2xl border border-indigo-100 shadow-2xs gap-3">
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className="font-black text-indigo-950 flex items-center gap-1.5">
                                        <FileText className="w-4 h-4 text-indigo-600" />
                                        <span>Chi Tiết Yêu Cầu Kỹ Thuật: {lead.code}</span>
                                      </span>
                                      <span className="text-slate-300">•</span>
                                      <span className="text-slate-700 font-semibold">{lead.serviceType}</span>
                                      <span className="text-slate-300">•</span>
                                      <span className="text-slate-500">{lead.route}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {lead.isUnlocked ? (
                                        <button
                                          type="button"
                                          onClick={() => setSelectedLeadForCompare(lead)}
                                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                        >
                                          <BarChart3 className="w-3.5 h-3.5" />
                                          <span>So Sánh Ma Trận Giá Đối Thủ</span>
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setSelectedLeadForCompare(lead)}
                                          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-black transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                        >
                                          <Coins className="w-3.5 h-3.5" />
                                          <span>Mở Khóa Ma Trận Giá Đối Thủ (25 FC)</span>
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (onOpenCreateQuotation) {
                                            onOpenCreateQuotation(lead);
                                          } else {
                                            setSelectedLeadForCompare(lead);
                                          }
                                        }}
                                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Gửi Báo Giá Cho Khách Hàng</span>
                                      </button>
                                    </div>
                                  </div>

                                  {/* LeadInquiryDetailCard with verified/unlocked customer identity */}
                                  <LeadInquiryDetailCard
                                    lead={lead}
                                    isUnlocked={true}
                                    maskCompanyName={(n) => n}
                                    maskContactPerson={(n) => n}
                                    onUnlockClick={() => setSelectedLeadForCompare(lead)}
                                    onCompareClick={() => setSelectedLeadForCompare(lead)}
                                    onOpenCreateQuotation={() => {
                                      if (onOpenCreateQuotation) onOpenCreateQuotation(lead);
                                      else setSelectedLeadForCompare(lead);
                                    }}
                                    isCustomerView={false}
                                  />
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Hiển thị <strong>{filteredCustomerLeads.length}</strong> inquiries của <strong>{customer.companyName}</strong></span>
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Áp dụng biểu phí ưu đãi 25 FlexCredit cho mọi Inquiries khách hàng 360</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BÓC TÁCH MA TRẬN ĐỐI THỦ & MỞ KHÓA INQUIRY VỚI GIÁ 25 FLEXCREDIT */}
      {selectedLeadForCompare && (
        <SupplierLeadCompareModal
          isOpen={true}
          lead={selectedLeadForCompare}
          currentUser={currentUser}
          quotations={quotations}
          wallet={wallet}
          isUnlocked={selectedLeadForCompare.isUnlocked}
          onClose={() => setSelectedLeadForCompare(null)}
          onUnlockWithCredit={(leadId, cost) => {
            // Guarantee 25 FlexCredit cost for Customer 360 Inquiries
            const discountCost = cost === 50 ? 25 : cost;
            const success = handleUnlockInquiryWithDiscount(leadId);
            if (success !== false) {
              setSelectedLeadForCompare((prev) => prev ? { ...prev, isUnlocked: true } : null);
            }
            return success;
          }}
          onSubmitQuotation={(quote) => {
            if (onSubmitQuotation) {
              onSubmitQuotation(quote);
            }
            setSelectedLeadForCompare(null);
          }}
          onNavigate={onNavigate}
          creditCostOverride={25}
          discountBadge="Ưu đãi Khách hàng 360: 25 FlexCredit (Tiết kiệm 50%)"
        />
      )}
    </div>
  );
};
