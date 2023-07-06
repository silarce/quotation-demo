import { CSSProperties } from 'react';

// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// css
import scss from './productList_Table.module.scss';

// fake
import { TfakeData } from 'pages/setting/productList';

export default function ProductList_Table({
  fakeData,
  doFilter,
}: {
  fakeData: TfakeData[];
  doFilter: (data: TfakeData) => boolean;
}) {
  return (
    <div className={scss.table}>
      <div className={scss.thead}>
        {keyIndex.map((key, index) => {
          const { label, style } = config[key];

          return (
            <div className={scss.column} key={index} style={style}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      <div className={scss.tbody}>
        {fakeData.map((obj, index) => {
          if (!doFilter(obj)) {
            return null;
          }

          return (
            <CellWithBar className={scss.row} key={index}>
              {keyIndex.map((key, index) => {
                const { style } = config[key];
                const data = obj[key];

                return (
                  <div className={scss.column} key={index} style={style}>
                    <span>{data}</span>
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

// ===============================================================================

type TkeyIndex = keyof Omit<TfakeData, 'prodClass'>;

const keyIndex: TkeyIndex[] = [
  'doorType',
  'part',
  'name',
  // "breach",
  'length',
  'caliber',
  'thickness',
  'expandHeight',
  'densityRatio',
];

type Tconfig = {
  [key in TkeyIndex]: {
    label: string;
    style?: CSSProperties;
  };
};

const config: Tconfig = {
  doorType: {
    label: '門型',
    style: { width: '90px' },
  },
  part: {
    label: '類型',
    style: { width: '180px' },
  },
  name: {
    label: '名稱',
    style: {
      width: 'auto',
      flex: 'auto',
    },
  },
  // breach: {
  //   label: "底座角鐵開口",
  //   style: {
  //     width: "auto",
  //     flex: "auto"
  //   }
  // },
  length: {
    label: '長度mm',
    style: { width: '65px' },
  },
  caliber: {
    label: '口徑',
    style: { width: '60px' },
  },
  thickness: {
    label: '厚度',
    style: { width: '60px' },
  },
  expandHeight: {
    label: '展開門片高',
    style: { width: '95px' },
  },
  densityRatio: {
    label: '密度比',
    style: { width: '60px' },
  },
};
