import { useState, useEffect, useMemo } from 'react';

import { axi_monkey } from '../axiosCreator';

import type { AxiosError } from 'axios';

import type { TdropDown } from './schemas';

type TdropDownParams =
  | 'sales_order_type' // 銷貨單類別
  | 'RetainageType' // 合約保留款類型
  | 'RetainageTaxCategory' // 保留款稅別
  | 'InvoiceType' //發票類型
  | 'IncomeType' // 收入類別
  | 'deduction_type'; // 扣款類別

const apiGetDropDown = async (ddtype: TdropDownParams) => {
  const api = '/api/CommonControllers/GetDropDownDate';
  const params = {
    ddtype,
  };

  return axi_monkey.get<TdropDown[]>(api, { params }).then(({ data }) => data);
};

const useApiGetDropDown = (
  ddtype: TdropDownParams,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TdropDown[] | null>();

  const options = useMemo(() => {
    if (!res) {
      return [];
    }

    return res.map((item) => ({
      label: item.name,
      value: item.name,
    }));
  }, [res]);

  const update = async () => {
    setIsFetching(true);

    await apiGetDropDown(ddtype)
      .then((dropDownArr) => {
        setRes(dropDownArr);

        return dropDownArr;
      })
      .catch((error: AxiosError) => {
        console.error('useApiGetDropDown error:', error);
        setRes(null);

        return null;
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    autoUpdate && update();
  }, [ddtype]);

  return {
    isFetching,
    data: res,
    update,
    options,
  };
};

export { useApiGetDropDown };
