import { annotationAndQuotationRangeType, TquotationStatus, TcustomerType } from 'js/api/dtoTypes';

export const customerTypesLookup: {
  [key in TcustomerType]: string;
} = Object.freeze({
  // construction: '營造',
  // firm: '事務所',
  // propertyOwner: '業主',
  // contractor: '協力廠商',
  construction: '營造',
  firm: '協力廠商',
  propertyOwner: '業主',
  contractor: '事務所',
  supplier: '供應商',
} as const);

// Pending與TempPending是不一樣的東西，但是因為業務部的需求，顯示出來的文字都是準合約
export const quotationStatusLookup: {
  [key in TquotationStatus]: string;
} = Object.freeze({
  Budget: '預算',
  Bidding: '投標',
  Contracting: '發包',
  Contract: '合約',
  Pending: '準合約',
  // TempPending: '待審核準合約',
  TempPending: '準合約',
} as const);

export const annotationAndQuotationRangeTypeLookup: {
  [key in annotationAndQuotationRangeType]: string;
} = {
  normal: '一般',
  'anti-typhoon': '防颱',
  'heat-protection': '阻熱',
  'heat-protection-smoke-covering': '阻熱遮煙',
};
