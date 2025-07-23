import { useState, useEffect } from 'react';

import { axi_monkey } from '../_axiosCreator';

import type { AxiosError } from 'axios';

import type { TaccountsReceivablesList_Dto } from './_schemas';

const apiGetAccountsReceivablesList = async () => {
  const api = '/api/AccountsReceivable/GetAccountsReceivablesList';

  return axi_monkey.get<TaccountsReceivablesList_Dto[]>(api).then(({ data }) => data);
};

const useApiGetAccountsReceivablesList = ({ autoUpdate = true }: { autoUpdate?: boolean } = {}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<TaccountsReceivablesList_Dto[] | null>();

  const update = async () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);

    const res = await apiGetAccountsReceivablesList().catch((err: AxiosError) => {
      console.error('useApiGetAccountsReceivablesList error:', err);

      setData(null);

      return null;
    });

    setData(res);
    setIsFetching(false);
  };

  useEffect(() => {
    autoUpdate && update();
  }, []);

  return {
    isFetching,
    data,
    update,
  };
};

export type { TaccountsReceivablesList_Dto };
export { useApiGetAccountsReceivablesList };
