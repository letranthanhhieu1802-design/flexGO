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
  BookmarkCheck,
  ArrowUpDown,
  Maximize2
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
import { InquirySummaryConfirmModal } from '../customer/InquirySummaryConfirmModal';
import { LeadInquiryDetailCard } from '../public/LeadInquiryDetailCard';
import { getLeadOrInquiryPricing } from '../../utils/pricingCalculator';

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
  onIncrementLeadViews?: (leadIdOrCode: string) => void;
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
  onIncrementLeadViews,
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
  const [sortField, setSortField] = useState<string>('createdDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLeadForCompare, setSelectedLeadForCompare] = useState<SupplierLeadItem | null>(null);
  const [expandedLeadIds, setExpandedLeadIds] = useState<Set<string>>(new Set());
  const [localExtraViews, setLocalExtraViews] = useState<Record<string, number>>({});

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const toggleExpandLead = (leadId: string) => {
    const isExpanding = !expandedLeadIds.has(leadId);
    const target = (leads || []).find((l) => l.id === leadId || l.code === leadId || l.inquiryCode === leadId);
    const identifier = target ? (target.code || target.inquiryCode || target.id) : leadId;

    // When supplier expands to see details, mark as viewed and increment views count +1
    if (isExpanding) {
      if (onMarkInquiryAsViewed) {
        onMarkInquiryAsViewed(identifier);
      }
      if (onIncrementLeadViews) {
        onIncrementLeadViews(identifier);
      }
      setLocalExtraViews((prev) => ({
        ...prev,
        [identifier]: (prev[identifier] || 0) + 1,
        [leadId]: (prev[leadId] || 0) + 1,
      }));
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
          viewsCount: (existingLead?.viewsCount ?? inq.viewsCount ?? 15) + (localExtraViews[inq.code || ''] || localExtraViews[existingLead?.id || ''] || 0),
          isUnlocked: Boolean(existingLead?.isUnlocked || customer.source === 'FLEXCREDIT_UNLOCKED' || inq.code === 'FG-2608250001'),
          isSaved: true,
          inquiry: inq,
          serviceSpecs: inq.serviceSpecs || existingLead?.serviceSpecs,
          selectedVAS: inq.selectedVAS || existingLead?.selectedVAS,
          requestedSurcharges: inq.requestedSurcharges || existingLead?.requestedSurcharges,
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

          const matchedInq = inquiries.find((i) => i.code === lead.inquiryCode || i.code === lead.code) || lead.inquiry;

          matchedMap.set(key, {
            ...lead,
            inquiry: matchedInq || lead.inquiry,
            quotesCount: quotesCount,
            viewsCount: (lead.viewsCount || 15) + (localExtraViews[lead.code] || localExtraViews[lead.id] || 0),
            status: myQuote ? 'Quoted' : lead.status,
            isUnlocked: Boolean(lead.isUnlocked || customer.source === 'FLEXCREDIT_UNLOCKED' || lead.inquiryCode === 'FG-2608250001'),
          });
        }
      }
    });

    let result = Array.from(matchedMap.values());

    // 3. If no exact match found, provide tailored lead from customer's profile so leaderboard is never empty
    if (result.length === 0) {
      const fallbackId = `lead-cust-${customer.id}-01`;
      const fallbackCode = `FG-2608${String(10 + Math.abs(customer.companyName.length % 20)).padStart(2, '0')}0001`;
      const prefMode: ServiceType = (customer.preferredModes?.[0]?.includes('Sea') ? 'Sea Freight (FCL)' : customer.preferredModes?.[0]?.includes('Air') ? 'Air Freight' : customer.preferredModes?.[0]?.includes('Lạnh') ? 'Cold Chain' : 'Trucking') as ServiceType;
      
      const fallbackInquiry: InquiryItem = {
        id: `inq-cust-${customer.id}-01`,
        code: fallbackCode,
        leadCode: fallbackCode,
        title: `Vận chuyển định kỳ hợp đồng: ${customer.location || 'TP. Hồ Chí Minh'} → ${customer.operatingMarkets?.[0] || 'Hà Nội'}`,
        customerCompany: customer.companyName,
        contactPerson: customer.contactPerson,
        contactPhone: customer.contactPhone,
        contactEmail: customer.contactEmail,
        serviceType: prefMode,
        origin: customer.location || 'TP. Hồ Chí Minh',
        destination: customer.operatingMarkets?.[0] || 'Hà Nội (KCN Thăng Long)',
        route: customer.keyRoutes?.[0] || `${customer.location || 'TP. Hồ Chí Minh'} → Hà Nội`,
        cargoType: customer.primaryCargo || 'Hàng công nghiệp tiêu chuẩn',
        weightVolume: customer.monthlyVolumeEst || '25 Chuyến / Tháng',
        targetBudget: customer.estimatedValueDisplay || '450,000,000 ₫',
        pricingType: 'CONTRACT',
        status: 'Open',
        createdDate: 'Hôm nay',
        expiryDate: '2026-09-25',
        pickupDate: '2026-09-28',
        deliveryDate: '2026-09-30',
        description: `Vận chuyển định kỳ tuyến ${customer.location || 'TP. Hồ Chí Minh'} đi ${customer.operatingMarkets?.[0] || 'Hà Nội'}`,
        responsesCount: 3,
        viewsCount: 142,
        currency: 'VND',
        requestedSurcharges: ['Phí cầu đường cao tốc', 'Phí bến bãi lưu đêm'],
        selectedVAS: ['Bảo hiểm hàng hóa toàn diện', 'Hệ thống định vị GPS & Báo cáo lộ trình'],
        serviceSpecs: {
          trucking: {
            loadType: 'FTL (Nguyên chuyến)',
            truckType: 'Xe tải thùng kín tiêu chuẩn',
            tonnageCategory: '15 Tấn',
            pricingType: 'CONTRACT',
            contractTerm: '12 Tháng (Cam kết sản lượng)',
            committedFrequency: '25 Chuyến / Tháng',
            multiDropPoints: 0,
            pickupLocations: [customer.location || 'TP. Hồ Chí Minh'],
            deliveryLocations: [customer.operatingMarkets?.[0] || 'Hà Nội (KCN Thăng Long)'],
          }
        }
      };

      const fallbackLead: SupplierLeadItem = {
        id: fallbackId,
        code: fallbackCode,
        inquiryCode: fallbackCode,
        customerCompany: customer.companyName,
        contactName: customer.contactPerson,
        contactRole: customer.contactRole,
        contactPhone: customer.contactPhone,
        contactEmail: customer.contactEmail,
        serviceType: prefMode,
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
        viewsCount: 142 + (localExtraViews[fallbackId] || localExtraViews[fallbackCode] || 0),
        isUnlocked: customer.source === 'FLEXCREDIT_UNLOCKED',
        isSaved: true,
        inquiry: fallbackInquiry,
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
  }, [inquiries, leads, quotations, customer, currentUser.id, localExtraViews]);

  // Filtered customer leads for leaderboard table with dynamic sorting like My Leads
  const filteredCustomerLeads = useMemo(() => {
    const filtered = customerLeads.filter((lead) => {
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

    return [...filtered].sort((a, b) => {
      let aVal: any = a[sortField as keyof SupplierLeadItem] || '';
      let bVal: any = b[sortField as keyof SupplierLeadItem] || '';

      if (sortField === 'estimatedValueVND') {
        aVal = a.estimatedValueVND || (a.estimatedValueDisplay ? parseInt(a.estimatedValueDisplay.replace(/\D/g, ''), 10) : 0);
        bVal = b.estimatedValueVND || (b.estimatedValueDisplay ? parseInt(b.estimatedValueDisplay.replace(/\D/g, ''), 10) : 0);
      } else if (sortField === 'quotesCount') {
        aVal = a.quotesCount || 0;
        bVal = b.quotesCount || 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [customerLeads, inquirySearch, serviceFilter, statusFilter, sortField, sortOrder]);

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
    <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-5 animate-in fade-in duration-200 space-y-5">
      {/* Top Navigation Bar / Breadcrumbs */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <button
            onClick={onBack}
            className="hover:text-indigo-600 flex items-center space-x-1.5 cursor-pointer transition-colors bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay Lại</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600">Khách Hàng (My Customers)</span>
          <span className="text-slate-300">/</span>
          <span className="text-indigo-600 font-extrabold">{customer.companyName}</span>
        </div>
      </div>

      {/* 2 Primary Tabs (Pure text, no icons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>1. Tổng quan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>2. Yêu cầu báo giá</span>
          <span
            className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
              activeTab === 'inquiries' ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {customerLeads.length}
          </span>
        </button>
      </div>

      {/* 2-Column Executive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Dark Navy Executive Profile Card (lg:col-span-4 xl:col-span-3) */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-gradient-to-b from-[#1b3168] via-[#162753] to-[#0f1b38] rounded-3xl p-6 sm:p-7 text-white shadow-md border border-slate-800/40 space-y-6 sticky top-6">
            {/* Header: Avatar, Tên người phụ trách, Chức vụ, Tên công ty */}
            <div className="text-center pt-2">
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 text-white font-black text-2xl sm:text-3xl flex items-center justify-center border-4 border-white/20 shadow-xl">
                {customer.contactPerson
                  ? customer.contactPerson.split(' ').map(n => n[0]).slice(-2).join('').toUpperCase()
                  : (customer.companyShortName ? customer.companyShortName.slice(0, 2).toUpperCase() : customer.companyName.slice(0, 2).toUpperCase())}
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-4">
                {customer.contactPerson || 'Chưa có tên liên hệ'}
              </h2>

              <div className="inline-block mt-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-100 border border-white/20">
                {customer.contactRole || 'Người phụ trách Logistics / Mua hàng'}
              </div>

              <p className="text-xs sm:text-sm text-indigo-200/90 font-bold mt-2.5">
                {customer.companyName}
              </p>
              {customer.englishName && (
                <p className="text-[11px] text-indigo-300/70 font-medium mt-0.5">
                  {customer.englishName}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-white/15"></div>

            {/* Thông tin kết nối trực tiếp */}
            <div className="space-y-3.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-200/70 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-300" />
                <span>Thông Tin Kết Nối Trực Tiếp</span>
              </span>

              {/* Số điện thoại */}
              <div className="flex items-center gap-3 text-xs text-white/90">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block font-medium">Số điện thoại / Hotline</span>
                  <a href={`tel:${customer.contactPhone}`} className="font-bold hover:text-emerald-300 transition-colors">
                    {customer.contactPhone || 'Chưa cập nhật'}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 text-xs text-white/90">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block font-medium">Email liên hệ</span>
                  <a href={`mailto:${customer.contactEmail}`} className="font-bold hover:text-sky-300 transition-colors break-all">
                    {customer.contactEmail || 'Chưa cập nhật'}
                  </a>
                </div>
              </div>

              {/* Địa chỉ trụ sở / Nhà máy */}
              <div className="flex items-start gap-3 text-xs text-white/90">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-white/50 block font-medium">Địa chỉ trụ sở / Nhà máy</span>
                  <span className="font-medium text-white/80 leading-relaxed block text-xs">
                    {customer.headquartersAddress || customer.address || customer.location}
                  </span>
                </div>
              </div>

              {/* Quick Actions Call/Zalo */}
              {customer.contactPhone && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={`https://zalo.me/${customer.contactPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-300" />
                    <span>Chat Zalo</span>
                  </a>
                  <a
                    href={`tel:${customer.contactPhone}`}
                    className="py-2 px-3 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-400/30 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Gọi Điện</span>
                  </a>
                </div>
              )}
            </div>

            {/* Thông tin doanh nghiệp cơ bản */}
            <div className="border-t border-white/15 pt-4 space-y-2.5 text-xs text-white/80">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-200/70 flex items-center gap-2 mb-2">
                <Building2 className="w-3.5 h-3.5 text-indigo-300" />
                <span>Hồ Sơ Doanh Nghiệp</span>
              </span>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/60">Ngành hàng:</span>
                <span className="font-bold text-white text-right max-w-[180px] truncate">{customer.industry}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/60">Mã số thuế:</span>
                <span className="font-mono font-bold text-white">{customer.taxId || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-white/60">Khu vực:</span>
                <span className="font-bold text-white">{customer.location}</span>
              </div>
              {customer.annualVolumeEst && (
                <div className="flex justify-between py-1">
                  <span className="text-white/60">Sản lượng năm:</span>
                  <span className="font-bold text-emerald-400">{customer.annualVolumeEst}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN: Tab Content (lg:col-span-8 xl:col-span-9)
        ===================================================================== */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-5">

      {/* ========================================================================= */}
      {/* TAB 1: TỔNG QUAN (Để trang trắng sạch sẽ theo yêu cầu của user) */}
      {/* ========================================================================= */}
          {/* TAB 1: TỔNG QUAN (Trang trắng sạch sẽ theo yêu cầu của user) */}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs min-h-[500px]">
              {/* Trang trắng sẵn sàng cho thiết kế mới */}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: YÊU CẦU BÁO GIÁ (INQUIRIES) */}
          {/* ========================================================================= */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              {/* 4 KPI Summary Cards for Customer Inquiries */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
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

              {/* Search & Filter Toolbar (Đã loại bỏ nút + Báo Giá Mới) */}
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
                    id="customer-inquiries-service-select"
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
                  >
                    <option value="ALL">Tất cả Nhóm Dịch Vụ</option>
                    <option value="Trucking">Đường bộ</option>
                    <option value="Sea Freight (FCL)">Đường biển (FCL)</option>
                    <option value="Sea Freight (LCL)">Đường biển (LCL)</option>
                    <option value="Air Freight">Hàng không</option>
                    <option value="Rail Freight">Đường sắt</option>
                    <option value="Cold Chain">Chuỗi lạnh</option>
                    <option value="Warehousing">Kho bãi 3PL</option>
                    <option value="Customs Clearance">Hải quan</option>
                    <option value="Cross-border">Xuyên biên giới</option>
                    <option value="Project Cargo">Logistics Dự án</option>
                  </select>

                  <select
                    id="customer-inquiries-status-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
                  >
                    <option value="ALL">Tất cả Trạng thái</option>
                    <option value="Open">Open</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* INQUIRIES DATA TABLE (CHUẨN 11 CỘT NHƯ TRANG MY LEADS CỦA SUPPLIER) */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto max-h-[700px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-wider select-none">
                        {/* 1. STT */}
                        <th className="py-2.5 px-1.5 text-center w-10 sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                          STT
                        </th>

                        {/* 2. Ngày Đăng / Hạn Nộp */}
                        <th 
                          className="py-2.5 px-2 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                          onClick={() => handleSort('createdDate')}
                        >
                          <div className="flex items-center gap-1">
                            <span>Ngày Đăng / Hạn</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>

                        {/* 3. Mã ID */}
                        <th 
                          className="py-2.5 px-2 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                          onClick={() => handleSort('code')}
                        >
                          <div className="flex items-center gap-1">
                            <span>Mã ID</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>

                        {/* 4. Nhóm Dịch Vụ */}
                        <th className="py-2.5 px-2 whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                          <span>Nhóm Dịch Vụ</span>
                        </th>

                        {/* 5. Nhóm Hàng */}
                        <th className="py-2.5 px-1.5 whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                          <span>Nhóm Hàng</span>
                        </th>

                        {/* 6. Mô Hình */}
                        <th className="py-2.5 px-1.5 whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                          <span>Mô Hình</span>
                        </th>

                        {/* 7. Loại Hợp Đồng */}
                        <th 
                          className="py-2.5 px-1.5 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                          onClick={() => handleSort('pricingType')}
                        >
                          <span>Loại Hợp Đồng</span>
                        </th>

                        {/* 8. Tổng Giá Trị */}
                        <th 
                          className="py-2.5 px-2 text-right cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                          onClick={() => handleSort('estimatedValueVND')}
                        >
                          <div className="flex items-center justify-end gap-1">
                            <span>Tổng Giá Trị</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>

                        {/* 9. Trạng Thái */}
                        <th 
                          className="py-2.5 px-1.5 text-center cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>Trạng Thái</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>

                        {/* 10. Báo Giá / Xem */}
                        <th 
                          className="py-2.5 px-1.5 text-center cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200"
                          onClick={() => handleSort('quotesCount')}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span>Báo Giá / Xem</span>
                            <ArrowUpDown className="w-3 h-3 text-slate-400" />
                          </div>
                        </th>

                        {/* 11. Thao Tác (Xem đầy đủ modal) */}
                        <th className="py-2.5 px-2 text-center whitespace-nowrap sticky top-0 z-20 bg-slate-100 border-b border-slate-200">
                          <span>Thao Tác</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredCustomerLeads.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="py-16 text-center text-slate-400">
                            <div className="max-w-md mx-auto space-y-2">
                              <Coins className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="font-bold text-slate-700 text-sm">
                                Không tìm thấy yêu cầu báo giá nào của {customer.companyShortName || customer.companyName} phù hợp
                              </p>
                              <p className="text-xs text-slate-400">
                                Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc dịch vụ, trạng thái.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredCustomerLeads.map((lead, idx) => {
                          const isContract = lead.pricingType === 'CONTRACT';
                          const operationMode = getOperationModeDisplay(lead);

                          return (
                            <React.Fragment key={lead.id}>
                              <tr 
                                id={`customer-lead-row-${lead.code}`}
                                onClick={() => {
                                  setSelectedLeadForCompare(lead);
                                  if (onIncrementLeadViews) onIncrementLeadViews(lead.id);
                                }}
                                className={`transition-colors cursor-pointer select-none ${
                                  idx % 2 === 0
                                    ? 'bg-white hover:bg-slate-50/90'
                                    : 'bg-slate-50/40 hover:bg-slate-100/70'
                                }`}
                              >
                                {/* Cột 1: STT */}
                                <td className="py-2.5 px-1.5 text-center text-slate-400 font-mono text-[10.5px]">
                                  {idx + 1}
                                </td>

                                {/* Cột 2: Ngày Đăng & Hạn Nộp */}
                                <td className="py-2.5 px-2 whitespace-nowrap">
                                  <div className="space-y-0.5">
                                    <span className="text-slate-700 font-semibold block text-[10.5px]">
                                      {lead.createdDate || 'Aug 31, 2026'}
                                    </span>
                                    <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                                      Hạn: {lead.dueDate || '7 ngày'}
                                    </span>
                                  </div>
                                </td>

                                {/* Cột 3: Mã ID */}
                                <td className="py-2.5 px-2 whitespace-nowrap">
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
                                <td className="py-2.5 px-2 whitespace-nowrap">
                                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getServiceBadgeStyle(lead.serviceType)}`}>
                                    {lead.serviceType}
                                  </span>
                                </td>

                                {/* Cột 5: Nhóm Hàng */}
                                <td className="py-2.5 px-1.5 whitespace-nowrap">
                                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCargoBadgeStyle(lead.cargoClassification)}`}>
                                    {getCargoLabel(lead.cargoClassification)}
                                  </span>
                                </td>

                                {/* Cột 6: Mô Hình */}
                                <td className="py-2.5 px-1.5 whitespace-nowrap">
                                  <span className="text-slate-800 font-semibold text-xs">
                                    {operationMode}
                                  </span>
                                </td>

                                {/* Cột 7: Loại Hợp Đồng */}
                                <td className="py-2.5 px-1.5 whitespace-nowrap">
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
                                <td className="py-2.5 px-2 text-right whitespace-nowrap">
                                  {(() => {
                                    const pricing = getLeadOrInquiryPricing(lead);
                                    return (
                                      <div className="space-y-0.5">
                                        <span className="text-xs sm:text-[12.5px] font-black text-emerald-700 block tracking-tight">
                                          {pricing.formattedAmount}
                                        </span>
                                        <span className="text-[9.5px] font-semibold text-slate-500 block">
                                          {pricing.unitSuffix}
                                        </span>
                                      </div>
                                    );
                                  })()}
                                </td>

                                {/* Cột 9: Trạng Thái */}
                                <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadgeStyle(lead.status)}`}>
                                    {getStatusDisplay(lead.status)}
                                  </span>
                                </td>

                                {/* Cột 10: Thống Kê Báo Giá & Lượt Xem */}
                                <td className="py-2.5 px-1.5 text-center whitespace-nowrap">
                                  <div className="flex flex-col items-center gap-0.5">
                                    <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                                      {lead.quotesCount || 0} báo giá
                                    </span>
                                    <span className="text-[9px] text-slate-400 font-medium">
                                      {lead.viewsCount || 0} xem
                                    </span>
                                  </div>
                                </td>

                                {/* Cột 11: Thao Tác (Xem đầy đủ modal) */}
                                <td className="py-2.5 px-2 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    id={`toggle-customer-lead-btn-${lead.code}`}
                                    type="button"
                                    onClick={() => {
                                      // Trigger increment views locally & globally
                                      const idKey = lead.id;
                                      const codeKey = lead.code || lead.inquiryCode || '';
                                      
                                      setLocalExtraViews((prev) => ({
                                        ...prev,
                                        [idKey]: (prev[idKey] || 0) + 1,
                                        ...(codeKey ? { [codeKey]: (prev[codeKey] || 0) + 1 } : {}),
                                      }));

                                      if (onIncrementLeadViews) {
                                        onIncrementLeadViews(lead.id);
                                        if (lead.code && lead.code !== lead.id) onIncrementLeadViews(lead.code);
                                        if (lead.inquiryCode && lead.inquiryCode !== lead.id) onIncrementLeadViews(lead.inquiryCode);
                                      }
                                      if (onMarkInquiryAsViewed) {
                                        onMarkInquiryAsViewed(lead.code || lead.inquiryCode || lead.id);
                                      }

                                      // Update lead views in selected modal
                                      const updatedLead: SupplierLeadItem = {
                                        ...lead,
                                        viewsCount: (lead.viewsCount || 0) + 1,
                                        inquiry: lead.inquiry ? {
                                          ...lead.inquiry,
                                          viewsCount: (lead.inquiry.viewsCount || 0) + 1,
                                        } : undefined,
                                      };
                                      setSelectedLeadForCompare(updatedLead);
                                    }}
                                    className="px-2.5 py-1 text-xs font-bold rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs bg-orange-50 hover:bg-orange-100 text-orange-700 hover:text-orange-800 border border-orange-200/90 hover:border-orange-300 active:scale-95"
                                    title="Mở xem đầy đủ yêu cầu báo giá"
                                  >
                                    <Maximize2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                                    <span>Xem đầy đủ</span>
                                  </button>
                                </td>
                              </tr>
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
        </div>
      </div>

      {/* INQUIRY SUMMARY CONFIRM MODAL (TÓM TẮT YÊU CẦU BÁO GIÁ CHO SUPPLIER) */}
      {selectedLeadForCompare && (
        <InquirySummaryConfirmModal
          isOpen={Boolean(selectedLeadForCompare)}
          inquiry={selectedLeadForCompare.inquiry || null}
          lead={selectedLeadForCompare}
          currentUser={currentUser}
          isSupplierView={true}
          isUnlocked={Boolean(selectedLeadForCompare.isUnlocked)}
          onUnlock={() => {
            const success = handleUnlockInquiryWithDiscount(selectedLeadForCompare.id);
            if (success !== false) {
              setSelectedLeadForCompare((prev) => prev ? { ...prev, isUnlocked: true } : null);
            }
          }}
          isSaved={Boolean(selectedLeadForCompare.isSaved)}
          onSaveLead={() => {
            if (onToggleSaveLead) {
              onToggleSaveLead(selectedLeadForCompare.id);
            }
            setSelectedLeadForCompare((prev) => prev ? { ...prev, isSaved: !prev.isSaved } : null);
          }}
          onClose={() => setSelectedLeadForCompare(null)}
          onConfirm={() => {}}
          matchingSuppliersCount={selectedLeadForCompare.quotesCount || 0}
          quotations={quotations}
          onSubmitQuotation={(quote) => {
            if (onSubmitQuotation) {
              onSubmitQuotation(quote as any);
            }
            setSelectedLeadForCompare(null);
          }}
        />
      )}
    </div>
  );
};
