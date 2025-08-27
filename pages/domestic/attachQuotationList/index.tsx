import { useRouter } from 'next/router';

import classNames from 'classnames';

import { Pagination } from 'antd';
import Row, { Cell, Tprops_row, Tprops_cell } from 'components/global/gear/table/row';
import { DataEntry_fong, Input } from 'components/global/gear/dataEntry';
import Btn from 'components/global/gear/button/btn_fong';

import scss from './index.module.scss';

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

interface Tcolumns<T extends object> {
  key?: keyof T;
  title?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  //
  render?: (value: any, data: TfakeData, index: number) => React.ReactNode;
}
[];

interface Tquery {
  keyword?: string;
  page?: string;
}

// ===========================================================================

// MARK: START

export default function AttachQuotationList() {
  const router = useRouter();
  const query = router.query;
  const { keyword, page = '1' } = query as Tquery;

  return (
    <div>
      <div className="pageTop flex justify-between items-center">
        <div className="text-xl font-semibold">追加追減報價單</div>
        <form
          className="flex gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const keyword = e.currentTarget.keyword.value;
            router.replace({
              query: {
                ...query,
                keyword,
                page: 1,
              },
            });
          }}
        >
          <DataEntry_fong>
            <Input defaultValue={keyword ?? ''} name="keyword" autoComplete="off" />
          </DataEntry_fong>

          <Btn theme="query">搜尋</Btn>
        </form>
      </div>

      <div className={scss.table}>
        <TheRow fullWidth={true} className={scss.thead}>
          {columns.map((col) => {
            const { title, key, className, style } = col;

            return (
              <TheCell key={key} className={className} style={style}>
                {title}
              </TheCell>
            );
          })}
        </TheRow>

        {fakeData.map((data) => (
          <TheRow key={data.id} fullWidth={true}>
            {columns.map((col, kIndex) => {
              const { key, className, style, render } = col;

              const value = key ? data[key] : undefined;

              return (
                <TheCell key={key || kIndex} className={className} style={style}>
                  {render ? render(value, data, kIndex) : value}
                </TheCell>
              );
            })}
          </TheRow>
        ))}
      </div>
      <br />
      <Pagination
        current={Number(page)}
        total={330}
        pageSize={10}
        align={'center'}
        hideOnSinglePage={true}
        showSizeChanger={false}
        onChange={(v) => {
          router.replace({
            query: {
              ...query,
              page: v,
            },
          });
        }}
      />
    </div>
  );
}

// MARK: END

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

const columns: Tcolumns<TfakeData>[] = [
  {
    title: '報價日期',
    key: 'quotationDate',
    className: 'w-[120px] ',
    style: { justifyContent: 'flex-start' },
    render: (value, data) => <span>{data.quotationDate}</span>,
  },
  {
    title: '專案名稱',
    key: 'projectName',
    className: 'w-[300px] ',
    style: { justifyContent: 'flex-start' },
  },
  {
    title: '客戶名稱',
    key: 'customerName',
    className: 'w-[150px] ',
    style: { justifyContent: 'flex-start' },
  },
  {
    title: '追加數量',
    key: 'quantity',
    className: 'w-[100px] ',
    style: { justifyContent: 'flex-start' },
  },
  {
    title: '追蹤狀態',
    key: 'trackProgress',
    className: 'w-[120px] ',
    style: { justifyContent: 'flex-start' },
  },
  {
    title: '工地進度',
    key: 'projectProgress',
    className: 'w-[120px] ',
    style: { justifyContent: 'flex-start' },
  },
];

// ================================================================================

const TheRow = ({ className, ...props }: Tprops_row) => <Row className={classNames(className, scss.row)} {...props} />;

const TheCell = ({ className, ...props }: Tprops_cell) => (
  <Cell className={classNames(className, scss.cell)} {...props} />
);
