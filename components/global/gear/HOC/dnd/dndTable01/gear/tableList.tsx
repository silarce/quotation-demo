import { Dispatch, SetStateAction } from 'react';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// css
import style from '../dndTable01.module.scss';

// type
import { Ttable01, Ttable01Config } from '../dndTable01';
import { TdndCellConfigKeys, dndCellConfigOri } from 'config/dndCellConfig';
const dndCellConfig = dndCellConfigOri();

export default function TableList<N extends TdndCellConfigKeys, I extends TdndCellConfigKeys>({
  tableData,
  theadIndex,
}: {
  tableData: Ttable01<N, I>;
  theadIndex: (N | I)[];
}) {
  const { list } = tableData;

  return (
    <div className={style.tableList}>
      {list.map((item, rowIndex) => {
        return (
          <CellWithBar key={rowIndex}>
            <div className={style.row}>
              <div className={`${style.column} ${style.rowIndex}`}>
                <span>{rowIndex + 1}</span>
              </div>
              {theadIndex.map((key, columnIndex) => {
                const { width, id, position } = dndCellConfig[key];
                const { value, icon } = item[key];
                const theStyle = { width };
                const textCenter = position === 'center' ? style.textCenter : '';

                return (
                  <div className={`${style.column} ${textCenter}`} key={key} style={theStyle}>
                    {/*  eslint-disable-next-line @next/next/no-img-element */}
                    {icon && <img src={icon} alt="" />}
                    <span>{value}</span>
                  </div>
                );
              })}
            </div>
          </CellWithBar>
        );
      })}
    </div>
  );
}
