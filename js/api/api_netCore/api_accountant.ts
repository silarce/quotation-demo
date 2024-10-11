import { useState, useEffect, useCallback } from 'react';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi2 } from '../_axiosCreator';
import { AxiosError } from 'axios';

import type {
  //
  TaccountantPresetDto,
  TcreateAccountantPresetDto,
  TupdateAccountantPresetDto,
  //
  TapplyPayment_Dto,
  TcreateApplyPayment_data_Dto,
  TupdateApplyPayment_data_Dto,
  TcreateApplyPayment_Dto,
  TupdateApplyPayment_Dto,
  TpurchaseInvoice_Dto,
} from './_schemas';

const subRoot = 'Accountant';

// =================================================================================

interface TapplyPayment_Dto_detailed extends TapplyPayment_Dto {
  detailArr: TpurchaseInvoice_Dto[];
}

// =================================================================================

// region BankAccount
const apiGetBankAccount = async () => {
  const api = `/${subRoot}/GetBankAccount`;

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
  const api = `/${subRoot}/AddBankAccount`;

  return axi2.post<string>(api, data).catch((err: AxiosError) => {
    myAlert.err({ title: '新增銀行帳戶資料失敗', content: err.message });

    return Promise.reject(err);
  });
};

const apiPatchBankAccount = async (data: TupdateAccountantPresetDto) => {
  const api = `/${subRoot}/UpdateBankAccount`;

  return axi2.post<string>(api, data).catch((err: AxiosError) => {
    myAlert.err({ title: '更新銀行帳戶資料失敗', content: err.message });

    return Promise.reject(err);
  });
};

// =================================================================================

// region applyPayment

