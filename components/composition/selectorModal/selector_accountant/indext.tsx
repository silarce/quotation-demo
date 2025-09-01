import { useState, useMemo } from 'react';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';
import { Container_confirm } from 'components/global/container/modal';
import { Checkbox } from 'components/global/gear/dataEntry';
import { DataEntry_fong, DatePicker, Select } from 'components/global/gear/dataEntry';

// api
import { useGetAccountant, TaccountantDto } from 'js/api/api_accountant';

import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

/**選擇器-會計收款 */
export default function Selector_accountant({
  title = '會計收款列表',
  onConfirm,
  onCancel,
  btn_confirm,
}: {
  title?: string;
  onConfirm?: (data: TaccountantDto | undefined) => void;
  onCancel?: () => void;
  btn_confirm?: (data: TaccountantDto | undefined) => React.ReactNode;
}) {
  const [page, setPage] = useState(1);

  const [paymentType, setPaymentType] = useState<TaccountantDto['paymentType']>();
  const [insertDate, setInsertDate] = useState<Dayjs | null>(null);

  const [searchObj, setSearchObj] = useState<{ paymentType?: string; insertDate?: Dayjs | null }>({});

  const params = useMemo(() => {
    return {
      page,

      filter: {
        paymentType: {
          $eq: searchObj.paymentType || undefined,
        },
        insertDate: {
          $gte: searchObj.insertDate?.startOf('month').toISOString(),
          $lte: searchObj.insertDate?.endOf('month').toISOString(),
        },
      },
    };
  }, [page, searchObj]);

  const { data: rawArr, meta } = useGetAccountant({ params });

  const [selected, setSelected] = useState<TaccountantDto>();

  const handle_confirm = () => {
    if (onConfirm) {
      onConfirm(selected);
    }
  };

  const handle_search = () => {
    const newSearchObj = {
      paymentType: paymentType,
      insertDate: insertDate,
    };
    setSearchObj(newSearchObj);
    setPage(1);
  };

  return (
    <Container_confirm
      title={title}
      topRight={
        <form
          className="flex gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handle_search();
          }}
        >
          <DataEntry_fong>
            <Select
              placeholder="付款方式"
              className="w-24"
              options={options}
              value={paymentType}
              onChange={(value) => setPaymentType(value)}
            />
          </DataEntry_fong>

          <DataEntry_fong>
            <DatePicker
              placeholder="匯入日期"
              value={insertDate}
              onChange={(date) => setInsertDate(date)}
              picker="month"
              format={(djs) => {
                let dateStr = getTaiwanDateStr(djs);
                const arr = dateStr.split('-');
                dateStr = arr[0] + '-' + arr[1];

                return dateStr;
              }}
            />
          </DataEntry_fong>

          <Btn theme="query">搜尋</Btn>
        </form>
      }
      footerRight={
        <>
          <Btn onClick={onCancel}>取消</Btn>

          {btn_confirm && btn_confirm(selected)}
          {!btn_confirm && (
            <Btn theme="save" onClick={handle_confirm}>
              儲存
            </Btn>
          )}
        </>
      }
    >
      <div className="mt-5">
        <Table_antd
          className="w-[1420px]"
          columns={columns}
          dataSource={rawArr}
          rowHoverable={false}
          scroll={{
            x: 1400,
            y: 400,
          }}
          rowClassName={(record) => {
            return classNames('cursor-pointer', record === selected && 'bg-blue05');
          }}
          onRow={(record) => ({
            onClick: () => {
              setSelected(record);
            },
          })}
          pagination={{
            current: meta?.page,
            pageSize: meta?.pageSize,
            total: meta?.itemCount,
            onChange(page) {
              setPage(page);
            },
          }}
        />
      </div>
    </Container_confirm>
  );
}

// ============================================================================

const columns: TableProps<TaccountantDto>['columns'] = [
  {
    title: <span className="whitespace-pre-wrap">{'已匯入紙本\n應收帳款'}</span>,
    dataIndex: 'isImported',
    align: 'center',
    width: 120,
    render: (value) => (
      <div className="flex items-center justify-center">
        <Checkbox checked={value} disabled={true} />
      </div>
    ),
  },
  {
    title: '付款類型',
    dataIndex: 'paymentType',
    align: 'center',
    width: 80,
  },
  {
    title: '匯入日期',
    dataIndex: 'insertDate',
    width: 120,
    render: (value) => getTaiwanDateStr(value),
  },
  {
    title: '付款帳號',
    dataIndex: 'importAccountingNumber',
    width: 150,
  },
  {
    title: '存入帳號',
    dataIndex: 'accountingNumber',
    width: 200,
  },
  {
    title: '廠商名稱',
    dataIndex: 'vendorName',
  },
  {
    title: '幣別',
    dataIndex: 'currency',
    width: 120,
  },
  {
    title: '匯率',
    dataIndex: 'exchangeRate',
    align: 'right',
    width: 70,
  },
  {
    title: '金額',
    dataIndex: 'currencyValue',
    align: 'right',
    width: 120,
    render: (value) => '$' + Number(value).toLocaleString(),
  },
  {
    title: '新臺幣',
    dataIndex: 'price',
    align: 'right',
    width: 120,
    render: (value) => '$' + value.toLocaleString(),
  },
];

// export type TaccountantPaymentType = '匯款' | '票據' | '現金';

const options: {
  value: TaccountantDto['paymentType'];
  label: TaccountantDto['paymentType'];
}[] = [
  { value: '匯款', label: '匯款' },
  { value: '票據', label: '票據' },
  { value: '現金', label: '現金' },
];

// ============================================================================

export type { TaccountantDto };
