import { useEffect, useMemo } from 'react';
import moment from 'moment';

import type { TuseSearchModal, Tstate, Tconfig_filter, Tdto, Tconfig, TmodalData } from '../types';

import { useTranslation } from 'react-i18next';

import { useGetCustomers_infinite_2, TcustomerDto } from 'js/api/api_customer';

import type { Tparams } from 'js/api/dtoTypes';

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

const useSearchModal_customer = (): TuseSearchModal<TcustomerDto> => {
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
const useData = (filter: Tstate): TmodalData<TcustomerDto> => {
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
    viewRef: viewRef_bottom,
    isLoading: isLoadingPage1,
  };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
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

// 要做i18n的處理，因此設定不能抽出hook
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

const SearchModal_customer = (props: Tprops_refine<TcustomerDto>) => {
  return <SearchModal {...props} useSearchModal={useSearchModal_customer} />;
};

// ============================================================================

export { useSearchModal_customer, SearchModal_customer };
export type { TcustomerDto };
