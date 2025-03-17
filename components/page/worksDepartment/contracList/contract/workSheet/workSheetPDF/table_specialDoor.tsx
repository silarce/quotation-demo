import { Fragment } from 'react';

import classNames from 'classnames';
import scss from './table_specialDoor.module.scss';

// ================================================================================

interface Tprops_table_specialDoor {
  doorModelName: React.ReactNode;

  itemName: string;
  qty: React.ReactNode;
  materialName: React.ReactNode;
  materialSurface: React.ReactNode;
  closingType: React.ReactNode;
  isAntiTyphoon: React.ReactNode;
  skeleton: React.ReactNode;
  //
  fullWidth: React.ReactNode;
  height: React.ReactNode;
  WG: React.ReactNode;
  gapA: React.ReactNode;
  gapC: React.ReactNode;
  BD: React.ReactNode;
  fullHeight: React.ReactNode;
  //
  isIntegratedHeadBox: React.ReactNode;
  // upperMask: React.ReactNode;
  hasWheel: React.ReactNode;
  headBoxCover: React.ReactNode;
  headBoxTopCover: React.ReactNode;
  headBoxSizeO: React.ReactNode;
  headBoxSizeP: React.ReactNode;
  headBoxSizeQ: React.ReactNode;
  headBoxSizeX: React.ReactNode;
  headBoxSizeY: React.ReactNode;
  headBoxSizeM: React.ReactNode;
  headBoxSizeN: React.ReactNode;
  boxB: React.ReactNode;
  boxD: React.ReactNode;
  //
  motorVendor: React.ReactNode;
  electricSupply: React.ReactNode;
  horsepower: React.ReactNode;
  guideRailType: React.ReactNode;
  diameter: React.ReactNode;
  sprocketWheelModel: React.ReactNode;
  //
  headBoxImg1: React.ReactNode;
  headBoxImg2: React.ReactNode;
  headBoxImg3: React.ReactNode;
  headBoxImg4: React.ReactNode;
}

type TconfigKeys = keyof Pick<
  Tprops_table_specialDoor,
  | 'itemName'
  | 'qty'
  | 'materialName'
  | 'materialSurface'
  | 'closingType'
  | 'isAntiTyphoon'
  | 'skeleton'
  | 'fullWidth'
  | 'height'
  | 'WG'
  | 'gapA'
  | 'gapC'
  | 'BD'
  | 'fullHeight'
  | 'isIntegratedHeadBox'
  // | 'upperMask'
  | 'hasWheel'
  | 'headBoxCover'
  | 'headBoxTopCover'
  | 'headBoxSizeO'
  | 'headBoxSizeP'
  | 'headBoxSizeQ'
  | 'headBoxSizeX'
  | 'headBoxSizeY'
  | 'headBoxSizeM'
  | 'headBoxSizeN'
  | 'boxB'
  | 'boxD'
>;

type TconfigItem = {
  label: string;
};

// ================================================================================

