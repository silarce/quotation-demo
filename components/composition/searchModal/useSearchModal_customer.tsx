import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';

import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import type { TuseSearchModal, Tstate, Tconfig_filter, Tdto, Tconfig } from './types';

import { useTranslation } from 'react-i18next';

import { useGetCustomers_infinite_2, TcustomerDto } from 'js/api/api_customer';

import type { Tparams } from 'js/api/dtoTypes';

import { useFilter } from './useFilter';
import { useInputSelProps } from './useInputSelProps';

// =====================================================================================

const useSearchModal_customer = (): TuseSearchModal<TcustomerDto> => {
  const config_filter = useConfig_filter();
  const { dataConfig, dataKeyArr } = useConfig_data();

  const { state, setState, clearState, filter, confirmFilter } = useFilter({ config_filter });
  const inputSelPropsArr = useInputSelProps({ config_filter, state, setState });
  const { dataArr, viewRef_bottom, isLoadingPage1, qty } = useData(filter);

  return {
    inputSelPropsArr,
    clearFilter: clearState,
    confirmFilter,
    //
    dataArr,
    qty,
    viewRef: viewRef_bottom,
    isLoading: isLoadingPage1,
    dataConfig,
    dataKeyArr,
  };
  //
}; // useSearchModal_customer

// =============================================================================
const useData = (filter: Tstate) => {
  const params: Tparams = useMemo(() => {
    return {
      filter: {
        name: {
          $contains: filter.name,
        },
        customerNumber: {
          $contains: filter.customerNumber,
        },
      },
    };
  }, [filter]);

  const { dataArr, viewRef_bottom, isLoadingPage1, reset, meta } = useGetCustomers_infinite_2({
    customParams: params,
  });

  useEffect(() => {
    reset();
  }, [params]);

  return {
    dataArr,
    qty: meta?.itemCount || '',
    viewRef_bottom,
    isLoadingPage1,
  };
};

// =============================================================================
const useConfig_data = () => {
  const { t, i18n } = useTranslation();

  const dataConfig = useMemo(() => {
    const config: Tconfig<TcustomerDto> = {
      indexNumber: {
        label: '序',
        style: {
          width: '50px',
        },
        reducer: ({ index }) => {
          return index + 1;
        },
      },
      customerNumber: {
        label: '編號',
        style: {
          width: '200px',
        },
      },
      name: {
        label: '名稱',
        style: {
          width: '300px',
        },
      },
      nickname: {
        label: '暱稱',
        style: {
          width: '200px',
        },
      },
    };

    return config;
  }, [i18n.language]);

  const dataKeyArr: string[] = ['indexNumber', 'customerNumber', 'name', 'nickname'];

  return { dataConfig, dataKeyArr };
};

// =============================================================================
const useConfig_filter = () => {
  const { t, i18n } = useTranslation();

  return useMemo(() => {
    const config_filter: Tconfig_filter = [
      {
        caption: '編號',
        key: 'customerNumber',
        type: 'input',
      },
      {
        caption: '名稱',
        key: 'name',
        type: 'input',
      },
      // {
      //   caption: 'T01',
      //   key: 'T01',
      //   type: 'input',
      // },
      // {
      //   caption: 'T02',
      //   key: 'T02',
      //   type: 'input',
      // },
      // {
      //   caption: 'T03',
      //   key: 'T03',
      //   type: 'input',
      // },
      // {
      //   caption: 'T04',
      //   key: 'T04',
      //   type: 'select',
      //   selectOptions: [
      //     { value: '1', label: '1' },
      //     { value: '2', label: '2' },
      //     { value: '3', label: '3' },
      //   ],
      // },
      // {
      //   caption: 'T05',
      //   key: 'T05',
      //   type: 'date',
      // },
    ];

    return config_filter;
  }, [i18n.language]);
};

// ============================================================================

export { useSearchModal_customer };
