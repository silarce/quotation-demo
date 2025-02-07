import { useEffect, useMemo } from 'react';
import _ from 'lodash';

import type { TuseSearchModal, Tstate_filter, Tconfig_filter, Tdto, Tconfig, TmodalData } from '../types';

import { useTranslation } from 'react-i18next';

import { useGetUnpaidProdreceiptByInvoiceNumber, Tprodreceipt_Dto } from 'js/api/api_netCore/api_accountant';

import { useFilter } from '../useFilter';
import { useInputSelProps } from '../useInputSelProps';

import SearchModal, { Tprops_refine } from '..';

// =====================================================================================

interface Toptions {
  coverFilter?: Tconfig_filter;
  customKeyArr?: string[];
  uniqInvoice?: boolean;
  removeNoInvoiceData?: boolean;
}

// =====================================================================================

// 由五個部分組成
// useConfig_filter: 設定左側filter的欄位
// useConfig_data: 設定table的欄位
// useFilter: 處理filter的狀態
// useInputSelProps: 將config_filter與狀態送入，建立inputSelProps
// useData: 將filter送進去，取得資料

const useSearchModal_prodreceipt = (options?: Toptions): TuseSearchModal<Tprodreceipt_Dto> => {
  const config_filter = useConfig_filter(options?.coverFilter);
  const { dataConfig, dataKeyArr } = useConfig_data(options?.customKeyArr);

  const { state, setState, clearState, filter, confirmFilter } = useFilter({ config_filter });
  const inputSelPropsArr = useInputSelProps({ config_filter, state, setState });
  const { dataArr, viewRef, isLoading, qty } = useData(filter, {
    uniqInvoice: options?.uniqInvoice,
    removeNoInvoiceData: options?.removeNoInvoiceData,
  });

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
const useData = (
  //
  filter: Tstate_filter | undefined,
  {
    uniqInvoice,
    removeNoInvoiceData = false,
  }: {
    uniqInvoice?: boolean;
    removeNoInvoiceData?: boolean;
  } = {}
): TmodalData<Tprodreceipt_Dto> => {
  // 以發票號碼取得未結案之進貨單 (未提供發票號碼則提供所有未結案之進貨單)
  // const invoice = filter?.invoice?.trim();
  // const { res, setRes, update, isFetching } = useGetUnpaidProdreceiptByInvoiceNumber(invoice, { autoUpdate: false });

  const { res, setRes, update, isFetching } = useGetUnpaidProdreceiptByInvoiceNumber(undefined, { autoUpdate: false });

  const dataArr = useMemo(() => {
    let dataArr = res ?? [];

    dataArr = dataArr.filter((data) => {
      let pass = true;

      if (filter?.invoice?.trim()) {
        !!data.invoice && data.invoice !== filter.invoice.trim() && (pass = false);
      }

      if (filter?.prodreceiptid) {
        !String(data.prodreceiptid).includes(filter.prodreceiptid.trim()) && (pass = false);
      }

      if (removeNoInvoiceData) {
        !data.invoice && (pass = false);
      }

      return pass;
    });

    // 將重複發票的資料去除
    uniqInvoice && (dataArr = _.uniqBy(dataArr, 'invoice'));

    return dataArr;
  }, [res, filter]);

  useEffect(() => {
    filter && update();
  }, [filter]);

  return {
    dataArr,
    qty: dataArr.length,
    isLoading: isFetching,
  };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_data = (customKeyArr?: string[]) => {
  const { t: t_common } = useTranslation('common');
  const { t, i18n } = useTranslation('accounting', { keyPrefix: 'prodreceipt' });

  const dataConfig = useMemo(() => {
    const config: Tconfig<Tprodreceipt_Dto> = {
      indexNumber: {
        label: t_common('indexNumber02'),
        style: {
          width: '50px',
        },
        reducer: (_, { index }) => {
          return index + 1;
        },
      },
      prodreceiptid: {
        label: t('prodreceiptid'),
        style: {
          width: '150px',
        },
      },
      invoice: {
        label: t('invoice'),
        style: {
          width: '150px',
        },
      },
      status: {
        label: t('status'),
        style: {
          width: 100,
        },
      },
      pay_status: {
        label: t('pay_status'),
        style: {
          width: 100,
        },
      },
      tax: {
        label: t('tax'),
        style: {
          width: 100,
          justifyContent: 'flex-end',
        },
        reducer: (data) => {
          const tax = typeof data.tax === 'number' ? (data.tax ?? 0).toLocaleString() : data.tax;

          return tax;
        },
      },
      totalprice: {
        label: t('totalprice'),
        style: {
          width: 150,
          justifyContent: 'flex-end',
        },
        reducer: (data) => {
          const totalprice =
            typeof data.totalprice === 'number' ? (data.totalprice ?? 0).toLocaleString() : data.totalprice;

          return totalprice;
        },
      },
    };

    return config;
  }, [i18n.language]);

  const dataKeyArr: string[] = customKeyArr || [
    //
    'indexNumber',
    'prodreceiptid',
    'invoice',
    'status',
    'pay_status',
    'tax',
    'totalprice',
  ];

  return { dataConfig, dataKeyArr };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_filter = (customerFilterConfig?: Tconfig_filter) => {
  const { t, i18n } = useTranslation('accounting', { keyPrefix: 'prodreceipt' });

  return useMemo(() => {
    const config_filter: Tconfig_filter = customerFilterConfig || [
      {
        caption: t('prodreceiptid'),
        key: 'prodreceiptid',
        type: 'input',
      },
      {
        caption: t('wholeInvoiceNumber'),
        key: 'invoice',
        type: 'input',
      },
    ];

    return config_filter;
  }, [i18n.language, customerFilterConfig]);
};

// ============================================================================

const SearchModal_prodreceipt = (
  props: Tprops_refine<Tprodreceipt_Dto> & {
    options?: Toptions;
  }
) => {
  const { options, ...rest } = props;

  const instance = useSearchModal_prodreceipt(options);

  return <SearchModal {...rest} useSearchModal={() => instance} />;
};

// ============================================================================

// 進貨單
export { useSearchModal_prodreceipt, SearchModal_prodreceipt };
export type { Tprodreceipt_Dto, Tconfig_filter };
