import { useState, useEffect, useCallback } from 'react';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi2 } from '../_axiosCreator';
import { AxiosError } from 'axios';

import { TemployeeDto, apiGetEmployee_id } from '../api_employee';
import { apiGetCustomers_id, TcustomerDto } from '../api_customer';

import { XOR } from 'ts-essentials';

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
  Taccount_payable_statistics,
  Taccount_payable_statistics_detail,
  //
  Tprodreceipt_Dto,
  //
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
  beneficiary: TcustomerDto | undefined;
}

type TgetAccountPayableByProps = XOR<
  {
    supplier: {
      supplier_uuid: string;
    };
  },
  {
    dateForUnpaid: {
      date: string;
    };
  },
  {
    invoiceNumber: {
      invoice_number: string;
    };
  }
>;

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
        const [detailArr, employee_snake, beneficiary] = await Promise.all([
          await apiGetPaymentOrderDetailByPaymentOrderId(id),
          paymentOrder.agent_employee_id
            ? await apiGetEmployee_id(paymentOrder.agent_employee_id).catch((err: AxiosError) => {
                console.log(err.response?.data);

                return undefined;
              })
            : undefined,
          paymentOrder.beneficiary_uuid
            ? await apiGetCustomers_id(paymentOrder.beneficiary_uuid).catch((err: AxiosError) => {
                console.log(err.response?.data);

                return undefined;
              })
            : undefined,
        ]);

        const paymentOrder_detailed: Tpayment_order_Dto_detailed = {
          ...paymentOrder,
          detailArr: detailArr,
          agent_employee: employee_snake,
          beneficiary,
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
    autoUpdate && (!id ? setRes(undefined) : update());
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

// region GET
//
//
//
//
// region accountPayable

// 取得應付帳款
const apiGetAccountPayableBy = async (props: TgetAccountPayableByProps) => {
  const { supplier, dateForUnpaid, invoiceNumber } = props;

  const apiLookup: {
    [key in keyof Required<TgetAccountPayableByProps>]: {
      api: string;
      params: object;
    };
  } = {
    // 以廠商id(等同於客戶id)取得應付帳款
    supplier: {
      api: `/${subRoot}/GetAccountPayableBySupplierId`,
      params: {
        supplier_uuid: supplier?.supplier_uuid,
      },
    },
    // 以月份篩選當月以前應付帳款未付款的資料
    dateForUnpaid: {
      api: `/${subRoot}/GetMonthlyAccountPayable`,
      params: {
        date: dateForUnpaid?.date,
      },
    },
    // 以發票號碼取得應付帳款
    invoiceNumber: {
      api: `/${subRoot}/SearchAccountPayableByInvoiceNumber`,
      params: {
        invoice_number: invoiceNumber?.invoice_number,
      },
    },
  } as const;

  const key = Object.keys(props)[0] as keyof TgetAccountPayableByProps;

  const { api, params } = apiLookup[key];

  return axi2
    .get<Taccount_payable_Dto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      return Promise.reject(err);
    });
};

