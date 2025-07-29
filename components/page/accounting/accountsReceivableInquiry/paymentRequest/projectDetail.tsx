import Table_antd, { TableProps } from 'components/global/myAntd/table';

import type { Tres_apiGetARPaymentData } from 'js/api/api_netCore/api_accountsReceivable';

// =============================================================================

type TdataArr = Tres_apiGetARPaymentData['salesOrder']['salesOrderItems'];

// =============================================================================

const ProjectDetail = ({ data, className }: { data: TdataArr | undefined; className?: string }) => {
  return <Table_antd className={className} columns={columns_projectDetail} dataSource={data} />;
};

const columns_projectDetail: TableProps<TdataArr[number]>['columns'] = [
  {
    title: '項目',
    dataIndex: 'itemNumber',
    width: 80,
  },
  {
    title: '尺寸',
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
    title: '前期以完成',
    dataIndex: 'completedInLastPeriod',
    width: 150,
    render: () => 'no property',
  },
  {
    title: '本期完成',
    dataIndex: 'completedInThisPeriod',
    width: 150,
    render: () => 'no property',
  },
  {
    title: '本期金額',
    dataIndex: 'amount',
    width: 150,
  },
  {
    title: '合計',
    dataIndex: 'totalAmount',
    width: 100,
    render: () => 'no property',
  },
  {},
];

export default ProjectDetail;
