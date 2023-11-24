// apiGetQuotationProducts

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi } from './_axiosCreator';

// type
import type {
  Tparams,
  TpageMetaDto,
  TengineeringContactDto,
  TupdateEngineeringContactDto,
  TcreateEngineeringContactDto,
  TdispatchingDto,
  TcreateDispatchingDto,
  TelectronicSuppliesDto,
  TcreateElectronicSuppliesDto,
  TupdateElectronicSuppliesDto,
  TexchangeDto,
  TcreateExchgangeDto,
  TcreateElectronicSuppliesRecordDto,
  TworkSheetDto,
  TcreateWorkSheetDto,
  TupdateWorkSheetItem,
  TupdateWorkSheet,
  TengineeringDeliveryListDto,
  TfileDto,
  TupdateEngineeringDeliveryStatusDto,
  TcreateEngineeringDeliveryStatusDto,
  TdeliveryStatusDto,
  TupdateEngineeringDeliveryListDto,
} from './dtoTypes';

export type {
  Tparams,
  TpageMetaDto,
  TengineeringContactDto,
  TupdateEngineeringContactDto,
  TcreateEngineeringContactDto,
  TdispatchingDto,
  TcreateDispatchingDto,
  TelectronicSuppliesDto,
  TcreateElectronicSuppliesDto,
  TupdateElectronicSuppliesDto,
  TexchangeDto,
  TcreateExchgangeDto,
  TcreateElectronicSuppliesRecordDto,
  TupdateWorkSheetItem,
  TupdateWorkSheet,
  TengineeringDeliveryListDto,
  TupdateDeliveryStatus,
  TfileDto,
  TupdateEngineeringDeliveryStatusDto,
  TcreateEngineeringDeliveryStatusDto,
  TdeliveryStatusDto,
  TupdateEngineeringDeliveryListDto,
} from './dtoTypes';

// ========================================================================

/**以id取得工程聯絡單 */
export const apiGetEngineeringContact = async (id: string) => {
  const api = `/engineering/engineering-contact/${id}`;

  return axi
    .get<TengineeringContactDto>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**以id取得工程聯絡單 */
export const useGetEngineeringContact = (id: string | undefined | null) => {
  const [res, setRes] = useState<TengineeringContactDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      const newRes = await apiGetEngineeringContact(id);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得工程聯絡單失敗', content: err.message });

      return;
    }
  };

  return {
    data: res,
    update,
  };
};