// MARK: START
const Table_specialDoor = (props: Tprops_table_specialDoor) => {
  return (
    <div className={scss.table2}>
      {/* C1 */}
      <div className={classNames(scss.c1, scss.s2, scss.caption, scss.partRight)}>
        <span>{props.doorModelName}</span>
      </div>

      {keyArr_basic.map((key) => {
        const value = props[key];

        return (
          <Fragment key={key}>
            <div className={classNames(scss.c1)}>
              <span>{config_specialDoor[key].label}</span>
            </div>
            <div className={classNames(scss.c2, scss.partRight)}>
              <span>{value}</span>
            </div>
          </Fragment>
        );
      })}

      {/* C2 */}
      <div className={classNames(scss.c3, scss.s2, scss.caption, scss.partRight)}>
        <span>尺寸</span>
      </div>

      {keyArr_size.map((key) => {
        const value = props[key];

        return (
          <Fragment key={key}>
            <div className={classNames(scss.c3)}>
              <span>{config_specialDoor[key].label}</span>
            </div>
            <div className={classNames(scss.c4, scss.partRight)}>
              <span>{value}</span>
            </div>
          </Fragment>
        );
      })}

      {/* 填空 */}
      <div className={classNames(scss.c1, scss.s4, scss.partRight)} />

      {/* C3 */}
      <div className={classNames(scss.c5, scss.s2, scss.caption, scss.partRight)}>
        <span>{`電動機(${props.motorVendor})`}</span>
      </div>

      <div className={classNames(scss.c5)}>
        <span>電供</span>
      </div>
      <div className={classNames(scss.c6, scss.partRight)}>
        <span>{props.electricSupply}</span>
      </div>
      <div className={classNames(scss.c5)}>
        <span>馬力數</span>
      </div>
      <div className={classNames(scss.c6, scss.partRight)}>
        <span>{props.horsepower}</span>
      </div>

      <div className={classNames(scss.c5, scss.s2, scss.caption, scss.partRight)}>
        <span>門軌</span>
      </div>

      <div className={classNames(scss.c5)}>
        <span>門軌形式</span>
      </div>
      <div className={classNames(scss.c6, scss.partRight)}>
        <span>{props.guideRailType}</span>
      </div>

      <div className={classNames(scss.c5, scss.s2, scss.caption, scss.partRight)}>
        <span>捲軸</span>
      </div>

      <div className={classNames(scss.c5)}>
        <span>捲軸尺寸</span>
      </div>
      <div className={classNames(scss.c6, scss.partRight)}>
        <span>{props.diameter}</span>
      </div>

      <div className={classNames(scss.c5, scss.s2, scss.caption, scss.partRight)}>
        <span>鏈齒輪</span>
      </div>

      <div className={classNames(scss.c5)}>
        <span>鏈齒輪番號</span>
      </div>
      <div className={classNames(scss.c6, scss.partRight)}>
        <span>{props.sprocketWheelModel}</span>
      </div>

      {/* C7 */}
      <div className={classNames(scss.c7, scss.s6, scss.caption)}>
        <span>捲箱</span>
      </div>

      {keyArr_headBox_left.map((key, index) => {
        const { label } = config_specialDoor[key];
        const value = props[key];

        return (
          <Fragment key={key}>
            <div className={classNames(scss.c7)}>
              <span>{label}</span>
            </div>
            <div className={classNames(scss.c8)}>
              <span>{value}</span>
            </div>
          </Fragment>
        );
      })}

      {/* 填空 */}
      <div className={classNames(scss.c7)} />
      <div className={classNames(scss.c8)} />

      {keyArr_headBox_right.map((key, index) => {
        const { label } = config_specialDoor[key];
        const value = props[key];

        return (
          <Fragment key={key}>
            <div className={classNames(scss.c9)}>
              <span>{label}</span>
            </div>
            <div className={classNames(scss.c10)}>
              <span>{value}</span>
            </div>
          </Fragment>
        );
      })}

      {/* 填空 */}
      <div className={classNames(scss.c7, scss.s4)} />

      {/*  */}
      <div className={classNames(scss.c11, scss.r4, scss.imgCell)}>{props.headBoxImg1}</div>
      <div className={classNames(scss.c11, scss.r4, scss.imgCell)}>{props.headBoxImg2}</div>
      <div className={classNames(scss.c12, scss.r4, scss.imgCell)}>{props.headBoxImg3}</div>
      <div className={classNames(scss.c12, scss.r4, scss.imgCell)}>{props.headBoxImg4}</div>

      {/*  */}
    </div>
  );
};

// MARK: END

const keyArr_basic = Array.from(
  new Set<TconfigKeys>([
    'itemName',
    'qty',
    'materialName',
    'materialSurface',
    'closingType',
    'isAntiTyphoon',
    'skeleton',
  ])
);

const keyArr_size = Array.from(new Set<TconfigKeys>(['fullWidth', 'height', 'WG', 'gapA', 'gapC', 'BD', 'fullHeight']));

const keyArr_headBox_left = Array.from(
  new Set<TconfigKeys>([
    'isIntegratedHeadBox',
    'hasWheel',
    // 'upperMask',
    'boxB',
    'boxD',
    'headBoxSizeM',
    'headBoxSizeN',
  ])
);
const keyArr_headBox_right = Array.from(
  new Set<TconfigKeys>([
    'headBoxCover',
    'headBoxTopCover',
    'headBoxSizeO',
    'headBoxSizeP',
    'headBoxSizeQ',
    'headBoxSizeX',
    'headBoxSizeY',
  ])
);

const config_specialDoor: Record<TconfigKeys, TconfigItem> = {
  // 基本資料
  itemName: {
    label: '型號',
  },
  qty: {
    label: '數量',
  },
  materialName: {
    label: '材質',
  },
  materialSurface: {
    label: '表面',
  },
  closingType: {
    label: '開閉方式',
  },
  isAntiTyphoon: {
    label: '防颱勾',
  },
  skeleton: {
    label: '骨架',
  },

  // 尺寸
  fullWidth: {
    label: '全寬',
  },
  height: {
    label: '淨高',
  },
  WG: {
    label: 'W+G',
  },
  gapA: {
    label: '機械縫 A',
  },
  gapC: {
    label: '機械縫 C',
  },
  BD: {
    label: '支板尺寸 B*D',
  },
  fullHeight: {
    label: '捲門全高 H',
  },

  // 捲箱
  isIntegratedHeadBox: {
    label: '型式',
  },
  // upperMask: {
  //   label: '上遮',
  // },
  hasWheel: {
    label: '擋輪',
  },
  headBoxCover: {
    label: '前遮',
  },
  headBoxTopCover: {
    label: '上蓋',
  },
  headBoxSizeO: {
    label: 'sizeO',
  },
  headBoxSizeP: {
    label: 'sizeP',
  },
  headBoxSizeQ: {
    label: 'sizeQ',
  },
  headBoxSizeX: {
    label: 'sizeX',
  },
  headBoxSizeY: {
    label: 'sizeY',
  },
  headBoxSizeM: {
    label: 'sizeM',
  },
  headBoxSizeN: {
    label: 'sizeN',
  },
  boxB: {
    label: 'sizeB',
  },
  boxD: {
    label: 'sizeD',
  },
};

export default Table_specialDoor;
export type { Tprops_table_specialDoor };
