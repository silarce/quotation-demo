// apiGetQuotationProducts

import { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi, domain } from './_axiosCreator';
import { createUseInfinite } from './createUseInfinite';
import { AxiosError } from 'axios';

// type
import type {
  Tparams,
  TpageMetaDto,
  TapiError,
  TquotationContentDto,
  TquotationDto,
  TcreateQuotationContentDto,
  TfileDto,
  TcreateQuotationVerifyFormDto,
  TreviewQuotationContentDto,
  TsubmitReviewQotuationContentDto,
  TquotationContractDto,
  TcreateModifyQuotationDto,
  TquotationProductDto,
  TquotationAccouting,
  TquotationAccouting_years,
  TquotationAccouting_area,
  TquotationAccounting_personal_content,
  TcontractAccountingReportFormDto,
  TquotationAccounting_modifyContract,
  TquotationStatus,
  TbonusDto,
  TcopyQuotationDto,
} from './dtoTypes';

export type {
  Tparams,
  TpageMetaDto,
  TquotationContentDto,
  TquotationDto,
  TcreateQuotationContentDto,
  TcreateQuotationVerifyFormDto as TcontractReviewForm,
  TreviewQuotationContentDto,
  TsubmitReviewQotuationContentDto,
  TquotationContractDto,
  TcreateModifyQuotationDto,
  TquotationProductDto,
  TcreateQuotationProductDto,
  TquotationAccouting,
  TquotationAccouting_years,
  TquotationAccouting_area,
  TquotationAccounting_personal_content,
  TcontractAccountingReportFormDto as TquotationAccounting_personal_contract,
  TquotationAccounting_modifyContract,
  TbonusDto,
} from './dtoTypes';

type TgetQuotation = {
  data: TquotationDto[];
  meta: TpageMetaDto;
};

// type TquotationContractDto_withPage = TquotationContractDto & { page: number };

export const apiGetQuotation = async (params?: Tparams) => {
  const api = '/quotation';

  params = {
    populate: [
      // 'contents.customer',
      'contents',
      'latestContent.customer',
      'latestContent.agentEmployee',
      'latestContent.reviewSalesEmployee',
      'latestContent.reviewWorkDirectorEmployee',
      'latestContent.reviewCahierEmployee',
      'latestContent.reviewSupervisorEmployee',
      'latestContent.reviewSalesManagerEmployee',
      'latestContent.reviewManagerEmployee',
      'latestContent.managerReviewedAt',
      'latestContent.products.quantity',
      'latestContent.products.options',
      'attachedToContract',
      'attachedToContractId',
    ],
    ...params,
  };

  return axi
    .get<TgetQuotation>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetQuotation = (customParams?: Tparams) => {
  const [res, setRes] = useState<TgetQuotation>();

  const update = async () => {
    const newRes = await apiGetQuotation(customParams);

    if (newRes) {
      setRes(newRes);
    }

    return newRes;
  };

  return {
    data: res?.data,
    meta: res?.meta,
    update,
  };
};

export const apiGetQuotation_id_detail = async (id: string) => {
  const api = `/quotation/${id}/detail`;

  return axi
    .get<TquotationDto>(api)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '取得報價單_detail失敗', content: err.message });

      return Promise.reject(err.message);
    });
};

export const apiGetQuotation_reduce_detail = async (params?: Tparams) => {
  const api = '/quotation';

  return axi
    .get<TgetQuotation>(api, { params })
    .then(async ({ data }) => {
      const { data: arr, meta } = data;

      const newArr = await Promise.all(
        arr.map(async (q) => {
          const newQ = await apiGetQuotation_id_detail(q.id);

          return {
            ...q,
            ...newQ,
          };
        })
      );

      return {
        data: newArr,
        meta,
      };
    })
    .catch((err) => Promise.reject(err.message));
};

export const useGetQuotation_infinite = createUseInfinite<TgetQuotation>({
  //
  apiClient: apiGetQuotation,
  errTitle: '取得報價單失敗',
});

export const useGetQuotation_detail_infinite = createUseInfinite<TgetQuotation>({
  //
  apiClient: apiGetQuotation_reduce_detail,
  errTitle: '取得報價單失敗',
});

export const apiGetQuotation_Id = async (id: string, params?: Tparams) => {
  const api = `/quotation/${id}`;

  params = {
    populate: [
      // 'contents',
      'contents.customer',
      'latestContent.customer',
      'latestContent.agentEmployee',
      'latestContent.supervisorEmployee',
      'latestContent.managerEmployee',

      'latestContent.reviewSalesEmployee',
      'latestContent.reviewWorkDirectorEmployee',
      'latestContent.reviewCashierEmployee',
      'latestContent.reviewSupervisorEmployee',
      'latestContent.reviewSalesManagerEmployee',
      'latestContent.reviewManagerEmployee',

      'latestContent.products.items.accessories',
      'latestContent.products.items.components',
      'latestContent.products.items.rootProductId',
      'latestContent.others',
      'latestContent.verifyForm',

      'attachedToContract.content.products',
      'attachedToContract.subContracts.content.products',
      // 'subContracts.content.products',
    ],
    ...params,
  };

  return axi
    .get<TquotationDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetQuotation_id = (id: string | undefined, { params }: { params?: Tparams }) => {
  const [res, setRes] = useState<TquotationDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      const newRes = await apiGetQuotation_Id(id, params);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得報價單資料失敗', content: err.message });
    }
  };

  return {
    data: res,
    update,
  };
};

