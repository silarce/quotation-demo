import { useMemo } from 'react';

import type { TuseSearchModal, Tstate_filter, Tconfig_filter, Tdto, Tconfig, TmodalData } from '../types';

import { useTranslation } from 'react-i18next';

import { TpurchaseCollectTicket_Dto, useGetPurchaseCollectTicket } from 'js/api/api_netCore/api_accountant';

import { useFilter } from '../useFilter';
import { useInputSelProps } from '../useInputSelProps';

import SearchModal, { Tprops_refine } from '..';

// =====================================================================================

// 由五個部分組成
// useConfig_filter: 設定左側filter的欄位
// useConfig_data: 設定table的欄位
// useFilter: 處理filter的狀態
// useInputSelProps: 將config_filter與狀態送入，建立inputSelProps
// useData: 將filter送進去，取得資料

const useSearchModal_purchaseCollectTicket = (): TuseSearchModal<TpurchaseCollectTicket_Dto> => {
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
const useData = (state_filter: Tstate_filter | undefined): TmodalData<TpurchaseCollectTicket_Dto> => {
  const { res = [], setRes, update, isFetching } = useGetPurchaseCollectTicket();

  const dataArr = useMemo(() => {
    let dataArr = res;

    if (!state_filter) {
      return dataArr;
    }

    dataArr = res.filter((data) => {
      let pass = true;

      const {
        serial_number,
        // applicant_department,
        // agent_employee_id,
        // ticket_method,
        // tax_deduction_category,
        // arrc_method,
        invoice_number,
        // invoice_price,
        // note,
      } = state_filter;

      if (serial_number && !data.serial_number.includes(serial_number)) {
        pass = false;
      }

      if (invoice_number && !data.invoice_number?.includes(invoice_number)) {
        pass = false;
      }

      return pass;
    });

    return dataArr;
  }, [res, state_filter]);

  // useEffect(() => {
  //   update();
  // }, [params]);

  return {
    dataArr,
    qty: res.length,
    isLoading: isFetching,
  };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_data = () => {
  const { t: t_common } = useTranslation('common');
  const { t, i18n } = useTranslation('accounting', { keyPrefix: 'purchaseCollectTicket' });

  const dataConfig = useMemo(() => {
    const config: Tconfig<TpurchaseCollectTicket_Dto> = {
      indexNumber: {
        label: t_common('indexNumber02'),
        style: {
          width: '50px',
        },
        reducer: (_, { index }) => {
          return index + 1;
        },
      },
      serial_number: {
        label: t('serial_number'),
        style: {
          width: '150px',
        },
      },
      invoice_number: {
        label: t('invoice_number'),
        style: {
          width: '150px',
        },
      },
      invoice_price: {
        label: t('invoice_price'),
        style: {
          width: '150px',
        },
        reducer: (data) => {
          return data.invoice_price ? data.invoice_price.toLocaleString() : '';
        },
      },
      ticket_method: {
        label: t('ticket_method'),
        style: {
          width: '100px',
        },
      },
      tax_deduction_category: {
        label: t('tax_deduction_category'),
        style: {
          width: '100px',
        },
      },
      arrc_method: {
        label: t('arrc_method'),
        style: {
          width: '100px',
        },
      },

      note: {
        label: t('note'),
        style: {
          width: '150px',
        },
      },
    };

    return config;
  }, [i18n.language]);

  const dataKeyArr: string[] = [
    'indexNumber',
    'serial_number',
    'invoice_number',
    'invoice_price',
    'ticket_method',
    'tax_deduction_category',
    'arrc_method',
    'note',
  ];

  return { dataConfig, dataKeyArr };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_filter = () => {
  const { t, i18n } = useTranslation('accounting', { keyPrefix: 'purchaseCollectTicket' });

  return useMemo(() => {
    const config_filter: Tconfig_filter = [
      {
        caption: t('invoice_number'),
        key: 'invoice_number',
        type: 'input',
      },
      {
        caption: t('serial_number'),
        key: 'serial_number',
        type: 'input',
      },
    ];

    return config_filter;
  }, [i18n.language]);
};

// ============================================================================

const SearchModal_purchaseCollectTicket = (props: Tprops_refine<TpurchaseCollectTicket_Dto>) => {
  return <SearchModal {...props} useSearchModal={useSearchModal_purchaseCollectTicket} />;
};

// ============================================================================

export { useSearchModal_purchaseCollectTicket, SearchModal_purchaseCollectTicket };
export type { TpurchaseCollectTicket_Dto };
