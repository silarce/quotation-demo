import { TcustomerDto } from 'js/api/dtoTypes';

interface Tstate_quotation {
  quotationId: string | null;
  contentId: string | null;
  isNew: boolean | null;

  quotationNumber: string | null;

  profile: {
    projectName: string;
    validityPeriod: string;
    county: string;
    district: string;
    address: string;
    contactPerson: string;
    contactNumber: string;
    faxNumber: string;
    trackProgress: string;
    projectProgress: string;

    designatedBrand: string;
    siteManager: string;
    siteManagerNumber: string;
    requiredDoorType: string;
    requiredDoorQuantity: string;
    estimatedDiscount: string;
    type: string;

    isLost: boolean; // 失單

    customer: TcustomerDto;
    designUnit: TcustomerDto;

    // 以下為已棄用的property
    // requiredDoorType: null;
    // requiredDoorQuantity: null;
    // estimatedDiscount: null;
    // scheduledProcurementOrBidDate: null;
  };
}

export type { Tstate_quotation };
