import { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import Router, { useRouter } from 'next/router';
import Link from 'next/link';

import classNames from 'classnames';

import scss from './index.module.scss';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong, Input, DatePicker } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';

import { Form } from 'antd';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import Icon_note from 'public/image/icon/fong/note.svg';

import {
  useApiGetAccountsReceivablesList,
  TaccountsReceivablesList_Dto,
} from 'js/api/api_netCore/api_accountsReceivable';

export default function AccountsReceivableInquiry() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { keyword, createdAt, page } = router.query as Tquery;

  const apiParam = useMemo(() => {
    return {
      filter: keyword,
      page: Number(page) || 1,
    };
  }, [keyword, createdAt, page]);

  const { data: accountsReceivablesArr, meta } = useApiGetAccountsReceivablesList(apiParam);

  const handel_search = ({ keyword, createdAt }: { keyword?: string; createdAt?: Dayjs }) => {
    router.replace({
      query: {
        ...query,
        keyword: keyword ?? undefined,
        createdAt: createdAt ? createdAt.toISOString() : undefined,
      },
    });
  };

  return (
    <div>
      <div className={'pageTop flex justify-between'}>
        <Form className={classNames('flex gap-4', scss.form)} onFinish={handel_search}>
          <Form.Item className={scss.formItem} name="keyword">
            <DataEntry_fong
              childrenWrapperProps={{
                className: scss.input,
              }}
            >
              <Input placeholder="輸入合約編號 / 客戶姓名 / 案場名稱" defaultValue={keyword} />
            </DataEntry_fong>
          </Form.Item>

          <DataEntry_fong
            childrenWrapperProps={{
              className: scss.datePicker,
            }}
          >
            <Form.Item className={scss.formItem} name="createdAt">
              <DatePicker defaultValue={createdAt ? dayjs(createdAt) : undefined} />
            </Form.Item>
          </DataEntry_fong>
          <Btn theme="query">搜索資料</Btn>
        </Form>
        <div>
          <Link href={Router.pathname + '/salesInformation'}>
            <Btn theme="add">新增資料</Btn>
          </Link>
        </div>
      </div>

      <Table_antd
        columns={columns}
        dataSource={accountsReceivablesArr ?? undefined}
        scroll={{
          y: '550px',
        }}
        pagination={{
          current: Number(page || 1),
          pageSize: meta?.pageSize,
          total: meta?.itemCount,
          onChange(page) {
            router.replace({
              query: {
                ...query,
                page: page,
              },
            });
          },
        }}
      />
    </div>
  );
}

// ========================================================================

// MARK: TYPE

interface Tquery {
  keyword?: string;
  createdAt?: string;

  page?: `${number}`;
}

// ========================================================================

// MARK: columns
const columns: TableProps<TaccountsReceivablesList_Dto>['columns'] = [
  {
    title: '合約編號',
    dataIndex: 'quotationContractNumber',
    width: 150,
  },
  {
    title: '建立日期',
    dataIndex: 'createdAt',
    width: 130,
    render: (_, record) => getTaiwanDateStr(record.createdAt),
  },
  {
    title: '客戶姓名',
    dataIndex: 'customerName',
    width: 250,
  },
  {
    title: '案場名稱',
    dataIndex: 'projectName',
    width: 250,
  },
  {
    title: '合約金額',
    dataIndex: 'salesAmount',
    width: 150,
    align: 'right',
    render: (_, record) => toLocaleString(record.salesAmount),
  },
  {
    title: '稅金',
    dataIndex: 'taxes',
    align: 'right',
    width: 150,
    render: (_, record) => toLocaleString(record.taxes),
  },
  {
    title: '總金額',
    dataIndex: 'totalAmount',
    width: 150,
    align: 'right',
    render: (_, record) => toLocaleString(record.totalAmount),
  },
  {
    title: '應收款項金額',
    dataIndex: 'requestAmount',
    width: 150,
    align: 'right',
    render: (_, record) => toLocaleString(record.requestAmount),
  },
  {
    title: '扣款金額',
    dataIndex: 'deduction',
    width: 150,
    align: 'right',
    render: (_, record) => toLocaleString(record.deduction),
  },
  {
    title: '狀態',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    render(_, record) {
      const href = Router.pathname + '/salesInformation';

      return (
        <div className="flex justify-center">
          <Link href={href}>
            <Icon_note className="text-blue01" />
          </Link>
        </div>
      );
    },
  },
];

const toLocaleString = (value: number | null) => {
  return value !== null ? '$' + value.toLocaleString() : '';
};
