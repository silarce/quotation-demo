import { useState, useMemo } from 'react';
import classNames from 'classnames';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';
import { Container_confirm } from 'components/global/container/modal';
import { Checkbox } from 'components/global/gear/dataEntry';

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
  const params = useMemo(() => {
    return { page };
  }, [page]);

  const { data: rawArr, meta } = useGetAccountant({ params });

  const [selected, setSelected] = useState<TaccountantDto>();

  const handle_confirm = () => {
    if (onConfirm) {
      onConfirm(selected);
    }
  };

  return (
    <Container_confirm
      title={title}
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
    width: 180,
  },
  {
    title: '幣別',
    dataIndex: 'currency',
    align: 'center',
    width: 120,
  },
  {
    title: '匯率',
    dataIndex: 'exchangeRate',
    align: 'center',
    width: 80,
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

// ============================================================================
