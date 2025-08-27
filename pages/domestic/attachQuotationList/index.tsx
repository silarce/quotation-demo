// import Table_antd, { TableProps } from 'components/global/myAntd/table';
import Row, { Cell } from 'components/global/gear/table/row';

// ===========================================================================

interface TfakeData {
  id: string;
  quotationDate: string;
  projectName: string;
  customerName: string;
  quantity: number;

  trackProgress: string; // 追蹤狀態
  projectProgress: string; //工地進度
}

interface TcolumnsItem<T extends object> {
  key?: keyof T;
  title?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  render?: (value: any, data: TfakeData) => React.ReactNode;
}

// interface Tcolumns<T extends object> {
//   [key in keyof T]: TcolumnsItem<T>;
// }

// ===========================================================================
export default function AttachQuotationList() {
  return (
    <div>
      <div className="pageTop">
        <div className="text-xl font-semibold">追加追減報價單</div>
      </div>

      <div>
        <Row fullWidth={true}>
          {columns.map((col, index) => {
            const { title, key, className, render } = col;

            return (
              <Cell key={key} className={className}>
                {title}
              </Cell>
            );
          })}
        </Row>

        {fakeData.map((data, index) => (
          <Row key={index} fullWidth={true}>
            {columns.map((col, index) => {
              const { title, key, className, render } = col;

              const value = key ? data[key] : undefined;

              return (
                <Cell key={key || index} className={className}>
                  {render ? render(value, data) : value}
                </Cell>
              );
            })}
          </Row>
        ))}
      </div>
    </div>
  );
}

// ================================================================================

const fakeData: TfakeData[] = [
  {
    id: '1',
    quotationDate: '2024-05-01',
    projectName: '新北市林口區某某路住宅大樓新建工程',
    customerName: '王小明',
    quantity: 1,
    trackProgress: '已完成',
    projectProgress: '基礎工程',
  },
  {
    id: '2',
    quotationDate: '2024-05-03',
    projectName: '台北市信義區某某街辦公大樓新建工程',
    customerName: '李小華',
    quantity: 2,
    trackProgress: '進行中',
    projectProgress: '結構工程',
  },
  {
    id: '3',
    quotationDate: '2024-05-05',
    projectName: '台中市西屯區某某路商業大樓新建工程',
    customerName: '陳大文',
    quantity: 1,
    trackProgress: '未開始',
    projectProgress: '規劃設計',
  },
];

// ==============================================================================

// const columns: Tcolumns<TfakeData>[] = [
//   {
//     title: '報價日期',
//     key: 'quotationDate',
//     className: 'w-[120px] border',
//     // render: (record) => <span>{record.quotationDate}</span>,
//   },
//   {
//     title: '專案名稱',
//     key: 'projectName',
//     className: 'w-[300px] border',
//     // render: (record) => <span>{record.projectName}</span>,
//   },
//   {
//     title: '客戶名稱',
//     key: 'customerName',
//     className: 'w-[150px] border',
//     // render: (record) => <span>{record.customerName}</span>,
//   },
//   {
//     title: '追加數量',
//     key: 'quantity',
//     className: 'w-[100px] border',
//     // render: (record) => <span>{record.quantity}</span>,
//   },
//   {
//     title: '追蹤狀態',
//     key: 'trackProgress',
//     className: 'w-[120px] border',
//     // render: (record) => <span>{record.trackProgress}</span>,
//   },
//   {
//     title: '工地進度',
//     key: 'projectProgress',
//     className: 'w-[120px] border',
//     // render: (record) => <span>{record.projectProgress}</span>,
//   },
// ];
const columns: TcolumnsItem<TfakeData>[] = [
  {
    title: '報價日期',
    key: 'quotationDate',
    className: 'w-[120px] border',
    // render: (record) => <span>{record.quotationDate}</span>,
  },
  {
    title: '專案名稱',
    key: 'projectName',
    className: 'w-[300px] border',
    // render: (record) => <span>{record.projectName}</span>,
  },
  {
    title: '客戶名稱',
    key: 'customerName',
    className: 'w-[150px] border',
    // render: (record) => <span>{record.customerName}</span>,
  },
  {
    title: '追加數量',
    key: 'quantity',
    className: 'w-[100px] border',
    // render: (record) => <span>{record.quantity}</span>,
  },
  {
    title: '追蹤狀態',
    key: 'trackProgress',
    className: 'w-[120px] border',
    // render: (record) => <span>{record.trackProgress}</span>,
  },
  {
    title: '工地進度',
    key: 'projectProgress',
    className: 'w-[120px] border',
    // render: (record) => <span>{record.projectProgress}</span>,
  },
];
