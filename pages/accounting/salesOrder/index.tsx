import Btn from 'components/global/gear/button/btn_fong';
import DataEntry, { DataEntry_fong, Input } from 'components/global/gear/dataEntry';
import Table_antd, { TableProps } from 'components/global/myAntd/table';

import { modal_empty } from 'components/global/gear/modal/fongModal';

import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';

export default function SalesOrder() {
  return (
    <div>
      <div className="pageTop flex justify-between items-center">
        <div className="text-xl font-semibold">銷貨單</div>
        <div className="flex gap-3">
          <Btn theme="import">合約匯入</Btn>
          <Btn theme="trash">清空</Btn>
          <Btn theme="save">儲存</Btn>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-fong">
        <DataEntry_fong caption="合約編號" className="col-span-2" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="案場名稱" className="col-span-2" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="客戶編號" className="col-span-2" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="客戶名稱" className="col-span-2" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="統一編號" className="col-span-2" isMust={true}>
          <Input />
        </DataEntry_fong>
        <div />
        <div />
        <DataEntry_fong caption="銷售金額" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="稅金" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="已請款總額" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="銷售總額" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="已收金額" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="扣款折讓" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="稅別" isMust={true}>
          <Input />
        </DataEntry_fong>
        <DataEntry_fong caption="應稅外加" isMust={true}>
          <Input />
        </DataEntry_fong>
      </div>
      <div className="mt-10 ">
        <div className="text-xl font-semibold mb-6">銷貨明細</div>
        <Table_antd
          dataSource={fakeData}
          columns={columns}
          scroll={{
            y: 400,
          }}
        />
      </div>
    </div>
  );
}

// ==============================================================================

const columns: TableProps<TfakeData>['columns'] = [
  {
    dataIndex: 'serialNumber',
    title: '序號',
    align: 'center',
    width: 80,
  },
  {
    dataIndex: 'idNumber',
    title: '產品代號',
    width: 120,
  },
  {
    dataIndex: 'name',
    title: '產品名稱',
    width: 150,
  },
  {
    dataIndex: 'qty',
    title: '數量',
    align: 'right',
    width: 150,
  },
  {
    dataIndex: 'price',
    title: '單價',
    align: 'right',
    width: 150,
    render: (text) => '$' + text.toLocaleString(),
  },
  {
    dataIndex: 'totalPrice',
    title: '金額',
    align: 'right',
    width: 150,
    render: (text) => '$' + text.toLocaleString(),
  },
  {},
  {
    key: 'panel',
    title: '操作',
    align: 'center',
    width: 80,
    render: () => (
      <div className="flex gap-2">
        <Icon_note className="w-[16px] h-[16px] text-blue01" />
        <Icon_trash className="w-[16px] h-[16px] text-red01" />
      </div>
    ),
  },
];

// ==============================================================================

interface TfakeData {
  id: string;
  serialNumber: string;
  idNumber: string;
  name: string;
  qty: number;
  price: number;
  totalPrice: number;
}

const fakeData: TfakeData[] = Array.from({ length: 50 }, (_, index) => ({
  id: `id-${index}`,
  serialNumber: `${index + 1}`,
  idNumber: `ID-${index + 1}`,
  name: `商品 ${index + 1}`,
  qty: Math.floor(Math.random() * 100) + 1,
  price: 9999,
  totalPrice: 9899999,
}));
