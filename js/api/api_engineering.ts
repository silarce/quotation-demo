// apiGetQuotationProducts

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi } from './_axiosCreator';
import { AxiosError } from 'axios';

import { createUseInfinite } from './createUseInfinite';

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
  TworksheetDto,
  TcreateWorksheetDto,
  // TupdateWorkSheetItem,
  TupdateWorkSheet,
  TengineeringDeliveryListDto,
  TfileDto,
  TengineeringDeliveryStatusDto,
  TupdateEngineeringDeliveryStatusDto,
  TcreateEngineeringDeliveryStatusDto,
  TupdateEngineeringDeliveryListDto,
  TaccountsReceivablePeriodDto,
  TaccountsReceivableDto,
  TupdateAccountReceivableDto,
  TcreateAccountReceivablePeriodDto,
  TupdateAccountReceivablePeriodDto,
  TaccountantDto,
  TaccountsReceivableDeductionDto,
  TcreateAccountReceivableDeductionDto,
  TupdateAccountReceivableDeductionDto,
  TfinalProduct,
  TcreateAccountReceivableDto,
  // TaccountsReceivableProductPaymentDto,
  TcreateAccountReceivableProductPaymentDto,
  TupdateAccountReceivableProductPaymentDto,
  TsubmitEngineeringContactDto,
  TengineeringContactAttachmentType,
  TreviewEngineeringContactDto,
  TworksheetRecordDto,
  TsubmitWorksheetProductsItemsDto,
  TreviewWorksheetProductsItemsDto,
  TdeliveryStatusInstallationItem,
  TinvoiceType,
  TpageResponse,
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
  // TupdateWorkSheetItem,
  TupdateWorkSheet,
  TengineeringDeliveryListDto,
  TupdateDeliveryStatus,
  TfileDto,
  TengineeringDeliveryStatusDto,
  TupdateEngineeringDeliveryStatusDto,
  TcreateEngineeringDeliveryStatusDto,
  TengineeringDeliveryStatusDto as TdeliveryStatusDto,
  TupdateEngineeringDeliveryListDto,
  TaccountsReceivableDto as TaccountReceivableDto,
  TupdateAccountReceivableDto,
  //
  TaccountsReceivablePeriodDto,
  TcreateAccountReceivablePeriodDto,
  TupdateAccountReceivablePeriodDto,
  //
  TaccountantDto,
  TaccountsReceivableDeductionDto,
  TcreateAccountReceivableDeductionDto,
  TupdateAccountReceivableDeductionDto,
  TfinalProduct,
  TcreateAccountReceivableDto,
  // TaccountsReceivableProductPaymentDto,
  TcreateAccountReceivableProductPaymentDto,
  TupdateAccountReceivableProductPaymentDto,
  TcreateWorksheetDto,
  TsubmitEngineeringContactDto,
  TengineeringContactAttachmentType,
  TreviewEngineeringContactDto,
  TworksheetRecordDto,
  TsubmitWorksheetProductsItemsDto,
  TreviewWorksheetProductsItemsDto,
  TdeliveryStatusInstallationItem,
} from './dtoTypes';

type TgetEngineeringContact = {
  data: TengineeringContactDto[];
  meta: TpageMetaDto;
};

// ===========================================================================]

