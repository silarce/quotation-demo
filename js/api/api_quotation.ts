// apiGetQuotationProducts

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi, domain } from './_axiosCreator';
import { createUseInfinite } from './createUseInfinite';

// type
import type {
  Tparams,
  TpageMetaDto,
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
  TquotationAccounting_personal_contract,
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
  TquotationAccounting_personal_contract,
} from './dtoTypes';

type TgetQuotation = {
  data: TquotationDto[];
  meta: TpageMetaDto;
};

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
      'latestContent.reviewSupervisorEmployee',
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

export const useGetQuotation_infinite = createUseInfinite<TgetQuotation>({
  //
  apiClient: apiGetQuotation,
  errTitle: '取得報價單失敗',
});

export const apiGetQuotation_Id = async (id: string) => {
  const api = `/quotation/${id}`;

  const params = {
    populate: [
      // 'contents',
      'contents.customer',
      'latestContent.customer',
      'latestContent.agentEmployee',
      'latestContent.supervisorEmployee',
      'latestContent.managerEmployee',

      'latestContent.reviewSalesEmployee',
      'latestContent.reviewWorkDirectorEmployee',
      'latestContent.reviewSupervisorEmployee',
      'latestContent.reviewManagerEmployee',

      'latestContent.products.items.accessories',
      'latestContent.products.items.components',
      'latestContent.products.items.rootProdductId',
      'latestContent.others',
      'latestContent.verifyForm',

      'attachedToContract.content.products',
      'attachedToContract.subContracts.content.products',
      // 'subContracts.content.products',
    ],
  };

  return axi
    .get<TquotationDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetQuotation_id = (id: string | undefined) => {
  const [res, setRes] = useState<TquotationDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    const newRes = await apiGetQuotation_Id(id);

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

const apiGetQuotationContent_Id = async (id: string) => {
  const api = `/quotation/content/${id}`;

  const params = {
    populate: [
      'customer',
      'agentEmployee',
      'supervisorEmployee',
      'managerEmployee',
      'reviewSalesEmployee',
      'reviewWorkDirectorEmployee',
      'reviewSupervisorEmployee',
      'reviewManagerEmployee',

      'products.items.accessories',
      'products.items.components',
      'products.items.rootProdductId',
      'others',
      'verifyForm',
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

    const newRes = await apiGetQuotationContent_Id(id);

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
      'content.reviewSupervisorEmployee',
      'content.products.quantity',
      'content.products.options',
    ],
    ...customParams,
  };

  const update = async () => {
    const newRes = await apiGetContract(params);

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

export const useContract_infinite = ({ customParams }: { customParams?: Tparams }) => {
  /**resetCount就只是用來使呼叫reset後，若page沒有改變的話，還是可以觸發update*/
  const [resetCount, setResetCount] = useState(0);
  const [isLoadingPage1, setIsLoadingPage1] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [viewRef_top, inView_top] = useInView();
  const [viewRef_bottom, inView_bottom] = useInView();
  // ----------------------------------------------------------------
  const [dataList, setDataList] = useState<{ [key: `${number}`]: TquotationContractDto[] }>({});

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
      'content.reviewSupervisorEmployee',
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
        setDataList((list) => {
          list[`${res.meta.page}`] = res.data;

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
  };
};

export const apiGetContract_Id = async (contractId: string, params?: Tparams) => {
  const api = `/quotation/contracts/${contractId}`;

  return axi
    .get<TquotationContractDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetContract_id = (id: string | undefined) => {
  const params: Tparams = {
    populate: [
      // 'contents',
      'content.customer',
      'content.agentEmployee',
      'content.supervisorEmployee',
      'content.managerEmployee',
      'content.reviewSalesEmployee',
      'content.reviewWorkDirectorEmployee',
      'content.reviewSupervisorEmployee',
      'content.products.items.accessories',
      'content.products.items.components',
      'content.others',

      // 'rootContract.content.customer',
      // 'rootContract.content.agentEmployee',
      // 'rootContract.content.supervisorEmployee',
      // 'rootContract.content.managerEmployee',
      // 'rootContract.content.reviewSalesEmployee',
      // 'rootContract.content.reviewWorkDirectorEmployee',
      // 'rootContract.content.reviewSupervisorEmployee',
      'rootContract.content.products.items.accessories',
      'rootContract.content.products.items.components',
      'rootContract.content.others',

      // 'attachedToContract',
      // 'attachedContract',
      'subContracts.content.products',
    ],
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

export const useGetContract_id_noItems = (id: string | undefined, customParams?: Tparams) => {
  const params: Tparams = {
    ...customParams,
    populate: [
      // 'contents',
      'content.customer',
      'content.agentEmployee',
      'content.supervisorEmployee',
      'content.managerEmployee',
      'content.reviewSalesEmployee',
      'content.reviewWorkDirectorEmployee',
      'content.reviewSupervisorEmployee',
      'content.reviewManagerEmployee',

      'content.products',
      // 'content.products.items.accessories',
      // 'content.products.items.components',
      'content.others',
      'content.verifyForm',
      'accountReceivable',

      // 'rootContract.content.customer',
      // 'rootContract.content.agentEmployee',
      // 'rootContract.content.supervisorEmployee',
      // 'rootContract.content.managerEmployee',
      // 'rootContract.content.reviewSalesEmployee',
      // 'rootContract.content.reviewWorkDirectorEmployee',
      // 'rootContract.content.reviewSupervisorEmployee',
      // 'rootContract.content.others',
      // 'rootContract.content.products.items.accessories',
      // 'rootContract.content.products.items.components',

      // 'attachedToContract',
      // 'attachedContract',
      'subContracts.content.products.rootProdductId',
      'subContracts.content.customer',
      'subContracts.content.verifyForm',

      'products',

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
    populate: [
      // 'contents',
      'content.customer',
      'content.agentEmployee',
      'content.supervisorEmployee',
      'content.managerEmployee',
      'content.reviewSalesEmployee',
      'content.reviewWorkDirectorEmployee',
      'content.reviewSupervisorEmployee',
      'content.products.items.accessories',
      'content.products.items.components',
      'content.others',

      // 'rootContract.content.customer',
      // 'rootContract.content.agentEmployee',
      // 'rootContract.content.supervisorEmployee',
      // 'rootContract.content.managerEmployee',
      // 'rootContract.content.reviewSalesEmployee',
      // 'rootContract.content.reviewWorkDirectorEmployee',
      // 'rootContract.content.reviewSupervisorEmployee',
      // 'rootContract.content.products.items.accessories',
      // 'rootContract.content.products.items.components',
      // 'rootContract.content.others',

      // 'attachedToContract',
      // 'attachedContract',
      'subContracts.content.products.rootProdductId',
    ],
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

/**取得主產品資料 */
export const apiGetQuotationProducts = async (productId: string) => {
  const api = `/quotation/products/${productId}`;

  return axi
    .get<TquotationProductDto>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
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
export const apiQuotationReview = ({ id, body }: { id: string; body: TreviewQuotationContentDto }) => {
  const api = `/quotation/${id}/review`;

  return axi
    .patch<undefined>(api, body)
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

export const apiQuotationunLock = (id: string) => {
  const api = `/quotation/${id}/unLock`;

  return axi
    .patch<undefined>(api)
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
  month: number;
  area: 'northern' | 'central' | 'southern' | 'eastern' | 'all';
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
}) => {
  const [res, setRes] = useState<TquotationAccouting[]>();

  const update = async () => {
    if (!params.year || !params.month || !params.area) {
      return;
    }

    const okParams = {
      year: params.year,
      month: params.month,
      area: params.area,
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
export const apiQuotationAccounting_area = (params: { year: number; month: number }) => {
  const api = '/quotation/accounting/area';

  return axi
    .get<TquotationAccouting_area[]>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useQuotationAccounting_area = (params: { year: number; month: number }) => {
  const [res, setRes] = useState<TquotationAccouting_area[]>();

  const update = async () => {
    const newRes = await apiQuotationAccounting_area(params);

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
  employeeId: string;
  year: number;
  month: number;
  area: string;
};

/**追加工程統計表 */
const apiQuotationAccounting_modifyContract = async (params: Tparam_accounting_modifyContract) => {
  const api = `/quotation/accounting/modify-contract/${params.employeeId}`;

  return axi
    .get(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**追加工程統計表 */
const useQuotationAccounting_modifyContract = (params: Tparam_accounting_modifyContract) => {
  const [res, setRes] = useState<object[]>();

  const update = async () => {
    const newRes = await apiQuotationAccounting_modifyContract(params);

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

// /quotation/accounting/personal-contract/{employeeId}

type Tparam_accounting_personalContract = {
  employeeId: string;
  year: number;
  month: number;
};

/**個人業績統計表_合約 */
const apiQuotationAccounting_personalContract = async (params: Tparam_accounting_personalContract) => {
  const api = `/quotation/accounting/personal-contract/${params.employeeId}`;
  // const api = `/quotation/accounting/personal-quotation/${params.employeeId}`;

  return axi
    .get<TquotationAccounting_personal_contract[]>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**個人業績統計表_合約 */
export const useQuotationAccounting_personalContract = (params: Tparam_accounting_personalContract) => {
  const [res, setRes] = useState<object[]>();

  const update = async () => {
    const newRes = await apiQuotationAccounting_personalContract(params);

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
