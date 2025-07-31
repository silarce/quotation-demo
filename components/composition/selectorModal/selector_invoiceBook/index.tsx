import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { Dayjs } from 'dayjs';

import Table_antd, { TableProps, metaToPageProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';
import { Container_confirm } from 'components/global/container/modal';
import DataEntry, { DataEntry_fong, DatePicker } from 'components/global/gear/dataEntry';

import { useGetAccountantInvoiceBook, TaccountantInvoiceBookDto } from 'js/api/api_accountant';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import scss from './index.module.scss';

const Selector_invoiceBook = ({
  title = '發票本選擇',
  onConfirm,
  onCancel,
}: {
  title?: string;
  onConfirm?: (selected: TaccountantInvoiceBookDto | undefined) => void;
  onCancel: () => void;
}) => {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [date_param, setDate_param] = useState<Dayjs | null>(null);

  const [page, setPage] = useState(1);
  const params = useMemo(() => {
    const filter = (() => {
      if (!date_param) {
        return undefined;
      }

      const year = date_param.year();
      let month = date_param.month() + 1;

      if (!(`${month}` in lookup_month)) {
        month = month - 1;
      }

      return {
        year: { $eq: `${year}` },
        month: { $eq: `${month}` },
      };
    })();

    return {
      page,
      filter,
    };
  }, [page, date_param]);

  const { data, meta } = useGetAccountantInvoiceBook({ params });

  const [selected, setSelected] = useState<TaccountantInvoiceBookDto>();

  const handle_confirm = () => {
    onConfirm?.(selected);
  };

  return (
    <Container_confirm
      title={title}
      topRight={
        <div className="flex gap-[16px]">
          <DataEntry_fong>
            <DatePicker
              value={date}
              onChange={(v) => {
                setDate(v);
              }}
            />
          </DataEntry_fong>
          <Btn
            theme="query"
            onClick={() => {
              setDate_param(date);
            }}
          >
            搜索資料
          </Btn>
        </div>
      }
      footerRight={
        <>
          <Btn onClick={onCancel}>取消</Btn>
          <Btn onClick={handle_confirm}>確認</Btn>
        </>
      }
    >
      <Table_antd
        className="w-[940px]"
        dataSource={data}
        columns={columns}
        rowHoverable={false}
        pagination={{
          current: meta?.page,
          pageSize: meta?.pageSize,
          total: meta?.itemCount,
          onChange(page) {
            setPage(page);
          },
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              setSelected(record);
            },
            // className: classNames(' cursor-pointer', selected?.some((item) => item.id === record.id) && 'bg-blue05'),
          };
        }}
        rowClassName={(record) => classNames(scss.row, selected?.id === record.id && scss.active)}
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
