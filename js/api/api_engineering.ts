// apiGetQuotationProducts

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi } from './_axiosCreator';
import { AxiosError } from 'axios';

import { createUseInfinite } from './createUseInfinite';
import moment, { Moment } from 'moment';

import { TgetReviewById, apiGetReviewById } from 'js/api/api_netCore/api_review';

// type
import type {
  TapiError,
  Tparams,
  TpageMetaDto,
  TengineeringContactDto,
  TupdateEngineeringContactDto,
  TcreateEngineeringContactDto,
  TcreateEngineeringContactIndependent,
  TdispatchingDto,
  TcreateDispatchingDto,
  TexchangeDto,
  TcreateExchgangeDto,
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
  TperiodType,
  TpageResponse,
  TaccountsReceivableInvoiceDto,
  TincomeBillSerialDto,
  TupdateIncomeBillSerialDto,
  TcreateAccountReceivableAccountsDto,
  // electronicSupplies
  TelectronicSuppliesDto,
  TelectronicSuppliesContentDto,
  TelectronicSuppliesRequirementRecordDto,
  TelectronicSuppliesRequirementRecordDetailDto,
  TelectronicSuppliesPickupRecordDto,
  TelectronicSuppliesPickupRecordDetailDto,
  TcreateElectronicSuppliesPickupRecordDto,
  TupdateElectronicSuppliesPickupRecordDto,
  TcreateElectronicSuppliesRequirementRecordDto,
  TelectronicSuppliesRequirementRecordDetail,
  //
  TupdateAccountReceivableAccountantDto,
  TcreateElectronicSuppliesRecordDetailDto,
  TupdateElectronicSuppliesRequirementRecordDto,
  //
  TincomeBillSerialSettlementFormDto,
  TincomeBillSerialSettlementFormReviewRecordDto,
  TcreateIncomeBillSettlementFormDto,
  TupdateIncomeBillSettlementFormDto,
} from './dtoTypes';
import { resolveMx } from 'dns';

type TinvouceCheckResult = 'pass' | 'notPass' | undefined;

type TworksheetRecordDto_addition = TworksheetRecordDto & {
  addition?: {
    reviewArr?: TgetReviewById[] | undefined;
  };
};

type TworksheetDto_addition = TworksheetDto & {
  latestRecord: TworksheetRecordDto_addition;
  records: TworksheetRecordDto_addition[];
};

type TelectronicSuppliesRequirementRecordDto_addition = TelectronicSuppliesRequirementRecordDto & {
  addition: {
    doorTypeArr: string[] | null;
  };
};

type TelectronicSuppliesPickupRecordDto_addition = TelectronicSuppliesPickupRecordDto & {
  addition: {
    doorTypeArr: string[] | null;
  };
};

type TelectronicSuppliesDto_addition = Omit<TelectronicSuppliesDto, 'pickupRecords' | 'requirementRecords'> & {
  pickupRecords?: TelectronicSuppliesPickupRecordDto_addition[];
  requirementRecords?: TelectronicSuppliesRequirementRecordDto_addition[];
};

export type {
  TapiError,
  Tparams,
  TpageMetaDto,
  TengineeringContactDto,
  TupdateEngineeringContactDto,
  TcreateEngineeringContactDto,
  TcreateEngineeringContactIndependent,
  TdispatchingDto,
  TcreateDispatchingDto,
  TexchangeDto,
  TcreateExchgangeDto,
  TworksheetDto,
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
  TaccountsReceivableInvoiceDto,
  //
  TincomeBillSerialDto,
  TupdateIncomeBillSerialDto,
  TcreateAccountReceivableAccountsDto,
  // electronicSupplies
  TelectronicSuppliesDto,
  TelectronicSuppliesContentDto,
  TelectronicSuppliesRequirementRecordDto,
  TelectronicSuppliesRequirementRecordDetailDto,
  TelectronicSuppliesPickupRecordDto,
  TelectronicSuppliesPickupRecordDetailDto,
  //
  TupdateAccountReceivableAccountantDto,
  //
  TcreateElectronicSuppliesRequirementRecordDto,
  TcreateElectronicSuppliesRecordDetailDto,
  TupdateElectronicSuppliesRequirementRecordDto,
  TcreateElectronicSuppliesPickupRecordDto,
  TupdateElectronicSuppliesPickupRecordDto,
  //
  TincomeBillSerialSettlementFormDto,
  TincomeBillSerialSettlementFormReviewRecordDto,
  TcreateIncomeBillSettlementFormDto,
  TupdateIncomeBillSettlementFormDto,
  //
} from './dtoTypes';

