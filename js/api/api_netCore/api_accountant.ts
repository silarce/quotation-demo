import { useState, useEffect, useCallback } from 'react';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi2 } from '../_axiosCreator';
import { AxiosError } from 'axios';

import { TemployeeDto, apiGetEmployee_id } from '../api_employee';

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
  //
  TpurchaseCollectTicket_Dto,
  TcreatePurchaseCollectTicket_Dto,
  TupdatePurchaseCollectTicket_Dto,
  TpurchaseCollectTicketDetail_Dto,
  TcreatePurchaseCollectTicketDetail_Dto,
  TupdatePurchaseCollectTicketDetail_Dto,
  //
  Tpayment_order_Dto,
  Taccount_payable_Dto,
  TpaymentOrderDetail_Dto,
  TcreatePaymentOrderDetail_Dto,
  TcreatePaymentOrder_Dto,
  //
  Tprodreceipt_Dto,
} from './_schemas';

import { dtoSnakeToCamel } from '../apiUtils/dtoSnakeToCamel';

const subRoot = 'Accountant';

// =================================================================================

interface TapplyPayment_Dto_detailed extends TapplyPayment_Dto {
  detailArr: TpurchaseInvoice_Dto[];
  agent_employee: TemployeeDto;
}

interface TpurchaseCollectTicket_Dto_detailed extends TpurchaseCollectTicket_Dto {
  detailArr: TpurchaseCollectTicketDetail_Dto[];
  agent_employee: TemployeeDto;
}

interface Tpayment_order_Dto_detailed extends Tpayment_order_Dto {
  detailArr: TpaymentOrderDetail_Dto[];
  agent_employee: TemployeeDto | undefined;
}

// =================================================================================

// region bankAccount
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
        data = data.map((item) => {
          // return item;
          // return dtoSnakeToCamel(item);
          return {
            ...item,
            agent_employee: dtoSnakeToCamel(item.agent_employee),
          };
        });

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
        const [detailArr, employee_snake] = await Promise.all([
          await apiGetApplyPaymentDetail(id),
          await apiGetEmployee_id(applyPayment.agent_employee_id),
        ]);

        const applyPayment_detailed: TapplyPayment_Dto_detailed = {
          ...applyPayment,
          detailArr: detailArr,
          agent_employee: employee_snake,
        };

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

// region purchaseCollectTicket

