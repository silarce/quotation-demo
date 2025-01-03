import Decimal from 'decimal.js';
import _ from 'lodash';

import type { TquotationContentDto } from 'js/api/dtoTypes';

// ============================================================================

// 這個函式是為了統一報價單與追加追減報價單的變數
const init_variable = (): {
  reviewSalesEmployeeId: string | undefined;
  reviewWorkDirectorEmployeeId: string | undefined;
  reviewCashierEmployeeId: string | undefined;
  reviewSupervisorEmployeeId: string | undefined;
  reviewSalesManagerEmployeeId: string | undefined;
  reviewManagerEmployeeId: string | undefined;

  isReviewer: boolean;
  isSales: boolean;
  isWorkDirector: boolean;
  isCashier: boolean;
  isSupervisor: boolean;
  isSalesManagerEmployee: boolean;
  isManager: boolean;

  salesReviewedAt: string | null | undefined;
  supervisorReviewedAt: string | null | undefined;
  salesManagerReviewedAt: string | null | undefined;
  workDirectorReviewedAt: string | null | undefined;
  cashierReviewedAt: string | null | undefined;
  managerReviewedAt: string | null | undefined;

  toSalesAt: string | null | undefined;
  toSupervisorAt: string | null | undefined;
  toSalesManagerAt: string | null | undefined;
  toWorkDirectorAt: string | null | undefined;
  toCashierAt: string | null | undefined;
  toManagerAt: string | null | undefined;

  isSendToReview: boolean;
  isSendToReview_pending: boolean;

  isAttach: boolean | undefined;

  isAllReviewedBeforePending: boolean;

  version: number | undefined;
  editNotes: string | undefined;
} => {
  const reviewSalesEmployeeId = undefined;
  const reviewWorkDirectorEmployeeId = undefined;
  const reviewCashierEmployeeId = undefined;
  const reviewSupervisorEmployeeId = undefined;
  const reviewSalesManagerEmployeeId = undefined;
  const reviewManagerEmployeeId = undefined;

  const isReviewer = false;
  const isSales = false;
  const isWorkDirector = false;
  const isCashier = false;
  const isSupervisor = false;
  const isSalesManagerEmployee = false;
  const isManager = false;

  const salesReviewedAt = undefined;
  const supervisorReviewedAt = undefined;
  const salesManagerReviewedAt = undefined;
  const workDirectorReviewedAt = undefined;
  const cashierReviewedAt = undefined;
  const managerReviewedAt = undefined;

  const toSalesAt = undefined;
  const toSupervisorAt = undefined;
  const toSalesManagerAt = undefined;

  const toWorkDirectorAt = undefined;
  const toCashierAt = undefined;
  const toManagerAt = undefined;

  const isSendToReview = false;
  const isSendToReview_pending = false;

  //
  const isAttach = undefined;
  //
  const isAllReviewedBeforePending = false;
  //
  const version = undefined;
  const editNotes = undefined;

  return {
    reviewSalesEmployeeId,
    reviewWorkDirectorEmployeeId,
    reviewCashierEmployeeId,
    reviewSupervisorEmployeeId,
    reviewSalesManagerEmployeeId,
    reviewManagerEmployeeId,
    isReviewer,
    isSales,
    isWorkDirector,
    isCashier,
    isSupervisor,
    isSalesManagerEmployee,
    isManager,
    salesReviewedAt,
    supervisorReviewedAt,
    salesManagerReviewedAt,
    workDirectorReviewedAt,
    cashierReviewedAt,
    managerReviewedAt,
    toSalesAt,
    toSupervisorAt,
    toSalesManagerAt,
    toWorkDirectorAt,
    toCashierAt,
    toManagerAt,
    isSendToReview,
    isSendToReview_pending,
    isAttach,
    isAllReviewedBeforePending,
    version,
    editNotes,
  };
};

const calcNTDToForeignCurrency = ({
  NTD,
  foreignCurrencyToNTD,
}: {
  NTD: number | `${number}`;
  // 外幣兌台幣，也就是1外幣等於多少台幣
  foreignCurrencyToNTD: number | `${number}`;
}) => {
  if (!Number(foreignCurrencyToNTD)) {
    return 0;
  }

  return new Decimal(NTD).div(foreignCurrencyToNTD).toDecimalPlaces(2).toNumber();
};

// ============================================================================

