import Btn from 'components/global/gear/button/btn_fong';
import Table_antd, { TableProps } from 'components/global/myAntd/table';
import DataEntry, { DataEntry_fong } from 'components/global/gear/dataEntry';

import { Collapse } from 'components/global/myAntd/collapse';

import scss from './paymentRequest.module.scss';

export default function PaymentRequest() {
  return (
    <div>
      {/*  */}
      <div className="pageTop">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">工程項目明細</div>
          <div>
            <Btn>返回</Btn>
          </div>
        </div>
      </div>
      {/*  */}
      <Table_antd columns={columns} dataSource={fakeData_projectDetail} />
      <br />
      <Collapse
        items={[
          {
            key: '1',
            label: '目前累計',
            classNames: {
              // header: scss.collapseTitle,
            },
            children: <CurrentlyAccumulated />,
          },
        ]}
      />
      <br />
      <div>
        <div>
          <div className="text-xl font-semibold">本次請款明細</div>
          <Btn>收起</Btn>
        </div>
      </div>
      {/*  */}
    </div>
  );
}

// ==============================================================================

const CurrentlyAccumulated = () => {
  return (
    <div className="grid grid-cols-4 gap-fong">
      <DataEntry_fong caption="目前累計請款金額" disabled={true}>
        fooo
      </DataEntry_fong>
      <DataEntry_fong caption="營業稅(5%)" disabled={true}>
        fooo
      </DataEntry_fong>
      <DataEntry_fong caption="本期合計" disabled={true}>
        fooo
      </DataEntry_fong>
      <DataEntry_fong caption="保留款(%)" disabled={true}>
        fooo
      </DataEntry_fong>
      <DataEntry_fong caption="稅" disabled={true}>
        fooo
      </DataEntry_fong>
      <DataEntry_fong caption="保留款金額" disabled={true}>
        fooo
      </DataEntry_fong>
      <DataEntry_fong caption="金額總計" disabled={true}>
        fooo
      </DataEntry_fong>
      <DataEntry_fong caption="發票日期" disabled={true}>
        fooo
      </DataEntry_fong>
      <DataEntry_fong caption="發票號碼" disabled={true}>
        fooo
      </DataEntry_fong>
      <DataEntry_fong caption="發票金額" disabled={true}>
        fooo
      </DataEntry_fong>
      <DataEntry_fong caption="買受人" disabled={true}>
        fooo
      </DataEntry_fong>
      <DataEntry_fong caption="統一編號" disabled={true}>
        fooo
      </DataEntry_fong>
    </div>
  );
};

// ==============================================================================

interface TfakeData_projectDetail {
  id: string;
  itemName: string;
  size: string;
  qty: number;
  productPrice: number;
  completedInLastPeriod: number;
  completedInThisPeriod: number;
  amountInthisPeriod: number;
  totalAmount: number;
}

const columns: TableProps<TfakeData_projectDetail>['columns'] = [
  {
    title: '項目',
    dataIndex: 'itemName',
    width: 80,
  },
  {
    title: '尺寸',
    dataIndex: 'size',
    width: 200,
  },
  {
    title: '數量',
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '合約單價',
    dataIndex: 'productPrice',
    width: 150,
  },
  {
    title: '前期以完成',
    dataIndex: 'completedInLastPeriod',
    width: 150,
  },
  {
    title: '本期完成',
    dataIndex: 'completedInThisPeriod',
    width: 150,
  },
  {
    title: '本期金額',
    dataIndex: 'amountInthisPeriod',
    width: 150,
  },
  {
    title: '合計',
    dataIndex: 'totalAmount',
    width: 100,
  },
  {},
];

const fakeData_projectDetail: TfakeData_projectDetail[] = [
  {
    id: '1',
    itemName: '項目A',
    size: '10x10',
    qty: 5,
    productPrice: 1000,
    completedInLastPeriod: 2000,
    completedInThisPeriod: 3000,
    amountInthisPeriod: 5000,
    totalAmount: 7000,
  },
  {
    id: '2',
    itemName: '項目B',
    size: '20x20',
    qty: 3,
    productPrice: 1500,
    completedInLastPeriod: 4500,
    completedInThisPeriod: 6000,
    amountInthisPeriod: 7500,
    totalAmount: 12000,
  },
];
