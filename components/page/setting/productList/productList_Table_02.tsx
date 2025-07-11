import classNames from 'classnames';
import Image from 'next/image';
// gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

import scss from './productList_Table_02.module.scss';

// icon
import iconCrossRed from 'public/image/icon/cross_red.svg?url';
import iconCheckGreen from 'public/image/icon/check_green.svg?url';
// fake
import { TfakeData, partOptions } from 'pages/setting/productList';

// ===================================================================

// type TpartLookup = {
//   [key in (typeof partOptions)[number]['value']]: (typeof partOptions)[number]['label'];
// };
// const partLookup: TpartLookup = {};

// partOptions.forEach((item) => {
//   partLookup[item.value] = item.label;
// });
const partLookup = {
  supportPlate: '支板',
  base: '底座',
  doorTrack: '門軌',
  reel: '捲軸',
  reelBox: '捲箱',
  motor: '電動機',
  motorParts: '電動機配件',
  rollDoorPiece: '捲門片',
  rollDoorMaterial: '捲門材質',
};

// ===================================================================

export default function ProductList_table_02({
  fakeDataArr,
  tabQuery,
  filterParams,
}: {
  fakeDataArr: TfakeData[];
  tabQuery: 'base' | 'rollDoorPiece' | 'doorTrack' | 'supportPlate' | 'reel' | 'motor' | 'motorParts' | 'reelBox';
  filterParams: {
    checkedProdClass: string[];
    checkedDoorType: string[];
    checkedPart: string[];
  };
}) {
  const theConfig = configList[tabQuery];

  return (
    <div className={scss.table}>
      <div className={scss.thead}>
        <div className={classNames(scss.column, config.doorType.className)}>
          <span>{config.doorType.label}</span>
        </div>
        <div className={classNames(scss.column, config.prodClass.className)}>
          <span>{config.prodClass.label}</span>
        </div>
        {keyList[tabQuery].map((key, index) => {
          const { label, className } = theConfig?.[key] ?? {};

          return (
            <div className={classNames(scss.column, className)} key={index}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>

      <div className={scss.tbody}>
        {fakeDataArr.map((obj, index) => {
          const { checkedProdClass, checkedDoorType } = filterParams;

          let isPassed = true;

          if (checkedProdClass.length > 0) {
            isPassed = checkedProdClass.includes(obj.prodClass);
          }

          if (checkedDoorType.length > 0) {
            isPassed = checkedDoorType.includes(obj.doorType);
          }

          if (!isPassed) {
            return null;
          }

          return (
            <CellWithBar className={scss.row} key={index}>
              <div className={classNames(scss.column, config.doorType.className)}>
                <span>{obj.doorType}</span>
              </div>
              <div className={classNames(scss.column, config.prodClass.className)}>
                {/* <span>{obj.prodClass}</span> */}
                <span>{partLookup[tabQuery]}</span>
              </div>

              {keyList[tabQuery].map((key, index) => {
                const { className } = theConfig?.[key] ?? {};

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const data = obj[tabQuery][key] as string | undefined | boolean;

                if (data === true) {
                  return (
                    <div key={index} className={classNames(scss.column, className)}>
                      <Image className={scss.icon} src={iconCheckGreen} alt="check" />
                    </div>
                  );
                }

                return (
                  <div key={index} className={classNames(scss.column, className)}>
                    {data ? <span>{data}</span> : <Image className={scss.crossRed} src={iconCrossRed} alt="no value" />}
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

// ==========================================================

// type TkeyList = {
//   base: Array<keyof TfakeData['base']>;
//   rollDoorPiece: Array<keyof TfakeData['rollDoorPiece']>;
//   doorTrack: Array<keyof TfakeData['doorTrack']>;
//   supportPlate: Array<keyof TfakeData['supportPlate']>;
//   reel: Array<keyof TfakeData['reel']>;
//   motor: Array<keyof TfakeData['motor']>;
//   motorParts: Array<keyof TfakeData['motorParts']>;
//   reelBox: Array<keyof TfakeData['reelBox']>;
// };
type TkeyList = {
  [key in keyof Omit<TfakeData, 'doorType' | 'prodClass'>]: Array<keyof TfakeData[key]>;
};

const keyList: TkeyList = {
  base: ['type01', 'type02', 'paint', 'material'],
  // rollDoorPiece: ['type', 'surface', 'material', 'thickness'],
  rollDoorPiece: ['type', 'paint'],
  rollDoorMaterial: ['material', 'thickness'],
  // doorTrack: ['type', 'surface', 'material', 'thickness', 'noiseStrip'],
  doorTrack: ['type01', 'paint', 'noiseStrip', 'material', 'thickness'],
  // supportPlate: ['chainGearNumber', 'reelBoxType', 'supplier', 'maxMotorWeight', 'minMotorWeight', 'horsepower'],
  supportPlate: ['bearing', 'chain', 'reelBoxType'],
  reel: ['size', 'haveConvex'],
  // motor: ['horsepower', 'weight', 'supportFrame', 'powerSupplier', 'voltage', 'chainGearNumber', 'supplier'],
  motor: ['horsepower', 'weight', 'supportFrame', 'powerSupplier', 'voltage', 'chain', 'supplier'],
  motorParts: ['chain', 'lockCase', 'bearing'],
  // reelBox: ['thickness', 'surface', 'material', 'front', 'back', 'type'],
  reelBox: ['thickness', 'paint', 'front', 'type', 'thickness', 'material'],
};

type Tconfig = {
  [key in string]: {
    label: string;
    className: string;
  };
};

type TconfigList = {
  [key in keyof TfakeData]?: Tconfig;
};

const config = {
  doorType: {
    label: '門型',
    className: classNames('w-[90px]'),
  },
  prodClass: {
    label: '類型',
    className: classNames('w-[130px]'),
  },
  type01: {
    label: '型式一',
    className: classNames('w-[130px]'),
  },
  type02: {
    label: '型式二',
    className: classNames('w-[130px]'),
  },
  surface: {
    label: '表面',
    className: classNames('w-[60px]', scss.textCenter),
  },
  type: {
    label: '型式',
    className: classNames('w-[130px]'),
  },
  material: {
    label: '材質',
    className: classNames('w-[130px]'),
  },
  thickness: {
    label: '厚度',
    className: classNames('w-[60px]', scss.textCenter),
  },
  noiseStrip: {
    label: '消音條',
    className: classNames('w-[60px]'),
  },
  chainGearNumber: {
    label: '鏈齒輪番號',
    className: classNames('w-[95px]'),
  },
  supplier: {
    label: '廠商',
    className: classNames('w-[60px]'),
  },
  maxMotorWeight: {
    label: '最大馬達重量',
    className: classNames('w-[130px]'),
  },
  minMotorWeight: {
    label: '最小馬達重量',
    className: classNames('w-[130px]'),
  },
  horsepower: {
    label: '馬力數',
    className: classNames('w-[60px]'),
  },
  bearing: {
    label: '軸承',
    className: classNames('w-[60px]'),
  },
  weight: {
    label: '荷重',
    className: classNames('w-[90px]'),
  },
  supportFrame: {
    label: '支撐架',
    className: classNames('w-[60px]'),
  },
  powerSupplier: {
    label: '電供',
    className: classNames('w-[60px]'),
  },
  voltage: {
    label: '電壓',
    className: classNames('w-[60px]'),
  },
  chain: {
    label: '鏈條',
    className: classNames('w-[60px]'),
  },
  lockCase: {
    label: '鎖盒',
    className: classNames('w-[60px]'),
  },
  front: {
    label: '正面',
    className: classNames('w-[90px]'),
  },
  back: {
    label: '後面',
    className: classNames('w-[90px]'),
  },
  paint: {
    label: '烤漆',
    className: classNames('w-[90px]'),
  },
  haveConvex: {
    label: '有無凸',
    className: classNames('w-[60px]'),
  },
} as const;

const configList: TconfigList = {
  base: {
    ...config,
  },
  rollDoorPiece: {
    ...config,
  },
  doorTrack: {
    ...config,
  },
  supportPlate: {
    ...config,
    reelBoxType: {
      label: '捲箱型式',
      className: classNames('w-[95px]'),
    },
  },
  reel: {
    ...config,
    size: {
      label: '捲軸尺寸',
      className: classNames('w-[78px]'),
    },
    type: {
      label: '捲箱型式',
      className: classNames('w-[96px]'),
    },
  },
  motor: {
    ...config,
  },
  motorParts: {
    ...config,
  },
  reelBox: {
    ...config,
  },
  rollDoorMaterial: {
    ...config,
  },
};
