import { useState, useEffect, useMemo } from 'react';

import { Dayjs } from 'dayjs';
import classNames from 'classnames';

import Btn, { Btn_UpDown } from 'components/global/gear/button/btn_fong';
import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong, Input, Select, DatePicker, Input_money } from 'components/global/gear/dataEntry';

import Selector_accountant from 'components/page/accounting/accountsReceivableInquiry/selector_accountant/indext';
import { modal_empty } from 'components/global/gear/modal/fongModal';
import { Container_confirm } from 'components/global/container/modal';
import Selector_customer, { selector_customer } from 'components/composition/selectorModal/selector_customer';
import Selector_invoiceBook from 'components/composition/selectorModal/selector_invoiceBook';
import Selector_invoice from 'components/composition/selectorModal/selector_invoice';

import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';
import Icon_next from 'public/image/icon/fong/next.svg';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// =========================================================================

type TpaymentRequest = Tres_apiGetARPaymentData['paymentRequest'];
type TpaymentRequest_noDetail = Omit<TpaymentRequest, 'prOffsetDetails'>;

type TprOffsetDetails = TpaymentRequest['prOffsetDetails'][number];

interface Tstate {
  type: string;
  累計請款金額: `${number}` | '';
  營業稅: `${number}` | '';
  本期合計: `${number}` | '';
  保留款: `${number}` | '';
  稅別: string;
  保留款金額: `${number}` | '';

  發票本: {
    id: string;
    alphabeticLetter: string;
    period: number;
  } | null;

  發票日期: Dayjs | null;
  invoiceNumber: string | null;
  invoiceAmount: `${number}` | '';

  customerName: string | null;
  customerNumber: string | null;
  統一編號: string | null;
}

// =========================================================================

// MARK:START

