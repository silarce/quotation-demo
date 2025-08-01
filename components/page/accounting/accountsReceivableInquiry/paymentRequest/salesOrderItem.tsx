import Table_antd, { TableProps } from 'components/global/myAntd/table';
import DataEntry, { Input_money } from 'components/global/gear/dataEntry';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

import { Tinstance_salesOrderItem } from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/hook/useSalesOrderItemArr';

// =============================================================================

type TsalesOrderItemArr = Tres_apiGetARPaymentData['salesOrder']['salesOrderItems'];

type TsalesOrderItem = TsalesOrderItemArr[number];

type Tstate = TsalesOrderItem & {
  completedQuantity: `${number}` | ''; // 待api新增本期完成的property
  completedPayment: number | null; // 待api新增本期完成的property
};

// =============================================================================

// MARK: START

const SalesOrderItem = ({
  allowEdit = false,
  className,
  instance_salesOrderItem,
}: {
  allowEdit?: boolean;
  className?: string;
  instance_salesOrderItem: Tinstance_salesOrderItem;
}) => {
  const { stateArr, setCompletedInThisPeriod } = instance_salesOrderItem;

  const columns_projectDetail: TableProps<Tstate>['columns'] = [
    {
      title: '項目',
      dataIndex: 'itemNumber',
      width: 80,
    },
    {
      title: '尺寸 noProperty',
      dataIndex: 'size',
      width: 200,
      render: () => 'no property',
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      width: 100,
    },
    {
      title: '合約單價',
      dataIndex: 'unitPrice',
      width: 150,
    },
    {
      title: '前期已完成 noProperty',
      dataIndex: 'completedInLastPeriod',
      width: 150,

      render: () => 'no property',
    },
    {
      title: '本期完成 noProperty',
      dataIndex: 'completedQuantity',
      width: 150,
      render: (v, record, index) => {
        return (
          <DataEntry showBorder={allowEdit} fontSize={14}>
            <Input_money
              readOnly={!allowEdit}
              value={v}
              onChange={(e) => {
                setCompletedInThisPeriod(index, e.target.value as `${number}` | '');
              }}
            />
          </DataEntry>
        );
      },
    },
    {
      title: '本期金額 noProperty',
      dataIndex: 'completedPayment',
      width: 150,
      align: 'right',
      render: (v) => toLocalString(v),
    },
    {
      title: '合計 noProperty',
      dataIndex: 'totalAmount',
      width: 100,
    },
    {},
  ];

  return (
    <div>
      <div className="text-xl font-semibold mb-8">項目明細</div>
      <Table_antd className={className} columns={columns_projectDetail} dataSource={stateArr} />
    </div>
  );
};

// MARK: END
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

const toLocalString = (value: number | null) => {
  if (value === null) {
    return '';
  }

  return '$' + value.toLocaleString();
};

// ====================================================================
// ====================================================================

export default SalesOrderItem;