export type {
  TinvouceCheckResult,
  TworksheetDto_addition,
  TworksheetRecordDto_addition,
  TelectronicSuppliesDto_addition,
  TelectronicSuppliesRequirementRecordDto_addition,
  TelectronicSuppliesPickupRecordDto_addition,
};

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
  const [isFetching, setIsFetching] = useState(false);

  const update = async () => {
    if (!id) {
      return;
    }

    setIsFetching(true);

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
    } finally {
      setIsFetching(false);
    }
  };

  return {
    data: res,
    isFetching,
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

// 新建工程聯絡單 // 工程聯絡單一定是歸在一個合約之下，所以會同時新建一個合約
// 該合約不會有合約審核表
export const apiPostEngineeringContactIndependent = async (body: TcreateEngineeringContactIndependent) => {
  const api = '/engineering/engineering-contact/independent';

  return await axi.post(api, body).catch((error) => {
    const err = error as AxiosError<TapiError>;
    myAlert.err({ title: '新建工程聯絡單失敗', content: err.message });

    return Promise.reject(error);
  });
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
  const [isFetching, setIsFetching] = useState(false);

  const params = {
    populate: ['workerEmployee', 'todoList', 'outsourcing'],
    ...customeParams,
  };

  const update = async () => {
    if (!id) {
      return;
    }

    setIsFetching(true);

    const newRes = await apiGetEngineeringDispatching_id(id, params);
    setIsFetching(false);

    if (newRes) {
      setRes(newRes);
    }

    return newRes;
  };

  return {
    data: res,
    update,
    isFetching,
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

// 刪除派工單
export const apiDeleteEngineeringDispatching = async (id: string) => {
  const api = `/engineering/dispatching/${id}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '刪除派工單失敗', content: err.message });

      return Promise.reject(error);
    });
};

// ------------------------------------------------------------------------
// region 送電備品

// 從工作表(items)產生送電備品需求單
export const apiPostElectronicSupplies = (body: { contractId: string }) => {
  const api = '/engineering/electronic-supplies';

  return axi
    .post(api, body)
    .then(({ data }) => {
      myAlert.success({
        title: '產生送電備品需求單',
      });

      return data;
    })
    .catch((err: AxiosError<TapiError>) => {
      const message = err.response?.data?.message || err.message;
      // message === 'Cannot found worksheet!' && (message = '送電備品尚無需更新');

      myAlert.err({
        title: '產生失敗',
        content: message,
      });

      return Promise.reject();
      // return Promise.reject(err);
    });
};

const apiGetElectronicSupplies_id = (id: string, { params_cover }: { params_cover?: Tparams } = {}) => {
  const api = `/engineering/electronic-supplies/${id}`;

  let params: Tparams = {
    populate: [
      //
      'electronicSuppliesContents',
      'pickupRecords.takeOffEmployee',
      'pickupRecords.preparationEmployee',
      'pickupRecords.TelectronicSuppliesPickupRecordDetailDto',
      'requirementRecords.agentEmployee',
      'requirementRecords.storageManagementPersonnelEmployee',
    ],
  };

  if (params_cover) {
    params = params_cover;
  }

  return axi
    .get<TelectronicSuppliesDto>(api, { params })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const useElectronicSupplies_id = (
  id: string | undefined | null,
  { params_cover }: { params_cover?: Tparams } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TelectronicSuppliesDto_addition>();

  const update = async () => {
    if (!id) {
      return;
    }

    setIsFetching(true);

    try {
      const res = await apiGetElectronicSupplies_id(id, { params_cover });
      const { pickupRecords, requirementRecords } = res;

      const pickupRecords_addition: TelectronicSuppliesPickupRecordDto_addition[] | undefined = pickupRecords?.map(
        (record) => {
          const doorType = record.doorModel;
          const doorTypeArr = doorType ? jsonStrArrToStrArr(doorType) : null;

          return {
            ...record,
            addition: {
              doorTypeArr,
            },
          };
        }
      );

      const requirementRecords_addition: TelectronicSuppliesRequirementRecordDto_addition[] | undefined =
        requirementRecords?.map((record) => {
          const doorType = record.doorType;
          const doorTypeArr = doorType ? jsonStrArrToStrArr(doorType) : null;

          return {
            ...record,
            addition: {
              doorTypeArr,
            },
          };
        });

      const res_addition: TelectronicSuppliesDto_addition = {
        ...res,
        pickupRecords: pickupRecords_addition,
        requirementRecords: requirementRecords_addition,
      };

      setRes(res_addition);
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({ title: '取得送電備品失敗', content: err.message });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    update();
  }, [id]);

  return {
    data: res,
    update,
    isFetching,
  };
};

const apiGetElectronicSuppliesRequirementRecord_id = (requirementRecordId: string) => {
  const api = `/engineering/electronic-supplies/requirement-record/${requirementRecordId}`;

  const params = {
    populate: ['agentEmployee', 'requirementRecordDetails', 'storageManagementPersonnelEmployee'],
  };

  return axi
    .get<TelectronicSuppliesRequirementRecordDto>(api, { params })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const useGetElectronicSuppliesRequirementRecord_id = (
  requirementRecordId: string | undefined,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TelectronicSuppliesRequirementRecordDto_addition>();

  const update = async () => {
    if (!requirementRecordId) {
      return;
    }

    setIsFetching(true);

    try {
      const res = await apiGetElectronicSuppliesRequirementRecord_id(requirementRecordId);
      const doorType = res.doorType;
      let doorTypeArr: string[] | null = null;

      if (doorType) {
        doorTypeArr = jsonStrArrToStrArr(doorType);
      }

      const res_addition: TelectronicSuppliesRequirementRecordDto_addition = {
        ...res,
        addition: {
          doorTypeArr,
        },
      };

      setRes(res_addition);
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({ title: '取得送電備品需求單失敗', content: err.message });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    autoUpdate && update();
  }, [requirementRecordId]);

  return {
    data: res,
    update,
    isFetching,
  };
};

export const apiPostElectronicSuppliesRequirementRecord = (
  electronicSupplyid: string,
  body: TcreateElectronicSuppliesRequirementRecordDto
) => {
  const api = `/engineering/electronic-supplies/${electronicSupplyid}/requirement-record`;

  return axi
    .post<TelectronicSuppliesRequirementRecordDto>(api, body)
    .then(({ data }) => data)
    .catch((error: AxiosError<TapiError>) => {
      myAlert.err({
        title: '新增送電備品需求單失敗',
        content: error.response?.data?.message || error.message,
      });

      return Promise.reject(error);
    });
};

export const apiPatchElectronicSuppliesRequirementRecord = (
  requirementrecordId: string,
  body: TupdateElectronicSuppliesRequirementRecordDto
) => {
  const api = `/engineering/electronic-supplies/requirement-record/${requirementrecordId}`;

  return axi
    .patch<TelectronicSuppliesRequirementRecordDto>(api, body)
    .then(({ data }) => data)
    .catch((err: AxiosError<TapiError>) => {
      myAlert.err({
        title: '更新送電備品需求單失敗',
        content: err.response?.data?.message || err.message,
      });

      return Promise.reject(err);
    });
};

// 取得合約的預設送電備品
export const apiGetDefaultElectronicSuppliesRequirementData = async (contractId: string) => {
  const api = `/engineering/electronic-supplies/worksheet-to-create/${contractId}`;

  return axi
    .get<TelectronicSuppliesRequirementRecordDetail>(api)
    .then(({ data }) => data)
    .catch((error) => Promise.reject(error));
};

export const useGetDefaultElectronicSuppliesRequirementData = (
  contractId: string | undefined | null,
  { autoUpdate = true, callAlert = true } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TelectronicSuppliesRequirementRecordDetail>();

  const update = async () => {
    if (!contractId) {
      return;
    }

    setIsFetching(true);

    try {
      const res = await apiGetDefaultElectronicSuppliesRequirementData(contractId);
      setRes(res);
    } catch (error) {
      const err = error as AxiosError;
      callAlert && myAlert.err({ title: '取得預設送電備品需求單失敗', content: err.message });
      setRes(undefined);

      return error;
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    autoUpdate && update();
  }, [contractId]);

  return {
    isFetching,
    update,

    defaultElectronicSuppliesRequirementArr: res?.data,
    worksheetIdArr: res?.worksheetIds,
    electronicSuppliesId: res?.electronicSuppliesId,
  };
};

const apiGetElectronicSuppliesPickupRecord_id = (id: string) => {
  const api = `/engineering/electronic-supplies/pick-up-record/${id}`;

  const params = {
    populate: ['takeOffEmployee', 'pickupRecordDetails', 'preparationEmployee'],
  };

  return axi
    .get<TelectronicSuppliesPickupRecordDto>(api, { params })
    .then(({ data }) => data)
    .catch((error) => {
      return Promise.reject(error);
    });
};

export const useGetElectronicSuppliesPickupRecord_id = (
  pickupRecordId: string | undefined | null,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TelectronicSuppliesPickupRecordDto_addition>();

  const update = async () => {
    if (!pickupRecordId) {
      return;
    }

    setIsFetching(true);

    try {
      const res = await apiGetElectronicSuppliesPickupRecord_id(pickupRecordId);
      const doorType = res.doorModel;
      let doorTypeArr: string[] | null = null;

      if (doorType) {
        doorTypeArr = jsonStrArrToStrArr(doorType);
      }

      const res_addition: TelectronicSuppliesPickupRecordDto_addition = {
        ...res,
        addition: {
          doorTypeArr,
        },
      };

      setRes(res_addition);
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({ title: '取得送電備品領料單失敗', content: err.message });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    autoUpdate && update();
  }, [pickupRecordId]);

  return {
    data: res,
    update,
    isFetching,
  };
};

export const apiPostElectronicSuppliesPickupRecord = (id: string, body: TcreateElectronicSuppliesPickupRecordDto) => {
  const api = `/engineering/electronic-supplies/${id}/pickup-record`;

  return axi
    .post<TelectronicSuppliesPickupRecordDto[]>(api, body)
    .then(({ data }) => data)
    .catch((error: AxiosError<TapiError>) => {
      myAlert.err({
        title: '新增送電備品領取單失敗',
        content: error.response?.data?.message || error.message,
      });

      return Promise.reject(error);
    });
};

export const apiPatchElectronicSuppliesPickupRecord = (id: string, body: TupdateElectronicSuppliesPickupRecordDto) => {
  const api = `/engineering/electronic-supplies/pickup-record/${id}`;

  return axi
    .patch<TelectronicSuppliesPickupRecordDto>(api, body)
    .then(({ data }) => data)
    .catch((error: AxiosError<TapiError>) => {
      myAlert.err({
        title: '更新送電備品領取單失敗',
        content: error.response?.data?.message || error.message,
      });

      return Promise.reject(error);
    });
};

// endregion 送電備品

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
  const [isFetching, setIsFetching] = useState(false);

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
    setIsFetching(true);
    const newRes = await apiGetEngineeringExchanges(params);
    setIsFetching(false);

    if (newRes) {
      setRes(newRes);
    }

    return newRes;
  };

  return {
    data: res?.data,
    meta: res?.meta,
    update,
    isFetching,
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
  const [isFetching, setIsFetching] = useState(false);

  const update = async () => {
    if (!id) {
      return;
    }

    setIsFetching(true);
    const newRes = await apiGetEngineeringExchanges_id(id);
    setIsFetching(false);

    if (newRes) {
      setRes(newRes);
    }

    return newRes;
  };

  return {
    data: res,
    update,
    isFetching,
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

export const useGetWorksheet_id = (
  id: string | undefined | null,
  {
    //
    params,
    recordsWithReview = false,
  }: {
    //
    params?: Tparams;
    recordsWithReview?: boolean;
  } = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [res, setRes] = useState<TworksheetDto_addition>();

  params = {
    populate: [
      //
      'records.contractProductItems',
      'records.reviewSalesEmployee',
      'records.reviewManagerEmployee',
      'records.agentEmployee',
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
      const res_origin = await apiGetWorksheet_id(id, params);

      if (!res_origin) {
        return res_origin;
      }

      const res = res_origin as TworksheetDto_addition;

      if (recordsWithReview) {
        const records = (res.records ?? []) as TworksheetRecordDto_addition[];

        for (const record of records) {
          const reviewArr = await apiGetReviewById({ document_uuid: record.id });
          record.addition = {
            reviewArr,
          };
        }
      }

      setRes(res);

      return res;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得工作表失敗', content: err.message });
    } finally {
      setIsLoading(false);

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

export const useApiGetWorksheetRecord_id = (
  recordId: string | undefined,
  { addition_reviewArr = false }: { addition_reviewArr?: boolean } = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [res, setRes] = useState<TworksheetRecordDto_addition>();

  const update = async () => {
    if (!recordId) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiGetWorksheetRecord_id(recordId);

      if (!res) {
        setRes(res);

        return res;
      }

      if (addition_reviewArr) {
        const reviewArr = await apiGetReviewById(res.id);
        res.addition = {
          reviewArr,
        };
      }

      setRes(res);

      return res;
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

// w棄用
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

// w棄用
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

// 取得應收帳款明細 by id
export const apiGetAccountReceivable_id = async (id: string, params: Tparams) => {
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

// 新增 應收帳款明細 account-receivable
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

// 更新 應收帳款明細 account-receivable
export const apiPatchAccountReceivable = async (id: string, body: TupdateAccountReceivableDto) => {
  const api = `/engineering/account-receivable/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => {
      myAlert.err({ title: '更新應收帳款明細失敗', content: err.message });

      return Promise.reject(err);
    });
};

//

type TgetAccountReceivableIncoices = {
  data: TaccountsReceivablePeriodDto[];
  meta: TpageMetaDto;
};

// 以 應收帳款id取得 所有 應收帳款發票 account-receivable
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
  // w 注意 body.invoiceDate的時分秒務必設為00:00:00
  // w 後端會檢查invoiceDate是否比該發票本的latestInvoiceDate更晚
  // w 更晚的話會404，所以統一設為00:00:00
  // 是不是該考慮直接在這邊設定就好?
  // 如果哪天需要設定invoiceDate的時分秒的話會出問題，所以不可以

  const api = `/engineering/account-receivable/${accountReceivableId}/period`;

  return axi
    .post<TaccountsReceivablePeriodDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 更新 應收帳款收款期數
export const apiPatchAccountReceivablePeriodInvoiceAllowance = async (
  invoiceId: string,
  body: { allowance: number }
) => {
  const api = `/engineering/account-receivable/invoice/${invoiceId}`;

  return axi
    .patch<TaccountsReceivablePeriodDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
  // return (
  //   axi
  //     // 修改allowance會同步改第一個invoice的allowance
  //     // 型別沒有錯，就是TaccountsReceivablePeriodDto
  //     .patch<TaccountsReceivablePeriodDto>(api, body)
  //     .then(({ data }) => data)
  //     .catch((err) => Promise.reject(err))
  // );
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

// 新增 應收帳款 收款紀錄 account-receivable-accountant
export const apiPostAccountReceivableAccountant = async (
  id: string, // 應收帳款Id 可以在contract下找到accountReceivableId
  body: TcreateAccountReceivableAccountsDto,
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
// deprecated
// export const apiPatchAccountReceivableAccountant = async (
//   accountReceivableId: string,
//   accountantId: string,
//   body: string[]
// ) => {
//   const api = `/engineering/account-receivable/${accountReceivableId}/accountant/${accountantId}`;

//   return axi
//     .patch(api, body)
//     .then(({ data }) => data)
//     .catch((err) => Promise.reject(err));
// };

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

// MARK: 要找時間
//
//
//
//
//
// MARK: 整理一下拉

// 已無此api
// export const apiPatchAccountantInvoice = (
//   {
//     accountReceivableId,
//     invoiceId,
//     accountantId,
//   }: {
//     accountReceivableId: string;
//     invoiceId: string;
//     accountantId: string;
//   },
//   {
//     callAlert,
//   }: {
//     callAlert?: boolean;
//   } = {}
// ) => {
//   const api = `/engineering/account-receivable/${accountReceivableId}/accountant/${accountantId}`;

//   const body = {
//     invoiceId,
//   };

//   return axi
//     .patch(api, body)
//     .then(({ data }) => data)
//     .catch((err) => {
//       if (callAlert) {
//         myAlert.err({ title: '更新收款紀錄與發票關聯失敗', content: err.message });
//       }

//       return Promise.reject(err);
//     });
// };

// 更新指定ReceivableAccountant下指定發票與incomeBill的關聯
export const apiPatchAccountReceivableAccountant = async (
  accountReceivableId: string,
  body: TupdateAccountReceivableAccountantDto
) => {
  const api = `/engineering/account-receivable/${accountReceivableId}/accountant`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err: AxiosError<TapiError>) => {
      const { error, message, status } = err.response?.data ?? {};
      myAlert.err({ title: '更新收款紀錄與發票關聯失敗', content: `${status}_${message}$` });

      return Promise.reject(err);
    });
};

type TgetAccountReceivableDeductions = {
  data: TaccountsReceivableDeductionDto[];
  meta: TpageMetaDto;
};

// 檢查發票號碼是否存在 // 這個api其實是用invoiceNumber找invoice
export const apiGetInvoiceNumber = async (invoiceNumber: string) => {
  // const api = `/engineering/account-receivable/invoices/${invoiceNumber}-number`;
  const api = `/engineering/account-receivable/invoices/${invoiceNumber}`;

  return axi
    .get<TaccountsReceivableInvoiceDto>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useCheckInvoiceNumber = (
  invoiceNumber: string | undefined | null,
  {
    pause = false,
  }: {
    pause?: boolean;
  } = {}
) => {
  const [isPass, setIsPass] = useState<TinvouceCheckResult>();
  const [isFetching, setIsFetching] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>();

  const checkInvouceNumber = async () => {
    if (!invoiceNumber) {
      setIsPass(undefined);
      setIsFetching(false);

      return;
    }

    await apiGetInvoiceNumber(invoiceNumber)
      .then((res) => {
        if (!res) {
          setIsPass('pass');
        } else {
          setIsPass('notPass');
        }
      })
      .catch(() => {
        setIsPass(undefined);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    if (pause) {
      return;
    }

    setIsFetching(true);
    setIsPass(undefined);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const timeoutId_new = setTimeout(() => {
      checkInvouceNumber();
    }, 1000);

    setTimeoutId(timeoutId_new);
  }, [invoiceNumber]);

  return { isFetching, isPass };
};

// 刪除發票
export const apiDeleteAccountReceivableInvoice = async (id: string) => {
  const api = `/engineering/account-receivable/invoice/${id}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '刪除發票失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 刪除應收帳款期數
export const apiDeleteAccountReceivablePeriod = async (id: string) => {
  const api = `/engineering/account-receivable/period/${id}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '刪除應收帳款期數失敗', content: err.message });

      return Promise.reject(err);
    });
};

