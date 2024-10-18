import { useMemo } from 'react';

import type { TuseSearchModal, Tstate_filter, Tconfig_filter, Tdto, Tconfig, TmodalData } from '../types';

import { useTranslation } from 'react-i18next';

import { Tpayment_order_Dto, useGetPaymentOrder } from 'js/api/api_netCore/api_accountant';

import { useFilter } from '../useFilter';
import { useInputSelProps } from '../useInputSelProps';

import SearchModal, { Tprops_refine } from '..';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// =====================================================================================

// 由五個部分組成
// useConfig_filter: 設定左側filter的欄位
// useConfig_data: 設定table的欄位
// useFilter: 處理filter的狀態
// useInputSelProps: 將config_filter與狀態送入，建立inputSelProps
// useData: 將filter送進去，取得資料

const useSearchModal_paymentOrder = (): TuseSearchModal<Tpayment_order_Dto> => {
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
};

// =============================================================================
// 將filter送進來，給取得資料的api hook
// useData(或是要叫其他名字也無所謂)，的輸入與細節怎樣都無所謂，但必須輸出TmodalData
const useData = (state_filter: Tstate_filter | undefined): TmodalData<Tpayment_order_Dto> => {
  const { res = [], isFetching } = useGetPaymentOrder();

  const dataArr = useMemo(() => {
    if (!state_filter) {
      return res;
    }

    const { serial_number, beneficiary_name, applicant_department, offset_method, payable_method } = state_filter;
    const dataArr = res.filter((item) => {
      if (serial_number && !item.serial_number?.includes(serial_number)) {
        return false;
      }

      if (beneficiary_name && !item.beneficiary_name?.includes(beneficiary_name)) {
        return false;
      }

      if (applicant_department && !item.applicant_department?.includes(applicant_department)) {
        return false;
      }

      if (offset_method && !item.offset_method?.includes(offset_method)) {
        return false;
      }

      if (payable_method && !item.payable_method?.includes(payable_method)) {
        return false;
      }

      return true;
    });

    return dataArr;
  }, [res, state_filter]);

  return {
    dataArr,
    qty: dataArr.length,
    isLoading: isFetching,
  };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_data = () => {
  const { t } = useTranslation('accounting', { keyPrefix: 'paymentOrder' });
  const { t: t_common, i18n } = useTranslation('common');

  const dataConfig = useMemo(() => {
    const config: Tconfig<Tpayment_order_Dto> = {
      indexNumber: {
        label: t_common('indexNumber02'),
        style: {
          width: '30px',
        },
        reducer: (_, { index }) => {
          return index + 1;
        },
      },
      serial_number: {
        label: t('serial_number'),
        style: {
          width: '130px',
        },
      },
      beneficiary_name: {
        label: t('beneficiary_name'),
        style: {
          width: '100px',
        },
      },
      applicant_date: {
        label: t('applicant_date'),
        style: {
          width: '100px',
        },
        reducer: ({ applicant_date }) => {
          return getTaiwanDateStr(applicant_date);
        },
      },
      applicant_department: {
        label: t('applicant_department'),
        style: {
          width: '100px',
        },
      },
      offset_method: {
        label: t('offset_method'),
        style: {
          width: '100px',
        },
      },
      payable_method: {
        label: t('payable_method'),
        style: {
          width: '100px',
        },
      },
      payable_amount: {
        label: t('payable_amount'),
        style: {
          width: '100px',
        },
      },
      remittance_fee: {
        label: t('remittance_fee'),
        style: {
          width: '100px',
        },
      },
      deduction: {
        label: t('deduction'),
        style: {
          width: '100px',
        },
      },
      actualpaid: {
        label: t('actualpaid'),
        style: {
          width: '100px',
        },
      },
      note: {
        label: t('note'),
        style: {
          width: '200px',
        },
      },
    };

    return config;
  }, [i18n.language]);

  const dataKeyArr: string[] = [
    'indexNumber',
    'serial_number',
    'beneficiary_name',
    'applicant_date',
    'applicant_department',
    'offset_method',
    'payable_method',
    'payable_amount',
    'remittance_fee',
    'deduction',
    'actualpaid',
    'note',
  ];

  return { dataConfig, dataKeyArr };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_filter = () => {
  const { t, i18n } = useTranslation('accounting', { keyPrefix: 'paymentOrder' });

  return useMemo(() => {
    const config_filter: Tconfig_filter = [
      {
        caption: t('serial_number'),
        key: 'serial_number',
        type: 'input',
      },
      {
        caption: t('beneficiary_name'),
        key: 'beneficiary_name',
        type: 'input',
      },
      {
        caption: t('applicant_department'),
        key: 'applicant_department',
        type: 'input',
      },
      {
        caption: t('offset_method'),
        key: 'offset_method',
        type: 'input',
      },
      {
        caption: t('payable_method'),
        key: 'payable_method',
        type: 'input',
      },
      // {
      //   caption: t('payable_method'),
      //   key: 'payable_method',
      //   type: 'select',
      //   selectOptions: [
      //     { value: 'aaa', label: 'aaaa' },
      //   ],
      // },
    ];

    return config_filter;
  }, [i18n.language]);
};

// ============================================================================

const SearchModal_paymentOrder = (props: Tprops_refine<Tpayment_order_Dto>) => {
  return <SearchModal {...props} useSearchModal={useSearchModal_paymentOrder} />;
};

// ============================================================================

export { useSearchModal_paymentOrder, SearchModal_paymentOrder };
export type { Tpayment_order_Dto };
