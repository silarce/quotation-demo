import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import Link from 'next/link';
import Router, { useRouter } from 'next/router';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong, Input, DatePicker, Select } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';
import Tab from 'components/global/gear/button/tab';
import { modal_empty } from 'components/global/gear/modal/fongModal';

import Selector_addNewOffsetAmount from 'components/page/accounting/accountsReceivableInquiry/selector_addNewOffsetAmount/indext';
import { Container_confirm } from 'components/global/container/modal';

import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';
import { ConsoleSqlOutlined } from '@ant-design/icons';

export default function AccountsReceivable() {
  const handle_addNewOffsetAmount = () => {
    modal_empty({
      content: <Selector_addNewOffsetAmount />,
      width: 1200,
    });
  };

  const handle_addData = () => {
    modal_empty({
      content: <AddData />,
      width: 500,
      customWidth: 350,
    });
  };

  const handle_addDeduction = () => {
    modal_empty({
      content: <AddDeduction />,
      width: 500,
      customWidth: 350,
    });
  };

  return (
    <div>
      <div className="pageTop">
        <div className="w-fit flex gap-3 ml-auto mr-0">
          <Btn onClick={Router.back}>返回</Btn>
          <Btn theme="add" onClick={handle_addData}>
            新增資料
          </Btn>
          <Btn theme="save">儲存</Btn>
        </div>
      </div>

      <div className="border border-gray05 rounded-01 py-8 px-6">
        <div className="text-xl font-semibold mb-6">應收請款</div>

        <div className="grid grid-cols-4 gap-fong ">
          <DataEntry_fong caption="請款單號" isMust={true}>
            <Input />
          </DataEntry_fong>
          <DataEntry_fong caption="請款類型" isMust={true}>
            <Input />
          </DataEntry_fong>
          <DataEntry_fong caption="期別" isMust={true}>
            <Input />
          </DataEntry_fong>
          <DataEntry_fong caption="請款金額" isMust={true}>
            <Input />
          </DataEntry_fong>
          <DataEntry_fong caption="發票本" isMust={true}>
            <Input />
          </DataEntry_fong>
          <DataEntry_fong caption="發票日期" isMust={true}>
            <Input />
          </DataEntry_fong>
          <DataEntry_fong caption="發票號碼" isMust={true}>
            <Input />
          </DataEntry_fong>
          <DataEntry_fong caption="發票買受人" isMust={true}>
            <Input />
          </DataEntry_fong>
          <DataEntry_fong caption="保留款" isMust={true}>
            <Input />
          </DataEntry_fong>
          <DataEntry_fong caption="%" isMust={true}>
            <Input />
          </DataEntry_fong>
        </div>

        {/*  */}
        <div className="mt-6">
          <div className="flex gap-3 items-center">
            <div className="text-xl font-semibold">沖銷明細</div>
            <Btn theme="cross" onClick={handle_addNewOffsetAmount}>
              新增沖銷金額
            </Btn>
            <Btn theme="cross" onClick={handle_addDeduction}>
              新增沖銷扣款
            </Btn>
          </div>
          <div></div>
        </div>
        <Table_antd
          className="mt-4"
          dataSource={fakeData}
          columns={columns}
          scroll={{
            y: 400,
          }}
        />

        {/*  */}
      </div>
    </div>
  );
}

// ============================================================================

const AddData = () => {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [incomeCategory, setIncomeCategory] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  const handle_submit = () => {
    console.log(date);
    console.log(amount);
    console.log(incomeCategory);
    console.log(remarks);
  };

  return (
    <Container_confirm
      title="新增資料"
      footerRight={
        <>
          <Btn>取消</Btn>
          <Btn theme="save" onClick={handle_submit}>
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

const AddDeduction = () => {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [incomeCategory, setIncomeCategory] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [isDomestic, setIsDomestic] = useState<boolean>(true);

  const handle_submit = () => {
    console.log(date);
    console.log(amount);
    console.log(incomeCategory);
    console.log(remarks);
    console.log(isDomestic);
  };

  return (
    <Container_confirm
      title="新增沖銷扣款"
      footerRight={
        <>
          <Btn>取消</Btn>
          <Btn theme="save" onClick={handle_submit}>
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
        <DataEntry_fong caption="類型" isMust={true}>
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
        <DataEntry_fong caption="國內/國外" isMust={true}>
          <Select
            options={[
              { label: '國內', value: true },
              { label: '國外', value: false },
            ]}
            value={isDomestic}
            onChange={(value) => setIsDomestic(value as boolean)}
          />
        </DataEntry_fong>
        <DataEntry_fong caption="備註" isMust={true}>
          <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </DataEntry_fong>
      </div>
    </Container_confirm>
  );
};

// ============================================================================

const columns: TableProps<TfakeData>['columns'] = [
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
    width: 90,
    align: 'center',
    render: () => (
      <div className="flex gap-2">
        <Icon_note className="w-[16px] h-[16px] text-blue01" />
        <Icon_trash className="w-[16px] h-[16px] text-red01" />
      </div>
    ),
  },
];

// ============================================================================

interface TfakeData {
  id: string;
  serialNumber: string;
  idNumber: string;
  name: string;
  accountingSubjects: string;
  price: number;
}

const createFakeData = (count: number): TfakeData[] => {
  const data: TfakeData[] = [];

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

// 使用範例：建立 10 筆假資料
const fakeData: TfakeData[] = createFakeData(10);
