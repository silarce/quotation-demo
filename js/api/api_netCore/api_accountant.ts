import { useState, useEffect, useCallback } from 'react';

import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi2 } from '../_axiosCreator';
import { AxiosError } from 'axios';

import type { TaccountantPresetDto, TcreateAccountantPresetDto } from './_schemas';

// =================================================================================

const apiGetBankAccount = async () => {
  const api = '/Accountant/GetBankAccount';

  return axi2.get<TaccountantPresetDto[]>(api).catch((err: AxiosError) => {
    myAlert.err({ title: '取得銀行帳戶資料失敗', content: err.message });

    return Promise.reject(err);
  });
};

const useGetBankAccount = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [rawData, setRawData] = useState<TaccountantPresetDto[]>();

  const update = async () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    await apiGetBankAccount()
      .then(({ data }) => {
        setRawData(data);
      })
      .catch(() => {
        setRawData(undefined);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    rawData_bankAccount: rawData,
    update_bankAccount: update,
    isFetching_bankAccount: isFetching,
  };
};

const apiPostBankAccount = async (data: TcreateAccountantPresetDto) => {
  const api = '/Accountant/AddBankAccount';

  return axi2.post<TaccountantPresetDto>(api, data).catch((err: AxiosError) => {
    myAlert.err({ title: '新增銀行帳戶資料失敗', content: err.message });

    return Promise.reject(err);
  });
};

// =================================================================================

export { useGetBankAccount, apiPostBankAccount };
export type { TaccountantPresetDto, TcreateAccountantPresetDto };
