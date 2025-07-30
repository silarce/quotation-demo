import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

import Table_antd, { TableProps, metaToPageProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';
import { Container_confirm } from 'components/global/container/modal';
import { modal_empty } from 'components/global/gear/modal/fongModal';

import { useGetAccountantInvoiceBook, TaccountantInvoiceBookDto } from 'js/api/api_accountant';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

const Selector_invoiceBook = ({ title = '發票本選擇', onCancel }: { title?: string; onCancel: () => void }) => {
  const [page, setPage] = useState(1);
  const params = useMemo(() => ({ page }), [page]);

  const { data, meta } = useGetAccountantInvoiceBook({ params });

  return (
    <Container_confirm
      title={title}
      footerRight={
        <>
          <Btn onClick={onCancel}>取消</Btn>
          <Btn>確認</Btn>
        </>
      }
    >
      <Table_antd
        className="w-[940px]"
        dataSource={data}
        columns={columns}
        pagination={{
          current: meta?.page,
          pageSize: meta?.pageSize,
          total: meta?.itemCount,
          onChange(page) {
            setPage(page);
          },
        }}
      />
    </Container_confirm>
  );
};

// ==========================================================================

const columns: TableProps<TaccountantInvoiceBookDto>['columns'] = [
  {
    title: '年分',
    dataIndex: 'year',
    width: 80,
    align: 'center',
    render: (text: `${number}`) => Number(text) - 1911,
  },
  {
    title: '月份',
    dataIndex: 'month',
    width: 80,
    align: 'center',
    render: (text: keyof typeof lookup_month) => lookup_month[text],
  },
  {
    title: '發票類別',
    dataIndex: 'type',
    width: 100,
    align: 'center',
  },
  {
    title: '字軌',
    dataIndex: 'alphabeticLetter',
    width: 80,
    align: 'center',
  },
  {
    title: '起始號碼',
    dataIndex: 'startNumber',
    width: 150,
    align: 'right',
  },
  {
    title: '結尾號碼',
    dataIndex: 'endNumber',
    width: 150,
    align: 'right',
  },
  {
    title: '最後開立發票號碼',
    dataIndex: 'latestInvoiceNumber',
    width: 150,
    align: 'right',
  },
  {
    title: '最後開立發票日期',
    dataIndex: 'latestInvoiceDate',
    width: 150,
    align: 'right',
    render: (value) => getTaiwanDateStr(value),
  },
];

const lookup_month = {
  '1': '1-2',
  '3': '3-4',
  '5': '5-6',
  '7': '7-8',
  '9': '9-10',
  '11': '11-12',
} as const;

export default Selector_invoiceBook;
