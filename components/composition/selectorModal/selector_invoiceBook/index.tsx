import { useState, useMemo } from 'react';
import classNames from 'classnames';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';
import { Container_confirm } from 'components/global/container/modal';
import { DataEntry_fong, Select } from 'components/global/gear/dataEntry';

import { Tparams, useGetAccountantInvoiceBook, TaccountantInvoiceBookDto } from 'js/api/api_accountant';

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
  const [page, setPage] = useState(1);

  const [state_year, setState_year] = useState<`${number}` | null>(null);
  const [state_month, setState_month] = useState<`${number}` | null>(null);
  const [yearMonth, setYearMonth] = useState<{
    year: `${number}` | null;
    month: `${number}` | null;
  }>();

  const params: Tparams = useMemo(() => {
    const filter = (() => {
      const year = yearMonth?.year || undefined;
      const month = yearMonth?.month || undefined;

      return {
        year: { $eq: year },
        month: { $eq: month },
      };
    })();

    return {
      sort: 'createdAt',
      order: 'DESC',
      page,
      filter,
    };
  }, [yearMonth, page]);

  const { data, meta } = useGetAccountantInvoiceBook({ params });

  const [selected, setSelected] = useState<TaccountantInvoiceBookDto>();

  const handle_search = () => {
    setYearMonth({
      year: state_year,
      month: state_month,
    });
    setPage(1);
  };

  const handle_confirm = () => {
    onConfirm?.(selected);
  };

  return (
    <Container_confirm
      title={title}
      topRight={
        <div className="flex gap-[16px]">
          <DataEntry_fong className="w-[100px]">
            <Select
              options={options_year}
              value={state_year}
              onChange={(value) => {
                setState_year(value);
              }}
              placeholder="選擇年分"
            />
          </DataEntry_fong>
          <DataEntry_fong className="w-[100px]">
            <Select
              options={options_month}
              value={state_month}
              onChange={(value) => {
                setState_month(value);
              }}
            />
          </DataEntry_fong>
          <Btn
            theme="query"
            onClick={() => {
              handle_search();
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
  {},
  // {
  //   title: '最後開立發票號碼',
  //   dataIndex: 'latestInvoiceNumber',
  //   width: 150,
  //   align: 'right',
  // },
  // {
  //   title: '最後開立發票日期',
  //   dataIndex: 'latestInvoiceDate',
  //   width: 150,
  //   align: 'right',
  //   render: (value) => getTaiwanDateStr(value),
  // },
];

const lookup_month = {
  '1': '1-2',
  '3': '3-4',
  '5': '5-6',
  '7': '7-8',
  '9': '9-10',
  '11': '11-12',
} as const;

const thisYear = new Date().getFullYear();
const options_year = Array.from({ length: 10 }).map((_, index) => {
  return {
    label: `${thisYear - index - 1911}年`,
    value: thisYear - index,
  };
});

const options_month = [
  {
    value: '1',
    label: '1-2',
  },
  {
    value: '3',
    label: '3-4',
  },
  {
    value: '5',
    label: '5-6',
  },
  {
    value: '7',
    label: '7-8',
  },
  {
    value: '9',
    label: '9-10',
  },
  {
    value: '11',
    label: '11-12',
  },
];

export default Selector_invoiceBook;