// 取得所有支出單
const apiGetApplyPayment = async () => {
  const api = `/${subRoot}/GetApplyPayment`;
  const params = {
    id: 'all',
  };

  return axi2
    .get<TapplyPayment_Dto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '取得所有支出單失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 取得單一支出單
const apiGetApplyPaymentById = async (id: string) => {
  const api = `/${subRoot}/GetApplyPaymentById`;
  const params = {
    id,
  };

  return axi2
    .get<TapplyPayment_Dto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '取得支出單失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 新增支出單
const apiPostAddApplyPayment = async (data: TcreateApplyPayment_Dto) => {
  const api = `/${subRoot}/AddApplyPayment`;

  return axi2
    .post<string>(api, data)
    .then(({ data: id }) => id)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '新增支出單失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 編輯支出單
const apiPatchUpdateApplyPayment = async (data: TupdateApplyPayment_Dto) => {
  const api = `/${subRoot}/UpdateApplyPayment`;

  return axi2.post(api, data).catch((err: AxiosError) => {
    myAlert.err({ title: '更新支出單失敗', content: err.message });

    return Promise.reject(err);
  });
};

// 取得支出單所有支出單明細(進項發票)
const apiGetApplyPaymentDetail = async (apply_payment_id: string) => {
  const api = `/${subRoot}/GetApplyPaymentDetailByApplyPaymentId`;
  const params = {
    apply_payment_id,
  };

  return axi2
    .get<TpurchaseInvoice_Dto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '取得支出單明細失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 刪除支出單明細
const apiDeleteApplyPaymentDetail = async (id: string) => {
  const api = `/${subRoot}/DeleteApplyPaymentDetail`;
  const data = {
    id,
  };

  return axi2.post(api, data).catch((err: AxiosError) => {
    myAlert.err({ title: '刪除支出單明細失敗', content: err.message });

    return Promise.reject(err);
  });
};

const useGetApplyPayment = ({
  callAlertOnError = true,
  autoUpdate = true,
}: {
  callAlertOnError?: boolean;
  autoUpdate?: boolean;
} = {}) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [res, setRes] = useState<TapplyPayment_Dto[]>();

  const update = useCallback(async () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);

    return await apiGetApplyPayment()
      .then((data) => {
        setRes(data);

        return data;
      })
      .catch((err: AxiosError) => {
        setRes(undefined);
        callAlertOnError && myAlert.err({ title: '取得支出單列表失敗', content: err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  useEffect(() => {
    autoUpdate && update();
  }, []);

  return {
    res,
    setRes,
    update,
    isFetching,
  };
};

const useGetApplyPaymentById = (
  id: string | undefined,
  {
    callAlertOnError = true,
    autoUpdate = true,
  }: {
    callAlertOnError?: boolean;
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [res, setRes] = useState<TapplyPayment_Dto_detailed>();

  const update = useCallback(async () => {
    if (isFetching || !id) {
      return;
    }

    setIsFetching(true);

    return await apiGetApplyPaymentById(id)
      .then(async (data) => {
        const applyPayment = data[0];

        if (!applyPayment) {
          throw new Error('找不到支出單');
        }

        return applyPayment;
      })
      .then(async (applyPayment) => {
        const detailArr = await apiGetApplyPaymentDetail(id);

        const applyPayment_detailed: TapplyPayment_Dto_detailed = { ...applyPayment, detailArr: detailArr };

        setRes(applyPayment_detailed);

        return applyPayment_detailed;
      })
      .catch((err: AxiosError) => {
        setRes(undefined);
        callAlertOnError && myAlert.err({ title: '取得支出單失敗', content: err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [callAlertOnError, id, isFetching]);

  const reqPatch = useCallback(
    async (preBody: Omit<TupdateApplyPayment_Dto, 'apply_payment_id'>) => {
      if (isFetching || !id) {
        return;
      }

      setIsFetching(true);
      const body: TupdateApplyPayment_Dto = { apply_payment_id: id, ...preBody };

      const res = await apiPatchUpdateApplyPayment(body)
        .then(() => {
          return 'success';
        })
        .catch((err: AxiosError) => {
          callAlertOnError && myAlert.err({ title: '更新支出單失敗', content: err.message });
        })
        .finally(() => {
          setIsFetching(false);
        });

      if (res === 'success') {
        return await update();
      }
    },
    [isFetching, id, callAlertOnError, update]
  );

  const reqDeleteDetail = useCallback(
    async (ApplyPaymentDetail: string) => {
      if (isFetching) {
        return;
      }

      setIsFetching(true);

      const res = await apiDeleteApplyPaymentDetail(ApplyPaymentDetail)
        .then(() => {
          return 'success';
        })
        .catch((err: AxiosError) => {
          callAlertOnError && myAlert.err({ title: '刪除支出單明細失敗', content: err.message });
        })
        .finally(() => {
          setIsFetching(false);
        });

      if (res === 'success') {
        return await update();
      }
    },
    [isFetching, callAlertOnError, update]
  );

  const clear = () => {
    setRes(undefined);
  };

  useEffect(() => {
    autoUpdate && update();
  }, [id]);

  return {
    res,
    setRes,
    clear,
    update,
    reqPatch,
    reqDeleteDetail,
    isFetching,
  };
};

const useGetApplyPaymentDetail = (
  apply_paymnet_id: string | undefined,
  {
    callAlertOnError = true,
    autoUpdate = true,
  }: {
    callAlertOnError?: boolean;
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [res, setRes] = useState<TpurchaseInvoice_Dto[]>();

  const update = useCallback(async () => {
    if (isFetching || !apply_paymnet_id) {
      return;
    }

    setIsFetching(true);

    return await apiGetApplyPaymentDetail(apply_paymnet_id)
      .then((data) => {
        setRes(data);

        return data;
      })
      .catch((err: AxiosError) => {
        setRes(undefined);
        callAlertOnError && myAlert.err({ title: '取得支出單明細失敗', content: err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [apply_paymnet_id]);

  useEffect(() => {
    autoUpdate && update();
  }, [update]);

  return {
    res,
    setRes,
    update,
    isFetching,
  };
};

// =================================================================================

export {
  TaccountantPresetDto,
  TcreateAccountantPresetDto,
  TupdateAccountantPresetDto,
  useGetBankAccount,
  apiPostBankAccount,
  apiPatchBankAccount,
  //
  TapplyPayment_Dto,
  TcreateApplyPayment_data_Dto,
  TupdateApplyPayment_data_Dto,
  TcreateApplyPayment_Dto,
  TupdateApplyPayment_Dto,
  TpurchaseInvoice_Dto,
  // TapplyPayment_Dto_detailed,
  apiPostAddApplyPayment,
  useGetApplyPayment,
  useGetApplyPaymentById,
  useGetApplyPaymentDetail,
};

export type { TapplyPayment_Dto_detailed };