// 取得所有進貨收票
const apiGetPurchaseCollectTicket = async () => {
  const api = `/${subRoot}/GetPurchaseCollectTicket`;
  const params = {
    id: 'all',
  };

  return axi2
    .get<TpurchaseCollectTicket_Dto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '取得進貨收票列表失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 取得單一 進貨收票單
const apiGetPurchaseCollectTicketById = async (id: string) => {
  const api = `/${subRoot}/GetPurchaseCollectTicketById`;
  const params = {
    id,
  };

  return axi2
    .get<TpurchaseCollectTicket_Dto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '取得進貨收票失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 新增進貨收票 (進貨單不可重複選)
const apiPostAddPurchaseCollectTicket = async (data: TcreatePurchaseCollectTicket_Dto) => {
  const api = `/${subRoot}/AddPurchaseCollectTicket`;

  return axi2
    .post<string>(api, data)
    .then(({ data: id }) => id)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '新增進貨收票失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 編輯進貨收票單
const apiPatchUpdatePurchaseCollectTicket = async (data: TupdatePurchaseCollectTicket_Dto) => {
  const api = `/${subRoot}/UpdatePurchaseCollectTicket`;

  return axi2.post(api, data).catch((err: AxiosError) => {
    myAlert.err({ title: '更新進貨收票失敗', content: err.message });

    return Promise.reject(err);
  });
};

// 已進貨收票id 取得所有進貨收票單明細
const apiGetPurchaseCollectTicketDetailByTicketId = async (id: string) => {
  const api = `/${subRoot}/GetPurchaseCollectTicketDetailByTicketId`;
  const params = {
    ticket_id: id,
  };

  return axi2
    .get<TpurchaseCollectTicketDetail_Dto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '取得進貨收票明細失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 以發票號碼取得未結案之進貨單 (未提供發票號碼則提供所有未結案之進貨單)
const apiGetUnpaidProdreceiptByInvoiceNumber = async (invoice_number: string | undefined) => {
  const api = `/${subRoot}/SearchUnpaidProdreceiptByInvoiceNumber`;
  const params = {
    invoice_number,
  };

  return axi2
    .get<Tprodreceipt_Dto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      return Promise.reject(err);
    });
};

const useGetPurchaseCollectTicket = ({
  callAlertOnError = true,
  autoUpdate = true,
}: {
  callAlertOnError?: boolean;
  autoUpdate?: boolean;
} = {}) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [res, setRes] = useState<TpurchaseCollectTicket_Dto[]>();

  const update = useCallback(async () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);

    return await apiGetPurchaseCollectTicket()
      .then((data) => {
        setRes(data);

        return data;
      })
      .catch((err: AxiosError) => {
        setRes(undefined);
        callAlertOnError && myAlert.err({ title: '取得進貨收票列表失敗', content: err.message });
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

const useGetPurchaseCollectTicketById = (
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
  const [res, setRes] = useState<TpurchaseCollectTicket_Dto_detailed>();

  const update = useCallback(() => {
    if (isFetching || !id) {
      return;
    }

    setIsFetching(true);

    return apiGetPurchaseCollectTicketById(id)
      .then((data) => {
        return data[0];
      })
      .then(async (purchaseCollectTicket) => {
        const [detailArr, employee_snake] = await Promise.all([
          await apiGetPurchaseCollectTicketDetailByTicketId(id),
          await apiGetEmployee_id(purchaseCollectTicket.agent_employee_id),
        ]);

        const purchaseCollectTicket_detailed: TpurchaseCollectTicket_Dto_detailed = {
          ...purchaseCollectTicket,
          detailArr: detailArr,
          agent_employee: employee_snake,
        };

        setRes(purchaseCollectTicket_detailed);

        return purchaseCollectTicket;
      })
      .catch((err: AxiosError) => {
        setRes(undefined);
        callAlertOnError && myAlert.err({ title: '取得進貨收票失敗', content: err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [id]);

  const reqPatch = useCallback(
    async (preBody: Omit<TupdatePurchaseCollectTicket_Dto, 'purchase_collect_ticket_uuid'>) => {
      if (isFetching || !id) {
        return;
      }

      setIsFetching(true);
      const body: TupdatePurchaseCollectTicket_Dto = { purchase_collect_ticket_uuid: id, ...preBody };

      const res = await apiPatchUpdatePurchaseCollectTicket(body)
        .then(() => {
          return 'success';
        })
        .catch((err: AxiosError) => {
          callAlertOnError && myAlert.err({ title: '更新進貨收票失敗', content: err.message });
        })
        .finally(() => {
          setIsFetching(false);
        });

      if (res === 'success') {
        return await update();
      }
    },
    [isFetching, id]
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
    isFetching,
  };
};

const useGetPurchaseCollectTicketDetailByTicketId = (
  ticket_id: string | undefined,
  {
    callAlertOnError = true,
    autoUpdate = true,
  }: {
    callAlertOnError?: boolean;
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [res, setRes] = useState<TpurchaseCollectTicketDetail_Dto[]>();

  const update = useCallback(async () => {
    if (isFetching || !ticket_id) {
      return;
    }

    setIsFetching(true);

    return await apiGetPurchaseCollectTicketDetailByTicketId(ticket_id)
      .then((data) => {
        setRes(data);

        return data;
      })
      .catch((err: AxiosError) => {
        setRes(undefined);
        callAlertOnError && myAlert.err({ title: '取得進貨收票明細失敗', content: err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [ticket_id]);

  useEffect(() => {
    autoUpdate && update();
  }, [ticket_id]);

  return {
    res,
    setRes,
    update,
    isFetching,
  };
};

const useGetUnpaidProdreceiptByInvoiceNumber = (
  invoice_number?: string,
  {
    callAlertOnError = true,
    autoUpdate = true,
  }: {
    callAlertOnError?: boolean;
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [res, setRes] = useState<Tprodreceipt_Dto[]>();

  const update = useCallback(async () => {
    if (isFetching) {
      myAlert.info({ title: '取得資料中' });

      return;
    }

    setIsFetching(true);

    return await apiGetUnpaidProdreceiptByInvoiceNumber(invoice_number)
      .then((data) => {
        setRes(data);

        return data;
      })
      .catch((err: AxiosError) => {
        setRes(undefined);
        callAlertOnError && myAlert.err({ title: '取得未結案進貨單失敗', content: err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [invoice_number]);

  useEffect(() => {
    autoUpdate && update();
  }, [invoice_number]);

  return {
    res,
    setRes,
    update,
    isFetching,
  };
};

// =================================================================================

// region paymentOrder

// 取得付款申請單
const apiGetPaymentOrder = async () => {
  const api = `/${subRoot}/GetPaymentOrder`;
  const params = {
    id: 'all',
  };

  return axi2
    .get<Tpayment_order_Dto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      return Promise.reject(err);
    });
};

// 取得單一付款申請單
const apiGetPaymentOrderById = async (id: string) => {
  const api = `/${subRoot}/GetPaymentOrderById`;
  const params = {
    id,
  };

  return axi2
    .get<Tpayment_order_Dto>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      return Promise.reject(err);
    });
};

// 新增付款申請
// POST /AddPaymentOrder
const apiPostAddPaymentOrder = async (body: TcreatePaymentOrder_Dto) => {
  const api = `/${subRoot}/AddPaymentOrder`;

  return axi2
    .post<string>(api, body)
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      return Promise.reject(err);
    });
};

// 刪除付款申請單
const apiDeletePaymentOrderById = async (id: string) => {
  const api = `/${subRoot}/DeletePaymentOrderById`;
  const body = {
    id,
  };

  return axi2.post(api, body).catch((err: AxiosError) => {
    return Promise.reject(err);
  });
};

// 取得付款申請明細
const apiGetPaymentOrderDetailByPaymentOrderId = async (payment_order_id: string) => {
  const api = `/${subRoot}/GetPaymentOrderDetailByPaymentOrderId`;
  const params = {
    payment_order_id,
  };

  return axi2
    .get<TpaymentOrderDetail_Dto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      return Promise.reject(err);
    });
};

const useGetPaymentOrder = ({
  callAlertOnError = true,
  autoUpdate = true,
}: {
  callAlertOnError?: boolean;
  autoUpdate?: boolean;
} = {}) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [res, setRes] = useState<Tpayment_order_Dto[]>();

  const update = useCallback(async () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);

    return await apiGetPaymentOrder()
      .then((data) => {
        setRes(data);

        return data;
      })
      .catch((err: AxiosError) => {
        setRes(undefined);
        callAlertOnError && myAlert.err({ title: '取得付款申請單列表失敗', content: err.message });
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

const useGetPaymentOrderById = (
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
  const [res, setRes] = useState<Tpayment_order_Dto_detailed>();

  const update = useCallback(() => {
    if (isFetching || !id) {
      return;
    }

    setIsFetching(true);

    return apiGetPaymentOrderById(id)
      .then((data) => {
        return data;
      })
      .then(async (paymentOrder) => {
        const [detailArr, employee_snake] = await Promise.all([
          await apiGetPaymentOrderDetailByPaymentOrderId(id),
          await apiGetEmployee_id(paymentOrder.agent_employee_id),
        ]);

        const paymentOrder_detailed: Tpayment_order_Dto_detailed = {
          ...paymentOrder,
          detailArr: detailArr,
          agent_employee: employee_snake,
        };

        setRes(paymentOrder_detailed);

        return paymentOrder;
      })
      .catch((err: AxiosError) => {
        setRes(undefined);
        callAlertOnError && myAlert.err({ title: '取得付款申請單失敗', content: err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [id]);

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
    isFetching,
  };
};

// =================================================================================

// 以廠商id(等同於客戶id)取得應付帳款
const apiGetAccountPayableBySupplierId = async (supplier_uuid: string) => {
  // api名稱與需要的id不吻合，怪怪的
  const api = `/${subRoot}/GetPaymentOrderDetailByPaymentOrderId`;
  const params = {
    supplier_uuid,
  };

  return axi2
    .get<Taccount_payable_Dto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      return Promise.reject(err);
    });
};

const useGetAccountPayableBySupplierId = (
  supplier_uuid: string | undefined,
  {
    callAlertOnError = true,
    autoUpdate = true,
  }: {
    callAlertOnError?: boolean;
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [res, setRes] = useState<Taccount_payable_Dto[]>();

  const update = useCallback(async () => {
    if (isFetching || !supplier_uuid) {
      return;
    }

    setIsFetching(true);

    return await apiGetAccountPayableBySupplierId(supplier_uuid)
      .then((data) => {
        setRes(data);

        return data;
      })
      .catch((err: AxiosError) => {
        setRes(undefined);
        callAlertOnError && myAlert.err({ title: '取得應付帳款失敗', content: err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [supplier_uuid]);

  useEffect(() => {
    autoUpdate && update();
  }, [supplier_uuid]);

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
  //
  TpurchaseCollectTicket_Dto,
  TcreatePurchaseCollectTicket_Dto,
  TupdatePurchaseCollectTicket_Dto,
  TpurchaseCollectTicketDetail_Dto,
  TcreatePurchaseCollectTicketDetail_Dto,
  TupdatePurchaseCollectTicketDetail_Dto,
  apiPostAddPurchaseCollectTicket,
  useGetPurchaseCollectTicket,
  useGetPurchaseCollectTicketById,
  useGetPurchaseCollectTicketDetailByTicketId,
  useGetUnpaidProdreceiptByInvoiceNumber,
  //
  Tprodreceipt_Dto,
  //
  Tpayment_order_Dto,
  Taccount_payable_Dto,
  TpaymentOrderDetail_Dto,
  TcreatePaymentOrderDetail_Dto,
  TcreatePaymentOrder_Dto,
  apiGetPaymentOrder,
  apiGetPaymentOrderById,
  apiPostAddPaymentOrder,
  apiDeletePaymentOrderById,
  useGetPaymentOrder,
  useGetPaymentOrderById,
  useGetAccountPayableBySupplierId,
};

export type { TapplyPayment_Dto_detailed, TpurchaseCollectTicket_Dto_detailed, Tpayment_order_Dto_detailed };
