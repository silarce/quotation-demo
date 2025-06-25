import { useState, useEffect } from 'react';

import { axi_netCore } from '../_axiosCreator';
import { AxiosError } from 'axios';

import type { TengineerContactExport } from './_schemas';

// ==========================================================

// 網址：https://localhost:44383/api/Engineer/GetEngineerContactExport?contactId=工程聯絡單id

const apiGetEngineerContactExport = async (contactId: string) => {
  const api = '/api/Engineer/GetEngineerContactExport';

  const params = {
    contactId,
  };

  return axi_netCore.get<TengineerContactExport>(api, { params }).then(({ data }) => data);
};

const useApiGetEngineerContactExport = (
  contactId: string | undefined,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  }
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<TengineerContactExport | null>();

  const update = async () => {
    if (!contactId) {
      setData(undefined);

      return;
    }

    setIsFetching(true);

    try {
      const data = await apiGetEngineerContactExport(contactId);
      setData(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('API Error:', error.message);
      } else {
        console.error('未知錯誤:', error);
      }

      setData(null);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    autoUpdate && update();
  }, [contactId]);

  return {
    isFetching,
    engineerContactExport: data,
    update,
  };
};

export { useApiGetEngineerContactExport };
export type { TengineerContactExport };
