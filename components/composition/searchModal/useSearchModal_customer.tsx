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
      pageSize: 20,
      sort: 'customerNumber',
      order: 'ASC',
      filter: {
        name: {
          $contains: filter.name,
        },
        customerNumber: {
          $contains: filter.customerNumber,
        },
        createdAt: (() => {
          if (!filter.createdAt) {
            return undefined;
          } else {
            return {
              $gte: moment(filter.createdAt).startOf('day').toISOString(),
              $lte: moment(filter.createdAt).endOf('day').toISOString(),
            };
          }
        })(),
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
  const { t, i18n } = useTranslation('common');

  const dataConfig = useMemo(() => {
    const config: Tconfig<TcustomerDto> = {
      indexNumber: {
        label: t('indexNumber02'),
        style: {
          width: '50px',
        },
        reducer: ({ index }) => {
          return index + 1;
        },
      },
      customerNumber: {
        label: t('customerNumber'),
        style: {
          width: '200px',
        },
      },
      name: {
        label: t('name02'),
        style: {
          width: '300px',
        },
      },
      nickname: {
        label: t('nickname'),
        style: {
          width: '200px',
        },
      },
      type: {
        label: t('type02'),
        style: {
          width: '200px',
        },
        reducer: ({ data }) => {
          const types = data.types;
          const arr = types.map(({ name }) => t(name));

          const str = arr.join(', ');

          return str;
        },
      },
      createdAt: {
        label: t('createdAt'),
        style: {
          width: '100px',
        },
        reducer: ({ data }) => {
          return moment(data.createdAt).format('YYYY-MM-DD');
        },
      },
    };

    return config;
  }, [i18n.language]);

  const dataKeyArr: string[] = ['indexNumber', 'customerNumber', 'name', 'nickname', 'type', 'createdAt'];

  return { dataConfig, dataKeyArr };
};

// =============================================================================
const useConfig_filter = () => {
  const { t, i18n } = useTranslation('common');

  return useMemo(() => {
    const config_filter: Tconfig_filter = [
      {
        caption: t('customerNumber'),
        key: 'customerNumber',
        type: 'input',
      },
      {
        caption: t('name02'),
        key: 'name',
        type: 'input',
      },
      {
        caption: t('type02'),
        key: 'type',
        type: 'select',
        selectOptions: [
          { value: 'construction', label: t('construction') },
          { value: 'firm', label: t('firm') },
          { value: 'propertyOwner', label: t('propertyOwner') },
          { value: 'contractor', label: t('contractor') },
        ],
      },
      {
        caption: t('createdAt'),
        key: 'createdAt',
        type: 'date',
      },
    ];

    return config_filter;
  }, [i18n.language]);
};

// ============================================================================

export { useSearchModal_customer };
