import { useState } from 'react';
import { Dayjs } from 'dayjs';
import classNames from 'classnames';

import Btn, { Btn_UpDown } from 'components/global/gear/button/btn_fong';
import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong, Input, Select, DatePicker } from 'components/global/gear/dataEntry';

import Selector_accountant from 'components/page/accounting/accountsReceivableInquiry/selector_accountant/indext';
import { modal_empty } from 'components/global/gear/modal/fongModal';
import { Container_confirm } from 'components/global/container/modal';

import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';
import Icon_next from 'public/image/icon/fong/next.svg';

// MARK:START

const CurrentPaymentRequestDetails = ({
  className,
}: {
  className?: string;
} = {}) => {
  const [isActive_detail, setState_isActive_deta] = useState<boolean>(true);

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
            <DataEntry_fong caption="類型" isMust={true} disabled={true}>
              <Select />
            </DataEntry_fong>
            <DataEntry_fong caption="累計請款金額" isMust={true} disabled={true}>
              <Input />
            </DataEntry_fong>
            <DataEntry_fong caption="營業稅(5%)" isMust={true} disabled={true}>
              <Input />
            </DataEntry_fong>
            <DataEntry_fong caption="本期合計" isMust={true} disabled={true}>
              <Input />
            </DataEntry_fong>
            <DataEntry_fong caption="保留款(%)" isMust={true} disabled={true}>
              <Input />
            </DataEntry_fong>
            <DataEntry_fong caption="稅" isMust={true} disabled={true}>
              <Input />
            </DataEntry_fong>
            <DataEntry_fong caption="保留款金額" isMust={true} disabled={true}>
              <Input />
            </DataEntry_fong>
            <DataEntry_fong caption="金額總計" isMust={true} disabled={true}>
              <Input />
            </DataEntry_fong>
            <DataEntry_fong caption="買受人" isMust={true} disabled={true}>
              <Input />
            </DataEntry_fong>
            <div />
            <div />
            <div />
            <DataEntry_fong caption="發票日期" isMust={true} disabled={true}>
              <DatePicker />
            </DataEntry_fong>
            <DataEntry_fong caption="發票號碼" isMust={true} disabled={true}>
              <Input />
            </DataEntry_fong>
            <DataEntry_fong caption="發票金額" isMust={true} disabled={true}>
              <Input />
            </DataEntry_fong>
            <DataEntry_fong caption="統一編號" isMust={true} disabled={true}>
              <Input />
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
                  新增手續費
                </Btn>
              </div>
              <div></div>
            </div>
            <Table_antd
              className="mt-4"
              dataSource={fakeData_reversalDetails}
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

interface TfakeData_reversalDetails {
  id: string;
  serialNumber: string;
  idNumber: string;
  name: string;
  accountingSubjects: string;
  price: number;
}

const createFakeData_reversalDetails = (count: number): TfakeData_reversalDetails[] => {
  const data: TfakeData_reversalDetails[] = [];

  for (let i = 1; i <= count; i++) {
    data.push({
      id: `${i}`,
      serialNumber: `${i}`,
      idNumber: `ID${String(1000 + i).padStart(4, '0')}`,
      name: `項目名稱 ${i}`,
      accountingSubjects: `會計科目 ${String.fromCharCode(65 + ((i - 1) % 26))}`,
      price: Math.floor(Math.random() * 100000) + 5000,
    });
  }

  return data;
};

const fakeData_reversalDetails: TfakeData_reversalDetails[] = createFakeData_reversalDetails(10);

const columns_reversalDetails: TableProps<TfakeData_reversalDetails>['columns'] = [
  {
    title: '序號',
    dataIndex: 'serialNumber',
    align: 'center',
    width: 80,
  },
  {
    title: '代號',
    dataIndex: 'idNumber',
    width: 120,
  },
  {
    title: '名稱',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '會科',
    dataIndex: 'accountingSubjects',
    width: 150,
  },
  {
    title: '金額',
    dataIndex: 'price',
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

export default CurrentPaymentRequestDetails;
