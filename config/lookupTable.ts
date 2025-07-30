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

// 公務車資料 // 車牌
export const licensePlateLookUp: Record<
  string,
  {
    value: string;
    name: string;
  }
> = Object.freeze({
  'BRC-3939': {
    value: 'BRC-3939',
    name: 'BRC-3939',
  },
  'BRW-3939': {
    value: 'BRW-3939',
    name: 'BRW-3939',
  },
  'ABX-3939': {
    value: 'ABX-3939',
    name: 'ABX-3939',
  },
  'AYP-3939': {
    value: 'AYP-3939',
    name: 'AYP-3939',
  },
  'AYM-3939': {
    value: 'AYM-3939',
    name: 'AYM-3939',
  },
  'AKL-3939': {
    value: 'AKL-3939',
    name: 'AKL-3939',
  },
  'AVY-3939': {
    value: 'AVY-3939',
    name: 'AVY-3939',
  },
  'AKC-3939': {
    value: 'AKC-3939',
    name: 'AKC-3939',
  },
  'BJJ-3939': {
    value: 'BJJ-3939',
    name: 'BJJ-3939',
  },
  '3208-J9': {
    value: '3208-J9',
    name: '3208-J9',
  },
  'BGF-0950': {
    value: 'BGF-0950',
    name: 'BGF-0950',
  },
  'ACQ-3939': {
    value: 'ACQ-3939',
    name: 'ACQ-3939',
  },
  'CBY-3939': {
    value: 'CBY-3939',
    name: 'CBY-3939',
  },
});
