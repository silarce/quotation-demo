import classNames from 'classnames';

import scss from './productList_Table_02.module.scss';

import { TfakeData02 } from 'pages/setting/productList';

export default function ProductList_table_02({ fakeDataArr }: { fakeDataArr: TfakeData02[] }) {
  return <div></div>;
}

// ==========================================================
const config = {
  doorType: {
    label: '門型',
    className: classNames('w-[90px]'),
  },
  prodClass: {
    label: '門型',
    className: classNames('w-[112px]'),
  },
  type01: {
    label: '型式一',
    className: classNames('w-[112px]'),
  },
  type02: {
    label: '型式二',
    className: classNames('w-[112px]'),
  },
  surface: {
    label: '表面',
    className: classNames('w-[60px]', scss.textCenter),
  },
  type: {
    label: '型式',
    className: classNames('w-[112px]'),
  },
  material: {
    label: '材質',
    className: classNames('w-[112px]'),
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
    className: classNames('w-[96px]'),
  },
  reelBox: {
    label: '捲箱型式',
    className: classNames('w-[96px]'),
  },
  supplier: {
    label: '廠商',
    className: classNames('w-[60px]'),
  },
  maxMotorWeight: {
    label: '最大馬達重量',
    className: classNames('w-[112px]'),
  },
  minMotorWeight: {
    label: '最小馬達重量',
    className: classNames('w-[112px]'),
  },
  horsepower: {
    label: '馬力數',
    className: classNames('w-[60px]'),
  },
  size: {
    label: '捲軸尺寸',
    className: classNames('w-[78px]'),
  },
  bearing: {
    label: '軸承',
    className: classNames('w-[60px]'),
  },
  weight: {
    label: '重量',
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
    label: '鏈齒輪番號',
    className: classNames('w-[px]'),
  },
  lockCase: {
    label: '鎖盒',
    className: classNames('w-[60px]'),
  },
  front: {
    label: '前面',
    className: classNames('w-[90px]'),
  },
  back: {
    label: '後面',
    className: classNames('w-[90px]'),
  },
} as const;
