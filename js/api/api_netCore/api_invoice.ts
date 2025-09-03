import { useState, useEffect } from 'react';

import { axi_monkey } from '../axiosCreator';

import type { AxiosError } from 'axios';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import type {
  TapiParams,
  Tmeta,
  Tinvoice_Dto,
  Tbody_updateInvoiceStatus,
  Tbody_insertInvoiceDiscount,
} from './schemas';

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

  const clear = () => {
    setRes(undefined);
  };

  useEffect(() => {
    autoUpdate && update();
  }, [invoiceBookId]);

  return {
    data: res,
    isFetching,
    update,
    clear,
  };
};

const apiUpdateInvoiceStatus = (body: Tbody_updateInvoiceStatus) => {
  const api = `/api/Invoice/UpdateInvoiceStatus`;

  return axi_monkey
    .patch(api, body)
    .then(() => {
      myAlert.success({ title: '作廢成功' });
    })
    .catch((error) => {
      const err = error as AxiosError;
      console.error(err);
      myAlert.err({
        title: '作廢發票狀態失敗',
      });

      return Promise.reject(err);
    });
};

const apiInsertInvoiceDiscount = (body: Tbody_insertInvoiceDiscount) => {
  const api = `/api/Invoice/InsertInvoiceDiscount`;

  return axi_monkey
    .post<Tmeta>(api, body)
    .then(({ data }) => {
      myAlert.success({ title: '發票折讓完成' });

      return data;
    })
    .catch((error) => {
      const err = error as AxiosError;
      console.error(err);
      myAlert.err({
        title: '發票折讓失敗',
      });

      return Promise.reject(err);
    });
};

// ============================================================================

export type { Tinvoice_Dto, Tbody_insertInvoiceDiscount };

export { useApiGetInvoiceNumberLists, apiUpdateInvoiceStatus, apiInsertInvoiceDiscount };
