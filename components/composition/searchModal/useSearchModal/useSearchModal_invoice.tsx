import { useEffect, useMemo } from 'react';
import moment from 'moment';

import type { TuseSearchModal, Tstate_filter, Tconfig_filter, Tdto, Tconfig, TmodalData } from '../types';

import { useTranslation } from 'react-i18next';

import { useGetAccountReceivableInvoices_all_infinite, TaccountsReceivableInvoiceDto } from 'js/api/api_engineering';

import type { Tparams } from 'js/api/dtoTypes';

import { useFilter } from '../useFilter';
import { useInputSelProps } from '../useInputSelProps';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import SearchModal, { Tprops_refine } from '..';

// =====================================================================================

// 由五個部分組成
// useConfig_filter: 設定左側filter的欄位
// useConfig_data: 設定table的欄位
// useFilter: 處理filter的狀態
// useInputSelProps: 將config_filter與狀態送入，建立inputSelProps
// useData: 將filter送進去，取得資料

const useSearchModal_invoice = (): TuseSearchModal<TaccountsReceivableInvoiceDto> => {
  const config_filter = useConfig_filter();
  const { dataConfig, dataKeyArr } = useConfig_data();

  const { state, setState, clearState, filter, confirmFilter } = useFilter({ config_filter });
  const inputSelPropsArr = useInputSelProps({ config_filter, state, setState });
  const { dataArr, viewRef, isLoading, qty } = useData(filter);

  return {
    inputSelPropsArr,
    clearFilter: clearState,
    confirmFilter,
    //
    dataArr,
    qty,
    viewRef,
    isLoading,
    dataConfig,
    dataKeyArr,
  };
  //
};

// =============================================================================
// 將filter送進來，給取得資料的api hook
// useData(或是要叫其他名字也無所謂)，的輸入與細節怎樣都無所謂，但必須輸出TmodalData
const useData = (filter: Tstate_filter): TmodalData<TaccountsReceivableInvoiceDto> => {
  const params: Tparams = useMemo(() => {
    return {
      pageSize: 20,
      sort: 'invoiceNumber',
      order: 'ASC',
      filter: {
        invoiceDate: (() => {
          if (!filter.invoiceDate) {
            return undefined;
          } else {
            return {
              $gte: moment(filter.invoiceDate).startOf('day').toISOString(),
              $lte: moment(filter.invoiceDate).endOf('day').toISOString(),
            };
          }
        })(),
        invoiceNumber: {
          $contains: filter.invoiceNumber,
        },
        nameOfBusinessEntity: {
          $contains: filter.nameOfBusinessEntity,
        },
        businessIdNumber: {
          $contains: filter.businessIdNumber,
        },
        contractNumber: {
          $contains: filter.contractNumber,
        },
        contractProjectName: {
          $contains: filter.contractProjectName,
        },
        contractContractor: {
          $contains: filter.contractContractor,
        },
      },
    };
  }, [filter]);

  const { dataArr, viewRef_bottom, isLoadingPage1, reset, meta } = useGetAccountReceivableInvoices_all_infinite({
    customParams: params,
  });

  useEffect(() => {
    reset();
  }, [params]);

  return {
    dataArr,
    qty: meta?.itemCount || '',
    viewRef: viewRef_bottom,
    isLoading: isLoadingPage1,
  };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_data = () => {
  const { t: t_common } = useTranslation('common');
  const { t, i18n } = useTranslation('dto', { keyPrefix: 'accountsReceivableInvoice' });

  const dataConfig = useMemo(() => {
    const config: Tconfig<TaccountsReceivableInvoiceDto> = {
      indexNumber: {
        label: t_common('indexNumber02'),
        style: {
          width: '50px',
        },
        reducer: (_, { index }) => {
          return index + 1;
        },
      },
      invoiceNumber: {
        label: t('invoiceNumber'),
        style: {
          width: '150px',
        },
      },
      invoiceDate: {
        label: t('invoiceDate'),
        style: {
          width: '100px',
        },
        reducer(data) {
          return getTaiwanDateStr(data.invoiceDate);
        },
      },
      actualPrice: {
        label: t('actualPrice'),
        style: {
          width: '150px',
          justifyContent: 'flex-end',
        },
        reducer(data) {
          return data.actualPrice?.toLocaleString() ?? '0';
        },
      },
      note: {
        label: t('note'),
        style: {
          width: '150px',
        },
      },
      allowance: {
        label: t('allowance'),
        style: {
          width: '150px',
          justifyContent: 'flex-end',
        },
        reducer(data) {
          return data.allowance?.toLocaleString() ?? '0';
        },
      },
      nameOfBusinessEntity: {
        label: t('nameOfBusinessEntity'),
        style: {
          width: '200px',
        },
      },
      businessIdNumber: {
        label: t('businessIdNumber'),
        style: {
          width: '150px',
        },
      },
      contractProjectName: {
        label: t('contractProjectName'),
        style: {
          width: '150px',
        },
      },
      contractContractor: {
        label: t('contractContractor'),
        style: {
          width: '150px',
        },
      },
      contractNumber: {
        label: t('contractNumber'),
        style: {
          width: '150px',
        },
      },
    };

    return config;
  }, [i18n.language]);

  const dataKeyArr: string[] = [
    'indexNumber',
    'invoiceNumber',
    'invoiceDate',
    'nameOfBusinessEntity',
    'businessIdNumber',
    'actualPrice',
    'allowance',
    'contractNumber',
    'contractProjectName',
    'contractContractor',
    'note',
  ];

  return { dataConfig, dataKeyArr };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_filter = () => {
  const { t, i18n } = useTranslation('dto', { keyPrefix: 'accountsReceivableInvoice' });

  return useMemo(() => {
    const config_filter: Tconfig_filter = [
      {
        caption: t('invoiceNumber'),
        key: 'invoiceNumber',
        type: 'input',
      },
      {
        caption: t('invoiceDate'),
        key: 'invoiceDate',
        type: 'date',
      },
      {
        caption: t('nameOfBusinessEntity'),
        key: 'nameOfBusinessEntity',
        type: 'input',
      },
      {
        caption: t('businessIdNumber'),
        key: 'businessIdNumber',
        type: 'input',
      },
      {
        caption: t('contractNumber'),
        key: 'contractNumber',
        type: 'input',
      },
      {
        caption: t('contractProjectName'),
        key: 'contractProjectName',
        type: 'input',
      },
      {
        caption: t('contractContractor'),
        key: 'contractContractor',
        type: 'input',
      },
    ];

    return config_filter;
  }, [i18n.language]);
};

// ============================================================================

const SearchModal_invoice = (props: Tprops_refine<TaccountsReceivableInvoiceDto>) => {
  return <SearchModal {...props} useSearchModal={useSearchModal_invoice} />;
};

// ============================================================================

export { useSearchModal_invoice, SearchModal_invoice };
export type { TaccountsReceivableInvoiceDto };