export const apiGetQuotation_id_2 = async (id: string, params?: Tparams) => {
  const api = `/quotation/${id}`;

  return axi
    .get<TquotationDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetQuotation_id_2 = (
  id: string | undefined,
  {
    params,
    preBuiltPopulate,
    showAlert = true,
    getProductItems = true,
  }: {
    params?: Tparams;
    preBuiltPopulate?: TquotationPopulateList[];
    showAlert?: boolean;
    getProductItems?: boolean;
  } = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [res, setRes] = useState<TquotationDto>();

  let populate: string[] | undefined = undefined;

  if (preBuiltPopulate) {
    populate = quotationPopulateGeter(preBuiltPopulate);
  }

  const theParams = {
    populate,
    ...params,
  };

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      const res = await apiGetQuotation_id_2(id, theParams);

      if (getProductItems) {
        const prodIdArr = res.latestContent.products.map((prod) => prod.id);
        const chunk = _.chunk(prodIdArr, 20);

        for (const chunkIndex in chunk) {
          const idArr = chunk[chunkIndex];
          const times = Number(chunkIndex);

          const wholeProdArr = await apiGetQuotationMultiProducts(idArr);
          wholeProdArr.forEach((wholeProd, index) => {
            res.latestContent.products[index + times * 20] = wholeProd;
          });
        }
      }

      setIsLoading(true);
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;

      if (showAlert) {
        myAlert.err({ title: '取得報價單失敗', content: err.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renewProd = (wholeProd: TquotationProductDto) => {
    setRes((res) => {
      if (!res) {
        return res;
      }

      const copy = { ...res };

      const index = copy.latestContent.products.findIndex((prod) => wholeProd.id === prod.id);
      copy.latestContent.products[index] = wholeProd;

      return copy;
    });
  };

  const updateSingleProd_noRender = async (prodId: string) => {
    const wholdProd = await apiGetQuotationProducts(prodId);

    // renewProd(wholdProd);
    if (!res) {
      return;
    }

    const products = res.latestContent.products;
    const index = products.findIndex((prod) => prod.id === prodId);
    products[index] = wholdProd;

    return wholdProd;
  };

  const updateAllWholdProd_noRender = async ({
    stopToken,
    onSingleSuceess,
  }: {
    stopToken: { stop: boolean };
    onSingleSuceess?: (wholdProd: TquotationProductDto) => void;
  }) => {
    if (!res) {
      return;
    }

    const products = res.latestContent.products;

    for (const index in products) {
      if (stopToken.stop) {
        break;
      }

      const prod = products[index];
      const isWhole = !!prod.items;

      if (isWhole) {
        continue;
      }

      await new Promise((resolve, reject) => {
        setTimeout(async () => {
          const wholeProd = await apiGetQuotationProducts(prod.id);
          // renewProd(wholeProd);
          products[index] = wholeProd;
          onSingleSuceess?.(wholeProd);
          resolve(wholeProd);
        }, 100);
      });
    }
  };

  const updateAllWholeProd_batch_noRender = async ({
    stopToken,
    onBatchSuceess,
  }: {
    stopToken: { stop: boolean };
    onBatchSuceess?: (wholdProdArr: TquotationProductDto[]) => void;
  }) => {
    if (!res) {
      return;
    }

    const prodIdArr = res.latestContent.products.map((prod) => prod.id);
    const chunk = _.chunk(prodIdArr, 20);

    for (const chunkIndex in chunk) {
      if (stopToken.stop) {
        break;
      }

      const idArr = chunk[chunkIndex];
      const times = Number(chunkIndex);

      const wholeProdArr = await apiGetQuotationMultiProducts(idArr);
      wholeProdArr.forEach((wholeProd, index) => {
        res.latestContent.products[index + times * 20] = wholeProd;
      });
      onBatchSuceess?.(wholeProdArr);
    }
  };

  return {
    data: res,
    isLoading,
    update,
    setData: setRes,
    renewProd,
    updateAllWholdProd_noRender,
    updateSingleProd_noRender,
    updateAllWholeProd_batch_noRender,
  };
};

//
//

// 以 id 取得 QuotationContent
const apiGetQuotationContent_Id = async (id: string) => {
  const api = `/quotation/content/${id}`;

  const params = {
    populate: [
      'customer',
      'designUnit',
      'agentEmployee',
      'supervisorEmployee',
      'managerEmployee',

      'reviewSalesEmployee',
      'reviewCashierEmployee',
      'reviewSalesManagerEmployee',
      'reviewWorkDirectorEmployee',
      'reviewCashierEmployee',
      'reviewManagerEmployee',

      'products.items.accessories',
      'products.items.components',
      'products.items.rootProductId',
      'others',
      'verifyForm',

      'attachedToContract.content.products',
      'attachedToContract.subContracts.content.products',
    ],
  };

  return axi
    .get<TquotationContentDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetQuotationContent_id = (id: string | undefined) => {
  const [res, setRes] = useState<TquotationContentDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      const newRes = await apiGetQuotationContent_Id(id);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得指定報價單內容資料失敗', content: err.message });
    }
  };

  const clearData = () => {
    setRes(undefined);
  };

  return {
    data: res,
    update,
    clearData,
  };
};

const apiGetQuotationContent_Id_2 = async (id: string, params?: Tparams) => {
  const api = `/quotation/content/${id}`;

  return axi
    .get<TquotationContentDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetQuotationContent_id_2 = (
  id: string | undefined | null,
  {
    params,
  }: {
    params?: Tparams;
  } = {}
) => {
  const [res, setRes] = useState<TquotationContentDto>();
  const [isLoading, setIsLoading] = useState(false);

  const theParams: Tparams = {
    ...params,
  };

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      const newRes = await apiGetQuotationContent_Id_2(id, theParams);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得指定報價單內容資料失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: res,
    isLoading,
    update,
    setData: setRes,
  };
};

// ================================================================
type TgetContracts = {
  data: TquotationContractDto[];
  meta: TpageMetaDto;
};

export const apiGetContract = async (params?: Tparams) => {
  const api = '/quotation/contracts';

  // params = {
  //   ...params,
  //   populate: [
  //     'content.customer',
  //     'content.agentEmployee',
  //     'content.reviewSalesEmployee',
  //     'content.reviewWorkDirectorEmployee',
  //     'content.reviewSupervisorEmployee',
  //     'content.reviewSalesManagerEmployee',
  //     'content.products.quantity',
  //     'content.products.options',
  //   ],
  // };

  return axi
    .get<TgetContracts>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetContract = (customParams?: Tparams) => {
  const [res, setRes] = useState<TgetContracts>();

  const params: Tparams = {
    populate: [
      'content.customer',
      'content.agentEmployee',
      'content.reviewSalesEmployee',
      'content.reviewWorkDirectorEmployee',
      'content.reviewCashierEmployee',
      'content.reviewSupervisorEmployee',
      'content.reviewSalesManagerEmployee',
      'content.reviewSalesManagerEmployee',
      'content.products.quantity',
      'content.products.options',
    ],
    ...customParams,
  };

  const update = async () => {
    try {
      const newRes = await apiGetContract(params);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得合約資料失敗', content: err.message });
    }
  };

  return {
    data: res?.data,
    meta: res?.meta,
    update,
  };
};

export const useContract_infinite_2 = createUseInfinite<TgetContracts>({
  apiClient: apiGetContract,
  errTitle: '取得合約資料失敗',
});

export const useContract_infinite = ({ customParams }: { customParams?: Tparams }) => {
  /**resetCount就只是用來使呼叫reset後，若page沒有改變的話，還是可以觸發update*/
  const [resetCount, setResetCount] = useState(0);
  const [isLoadingPage1, setIsLoadingPage1] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [viewRef_top, inView_top] = useInView();
  const [viewRef_bottom, inView_bottom] = useInView();
  // ----------------------------------------------------------------
  const [dataList_raw, setDataList_raw] = useState<{ [id: string]: TquotationContractDto }>({});
  const [dataList, setDataList] = useState<{ [page: `${number}`]: TquotationContractDto[] }>({});

  const [page, setPage] = useState<number>();
  const [meta, setMeta] = useState<TpageMetaDto>();
  const [hasNextPage, setHasNextPage] = useState<boolean>();

  // ----------------------------------------------------------------
  const defaultParams = {
    page,
    populate: [
      'content.customer',
      'content.agentEmployee',
      'content.reviewSalesEmployee',
      'content.reviewWorkDirectorEmployee',
      'content.reviewCashierEmployee',
      'content.reviewSupervisorEmployee',
      'content.reviewSalesManagerEmployee',
      'content.products.quantity',
      'content.products.options',
    ],
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

      const res = await apiGetContract(params);

      if (res) {
        const arr = res.data;

        setDataList_raw((list) => {
          const copy = { ...list };

          arr.forEach((item) => {
            copy[item.id] = item;
          });

          return copy;
        });

        setDataList((list) => {
          list[`${res.meta.page}`] = arr;

          return { ...list };
        });
        setMeta(res.meta);
        setHasNextPage(res.meta.hasNextPage);
      }

      return res;
      //
    } catch (error) {
      myAlert.err({ title: '取得合約資料失敗' });
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
    setPage(undefined);
    setHasNextPage(undefined);
    setResetCount(0);
  };

  const reset = () => {
    setDataList({});
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

  // 簽回
  const reqSignedBack = async (contractId: string, signedBack = true) => {
    await apiPatchContractStatus(contractId, { isSignedBack: signedBack })
      .then(() => {
        // const id = res.id;
        setDataList_raw((list) => {
          const copy = { ...list };
          list[contractId].isSignedBack = signedBack;

          return copy;
        });
      })
      .catch(() => true);
  };

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
    reqSignedBack,
  };
};

export const useContract_infinite_topBottom = ({
  startPage = 1,
  customParams,
}: {
  startPage?: number;
  customParams?: Omit<Tparams, 'page'>;
}) => {
  const ref_container = useRef<HTMLDivElement>(null);

  const [isLoadingPage1, setIsLoadingPage1] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [viewRef_top, inView_top] = useInView();
  const [viewRef_bottom, inView_bottom] = useInView();

  const [rawDataList, setRawDataList] = useState<{ [id: string]: TquotationContractDto }>();
  // const [dataPage, setDataPage] = useState<{ [page: `${number}`]: TquotationContractDto[] }>({});
  const [rawData_page, setRawData_page] = useState<{
    [page: `${number}`]: { [id: string]: TquotationContractDto };
  }>();

  const [page, setPage] = useState<number>(startPage);
  // 用meta判斷是否已經有資料
  const [meta, setMeta] = useState<TpageMetaDto>();

  const [isFetchingPrev, setIsFetchingPrev] = useState(false);

  // ------------------------------------------------------------

  const defaultParams = {
    populate: [
      'content.customer',
      'content.agentEmployee',
      'content.reviewSalesEmployee',
      'content.reviewWorkDirectorEmployee',
      'content.reviewCashierEmployee',
      'content.reviewSupervisorEmployee',
      'content.reviewSalesManagerEmployee',
      'content.products.quantity',
      'content.products.options',
    ],
  };

  const update = async () => {
    const params = {
      page,
      ...defaultParams,
      ...customParams,
      populate: [...defaultParams.populate, ...(customParams?.populate ?? [])],
    };
    //

    !meta && setIsLoadingPage1(true);
    setIsloading(true);

    await apiGetContract(params)
      .then(async (firstRes) => {
        if (!rawDataList) {
          const secondRes = await apiGetContract({ ...params, page: params.page + 1 });

          return {
            firstRes,
            secondRes,
          };
        }

        return {
          firstRes,
          secondRes: undefined,
        };
      })
      .then(({ firstRes, secondRes }) => {
        const { data: raw_data_1st, meta: meta_1st } = firstRes;
        const { data: raw_data_2nd, meta: meta_2nd } = secondRes ?? {};

        const list_1st = raw_data_1st.reduce((acc, item) => {
          acc[item.id] = item;

          return acc;
        }, {} as { [id: string]: TquotationContractDto });

        const list_2nd = raw_data_2nd?.reduce((acc, item) => {
          acc[item.id] = item;

          return acc;
        }, {} as { [id: string]: TquotationContractDto });

        setRawDataList((state) => ({
          ...state,
          ...list_1st,
          ...list_2nd,
        }));

        setRawData_page((state) => {
          const copy = { ...state };
          copy[`${meta_1st.page}`] = list_1st;

          if (meta_2nd?.page && list_2nd) {
            copy[`${meta_2nd.page}`] = list_2nd;
          }

          return copy;
        });

        setMeta(meta_2nd || meta_1st);
        setPage(meta_2nd?.page ?? meta_1st.page);
      })
      .catch((err) => {
        setPage(meta?.page ?? startPage);

        myAlert.err({ title: `取得第${page}頁合約資料失敗` });

        return err;
      })
      .finally(() => {
        setIsloading(false);
        setIsLoadingPage1(false);
      });
  }; // update

  const nextPage = () => {
    if (!meta || !rawData_page) {
      return;
    }

    const pageArr = _.sortBy(Object.keys(rawData_page));
    const nextPage = Number(pageArr[pageArr.length - 1]) + 1;

    if (nextPage > meta?.pageCount) {
      return;
    }

    setPage(nextPage);
  };

  const prevPage = () => {
    if (!meta || !rawData_page) {
      return;
    }

    const pageArr = _.sortBy(Object.keys(rawData_page));
    const prevPage = Number(pageArr[0]) - 1;

    // 決定不考慮第零頁甚至負數頁的情形
    if (prevPage < 1) {
      return;
    }

    setPage(prevPage);
    setIsFetchingPrev(true);
  };

  const reset = () => {
    setIsLoadingPage1(false);
    setIsloading(false);
    setRawDataList({});
    setRawData_page({});
    setMeta(undefined);
    setPage(1);
  };

  const getRawDataArr = () => {
    return Object.values(rawData_page ?? {}).flatMap((page) => Object.values(page));
  };

  useEffect(() => {
    inView_top && prevPage();
  }, [inView_top]);
  useEffect(() => {
    inView_bottom && nextPage();
  }, [inView_bottom]);

  useEffect(() => {
    if (meta?.page === page || isLoadingPage1 || isLoading) {
      return;
    }

    (async () => {
      await update();

      // 取得前頁資料後保持與底部的距離
      // 也就是說不會取得前頁資料後就跳到最上面
      if (isFetchingPrev && ref_container?.current) {
        // 再畫面渲染前，取得與底部距離
        const scrollHeight = ref_container.current.scrollHeight;
        const scrollTop = ref_container.current.scrollTop;
        const distanceToBottom = scrollHeight - scrollTop; // 與底部距離
        setIsFetchingPrev(false);

        // 這個setTimeout會在畫面渲染後再執行
        setTimeout(() => {
          if (ref_container?.current) {
            // 畫面渲染後取得新的高
            const scrollHeight = ref_container.current.scrollHeight;

            ref_container.current.scrollTop = scrollHeight - distanceToBottom;
          }
        }, 0);
      }
      //
    })();
  }, [page, !!meta, isLoadingPage1, isLoading]);

  return {
    isLoadingPage1,
    isLoading,
    viewRef_top,
    viewRef_bottom,
    rawDataList,
    rawData_page,
    getRawDataArr,
    page,
    meta,
    reset,
    ref_container,
  };
}; //  useContract_infinite_topBottom

export const apiGetContract_employee = async (employeeId: string, params?: Tparams) => {
  const api = `/quotation/contracts/employee/${employeeId}`;

  return axi
    .get<TquotationContractDto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetContract_employee = (
  employeeId: string | undefined,
  { customParams }: { customParams?: Tparams } = {}
) => {
  const [res, setRes] = useState<TquotationContractDto[]>();

  const update = async () => {
    if (!employeeId) {
      return;
    }

    try {
      const newRes = await apiGetContract_employee(employeeId, customParams);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得合約資料失敗', content: err.message });
    }
  };

  return {
    data: res,
    update,
  };
};

export const apiGetContract_Id = async (contractId: string, params?: Tparams) => {
  const api = `/quotation/contracts/${contractId}`;

  return axi
    .get<TquotationContractDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetContract_id = (
  id: string | undefined,
  option?: {
    customPopulate?: string[];
    preBuiltPopulate?: keyof typeof lookpu_contractPopulate;
  }
) => {
  const preBuiltPopulate = lookpu_contractPopulate[option?.preBuiltPopulate ?? 'basic'];
  const customPopulate = option?.customPopulate ?? [];

  let populate = [...preBuiltPopulate, ...customPopulate];
  populate = _.uniq(populate);

  const params: Tparams = {
    populate,
  };

  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TquotationContractDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      setIsFetching(true);
      const newRes = await apiGetContract_Id(id, params);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得合約資料失敗', content: err.message });
    } finally {
      setIsFetching(false);
    }
  };

  return {
    data: res,
    update,
    clear: () => setRes(undefined),
    isFetching,
  };
};

export const useGetContract_id_strict = (
  id: string | undefined,
  option?: {
    customPopulate?: string[];
    preBuiltPopulate?: keyof typeof lookpu_contractPopulate;
  }
) => {
  const preBuiltPopulate = lookpu_contractPopulate[option?.preBuiltPopulate ?? 'basic'];
  const customPopulate = option?.customPopulate ?? [];

  let populate = [...preBuiltPopulate, ...customPopulate];
  populate = _.uniq(populate);

  const params: Tparams = {
    populate,
  };

  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TquotationContractDto>();

  const update = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      setIsFetching(true);
      const newRes = await apiGetContract_Id(id, params);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得合約資料失敗', content: err.message });
    } finally {
      setIsFetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, customPopulate, preBuiltPopulate]);

  return {
    data: res,
    update,
    clear: () => setRes(undefined),
    isFetching,
  };
};

export const useGetContract_id_noItems_2 = (id: string | undefined, customParams?: Tparams) => {
  const params: Tparams = {
    ...customParams,
    populate: [
      //
      ...lookpu_contractPopulate.contract_noItem02,
      ...(customParams?.populate ?? []),
    ],
  };

  const [res, setRes] = useState<TquotationContractDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      const newRes = await apiGetContract_Id(id, params);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得合約資料失敗', content: err.message });
    }
  };

  return {
    data: res,
    update,
    clear: () => setRes(undefined),
  };
};

