import classNames from 'classnames';
import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Tab from 'components/global/gear/button/tab';
import Btn from 'components/global/gear/button/btn_fong';
import { DataEntry_fong, Input, Select } from 'components/global/gear/dataEntry';

import Icon_note from 'public/image/icon/fong/procurement.svg';

// ============================================================================

interface Tquery {
  idNumber?: string;
  tab?: string;
}

interface Tdata {
  id: string;
  // 單號
  idNumber: string;
  // 類別
  type: string;
  //部門
  department: string;
  // 送出日期
  submitDate: string;
  // 申請人
  applicant: string;
  // 主旨
  subject: string;
}

// ============================================================================
export default function Approval() {
  const router = useRouter();
  const query = router.query as Tquery;
  const tab = query.tab || 'awaitingReview';

  const handle_awaitingReview = () => {
    router.replace({
      query: {
        ...query,
        tab: 'awaitingReview',
      },
    });
  };

  const handle_processingRecords = () => {
    router.replace({
      query: {
        ...query,
        tab: 'processingRecords',
      },
    });
  };

  return (
    <div className="grid grid-rows-[fit-content(100%)_1fr] h-full">
      <div className="flex gap-4 mb-6">
        <Tab active={tab === 'awaitingReview'} onClick={handle_awaitingReview}>
          待審核
        </Tab>
        <Tab active={tab === 'processingRecords'} onClick={handle_processingRecords}>
          處理紀錄
        </Tab>
      </div>

      <div className="wrapper_fong h-full">
        <SearchPanel className="mb-6" />
        <Table_antd dataSource={fakeData} columns={columns} />
      </div>
    </div>
  );
}

// ============================================================================

const columns: TableProps<Tdata>['columns'] = [
  {
    title: '單號',
    dataIndex: 'idNumber',
    width: 200,
    align: 'right',
  },
  {
    title: '類別',
    dataIndex: 'type',
    width: 100,
  },
  {
    title: '部門',
    dataIndex: 'department',
    width: 100,
  },
  {
    title: '送出日期',
    dataIndex: 'submitDate',
    width: 150,
    align: 'right',
  },
  {
    title: '申請人',
    dataIndex: 'applicant',
    width: 100,
  },
  {
    title: '主旨',
    dataIndex: 'subject',
  },
  {
    title: '操作',
    key: 'panel',
    width: 80,
    align: 'center',
    render: (_, record) => (
      <Link
        href={{
          pathname: 'approval/approve',
          query: {
            id: record.id,
          },
        }}
        className="inline-block"
      >
        <Icon_note className="w-[20px] h-[16px]" />
      </Link>
    ),
  },
];

// ============================================================================

const SearchPanel = ({
  className,
}: {
  className?: string;
} = {}) => {
  const router = useRouter();
  const query = router.query as Tquery;
  const [idNumber, setIdNumber] = useState(query.idNumber || '');
  const [type, setType] = useState(query.tab || '');

  const onSearch = () => {
    const newQuery: Tquery = {};

    idNumber && (newQuery.idNumber = idNumber);
    type && (newQuery.tab = type);

    router.replace({
      pathname: router.pathname,
      query: {
        ...query,
        ...newQuery,
      },
    });
  };

  return (
    <form
      className={classNames('flex gap-4', className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <DataEntry_fong className={'w-[102px]'}>
        <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="請輸入單號" />
      </DataEntry_fong>
      <DataEntry_fong className={'w-[118px]'}>
        <Select
          options={[
            { value: '1', label: '類型1' },
            { value: '2', label: '類型2' },
            { value: '3', label: '類型3' },
          ]}
          value={type}
          onChange={(value) => setType(value)}
        />
      </DataEntry_fong>
      <Btn theme="query" type="submit">
        搜索資料
      </Btn>
    </form>
  );
};

// ============================================================================

function generateFakeData(count: number): Tdata[] {
  const departments = ['部門A', '部門B', '部門C', '部門D'];
  const types = ['類型1', '類型2', '類型3'];
  const applicants = ['張三', '李四', '王五', '陳六', '林七'];

  return Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString(),
    idNumber: (100000 + i).toString(),
    type: types[i % types.length],
    department: departments[i % departments.length],
    submitDate: `2023-10-${String((i % 30) + 1).padStart(2, '0')}`,
    applicant: applicants[i % applicants.length],
    subject: `申請主旨${i + 1}`,
  }));
}

const fakeData: Tdata[] = generateFakeData(50);
