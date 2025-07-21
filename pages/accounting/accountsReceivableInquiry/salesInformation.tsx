import { useRouter } from 'next/router';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong, Input } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';
import Tab from 'components/global/gear/button/tab';
import { modal_empty } from 'components/global/gear/modal/fongModal';

import Selector_searchSomething from 'components/page/accounting/accountsReceivableInquiry/selector_searchSomething';

import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';

export default function SalesInformation() {
  const router = useRouter();

  return (
    <div>
      {/*  */}
      <div className="pageTop flex justify-between">
        <div className="flex gap-4">
          <Tab active={true}>銷貨資料</Tab>
          <Tab>應收帳款</Tab>
        </div>
        <div className="flex gap-3">
          <Btn onClick={router.back}>返回</Btn>
          <Btn
            theme="query"
            onClick={() => {
              modal_empty({
                width: 1200,
                customWidth: 'fit-content',
                content: <Selector_searchSomething />,
              });
            }}
          >
            查詢資料
          </Btn>
          <Btn theme="save" form="aa">
            儲存
          </Btn>
        </div>
      </div>
      {/*  */}
      <div className="grid grid-cols-4 gap-fong">
        <DataEntry_fong caption="合約編號" isMust={true} className="col-span-2">
          <Input required />
        </DataEntry_fong>
        <DataEntry_fong caption="案場名稱" isMust={true} className="col-span-2">
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="客戶編號" isMust={true} className="col-span-2">
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="客戶名稱" isMust={true} className="col-span-2">
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="統一編號" isMust={true} className="col-span-2">
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="稅別" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="外幣" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="銷售金額" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="銷售稅金" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="追加減金額" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="追加減金額稅金" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="已收金額" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="扣款折讓" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="已請款總額" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="銷售總額" isMust={true}>
          <Input />
        </DataEntry_fong>
      </div>
      {/*  */}
      <div className="mt-10">
        <div className="mb-6">
          <span className="text-xl font-semibold">銷貨明細</span>
        </div>
        <Table_antd columns={columns01} dataSource={fakeData01} pagination={false} />
      </div>
      <div className="mt-10">
        <div className="mb-6">
          <span className="text-xl font-semibold mr-3">請款狀況</span>
          <Btn theme="cross">新增資料</Btn>
        </div>
        <Table_antd columns={columns02} dataSource={fakeData02} pagination={false} />
      </div>
    </div>
  );
}

// ==========================================================================

interface TfakeData01 {
  id: string;
  serialNumber: string;
  idNumber: string;
  name: string;
  qty: number;
  price: number;
  totalPrice: number;
}
interface TfakeData02 {
  id: string;
  idNumber: string;
  period: string;
  type: string;
  requestAmount: number;
  amountReceived: number;
  discount: number;
}
const columns01: TableProps<TfakeData01>['columns'] = [
  {
    title: '序號',
    dataIndex: 'serialNumber',
    width: 80,
    align: 'center',
  },
  {
    title: '產品代號',
    dataIndex: 'idNumber',
    width: 120,
  },
  {
    title: '產品名稱',
    dataIndex: 'name',
    width: 150,
  },
  {
    title: '數量',
    align: 'right',
    dataIndex: 'qty',
    width: 150,
  },
  {
    title: '單價',
    dataIndex: 'price',
    align: 'right',
    width: 150,
    render: (value) => '$' + value.toLocaleString(),
  },
  {
    title: '金額',
    dataIndex: 'totalPrice',
    align: 'right',
    width: 150,
    render: (value) => '$' + value.toLocaleString(),
  },
  {},
];

const columns02: TableProps<TfakeData02>['columns'] = [
  {
    title: '請款單號',
    dataIndex: 'idNumber',
    width: 150,
  },
  {
    title: '期別',
    dataIndex: 'period',
    width: 120,
  },
  {
    title: '類型',
    dataIndex: 'type',
    width: 150,
  },
  {
    title: '請款金額',
    dataIndex: 'requestAmount',
    align: 'right',
    width: 150,
    render: (value) => '$' + value.toLocaleString(),
  },
  {
    title: '實收金額',
    dataIndex: 'amountReceived',
    align: 'right',
    width: 150,
    render: (value) => '$' + value.toLocaleString(),
  },
  {
    title: '折讓',
    dataIndex: 'discount',
    align: 'right',
    width: 150,
    render: (value) => '$' + value.toLocaleString(),
  },
  {},
  {
    title: '操作',
    key: 'action',
    width: 90,
    align: 'center',
    render: (_, record) => {
      return (
        <div className="flex gap-2">
          <Icon_note className="w-[16px] h-[16px] text-blue01" />
          <Icon_trash className="w-[16px] h-[16px] text-red01" />
        </div>
      );
    },
  },
];

const fakeData01: TfakeData01[] = Array.from({ length: 11 }, (_, index) => ({
  id: `id-${index}`,
  serialNumber: `${index + 1}`,
  idNumber: `SD${index + 1000}`,
  name: 'SJ-302',
  qty: Math.floor(Math.random() * 10) + 1,
  price: 99999,
  totalPrice: 99999,
}));

const fakeData02: TfakeData02[] = Array.from({ length: 10 }, (_, index) => ({
  id: `id-${index}`,
  idNumber: `INV${index + 2000}`,
  period: `2023/06`,
  type: '代收支付',
  requestAmount: 99999,
  amountReceived: 99999,
  discount: 99999,
}));
