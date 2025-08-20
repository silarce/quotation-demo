import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { DataEntry_fong, Input } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';
import Table_antd, { TableProps } from 'components/global/myAntd/table';
import { Spin } from 'antd';

import { useApiGetSalesOrderDataList, TsalesOrder_simple_Dto } from 'js/api/api_netCore/api_salesOrder';
import Icon_note from 'public/image/icon/fong/note.svg';
import Icon_query from 'public/image/icon/fong/query.svg';

// ============================================================================

interface Tquery {
  keyword?: string;
}

// ============================================================================
export default function List() {
  const router = useRouter();
  const query = router.query as Tquery;

  const { data, isFetching } = useApiGetSalesOrderDataList();

  const [state_keyword, setState_keyword] = useState(query.keyword ?? '');

  const filteredData = useMemo(() => {
    if (!data) {
      return [];
    }

    if (!state_keyword) {
      return data;
    }

    return data.filter(
      (item) =>
        item.salesOrderNumber.includes(state_keyword) ||
        item.quotationContractNumber?.includes(state_keyword) ||
        item.customerName.includes(state_keyword) ||
        item.constructionSite.includes(state_keyword) ||
        item.totalAmount === Number(state_keyword)
    );
  }, [query.keyword, data]);

  const handle_search = () => {
    router.replace({
      query: {
        ...query,
        keyword: state_keyword,
      },
    });
  };

  return (
    <div>
      <div className="pageTop flex justify-between items-center">
        <div className="text-xl font-semibold">銷貨單列表</div>
        <div className="flex gap-3">
          <Btn onClick={() => router.push('edit')}>新建</Btn>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handle_search();
            }}
          >
            <DataEntry_fong>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input
                  placeholder="搜尋"
                  value={state_keyword}
                  onChange={(e) => {
                    setState_keyword(e.target.value);
                  }}
                />
                <Icon_query className=" cursor-pointer" onClick={handle_search} />
              </div>
            </DataEntry_fong>
          </form>
        </div>
      </div>

      {/*  */}
      <Spin spinning={isFetching} delay={500}>
        <Table_antd columns={columns} dataSource={filteredData} />
      </Spin>
      {/*  */}
    </div>
  );
}

// =====================================================================

const columns: TableProps<TsalesOrder_simple_Dto>['columns'] = [
  {
    title: '銷貨單號',
    dataIndex: 'salesOrderNumber',
    width: 150,
  },
  {
    title: '合約編號',
    dataIndex: 'quotationContractNumber',
    width: 150,
  },
  {
    title: '客戶名稱',
    dataIndex: 'customerName',
    width: 300,
  },
  {
    title: '工地名稱',
    dataIndex: 'constructionSite',
    width: 400,
  },
  {
    title: '總金額',
    dataIndex: 'totalAmount',
    width: 150,
    align: 'right',
    render: (v) => (v === null ? v : '$' + v.toLocaleString()),
  },
  {},
  {
    key: 'panel',
    width: 50,
    align: 'center',
    render: (_, record) => (
      <Link
        href={{
          pathname: 'edit',
          query: { id: record.id },
        }}
      >
        <Icon_note />
      </Link>
    ),
  },
];
