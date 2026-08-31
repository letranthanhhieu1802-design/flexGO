import React, { useState, useEffect, useMemo } from 'react';
import { 
  CurrentView, 
  UserPersona, 
  InquiryItem, 
  QuotationItem, 
  SupplierCompany, 
  SupplierLeadItem, 
  SupplierLeadSourceType,
  CRMCustomer, 
  OpportunityItem, 
  NotificationItem,
  PipelineStage,
  ContractItem,
  ContractStatus,
  FlexCreditWallet,
  CreditPackage,
  CreditTransaction,
  CustomerRateItem
} from './types';
import { 
  mockUserPersonas, 
  mockInquiries, 
  mockQuotations, 
  mockSuppliers, 
  mockSupplierLeads, 
  mockCRMCustomers, 
  mockOpportunities, 
  mockNotifications,
  mockContracts,
  mockFlexCreditWallet,
  mockCreditPackages,
  mockCreditTransactions
} from './data/mockData';
import { initialCustomerRates } from './data/mockRates';

// Layout Components
import { Header } from './components/layout/Header';
import { RoleSwitcherBanner } from './components/common/RoleSwitcherBanner';
import { CommandPalette } from './components/layout/CommandPalette';

// Public Pages
import { HomePage } from './components/public/HomePage';
import { LeadBoardPage } from './components/public/LeadBoardPage';
import { SupplierDirectoryPage } from './components/public/SupplierDirectoryPage';
import { HotPromotionPage } from './components/public/HotPromotionPage';
import { CompanyDirectoryPage } from './components/public/CompanyDirectoryPage';

// Customer Workspace Pages
import { InquiriesPage } from './components/customer/InquiriesPage';
import { InquiryDetailWorkspace } from './components/customer/InquiryDetailWorkspace';
import { CustomerQuotationsPage } from './components/customer/CustomerQuotationsPage';
import { CompareQuotesPage } from './components/customer/CompareQuotesPage';
import { MySuppliersPage } from './components/customer/MySuppliersPage';
import { CustomerRatesPage } from './components/customer/CustomerRatesPage';
import { CreateInquiryModal } from './components/customer/CreateInquiryModal';

// Supplier Workspace Pages
import { SupplierLeadsPage } from './components/supplier/SupplierLeadsPage';
import { SupplierQuotationsPage } from './components/supplier/SupplierQuotationsPage';
import { MiniCRMPage } from './components/supplier/MiniCRMPage';
import { CustomerDetailPage } from './components/supplier/CustomerDetailPage';
import { OpportunityKanbanPage } from './components/supplier/OpportunityKanbanPage';
import { CreateQuotationModal } from './components/supplier/CreateQuotationModal';
import { SupplierProfileEditPage } from './components/supplier/SupplierProfileEditPage';

// Contracts Page (Customer & Supplier)
import { ContractsPage } from './components/common/ContractsPage';

// FlexCredit Pages
import { FlexCreditWalletPage } from './components/flexcredit/FlexCreditWalletPage';
import { AddCreditPage } from './components/flexcredit/AddCreditPage';
import { TransactionHistoryPage } from './components/flexcredit/TransactionHistoryPage';

// Settings Pages
import { MyProfilePage } from './components/settings/MyProfilePage';
import { CompanyProfileSettingsPage } from './components/settings/CompanyProfileSettingsPage';

// Dual Hub Workspace
import { DualHubPage } from './components/workspace/DualHubPage';

