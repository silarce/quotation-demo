import { useState } from 'react';
import classNames from 'classnames';

import Btn, { Btn_UpDown } from 'components/global/gear/button/btn_fong';
import Table_antd, { TableProps } from 'components/global/myAntd/table';
import DataEntry, { DataEntry_fong, Input, Select, DatePicker } from 'components/global/gear/dataEntry';

import { Collapse } from 'components/global/myAntd/collapse';

import scss from './paymentRequest.module.scss';

export default function PaymentRequest() {
  const [isActive_detail, setState_isActive_deta] = useState<boolean>(true);

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
      <div className="mb-10">
        <div className="flex gap-3 items-center mb-10">
          <div className="text-xl font-semibold ">本次請款明細</div>
          <Btn_UpDown isActive={isActive_detail} onClick={() => setState_isActive_deta((prev) => !prev)}>
            展開
          </Btn_UpDown>
        </div>
        {isActive_detail && <Detail />}
      </div>
      {/*  */}
      <History />
      {/*  */}
    </div>
  );
}

// ==============================================================================

const CurrentlyAccumulated = () => {
  return (
    <div className={classNames('grid grid-cols-4 gap-fong')}>
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

const Detail = ({
  className,
}: {
  className?: string;
} = {}) => {
  return (
    <div className="p-6 border border-gray05 rounded-lg shadow-[0px_4px_4px_0px_#00000040]">
      <div className={classNames('grid grid-cols-4 gap-fong ', className)}>
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
    </div>
  );
};

const History = () => {
  return (
    <div>
      <div className="text-xl font-semibold mb-6">請款紀錄</div>
      <Collapse
        items={[
          {
            key: '1',
            label: '第O2期請款-OO 第O1期',
            children: <HistoryDetail />,
          },
          {
            key: '2',
            label: '第O2期請款-OO 第O1期',
            children: <HistoryDetail />,
          },
        ]}
      />
    </div>
  );
};

const HistoryDetail = () => {
  return (
    <div className={classNames('grid grid-cols-4 gap-fong ')}>
      <DataEntry_fong caption="本期請款金額" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="營業稅(5%)" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="本期合計" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="保留款(%)" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="稅" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="保留款金額" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="金額總計" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="發票日期" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="發票號碼" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="發票金額" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="買受人" disabled={true}>
        foooo
      </DataEntry_fong>
      <DataEntry_fong caption="統一編號" disabled={true}>
        foooo
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
