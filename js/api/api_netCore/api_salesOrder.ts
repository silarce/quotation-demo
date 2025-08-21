import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';

import { axi_monkey } from '../_axiosCreator';

import type { AxiosError } from 'axios';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import type { TsalesOrder_simple_Dto, TproductView_Dto } from 'js/api/api_netCore/schemas';

const apiGetSalesOrderDataList = async () => {
  const api = '/api/SalesOrder/GetSalesOrderDataList';

  return await axi_monkey.get<TsalesOrder_simple_Dto[]>(api).then(({ data }) => data);
};

const useApiGetSalesOrderDataList = ({ autoUpdate = true }: { autoUpdate?: boolean } = {}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TsalesOrder_simple_Dto[] | null>();

  const update = async () => {
    setIsFetching(true);

    await apiGetSalesOrderDataList()
      .then((res) => {
        const sorted = _.sortBy(res, 'salesOrderNumber').reverse();

        setRes(sorted);
      })
      .catch(() => {
        setRes(null);
        myAlert.notify.error({
          message: '取得銷貨單列表失敗',
        });
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    autoUpdate && update();
  }, []);

  return {
    data: res,
    isFetching,
    update,
  };
};

const apiGetProductProfileList = async () => {
  const api = '/api/SalesOrder/GetProductList';

  return await axi_monkey.get<TproductView_Dto[]>(api).then(({ data }) => data);
};

const useApiGetProductProfileList = ({ autoUpdate = true }: { autoUpdate?: boolean } = {}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TproductView_Dto[] | null>();

  const update = async () => {
    setIsFetching(true);
    await apiGetProductProfileList()
      .then((res) => {
        setRes(res);
      })
      .catch(() => {
        setRes(null);
        myAlert.notify.error({
          message: '取得產品資料失敗',
        });
      })
      .finally(() => setIsFetching(false));
  };

  const options = useMemo(() => {
    return (
      res?.map((item) => ({
        value: item.id,
        label: item.productName,
        raw: item,
      })) || []
    );
  }, [res]);

  useEffect(() => {
    autoUpdate && update();
  }, []);

  return {
    data: res,
    isFetching,
    options,
    update,
  };
};

export type { TsalesOrder_simple_Dto, TproductView_Dto };

export { useApiGetSalesOrderDataList, useApiGetProductProfileList };
