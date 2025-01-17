import { useMemo, useEffect } from 'react';
import _ from 'lodash';

import type { TuseSearchModal, Tstate_filter, Tconfig_filter, Tconfig, TmodalData } from '../types';

// import { useTranslation } from 'react-i18next';

// api

import { TdoorAccessoryDto, useGetProdAccessories } from 'js/api/api_product';

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

const useSearchModal_prodAccessories = (doorNModelName: string): TuseSearchModal<TdoorAccessoryDto> => {
  const config_filter = useConfig_filter();
  const { dataConfig, dataKeyArr } = useConfig_data();

  const { state, setState, clearState, filter, confirmFilter } = useFilter({ config_filter });
  const inputSelPropsArr = useInputSelProps({ config_filter, state, setState });
  const { dataArr, viewRef, isLoading, qty } = useData(filter, doorNModelName);

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
const useData = (state_filter: Tstate_filter | undefined, doorNModelName: string): TmodalData<TdoorAccessoryDto> => {
  const dataKit = useGetProdAccessories(doorNModelName);
  const { data = [], isFetching, update } = dataKit;

  const dataArr = useMemo(() => {
    const dataArr = data.filter((item) => {
      return item.name.includes(state_filter?.name || '');
    });

    return dataArr;
  }, [data, state_filter]);

  useEffect(() => {
    update();
  }, []);

  return {
    dataArr,
    qty: dataArr?.length || '',
    isLoading: isFetching,
  };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_data = () => {
  const dataConfig = useMemo(() => {
    const config: Tconfig<TdoorAccessoryDto> = {
      doorModelName: {
        label: '門型',
        style: {
          width: '100px',
        },
      },
      name: {
        label: '名稱',
        style: {
          width: '500px',
          justifyContent: 'flex-start',
        },
      },
      price: {
        label: '金額',
        style: {
          width: '100px',
          justifyContent: 'flex-end',
          marginRight: '15px',
        },
        reducer(data, optional) {
          const price = data.price || 0;

          return price.toLocaleString();
        },
      },

      //
    };

    return config;
  }, []);

  const dataKeyArr: string[] = ['doorModelName', 'name', 'price'];

  return { dataConfig, dataKeyArr };
};

// =============================================================================

// 要做i18n的處理，因此設定不能抽出hook
const useConfig_filter = () => {
  return useMemo(() => {
    const config_filter: Tconfig_filter = [
      {
        caption: '名稱',
        key: 'name',
        type: 'input',
      },
    ];

    return config_filter;
  }, []);
};

// ============================================================================

const SearchModal_prodAccessories = (_props: Tprops_refine<TdoorAccessoryDto> & { doorNModelName: string }) => {
  const { doorNModelName, ...props } = _props;

  const instance = useSearchModal_prodAccessories(doorNModelName);

  return <SearchModal {...props} useSearchModal={() => instance} />;
};

// ============================================================================

export { useSearchModal_prodAccessories, SearchModal_prodAccessories };
export type { TdoorAccessoryDto };
