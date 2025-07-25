import classNames from 'classnames';

import { Table, TableProps } from 'antd';

import scss from './index.module.scss';

export default function Table_antd<T>({ className, pagination, ...props }: TableProps<T>) {
  return (
    <Table
      className={classNames(scss.table, className)}
      rowKey={'id'}
      sticky={true}
      pagination={
        pagination !== false && {
          position: ['bottomCenter'],
          hideOnSinglePage: true,
          showTotal: (total, range) => {
            return `總計 ${total} 項`;
          },
          showSizeChanger: false,
          ...pagination,
        }
      }
      {...props}
    />
  );
}

export type { TableProps };
