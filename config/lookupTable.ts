import { annotationAndQuotationRangeType } from 'js/api/dtoTypes';

export const customerTypesLookup = Object.freeze({
  // construction: '營造',
  // firm: '事務所',
  // propertyOwner: '業主',
  // contractor: '協力廠商',
  construction: '營造',
  firm: '協力廠商',
  propertyOwner: '業主',
  contractor: '事務所',
} as const);

export const quotationStatusLookup = Object.freeze({
  Budget: '預算',
  Bidding: '投標',
  Contracting: '發包',
  Contract: '合約',
  Pending: '準合約',
} as const);

export const annotationAndQuotationRangeTypeLookup: {
  [key in annotationAndQuotationRangeType]: string;
} = {
  normal: '一般',
  'anti-typhoon': '防颱',
  'heat-protection': '阻熱',
  'heat-protection-smoke-covering': '阻熱遮煙',
};