export const apiGetAccountReceivableIncomeBills = async (params?: Tparams) => {
  const api = '/engineering/account-receivable/income-bills';

  return axi
    .get<TpageResponse<TincomeBillSerialDto>>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetAccountReceivableIncomeBills = ({
  //
  autoUpdate = true,
  callAlert = true,
  params,
}: {
  params?: Tparams;
  autoUpdate?: boolean;
  callAlert?: boolean;
}) => {
  const [res, setRes] = useState<TpageResponse<TincomeBillSerialDto>>();
  const [isFetching, setIsFetching] = useState(false);

  const update = useCallback(async () => {
    setIsFetching(true);

    try {
      const newRes = await apiGetAccountReceivableIncomeBills(params);

      if (newRes) {
        setRes(newRes);
      }
    } catch (error) {
      const err = error as Error;
      callAlert && myAlert.err({ title: '取得應收帳款收款明細列表失敗', content: err.message });
    } finally {
      setIsFetching(false);
    }
  }, [params]);

  useEffect(() => {
    autoUpdate && update();
  }, [params]);

  return {
    data: res?.data,
    meta: res?.meta,
    update,
    isFetching,
  };
};

export const useGetAccountReceivableIncomeBills_infinite = createUseInfinite<TpageResponse<TincomeBillSerialDto>>({
  apiClient: apiGetAccountReceivableIncomeBills,
  errTitle: '取得應收帳款收款明細列表失敗',
});

export const apiPatchIncomeBill = async (id: string, body: TupdateIncomeBillSerialDto) => {
  const api = `/engineering/account-receivable/income-bill/${id}`;

  return axi
    .patch<TincomeBillSerialDto>(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '更新收款明細失敗', content: err.message });

      Promise.reject(error);
    });
};

