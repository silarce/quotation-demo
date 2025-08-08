import { useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';

import Btn from 'components/global/gear/button/btn_fong';
import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong, Input, Select, DatePicker } from 'components/global/gear/dataEntry';

import Selector_accountant, {
  TaccountantDto,
} from 'components/page/accounting/accountsReceivableInquiry/selector_accountant/indext';
import { modal_empty } from 'components/global/gear/modal/fongModal';
import { Container_confirm } from 'components/global/container/modal';

import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';
import Icon_next from 'public/image/icon/fong/next.svg';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';
import { useApiGetDropDown } from 'js/api/api_netCore/api_commonControllers';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
// ======================================================================

type TpaymentRequest = Tres_apiGetARPaymentData['paymentRequest'];
type TprOffsetDetails = TpaymentRequest['prOffsetDetails'][number];

interface Tstate_addData {
  date: Dayjs | null;
  amount: `${number}` | '';
  type: string;
  fee: `${number}` | '';
  remarks: string;
}

interface Tstate_addDeduction {
  date: Dayjs | null;
  amount: `${number}` | '';
  type: string;
  remarks: string;
}

interface Tprops {
  prOffsetDetails: TprOffsetDetails[] | undefined | null;
  onAddDataConfirm: (data: { state: Tstate_addData; accountant: TaccountantDto; destroy: () => void }) => void;
  onAddDeductionConfirm: (data: {
    state: Tstate_addDeduction;
    accountant: TaccountantDto;
    destroy: () => void;
  }) => void;
}

// ======================================================================

// MARK: START

const PrOffsetDetails = ({ prOffsetDetails, onAddDataConfirm, onAddDeductionConfirm }: Tprops) => {
  const { options: options_incomeType } = useApiGetDropDown('IncomeType');
  const { options: options_deductionType } = useApiGetDropDown('deduction_type');

  const handle_accountingCollection = (onConfirm: (accountant: TaccountantDto) => void) => {
    const { destroy } = modal_empty({
      content: (
        <Selector_accountant
          onCancel={() => {
            destroy();
          }}
          btn_confirm={(v) => {
            return (
              <Btn
                icon={Icon_next}
                props_icon={{
                  className: 'text-blue01',
                }}
                onClick={() => {
                  if (!v) {
                    myAlert.info({
                      title: '請選擇會計收款',
                    });

                    return;
                  }

                  onConfirm(v);
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

  const handle_addData = (accountant: TaccountantDto) => {
    const { destroy } = modal_empty({
      content: (
        <AddData
          accountant={accountant}
          options_incomeType={options_incomeType}
          onConfirm={(state_addData) => {
            onAddDataConfirm({
              state: state_addData,
              accountant,
              destroy,
            });
          }}
          onCancel={() => {
            destroy();
          }}
        />
      ),
      width: 350,
    });
  };

  const handle_addDeduction = (accountant: TaccountantDto) => {
    const { destroy } = modal_empty({
      content: (
        <AddDeduction
          accountant={accountant}
          options_deductionType={options_deductionType}
          onConfirm={(state_addDeduction) => {
            onAddDeductionConfirm({
              state: state_addDeduction,
              accountant,
              destroy,
            });
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

  // MARK: RENDER

  return (
    <div>
      <div className="mt-6">
        <div className="flex gap-3 items-center">
          <div className="text-xl font-semibold">沖銷明細</div>
          <Btn
            theme="cross"
            onClick={() => {
              handle_accountingCollection(handle_addData);
            }}
          >
            會計收款
          </Btn>
          <Btn
            theme="cross"
            onClick={() => {
              handle_accountingCollection(handle_addDeduction);
            }}
          >
            新增沖銷扣款
          </Btn>
          <Btn theme="cross" onClick={handle_addFee}>
            新增扣款
          </Btn>
        </div>
        <div></div>
      </div>
      <Table_antd
        className="mt-4"
        dataSource={prOffsetDetails ?? undefined}
        columns={columns_reversalDetails}
        scroll={{
          y: 400,
        }}
      />
    </div>
  );
};

// MARK: END

// ===============================================================================
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
    width: 140,
  },
  {
    title: '名稱',
    dataIndex: 'prOffsetType',
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

// MARK:AddData

const AddData = ({
  onConfirm,
  onCancel,
  options_incomeType,
  accountant,
}: {
  onConfirm?: (props: Tstate_addData) => void;
  onCancel?: () => void;
  options_incomeType: { label: string; value: string }[];
  accountant: TaccountantDto;
}) => {
  const [state, setState] = useState<Tstate_addData>({
    date: accountant.insertDate ? dayjs(accountant.insertDate) : null,
    type: '收款',
    amount: `${accountant.price}`,
    fee: '',
    remarks: '',
  });

  const handle_confirm = () => {
    onConfirm?.(state);
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
          <DatePicker value={state.date} onChange={(value) => setState({ ...state, date: value })} />
        </DataEntry_fong>

        <DataEntry_fong caption="收入類別" isMust={true}>
          <Select
            allowClear={false}
            options={options_incomeType}
            value={state.type}
            onChange={(value) => setState({ ...state, type: value })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="金額" isMust={true}>
          <Input
            type="number"
            value={state.amount}
            onChange={(e) => setState({ ...state, amount: e.target.value as `${number}` | '' })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="手續費">
          <Input
            type="number"
            value={state.fee}
            onChange={(e) => setState({ ...state, fee: e.target.value as `${number}` | '' })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="備註" isMust={true}>
          <Input value={state.remarks ?? ''} onChange={(e) => setState({ ...state, remarks: e.target.value })} />
        </DataEntry_fong>
      </div>
    </Container_confirm>
  );
};

// MARK: AddFee

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

// MARK: AddDeduction

const AddDeduction = ({
  onConfirm,
  onCancel,
  options_deductionType,
  accountant,
}: {
  onConfirm?: (props: Tstate_addDeduction) => void;
  onCancel?: () => void;
  options_deductionType: { label: string; value: string }[];
  accountant: TaccountantDto;
}) => {
  const [state, setState] = useState<Tstate_addDeduction>({
    date: accountant.insertDate ? dayjs(accountant.insertDate) : null,
    type: '',
    amount: `${accountant.price}`,
    remarks: '',
  });

  const handle_confirm = () => {
    onConfirm?.(state);
  };

  const handle_cancel = () => {
    onCancel?.();
  };

  return (
    <Container_confirm
      title="新增扣款資料"
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
          <DatePicker value={state.date} onChange={(value) => setState({ ...state, date: value })} />
        </DataEntry_fong>

        <DataEntry_fong caption="扣款類別" isMust={true}>
          <Select
            allowClear={false}
            options={options_deductionType}
            value={state.type}
            onChange={(value) => setState({ ...state, type: value })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="金額" isMust={true}>
          <Input
            type="number"
            value={state.amount}
            onChange={(e) => setState({ ...state, amount: e.target.value as `${number}` | '' })}
          />
        </DataEntry_fong>

        <DataEntry_fong caption="備註" isMust={true}>
          <Input value={state.remarks ?? ''} onChange={(e) => setState({ ...state, remarks: e.target.value })} />
        </DataEntry_fong>
      </div>
    </Container_confirm>
  );
};

// ===============================================================================
export default PrOffsetDetails;
export type { Tprops as Tprops_prOffsetDetails };
