export const customerTypesLookup = Object.freeze({
  construction: '營造',
  firm: '事務所',
  propertyOwner: '業主',
  contractor: '協力廠商',
} as const);

export const quotationStatusLookup = Object.freeze({
  Budget: '預算',
  Bidding: '投標',
  Contracting: '發包',
} as const);
