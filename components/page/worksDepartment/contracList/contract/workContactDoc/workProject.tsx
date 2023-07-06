// global gear
import Table01 from 'components/global/gear/HOC/dnd/dndTable01/dndTable01';

// css
import style from './workContactDoc.module.scss';

// icon
import iconDoorRail75 from 'public/image/icon/doorRail/doorRail75.svg';

// type
import { Ttable01, Ttable01Config } from 'components/global/gear/HOC/dnd/dndTable01/dndTable01';
import { TdndCellConfig } from 'config/dndCellConfig';

export default function WorkProject() {
  return (
    <div className={style.workProject}>
      <div className={style.title}>
        <span>工程項目</span>
      </div>

      <div>
        <Table01<TFakeDatakeyIndexN, TFakeDatakeyIndexI> tableData={fakeData} keyIndex={keyIndex} />
      </div>
    </div>
  );
}

// ========================================================
// ========================================================
// ========================================================

type TFakeDatakeyIndexN = keyof Pick<
  TdndCellConfig,
  | 'project'
  | 'L'
  | 'H'
  | 'B'
  | 'doorType'
  | 'material'
  | 'thickness'
  | 'surface'
  | 'openType'
  | 'horsepower'
  | 'qty'
  | 'memo'
>;

type TFakeDatakeyIndexI = keyof Pick<TdndCellConfig, 'doorRail'>;

type TkeyIndex = (TFakeDatakeyIndexN | TFakeDatakeyIndexI)[];

const keyIndex: TkeyIndex = [
  'project',
  'L',
  'H',
  'B',
  'doorType',
  'material',
  'thickness',
  'surface',
  'doorRail',
  'openType',
  'horsepower',
  'qty',
  'memo',
];

const fakeData: Ttable01<TFakeDatakeyIndexN, TFakeDatakeyIndexI> = {
  list: [
    {
      project: {
        value: 'SD1',
      },
      L: {
        value: '516',
      },
      H: {
        value: '230',
      },
      B: {
        value: '45',
      },
      doorType: {
        value: 'SJ-302',
      },
      material: {
        value: '不鏽鋼304#',
      },
      thickness: {
        value: '1.5t',
      },
      surface: {
        value: 'BA',
      },
      doorRail: {
        value: '75',
        icon: iconDoorRail75.src,
      },
      openType: {
        value: '電動',
      },
      horsepower: {
        value: '1/3HP',
      },
      qty: {
        value: '1',
      },
      memo: {
        value: '防颱防颱',
      },
    },
    {
      project: {
        value: 'SD1',
      },
      L: {
        value: '516',
      },
      H: {
        value: '230',
      },
      B: {
        value: '45',
      },
      doorType: {
        value: 'SJ-302',
      },
      material: {
        value: '不鏽鋼304#',
      },
      thickness: {
        value: '1.5t',
      },
      surface: {
        value: 'BA',
      },
      doorRail: {
        value: '75',
        icon: iconDoorRail75.src,
      },
      openType: {
        value: '電動',
      },
      horsepower: {
        value: '1/3HP',
      },
      qty: {
        value: '1',
      },
      memo: {
        value: '防颱防颱',
      },
    },
    {
      project: {
        value: 'SD1',
      },
      L: {
        value: '516',
      },
      H: {
        value: '230',
      },
      B: {
        value: '45',
      },
      doorType: {
        value: 'SJ-302',
      },
      material: {
        value: '不鏽鋼304#',
      },
      thickness: {
        value: '1.5t',
      },
      surface: {
        value: 'BA',
      },
      doorRail: {
        value: '75',
        icon: iconDoorRail75.src,
      },
      openType: {
        value: '電動',
      },
      horsepower: {
        value: '1/3HP',
      },
      qty: {
        value: '1',
      },
      memo: {
        value: '防颱防颱',
      },
    },
    {
      project: {
        value: 'SD1',
      },
      L: {
        value: '516',
      },
      H: {
        value: '230',
      },
      B: {
        value: '45',
      },
      doorType: {
        value: 'SJ-302',
      },
      material: {
        value: '不鏽鋼304#',
      },
      thickness: {
        value: '1.5t',
      },
      surface: {
        value: 'BA',
      },
      doorRail: {
        value: '75',
        icon: iconDoorRail75.src,
      },
      openType: {
        value: '電動',
      },
      horsepower: {
        value: '1/3HP',
      },
      qty: {
        value: '1',
      },
      memo: {
        value: '防颱防颱',
      },
    },
    {
      project: {
        value: 'SD1',
      },
      L: {
        value: '516',
      },
      H: {
        value: '230',
      },
      B: {
        value: '45',
      },
      doorType: {
        value: 'SJ-302',
      },
      material: {
        value: '不鏽鋼304#',
      },
      thickness: {
        value: '1.5t',
      },
      surface: {
        value: 'BA',
      },
      doorRail: {
        value: '75',
        icon: iconDoorRail75.src,
      },
      openType: {
        value: '電動',
      },
      horsepower: {
        value: '1/3HP',
      },
      qty: {
        value: '1',
      },
      memo: {
        value: '防颱防颱',
      },
    },
    {
      project: {
        value: 'SD1',
      },
      L: {
        value: '516',
      },
      H: {
        value: '230',
      },
      B: {
        value: '45',
      },
      doorType: {
        value: 'SJ-302',
      },
      material: {
        value: '不鏽鋼304#',
      },
      thickness: {
        value: '1.5t',
      },
      surface: {
        value: 'BA',
      },
      doorRail: {
        value: '75',
        icon: iconDoorRail75.src,
      },
      openType: {
        value: '電動',
      },
      horsepower: {
        value: '1/3HP',
      },
      qty: {
        value: '1',
      },
      memo: {
        value: '防颱防颱',
      },
    },
    {
      project: {
        value: 'SD1',
      },
      L: {
        value: '516',
      },
      H: {
        value: '230',
      },
      B: {
        value: '45',
      },
      doorType: {
        value: 'SJ-302',
      },
      material: {
        value: '不鏽鋼304#',
      },
      thickness: {
        value: '1.5t',
      },
      surface: {
        value: 'BA',
      },
      doorRail: {
        value: '75',
        icon: iconDoorRail75.src,
      },
      openType: {
        value: '電動',
      },
      horsepower: {
        value: '1/3HP',
      },
      qty: {
        value: '1',
      },
      memo: {
        value: '防颱防颱',
      },
    },
    {
      project: {
        value: 'SD1',
      },
      L: {
        value: '516',
      },
      H: {
        value: '230',
      },
      B: {
        value: '45',
      },
      doorType: {
        value: 'SJ-302',
      },
      material: {
        value: '不鏽鋼304#',
      },
      thickness: {
        value: '1.5t',
      },
      surface: {
        value: 'BA',
      },
      doorRail: {
        value: '75',
        icon: iconDoorRail75.src,
      },
      openType: {
        value: '電動',
      },
      horsepower: {
        value: '1/3HP',
      },
      qty: {
        value: '1',
      },
      memo: {
        value: '防颱防颱',
      },
    },
  ],
};
// const fakeData: Ttable01<TFakeDatakeyIndexN, TFakeDatakeyIndexI> = {
//   list:
//     [{
//       project: {
//         value: "SD1",
//       },
//       doorType: {
//         value: "SJ-302",
//       },
//       doorRail: {
//         value: "75",
//         icon: iconDoorRail75.src,
//       }
//     }],
// }
