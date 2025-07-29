import Table_antd, { TableProps } from 'components/global/myAntd/table';

const ProjectDetail = ({
  className,
}: {
  className?: string;
} = {}) => {
  return <Table_antd className={className} columns={columns_projectDetail} dataSource={fakeData_projectDetail} />;
};

interface TfakeData_projectDetail {
  id: string;
  itemName: string;
  size: string;
  qty: number;
  productPrice: number;
  completedInLastPeriod: number;
  completedInThisPeriod: number;
  amountInthisPeriod: number;
  totalAmount: number;
}

const columns_projectDetail: TableProps<TfakeData_projectDetail>['columns'] = [
  {
    title: '項目',
    dataIndex: 'itemName',
    width: 80,
  },
  {
    title: '尺寸',
    dataIndex: 'size',
    width: 200,
  },
  {
    title: '數量',
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '合約單價',
    dataIndex: 'productPrice',
    width: 150,
  },
  {
    title: '前期以完成',
    dataIndex: 'completedInLastPeriod',
    width: 150,
  },
  {
    title: '本期完成',
    dataIndex: 'completedInThisPeriod',
    width: 150,
  },
  {
    title: '本期金額',
    dataIndex: 'amountInthisPeriod',
    width: 150,
  },
  {
    title: '合計',
    dataIndex: 'totalAmount',
    width: 100,
  },
  {},
];

const fakeData_projectDetail: TfakeData_projectDetail[] = [
  {
    id: '1',
    itemName: '項目A',
    size: '10x10',
    qty: 5,
    productPrice: 1000,
    completedInLastPeriod: 2000,
    completedInThisPeriod: 3000,
    amountInthisPeriod: 5000,
    totalAmount: 7000,
  },
  {
    id: '2',
    itemName: '項目B',
    size: '20x20',
    qty: 3,
    productPrice: 1500,
    completedInLastPeriod: 4500,
    completedInThisPeriod: 6000,
    amountInthisPeriod: 7500,
    totalAmount: 12000,
  },
];

export default ProjectDetail;