/**以id取得工程聯絡單 */
export const apiGetEngineeringContact = async (id: string) => {
  const api = `/engineering/engineering-contact/${id}`;

  const params = {
    populate: ['reviewWorkerEmployee', 'reviewManagerEmployee'],
  };

  return axi
    .get<TengineeringContactDto>(api, { params })
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

// 取得所有工程聯絡單
export const apiGetEngineeringContact_all = async (params?: Tparams) => {
  const api = `/engineering/engineering-contact`;

  return axi
    .get<TgetEngineeringContact>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetEngineeringContact_all = createUseInfinite<TgetEngineeringContact>({
  apiClient: apiGetEngineeringContact_all,
  errTitle: '取得工程聯絡單列表失敗',
});

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
    pageSize: 9999,
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
    pageSize: 9999,
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
    pageSize: 9999,
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
    .get<TworksheetDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetWorkSheet = (id: string | undefined | null) => {
  const [res, setRes] = useState<TworksheetDto>();

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

export const apiPostWorkSheet = (body: TcreateWorksheetDto) => {
  const api = '/engineering/worksheet';

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => {
      const error = err as AxiosError;
      myAlert.err({ title: '建立工作表失敗', content: error.message });

      return Promise.reject(err);
    });
};

const apiGetWorksheet_id = async (id: string, params?: Tparams) => {
  const api = `/engineering/worksheet/${id}`;

  return axi
    .get<TworksheetDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetWorksheet_id = (id: string | undefined | null, { params }: { params?: Tparams } = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [res, setRes] = useState<TworksheetDto>();

  params = {
    populate: [
      //
      'records.contractProductItems',
      'records.reviewSalesEmployee',
      'records.reviewManagerEmployee',
      'latestRecord.reviewSalesEmployee',
      'latestRecord.reviewManagerEmployee',
      'latestRecord.contractProductItems.components',
      'latestRecord.contractProductItems.accessories',
    ],
    ...params,
  };

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiGetWorksheet_id(id, params);

      if (res) {
        setRes(res);
      }

      return res;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得工作表失敗', content: err.message });
    } finally {
      setIsLoading(true);

      return;
    }
  };

  return {
    isLoading,
    data: res,
    update,
  };
};

export const apiDeleteWorksheet = async (worksheetId: string) => {
  const api = `/engineering/worksheet/${worksheetId}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => {
      const error = err as AxiosError;
      myAlert.err({ title: '刪除工作表失敗', content: error.message });

      return Promise.reject(err);
    });
};

export const apiPatchWorkSheetProducts = (id: string, body: TupdateWorkSheet) => {
  const api = `/engineering/worksheet/${id}/products`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => {
      const error = err as AxiosError;
      myAlert.err({ title: '更新工作表產品失敗', content: error.message });

      return Promise.reject(err);
    });
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

const apiGetWorksheetRecord_id = async (id: string, params?: Tparams) => {
  const api = `/engineering/worksheet/record/${id}`;

  params = {
    populate: [
      //
      'reviewSalesEmployee',
      'reviewManagerEmployee',
      'contractProductItems.components',
      'contractProductItems.accessories',
    ],
    ...params,
  };

  return axi
    .get(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useApiGetWorksheetRecord_id = (recordId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [res, setRes] = useState<TworksheetRecordDto>();

  const update = async () => {
    if (!recordId) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiGetWorksheetRecord_id(recordId);
      setRes(res);
    } catch (error) {
      const err = error as AxiosError;

      myAlert.err({ title: '取得工作表歷程記錄失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    data: res,
    update,
    clear: () => setRes(undefined),
  };
};

// 工作表送審
export const apiPatchWorksheetRecordSubmit = async (recordId: string, body: TsubmitWorksheetProductsItemsDto) => {
  const api = `/engineering/worksheet/worksheet-record/${recordId}/submit`;

  return axi
    .patch(api, body)
    .then(({ data }) => {
      myAlert.success({ title: '送審成功' });

      return data;
    })
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '送審工作表失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 工作表審核
export const apiPatchWorksheetRecordReview = async (recordId: string, body: TreviewWorksheetProductsItemsDto) => {
  const api = `/engineering/worksheet/worksheet-record/${recordId}/review`;

  return axi
    .patch(api, body)
    .then(({ data }) => {
      myAlert.success({ title: '審核成功' });

      return data;
    })
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '審核工作表失敗', content: err.message });

      return Promise.reject(error);
    });
};

// =============================================================================

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
      // 'contract.worksheet.contractProductItems.deliveryStatus.installerEmployees',
      // 'contract.worksheet.contractProductItems.deliveryStatus.installerOutsourcing',
      // 'contract.worksheet.contractProductItems.adjustedItem.accessories',
      // 'contract.worksheet.contractProductItems.accessories',
      // 'contract.worksheet.contractProductItems.rootproductId',
      'contract.worksheet.latestRecord.contractProductItems.deliveryStatus.installerEmployees',
      'contract.worksheet.latestRecord.contractProductItems.deliveryStatus.installerOutsourcing',
      'contract.worksheet.latestRecord.contractProductItems.adjustedItem.accessories',
      'contract.worksheet.latestRecord.contractProductItems.accessories',
      'contract.worksheet.latestRecord.contractProductItems.rootproductId',
      'contract.worksheet.latestRecord.contractProductItems.rootWorksheetItem',
      'contract.worksheet.latestRecord.contractProductItems.latestWorksheetItem ',
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
    .post<TengineeringDeliveryStatusDto>(api, body)
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
    .patch<TengineeringDeliveryStatusDto>(api, body)
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

// =============================================================================
// 應收帳款明細

type TgetAccountReceivableDto = {
  data: TaccountsReceivableDto[];
  meta: TpageMetaDto;
};

/**取得所有應收帳款明細 */
const apiGetAccountReceivable = async (params?: Tparams) => {
  const api = '/engineering/account-receivable';

  return axi
    .get<TgetAccountReceivableDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetAccountReceivable = createUseInfinite<TgetAccountReceivableDto>({
  apiClient: apiGetAccountReceivable,
  errTitle: '取得應收帳款明細列表失敗',
});

/**取得應收帳款明細 by id */
const apiGetAccountReceivable_id = async (id: string, params: Tparams) => {
  const api = `/engineering/account-receivable/${id}`;

  return axi
    .get<TaccountsReceivableDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**取得應收帳款明細 by id */
export const useGetAccountReceivable_id = (id: string, customeParams: Tparams) => {
  const [res, setRes] = useState<TaccountsReceivableDto>();

  const update = async (dynaParams: Tparams) => {
    const params = {
      ...customeParams,
      ...dynaParams,
    };

    const newRes = await apiGetAccountReceivable_id(id, params);

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

/**新增 應收帳款明細 account-receivable */
export const apiPostAccountReceivable = async (
  body: TcreateAccountReceivableDto,
  {
    callAlert = true,
  }: {
    callAlert?: boolean;
  } = {}
) => {
  const api = `/engineering/account-receivable`;

  return axi
    .post<TaccountsReceivableDto>(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      callAlert && myAlert.err({ title: '新增應收帳款明細失敗', content: err.message });

      return Promise.reject(err);
    });
};

/**更新 應收帳款明細 account-receivable */
export const apiPatchAccountReceivable = async (id: string, body: TupdateAccountReceivableDto) => {
  const api = `/engineering/account-receivable/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

//

type TgetAccountReceivableIncoices = {
  data: TaccountsReceivablePeriodDto[];
  meta: TpageMetaDto;
};

/**以 應收帳款id取得 所有 應收帳款發票 account-receivable */
export const apiGetAccountReceivableIncoices = async (accountReceivableId: string, params?: Tparams) => {
  const api = `/engineering/account-receivable/${accountReceivableId}/invoices`;

  return axi
    .get<TgetAccountReceivableIncoices>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**以 應收帳款id取得 所有 應收帳款發票 account-receivable */
export const useGetAccountReceivableIncoices = (
  accountReceivableId: string | undefined | null,
  customParams?: Tparams
) => {
  const [res, setRes] = useState<TgetAccountReceivableIncoices>();

  const params: Tparams = {
    populate: ['accountantList'],
    pageSize: 9999,
    sort: 'invoiceDate',
    order: 'DESC',
    ...customParams,
  };

  const update = async () => {
    if (!accountReceivableId) {
      return;
    }

    try {
      const newRes = await apiGetAccountReceivableIncoices(accountReceivableId, params);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得發票列表失敗', content: err.message });
    }
  };

  return {
    data: res?.data,
    meta: res?.meta,
    update,
  };
};

// 新增 應收帳款收款期數
export const apiPostAccountReceivablePeriod = async (
  accountReceivableId: string,
  body: TcreateAccountReceivablePeriodDto
) => {
  const api = `/engineering/account-receivable/${accountReceivableId}/period`;

  return axi
    .post<TaccountsReceivablePeriodDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 更新 應收帳款收款期數
export const apiPatchAccountReceivablePeriod = async (
  accountReceivableId: string,
  body: TupdateAccountReceivablePeriodDto
) => {
  const api = `/engineering/account-receivable/period/${accountReceivableId}`;

  return axi
    .patch<TaccountsReceivablePeriodDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 作廢 應收帳款 發票 account-receivable-invoice
export const apiPatchAccountReceivableVoidInvoice = async (id: string) => {
  const api = `/engineering/account-receivable/void-invoice/${id}`;

  return axi
    .patch<TaccountsReceivablePeriodDto>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**取得 所有 應收帳款 收款紀錄 account-receivable-accountant */
const apiGetAccountReceivableAccountants = async (id: string, params?: Tparams) => {
  const api = `/engineering/account-receivable/${id}/accountants`;

  return axi
    .get<TpageResponse<TaccountantDto>>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**取得 所有 應收帳款 收款紀錄 account-receivable-accountant */
export const useGetAccountReceivableAccountants = (
  accountReceivableId: string | undefined | null,
  customParams?: Tparams
) => {
  const [res, setRes] = useState<TpageResponse<TaccountantDto>>();

  const params = {
    populate: ['invoice.accountantList'],
    pageSize: 9999,
    ...customParams,
  };

  const update = async () => {
    if (!accountReceivableId) {
      return;
    }

    try {
      const newRes = await apiGetAccountReceivableAccountants(accountReceivableId, params);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得收款紀錄失敗', content: err.message });

      return undefined;
    }
  };

  return {
    data: res?.data,
    meta: res?.meta,
    update,
  };
};

/**新增 應收帳款 收款紀錄 account-receivable-accountant */
export const apiPostAccountReceivableAccountant = async (
  id: string, // 應收帳款Id 可以在contract下找到accountReceivableId
  body: {
    accountantId: string[]; // 收款明細Id
    type: TinvoiceType;
  },
  {
    callAlert = true,
  }: {
    callAlert?: boolean;
  } = {}
) => {
  const api = `/engineering/account-receivable/${id}/accountants`;

  return axi
    .post<TaccountantDto>(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;

      callAlert && myAlert.err({ title: '匯入收款紀錄失敗', content: err.message });

      return Promise.reject(err);
    });
};

/**刪除 應收帳款 收款紀錄關聯 account-receivable-accountant */
export const apiDeleteAccountReceivableAccountant = async (accountReceivableId: string, accountantId: string) => {
  const api = `/engineering/account-receivable/${accountReceivableId}/accountant/${accountantId}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**更新 收款紀錄與發票關聯 account-receivable-accountant */
export const apiPatchAccountReceivableAccountant = async (
  accountReceivableId: string,
  accountantId: string,
  body: string[]
) => {
  const api = `/engineering/account-receivable/${accountReceivableId}/accountant/${accountantId}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

type TgetAccountReceivableDeductions = {
  data: TaccountsReceivableDeductionDto[];
  meta: TpageMetaDto;
};

/**取得 所有 應收帳款 扣款明細 account-receivable-deduction */
const apiGetAccountReceivableDeductions = async (accountReceivableId: string, params?: Tparams) => {
  const api = `/engineering/account-receivable/${accountReceivableId}/deductions`;

  return axi
    .get<TgetAccountReceivableDeductions>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**取得 所有 應收帳款 扣款明細 account-receivable-deduction */
export const useGetAccountReceivableDeductions = (
  accountReceivableId: string | undefined | null,
  customParams?: Tparams
) => {
  const [res, setRes] = useState<TgetAccountReceivableDeductions>();

  const params: Tparams = {
    // populate: [],
    pageSize: 9999,
    sort: 'createdAt',
    order: 'ASC',
    ...customParams,
  };

  const update = async () => {
    if (!accountReceivableId) {
      return;
    }

    const newRes = await apiGetAccountReceivableDeductions(accountReceivableId, params);

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

/**新增 應收帳款 扣款明細 account-receivable-deduction */
export const apiPostAccountReceivableDeduction = async (id: string, body: TcreateAccountReceivableDeductionDto[]) => {
  const api = `/engineering/account-receivable/${id}/deduction`;

  return axi
    .post<TaccountsReceivableDeductionDto[]>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 棄用
// /**批量更新 應收帳款 扣款明細 account-receivable-deduction */
// export const apiPatchAccountReceivableDeduction = async (id: string, body: TupdateAccountReceivableDeductionDto[]) => {
//   const api = `/engineering/account-receivable/${id}/deduction`;

//   return axi
//     .patch(api, body)
//     .then(({ data }) => data)
//     .catch((err) => Promise.reject(err));
// };

/**批量更新 應收帳款 扣款明細 account-receivable-deduction */
export const apiPatchAccountReceivableDeduction_accountant = async (
  id: string,
  accountantId: string,
  body: TupdateAccountReceivableDeductionDto[]
) => {
  const api = `/engineering/account-receivable/${id}/deduction/${accountantId}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**刪除 應收帳款 扣款明細 account-receivable-deduction */
export const apiDeleteAccountReceivableDeduction = async (body: string[]) => {
  const api = `/engineering/account-receivable/deduction`;

  return axi
    .delete(api, { data: body })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**取得 源合約最終狀態產品 和 追加產品(請款單) */
export const apiGetFinalProduct = async (contractId: string) => {
  const api = `/engineering/account-receivable/finalProduct/${contractId}`;

  return axi
    .get<TfinalProduct>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetFinalProduct = (contractId: string | undefined) => {
  const [isFetching, setIsFetching] = useState(false);

  const [res, setRes] = useState<TfinalProduct>();

  const update = async () => {
    if (!contractId) {
      return;
    }

    try {
      setIsFetching(true);
      const newRes = await apiGetFinalProduct(contractId);

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得請款單資料失敗', content: err.message });
    } finally {
      setIsFetching(false);
    }

    return undefined;
  };

  return {
    data: res,
    update,
    isFetching,
  };
};

//取得 所有 應收帳款 主產品請款比例 account-receivable-product-payment  棄用
// 棄用
// type TgetAccountReceivableProductPayments = {
//   data: TaccountsReceivableProductPaymentDto[];
//   meta: TpageMetaDto;
// };

// /engineering/account-receivable/{id}/product-payments
// const apiGetAccountReceivableProductPayments = async (accountReceivableId: string, params?: Tparams) => {
//   const api = `/engineering/account-receivable/${accountReceivableId}/product-payments`;

//   return axi
//     .get<TgetAccountReceivableProductPayments>(api, { params })
//     .then(({ data }) => data)
//     .catch((err) => Promise.reject(err));
// };
// 棄用
// export const useGetAccountReceivableProductPayments = (
//   accountReceivableId: string | undefined | null,
//   customParams?: Tparams
// ) => {
//   const [res, setRes] = useState<TgetAccountReceivableProductPayments>();

//   const params: Tparams = {
//     // populate: [],
//     pageSize: 9999,
//     sort: 'period',
//     order: 'ASC',
//     ...customParams,
//   };

//   const update = async () => {
//     if (!accountReceivableId) {
//       return;
//     }

//     const newRes = await apiGetAccountReceivableProductPayments(accountReceivableId, params);

//     if (newRes) {
//       setRes(newRes);
//     }

//     return newRes;
//   };

//   return {
//     data: res?.data,
//     meta: res?.meta,
//     update,
//   };
// };
// 棄用
// export const apiPostProductPayment = async (
//   accountReceivableId: string,
//   body: TcreateAccountReceivableProductPaymentDto[]
// ) => {
//   const api = `/engineering/account-receivable/${accountReceivableId}/product-payments`;

//   return axi
//     .post<TaccountsReceivableProductPaymentDto[]>(api, body)
//     .then(({ data }) => data)
//     .catch((err) => Promise.reject(err));
// };
// 棄用
// export const apiPatchProductPayment = async (
//   accountReceivableId: string,
//   body: TupdateAccountReceivableProductPaymentDto[]
// ) => {
//   const api = `/engineering/account-receivable/${accountReceivableId}/product-payments`;

//   return axi
//     .patch<TaccountsReceivableProductPaymentDto[]>(api, body)
//     .then(({ data }) => data)
//     .catch((err) => Promise.reject(err));
// };

// =======================================================================

// 取得工程聯絡單的附件(圖表)
export const apiGetEngineeringContactAttachments = (
  //
  id: string,
  type: TengineeringContactAttachmentType
) => {
  const api = `/engineering/engineering-contact/${id}/attachments/${type}`;

  return axi
    .get<TfileDto[]>(api)
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '取得工程聯絡單圖表失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 上傳工程聯絡單的附件(圖表)
export const apiPostEngineeringContactAttachments = (
  id: string,
  type: TengineeringContactAttachmentType,
  body: FormData
) => {
  const api = `/engineering/engineering-contact/${id}/attachments/${type}`;

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '新增工程聯絡單圖表失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 刪除工程聯絡單附件
export const apiDeleteEngineeringContactAttachments = (
  //
  id: string,
  type: TengineeringContactAttachmentType,
  fileId: string
) => {
  const api = `/engineering/engineering-contact/${id}/attachments/${type}/${fileId}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '刪除工程聯絡單圖表失敗', content: err.message });

      return Promise.reject(err);
    });
};

export const useEngineeringContactAttachments = (id: string | undefined | null) => {
  const [floorPlan, setFloorPlan] = useState<TfileDto[]>([]);
  const [designDiagram, setDesignDiagram] = useState<TfileDto[]>([]);
  const [colorCard, setColorCard] = useState<TfileDto[]>([]);
  const [pattern_construction, setPattern_Construction] = useState<TfileDto[]>([]);
  const [pattern_detail, setPattern_Detail] = useState<TfileDto[]>([]);

  const update = async (type: TengineeringContactAttachmentType) => {
    if (!id) {
      return;
    }

    let res: TfileDto[] | undefined;

    if (type === 'floor') {
      res = await apiGetEngineeringContactAttachments(id, 'floor');
      res && setFloorPlan(res);
    }

    if (type === 'design') {
      res = await apiGetEngineeringContactAttachments(id, 'design');
      res && setDesignDiagram(res);
    }

    if (type === 'color') {
      res = await apiGetEngineeringContactAttachments(id, 'color');
      res && setColorCard(res);
    }

    if (type === 'construction') {
      res = await apiGetEngineeringContactAttachments(id, 'construction');
      res && setPattern_Construction(res);
    }

    if (type === 'detail') {
      res = await apiGetEngineeringContactAttachments(id, 'detail');
      res && setPattern_Detail(res);
    }

    return res;
  };

  const updateAll = async () => {
    if (!id) {
      return;
    }

    update('floor');
    update('design');
    update('color');
    update('construction');
    update('detail');
  };

  return {
    floorPlanPatternArr: floorPlan,
    designDiagramPatternArr: designDiagram,
    colorCardPatternArr: colorCard,
    pattern_constructionArr: pattern_construction,
    pattern_detailArr: pattern_detail,
    update,
    updateAll,
  };
};

// 送審工程聯絡單附件
export const apiPatchEngineeringContactSubmitAttachment = async (id: string, body: TsubmitEngineeringContactDto) => {
  const api = `/engineering/engineering-contact/${id}/submit-attachment/`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '送審工程聯絡單附件失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 審核工程聯絡單附件
export const apiPatchEngineeringContactReviewAttachment = async (id: string, body: TreviewEngineeringContactDto) => {
  const api = `/engineering/engineering-contact/${id}/review-attachment/`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '審核工程聯絡單附件失敗', content: err.message });

      return Promise.reject(err);
    });
};

// ==============================================================================

// region 要找時間整理一下拉

export const apiPatchAccountantInvoice = (
  {
    accountReceivableId,
    invoiceId,
    accountantId,
  }: {
    accountReceivableId: string;
    invoiceId: string;
    accountantId: string;
  },
  {
    callAlert,
  }: {
    callAlert?: boolean;
  } = {}
) => {
  const api = `/engineering/account-receivable/${accountReceivableId}/accountant/${accountantId}`;

  const body = {
    invoiceId,
  };

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => {
      if (callAlert) {
        myAlert.err({ title: '更新收款紀錄與發票關聯失敗', content: err.message });
      }

      return Promise.reject(err);
    });
};
