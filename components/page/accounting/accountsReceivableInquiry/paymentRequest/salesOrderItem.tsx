import Table_antd, { TableProps } from 'components/global/myAntd/table';
import DataEntry, { Input_money } from 'components/global/gear/dataEntry';

import type {
  Tinstance_salesOrderItem,
  Tstate_salesOrderItem,
} from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/hook/useSalesOrderItemArr';

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

  const columns_projectDetail: TableProps<Tstate_salesOrderItem>['columns'] = [
    {
      title: '項目',
      dataIndex: 'itemName',
      width: 200,
      render(_, record) {
        return record.itemName + '　' + record.productName;
      },
    },
    {
      title: '尺寸',
      dataIndex: 'sizeString',
      width: 200,
      align: 'right',
    },
    {
      title: '數量',
      dataIndex: 'quantity',
      width: 100,
      align: 'right',
    },
    {
      title: '合約單價',
      dataIndex: 'unitPrice',
      width: 150,
      align: 'right',
      render: (v) => toLocalString(v),
    },

    {
      title: '前期已完成',
      dataIndex: 'prophaseCompletedQuantity',
      width: 150,
      align: 'right',
    },
    {
      title: '本期完成',
      dataIndex: 'completedQuantity',
      width: 150,
      align: 'right',
      render: (v, record, index) => {
        return (
          <DataEntry showBorder={allowEdit} fontSize={14}>
            <Input_money
              className="text-right"
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
      title: '本期金額',
      dataIndex: 'completedPayment',
      width: 150,
      align: 'right',
      render: (v) => toLocalString(v),
    },
    {
      title: '合計',
      dataIndex: 'totalCompletedQuantity',
      width: 100,
      align: 'right',
    },
    {},
  ];

  return (
    <div>
      <div className="text-xl font-semibold mb-8">項目明細</div>
      <Table_antd
        className={className}
        columns={columns_projectDetail}
        dataSource={stateArr}
        pagination={false}
        scroll={{ y: 400 }}
      />
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
  if (value === null || value === undefined) {
    return '';
  }

  return '$' + value.toLocaleString();
};

// ====================================================================
// ====================================================================

export default SalesOrderItem;
