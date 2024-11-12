import { useMemo } from 'react';
import _ from 'lodash';

import type { TuseSearchModal, Tstate_filter, Tconfig_filter, Tconfig, TmodalData } from '../types';

import { useTranslation } from 'react-i18next';

// api
import { TapplyPayment_Dto, useGetApplyPayment } from 'js/api/api_netCore/api_accountant';

import type { Tparams } from 'js/api/dtoTypes';

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

const useSearchModal_applyPayment = (): TuseSearchModal<TapplyPayment_Dto> => {
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
}; // useSearchModal_customer

// =============================================================================
// 將filter送進來，給取得資料的api hook
// useData(或是要叫其他名字也無所謂)，的輸入與細節怎樣都無所謂，但必須輸出TmodalData
const useData = (state_filter: Tstate_filter | undefined): TmodalData<TapplyPayment_Dto> => {
  // const params: Tparams = useMemo(() => {
  //   return {
  //     pageSize: 20,
  //     sort: 'customerNumber',
  //     order: 'ASC',
  //     filter: {
  //       name: {
  //         $contains: filter.name,
  //       },
  //       customerNumber: {
  //         $contains: filter.customerNumber,
  //       },
  //     },
  //   };
  // }, [filter]);

  // const { dataArr, viewRef_bottom, isLoadingPage1, reset, meta } = useGetCustomers_infinite_2({
  //   customParams: params,
  // });
  const dataKit = useGetApplyPayment();
  const { res = [], isFetching, update } = dataKit;

  const dataArr = useMemo(() => {
    return _.sortBy(res, 'serial_number');
  }, [res]);

  // useEffect(() => {
  //   update();
  // }, [params]);

  return {
    dataArr,
    qty: dataArr?.length || '',
    isLoading: isFetching,
  };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_data = () => {
  const { t: t_common, i18n } = useTranslation('common');
  const { t } = useTranslation('accounting', { keyPrefix: 'applyPayment' });

  const dataConfig = useMemo(() => {
    const config: Tconfig<TapplyPayment_Dto> = {
      serial_number: {
        label: t('serial_number'),
        style: {
          width: '200px',
        },
      },
      payment_date: {
        label: t('payment_date'),
        style: {
          width: '80px',
        },
        reducer: ({ payment_date }, { index }) => {
          return getTaiwanDateStr(payment_date);
        },
      },
      applicant_department: {
        label: t('applicant_department'),
        style: {
          width: '80px',
        },
      },
      status: {
        label: t('status'),
        style: {
          width: '80px',
        },
      },
      total_price: {
        label: t('total_price'),
        style: {
          width: '80px',
          justifyContent: 'flex-end',
        },
        reducer: ({ total_price }, { index }) => {
          return total_price?.toLocaleString() || '';
        },
      },
      description: {
        label: t('description'),
        style: {
          width: '200px',
        },
      },
      // agent: {
      //   label: t_common('agent'),
      //   style: {
      //     width: '80px',
      //   },
      //   reducer: ({ agent_employee }, { index }) => {
      //     return agent_employee?.chName || '';
      //   },
      // },

      //
    };

    return config;
  }, [i18n.language]);

  // const dataKeyArr: string[] = ['serial_number', 'payment_date'];
  const dataKeyArr: string[] = [
    'serial_number',
    'payment_date',
    'applicant_department',
    'status',
    'total_price',
    'description',
    // 'agent',
  ];

  return { dataConfig, dataKeyArr };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_filter = () => {
  const { t, i18n } = useTranslation('common');

  return useMemo(() => {
    const config_filter: Tconfig_filter = [
      // {
      //   caption: t('customerNumber'),
      //   key: 'customerNumber',
      //   type: 'input',
      // },
      // {
      //   caption: t('name02'),
      //   key: 'name',
      //   type: 'input',
      // },
      // {
      //   caption: t('type02'),
      //   key: 'type',
      //   type: 'select',
      //   selectOptions: [
      //     { value: 'construction', label: t('construction') },
      //     { value: 'firm', label: t('firm') },
      //     { value: 'propertyOwner', label: t('propertyOwner') },
      //     { value: 'contractor', label: t('contractor') },
      //   ],
      // },
    ];

    return config_filter;
  }, [i18n.language]);
};

// ============================================================================

const SearchModal_applyPayment = (props: Tprops_refine<TapplyPayment_Dto>) => {
  return <SearchModal {...props} useSearchModal={useSearchModal_applyPayment} />;
};

// ============================================================================

export { useSearchModal_applyPayment, SearchModal_applyPayment };
export type { TapplyPayment_Dto };
