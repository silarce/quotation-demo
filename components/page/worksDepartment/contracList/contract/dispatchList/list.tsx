// global
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// css
import style from './dispatchList.module.scss';

type Tdispatch_simple = {
  dispatchDate: string;
  workerName: string;
  tasks: string;
};

export type { Tdispatch_simple };
// ===========================================================

export default function List({ list }: { list: Tdispatch_simple[] }) {
  return (
    <div className={style.list}>
      <div className={style.thead}>
        {indexKeys01.map((key, index) => {
          const { label } = config01[key];

          return (
            <div key={index}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      <div className={style.tbody}>
        {list.map((item, index) => {
          return (
            <CellWithBar className={style.row} key={index}>
              {indexKeys01.map((key, index) => {
                const value = item[key];

                return (
                  <div key={index}>
                    <span>{value}</span>
                  </div>
                );
              })}
            </CellWithBar>
          );
        })}
      </div>
    </div>
  );
}

// ==================================================

type TindexKey01 = keyof Pick<Tdispatch_simple, 'dispatchDate' | 'workerName' | 'tasks'>;

const indexKeys01: TindexKey01[] = ['dispatchDate', 'workerName', 'tasks'];

type Tconfig<keys extends string> = {
  [key in keys]: {
    label: string;
  };
};

const config01: Tconfig<TindexKey01> = {
  dispatchDate: {
    label: '日期',
  },
  workerName: {
    label: '工務人員',
  },
  tasks: {
    label: '辦理事項',
  },
};
