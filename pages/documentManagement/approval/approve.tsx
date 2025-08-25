import { useRef, useEffect } from 'react';

import classNames from 'classnames';

import { Tabs } from 'antd';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import scss from './approve.module.scss';

import Btn_fong from 'components/global/gear/button/btn_fong_old';

import DataEntry, { Input, DataEntry_fong } from 'components/global/gear/dataEntry';

// import { useMessageReceiver, useMessageSender } from 'hooks/globalState/useWindowMessage';

// ===========================================================================

export default function Approve() {
  const ref_iframe = useRef<HTMLIFrameElement>(null);

  const items = [
    {
      key: 'a',
      label: '單據回覆',
      children: <Response />,
    },
    {
      key: 'b',
      label: '單據歷史',
      children: <History />,
    },
  ];

  return (
    <div className={scss.wrapper}>
      <div className={scss.body}>
        <iframe ref={ref_iframe} src="/setting/company-info" className={scss.iframe} />

        <Tabs
          className={classNames(scss.tabs)}
          items={items}
          renderTabBar={(props, DefaultTabBar) => {
            const { onTabClick } = props;

            const reactNode = items.map((item) => {
              const { key } = item;

              return (
                <Btn_fong
                  key={key}
                  theme="large"
                  onClick={(e) => {
                    onTabClick(key, e);
                  }}
                >
                  {item.label}
                </Btn_fong>
              );
            });

            return <div className="flex gap-[12px] mb-[24px]">{reactNode}</div>;
          }}
          //
        />
      </div>
    </div>
  );
}

const Response = () => {
  return (
    <div className={scss.approvePanel}>
      <div className="text-base font-semibold mb-[14.5px]">主管</div>

      <DataEntry_fong
        caption="主管回覆 :"
        captionStyle={{
          width: '106px',
        }}
      >
        <input type="text" />
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
    <div className={scss.approvePanel}>
      <Table
        className={scss.antdTable}
        dataSource={fakeData}
        rowKey="step"
        columns={columns}
        pagination={false}
        scroll={{
          y: 160,
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