const useGetAccountPayableBy = (
  // 為免無限循環，autoUpdate預設為false
  // 要用autoUpdate的話，props要經過useMemo包裝，否則useEffect會一直無限循環
  props: TgetAccountPayableByProps | undefined,
  {
    callAlertOnError = true,
    autoUpdate = false,
  }: {
    callAlertOnError?: boolean;
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [raw, setRaw] = useState<Taccount_payable_Dto[]>();

  const update = async () => {
    if (isFetching) {
      return;
    }

    if (!props) {
      setRaw(undefined);

      return;
    }

    setIsFetching(true);

    return await apiGetAccountPayableBy(props)
      .then((data) => {
        setRaw(data);

        return data;
      })
      .catch((err: AxiosError) => {
        setRaw(undefined);
        callAlertOnError && myAlert.err({ title: '取得應付帳款失敗', content: err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    autoUpdate && update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return {
    raw,
    setRaw,
    update,
    isFetching,
  };
};

// 以廠商id(等同於客戶id)取得應付帳款
const apiGetAccountPayableBySupplierId = async (supplier_uuid: string) => {
  const api = `/${subRoot}/GetAccountPayableBySupplierId`;
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
  supplier_uuid: string | undefined | null,
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

// 以id或當月日期取得應付帳款統計表
const apiGetAccountPayableStatisticsByIdOrDate = async ({ id, date }: XOR<{ id: string }, { date: string }>) => {
  const api = `/${subRoot}/GetAccountPayableStatisticsByIdOrDate`;
  const params = {
    id,
    date,
  };

  return axi2
    .get<Taccount_payable_statistics>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      return Promise.reject(err);
    });
};

// 以id或當月日期取得應付帳款統計表
const useGetAccountPayableStatisticsByIdOrDate = (
  params: XOR<{ id: string }, { date: string }>,
  {
    callAlertOnError = true,
    autoUpdate = true,
  }: {
    callAlertOnError?: boolean;
    autoUpdate?: boolean;
  } = {}
) => {
  const { id, date } = params;
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [raw, setRaw] = useState<Taccount_payable_statistics>();

  const update = async () => {
    if (isFetching || (!params.id && !params.date)) {
      setRaw(undefined);

      return;
    }

    setIsFetching(true);

    return await apiGetAccountPayableStatisticsByIdOrDate(params)
      .then((data) => {
        setRaw(data);

        return data;
      })
      .catch((err: AxiosError) => {
        setRaw(undefined);
        callAlertOnError && myAlert.err({ title: '取得應付帳款統計表失敗', content: err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    autoUpdate && update();
  }, [id, date]);

  return {
    raw,
    setRaw,
    update,
    isFetching,
  };
};

// 以統計表id取得應付帳款統計表所有detail
const apiGetAccountPayableStatisticsDetailByStatisticsId = async (statistics_id: string) => {
  const api = `/${subRoot}/GetAccountPayableStatisticsDetailByStatisticsId`;
  const params = {
    statistics_id,
  };

  return axi2
    .get<Taccount_payable_statistics_detail[]>(api, { params })
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      return Promise.reject(err);
    });
};

// 以統計表id取得應付帳款統計表所有detail
const useGetAccountPayableStatisticsDetailByStatisticsId = (
  statistics_id: string | undefined,
  {
    callAlertOnError = true,
    autoUpdate = true,
  }: {
    callAlertOnError?: boolean;
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [raw, setRaw] = useState<Taccount_payable_statistics_detail[]>();

  const update = async () => {
    if (isFetching || !statistics_id) {
      setRaw(undefined);

      return;
    }

    setIsFetching(true);

    return await apiGetAccountPayableStatisticsDetailByStatisticsId(statistics_id)
      .then((data) => {
        setRaw(data);

        return data;
      })
      .catch((err: AxiosError) => {
        setRaw(undefined);
        callAlertOnError && myAlert.err({ title: '取得應付帳款統計表明細失敗', content: err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    autoUpdate && update();
  }, [statistics_id]);

  return {
    raw,
    setRaw,
    update,
    isFetching,
  };
};

// 產生當月應付帳款統計表(此api beta待更新，功能可用，account_payable_uuids現為account_payment_uuids)
const apiPostAddAccountPayableStatistics = async ({
  date,
  note,
  account_payable_uuids,
}: {
  date: string;
  note: string;
  account_payable_uuids: string[];
}) => {
  const api = `/${subRoot}/AddAccountPayableStatistics`;

  const body = {
    date,
    note,
    account_payable_uuids: account_payable_uuids.join(','),
  };

  return axi2
    .post<string>(api, body)
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '新增應付帳款統計表失敗', content: err.message });

      return err;
    });
};

// 以id更新應付帳款明細統計表
const apiPatchUpdateAccountPayableStatisticsById = async (body: {
  id: string;
  data: {
    detail_id: string;
    payment: string;
    note: `${number}`;
    bank_account_uuid: string;
    bank_account_name: string;
  }[];
}) => {
  const api = `/${subRoot}/UpdateAccountPayableStatisticsById`;

  return axi2
    .post<string>(api, body)
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '更新應付帳款統計表失敗', content: err.message });

      return err;
    });
};

// 以id刪除應付帳款明細統計表(已審核過的不能刪除api，beta待更新，功能可用但目前沒有限制)
const apiDeleteAccountPayableStatisticsById = async (id: string) => {
  const api = `/${subRoot}/DeleteAccountPayableStatisticsById`;
  const body = {
    id,
  };

  return axi2
    .post<string>(api, body)
    .then(({ data }) => data)
    .catch((err: AxiosError) => {
      myAlert.err({ title: '刪除應付帳款統計表失敗', content: err.message });

      return err;
    });
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
  apiGetAccountPayableBySupplierId,
  useGetPaymentOrder,
  useGetPaymentOrderById,
  //
  useGetAccountPayableBySupplierId,
  useGetAccountPayableBy,
  useGetAccountPayableStatisticsByIdOrDate,
  useGetAccountPayableStatisticsDetailByStatisticsId,
  apiPostAddAccountPayableStatistics,
  apiPatchUpdateAccountPayableStatisticsById,
  apiDeleteAccountPayableStatisticsById,
};

export type {
  TapplyPayment_Dto_detailed,
  TpurchaseCollectTicket_Dto_detailed,
  Tpayment_order_Dto_detailed,
  TgetAccountPayableByProps,
};
