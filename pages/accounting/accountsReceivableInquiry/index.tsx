import { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { DataEntry_fong, Input, DatePicker } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';
import { Form, Spin } from 'antd';

import {
  useApiGetAccountsReceivablesList,
  TaccountsReceivablesList_Dto,
} from 'js/api/api_netCore/api_accountsReceivable';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';
import Icon_note from 'public/image/icon/fong/note.svg';
import scss from './index.module.scss';

export default function AccountsReceivableInquiry() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { keyword, page } = router.query as Tquery;

  const apiParam = useMemo(() => {
    return {
      filter: keyword,
      page: Number(page) || 1,
    };
  }, [keyword, page]);

  const { data: accountsReceivablesArr, meta, isFetching } = useApiGetAccountsReceivablesList(apiParam);

  const isKeywordIsDate = !!keyword && dayjs(keyword).isValid();
  const defaultSearchValue = isKeywordIsDate ? getTaiwanDateStr(keyword) : keyword;
  // ---------------------------------------------------------------------------

  const handel_search = ({ keyword }: { keyword?: string }) => {
    const isKeywordIsDate = !!keyword && dayjs(keyword).isValid();

    if (isKeywordIsDate) {
      keyword = dayjs(keyword).add(1911, 'year').format('YYYY-MM-DD');
    }

    router.replace({
      query: {
        ...query,
        keyword: keyword,
      },
    });
  };

  // MARK: RENDER

  return (
    <div>
      <div className={'pageTop flex justify-between'}>
        <Form className={classNames('flex gap-4 items-center', scss.form)} onFinish={handel_search}>
          <div className="text-base font-semibold">應收款列表</div>

          <Form.Item className={scss.formItem} name="keyword">
            <DataEntry_fong
              childrenWrapperProps={{
                className: scss.input,
              }}
            >
              <Input placeholder="輸入合約編號 / 客戶姓名 / 案場名稱 / 建立日期" defaultValue={defaultSearchValue} />
            </DataEntry_fong>
          </Form.Item>

          <Btn theme="query">搜索資料</Btn>
        </Form>
        <div>
          <Link href={Router.pathname + '/salesInformation'}>
            <Btn theme="add">新增資料</Btn>
          </Link>
        </div>
      </div>

      <Spin spinning={isFetching} delay={300}>
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
      </Spin>
    </div>
  );
}

// ========================================================================

// MARK: TYPE

interface Tquery {
  keyword?: string;

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
    title: '總金額',
    dataIndex: 'totalAmount',
    width: 150,
    align: 'right',
    render: (_, record) => toLocaleString(record.totalAmount),
  },
  {
    title: '已請款金額',
    dataIndex: 'prAmount',
    align: 'right',
    width: 150,
    render: (_, record) => toLocaleString(record.prAmount),
  },
  {
    title: '已收款金額',
    dataIndex: 'collectAmount',
    width: 150,
    align: 'right',
    render: (_, record) => toLocaleString(record.collectAmount),
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
    align: 'center',
    render: (text: string | null) => {
      if (!text) {
        return null;
      }

      const lookup: Record<string, string> = {
        未請款: 'state-gray',
        草稿: 'state-gray',
        請款中: 'state-blue',
        審核中: 'state-blue',
        已完成: 'state-green',
        已請款: 'state-green',
        駁回: 'state-red',
      };

      return <span className={classNames(lookup[text] || 'state-gray')}>{text}</span>;
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    align: 'center',
    render(_, record) {
      const href = {
        pathname: Router.pathname + '/salesInformation',
        query: {
          id: record.id,
        },
      };

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
