import { useState, useEffect } from 'react';

import { Spin } from 'antd';
import Table_antd from 'components/global/myAntd/table';
import type { ColumnsType } from 'antd/es/table';

import scss from './index.module.scss';

import Btn_fong from 'components/global/gear/button/btn_fong';
import Tab from 'components/global/gear/button/tab';

import { Input, DataEntry_fong } from 'components/global/gear/dataEntry';
import { useMessageSender } from 'hooks/globalState/useWindowMessage';

// ===========================================================================

// MARK:RENDER

export default function Review({ id, allowResponse }: { id?: string; allowResponse?: boolean }) {
  const { sendMessage, setTarget, isReady, targetWindow } = useMessageSender<string>({ channel: 'approve' });

  const [tab, setTab] = useState<'response' | 'history'>(allowResponse ? 'response' : 'history');

  const handle_editIframeState = () => {
    targetWindow?.forApprove?.editState();
  };

  useEffect(() => {
    if (isReady) {
      sendMessage('iframe握手完成，可以開始傳訊息');
    }
  }, [isReady]);

  return (
    <div className={scss.wrapper}>
      <div className={scss.body}>
        <Spin wrapperClassName={scss.spin} spinning={!isReady} delay={300}>
          <iframe
            ref={(ele) => {
              setTarget(ele?.contentWindow);
            }}
            src="/documentManagement/approval/approveTest"
            className={scss.iframe}
          />
        </Spin>

        <div className={scss.tabs}>
          <div className="mb-6 flex gap-4">
            {allowResponse && (
              <Tab
                active={tab === 'response'}
                onClick={() => {
                  setTab('response');
                }}
              >
                單據回覆
              </Tab>
            )}

            <Tab
              active={tab === 'history'}
              onClick={() => {
                setTab('history');
              }}
            >
              回覆歷史
            </Tab>
            <form
              className="flex gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(e.currentTarget.message.value);
              }}
            >
              <DataEntry_fong>
                <Input name="message" placeholder="測試iframe傳訊息" />
              </DataEntry_fong>
              <Btn_fong theme="send">送出測試訊息</Btn_fong>
            </form>
            <Btn_fong theme="send" onClick={handle_editIframeState}>
              測試iframe的window暴露的函式
            </Btn_fong>
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
    <Table_antd
      dataSource={fakeData}
      columns={columns}
      rowKey="step"
      scroll={{
        y: 80,
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