interface Tprops_getReviewerDict {
  status: TquotationContentDto['status'];

  reviewSalesEmployeeId: string | undefined;
  reviewSupervisorEmployeeId: string | undefined;
  reviewWorkDirectorEmployeeId: string | undefined;
  reviewCashierEmployeeId: string | undefined;
  // reviewSalesManagerEmployeeId: string | undefined;
  reviewManagerEmployeeId: string | undefined;

  toSalesAt: string | null | undefined;
  toSupervisorAt: string | null | undefined;
  // toSalesManagerAt: string | null | undefined;
  toWorkDirectorAt: string | null | undefined;
  toCashierAt: string | null | undefined;
  toManagerAt: string | null | undefined;

  salesReviewedAt: string | null | undefined;
  supervisorReviewedAt: string | null | undefined;
  // salesManagerReviewedAt: string | null | undefined;
  workDirectorReviewedAt: string | null | undefined;
  cashierReviewedAt: string | null | undefined;
  managerReviewedAt: string | null | undefined;
}
interface Tprops_checkIsReviewer extends Tprops_getReviewerDict {
  userId: string | undefined;
}

interface Treviewers {
  sales: string | undefined;
  supervisor: string | undefined;
  salesManager: string | undefined;
  workDirector: string | undefined;
  cashier: string | undefined;
  manager: string | undefined;
}

const getReviewerDict = ({
  status,

  reviewSalesEmployeeId,
  reviewSupervisorEmployeeId,
  reviewWorkDirectorEmployeeId,
  reviewCashierEmployeeId,
  // reviewSalesManagerEmployeeId,
  reviewManagerEmployeeId,

  toSalesAt,
  toSupervisorAt,
  // toSalesManagerAt,
  toWorkDirectorAt,
  toCashierAt,
  toManagerAt,

  salesReviewedAt,
  supervisorReviewedAt,
  // salesManagerReviewedAt,
  workDirectorReviewedAt,
  cashierReviewedAt,
  managerReviewedAt,
}: Tprops_getReviewerDict) => {
  const dict: {
    [key in 'sales' | 'supervisor' | 'workDirector' | 'cashier' | 'manager']: {
      id: string | undefined;
      to: string | undefined | null;
      at: string | null | undefined;
    };
  } = {
    sales: {
      id: reviewSalesEmployeeId,
      to: toSalesAt,
      at: salesReviewedAt,
    },
    supervisor: {
      id: reviewSupervisorEmployeeId,
      to: toSupervisorAt,
      at: supervisorReviewedAt,
    },
    workDirector: {
      id: reviewWorkDirectorEmployeeId,
      to: toWorkDirectorAt,
      at: workDirectorReviewedAt,
    },
    cashier: {
      id: reviewCashierEmployeeId,
      to: toCashierAt,
      at: cashierReviewedAt,
    },
    manager: {
      id: reviewManagerEmployeeId,
      to: toManagerAt,
      at: managerReviewedAt,
    },
  };

  const arr: (keyof typeof dict)[] =
    status === 'Pending' // 狀態為準合約
      ? [
          // 'sales',
          'supervisor',
          'workDirector',
          'cashier',
          'manager',
        ]
      : ['sales', 'supervisor', 'manager'];

  const reviewers: Treviewers = {
    sales: undefined,
    supervisor: undefined,
    salesManager: undefined,
    workDirector: undefined,
    cashier: undefined,
    manager: undefined,
  };

  for (const key of arr) {
    const { id, to, at } = dict[key];

    // 如果已經審核過了，那這個身分當然是審核者
    if (at) {
      reviewers[key] = id;
    }
    // 如果沒有審核過，就要檢查是否被送審，判斷是否為審核者
    else if (to) {
      reviewers[key] = id;
      // 審核是一層一層接著審的，因此在這之後的通通不用判斷，視為非審核者
      break;
    }
  }

  return reviewers;
};

