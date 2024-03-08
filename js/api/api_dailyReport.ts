import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi } from './_axiosCreator';
import { createUseInfinite } from './createUseInfinite';

import { AxiosError } from 'axios';

import {
  TdailyReportDto,
  TcreateDailyReportItemDto,
  TupdateDailyReportDto,
  TemployeeDto,
  TpageMetaDto,
  TdailyReportWokerDto,
  TaccountingReportStatistic,
  TaccountingReportDto,
  Tparams,
  TdailyReportItemDto,
  TreviewerPresets,
} from './dtoTypes';

import type { TuseNoMeta } from './types';

type TdailyReportItem_my = TdailyReportDto['items'][number] & {
  employee: TemployeeDto;
  employeeChName: string;
};

type TgetDailyReportItem_my = {
  data: TdailyReportItem_my[];
  meta: TpageMetaDto;
};

export type {
  TcreateDailyReportItemDto,
  TdailyReportDto,
  TdailyReportWokerDto,
  Tparams,
  TemployeeDto,
  TaccountingReportDto,
  TdailyReportItemDto,
  TdailyReportItem_my,
};
// =================================================================

const dailyReportsReducer_items_my = (dailyReportArr: TdailyReportDto[]): TdailyReportItem_my[] => {
  const reducedDataArr: TdailyReportItem_my[] = [];

  dailyReportArr.forEach((data) => {
    const { employee, items } = data;
    items.forEach((item) => {
      reducedDataArr.push({ ...item, employee, employeeChName: employee.chName });
    });
  });

  return reducedDataArr;
};

// =================================================================

type TgetDailyReports = {
  data: TdailyReportDto[];
  meta: TpageMetaDto;
};

