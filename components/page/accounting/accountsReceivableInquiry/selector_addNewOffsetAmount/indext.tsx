import { useState } from 'react';
import classNames from 'classnames';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';

import { Container_confirm } from 'components/global/container/modal';

import { Checkbox } from 'components/global/gear/dataEntry';

export default function Selector_addNewOffsetAmount({
  onConfirm,
  onCancel,
  btn_confirm,
}: {
  onConfirm?: (data: TfakeData | undefined) => void;
  onCancel?: () => void;
  btn_confirm?: (data: TfakeData | undefined) => React.ReactNode;
}) {
  const [data, setData] = useState<TfakeData>();

  const handle_confirm = () => {
    if (onConfirm) {
      onConfirm(data);
    }
  };

  return (
    <Container_confirm
      title="新增沖帳金額"
      footerRight={
        <>
          <Btn onClick={onCancel}>取消</Btn>

          {btn_confirm && btn_confirm(data)}
          {!btn_confirm && (
            <Btn theme="save" onClick={handle_confirm}>
              儲存
            </Btn>
          )}
        </>
      }
    >
      <div className="mt-5">
        <Table_antd
          columns={columns}
          dataSource={fakeData}
          rowHoverable={false}
          scroll={{
            // x: '1330px',
            y: 400,
          }}
          rowClassName={(record) => {
            return classNames('cursor-pointer', record === data && 'bg-blue05');
          }}
          onRow={(record) => ({
            onClick: () => {
              setData(record);
            },
          })}
        />
      </div>
    </Container_confirm>
  );
}

// ============================================================================

const columns: TableProps<TfakeData>['columns'] = [
  {
    title: <span className="whitespace-pre-wrap">{'已匯入紙本\n應收帳款'}</span>,
    dataIndex: 'importDate',
    align: 'center',
    width: 120,
    render: (value) => (
      <div className="flex items-center justify-center">
        <Checkbox checked={value} disabled={true} />
      </div>
    ),
  },
  {
    title: '匯入日期',
    dataIndex: 'importDate',
    width: 120,
  },
  {
    title: '付款帳號',
    dataIndex: 'paymentAccount',
    width: 150,
  },
  {
    title: '存入帳號',
    dataIndex: 'account',
    width: 150,
  },
  {
    title: '廠商名稱',
    dataIndex: 'vendorName',
    width: 180,
  },
  {
    title: '幣別',
    dataIndex: 'currency',
    align: 'center',
    width: 82,
  },
  {
    title: '匯率',
    dataIndex: 'exchangeRate',
    align: 'center',
    width: 80,
  },
  {
    title: '金額',
    dataIndex: 'amount',
    align: 'right',
    width: 120,
    render: (value) => '$' + value.toLocaleString(),
  },
  {
    title: '新台幣',
    dataIndex: 'amountTWD',
    align: 'right',
    width: 120,
    render: (value) => '$' + value.toLocaleString(),
  },
];

// ============================================================================

interface TfakeData {
  id: string;
  chcked: boolean;
  // 匯入日期
  importDate: string;
  // 付款帳號
  paymentAccount: string;
  // 存入帳號
  account: string;
  // 廠商名稱
  vendorName: string;
  // 幣別
  currency: string;
  // 匯率
  exchangeRate: string;
  // 金額
  amount: string;
  // 新台幣
  amountTWD: string;
}

// 10筆假資料
const fakeData: TfakeData[] = Array.from({ length: 100 }, (_, i) => ({
  id: `${i + 1}`,
  chcked: false,
  importDate: '100/10/01',
  paymentAccount: `帳號 ${i + 1}`,
  account: '銀行帳戶',
  vendorName: `廠商 ${i + 1}`,
  currency: 'TWD',
  exchangeRate: '1',
  amount: `${(i + 1) * 1000}`,
  amountTWD: `${(i + 1) * 1000}`,
}));