const checkIsReviewer = (props: Tprops_checkIsReviewer) => {
  const { reviewSalesEmployeeId, reviewSupervisorEmployeeId, reviewManagerEmployeeId } = props;

  let isReviewer = false;
  const reviewerRole_ori = {
    isSales: false,
    isWorkDirector: false,
    isCashier: false,
    isSupervisor: false,
    isManager: false,
  };
  let reviewerRole = _.cloneDeep(reviewerRole_ori);

  const userId = props.userId;

  if (!userId) {
    return { isReviewer, ...reviewerRole };
  }

  const reviewers = getReviewerDict(props);
  console.log(reviewers);

  // 按照reviewers的順序，假設user同時為sales與manager
  // 最後會是isSales:false isManager:true
  Object.entries(reviewers).forEach(([key, id]) => {
    // console.log(id)
    // console.log(userId)

    if (id === userId) {
      isReviewer = true;

      switch (key) {
        case 'sales':
          reviewerRole = _.cloneDeep(reviewerRole_ori);
          reviewerRole.isSales = true;
          break;
        case 'supervisor':
          reviewerRole = _.cloneDeep(reviewerRole_ori);
          reviewerRole.isSupervisor = true;
          break;
        case 'workDirector':
          reviewerRole = _.cloneDeep(reviewerRole_ori);
          reviewerRole.isWorkDirector = true;
          break;
        case 'cashier':
          reviewerRole = _.cloneDeep(reviewerRole_ori);
          reviewerRole.isCashier = true;
          break;
        case 'manager':
          reviewerRole = _.cloneDeep(reviewerRole_ori);
          reviewerRole.isManager = true;
          break;

        default:
          break;
      }
    }
  });

  if (
    props.status === 'Pending' &&
    !Object.values(reviewerRole).includes(true) &&
    userId === reviewManagerEmployeeId &&
    (reviewManagerEmployeeId === reviewSalesEmployeeId || reviewManagerEmployeeId === reviewSupervisorEmployeeId)
  ) {
    isReviewer = true;
    reviewerRole = _.cloneDeep(reviewerRole_ori);
    reviewerRole.isManager = true;
  }

  return { isReviewer, ...reviewerRole };
};

// ============================================================================

const parseQuotationContentSituation = ({
  userId,
  quotationContent,
}: {
  userId: string | undefined | null;
  quotationContent: TquotationContentDto;
}) => {
  // console.log(userId)
  // console.log(quotationContent)

  const {
    reviewSalesEmployee,
    reviewWorkDirectorEmployee,
    reviewCashierEmployee,
    reviewSupervisorEmployee,
    // reviewSalesManagerEmployee,
    reviewManagerEmployee,

    salesReviewedAt,
    supervisorReviewedAt,
    // salesManagerReviewedAt,
    workDirectorReviewedAt,
    cashierReviewedAt,
    managerReviewedAt,

    toSalesAt,
    toSupervisorAt,
    // toSalesManagerAt,
    toWorkDirectorAt,
    toCashierAt,
    toManagerAt,
    //
    //
    status,
  } = quotationContent;

  const salesEmployeeId = reviewSalesEmployee?.id || null;
  const workDirectorEmployeeId = reviewWorkDirectorEmployee?.id || null;
  const cashierEmployeeId = reviewCashierEmployee?.id || null;
  const supervisorEmployeeId = reviewSupervisorEmployee?.id || null;
  // const salesManagerEmployeeId = reviewSalesManagerEmployee || null;
  const managerEmployeeId = reviewManagerEmployee?.id || null;

  const isSendToReview_pending = !!(toSupervisorAt || toWorkDirectorAt || toCashierAt || toManagerAt);

  const isSendToReview =
    status === 'Pending'
      ? isSendToReview_pending
      : !!(toSalesAt || toSupervisorAt || toWorkDirectorAt || toCashierAt || toManagerAt);

  const {
    isReviewer = null,
    isSales = null,
    isWorkDirector = null,
    isCashier = null,
    isSupervisor = null,
    isManager = null,
  } = !!userId
    ? checkIsReviewer({
        userId,
        reviewSalesEmployeeId: salesEmployeeId || undefined,
        reviewSupervisorEmployeeId: supervisorEmployeeId || undefined,
        reviewWorkDirectorEmployeeId: workDirectorEmployeeId || undefined,
        reviewCashierEmployeeId: cashierEmployeeId || undefined,
        reviewManagerEmployeeId: managerEmployeeId || undefined,
        ...quotationContent,
      })
    : {};

  return {
    isSendToReview,
    isSendToReview_pending,
    //
    isReviewer,
    isSales,
    isWorkDirector,
    isCashier,
    isSupervisor,
    isManager,
  };
}; // parseQuotationContentSituation

// ============================================================================

export { init_variable, calcNTDToForeignCurrency, checkIsReviewer, parseQuotationContentSituation };