/**以id更新工程聯絡單 */
export const apiPatchEngineeringContact = async (id: string, body: TupdateEngineeringContactDto) => {
  const api = `/engineering/engineering-contact/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**新增工程聯絡單 */
export const apiPostEngineeringContact = async (body: TcreateEngineeringContactDto) => {
  const api = `/engineering/engineering-contact`;

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// ------------------------------------------------------------------------

type TgetDispatchingList = {
  data: TdispatchingDto[];
  meta: TpageMetaDto;
};

/**取得派工單列表 */
export const apiGetEngineeringDispatchingList = async (params?: Tparams) => {
  const api = '/engineering/dispatching-list';

  return axi
    .get<TgetDispatchingList>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**取得派工單列表 */
export const useGetEngineeringDispatchingList = (customParams?: Tparams) => {
  const [res, setRes] = useState<TgetDispatchingList>();

  const params = {
    populate: ['workerEmployee'],
    ...customParams,
  };

  const update = async () => {
    const newRes = await apiGetEngineeringDispatchingList(params);

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

/**以 id 取得派工單 DisPatching */
export const apiGetEngineeringDispatching_id = async (id: string, params: Tparams) => {
  const api = `/engineering/dispatching/${id}`;

  return axi
    .get<TdispatchingDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetEngineeringDispatching_id = (id: string | undefined, customeParams?: Tparams) => {
  const [res, setRes] = useState<TdispatchingDto>();

  const params = {
    populate: ['workerEmployee'],
    ...customeParams,
  };

  const update = async () => {
    if (!id) {
      return;
    }

    const newRes = await apiGetEngineeringDispatching_id(id, params);

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

/**新增派工單 */
export const apiPostEngineeringDispatching = async (body: TcreateDispatchingDto) => {
  const api = '/engineering/dispatching';

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**更新派工單 */
export const apiPatchEngineeringDispatching = async (id: string, body: TcreateDispatchingDto) => {
  const api = `/engineering/dispatching/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// ------------------------------------------------------------------------
// 送電備品

type TgetElectronicSupplies = {
  data: TelectronicSuppliesDto[];
  meta: TpageMetaDto;
};

/**取得送電備品列表 */
export const apiGetElectronicSupplies = async (params?: Tparams) => {
  const api = `/engineering/electronic-supplies`;

  return axi
    .get<TgetElectronicSupplies>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetElectronicSupplies = (customParams?: Tparams) => {
  const [res, setRes] = useState<TgetElectronicSupplies>();

  const params = {
    populate: [
      'contractId',
      //  'contract',
      'quotationId',
      //  'quotation'
    ],
    ...customParams,
  };

  const update = async () => {
    const newRes = await apiGetElectronicSupplies(params);

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

export const useElectronicSupplies_infinite = ({ customParams }: { customParams?: Tparams } = {}) => {
  /**resetCount就只是用來使呼叫reset後，若page沒有改變的話，還是可以觸發update*/
  const [resetCount, setResetCount] = useState(0);
  const [isLoadingPage1, setIsLoadingPage1] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [viewRef_top, inView_top] = useInView();
  const [viewRef_bottom, inView_bottom] = useInView();
  // ----------------------------------------------------------------
  const [dataList, setDataList] = useState<{ [key: `${number}`]: TelectronicSuppliesDto[] }>({});

  const [page, setPage] = useState<number>();
  const [meta, setMeta] = useState<TpageMetaDto>();
  const [hasNextPage, setHasNextPage] = useState<boolean>();

  // ----------------------------------------------------------------
  const defaultParams = {
    page,
    populate: ['contract'],
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

      const res = await apiGetElectronicSupplies(params);

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
      myAlert.err({ title: '取得列表失敗' });
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

export const apiGetElectronicSupplies_id = async (id: string) => {
  const api = `/engineering/electronic-supplies/${id}`;

  const params = {
    populate: [
      'contractId',
      //  'contract',
      'electronicSuppliesRecords',
      'materialHandler',
      'ingredientTechnician',
      'formCompleter',
    ],
  };

  return axi
    .get<TelectronicSuppliesDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetElectronicSupplies_id = (id: string | undefined) => {
  const [res, setRes] = useState<TelectronicSuppliesDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    const newRes = await apiGetElectronicSupplies_id(id);

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

/**新增送電備品表 */
export const apiPostElectronicSupplies = async (body: TcreateElectronicSuppliesDto) => {
  const api = '/engineering/electronic-supplies';

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**更新送電備品表 */
export const apiPatchElectronicSupplies = async (id: string, body: TupdateElectronicSuppliesDto) => {
  const api = `/engineering/electronic-supplies/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// ------------------------------------------------------------------------
// 調退貨單

type TgetEngineeringExchanges = {
  data: TexchangeDto[];
  meta: TpageMetaDto;
};

/**取得調退貨單列表 */
export const apiGetEngineeringExchanges = async (params?: Tparams) => {
  const api = `/engineering/exchanges`;

  return axi
    .get<TgetEngineeringExchanges>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**取得調退貨單列表 */
export const useGetEngineeringExchanges = (customParams?: Tparams) => {
  const [res, setRes] = useState<TgetEngineeringExchanges>();

  const params = {
    populate: [
      'contractId',
      'contract.content',
      'exchangeRecord',
      // 'quotationId',
      //  'quotation'
    ],
    ...customParams,
  };

  const update = async () => {
    const newRes = await apiGetEngineeringExchanges(params);

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

/**以id取得調退貨單 */
export const apiGetEngineeringExchanges_id = async (id: string) => {
  const api = `/engineering/exchange/${id}`;

  const params = {
    populate: ['exchangeRecords', 'accounting', 'warehouseEmployee', 'factoryEmployee', 'supervisor', 'formCompleter'],
  };

  return axi
    .get<TexchangeDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**以id取得調退貨單 */
export const useGetEngineeringExchanges_id = (id: string | undefined) => {
  const [res, setRes] = useState<TexchangeDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    const newRes = await apiGetEngineeringExchanges_id(id);

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

export const apiPostEngineeringExchange = async (body: TcreateExchgangeDto) => {
  const api = `/engineering/exchange`;

  return axi
    .post<TexchangeDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiPatchEngineeringExchange = async (id: string, body: TcreateExchgangeDto) => {
  const api = `/engineering/exchange/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 調退貨單圖示
export const apiGetEngineeringExchangeAttachments = async (id: string) => {
  const api = `/engineering/exchange/${id}/attachments`;

  return axi
    .get<TfileDto[]>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useApiGetEngineeringExchangeAttachments = (id: string | undefined) => {
  const [res, setRes] = useState<TfileDto[]>();

  const update = async () => {
    if (!id) {
      return undefined;
    }

    const res = await apiGetEngineeringExchangeAttachments(id);

    if (res) {
      setRes(res);
    }

    return res;
  };

  return {
    attachments: res,
    updateAttachments: update,
  };
};

export const apiPostEngineeringExchangeAttachments = async (id: string, body: FormData) => {
  const api = `/engineering/exchange/${id}/attachments`;

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiDeleteEngineeringExchangeAttachments = async (id: string, fileId: string) => {
  const api = `/engineering/exchange/${id}/attachments/${fileId}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// =============================================================================
// 工作表

export const apiGetWorkSheet = (id: string) => {
  const api = `/engineering/worksheet/${id}`;

  const params = {
    populate: [
      'contractProductItems.product',
      'contractProductItems.components',
      'contractProductItems.accessories',
      'contractProductItems.adjustedItem.components',
      'contractProductItems.adjustedItem.accessories',
    ],
  };

  return axi
    .get<TworkSheetDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetWorkSheet = (id: string | undefined | null) => {
  const [res, setRes] = useState<TworkSheetDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      const res = await apiGetWorkSheet(id);

      if (res) {
        setRes(res);
      }

      return res;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得工作表失敗', content: err.message });

      return;
    }
  };

  return {
    workSheet: res,
    update_workSheet: update,
  };
};

export const apiPostWorkSheet = (body: TcreateWorkSheetDto) => {
  const api = '/engineering/worksheet';

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiPatchWorkSheet = (id: string, body: TupdateWorkSheet) => {
  const api = `/engineering/worksheet/${id}/products`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiDeleteWorkSheetItem = async (
  workSheetId: string,
  body: {
    contractProductItemsId?: string[];
    legacyContractProductItemsId?: string[];
  }
) => {
  const api = `/engineering/worksheet/${workSheetId}/contractItems`;

  return axi
    .delete(api, { data: body })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 出庫單

// 產生出庫單，後端已移除這個api
// export const apiPostEngineeringDeliveryList = (body: {
//   contractId?: string | null;
//   legacyContractId?: string | null;
// }) => {
//   const api = '/engineering/delivery-list';

//   return axi
//     .post(api, body)
//     .then(({ data }) => data)
//     .catch((err) => Promise.reject(err));
// };

export const apiGetEngineeringDeliveryList = (id: string) => {
  const api = `engineering/delivery-list/${id}`;

  const params = {
    populate: [
      'contract.worksheet.contractProductItems.deliveryStatus.installerEmployee',
      'contract.worksheet.contractProductItems.adjustedItem.accessories',
      'contract.worksheet.contractProductItems.accessories',
      'contract.worksheet.contractProductItems.rootproductId',
    ],
  };

  return axi
    .get<TengineeringDeliveryListDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetEngineeringDeliveryList = (id: string | undefined | null) => {
  const [res, setRes] = useState<TengineeringDeliveryListDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      const res = await apiGetEngineeringDeliveryList(id);

      if (res) {
        setRes(res);
      }

      return res;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得出庫單失敗', content: err.message });

      return;
    }
  };

  return {
    deliveryList: res,
    update_deliveryList: update,
  };
};

/**更新出庫單 */
export const apiPatchEngineeringDeliveryList = (id: string, body: TupdateEngineeringDeliveryListDto) => {
  const api = `/engineering/delivery-list/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 新增指定 DeliveryStatus
export const apiPostDeliveryStatus = ({
  //
  id,
  body,
}: {
  id: string; // 出庫單ID
  body: TcreateEngineeringDeliveryStatusDto;
}) => {
  const api = `/engineering/delivery-list/${id}/delivery-status`;

  return axi
    .post<TdeliveryStatusDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 更新指定 DeliveryStatus
export const apiPatchDeliveryStatus = ({
  id,
  statusId,
  body,
}: {
  id: string;
  statusId: string;
  body: TupdateEngineeringDeliveryStatusDto;
}) => {
  const api = `/engineering/delivery-list/${id}/delivery-status/${statusId}`;

  return axi
    .patch<TdeliveryStatusDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 刪除指定 DeliveryStatus
export const apiDeleteDeliveryStatus = ({ id, statusId }: { id: string; statusId: string }) => {
  const api = `/engineering/delivery-list/${id}/delivery-status/${statusId}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};
