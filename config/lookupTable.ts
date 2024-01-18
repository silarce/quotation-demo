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

const lookup_hpToGapAGapC = {
  '1/4HP': {
    HPValue: 0.25,
    outputTooth: 9,
    reelGear: 50,
    gapA: 30,
    gapC: 20,
  },
  '1/3HP': {
    HPValue: 0.3,
    outputTooth: 9,
    reelGear: 50,
    gapA: 40,
    gapC: 20,
  },
  '1/2HP': {
    HPValue: 0.5,
    outputTooth: 9,
    reelGear: 50,
    gapA: 50,
    gapC: 20,
  },
  '3/4HP': {
    HPValue: 0.75,
    outputTooth: 9,
    reelGear: 50,
    gapA: 60,
    gapC: 20,
  },
  '1HP': {
    HPValue: 1,
    outputTooth: 9,
    reelGear: 50,
    gapA: 70,
    gapC: 20,
  },
  '1 1/2HP': {
    HPValue: 1.5,
    outputTooth: 9,
    reelGear: 60,
    gapA: 70,
    gapC: 20,
  },
  '2HP': {
    HPValue: 2,
    outputTooth: 15,
    reelGear: 60,
    gapA: 120,
    gapC: 20,
  },
  '3HP': {
    HPValue: 3,
    outputTooth: 15,
    reelGear: 60,
    gapA: 150,
    gapC: 20,
  },
  '5HP': {
    HPValue: 5,
    outputTooth: 17,
    reelGear: 60,
    gapA: 170,
    gapC: 20,
  },
  '50Nm': {
    HPValue: 50,
    outputTooth: 17,
    reelGear: 60,
    gapA: 40,
    gapC: 10,
  },
};
