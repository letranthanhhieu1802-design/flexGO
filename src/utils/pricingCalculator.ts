import { InquiryItem, SupplierLeadItem } from '../types';

export function getMonthlyMultiplier(frequencyUnit?: string): number {
  if (!frequencyUnit) return 1;
  const unit = frequencyUnit.toLowerCase();
  if (unit.includes('ngày') || unit.includes('day')) return 26; // 26 ngày làm việc / tháng
  if (unit.includes('tuần') || unit.includes('week')) return 4;  // 4 tuần / tháng
  if (unit.includes('tháng') || unit.includes('month')) return 1;
  if (unit.includes('năm') || unit.includes('year')) return 1 / 12;
  return 1;
}

export function getMonthlyFrequency(inquiry?: InquiryItem | null, lead?: SupplierLeadItem | null): number {
  const specs: any = inquiry?.serviceSpecs || lead?.serviceSpecs;
  if (!specs) return 1;

  // 1. Trucking
  if (specs.trucking?.tripCount || specs.trucking?.ltlShipmentCount) {
    const trips = specs.trucking.tripCount || specs.trucking.ltlShipmentCount || 1;
    const unit = specs.trucking.frequencyUnit || specs.trucking.ltlFrequencyUnit;
    return Math.max(1, Math.round(trips * getMonthlyMultiplier(unit)));
  }

  // 2. Ocean
  if (specs.ocean?.containerCount || specs.ocean?.shipmentCount || specs.ocean?.lclShipmentCount) {
    const count = specs.ocean.containerCount || specs.ocean.shipmentCount || specs.ocean.lclShipmentCount || 1;
    const unit = specs.ocean.frequencyUnit || specs.ocean.lclFrequencyUnit;
    return Math.max(1, Math.round(count * getMonthlyMultiplier(unit)));
  }

  // 3. Air
  if (specs.air?.shipmentCount || specs.air?.packageCount) {
    const count = specs.air.shipmentCount || 1;
    return Math.max(1, Math.round(count * getMonthlyMultiplier(specs.air.frequencyUnit)));
  }

  // 4. Rail
  if (specs.rail?.shipmentCount || specs.rail?.containerCount || specs.rail?.lclShipmentCount) {
    const count = specs.rail.containerCount || specs.rail.shipmentCount || specs.rail.lclShipmentCount || 1;
    const unit = specs.rail.frequencyUnit || specs.rail.lclFrequencyUnit;
    return Math.max(1, Math.round(count * getMonthlyMultiplier(unit)));
  }

  // 5. Customs
  if (specs.customs?.declarationCount) {
    const count = specs.customs.declarationCount || 1;
    return Math.max(1, Math.round(count * getMonthlyMultiplier(specs.customs.declarationFrequencyUnit)));
  }

  // 6. Project
  if (specs.project?.tripCount) {
    return Math.max(1, Math.round((specs.project.tripCount || 1) * getMonthlyMultiplier(specs.project.frequencyUnit)));
  }

  // 7. Cross-border
  if (specs.crossBorder?.tripCount) {
    return Math.max(1, Math.round((specs.crossBorder.tripCount || 1) * getMonthlyMultiplier(specs.crossBorder.frequencyUnit)));
  }

  // 8. Warehousing
  if (specs.warehousing?.storageAreaSqm) {
    return specs.warehousing.storageAreaSqm || 1;
  }

  return 1;
}

export function getLeadOrInquiryPricing(item: SupplierLeadItem | InquiryItem): {
  totalAmount: number;
  currency: string;
  unitSuffix: string;
  formattedAmount: string;
} {
  const isLead = 'pricingType' in item;
  const pricingType = isLead ? (item as SupplierLeadItem).pricingType : ((item as InquiryItem).pricingType || 'SPOT');
  const titleText = ('title' in item && typeof (item as any).title === 'string') 
    ? (item as any).title 
    : ('cargoDetails' in item && typeof (item as any).cargoDetails === 'string') 
    ? (item as any).cargoDetails 
    : '';
  const isContract = pricingType === 'CONTRACT' || 
    titleText.toLowerCase().includes('contract') || 
    titleText.toLowerCase().includes('hợp đồng');

  // Customer requested currency
  const currency = item.currency || (item as SupplierLeadItem).inquiry?.currency || 'VND';
  const locale = currency === 'USD' ? 'en-US' : 'vi-VN';

  // Unit price extraction
  let unitPrice = 0;
  if ('targetBudget' in item && item.targetBudget) {
    unitPrice = parseInt(item.targetBudget.replace(/\D/g, ''), 10) || 0;
  }
  if (unitPrice === 0 && 'unitPriceVND' in item && (item as SupplierLeadItem).unitPriceVND) {
    unitPrice = (item as SupplierLeadItem).unitPriceVND || 0;
  }
  if (unitPrice === 0 && 'estimatedValueVND' in item && item.estimatedValueVND) {
    unitPrice = item.estimatedValueVND;
  }

  let totalAmount = unitPrice;
  if (isContract) {
    const inq = (item as SupplierLeadItem).inquiry || (isLead ? null : (item as InquiryItem));
    const leadItem = isLead ? (item as SupplierLeadItem) : null;
    const monthlyFreq = getMonthlyFrequency(inq, leadItem);
    
    // If unit price was set and frequency > 1, calculate total monthly value
    if (unitPrice > 0 && monthlyFreq > 1) {
      totalAmount = unitPrice * monthlyFreq;
    } else if (unitPrice > 0) {
      totalAmount = unitPrice;
    } else if ('estimatedValueVND' in item && item.estimatedValueVND) {
      totalAmount = item.estimatedValueVND;
    }
  }

  const unitSuffix = `${currency} ${isContract ? '/ tháng' : '/ lô'}`;
  const formattedAmount = (totalAmount || 0).toLocaleString(locale);

  return {
    totalAmount,
    currency,
    unitSuffix,
    formattedAmount,
  };
}
