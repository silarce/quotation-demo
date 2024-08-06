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

export { init_variable };
