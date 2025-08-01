import { useEffect, useMemo } from 'react';
import _ from 'lodash';

import type { TuseSearchModal, Tstate_filter, Tconfig_filter, Tdto, Tconfig, TmodalData } from '../types';

import { useTranslation } from 'react-i18next';

import {
  useGetUnpaidProdreceiptByInvoiceNumber,
  Tprodreceipt_Dto,
  // Tprodreceiptdetail_Dto,
} from 'js/api/api_netCore/api_accountant';
import type { Tprodreceiptdetail_Dto } from 'js/api/api_netCore/schemas';

import { useFilter } from '../useFilter';
import { useInputSelProps } from '../useInputSelProps';

import SearchModal, { Tprops_refine } from '..';

// =====================================================================================

interface Toptions {
  coverFilter?: Tconfig_filter;
  customKeyArr?: string[];
  removeData_noProdreceipt?: boolean;
}

interface Tprodreceiptdetail_Dto_addition extends Tprodreceiptdetail_Dto {
  invoice: Tprodreceipt_Dto['invoice'];
}

// =====================================================================================

// 由五個部分組成
// useConfig_filter: 設定左側filter的欄位
// useConfig_data: 設定table的欄位
// useFilter: 處理filter的狀態
// useInputSelProps: 將config_filter與狀態送入，建立inputSelProps
// useData: 將filter送進去，取得資料

const useSearchModal_prodreceiptDetail = (options?: Toptions): TuseSearchModal<Tprodreceiptdetail_Dto_addition> => {
  const { removeData_noProdreceipt = true } = options ?? {};
  const config_filter = useConfig_filter(options?.coverFilter);
  const { dataConfig, dataKeyArr } = useConfig_data(options?.customKeyArr);

  const { state, setState, clearState, filter, confirmFilter } = useFilter({ config_filter });
  const inputSelPropsArr = useInputSelProps({ config_filter, state, setState });
  const { dataArr, viewRef, isLoading, qty } = useData(filter, { removeData_noProdreceipt });

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
  filter: Tstate_filter | undefined,
  { removeData_noProdreceipt }: { removeData_noProdreceipt?: boolean } = {}
): TmodalData<Tprodreceiptdetail_Dto_addition> => {
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

      return pass;
    });

    let datailArr = dataArr.flatMap((data) => {
      return data.detail.map((detail) => {
        return {
          ...detail,
          invoice: data.invoice,
        };
      });
    });

    if (removeData_noProdreceipt) {
      datailArr = datailArr.filter((data) => {
        return data.prodreceiptuuid;
      });
    }

    return datailArr;
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
    const config: Tconfig<Tprodreceiptdetail_Dto_addition> = {
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
          width: '120px',
        },
      },
      invoice: {
        label: t('invoice'),
        style: {
          width: '120px',
        },
      },
      name: {
        label: t_common('name'),
        style: {
          width: 200,
          justifyContent: 'flex-start',
        },
      },
      spec: {
        label: t_common('spec'),
        style: {
          width: 200,
          justifyContent: 'flex-start',
        },
      },
      quantity: {
        label: t_common('quantity'),
        style: {
          width: '60px',
        },
      },
      unit: {
        label: t_common('unit'),
        style: {
          width: '60px',
        },
      },
      unitprice: {
        label: t_common('unitprice'),
        style: {
          width: '80px',
          justifyContent: 'flex-end',
        },
        reducer(data) {
          return data.unitprice?.toLocaleString() || 0;
        },
      },
      totalprice: {
        label: t_common('totalPrice'),
        style: {
          width: '100px',
          justifyContent: 'flex-end',
        },
        reducer(data) {
          return data.totalprice?.toLocaleString() || 0;
        },
      },
      note: {
        label: t_common('note'),
        style: {
          width: '200px',
          justifyContent: 'flex-start',
        },
      },
      //
    };

    return config;
  }, [i18n.language]);

  const dataKeyArr: string[] = customKeyArr || [
    //
    'indexNumber',
    'prodreceiptid',
    'invoice',
    'name',
    'spec',
    'quantity',
    'unit',
    'unitprice',
    'totalprice',
    'note',
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

const SearchModal_prodreceiptDetail = (
  props: Tprops_refine<Tprodreceiptdetail_Dto_addition> & {
    options?: Toptions;
  }
) => {
  const { options, ...rest } = props;

  const instance = useSearchModal_prodreceiptDetail(options);

  return <SearchModal {...rest} useSearchModal={() => instance} />;
};

// ============================================================================

// 進貨單
export { useSearchModal_prodreceiptDetail, SearchModal_prodreceiptDetail };
export type { Tprodreceiptdetail_Dto_addition, Tconfig_filter };
