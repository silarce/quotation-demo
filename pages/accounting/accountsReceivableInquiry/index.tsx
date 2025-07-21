import classNames from 'classnames';

import scss from './index.module.scss';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong, Input, DatePicker } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';

import Icon_note from 'public/image/icon/fong/note.svg';

export default function AccountsReceivableInquiry() {
  return (
    <div>
      <div className={'pageTop flex justify-between'}>
        <div className={classNames('flex gap-4', scss.form)}>
          <DataEntry_fong
            childrenWrapperProps={{
              className: scss.input,
            }}
          >
            <Input placeholder="輸入合約編號 / 客戶姓名 / 案場名稱" />
          </DataEntry_fong>
          <DataEntry_fong
            childrenWrapperProps={{
              className: scss.datePicker,
            }}
          >
            <DatePicker />
          </DataEntry_fong>
          <Btn theme="query">搜索資料</Btn>
        </div>
        <div>
          <Btn theme="add">新增資料</Btn>
        </div>
      </div>

      <Table_antd
        columns={columns}
        dataSource={fakeData}
        scroll={{
          y: '550px',
        }}
      />
    </div>
  );
}

// ========================================================================

interface Tdata {
  idNumber: string;
  createdAt: string;
  customerName: string;
  projectName: string;
  contractPrice: number;
  tax: number;
  totalPrice: number;
  amountOfPaymentRequested: number;
  deduction: number;
  status: string;
}

const columns: TableProps<Tdata>['columns'] = [
  {
    title: '合約編號',
    dataIndex: 'idNumber',
    width: 150,
  },
  {
    title: '建立日期',
    dataIndex: 'createdAt',
    width: 130,
  },
  {
    title: '客戶姓名',
    dataIndex: 'customerName',
    // width: 150,
  },
  {
    title: '案場名稱',
    dataIndex: 'projectName',
    // width: 150,
  },
  {
    title: '合約金額',
    dataIndex: 'contractPrice',
    width: 150,
  },
  {
    title: '稅金',
    dataIndex: 'tax',
    width: 150,
  },
  {
    title: '總金額',
    dataIndex: 'totalPrice',
    width: 150,
  },
  {
    title: '應收款項金額',
    dataIndex: 'amountOfPaymentRequested',
    width: 150,
  },
  {
    title: '扣款金額',
    dataIndex: 'deduction',
    width: 150,
  },
  {
    title: '狀態',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    render() {
      return (
        <div className="flex justify-center">
          <Icon_note className="text-blue01" />
        </div>
      );
    },
  },
];

const fakeData: Tdata[] = Array.from({ length: 100 }, (_, index) => {
  const data: Tdata = {
    idNumber: `ID-${index + 1}`,
    createdAt: `2023/10/${(index % 30) + 1}`,
    customerName: `客戶${index + 1}`,
    projectName: `案場${index + 1}`,
    contractPrice: 999999999999,
    tax: 99999,
    totalPrice: 99999,
    amountOfPaymentRequested: 99999,
    deduction: 99999,
    status: index % 2 === 0 ? '待處理' : '已完成',
  };

  return data;
});