export const useGetContract_id_forAttach = (id: string | undefined) => {
  const params: Tparams = {
    populate: [...lookpu_contractPopulate.forAttach],
  };

  const [res, setRes] = useState<TquotationContractDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    const newRes = await apiGetContract_Id(id, params);

    if (newRes) {
      setRes(newRes);
    }

    return newRes;
  };

  return {
    data: res,
    update,
  };
};

// region useGetContract_id_getItems
export const useGetContract_id_contentProductItems = (
  id: string | undefined,
  customParams?: Tparams,
  version?: string
) => {
  const params: Tparams = {
    ...customParams,
    populate: [
      //
      ...lookpu_contractPopulate.contract_noItem02,
      ...(customParams?.populate ?? []),
    ],
  };

  const [res, setRes] = useState<TquotationContractDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      const res = await apiGetContract_Id(id, params);

      if (res) {
        // const productArr = res.content.products;
        const productArr = await Promise.all(
          res.content.products.map(async (prod) => {
            const productId = prod.id;

            return await apiGetQuotationProducts(productId);
          })
        );

        res.content.products = productArr;

        const version_num = Number(version);

        if (version_num && version_num > 1) {
          const subContracts = res.subContracts;

          const theSubContract = res.subContracts.find((item) => {
            return item.version === version_num;
          });

          if (theSubContract) {
            const productArr = await Promise.all(
              theSubContract!.content.products.map(async (prod) => {
                const productId = prod.id;

                return await apiGetQuotationProducts(productId);
              })
            );
            theSubContract!.content.products = productArr;
          }
        }

        setRes(res);
      }

      return res;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得合約資料失敗', content: err.message });
    }
  };

  return {
    data: res,
    update,
    clear: () => setRes(undefined),
  };
};

