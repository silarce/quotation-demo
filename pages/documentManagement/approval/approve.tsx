import { useRouter } from 'next/router';
import { useRef, useEffect } from 'react';

import classNames from 'classnames';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import scss from './approve.module.scss';

import Btn_fong from 'components/global/gear/button/btn_fong_old';
import Tab from 'components/global/gear/button/tab';

import { Input, DataEntry_fong } from 'components/global/gear/dataEntry';

// ===========================================================================

interface Tquery {
  tab?: string;
}

// ===========================================================================

// MARK:RENDER

export default function Approve() {
  const router = useRouter();
  const query = router.query as Tquery;
  const tab = query.tab || 'response';

  const ref_iframe = useRef<HTMLIFrameElement>(null);

  const handle_tab = (v: 'response' | 'history') => {
    router.replace({
      query: {
        ...query,
        tab: v,
      },
    });
  };

  return (
    <div className={scss.wrapper}>
      <div className={scss.body}>
        <iframe ref={ref_iframe} src="/setting/company-info" className={scss.iframe} />

        <div className={scss.tabs}>
          <div className="mb-6 flex gap-4">
            <Tab
              active={tab === 'response'}
              onClick={() => {
                handle_tab('response');
              }}
            >
              單據回覆
            </Tab>
            <Tab
              active={tab === 'history'}
              onClick={() => {
                handle_tab('history');
              }}
            >
              單據歷史
            </Tab>
          </div>
          {tab === 'response' ? <Response /> : null}
          {tab === 'history' ? <History /> : null}
        </div>
      </div>
    </div>
  );
}

const Response = () => {
  return (
    <div className={scss.response}>
      <DataEntry_fong caption="審核人回覆" isMust={true}>
        <Input />
      </DataEntry_fong>

      <div className={scss.btnBar}>
        <Btn_fong>返回</Btn_fong>
        <Btn_fong>駁回</Btn_fong>
        <Btn_fong>同意</Btn_fong>
      </div>
    </div>
  );
};

const History = () => {
  return (
    <Table
      className={scss.antdTable}
      dataSource={fakeData}
      rowKey="step"
      columns={columns}
      pagination={false}
      scroll={{
        y: 140,
      }}
      onHeaderRow={() => {
        return {
          className: scss.theadTr,
        };
      }}
      onRow={() => {
        return {
          className: scss.rowTr,
        };
      }}
    />
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
    width: '100px',
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

// ===========================================================================