export const apiPostAccountReceivableAccounts = async (body: TcreateAccountReceivableAccountsDto) => {
  const api = `/engineering/account-receivable/accountants-to-paper`;

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '匯入紙本應收帳款失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 取得所有已開立發票 //w 注意，是已開立發票 invoiceStatus為"已開立" 的發票
const apiGetAccountReceivableInvoices_all = async (params?: Tparams) => {
  const api = '/engineering/account-receivable/invoices';

  return axi
    .get<TpageResponse<TaccountsReceivableInvoiceDto>>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetAccountReceivableInvoices_all = ({
  params,
  autoUpdate = true,
  callAlert = true,
}: {
  params?: Tparams;
  autoUpdate?: boolean;
  callAlert?: boolean;
} = {}) => {
  const [res, setRes] = useState<TpageResponse<TaccountsReceivableInvoiceDto>>();
  const [isFetching, setIsFetching] = useState(false);

  const update = useCallback(async () => {
    setIsFetching(true);

    try {
      const newRes = await apiGetAccountReceivableInvoices_all(params);

      if (newRes) {
        setRes(newRes);
      }
    } catch (error) {
      const err = error as Error;
      callAlert && myAlert.err({ title: '取得發票列表失敗', content: err.message });
    } finally {
      setIsFetching(false);
    }
  }, [params]);

  useEffect(() => {
    autoUpdate && update();
  }, [params]);

  return {
    data: res?.data,
    meta: res?.meta,
    update,
    isFetching,
  };
};

// 取得所有已開立發票 //w 注意，是已開立發票 invoiceStatus為"已開立" 的發票
export const useGetAccountReceivableInvoices_all_infinite = createUseInfinite<
  TpageResponse<TaccountsReceivableInvoiceDto>
>({
  apiClient: apiGetAccountReceivableInvoices_all,
  errTitle: '取得以開立發票列表失敗',
});

// ---------------------------------------------------------------------------

// date不計入DD
// 會回應當月的報表一個，只有一個
const apiGetIncomeBillSerialSettlementForm = async (date: string) => {
  const api = `/engineering/account-receivable/income-bill-serial-settlement-form/${date}`;

  const params = {
    populate: ['reviewStatus', 'reviewRecord', 'agentEmployee', 'incomeBills'],
  };

  return axi
    .get<TincomeBillSerialSettlementFormDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetIncomeBillSerialSettlementForm = (
  date: Moment | Date | undefined | null,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) => {
  const [res, setRes] = useState<TincomeBillSerialSettlementFormDto>();

  const dateStr = moment(date).format('YYYY-MM-DD');

  const update = useCallback(async () => {
    if (!date) {
      setRes(undefined);

      return;
    }

    return await apiGetIncomeBillSerialSettlementForm(dateStr)
      .then((res) => {
        setRes(res);
      })
      .catch((err: AxiosError<TapiError>) => {
        setRes(undefined);
        myAlert.err({ title: '取得收款明細結算表失敗', content: err.message });
      });
  }, [dateStr]);

  useEffect(() => {
    autoUpdate && update();
  }, [update]);

  return {
    data: res,
    setData: setRes,
    update,
  };
};

// incomeBillIds若為undefined，則是結算當月
// 已被結算過的incomeBillId不可以再次結算，應該會失敗
// 但是沒有限制一個月只能呼叫一次
// w 疑問
// TcreateIncomeBillSettlementFormDto.incomeBillIds，incomeBill有沒有限制不可以跨月?
// 月中呼叫過一次，月底再次呼叫，兩次都送入不同的incomeBillIds，會不會有問題?

export const apiPostIncomeBillSerialSettlementForm = async (body: TcreateIncomeBillSettlementFormDto) => {
  const api = `/engineering/account-receivable/income-bill-serial-settlement-form`;

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => {
      myAlert.err({ title: '產生報表失敗' });

      return Promise.reject(err);
    });
};

export const apiPatchIncomeBillSerialSettlementForm = async (id: string, body: TupdateIncomeBillSettlementFormDto) => {
  const api = `/engineering/account-receivable/income-bill-serial-settlement-form/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => {
      myAlert.err({ title: '更新報表失敗' });

      return Promise.reject(err);
    });
};

// 使用前先確保JSON字串的內容是陣列
const jsonStrArrToStrArr = (str: string) => {
  try {
    return JSON.parse(str) as string[];
  } catch (error) {
    return [str] as string[];
  }
};