export const apiGetContract_id_finalProductItem = async (contractId: string) => {
  const api = `/quotation/contracts/${contractId}/final-product-item`;

  const params = {
    propulate: [
      // 'items.latestWorksheetItem'
      // 'items.latestWorksheetItem.deliveryStatus',
      // 'items.latestWorksheetItem.deliveryStatus',
    ],
  };

  return axi
    .get<TquotationProductDto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetContract_id_finalProductItem = (contractId: string | undefined) => {
  const [res, setRes] = useState<TquotationProductDto[]>();
  const [isLoading, setIsLoading] = useState(false);

  const update = async () => {
    if (!contractId) {
      return;
    }

    try {
      setIsLoading(true);

      const newRes = await apiGetContract_id_finalProductItem(contractId);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得合約最終產品資料失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    data: res,
    update,
  };
};

// 取得主產品資料
export const apiGetQuotationProducts = async (productId: string) => {
  const api = `/quotation/products/${productId}`;

  return axi
    .get<TquotationProductDto>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 取得多筆主產品
// GET  quotation/multiProducts/:productIds
export const apiGetQuotationMultiProducts = async (productIds: string[]) => {
  const api = `/quotation/multiProducts/${productIds.join(',')}`;

  return axi
    .get<TquotationProductDto[]>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 合約簽回
export const apiPatchContractStatus = async (contractId: string, body: { isSignedBack: boolean }) => {
  const api = `/quotation/quotation-contract/${contractId}/status`;

  return axi
    .patch<TquotationContractDto>(api, body)
    .then(({ data }) => data)
    .catch((err: AxiosError<TapiError>) => {
      myAlert.err({ title: '合約簽回失敗', content: err.response?.data.message || err.message });

      return Promise.reject(err);
    });
};

// ==================================================================
export const apiPostQuotation = (body: TcreateQuotationContentDto) => {
  const api = '/quotation';

  return axi
    .post<TquotationDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiPatchQuotation = (body: TcreateQuotationContentDto, id: string) => {
  const api = `/quotation/${id}`;

  return axi
    .patch<TquotationDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 設定報價單審核人員
export const apiQuotationSubmitReview = (id: string, body: TsubmitReviewQotuationContentDto) => {
  const api = `/quotation/${id}/submit`;

  return axi
    .patch<TquotationContentDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 審核該報價單
export const apiQuotationReview = ({
  //
  id,
  body,
}: {
  id: string;
  body: TreviewQuotationContentDto;
}) => {
  const api = `/quotation/${id}/review`;

  return axi
    .patch<TquotationContentDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**送審 合約審核表 */
export function apiSubmitContracting({ contentId, body }: { contentId: string; body: TcreateQuotationVerifyFormDto }) {
  const api = `/quotation/${contentId}/submit-contracting`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
}

export const apiQuotationUnlock = (id: string) => {
  const api = `/quotation/${id}/unLock`;

  return axi
    .patch<undefined>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 編輯合約審核表，審核狀態會重置
export const apiPatchQuotationVerifyForm = ({
  //
  verifyForm,
  body,
}: {
  verifyForm: string;
  body: TcreateQuotationVerifyFormDto;
}) => {
  const api = `/quotation/verify-form/${verifyForm}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// ================================================================

/**取得報價單附件 */
export const apiGetQuotation_id_attachments = (id: string) => {
  const api = `/quotation/${id}/attachments`;

  return axi
    .get(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useQuotation_id_attachments = (id: string | undefined) => {
  const [res, setRes] = useState<TfileDto[]>();

  const update = async () => {
    if (!id) {
      return undefined;
    }

    const res = (await apiGetQuotation_id_attachments(id)) as TfileDto[];

    if (res) {
      setRes(res);
    }

    return res;
  };

  return {
    attachments: res,
    updateAttachments: update,
    domain,
  };
};

/**上傳報價單附件 */
export const apiPostQuotation_id_attachments = (id: string, body: FormData) => {
  const api = `/quotation/${id}/attachments`;

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**移除報價單附件 */
export const apiDelQuotation_id_attachments = (id: string, fileId: string) => {
  const api = `/quotation/${id}/attachments/${fileId}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// ================================================================

export const apiQuotationModify = (contractId: string, body: TcreateModifyQuotationDto) => {
  const api = `/quotation/${contractId}/modify`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// ================================================================

/**報價統計表 */
export const apiQuotationAccounting = (params: {
  year: number;
  month?: number | undefined;
  area: 'northern' | 'central' | 'southern' | 'eastern' | 'all';
  quotationStatus?: TquotationStatus | 'all';
}) => {
  const api = '/quotation/accounting';

  return axi
    .get<TquotationAccouting[]>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useQuotationAccounting = (params: {
  year: number | undefined;
  month: number | undefined;
  area: 'northern' | 'central' | 'southern' | 'eastern' | undefined | 'all';
  quotationStatus?: TquotationStatus | 'all';
}) => {
  const [res, setRes] = useState<TquotationAccouting[]>();

  const update = async () => {
    if (!params.year || !params.area) {
      return;
    }

    const okParams = {
      year: params.year,
      month: params.month,
      area: params.area,
      quotationStatus: params.quotationStatus,
    };

    const newRes = await apiQuotationAccounting(okParams);

    if (newRes) {
      setRes(newRes);
    }

    return newRes;
  };

  return {
    data: res,
    update,
  };
};

/**年度業績統計表 */
export const apiQuotationAccounting_years = () => {
  const api = '/quotation/accounting/years';

  return axi
    .get<TquotationAccouting_years[]>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useQuotationAccounting_years = () => {
  const [res, setRes] = useState<TquotationAccouting_years[]>();

  const update = async () => {
    const newRes = await apiQuotationAccounting_years();

    if (newRes) {
      setRes(newRes);
    }

    return newRes;
  };

  return {
    data: res,
    update,
  };
};

/**全區業績統計表 */
export const apiQuotationAccounting_area = (params: { year: number; month?: number | undefined }) => {
  const api = '/quotation/accounting/area';

  return axi
    .get<TquotationAccouting_area[]>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useQuotationAccounting_area = (params: { year?: number | undefined; month?: number | undefined }) => {
  const [res, setRes] = useState<TquotationAccouting_area[]>();

  const update = async () => {
    if (!params.year) {
      return;
    }

    const theParams = {
      ...params,
      year: params.year,
    };

    const newRes = await apiQuotationAccounting_area(theParams);

    if (newRes) {
      setRes(newRes);
    }

    return newRes;
  };

  return {
    data: res,
    update,
  };
};

type Tparam_accounting_modifyContract = {
  // employeeId: string;
  year: number;
  month?: number | undefined;
  area: string;
};

/**追加工程統計表 */
const apiQuotationAccounting_modifyContract = async (params: Tparam_accounting_modifyContract) => {
  // const api = `/quotation/accounting/modify-contract/${params.employeeId}`;
  const api = `/quotation/accounting/modify-contract`;

  return axi
    .get<TquotationAccounting_modifyContract[]>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**追加工程統計表 */
export const useQuotationAccounting_modifyContract = (params: {
  year: number | undefined;
  month: number | undefined;
  area:
    | ('northern' | 'central' | 'southern' | 'eastern' | 'all')
    | ('northern' | 'central' | 'southern' | 'eastern' | 'all')[];
}) => {
  const [res, setRes] = useState<TquotationAccounting_modifyContract[]>();

  const { area } = params;
  const areaStr = Array.isArray(area) ? area.join(',') : area;

  const update = async () => {
    if (!params.year || !params.area) {
      return;
    }

    const okParams = {
      year: params.year,
      month: params.month,
      // area: params.area,
      area: areaStr,
    };

    const newRes = await apiQuotationAccounting_modifyContract(okParams);

    if (newRes) {
      setRes(newRes);
    }

    return newRes;
  };

  return {
    data: res,
    update,
  };
};

type Tparam_accounting_personalContract = {
  employeeId: string;
  year: number;
  month?: number | undefined;
};

/**個人業績統計表_合約 */
const apiQuotationAccounting_personalContract = async (params: Tparam_accounting_personalContract) => {
  const api = `/quotation/accounting/personal-contract/${params.employeeId}`;
  // const api = `/quotation/accounting/personal-quotation/${params.employeeId}`;

  return axi
    .get<TcontractAccountingReportFormDto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**個人業績統計表_合約 */
export const useQuotationAccounting_personalContract = (
  params: Omit<Tparam_accounting_personalContract, 'employeeId' | 'year'> & {
    employeeId?: string | undefined;
    year: number | undefined;
  }
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TcontractAccountingReportFormDto[]>();

  const update = async () => {
    if (!params.employeeId || !params.year) {
      setRes(undefined);

      return;
    }

    const theParams = {
      ...params,
      year: params.year,
      employeeId: params.employeeId,
    };

    setIsFetching(true);
    await apiQuotationAccounting_personalContract(theParams)
      .then((res) => {
        setRes(res);
      })
      .catch((err: AxiosError<TapiError>) => {
        myAlert.err({ title: '取得個人業績統計表失敗', content: err.response?.data.message || err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    data: res,
    update,
    isFetching,
  };
};

// ========================================================================

// 轉為準合約
export const apiPatchQuotationToPending = ({ contentId }: { contentId: string }) => {
  const api = `/quotation/content/${contentId}/to-pending`;

  return axi
    .patch(api)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '轉為準合約失敗', content: err.message });

      return Promise.reject(err);
    });
};
// 棄用
// export const apiPatchQuotationToPending = (id: string) => {
//   const api = `/quotation/${id}/to-pending`;

//   return axi
//     .patch(api)
//     .then(({ data }) => data)
//     .catch((error) => {
//       const err = error as AxiosError;
//       myAlert.err({ title: '轉為準合約失敗', content: err.message });

//       return Promise.reject(err);
//     });
// };

// 複製報價單
export const apiPostCopyQuotation = (body: TcopyQuotationDto) => {
  const api = '/quotation/copy-quotation';

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '複製報價單失敗', content: err.message });

      return Promise.reject(err);
    });
};

// ========================================================================

// 編輯報價單追蹤狀態
type TpatchQuotationContent_id_Progress = {
  trackProgress?: string | null;
  projectProgress?: string | null;
};

export const apiPatchQuotationContent_id_progress = (contentId: string, body: TpatchQuotationContent_id_Progress) => {
  const api = `/quotation/content/${contentId}/progress`;

  return axi
    .patch<TquotationContentDto>(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '編輯報價單失敗', content: err.message });

      return Promise.reject(err);
    });
};

// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================

const lookpu_contractPopulate = {
  basic: ['content'],
  // contract_noItem: [
  //   'content.customer',
  //   'content.agentEmployee',
  //   'content.supervisorEmployee',
  //   'content.managerEmployee',
  //   'content.reviewSalesEmployee',
  //   'content.reviewWorkDirectorEmployee',
  //   'content.reviewSupervisorEmployee',
  //   'content.reviewSalesManagerEmployee',
  //   'content.reviewManagerEmployee',

  //   'content.products',
  //   // 'content.products.items.accessories',
  //   // 'content.products.items.components',
  //   'content.others',
  //   'content.verifyForm',
  //   'accountReceivable',

  //   // 'rootContract.content.customer',
  //   // 'rootContract.content.agentEmployee',
  //   // 'rootContract.content.supervisorEmployee',
  //   // 'rootContract.content.managerEmployee',
  //   // 'rootContract.content.reviewSalesEmployee',
  //   // 'rootContract.content.reviewWorkDirectorEmployee',
  //   // 'rootContract.content.reviewSupervisorEmployee',
  //   // 'rootContract.content.reviewSalesManagerEmployee',
  //   // 'rootContract.content.others',
  //   // 'rootContract.content.products.items.accessories',
  //   // 'rootContract.content.products.items.components',

  //   // 'attachedToContract',
  //   // 'attachedContract',
  //   'subContracts.content.products.rootProductId',
  //   'subContracts.content.customer',
  //   'subContracts.content.verifyForm',

  //   'products',
  // ],
  contract_noItem02: [
    'content.customer',
    'content.designUnit',
    'content.agentEmployee',
    'content.supervisorEmployee',
    'content.managerEmployee',
    'content.reviewSalesEmployee',
    'content.reviewWorkDirectorEmployee',
    'content.reviewCashierEmployee',
    'content.reviewSupervisorEmployee',
    'content.reviewSalesManagerEmployee',
    'content.reviewManagerEmployee',
    'content.products',
    'content.others',
    'content.verifyForm',
    'subContracts.content.products.rootProductId',
    'subContracts.content.customer',
    'subContracts.content.verifyForm',
    'products', // contract下好像沒有products
  ],
  forAttach: [
    'content.customer',
    'content.designUnit',
    'content.agentEmployee',
    'content.supervisorEmployee',
    'content.managerEmployee',
    'content.reviewSalesEmployee',
    'content.reviewWorkDirectorEmployee',
    'content.reviewCashierEmployee',
    'content.reviewSupervisorEmployee',
    'content.reviewSalesManagerEmployee',
    'content.products.items.accessories',
    'content.products.items.components',
    'content.others',
    'subContracts.content.products.rootProductId',
  ],

  worksDepartment: ['content', 'accountReceivable', 'content.verifyForm'],
  worksDepartment02: ['content.others', 'subContracts.content.products.rootProductId'],
  worksDepartment03: ['content', 'subContracts.content'],
} as const;

// ================================================================
type TquotationPopulateList = 'simple' | 'attached';

type Tclass_quotationPopulate = {
  [key in TquotationPopulateList]: string[];
};

class class_quotationPopulate implements Tclass_quotationPopulate {
  constructor() {}

  simple = [
    'contents.customer',
    'contents.designUnit',
    'latestContent.customer',
    'latestContent.designUnit',
    'latestContent.agentEmployee',
    'latestContent.supervisorEmployee',
    'latestContent.managerEmployee',

    'latestContent.reviewSalesEmployee',
    'latestContent.reviewSupervisorEmployee',
    'latestContent.reviewSalesManagerEmployee',
    'latestContent.reviewWorkDirectorEmployee',
    'latestContent.reviewCashierEmployee',
    'latestContent.reviewManagerEmployee',

    'latestContent.products',

    'latestContent.others',
    'latestContent.verifyForm',
  ];

  attached = ['attachedToContract.content.products', 'attachedToContract.subContracts.content.products'];

  getPopulate = (populateNameArr: TquotationPopulateList[]) => {
    let arr: string[] = [];
    populateNameArr.forEach((name) => {
      arr = arr.concat(this[name]);
    });

    arr = _.uniq(arr);

    return arr;
  };
}

const quotationPopulateGeter = new class_quotationPopulate().getPopulate;
