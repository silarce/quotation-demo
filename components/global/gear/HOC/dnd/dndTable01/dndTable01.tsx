import { useState } from 'react';

// gear
import DndThead from './gear/dndThead';
import TableList from './gear/tableList';

// css
import style from './dndTable01.module.scss';

// type
import { TdndCellConfigKeys } from 'config/dndCellConfig';

export default function Table01<N extends TdndCellConfigKeys, I extends TdndCellConfigKeys>({
  tableData,
  keyIndex,
  className = '',
}: {
  tableData: Ttable01<N, I>;
  keyIndex: (N | I)[];
  className?: string;
}) {
  const [theadIndex, setTheadIndex] = useState<(N | I)[]>(keyIndex);

  const [allowMove, setAllowMove] = useState(false);

  return (
    <div className={`${style.table01} ${className}`}>
      <div className={style.header}>
        <h2>主產品設定</h2>
        <button className={(allowMove && style.active) || ''} onClick={() => setAllowMove((state) => !state)}>
          {allowMove ? '確定排序' : '設定排序'}
        </button>
      </div>
      <DndThead<N, I> allowMove={allowMove} theadIndex={theadIndex} setTheadIndex={setTheadIndex} />
      <TableList<N, I> theadIndex={theadIndex} tableData={tableData} />
    </div>
  );
}

// =========================================================
// =========================================================
// =========================================================
type Ttable01<N extends TdndCellConfigKeys, I extends TdndCellConfigKeys> = {
  list: ({
    [key in N]: {
      value: string;
    };
  } & {
    [key in I]: {
      value: string;
      icon: string;
    };
  })[];
};

// type Ttable01Config<keys extends string> = {
//   keyIndex: keys[]
type Ttable01Config<N extends TdndCellConfigKeys, I extends TdndCellConfigKeys> = {
  keyIndex: (N | I)[];
  config: {
    [key in N | I]: {
      id: key;
      label: string;
      width: string;
    };
  };
};

export type { Ttable01, Ttable01Config };
