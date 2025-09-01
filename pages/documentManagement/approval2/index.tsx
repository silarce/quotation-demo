import classNames from 'classnames';
import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Tab from 'components/global/gear/button/tab';
import Btn from 'components/global/gear/button/btn_fong';
import { DataEntry_fong, Input, Select } from 'components/global/gear/dataEntry';

import Icon_note from 'public/image/icon/fong/procurement.svg';

import Badge from 'components/global/gear/badge';

// ============================================================================

interface Tquery {
  tab?: 'personal' | 'setReview' | string;
  idNumber?: string;
  type?: string;
}

interface Tdata {
  id: string;
  // 單號
  idNumber: string;
  // 類別
  type: string;
  // 送出日期
  submitDate: string;
  // 狀態
  status: string;
}

// ============================================================================

const tab1 = 'personal';
const tab2 = 'setReview';

// ============================================================================
export default function Approval() {
  const router = useRouter();
  const query = router.query as Tquery;
  const tab = query.tab || 'personal';

  const handle_tab1 = () => {
    router.replace({
      query: {
        ...query,
        tab: tab1,
      },
    });
  };

  const handle_tab2 = () => {
    router.replace({
      query: {
        ...query,
        tab: tab2,
      },
    });
  };

  return (
    <div className="grid grid-rows-[fit-content(100%)_1fr] h-full">
      <div className="flex gap-4 mb-6">
        <Tab active={tab === 'personal'} onClick={handle_tab1}>
          個人單據
        </Tab>
        <Tab active={tab === 'setReview'} onClick={handle_tab2}>
          自訂審核
        </Tab>
      </div>

      <div className="wrapper_fong h-full">
        <SearchPanel className="mb-6" />
        <Table_antd dataSource={fakeData} columns={columns} rowHoverable={false} />
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
    title: '送出日期',
    dataIndex: 'submitDate',
    width: 150,
    align: 'right',
  },
  {},
  {
    title: '狀態',
    dataIndex: 'status',
    width: 100,
    align: 'center',
    render: (v) => {
      if (v === '審核中') {
        return <Badge theme="primary">{v}</Badge>;
      }

      if (v === '已核准') {
        return <Badge theme="success">{v}</Badge>;
      }

      if (v === '駁回') {
        return <Badge theme="danger">{v}</Badge>;
      } else {
        return <Badge>{v}</Badge>;
      }
    },
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

const SearchPanel = ({ className }: { className?: string } = {}) => {
  const router = useRouter();
  const query = router.query as Tquery;
  const [idNumber, setIdNumber] = useState(query.idNumber || '');
  const [type, setType] = useState(query.type || '');

  const onSearch = () => {
    const newQuery: Tquery = {};

    idNumber && (newQuery.idNumber = idNumber);
    type && (newQuery.type = type);

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
      <DataEntry_fong
        childrenWrapperProps={{
          className: 'w-[102px]',
        }}
      >
        <Input
          //
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          placeholder="請輸入單號"
        />
      </DataEntry_fong>
      <DataEntry_fong
        childrenWrapperProps={{
          className: 'w-[118px]',
        }}
      >
        <Select
          placeholder="選擇類別"
          options={[
            { value: '1', label: '類別1' },
            { value: '2', label: '類別2' },
            { value: '3', label: '類別3' },
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
  const types = ['類型1', '類型2', '類型3'];
  const statuses = ['審核中', '已核准', '駁回'];

  return Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString(),
    idNumber: `APP-${String(i + 1).padStart(5, '0')}`,
    type: types[i % types.length],
    submitDate: `2023-10-${String((i % 30) + 1).padStart(2, '0')}`,
    status: statuses[i % statuses.length],
  }));
}

const fakeData: Tdata[] = generateFakeData(50);
