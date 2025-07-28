import Btn from 'components/global/gear/button/btn_fong';
import Table_antd, { TableProps } from 'components/global/myAntd/table';

import { Collapse, UpDownArrow } from 'components/global/myAntd/collapse';
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
      {/* <Collapse_old
        items={[
          {
            key: '1',
            label: '目前累計',
            classNames: {
              // header: scss.collapseTitle,
            },
            children: <div>fooooooooooooo</div>,
          },
        ]}
      /> */}
    </div>
  );
}

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
