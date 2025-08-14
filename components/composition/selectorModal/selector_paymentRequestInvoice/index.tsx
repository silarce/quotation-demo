import { useState } from 'react';
import classNames from 'classnames';

import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Btn from 'components/global/gear/button/btn_fong';
import { Container_confirm } from 'components/global/container/modal';

import {
  TpaymentRequestInvoiceList_Dto,
  useApiGetPaymentRequestInvoiceList,
} from 'js/api/api_netCore/api_accountsReceivable';

const Selector_paymentRequest_invoice = ({
  title = '選擇請款單',
  onConfirm,
  onCancel,
}: {
  title?: string;
  onConfirm?: (selected: TpaymentRequestInvoiceList_Dto | undefined) => void;
  onCancel: () => void;
}) => {
  const { data } = useApiGetPaymentRequestInvoiceList();

  const [selected, setSelected] = useState<TpaymentRequestInvoiceList_Dto | undefined>();

  const handle_confirm = () => {
    onConfirm?.(selected);
  };

  return (
    <div>
      <Container_confirm
        title={title}
        footerRight={
          <>
            <Btn onClick={onCancel}>取消</Btn>
            <Btn themeColor="blue_I" onClick={handle_confirm}>
              確認
            </Btn>
          </>
        }
      >
        <Table_antd
          rowHoverable={false}
          className="w-[1400px]"
          dataSource={data ?? []}
          columns={columns}
          rowClassName={(record) => classNames('cursor-pointer', record.id === selected?.id && ' bg-blue05')}
          onRow={(record) => ({
            onClick: () => {
              setSelected(record);
            },
          })}
          scroll={{
            x: 1400,
            y: 400,
          }}
          pagination={false}
        />
      </Container_confirm>
    </div>
  );
};
// =============================================================================

const columns: TableProps<TpaymentRequestInvoiceList_Dto>['columns'] = [
  {
    title: '請款單編號',
    dataIndex: 'paymentRequestNumber',
    width: 150,
  },
  {
    title: '報價單編號',
    dataIndex: 'quotationNumber',
    width: 150,
  },
  {
    title: '合約編號',
    dataIndex: 'contractNumber',
    width: 150,
  },
  {
    title: '案場名稱',
    dataIndex: 'constructionSite',
    width: 300,
  },
  {
    title: '客戶編號',
    dataIndex: 'customerNumber',
    width: 100,
  },
  {
    title: '客戶名稱',
    dataIndex: 'customerName',
    width: 200,
  },
  {
    title: '統一編號',
    dataIndex: 'taxId',
    width: 100,
  },
  {
    title: '期別',
    dataIndex: 'period',
    width: 60,
    align: 'center',
  },
  {
    title: '請款單類型',
    dataIndex: 'type',
    width: 100,
    align: 'center',
  },
  {
    title: '分類期別',
    dataIndex: 'typePeriod',
    width: 80,
  },
  {
    title: '幣別',
    dataIndex: 'paymentCurrency',
    width: 120,
  },
  {
    title: '請款金額',
    dataIndex: 'paymentAmount',
    width: 120,
    align: 'right',
    render: (v) => (v === null ? '' : '$' + v?.toLocaleString()),
  },
];

export default Selector_paymentRequest_invoice;

export type { TpaymentRequestInvoiceList_Dto };
