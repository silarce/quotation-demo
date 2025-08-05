import { useState } from 'react';
import classNames from 'classnames';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';
import { Container_confirm } from 'components/global/container/modal';

import { useApiGetInvoiceNumberLists, Tinvoice_Dto } from 'js/api/api_netCore/api_invoice';

const Selector_invoice = ({
  //
  onConfirm,
  onCancel,
  title = '發票號碼選擇',
  invoiceBookId,
}: {
  onConfirm?: (selected: Tinvoice_Dto | undefined) => void;
  onCancel: () => void;
  title?: string;
  invoiceBookId: string;
}) => {
  const { data } = useApiGetInvoiceNumberLists(invoiceBookId);

  const [selected, setSelected] = useState<Tinvoice_Dto | undefined>();

  const handle_confirm = () => {
    onConfirm?.(selected);
  };

  const handle_cancel = () => {
    onCancel();
  };

  return (
    <Container_confirm
      title={title}
      footerRight={
        <>
          <Btn onClick={handle_cancel}>取消</Btn>
          <Btn themeColor="blue_I" onClick={handle_confirm}>
            確認
          </Btn>
        </>
      }
    >
      <Table_antd
        rowKey={'fullInvoiceNumber'}
        rowHoverable={false}
        className="w-[1000px]"
        dataSource={data ?? []}
        columns={columns}
        rowClassName={(record) =>
          classNames('cursor-pointer', record.fullInvoiceNumber === selected?.fullInvoiceNumber && ' bg-blue05')
        }
        onRow={(record) => ({
          onClick: () => {
            setSelected(record);
          },
        })}
        scroll={{
          y: 400,
        }}
        pagination={false}
      />
    </Container_confirm>
  );
};

// =======================================================================

const columns: TableProps<Tinvoice_Dto>['columns'] = [
  {
    title: '發票號碼',
    dataIndex: 'fullInvoiceNumber',
    width: 120,
  },
  {
    title: '買方',
    dataIndex: 'buyer',
    width: 200,
  },
  {
    title: '統一編號',
    dataIndex: 'taxId',
    width: 100,
  },
  {
    title: '專案名稱',
    dataIndex: 'projectName',
    width: 200,
  },
  {
    title: '發票金額',
    dataIndex: 'invoiceAmount',
    width: 100,
    align: 'right',
    render: (value) => toLocaleString(value),
  },
  {
    title: '稅額',
    dataIndex: 'invoiceTaxes',
    width: 100,
    align: 'right',
    render: (value) => toLocaleString(value),
  },
  {
    title: '總金額',
    dataIndex: 'totalAmount',
    width: 100,
    align: 'right',
    render: (value) => toLocaleString(value),
  },
];

const toLocaleString = (value: number | null) => {
  if (value === null) {
    return '';
  }

  return '$' + value.toLocaleString();
};

// =======================================================================
export default Selector_invoice;