const CurrentPaymentRequestDetails = ({
  className,
  paymentRequest,
}: {
  className?: string;
  paymentRequest: TpaymentRequest | undefined | null;
}) => {
  const {
    prOffsetDetails,

    // createdAt, //建立時間
    // createdBy, //建立人員
    // updatedAt, //更新時間
    // updatedBy, // 更新人員

    // sourceFormId, //來源表單Id
    // sourceFormType, //來源表單類型
    // paymentRequestNumber, //請款單編號

    // customerNumber, //客戶編號
    // customerName, //客戶名稱

    // invoiceNumber, //發票號碼
    // invoiceAmount, //發票金額

    // accountsReceivableId, //應收帳款Id
    // type, //請款單類型
    // period, //請款單期別
    // paymentCurrency, //請款幣別
    // foreignCurrencyAmount, //外幣金額
    // paymentAmount, //請款金額
    // collect_amount, //已收金額,餘額在repo裡計算
    // receipt_balance, //收款餘額
    // deduction, //扣款金額
  } = paymentRequest ?? {};

  const [isActive_detail, setState_isActive_deta] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);

  // -----------------------------------------------------------------------------

  const { state_paymentRequest, setState_paymentRequest, reset_paymentRequest } = usePaymentRequest(paymentRequest);

  // -----------------------------------------------------------------------------

  const handle_selectInvoiceBook = () => {
    const { destroy } = modal_empty({
      content: (
        <Selector_invoiceBook
          onConfirm={async (invoiceBook) => {
            if (invoiceBook) {
              const { id, alphabeticLetter, period } = invoiceBook;
              setState_paymentRequest((prev) => ({
                ...prev,
                發票本: {
                  id,
                  alphabeticLetter,
                  period,
                },
              }));

              destroy();
            }
          }}
          onCancel={() => {
            destroy();
          }}
        />
      ),
    });
  };

  const handle_selectInvoice = () => {
    const invoiceBookId = state_paymentRequest.發票本?.id;

    if (!invoiceBookId) {
      return;
    }

    const { destroy } = modal_empty({
      content: (
        <Selector_invoice
          invoiceBookId={invoiceBookId}
          onCancel={() => {
            destroy();
          }}
          onConfirm={(invoice) => {
            if (invoice) {
              setState_paymentRequest((prev) => ({
                ...prev,
                // 發票日期: invoice.invoiceDate ? Dayjs(invoice.invoiceDate) : null,
                invoiceNumber: invoice.fullInvoiceNumber,
                // invoiceAmount: invoice.invoiceAmount,
              }));
            }

            destroy();
          }}
        />
      ),
    });
  };

  const handle_selectCustomer = () => {
    const { destroy } = selector_customer({
      onConfirm(customerArr) {
        const func = () => {
          const customer = customerArr[0];

          if (!customer) {
            return;
          }

          setState_paymentRequest((prev) => ({
            ...prev,
            customerName: customer.name,
            customerNumber: customer.customerNumber,
            統一編號: customer.taxId,
          }));
        };

        func();
        destroy();
      },
    });
  };

  const handle_accountingCollection = () => {
    const { destroy } = modal_empty({
      content: (
        <Selector_accountant
          onCancel={() => {
            destroy();
          }}
          btn_confirm={() => {
            return (
              <Btn
                icon={Icon_next}
                props_icon={{
                  className: 'text-blue01',
                }}
                onClick={() => {
                  handle_addData();
                  destroy();
                }}
              >
                下一步
              </Btn>
            );
          }}
        />
      ),
    });
  };

  const handle_addData = () => {
    const { destroy } = modal_empty({
      content: (
        <AddData
          onConfirm={(data) => {
            destroy();
          }}
          onCancel={() => {
            destroy();
          }}
        />
      ),
      width: 350,
    });
  };

  const handle_addFee = () => {
    const { destroy } = modal_empty({
      content: (
        <AddFee
          onConfirm={(fee) => {
            destroy();
          }}
          onCancel={() => {
            destroy();
          }}
        />
      ),
      width: 350,
    });
  };

  // MARK:RENDER
  return (
    <div className={className}>
      <div className="flex gap-3 items-center mb-10">
        <div className="text-xl font-semibold ">本次請款明細</div>
        <Btn_UpDown isActive={isActive_detail} onClick={() => setState_isActive_deta((prev) => !prev)}>
          展開
        </Btn_UpDown>
      </div>

      {isActive_detail && (
        <div className="p-6 border border-gray05 rounded-lg shadow-[0px_4px_4px_0px_#00000040]">
          <div className={classNames('grid grid-cols-4 gap-fong ')}>
            <DataEntry_fong caption="類型" isMust={true} disabled={disabled}>
              <Select value={state_paymentRequest.type} />
            </DataEntry_fong>
            <DataEntry_fong caption="累計請款金額 no property" isMust={true} disabled={disabled}>
              <Input_money
                value={state_paymentRequest.累計請款金額}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    累計請款金額: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>
            <DataEntry_fong caption="營業稅(5%) no property" isMust={true} disabled={disabled}>
              <Input_money
                value={state_paymentRequest.營業稅}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    營業稅: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>
            <DataEntry_fong caption="本期合計 no property" isMust={true} disabled={disabled}>
              <Input_money
                value={state_paymentRequest.本期合計}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    本期合計: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>
            <DataEntry_fong caption="保留款(%) no property" isMust={true} disabled={disabled}>
              <Input
                type="number"
                value={state_paymentRequest.保留款}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    保留款: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>
            <DataEntry_fong caption="稅別 no property" isMust={true} disabled={disabled}>
              <Select
                value={state_paymentRequest.稅別}
                onChange={(value) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    稅別: value,
                  }));
                }}
              />
            </DataEntry_fong>
            <DataEntry_fong caption="保留款金額 no property" isMust={true} disabled={disabled}>
              <Input_money
                value={state_paymentRequest.保留款金額}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    保留款金額: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>

            <div />

            <DataEntry_fong
              caption="發票本"
              isMust={true}
              disabled={disabled}
              childrenWrapperProps={{
                className: disabled ? '' : 'cursor-pointer',
                onClick: disabled ? undefined : handle_selectInvoiceBook,
              }}
            >
              {state_paymentRequest.發票本
                ? state_paymentRequest.發票本?.alphabeticLetter + ' ' + `${state_paymentRequest.發票本?.period}期`
                : '- -'}
            </DataEntry_fong>

            <DataEntry_fong caption="發票日期 no property" isMust={true} disabled={disabled}>
              <DatePicker
                value={state_paymentRequest.發票日期}
                onChange={(date) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    發票日期: date,
                  }));
                }}
              />
            </DataEntry_fong>

            <DataEntry_fong
              caption="發票號碼"
              isMust={true}
              disabled={disabled}
              childrenWrapperProps={{
                onClick: disabled ? undefined : handle_selectInvoice,
                className: disabled ? '' : 'cursor-pointer',
              }}
            >
              {state_paymentRequest.invoiceNumber}
            </DataEntry_fong>
            <DataEntry_fong caption="發票金額" isMust={true} disabled={disabled}>
              <Input_money
                value={state_paymentRequest.invoiceAmount}
                onChange={(e) => {
                  setState_paymentRequest((prev) => ({
                    ...prev,
                    invoiceAmount: e.target.value as `${number}` | '',
                  }));
                }}
              />
            </DataEntry_fong>

            <DataEntry_fong
              caption="買受人"
              isMust={true}
              disabled={disabled}
              childrenWrapperProps={{
                // onClick: handle_selectCustomer,
                onClick: disabled ? undefined : handle_selectCustomer,
                className: disabled ? '' : 'cursor-pointer',
              }}
            >
              {state_paymentRequest.customerName}
            </DataEntry_fong>

            <DataEntry_fong caption="統一編號 no property" isMust={true} disabled={disabled}>
              {state_paymentRequest.統一編號}
            </DataEntry_fong>
          </div>
          <div className="w-fit m-auto mt-10 mr-0 ml-auto">
            <Btn theme="save">儲存</Btn>
          </div>

          <div>
            <div className="mt-6">
              <div className="flex gap-3 items-center">
                <div className="text-xl font-semibold">沖銷明細</div>
                <Btn theme="cross" onClick={handle_accountingCollection}>
                  會計收款
                </Btn>
                <Btn theme="cross" onClick={handle_addFee}>
                  新增扣款
                </Btn>
              </div>
              <div></div>
            </div>
            <Table_antd
              className="mt-4"
              dataSource={prOffsetDetails}
              columns={columns_reversalDetails}
              scroll={{
                y: 400,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// MARK:END

// ===============================================================================
// ===============================================================================
// ===============================================================================

// MARK: useData

const usePaymentRequest = (rawData: TpaymentRequest_noDetail | undefined | null) => {
  const defaultState = useDefaultState(rawData);
  const [state, setState] = useState<Tstate>(defaultState);

  const reset = () => {
    setState(emptyState());
  };

  // -----------------------------------------------------------------------
  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  return {
    state_paymentRequest: state,
    setState_paymentRequest: setState,
    reset_paymentRequest: reset,
  };
};

const emptyState = (): Tstate => {
  const state: Tstate = {
    type: '',
    累計請款金額: '',
    營業稅: '',
    本期合計: '',
    保留款: '',
    稅別: '',
    保留款金額: '',

    發票本: null,
    發票日期: null,
    invoiceNumber: null,
    invoiceAmount: '',

    customerName: null,
    customerNumber: null,
    統一編號: null,
  };

  return state;
};

const useDefaultState = (rawData: TpaymentRequest_noDetail | undefined | null): Tstate => {
  return useMemo(() => {
    if (!rawData) {
      return emptyState();
    }

    const defaultState: Tstate = {
      type: rawData.type || '',
      累計請款金額: '',
      營業稅: '',
      本期合計: '',
      保留款: '',
      稅別: '',
      保留款金額: '',

      發票本: null,
      發票日期: null,
      invoiceNumber: rawData.invoiceNumber,
      invoiceAmount: rawData.invoiceAmount === null ? '' : `${rawData.invoiceAmount}`,

      customerName: rawData.customerName,
      customerNumber: rawData.customerNumber,
      統一編號: null,
    };

    return defaultState;
  }, [rawData]);
};

// ===============================================================================

// MARK:columns_reversalDetails
const columns_reversalDetails: TableProps<TprOffsetDetails>['columns'] = [
  {
    title: '序號',
    dataIndex: 'settlementSerial',
    align: 'center',
    width: 80,
  },
  {
    title: '代號',
    dataIndex: 'prOffsetNumber',
    width: 120,
  },
  {
    title: '名稱',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '會科',
    dataIndex: 'account',
    width: 150,
  },
  {
    title: '金額',
    dataIndex: 'totalAmount',
    width: 150,
    align: 'right',
    render: (value) => '$' + value.toLocaleString(),
  },
  {},
  {
    title: '操作',
    key: 'action',
    width: 80,
    align: 'center',
    render: () => (
      <div className="flex gap-[16px] justify-center">
        <Icon_note className="w-[16px] h-[16px] text-blue01" />
        <Icon_trash className="w-[16px] h-[16px] text-red01" />
      </div>
    ),
  },
];

// ===============================================================================

const AddData = ({
  onConfirm,
  onCancel,
}: {
  onConfirm?: (props: { date: Dayjs | null; amount: string; incomeCategory: string; remarks: string }) => void;
  onCancel?: () => void;
}) => {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [incomeCategory, setIncomeCategory] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  const handle_confirm = () => {
    onConfirm?.({
      date,
      amount,
      incomeCategory,
      remarks,
    });
  };

  const handle_cancel = () => {
    onCancel?.();
  };

  return (
    <Container_confirm
      title="新增資料"
      footerRight={
        <>
          <Btn onClick={handle_cancel}>取消</Btn>
          <Btn theme="save" onClick={handle_confirm}>
            儲存
          </Btn>
        </>
      }
    >
      <div className="grid gap-fong">
        <DataEntry_fong caption="日期" isMust={true}>
          <DatePicker value={date} onChange={(value) => setDate(value)} />
        </DataEntry_fong>
        <DataEntry_fong caption="金額" isMust={true}>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </DataEntry_fong>
        <DataEntry_fong caption="收入類別" isMust={true}>
          <Select
            options={[
              { label: '類別一', value: 'category1' },
              { label: '類別二', value: 'category2' },
              { label: '類別三', value: 'category3' },
            ]}
            value={incomeCategory}
            onChange={(value) => setIncomeCategory(value)}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="備註" isMust={true}>
          <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </DataEntry_fong>
      </div>
    </Container_confirm>
  );
};

const AddFee = ({ onCancel, onConfirm }: { onCancel?: () => void; onConfirm?: (fee: string) => void }) => {
  const [value, setValue] = useState<string>('');

  const handle_confirm = () => {
    onConfirm?.(value);
  };

  const handle_cancel = () => {
    onCancel?.();
  };

  return (
    <Container_confirm
      title="手續費"
      footerRight={
        <>
          <Btn onClick={handle_cancel}>取消</Btn>
          <Btn theme="save" onClick={handle_confirm}>
            儲存
          </Btn>
        </>
      }
    >
      <DataEntry_fong caption="手續費" isMust={true}>
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
      </DataEntry_fong>
    </Container_confirm>
  );
};

// ==========================================================================

export default CurrentPaymentRequestDetails;