// 取得指定月份所有日報表
const apiDailyReports_old = (customParams?: Tparams, controller?: AbortController) => {
  const api = `/daily-reports`;
  const params = {
    populate: [
      //
      'employee',
      'reviewStatus.reviewerEmployee.jobs',
      'isReviewCompleted',
      'items.workers',
    ],
    sort: 'date',
    order: 'DESC',
    ...customParams,
  };

  return axi
    .get<TgetDailyReports>(api, { params, signal: controller?.signal })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

const apiDailyReports = (params?: Tparams, controller?: AbortController) => {
  const api = `/daily-reports`;

  return axi
    .get<TgetDailyReports>(api, { params, signal: controller?.signal })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

const apiDailyReports_reducer_items = (params?: Tparams) => {
  const api = `/daily-reports`;
  params = {
    ...params,
    populate: ['employee', 'items.workers', ...(params?.populate ?? [])],
  };

  return axi
    .get<TgetDailyReports>(api, { params })
    .then(({ data: res }) => {
      const reduceDataArr = dailyReportsReducer_items_my(res.data);

      return {
        data: reduceDataArr,
        meta: res.meta,
      };
    })
    .catch((err) => Promise.reject(err));
};

export const useGetDailyReports = createUseInfinite<TgetDailyReports>({
  apiClient: apiDailyReports,
  errTitle: '取得日報表失敗',
  defaultParams: {
    populate: [
      //
      'employee',
      'reviewStatus.reviewerEmployee.jobs',
      'isReviewCompleted',
      'items.workers',
    ],
  },
});

export const useGetDailyReports_items = createUseInfinite<TgetDailyReportItem_my>({
  apiClient: apiDailyReports_reducer_items,
  errTitle: '取得日報表失敗',
});

// const apiDailyReports_worker_reducer_items = (params?: Tparams) => {
//   const api = `/daily-reports/worker`;
//   params = {
//     ...params,
//     populate: ['employee', 'items.workers', ...(params?.populate ?? [])],
//   };

//   return axi
//     .get<TgetDailyReports>(api, { params })
//     .then(({ data: res }) => {
//       const reduceDataArr = dailyReportsReducer_items_my(res.data);

//       return {
//         data: reduceDataArr,
//         meta: res.meta,
//       };
//     })
//     .catch((err) => Promise.reject(err));
// };

// export const useGetDaily_worker_items = createUseInfinite<TgetDailyReportItem_my>({
//   apiClient: apiDailyReports_worker_reducer_items,
//   errTitle: '取得日報表失敗',
// });

const apiDailyReport_worker_date = ({ params, date }: { params?: Tparams; date: string }) => {
  const api = `/daily-reports/worker/${date}`;

  return axi
    .get<TdailyReportDto[]>(api, { params })
    .then(({ data: res }) => {
      const reduceDataArr: TdailyReportItem_my[] = dailyReportsReducer_items_my(res);

      return reduceDataArr;
    })
    .catch((err) => Promise.reject(err));
};

export const useGetDaily_worker_date: TuseNoMeta = ({ params, date }: { params?: Tparams; date?: string } = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [res, setRes] = useState<TdailyReportItem_my[]>();

  const update = async () => {
    if (!date) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiDailyReport_worker_date({
        params: params ?? {},
        date,
      });
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({
        title: '取得日報表失敗',
        content: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: res,
    update,
    isLoading,
  };
};

// // 取得工務人員日報表
// const apiGetDailyReports_workers = (params?: Tparams) => {
//   const api = '/daily-reports/workers';

//   return axi
//     .get<TgetDailyReportsWorkers>(api, { params })
//     .then(({ data }) => data)
//     .catch((err) => Promise.reject(err));
// };

// export const useGetDailyReports_workers = createUseInfinite<TgetDailyReportsWorkers>({
//   apiClient: apiGetDailyReports_workers,
//   errTitle: '取得工務人員日報表失敗',
// });

export const useApiDailyReports = (params?: Tparams) => {
  /**用來取消請求 */
  const [controller, setController] = useState<AbortController>();
  const [res, setRes] = useState<TgetDailyReports>();

  const update = async (dynamicFilter?: Tparams['filter']) => {
    const newController = new AbortController();
    setController(newController);
    const theParams: Tparams = {
      ...params,
      filter: {
        ...params?.filter,
        ...dynamicFilter,
      },
    };
    const data = await apiDailyReports_old(theParams, newController);

    if (data) {
      setRes(data);
    }

    return data;
  };

  return {
    dailyReport: res?.data,
    setDailyReports: setRes,
    updateDailyReports: update,
    controller,
  };
};

// ----

export const useApiDailyReports_v2 = (customParams?: Tparams) => {
  /**就只是為了render */
  const [render, setRender] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  /**viewRef 不可以放在一開始就會出現在畫面上的item上，
   * 不然無法觸發nextPage */
  const [viewRef, inView] = useInView();
  const [page, setPage] = useState(1);

  const params = {
    page,
    // pageSize必須大於畫面一次可顯示的item數量才不會壞掉
    // 不過應該只有在嚴格模式會壞掉
    pageSize: 50,
    ...customParams,
  } as const;

  const [dataArrQueue, setDataArrQueue] = useState<TgetDailyReports['data'][]>([]);
  const [data, setData] = useState<TgetDailyReports['data']>();
  const [meta, setMeta] = useState<TgetDailyReports['meta']>();

  const update_infinite = async () => {
    if (meta && !meta.hasNextPage) {
      return;
    }

    setIsloading(true);
    const res = await apiDailyReports_old(params);
    setIsloading(false);
    const dataArrQueueCopy = [...dataArrQueue];
    dataArrQueueCopy[page - 1] = res.data;
    setDataArrQueue(dataArrQueueCopy);
    setData(dataArrQueueCopy.flat());
    setMeta(res.meta);

    return res;
  };

  const nextPage = async () => {
    if (meta && !meta.hasNextPage) {
      return;
    }

    setPage(page + 1);
  };

  const reset = () => {
    setIsloading(true);
    setDataArrQueue([]);
    setData(undefined);
    setMeta(undefined);
    setPage(1);
    setRender((state) => ++state);
  };

  useEffect(() => {
    if (render === 0) {
      return;
    }

    update_infinite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, render]);

  useEffect(() => {
    if (inView) {
      nextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  // useEffect(() => {
  //   reset()
  // }, [])

  return {
    data,
    meta,
    setData,
    nextPage,
    reset,
    viewRef,
    isLoading,
  };
}; // useGetAnnotation_v2

// 取得自己指定日期的日報表
/**date格式為yyyy-MM-DD 例:2022-02-02 */
export const apiDailyReports_my = (date: string) => {
  const api = `/daily-reports/my?date=${date}`;

  return axi
    .get(api)
    .then(({ data }) => data as TdailyReportDto)
    .catch((err) => Promise.reject(err));
};

/**date格式為yyyy-MM-DD 例:2022-02-02 */
export const useApiDailyReports_my = (date: string) => {
  const [data, setData] = useState<TdailyReportDto>();

  const update = async () => {
    const data = await apiDailyReports_my(date);

    if (data) {
      setData(data);
    }

    return data;
  };

  return {
    dailyReport_my: data,
    setDailyReports_my: setData,
    updateDailyReports_my: update,
  };
};

// 更新自己的指定日期的日報表
export const apiPatchDailyReports_my = ({
  date,
  body,
}: {
  /**YYYY-MM-DD */
  date: string;
  body: TupdateDailyReportDto;
}) => {
  const api = `/daily-reports/my?date=${date}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 取得指定日報表
export const apiDailyReports_id = (id: string) => {
  const api = `/daily-reports/${id}`;
  const params = { populate: ['items.workers', 'employee', 'reviewStatus.reviewerEmployee'] };

  return axi
    .get(api, { params })
    .then(({ data }) => data as TdailyReportDto)
    .catch((err) => Promise.reject(err));
};

export const useApiDailyReports_id = (id: string) => {
  const [data, setData] = useState<TdailyReportDto>();

  const update = async () => {
    const data = await apiDailyReports_id(id);

    if (data) {
      setData(data);
    }

    return data;
  };

  return {
    dailyReport_id: data,
    setDailyReports_id: setData,
    updateDailyReports_id: update,
  };
};

// 審閱日報表
export const apiDailyReports_review = (id: string) => {
  const api = `/daily-reports/${id}/review`;

  return axi
    .post(api)
    .then(({ data }) => data as TdailyReportDto)
    .catch((err) => Promise.reject(err));
};

// 取得所有審核人員
const apiDailyReports_reviewers = () => {
  const api = '/daily-reports/reviewers';

  return axi
    .get(api)
    .then(({ data }) => data as TemployeeDto[])
    .catch((err) => Promise.reject(err));
};

export const useApiDailyReports_reviewers = () => {
  const [data, setData] = useState<TemployeeDto[]>([]);

  const update = async () => {
    const data = await apiDailyReports_reviewers();

    if (data) {
      setData(data);
    }

    return data;
  };

  return {
    /** 所有需回報的人員 */
    reviewersArr: data,
    setReviewersArr: setData,
    /**更新所有需回報的人員 */
    updateReviewersArr: update,
  };
};

/**設定審核人員 */
export const apiPatchDailyReports_reviewers = (body: { employeeIds: string[] }) => {
  const api = '/daily-reports/reviewers';

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**確認使用者是否為審核人員 */
export const apiIsReviewer = () => {
  const api = '/daily-reports/is-reviewer/me';

  return axi
    .get(api)
    .then(({ data }) => data as { isReviewer: boolean })
    .catch((err) => Promise.reject(err));
};

type TgetDailyReportsWorkers = {
  data: TdailyReportWokerDto[];
  meta: TpageMetaDto;
};

export const apiGetDailyReportsWorkers = (params?: Tparams) => {
  const api = '/daily-reports/workers';

  return axi
    .get(api, { params })
    .then(({ data }) => data as TgetDailyReportsWorkers)
    .catch((err) => Promise.reject(err));
};

export const useApiGetDailyReportsWorkers = (params?: Tparams) => {
  const [res, setRes] = useState<TgetDailyReportsWorkers>();

  const update = async () => {
    const res = await apiGetDailyReportsWorkers(params);

    if (res) {
      setRes(res);
    }

    return res;
  };

  const update_infinite = async () => {
    if (!res) {
      return;
    }

    const apiRes = await apiGetDailyReportsWorkers(params);
    const newData = apiRes.data;
    const oldData = res.data;
    apiRes.data = [...oldData, ...newData];
    setRes({ ...apiRes });

    return apiRes;
  };

  return {
    workers: res?.data,
    meta: res?.meta,
    updateWorkers: update,
    updateWorkers_infinite: update_infinite,
    setRes,
  };
};

// type TgetAccountingReport = {
//   data: TaccountingReportDto[]
//   meta: TpageMetaDto
// }

const apiAccountingReport = (date: string) => {
  const api = '/daily-reports/accounting-report';
  const params = {
    date,
    pageSize: 99999,
  };

  return axi
    .get(api, { params })
    .then(({ data }) => data as TaccountingReportDto[])
    .catch((err) => Promise.reject(err));
};

export const useApiAccountReports = (date: string) => {
  const [res, setRes] = useState<TaccountingReportDto[]>();

  const update = async (dynamicDate?: string) => {
    const data = await apiAccountingReport(dynamicDate || date);

    if (data) {
      setRes(data);
    }

    return data;
  };

  return {
    accountingReport: res,
    setAccountReports: setRes,
    updateAccountReports: update,
  };
};

// ==============================================================
export type TcreateDailyReportReviewerPresetDto = {
  reportEmployeeIds: string[]; //回報人員
  reviewerEmployeeIds: string[]; // 審核人員
  examinerEmployeeIds: string[]; //檢視人員
};

export const apiPatchReviewerPresets = (body: TcreateDailyReportReviewerPresetDto) => {
  const api = '/daily-reports/reviewer-presets';

  // res的型別為DailyReportReviewerPreset，目前用不到，先不管
  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiGetReviewerPresets = (params?: Tparams) => {
  const api = '/daily-reports/reviewer-presets';

  return axi
    .get<{
      data: TreviewerPresets[];
      meta: TpageMetaDto;
    }>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export type TreporterPreset = {
  reporter: TemployeeDto;
  reviewer: TemployeeDto[];
  examiner: TemployeeDto[];
};

export type TreporterPresetList = {
  [key: string]: TreporterPreset;
};

export const useApiGetReviewerPresets = ({ customParams }: { customParams?: Tparams }) => {
  /**resetCount就只是用來使呼叫reset後，若page沒有改變的話，還是可以觸發update*/
  const [resetCount, setResetCount] = useState(0);
  const [isLoadingPage1, setIsLoadingPage1] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [viewRef_top, inView_top] = useInView();
  const [viewRef_bottom, inView_bottom] = useInView();
  // ----------------------------------------------------------------
  const [reporterList, setReporterList] = useState<TreporterPresetList>({});
  // ----------------------------------------------------------------
  const [dataList, setDataList] = useState<{ [key: `${number}`]: TreviewerPresets[] }>({});

  const [page, setPage] = useState<number>();
  const [meta, setMeta] = useState<TpageMetaDto>();
  const [hasNextPage, setHasNextPage] = useState<boolean>();

  // ----------------------------------------------------------------
  const defaultParams = {
    page,
    pageSize: 50,
    sort: 'reportEmployeeId',
    populate: ['reportEmployee.jobs.department', 'reviewerEmployee'],
  };
  // ----------------------------------------------------------------

  const update = async (dynaParams?: Tparams) => {
    const params = {
      ...defaultParams,
      ...customParams,
      ...dynaParams,
    };

    try {
      if (page === 1) {
        setIsLoadingPage1(true);
      }

      setIsloading(true);

      const res = await apiGetReviewerPresets(params);

      if (res) {
        setDataList((list) => {
          list[`${res.meta.page}`] = res.data;

          return { ...list };
        });
        setMeta(res.meta);
        setHasNextPage(res.meta.hasNextPage);
        //_________________________________
        //_________________________________
        const newReporterList = { ...reporterList };

        res.data.forEach((item) => {
          const reporterId = item.reportEmployeeId;
          const reporter = item.reportEmployee;
          const type = item.type;

          if (!newReporterList[reporterId]) {
            newReporterList[reporterId] = {
              reporter,
              reviewer: [],
              examiner: [],
            };
          }

          if (type === 'reviewer') {
            newReporterList[reporterId].reviewer.push(item.reviewerEmployee);
          }

          if (type === 'examiner') {
            newReporterList[reporterId].examiner.push(item.reviewerEmployee);
          }
        });

        setReporterList(newReporterList);
      } // if close

      return res;
      //
    } catch (error) {
      myAlert.err({ title: '取得資料失敗' });
      console.log(error);
    } finally {
      setIsloading(false);
      setIsLoadingPage1(false);
    }
  };

  const nextPage = () => {
    if (hasNextPage === false || !page) {
      return;
    }

    setPage((page) => (page ? page + 1 : page));
  };

  // -----------------------------------------------
  const init = () => {
    setDataList({});
    setReporterList({});
    setPage(undefined);
    setHasNextPage(undefined);
    setResetCount(0);
  };

  const reset = () => {
    setDataList({});
    setReporterList({});
    setPage(1);
    setHasNextPage(true);
    setResetCount((count) => ++count);
  };

  // -----------------------------------------------
  useEffect(() => {
    if (!page) {
      return;
    }

    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, resetCount]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (inView_bottom) {
      nextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView_bottom, isLoading]);
  // -----------------------------------------------

  return {
    dataList,
    dataArr: _.flatten(Object.values(dataList)),
    viewRef_top,
    viewRef_bottom,
    isLoadingPage1,
    isLoading,
    meta,
    init,
    reset,
    //
    reporterList,
    reporterArr: Object.values(reporterList),
  };
};
