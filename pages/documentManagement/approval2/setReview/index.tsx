import { Fragment } from 'react';
import classNames from 'classnames';
import { useState } from 'react';

import { useRouter } from 'next/router';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Tab from 'components/global/gear/button/tab';
import Btn from 'components/global/gear/button/btn_fong';
import { modal_empty, modal_delete } from 'components/global/gear/modal/fongModal';
import AddReviewProcesss from 'components/page/documnetManagement/approval2/addReviewProcess';

import Badge from 'components/global/gear/badge';

import Icon_right from 'public/image/icon/fong/right.svg';
import Icon_trash from 'public/image/icon/fong/trash.svg';
// import Icon_note from 'public/image/icon/fong/procurement.svg';

// ============================================================================

interface Tdata {
  id: string;
  name: string;
  process: {
    name: string;
    status: string;
  }[];
}

// ============================================================================

// MARK: START
export default function Approval() {
  const router = useRouter();

  const handle_tab1 = () => {
    router.push('../approval2');
  };

  const handle_delete = (id: string) => {
    modal_delete({
      onConfirm: () => {},
      onCancel: () => {},
    });
  };

  const handle_add = () => {
    modal_empty({
      content: <AddReviewProcesss />,
    });
  };

  const columns = createColumns({
    handle_delete,
  });

  return (
    <div className="grid grid-rows-[fit-content(100%)_1fr] h-full">
      <div className="flex gap-4 mb-6">
        <Tab onClick={handle_tab1}>個人單據</Tab>
        <Tab active={true}>自訂審核</Tab>
      </div>

      <div className="wrapper_fong h-full">
        <div className="mb-6 flex justify-between items-center">
          <div className="text-[16px] font-semibold">目前審核流程</div>
          <Btn theme="process" themeColor="green_I" onClick={handle_add}>
            新增流程
          </Btn>
        </div>
        <Table_antd dataSource={fakeData} columns={columns} rowHoverable={false} />
      </div>
    </div>
  );
}
// MARK: END

// ============================================================================

const lookup_theme = {
  提出: 'secondary',
  審查: 'primary',
  核准: 'success',
} as const;

const createColumns = ({ handle_delete }: { handle_delete: (id: string) => void }) => {
  const columns: TableProps<Tdata>['columns'] = [
    {
      title: '序',
      key: 'index',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: '名稱',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '流程',
      dataIndex: 'process',
      render: (process: Tdata['process']) => {
        return (
          <div>
            {process.map(({ name, status }, index) => {
              const theme = status in lookup_theme ? lookup_theme[status as keyof typeof lookup_theme] : undefined;

              const isLast = index === process.length - 1;

              return (
                <Fragment key={index}>
                  <span className="mr-1">{name}</span>
                  <Badge theme={theme}>{status}</Badge>
                  {!isLast && <Icon_right className="inline-block mx-[14px]" />}
                </Fragment>
              );
            })}
          </div>
        );
      },
    },

    {
      title: '操作',
      key: 'panel',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Icon_trash
          className="inline-block text-red01 cursor-pointer"
          onClick={() => {
            handle_delete(record.id);
          }}
        />
      ),
    },
  ];

  return columns;
};

// ============================================================================

function generateFakeData(count: number): Tdata[] {
  const data: Tdata[] = [];

  for (let i = 1; i <= count; i++) {
    data.push({
      id: i.toString(),
      name: `文件名稱 ${i}`,
      process: [
        { name: '阿狗', status: '提出' },
        { name: '阿貓', status: '審查' },
        { name: '阿鳥', status: '核准' },
      ],
    });
  }

  return data;
}

const fakeData: Tdata[] = generateFakeData(50);
