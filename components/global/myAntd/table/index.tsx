import classNames from 'classnames';

import { Table, TableProps } from 'antd';

import scss from './index.module.scss';

import type { TpageMetaDto } from 'js/api/dtoTypes';
import type { Tmeta } from 'js/api/api_netCore/_schemas';

// ===========================================================================

// 未避免TpageMetaDto或Tmeta被修改而發生問題

// 1. 定義一個包含所有必要屬性的基礎型別
type TRequiredPageInfo = {
  itemCount: number;
  page: number;
  pageSize: number;
};

// 2. 建立一個輔助型別，如果 T 符合 TRequiredPageInfo 的形狀，就回傳 T，否則報錯
//    這個技巧可以讓 TypeScript 在型別不匹配時，提供更易讀的錯誤訊息。
type TAssertHasPageInfo<T extends TRequiredPageInfo> = T;

// 3. 在合併型別前，先用輔助型別對 TpageMetaDto 和 Tmeta 進行斷言
type TpageInfo = Pick<TAssertHasPageInfo<TpageMetaDto> & TAssertHasPageInfo<Tmeta>, 'itemCount' | 'page' | 'pageSize'>;

// ===========================================================================

function Table_antd<T>({ className, pagination, ...props }: TableProps<T>) {
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

// ==========================================================================

const metaToPageProps = (meta: TpageInfo): TableProps['pagination'] => {
  const { itemCount, page, pageSize } = meta;

  return {
    current: page,
    total: itemCount,
    pageSize: pageSize,
  };
};

// ==========================================================================

export type { TableProps };

export default Table_antd;
export { metaToPageProps };