export function App() {
  // Current Persona State
  const [currentUser, setCurrentUser] = useState<UserPersona>(mockUserPersonas[0]);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<CurrentView>({
    type: 'public',
    tab: 'home',
  });

  // Application Data States
  const [inquiries, setInquiries] = useState<InquiryItem[]>(mockInquiries);
  const [quotations, setQuotations] = useState<QuotationItem[]>(mockQuotations);
  const [suppliers, setSuppliers] = useState<SupplierCompany[]>(mockSuppliers);
  const [leads, setLeads] = useState<SupplierLeadItem[]>(mockSupplierLeads);
  const [crmCustomers, setCrmCustomers] = useState<CRMCustomer[]>(mockCRMCustomers);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(mockOpportunities);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  
  // Contracts & FlexCredit Data States
  const [contracts, setContracts] = useState<ContractItem[]>(mockContracts);
  const [wallet, setWallet] = useState<FlexCreditWallet>(mockFlexCreditWallet);
  const [creditPackages, setCreditPackages] = useState<CreditPackage[]>(mockCreditPackages);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>(mockCreditTransactions);

  // Customer Rate Card Master State
  const [customerRates, setCustomerRates] = useState<CustomerRateItem[]>(initialCustomerRates);
  const [benchmarkRateForInquiry, setBenchmarkRateForInquiry] = useState<any>(null);

  // Modal States
  const [isCreateInquiryOpen, setIsCreateInquiryOpen] = useState(false);
  const [isCreateQuotationOpen, setIsCreateQuotationOpen] = useState(false);
  const [activeQuotingLead, setActiveQuotingLead] = useState<SupplierLeadItem | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Selected Detail Views
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Deep-linking URL routing support (e.g. from shared RFQ link: ?tab=lead-board&leadCode=LG-12345 or ?inquiry=INQ-12345)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role');
      const tabParam = params.get('tab');
      const leadCodeParam = params.get('leadCode') || params.get('lead') || params.get('inquiry') || params.get('rfq') || params.get('code') || params.get('search');

      if (roleParam === 'supplier') {
        const supplierPersona = mockUserPersonas.find((p) => p.companyType === 'SUPPLIER');
        if (supplierPersona) {
          setCurrentUser(supplierPersona);
        }
      }

      if (leadCodeParam || tabParam === 'lead-board' || tabParam === 'leads') {
        if (tabParam === 'leads') {
          setCurrentView({
            type: 'workspace',
            view: 'supplier-leads',
            params: { leadCode: leadCodeParam || '', inquiryCode: leadCodeParam || '', searchTerm: leadCodeParam || '' },
          });
        } else {
          setCurrentView({
            type: 'public',
            tab: 'lead-board',
            params: { leadCode: leadCodeParam || '', inquiryCode: leadCodeParam || '', searchTerm: leadCodeParam || '' },
          });
        }
      }
    }
  }, []);

  // Derive My Leads & Opportunity Pipeline based on the 4 mandatory sources:
  // 1. Inquiries saved by supplier from Lead Board or Customer Inquiries (isSaved)
  // 2. Inquiries where supplier submitted quotation (Quoted / Won / Lost / quotesCount > 0)
  // 3. Inquiries unlocked using FlexCredit (isUnlocked)
  // 4. Inquiries received via Direct RFQ on Supplier Profile (isDirectRfq)
  const myLeadsOpportunities = useMemo<OpportunityItem[]>(() => {
    const myLeadItems = leads.filter((lead) => {
      const isSaved = Boolean(lead.isSaved);
      const isQuoted = lead.status === 'Quoted' || lead.status === 'Won' || lead.status === 'Lost' || Boolean(lead.quotesCount && lead.quotesCount > 0) || lead.source === 'QUOTED';
      const isUnlocked = Boolean(lead.isUnlocked) || lead.source === 'UNLOCKED';
      const isDirectRfq = Boolean(lead.isDirectRfq) || lead.source === 'DIRECT_RFQ';
      return isSaved || isQuoted || isUnlocked || isDirectRfq;
    });

    return myLeadItems.map((lead) => {
      // Determine primary source for the pipeline opportunity
      let source: SupplierLeadSourceType = 'SAVED';
      if (lead.isDirectRfq || lead.source === 'DIRECT_RFQ') {
        source = 'DIRECT_RFQ';
      } else if (lead.status === 'Quoted' || lead.status === 'Won' || lead.status === 'Lost' || (lead.quotesCount && lead.quotesCount > 0) || lead.source === 'QUOTED') {
        source = 'QUOTED';
      } else if (lead.isUnlocked || lead.source === 'UNLOCKED') {
        source = 'UNLOCKED';
      } else if (lead.isSaved) {
        source = 'SAVED';
      }

      // Check corresponding quotation if any
      const relatedQuote = quotations.find((q) => q.inquiryCode === lead.inquiryCode || q.inquiryCode === lead.code);
      const existingOpp = opportunities.find((o) => o.leadCode === lead.code || o.inquiryCode === lead.inquiryCode || o.code === `OPP-${lead.code.replace('FG-', '').replace('LG-', '')}`);

      const stage: PipelineStage = lead.status;

      let nextAction = 'Lập phương án & gửi báo giá';
      if (stage === 'Quoted') {
        nextAction = 'Theo dõi phản hồi & đàm phán cước';
      } else if (stage === 'Won') {
        nextAction = 'Đã trao thầu - Điều phối phương tiện vận tải';
      } else if (stage === 'Lost') {
        nextAction = 'Khảo sát nguyên nhân trượt thầu';
      } else if (stage === 'Closed') {
        nextAction = 'Đã hết hạn chào giá';
      }

      return {
        id: existingOpp?.id || `opp-${lead.id}`,
        code: existingOpp?.code || `OPP-${lead.code.replace('FG-', '').replace('LG-', '')}`,
        leadCode: lead.code,
        inquiryCode: lead.inquiryCode,
        title: existingOpp?.title || `${lead.customerCompany} - ${lead.route}`,
        customerCompany: lead.customerCompany,
        contactPerson: lead.contactName,
        serviceType: lead.serviceType,
        route: lead.route,
        estimatedValue: lead.estimatedValueVND,
        estimatedValueDisplay: lead.estimatedValueDisplay,
        currency: 'VND',
        stage: stage,
        owner: existingOpp?.owner || 'Minh Tran',
        source: source,
        expectedCloseDate: lead.dueDate || existingOpp?.expectedCloseDate || '2026-09-15',
        probability: stage === 'Won' ? 100 : stage === 'Lost' || stage === 'Closed' ? 0 : stage === 'Quoted' ? 75 : 50,
        notes: lead.sourceNotes || existingOpp?.notes || lead.cargoDetails || '',
        nextAction: existingOpp?.nextAction || nextAction,
        quotationCode: relatedQuote?.code || existingOpp?.quotationCode,
        lastUpdated: existingOpp?.lastUpdated || 'Gần đây',
      };
    });
  }, [leads, quotations, opportunities]);

  // Handlers
  const handlePersonaChange = (type: 'CUSTOMER' | 'SUPPLIER' | 'BOTH') => {
    const targetPersona = mockUserPersonas.find((p) => p.companyType === type);
    if (targetPersona) {
      setCurrentUser(targetPersona);
      // Auto redirect to relevant workspace view when switching for intuitive flow
      if (type === 'CUSTOMER') {
        setCurrentView({ type: 'workspace', view: 'customer-inquiries' });
      } else if (type === 'SUPPLIER') {
        setCurrentView({ type: 'workspace', view: 'supplier-leads' });
      } else {
        setCurrentView({ type: 'workspace', view: 'dual-hub' });
      }
    }
  };

  const handleCreateInquirySubmit = (newInquiry: InquiryItem) => {
    // Ensure customer company and contact person are populated
    const finalInquiry: InquiryItem = {
      ...newInquiry,
      customerCompany: newInquiry.customerCompany || currentUser.companyName || 'ABC Manufacturing Co., Ltd.',
      contactPerson: newInquiry.contactPerson || currentUser.name || 'Hieu Le',
      createdDate: newInquiry.createdDate || 'Hôm nay',
    };
    // Mã Lead và Mã Inquiry là 1
    const leadCode = finalInquiry.leadCode || finalInquiry.code;
    finalInquiry.leadCode = leadCode;
    setInquiries([finalInquiry, ...inquiries]);

    const parseCurrencyNumber = (val?: string): number => {
      if (!val) return 0;
      const num = parseInt(val.replace(/[^\d]/g, ''), 10);
      return isNaN(num) ? 0 : num;
    };

    const rawBudget = parseCurrencyNumber(finalInquiry.targetBudget) || 48000000;
    const rate = finalInquiry.exchangeRate || 25450;
    const budgetNum = (finalInquiry.currency && finalInquiry.currency !== 'VND' && rawBudget < 100000)
      ? rawBudget * rate
      : rawBudget;
    const isContract =
      (finalInquiry.title || '').toLowerCase().includes('contract') ||
      (finalInquiry.title || '').toLowerCase().includes('hợp đồng') ||
      (finalInquiry.targetBudget || '').toLowerCase().includes('tháng') ||
      (finalInquiry.targetBudget || '').toLowerCase().includes('năm') ||
      finalInquiry.serviceSpecs?.trucking?.pricingType === 'CONTRACT' ||
      finalInquiry.serviceSpecs?.ocean?.pricingType === 'CONTRACT';
    const estVal = isContract ? budgetNum * 12 : budgetNum;

    // Also create a lead on the board
    const newLead: SupplierLeadItem = {
      id: `lead-${Date.now()}`,
      code: leadCode,
      customerCompany: finalInquiry.customerCompany,
      contactName: finalInquiry.contactPerson,
      contactRole: 'Procurement Specialist',
      contactPhone: '0909 123 456',
      contactEmail: 'contact@enterprise.vn',
      serviceType: finalInquiry.serviceType,
      origin: finalInquiry.origin,
      destination: finalInquiry.destination,
      route: `${finalInquiry.origin} → ${finalInquiry.destination}`,
      pricingType: isContract ? 'CONTRACT' : 'SPOT',
      contractTerm: isContract ? 'Hợp đồng định kỳ 12 tháng' : 'Theo chuyến / Lô',
      volumeDisplay: finalInquiry.weightVolume || '1 Lô hàng FCL',
      unitPriceVND: budgetNum,
      unitPriceDisplay: finalInquiry.targetBudget || `${budgetNum.toLocaleString('vi-VN')} ₫ / lô`,
      estimatedValueVND: estVal,
      estimatedValueDisplay: finalInquiry.targetBudget || `${estVal.toLocaleString('vi-VN')} ₫`,
      createdDate: 'Hôm nay',
      dueDate: finalInquiry.deliveryDate || finalInquiry.expiryDate || '7 ngày tới',
      status: 'Open',
      inquiryCode: finalInquiry.code,
      cargoDetails: `${finalInquiry.cargoType} (${finalInquiry.weightVolume})`,
      urgency: 'High Value',
      matchScore: 98,
      quotesCount: 0,
      viewsCount: 1,
      isUnlocked: false,

      // Rich specifications payload
      inquiry: finalInquiry,
      serviceSpecs: finalInquiry.serviceSpecs,
      selectedVAS: finalInquiry.selectedVAS,
      requestedSurcharges: finalInquiry.requestedSurcharges,
      surchargesNotes: finalInquiry.surchargesNotes,
      quotationScope: finalInquiry.quotationScope,
      cargoClassification: finalInquiry.cargoClassification,
      temperatureRequirement: finalInquiry.temperatureRequirement,
      preservationRequirement: finalInquiry.preservationRequirement,
      dgClassIMO: finalInquiry.dgClassIMO,
      unNumber: finalInquiry.unNumber,
      packingGroup: finalInquiry.packingGroup,
      flashPoint: finalInquiry.flashPoint,
      packaging: finalInquiry.packaging,
      attachments: finalInquiry.attachments,
      specialRequirements: finalInquiry.specialRequirements,
      description: finalInquiry.description,
      incoterms: finalInquiry.incoterms,
      tradeRole: finalInquiry.tradeRole,
      industry: finalInquiry.industry,
      cargoValue: finalInquiry.cargoValue,
      cargoValueCurrency: finalInquiry.cargoValueCurrency,
    };
    setLeads([newLead, ...leads]);

    // Update CRM Customer statistics & activity timeline if matching
    setCrmCustomers((prev) =>
      prev.map((c) => {
        const normC = c.companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normInq = finalInquiry.customerCompany.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normC.includes(normInq) || normInq.includes(normC) || c.contactPerson === finalInquiry.contactPerson) {
          const newAct: any = {
            id: `act-${Date.now()}`,
            type: 'deal',
            title: `Inquiry mới phát hành: ${finalInquiry.code}`,
            description: `${finalInquiry.title} (${finalInquiry.serviceType} - ${finalInquiry.route})`,
            actor: finalInquiry.contactPerson || 'Khách hàng',
            timestamp: new Date().toISOString(),
            timeDisplay: 'Vừa xong',
          };
          return {
            ...c,
            openOpportunitiesCount: (c.openOpportunitiesCount || 0) + 1,
            activities: [newAct, ...(c.activities || [])],
          };
        }
        return c;
      })
    );

    // Open detail workspace for the new inquiry
    setCurrentView({
      type: 'workspace',
      view: 'customer-inquiry-detail',
      params: { inquiryCode: finalInquiry.code },
    });
  };

  const handleCreateQuotationSubmit = (quoteData: Partial<QuotationItem>) => {
    const newQuote: QuotationItem = {
      id: `quote-${Date.now()}`,
      code: quoteData.code || `QUO-${Math.floor(10000 + Math.random() * 90000)}`,
      inquiryCode: quoteData.inquiryCode || 'FG-2608250001',
      inquiryTitle: quoteData.inquiryTitle || 'HCMC → Hanoi Trucking Service',
      customerCompany: quoteData.customerCompany || 'ABC Manufacturing Co., Ltd.',
      supplierId: currentUser.id,
      supplierName: currentUser.companyName,
      supplierRating: 4.9,
      serviceType: quoteData.serviceType || 'Trucking',
      route: quoteData.route || 'HCMC → Hanoi',
      currency: quoteData.currency || 'VND',
      baseFreight: quoteData.baseFreight || 42000000,
      fuelSurcharge: quoteData.fuelSurcharge || 3800000,
      handlingFee: quoteData.handlingFee || 1200000,
      documentationFee: quoteData.documentationFee || 500000,
      otherCharges: quoteData.otherCharges || 500000,
      otherChargesNote: quoteData.otherChargesNote || 'GPS Telematics',
      totalPrice: quoteData.totalPrice || 48000000,
      transitTimeDays: quoteData.transitTimeDays || 2,
      transitTimeDisplay: quoteData.transitTimeDisplay || '2 Days (48 Hours)',
      paymentTerms: quoteData.paymentTerms || 'Net 45 Days',
      validUntil: quoteData.validUntil || '2026-09-15',
      status: 'Sent',
      notes: quoteData.notes || 'Euro-5 Fleet with live temperature loggers',
      createdAt: 'Just now',
    };

    setQuotations([newQuote, ...quotations]);

    // Update corresponding Inquiry status to Quoted if it was Open, and increment quote count
    setInquiries((prevInquiries) =>
      prevInquiries.map((inq) => {
        if (inq.code === newQuote.inquiryCode) {
          const nextStatus = inq.status === 'Open' ? 'Quoted' : inq.status;
          return {
            ...inq,
            status: nextStatus,
            responsesCount: (inq.responsesCount || 0) + 1,
            viewsCount: (inq.viewsCount || 0) + 1,
          };
        }
        return inq;
      })
    );

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Quotation Submitted',
      message: `Quotation ${newQuote.code} sent to ${newQuote.customerCompany}`,
      timestamp: 'Just now',
      read: false,
      type: 'quotation',
    };
    setNotifications([newNotif, ...notifications]);

    // Update lead status to 'Quoted'
    if (activeQuotingLead) {
      setLeads((prevLeads) =>
        prevLeads.map((l) =>
          l.id === activeQuotingLead.id || l.inquiryCode === newQuote.inquiryCode
            ? { ...l, status: 'Quoted', quotesCount: (l.quotesCount || 0) + 1 }
            : l
        )
      );
      setActiveQuotingLead(null);
    } else if (newQuote.inquiryCode) {
      setLeads((prevLeads) =>
        prevLeads.map((l) =>
          l.inquiryCode === newQuote.inquiryCode
            ? { ...l, status: 'Quoted', quotesCount: (l.quotesCount || 0) + 1 }
            : l
        )
      );
    }
  };

  const handleAwardQuote = (quoteId: string, customInquiryCode?: string) => {
    let targetInquiryCode = customInquiryCode;
    let targetSupplierName = 'Supplier';
    let targetQuoteCode = quoteId;

    setQuotations((prevQuotes) =>
      prevQuotes.map((q) => (q.id === quoteId ? { ...q, status: 'Accepted' } : q))
    );

    // Find quotation to award its inquiry
    const quote = quotations.find((q) => q.id === quoteId);
    if (quote) {
      targetInquiryCode = quote.inquiryCode;
      targetSupplierName = quote.supplierName;
      targetQuoteCode = quote.code;
    }

    if (targetInquiryCode) {
      setInquiries((prevInquiries) =>
        prevInquiries.map((i) =>
          i.code === targetInquiryCode ? { ...i, status: 'Awarded' } : i
        )
      );

      // Update lead status to Won / Lost
      const isAwardedToCurrentUser = quote
        ? quote.supplierId === currentUser.id || quote.supplierName === currentUser.companyName
        : true;

      setLeads((prevLeads) =>
        prevLeads.map((l) => {
          if (l.inquiryCode === targetInquiryCode || l.code === targetInquiryCode) {
            return {
              ...l,
              status: isAwardedToCurrentUser ? 'Won' : 'Lost',
            };
          }
          return l;
        })
      );

      // Auto-sync into Customer Rate Card
      if (quote) {
        const matchedInquiry = inquiries.find((i) => i.code === targetInquiryCode);
        const newRateCode = `RATE-${(matchedInquiry?.serviceType || 'TRK').substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const autoSyncedRate: CustomerRateItem = {
          id: `rate-awarded-${Date.now()}`,
          code: newRateCode,
          serviceType: matchedInquiry?.serviceType || 'Trucking',
          title: matchedInquiry?.title || `Biểu giá trao thầu: ${matchedInquiry?.origin} → ${matchedInquiry?.destination}`,
          origin: matchedInquiry?.origin || 'Điểm đi',
          destination: matchedInquiry?.destination || 'Điểm đến',
          routeDisplay: `${(matchedInquiry?.origin || '').split(',')[0]} → ${(matchedInquiry?.destination || '').split(',')[0]}`,
          cargoType: matchedInquiry?.cargoType || 'Hàng hóa tổng hợp',
          equipmentOrVehicleType: matchedInquiry?.truckingSpecs?.truckType || matchedInquiry?.oceanSpecs?.containerType || 'Theo thỏa thuận thầu',
          loadType: matchedInquiry?.truckingSpecs?.loadType || matchedInquiry?.oceanSpecs?.mode || 'FTL',
          baseRateAmount: quote.totalPriceVND || quote.baseFreightPriceVND || 25000000,
          baseRateCurrency: 'VND',
          pricingUnit: 'VND / Chuyến',
          rateDisplay: quote.totalPriceDisplay || `${(quote.totalPriceVND || 0).toLocaleString('vi-VN')} ₫ / Chuyến`,
          allInclusive: quote.allInclusive ?? true,
          vatPercent: quote.vatPercent ?? 8,
          surcharges: quote.surcharges?.map((s) => ({
            id: s.id,
            name: s.name,
            amount: s.amount,
            currency: 'VND',
            unit: 'Chuyến',
            includedInBaseRate: s.includedInBaseFreight ?? false,
            isMandatory: s.mandatory ?? false,
          })),
          truckingSpecs: matchedInquiry?.truckingSpecs,
          oceanSpecs: matchedInquiry?.oceanSpecs,
          airSpecs: matchedInquiry?.airSpecs,
          coldChainSpecs: matchedInquiry?.coldChainSpecs,
          warehousingSpecs: matchedInquiry?.warehousingSpecs,
          customsSpecs: matchedInquiry?.customsSpecs,
          crossBorderSpecs: matchedInquiry?.crossBorderSpecs,
          supplierId: quote.supplierId,
          supplierName: quote.supplierName,
          supplierTaxId: quote.supplierTaxId,
          supplierContact: quote.supplierContactPerson,
          supplierPhone: quote.supplierPhone,
          supplierEmail: quote.supplierEmail,
          contractCode: `HD-${new Date().getFullYear()}/${quote.code}`,
          sourceType: 'AWARDED_INQUIRY',
          linkedInquiryCode: targetInquiryCode,
          linkedQuoteId: quote.id,
          paymentTerms: quote.paymentTerms || 'Net 30 ngày kể từ ngày nhận đủ POD',
          transitTime: quote.transitTime || '48 giờ',
          validFrom: new Date().toISOString().split('T')[0],
          validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'Active',
          notes: `Đồng bộ tự động từ gói thầu ${targetInquiryCode} trao cho ${quote.supplierName}.`,
          createdDate: new Date().toISOString().split('T')[0],
          updatedDate: new Date().toISOString().split('T')[0],
          documentCount: 1,
        };
        setCustomerRates((prev) => [autoSyncedRate, ...prev]);

        // Auto-sync / upgrade into Supplier CRM Customers as AWARDED_QUOTE
        setCrmCustomers((prev) => {
          const custName = quote.customerCompany || matchedInquiry?.customerCompany || 'ABC Manufacturing Co., Ltd.';
          const existing = prev.find((c) => c.companyName.toLowerCase() === custName.toLowerCase());
          
          if (existing) {
            return prev.map((c) => c.id === existing.id ? {
              ...c,
              source: 'AWARDED_QUOTE' as const,
              sourceDetails: {
                sourceType: 'AWARDED_QUOTE' as const,
                sourceLabel: 'Khách hàng Trao thầu Báo giá (Awarded)',
                inquiryCode: targetInquiryCode,
                quoteCode: targetQuoteCode,
                contractCode: `HD-${new Date().getFullYear()}/${targetQuoteCode}`,
                unlockedDate: 'Hôm nay',
                isCreditExempt: true,
                notes: `Khách hàng chấp thuận trao thầu gói ${targetInquiryCode} cho báo giá ${targetQuoteCode}. Tự động nâng cấp tài khoản doanh nghiệp chính thức.`
              },
              status: 'Active' as const,
              totalRevenueVND: (c.totalRevenueVND || 0) + (quote.totalPriceVND || 0),
              totalRevenueDisplay: `${((c.totalRevenueVND || 0) + (quote.totalPriceVND || 0)).toLocaleString('vi-VN')} VND`,
              lastActivity: `Khách hàng đã trao thầu báo giá ${targetQuoteCode}`
            } : c);
          } else {
            const newCust: CRMCustomer = {
              id: `crm-${Date.now()}`,
              companyName: custName,
              industry: 'Manufacturing & Commercial Trade',
              location: `${matchedInquiry?.origin || 'Hồ Chí Minh'} - ${matchedInquiry?.destination || 'Hà Nội'}`,
              contactPerson: matchedInquiry?.contactPerson || 'Đại diện Doanh Nghiệp',
              contactRole: 'Procurement Director',
              contactEmail: 'contact@enterprise.vn',
              contactPhone: '+84 (0) 909 123 456',
              source: 'AWARDED_QUOTE',
              sourceDetails: {
                sourceType: 'AWARDED_QUOTE',
                sourceLabel: 'Khách hàng Trao thầu Báo giá (Awarded)',
                inquiryCode: targetInquiryCode,
                quoteCode: targetQuoteCode,
                contractCode: `HD-${new Date().getFullYear()}/${targetQuoteCode}`,
                unlockedDate: 'Hôm nay',
                isCreditExempt: true,
                notes: `Khách hàng trao thầu chính thức cho báo giá ${targetQuoteCode} (Gói thầu ${targetInquiryCode}).`
              },
              openOpportunitiesCount: 1,
              totalRevenueVND: quote.totalPriceVND || 48000000,
              totalRevenueDisplay: `${(quote.totalPriceVND || 48000000).toLocaleString('vi-VN')} VND`,
              lastActivity: `Trao thầu chính thức gói thầu ${targetInquiryCode}`,
              status: 'Active',
              notes: `Hợp đồng dịch vụ logistics đã ký kết từ báo giá ${targetQuoteCode}.`,
              address: matchedInquiry?.origin || 'TP. Hồ Chí Minh',
              annualVolumeEst: '120 Chuyến / Năm',
              createdDate: new Date().toISOString().split('T')[0]
            };
            return [newCust, ...prev];
          }
        });
      }

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Quotation Awarded!',
        message: `Đã trao thầu báo giá ${targetQuoteCode} từ ${targetSupplierName} và tự động đồng bộ vào My Rates!`,
        timestamp: 'Just now',
        read: false,
        type: 'deal',
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const handleSaveCustomerRate = (rate: CustomerRateItem) => {
    setCustomerRates((prev) => {
      const exists = prev.some((r) => r.id === rate.id);
      if (exists) {
        return prev.map((r) => (r.id === rate.id ? rate : r));
      }
      return [rate, ...prev];
    });

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Đã lưu biểu giá',
      message: `Biểu giá ${rate.code} (${rate.title}) đã được lưu thành công vào Rate Master.`,
      timestamp: 'Vừa xong',
      read: false,
      type: 'deal',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleDeleteCustomerRate = (rateId: string) => {
    setCustomerRates((prev) => prev.filter((r) => r.id !== rateId));
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Đã xóa biểu giá',
      message: 'Biểu giá đã được gỡ khỏi danh sách quản lý của doanh nghiệp.',
      timestamp: 'Vừa xong',
      read: false,
      type: 'deal',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleOpenCreateInquiryWithBenchmark = (rate: CustomerRateItem) => {
    setBenchmarkRateForInquiry(rate);
    setIsCreateInquiryOpen(true);
  };

  const handleMovePipelineStage = (oppId: string, newStage: PipelineStage) => {
    setOpportunities(
      opportunities.map((o) => (o.id === oppId ? { ...o, stage: newStage } : o))
    );
  };

  const handleOpenQuotingForLead = (lead: SupplierLeadItem) => {
    setActiveQuotingLead(lead);
    setIsCreateQuotationOpen(true);
  };

  const handleContractStatusUpdate = (contractId: string, newStatus: ContractStatus) => {
    setContracts(
      contracts.map((c) => (c.id === contractId ? { ...c, status: newStatus } : c))
    );
    const updated = contracts.find((c) => c.id === contractId);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Contract Status Updated',
      message: `Contract ${updated?.code || contractId} is now ${newStatus}`,
      timestamp: 'Just now',
      read: false,
      type: 'deal',
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleAddCreditSuccess = (
    addedCredits: number, 
    priceVND: number, 
    packageName: string, 
    newTx: CreditTransaction
  ) => {
    setWallet((prev) => ({
      ...prev,
      balanceCredits: prev.balanceCredits + addedCredits,
      balanceVND: prev.balanceVND + addedCredits * 1000,
    }));
    setCreditTransactions([newTx, ...creditTransactions]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'FlexCredit Added!',
      message: `Successfully topped up ${addedCredits.toLocaleString()} Credits`,
      timestamp: 'Just now',
      read: false,
      type: 'deal',
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleDeductCredit = (amount: number, description: string): boolean => {
    if (wallet.balanceCredits < amount) {
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Số dư FlexCredit không đủ',
        message: `Bạn cần ${amount} Credits để mở khóa, số dư hiện tại là ${wallet.balanceCredits} Credits. Vui lòng nạp thêm.`,
        timestamp: 'Vừa xong',
        read: false,
        type: 'deal',
      };
      setNotifications([notif, ...notifications]);
      return false;
    }

    const now = new Date();
    const newTx: CreditTransaction = {
      id: `tx-${Date.now()}`,
      txCode: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'LEAD_UNLOCK',
      title: 'Mở khóa Lead & Báo giá Thị trường',
      description,
      creditsChange: -amount,
      amountVND: amount * 1000,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      status: 'Completed',
      referenceCode: `FC-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setWallet((prev) => ({
      ...prev,
      balanceCredits: prev.balanceCredits - amount,
      balanceVND: Math.max(0, prev.balanceVND - amount * 1000),
    }));
    setCreditTransactions((prev) => [newTx, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Mở khóa thành công!',
      message: `Đã trừ ${amount} FlexCredit cho: ${description}`,
      timestamp: 'Vừa xong',
      read: false,
      type: 'deal',
    };
    setNotifications((prev) => [notif, ...prev]);
    return true;
  };

  const handleUnlockLead = (leadId: string, creditCost: number = 50): boolean => {
    const targetLead = leads.find((l) => l.id === leadId);
    const leadTitle = targetLead ? `${targetLead.code} - ${targetLead.customerCompany}` : leadId;
    const success = handleDeductCredit(creditCost, `Mở khóa SĐT & Ma trận Báo giá (${leadTitle})`);
    if (success) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, isUnlocked: true } : l))
      );

      // Auto-sync or update in Supplier Mini CRM with FLEXCREDIT_UNLOCKED source
      if (targetLead) {
        setCrmCustomers((prev) => {
          const existing = prev.find(
            (c) => c.companyName.toLowerCase() === targetLead.customerCompany.toLowerCase()
          );
          if (existing) {
            return prev.map((c) =>
              c.id === existing.id
                ? {
                    ...c,
                    source: 'FLEXCREDIT_UNLOCKED' as const,
                    sourceDetails: {
                      sourceType: 'FLEXCREDIT_UNLOCKED' as const,
                      sourceLabel: 'Mở khóa Lead Board bằng FlexCredit',
                      leadCode: targetLead.code,
                      inquiryCode: targetLead.inquiryCode,
                      unlockedCostCredits: creditCost,
                      unlockedDate: 'Hôm nay',
                      isCreditExempt: false,
                      notes: `Đã sử dụng ${creditCost} FlexCredit để mở khóa thông tin chủ hàng từ Lead ${targetLead.code}.`,
                    },
                    lastActivity: `Mở khóa thông tin liên hệ từ Lead Board (${targetLead.code})`,
                  }
                : c
            );
          } else {
            const newCrmCust: CRMCustomer = {
              id: `crm-${Date.now()}`,
              companyName: targetLead.customerCompany,
              industry: 'Manufacturing & Commercial Trade',
              location: `${targetLead.origin} - ${targetLead.destination}`,
              contactPerson: targetLead.contactName || 'Người phụ trách Logistics',
              contactRole: targetLead.contactRole || 'Procurement Specialist',
              contactEmail: targetLead.contactEmail || 'contact@shipper.vn',
              contactPhone: targetLead.contactPhone || '0909 123 456',
              source: 'FLEXCREDIT_UNLOCKED',
              sourceDetails: {
                sourceType: 'FLEXCREDIT_UNLOCKED',
                sourceLabel: 'Mở khóa Lead Board bằng FlexCredit',
                leadCode: targetLead.code,
                inquiryCode: targetLead.inquiryCode,
                unlockedCostCredits: creditCost,
                unlockedDate: 'Hôm nay',
                isCreditExempt: false,
                notes: `Đã mở khóa SĐT và thông tin nhu cầu từ Lead ${targetLead.code} bằng ${creditCost} FlexCredit.`,
              },
              openOpportunitiesCount: 1,
              totalRevenueVND: 0,
              totalRevenueDisplay: '0 VND',
              lastActivity: `Mở khóa thông tin từ sàn Lead Board (${targetLead.code})`,
              status: 'Prospect',
              notes: `Nhu cầu tuyến ${targetLead.route}, khối lượng ${targetLead.volumeDisplay}.`,
              address: targetLead.origin,
              annualVolumeEst: 'Đang khảo sát',
              createdDate: new Date().toISOString().split('T')[0],
            };
            return [newCrmCust, ...prev];
          }
        });
      }

      return true;
    }
    return false;
  };

  const handleToggleSaveLead = (leadId: string) => {
    setLeads((prevLeads) =>
      prevLeads.map((l) => {
        if (l.id === leadId) {
          const nextSaved = !l.isSaved;
          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: nextSaved ? 'Đã lưu Lead vào My Leads' : 'Đã bỏ lưu Lead',
            message: nextSaved
              ? `Lead ${l.code} (${l.route}) đã được lưu để cân nhắc báo giá và theo dõi.`
              : `Lead ${l.code} đã được gỡ khỏi danh sách lưu.`,
            timestamp: 'Vừa xong',
            read: false,
            type: 'lead',
            linkTo: { type: 'workspace', view: 'supplier-leads' },
          };
          setNotifications((prev) => [notif, ...prev]);
          return { ...l, isSaved: nextSaved, savedAt: nextSaved ? 'Hôm nay' : undefined };
        }
        return l;
      })
    );
  };

  const handleIncrementLeadViews = (leadId: string) => {
    setLeads((prevLeads) =>
      prevLeads.map((l) => {
        if (l.id === leadId) {
          return { ...l, viewsCount: (l.viewsCount || 0) + 1 };
        }
        return l;
      })
    );
  };

  const handleSaveSupplier = (newSupplier: SupplierCompany) => {
    setSuppliers((prev) => [newSupplier, ...prev]);
  };

  // Render Page Content based on currentView
  const renderContent = () => {
    if (currentView.type === 'public') {
      switch (currentView.tab) {
        case 'home':
          return (
            <HomePage
              currentUser={currentUser}
              onNavigate={setCurrentView}
              onOpenCreateInquiry={() => setIsCreateInquiryOpen(true)}
            />
          );
        case 'lead-board':
          return (
            <LeadBoardPage
              leads={leads}
              currentUser={currentUser}
              quotations={quotations}
              wallet={wallet}
              initialSearchTerm={currentView.type === 'public' && currentView.tab === 'lead-board' ? (currentView.params?.leadCode || currentView.params?.inquiryCode || currentView.params?.searchTerm) : undefined}
              onOpenCreateQuotation={handleOpenQuotingForLead}
              onOpenCreateInquiry={() => setIsCreateInquiryOpen(true)}
              onNavigate={setCurrentView}
              onDeductCredit={handleDeductCredit}
              onUnlockLead={handleUnlockLead}
              onSubmitQuotation={handleCreateQuotationSubmit}
              onToggleSaveLead={handleToggleSaveLead}
              onIncrementLeadViews={handleIncrementLeadViews}
            />
          );
        case 'supplier-profile':
          return (
            <SupplierDirectoryPage
              suppliers={suppliers}
              initialSpecialistId={currentView.params?.specialistId}
              initialViewState={
                currentView.params?.viewState ||
                (currentView.params?.specialistId ? 'detail' : 'directory')
              }
              fromView={currentView.params?.from}
              onOpenCreateInquiry={() => setIsCreateInquiryOpen(true)}
              onNavigate={setCurrentView}
            />
          );
        case 'hot-promotion':
          return (
            <HotPromotionPage
              currentUser={currentUser}
              onNavigate={setCurrentView}
              onOpenCreateInquiry={() => setIsCreateInquiryOpen(true)}
            />
          );
        case 'company':
          return (
            <CompanyDirectoryPage
              onNavigate={setCurrentView}
              initialSubTab={currentView.params?.subTab}
            />
          );
        default:
          return (
            <HomePage
              currentUser={currentUser}
              onNavigate={setCurrentView}
              onOpenCreateInquiry={() => setIsCreateInquiryOpen(true)}
            />
          );
      }
    }

    if (currentView.type === 'workspace') {
      switch (currentView.view) {
        // ==========================================
        // 1. CUSTOMER WORKSPACE
        // ==========================================
        case 'customer-inquiries':
          return (
            <InquiriesPage
              inquiries={inquiries}
              leads={leads}
              quotations={quotations}
              suppliers={suppliers}
              initialSupplierFilter={currentView.params?.supplierId || currentView.params?.supplierName}
              initialSupplierName={currentView.params?.supplierName}
              onSelectInquiry={(inq) => {
                const code = typeof inq === 'string' ? inq : inq.code;
                setCurrentView({
                  type: 'workspace',
                  view: 'customer-inquiry-detail',
                  params: { inquiryCode: code },
                });
              }}
              onOpenCreateModal={() => setIsCreateInquiryOpen(true)}
              onNavigate={setCurrentView}
            />
          );

        case 'customer-inquiry-detail': {
          const inqCode = currentView.params?.inquiryCode || 'FG-2608250001';
          const inq = inquiries.find((i) => i.code === inqCode) || inquiries[0];
          return (
            <InquiryDetailWorkspace
              inquiry={inq}
              quotations={quotations}
              suppliers={suppliers}
              onBack={() =>
                setCurrentView({ type: 'workspace', view: 'customer-inquiries' })
              }
              onNavigate={setCurrentView}
              onAwardQuote={handleAwardQuote}
            />
          );
        }

        case 'customer-quotations':
          return (
            <CustomerQuotationsPage
              quotations={quotations}
              onNavigate={setCurrentView}
              onAwardQuote={handleAwardQuote}
            />
          );

        case 'customer-compare':
          return (
            <CompareQuotesPage
              inquiries={inquiries}
              quotations={quotations}
              initialInquiryCode={currentView.params?.inquiryCode}
              onNavigate={setCurrentView}
              onAwardQuote={handleAwardQuote}
            />
          );

        case 'customer-suppliers':
          return (
            <MySuppliersPage
              suppliers={suppliers}
              onNavigate={setCurrentView}
              onOpenCreateInquiry={(supplierId) => {
                setIsCreateInquiryOpen(true);
              }}
              onAddSupplier={handleSaveSupplier}
            />
          );

        case 'customer-rates':
          return (
            <CustomerRatesPage
              rates={customerRates}
              suppliers={suppliers}
              inquiries={inquiries}
              onSaveRate={handleSaveCustomerRate}
              onDeleteRate={handleDeleteCustomerRate}
              onNavigate={setCurrentView}
              onOpenCreateInquiryWithBenchmark={handleOpenCreateInquiryWithBenchmark}
            />
          );

        case 'customer-contracts':
          return (
            <ContractsPage
              contracts={contracts}
              currentUser={currentUser}
              mode="CUSTOMER"
              onNavigate={setCurrentView}
              onUpdateContractStatus={handleContractStatusUpdate}
            />
          );

        // ==========================================
        // 2. SUPPLIER WORKSPACE
        // ==========================================
        case 'supplier-leads':
          return (
            <SupplierLeadsPage
              leads={leads}
              currentUser={currentUser}
              quotations={quotations}
              wallet={wallet}
              onOpenCreateQuotation={handleOpenQuotingForLead}
              onNavigate={setCurrentView}
              onToggleSaveLead={handleToggleSaveLead}
              onUnlockLead={handleUnlockLead}
              onDeductCredit={handleDeductCredit}
              onSubmitQuotation={handleCreateQuotationSubmit}
              onIncrementLeadViews={handleIncrementLeadViews}
            />
          );

        case 'supplier-quotations':
          return (
            <SupplierQuotationsPage
              quotations={quotations}
              onOpenCreateModal={() => setIsCreateQuotationOpen(true)}
              onNavigate={setCurrentView}
            />
          );

        case 'supplier-crm':
        case 'supplier-crm-customers':
        case 'supplier-crm-customer-detail': {
          const effectiveCustomerId =
            currentView.params?.customerId ||
            currentView.contextId ||
            selectedCustomerId;

          if (effectiveCustomerId) {
            const cust =
              crmCustomers.find((c) => c.id === effectiveCustomerId) ||
              crmCustomers[0];
            return (
              <CustomerDetailPage
                customer={cust}
                leads={leads}
                inquiries={inquiries}
                quotations={quotations}
                currentUser={currentUser}
                wallet={wallet}
                onBack={() => {
                  setSelectedCustomerId(null);
                  setCurrentView({ type: 'workspace', view: 'supplier-crm' });
                }}
                onOpenCreateQuotation={(leadOrCust) => {
                  if (leadOrCust && 'serviceType' in leadOrCust) {
                    setActiveQuotingLead(leadOrCust);
                  }
                  setIsCreateQuotationOpen(true);
                }}
                onNavigate={setCurrentView}
                onUnlockLead={handleUnlockLead}
                onToggleSaveLead={handleToggleSaveLead}
                onSubmitQuotation={handleCreateQuotationSubmit}
              />
            );
          }
          return (
            <MiniCRMPage
              customers={crmCustomers}
              onSelectCustomer={(id) => {
                setSelectedCustomerId(id);
                setCurrentView({
                  type: 'workspace',
                  view: 'supplier-crm',
                  params: { customerId: id },
                });
              }}
              onNavigate={setCurrentView}
            />
          );
        }

        case 'supplier-pipeline':
          return (
            <OpportunityKanbanPage
              opportunities={myLeadsOpportunities}
              onSelectOpportunity={(opp) => {
                const matchedCust = crmCustomers.find(
                  (c) => c.companyName === opp.customerCompany
                );
                if (matchedCust) {
                  setSelectedCustomerId(matchedCust.id);
                  setCurrentView({ type: 'workspace', view: 'supplier-crm' });
                }
              }}
              onOpenCreateQuotation={() => setIsCreateQuotationOpen(true)}
              onNavigate={setCurrentView}
              onMoveStage={handleMovePipelineStage}
            />
          );

        case 'supplier-contracts':
          return (
            <ContractsPage
              contracts={contracts}
              currentUser={currentUser}
              mode="SUPPLIER"
              onNavigate={setCurrentView}
              onUpdateContractStatus={handleContractStatusUpdate}
            />
          );

        case 'supplier-profile-edit':
          return (
            <SupplierProfileEditPage
              onNavigate={setCurrentView}
            />
          );

        // ==========================================
        // 3. FLEXCREDIT WORKSPACE
        // ==========================================
        case 'flexcredit-wallet':
          return (
            <FlexCreditWalletPage
              wallet={wallet}
              transactions={creditTransactions}
              currentUser={currentUser}
              onNavigate={setCurrentView}
            />
          );

        case 'flexcredit-add':
          return (
            <AddCreditPage
              wallet={wallet}
              packages={creditPackages}
              currentUser={currentUser}
              onNavigate={setCurrentView}
              onAddCreditSuccess={handleAddCreditSuccess}
            />
          );

        case 'flexcredit-transactions':
          return (
            <TransactionHistoryPage
              transactions={creditTransactions}
              currentUser={currentUser}
              onNavigate={setCurrentView}
            />
          );

        // ==========================================
        // 4. SETTINGS WORKSPACE
        // ==========================================
        case 'settings-profile':
          return (
            <MyProfilePage
              currentUser={currentUser}
              onNavigate={setCurrentView}
              onUpdateProfile={(updated) => {
                setCurrentUser((prev) => ({ ...prev, ...updated }));
              }}
            />
          );

        case 'settings-company':
          return (
            <CompanyProfileSettingsPage
              currentUser={currentUser}
              onNavigate={setCurrentView}
            />
          );

        // ==========================================
        // DUAL HUB / 4PL
        // ==========================================
        case 'dual-hub':
          return (
            <DualHubPage
              currentUser={currentUser}
              inquiries={inquiries}
              quotations={quotations}
              leads={leads}
              onNavigate={setCurrentView}
              onOpenCreateInquiry={() => setIsCreateInquiryOpen(true)}
              onOpenCreateQuotation={() => setIsCreateQuotationOpen(true)}
            />
          );

        default:
          return (
            <InquiriesPage
              inquiries={inquiries}
              leads={leads}
              onSelectInquiry={(inq) => {
                const code = typeof inq === 'string' ? inq : inq.code;
                setCurrentView({
                  type: 'workspace',
                  view: 'customer-inquiry-detail',
                  params: { inquiryCode: code },
                });
              }}
              onOpenCreateModal={() => setIsCreateInquiryOpen(true)}
              onNavigate={setCurrentView}
            />
          );
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Persona Role Switcher Banner */}
      <RoleSwitcherBanner
        currentType={currentUser.companyType}
        onSwitchRole={handlePersonaChange}
      />

      {/* 2. Unified Navigation Header with FDD Menu Hierarchy */}
      <Header
        currentUser={currentUser}
        currentView={currentView}
        notifications={notifications}
        onNavigate={setCurrentView}
        onOpenCreateInquiry={() => setIsCreateInquiryOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onSwitchCompanyType={handlePersonaChange}
      />

      {/* 3. Main Workspace / Public Page Content */}
      <main className="flex-1 pb-16">{renderContent()}</main>

      {/* 4. Global Modals */}
      {/* Create Inquiry Modal */}
      <CreateInquiryModal
        isOpen={isCreateInquiryOpen}
        currentUser={currentUser}
        initialBenchmarkRate={benchmarkRateForInquiry}
        onClose={() => {
          setIsCreateInquiryOpen(false);
          setBenchmarkRateForInquiry(null);
        }}
        onSubmit={handleCreateInquirySubmit}
      />

      {/* Create Quotation Modal */}
      <CreateQuotationModal
        isOpen={isCreateQuotationOpen}
        onClose={() => {
          setIsCreateQuotationOpen(false);
          setActiveQuotingLead(null);
        }}
        onSubmit={handleCreateQuotationSubmit}
        presetInquiryCode={activeQuotingLead?.code || 'FG-2608250001'}
        presetInquiryTitle={
          activeQuotingLead
            ? `${activeQuotingLead.route} (${activeQuotingLead.serviceType})`
            : 'HCMC → Hanoi Trucking Service (FTL 15-Ton)'
        }
        presetCustomerCompany={
          activeQuotingLead?.customerCompany || 'ABC Manufacturing Co., Ltd.'
        }
        presetRoute={activeQuotingLead?.route || 'HCMC → Hanoi (1,720 km via QL1A)'}
        presetServiceType={activeQuotingLead?.serviceType || 'Trucking'}
        presetTargetUnitPrice={activeQuotingLead?.unitPriceVND}
        presetTargetUnitDisplay={activeQuotingLead?.unitPriceDisplay}
        presetEstimatedValue={activeQuotingLead?.estimatedValueVND}
        presetEstimatedValueDisplay={activeQuotingLead?.estimatedValueDisplay}
        presetPricingType={activeQuotingLead?.pricingType}
        presetVolumeDisplay={activeQuotingLead?.volumeDisplay}
      />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setCurrentView}
        onOpenCreateInquiry={() => setIsCreateInquiryOpen(true)}
        onOpenCreateQuotation={() => setIsCreateQuotationOpen(true)}
      />
    </div>
  );
}
export default App;
