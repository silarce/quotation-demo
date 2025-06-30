import classNames from 'classnames';

import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';

import { Tabs } from 'antd';

import DataEntry, { Textarea } from 'components/global/gear/dataEntry';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import Row, { Cell } from 'components/global/gear/table/row';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import scss from './approve.module.scss';

// ===========================================================================

export default function Approve() {
  return (
    <SubLayer>
      <PageHeader02 tag="審核" />

      <div className={scss.body}>
        <iframe src="/setting/company-info" className={scss.iframe} />

        {/* <ApprovePanel /> */}

        <Tabs
          className={classNames(scss.tabs)}
          items={[
            {
              key: '0',
              label: '單據回覆',
              children: <Response />,
            },
            {
              key: '1',
              label: '單據歷史',
              children: <History />,
            },
          ]}
        />
      </div>
    </SubLayer>
  );
}

const Response = () => {
  return (
    <div className={scss.approvePanel}>
      <div className="text-xl font-semibold">主管</div>

      <DataEntry caption="主管回覆">
        <DataEntry.Input />
      </DataEntry>

      <div className={scss.btnBar}>
        <SquareBtn sharp="mini">返回</SquareBtn>
        <SquareBtn sharp="mini">駁回</SquareBtn>
        <SquareBtn sharp="mini">同意</SquareBtn>
      </div>
    </div>
  );
};

const History = () => {
  return (
    <div className={scss.approvePanel}>
      <Table
        dataSource={fakeData}
        columns={columns}
        pagination={false}
        scroll={{
          y: 200,
        }}
      />
    </div>
  );
};

// ===========================================================================

interface TfakeData {
  step: string;
  reviewer: string;
  status: string;
  reviewTime: string;
  note: string;
}

const fakeData: TfakeData[] = [
  {
    step: '送出申請',
    reviewer: '王小明',
    status: '通過',
    reviewTime: '2025/01/01 09:00',
    note: '自動送出',
  },
  {
    step: '主管審核',
    reviewer: '李小華',
    status: '通過',
    reviewTime: '2023-10-15 16:39',
    note: 'OK',
  },
  {
    step: '總經理審核',
    reviewer: '張小美',
    status: '待簽核',
    reviewTime: '- -',
    note: '- -',
  },
  {
    step: 'HR審核',
    reviewer: '陳小強',
    status: '待簽核',
    reviewTime: '- -',
    note: '- -',
  },
  {
    step: '財務審核',
    reviewer: '林小芳',
    status: '待簽核',
    reviewTime: '- -',
    note: '- -',
  },
  {
    step: '完成',
    reviewer: '系統',
    status: '已完成',
    reviewTime: '2023-10-16 10:00',
    note: '流程已結束',
  },
];

const columns: ColumnsType<TfakeData> = [
  {
    key: 'step',
    dataIndex: 'step',
    title: '關卡',
    width: '150px',
  },
  {
    key: 'reviewer',
    dataIndex: 'reviewer',
    title: '審核人',
    width: '100px',
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: '狀態',
    width: '100px',
  },
  {
    key: 'reviewTime',
    dataIndex: 'reviewTime',
    title: '簽核時間',
    width: '200px',
  },
  {
    key: 'note',
    dataIndex: 'note',
    title: '簽核意見',
  },
];
