import { useState, useEffect } from 'react';

import { axi_monkey } from '../_axiosCreator';

import type { AxiosError } from 'axios';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import type { TapiParams, Tmeta, Tinvoice_Dto } from './schemas';

const apiGetInvoiceNumberLists = (invoiceBookId: string) => {
  const api = `/api/Invoice/GetInvoiceNumberLists`;

  const params = { invoiceBookId };

  return axi_monkey.get<Tinvoice_Dto[]>(api, { params }).then(({ data }) => data);
};

const useApiGetInvoiceNumberLists = (
  invoiceBookId: string | undefined,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<Tinvoice_Dto[] | null>();

  const update = async () => {
    if (isFetching) {
      return;
    }

    if (!invoiceBookId) {
      setRes(undefined);

      return;
    }

    setIsFetching(true);

    return await apiGetInvoiceNumberLists(invoiceBookId)
      .then((res) => {
        setRes(res);

        return res;
      })
      .catch((error) => {
        const err = error as AxiosError;
        myAlert.notify.error({
          message: '取得發票列表失敗',
          description: err?.message,
        });
        setRes(null);

        return null;
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    autoUpdate && update();
  }, [invoiceBookId]);

  return {
    data: res,
    isFetching,
    update,
  };
};

// ============================================================================

export type { Tinvoice_Dto };

export { useApiGetInvoiceNumberLists };
