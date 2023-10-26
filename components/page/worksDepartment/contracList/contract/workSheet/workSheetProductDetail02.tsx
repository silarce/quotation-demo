import { Fragment } from 'react';

// import { optionsCre_doorTrack_normal } from 'js/utils/options/doorTrackOptions';

import scss from './workSheetProductDetail02.module.scss';

// ====================================================================

type Tcontrol = {
  size01: {
    doorType: string;
    fullWidth: string;
    淨高: string;
    WG: string;
    gapA: string;
    gapC: string;
    支板尺寸: string;
    捲門全高: string;
  };
  size02: {
    捲軸尺寸: string;
    軸徑: string;
    軸承: string;
    總長: string;
    寸法: string;
  };
  rollBox: {
    角鐵數量: string;
    捲箱角鐵尺寸: string;
    捲箱資訊: string;
  };
  doorPiece: {
    門片材質: string;
    門片厚度: string;
    門片長度: string;
    捲片支數: string;
    防颱勾: string;
  };
  motor: {
    vendor: string;
    電供: string;
    馬力: string;
  };
  doorTrack: {
    門軌材質: string;
    門軌長度: string;
    門軌形式: {
      value: string;
      img: string;
    };
  };
  chainCog: {
    鏈齒輪番號: string;
    大鏈輪: string;
    孔徑: string;
  };
  base: {
    底座材質: string;
    底座開口: string;
  };
};

export type { Tcontrol as Tcontrol_detail02 };

// ====================================================================
// const option_doorTrack_normal = optionsCre_doorTrack_normal();

// const doorTrackLookUp_normal = (() => {
//   const obj = {} as any;
//   option_doorTrack_normal.forEach((item) => {
//     obj[item.value] = item;
//   });

//   return obj;
// })();

// ====================================================================

export default function WorkSheetProductDetail02({ control }: { control: Tcontrol }) {
  const arr_size01 = [
    { value: control.size01.doorType, label: '型號' },
    { value: `${control.size01.fullWidth} mm`, label: '全寬' },
    { value: `${control.size01.淨高} mm`, label: '淨高' },
    { value: `${control.size01.WG} mm`, label: 'W+G' },
    { value: `${control.size01.gapA} mm`, label: '機械縫 A' },
    { value: `${control.size01.gapC} mm`, label: '機械縫 C' },
    { value: `${control.size01.支板尺寸}`, label: '支板尺寸 B*D(右)' },
    { value: `${control.size01.捲門全高} mm`, label: '捲門全高 H' },
  ];

  const arr_size02 = [
    { value: control.size02.捲軸尺寸, label: '捲軸尺寸' },
    { value: control.size02.軸徑, label: '軸徑' },
    { value: control.size02.軸承, label: '軸承' },
    { value: control.size02.總長, label: '總長' },
    { value: control.size02.寸法, label: '寸法' },
  ];

  const arr_rollBox = [
    { value: control.rollBox.角鐵數量, label: '角鐵數量' },
    { value: control.rollBox.捲箱角鐵尺寸, label: '捲箱角鐵尺寸' },
    { value: control.rollBox.捲箱資訊, label: '捲箱資訊', span: 2 as const },
  ];

  const arr_doorPiece = [
    { value: control.doorPiece.門片材質, label: '門片材質' },
    { value: control.doorPiece.門片厚度, label: '門片厚度' },
    { value: control.doorPiece.門片長度, label: '門片長度' },
    { value: control.doorPiece.捲片支數, label: '捲片支數' },
    { value: control.doorPiece.防颱勾, label: '防颱勾' },
  ];

  const arr_montor = [
    { value: control.motor.電供, label: '電供' },
    { value: control.motor.馬力, label: '馬力' },
  ];

  const arr_doorTrack = [
    { value: control.doorTrack.門軌材質, label: '門軌材質' },
    { value: control.doorTrack.門軌長度, label: '門軌長度' },
    {
      value: control.doorTrack.門軌形式.value,
      // img: doorTrackLookUp_normal[watch('doorTrack.doorTrackName')].icon,
      img: control.doorTrack.門軌形式.img,
      label: '門軌形式(直)',
    },
  ];

  const arr_chainCog = [
    { value: control.chainCog.鏈齒輪番號, label: '鏈齒輪番號' },
    { value: control.chainCog.大鏈輪, label: '大鏈輪' },
    { value: control.chainCog.孔徑, label: '孔徑' },
  ];

  const arr_base = [
    { value: control.base.底座材質, label: '底座材質' },
    { value: control.base.底座開口, label: '底座開口' },
  ];

  return (
    <div className={scss.container}>
      <p>設定產品細部規格：</p>
      <div className={scss.main}>
        {/* left */}
        <div className={scss.left}>
          <Item label="尺寸" optionArr={arr_size01} />
          <Item label="尺寸" optionArr={arr_size02} />
          <Item02 label="捲箱" optionArr={arr_rollBox} />
        </div>
        {/* right */}
        <div className={scss.right}>
          <Item label="門片" optionArr={arr_doorPiece} />
          <Item label={`發動機(${control.motor.vendor})`} optionArr={arr_montor} />
          <Item label="門軌" optionArr={arr_doorTrack} />
          <Item label="鍊齒輪" optionArr={arr_chainCog} />
          <Item label="底座" optionArr={arr_base} />
        </div>
      </div>
    </div>
  );
}

// ====================================================================

const Item = ({
  label,
  optionArr,
}: {
  label: string;
  optionArr: {
    value?: string;
    label: string;
    img?: string;
  }[];
}) => {
  return (
    <div className={scss.item}>
      <p>{label}</p>
      <div className={scss.grid}>
        {optionArr.map((option, index) => {
          const { value, label, img } = option;

          return (
            <Fragment key={index}>
              <div>
                <span>{label}</span>
              </div>
              {/*  eslint-disable-next-line @next/next/no-img-element */}
              {img && (
                <div>
                  <img src={img} alt="" />
                </div>
              )}
              {!img && (
                <div>
                  <span>{value}</span>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

const Item02 = ({
  label,
  optionArr,
}: {
  label: string;
  optionArr: {
    value?: string;
    label: string;
    img?: string;
    span?: 2;
  }[];
}) => {
  return (
    <div className={scss.item_last}>
      <p>{label}</p>
      <div className={scss.grid}>
        {optionArr.map((option, index) => {
          const { value, label, img, span } = option;

          if (span === 2) {
            return (
              <Fragment key={index}>
                <div className={scss.span2}>
                  <div>
                    <span>{label} : </span>
                    {/*  eslint-disable-next-line @next/next/no-img-element */}
                    {img && <img src={img} alt="" />}
                    {!img && <span>{value}</span>}
                  </div>
                </div>
              </Fragment>
            );
          }

          return (
            <Fragment key={index}>
              <div>
                <span>{label}</span>
              </div>
              {/*  eslint-disable-next-line @next/next/no-img-element */}
              {img && (
                <div>
                  <img src={img} alt="" />
                </div>
              )}
              {!img && (
                <div>
                  <span>{value}</span>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ====================================================================
// ====================================================================
// ====================================================================

// const fakeSize = [
//   { value: '型號', label: 'SJ-302' },
//   { value: '5250 mm', label: '全寬' },
//   { value: '4870 mm', label: '淨高' },
//   { value: '5160 mm', label: 'W+G' },
//   { value: '70 mm', label: '機械縫 A' },
//   { value: '20 mm', label: '機械縫 C' },
//   { value: '550*800', label: '支板尺寸 B*D(右)' },
//   { value: '5420 mm', label: '捲門全高 H' },
// ];

// const fakeDoorTrack = [
//   { value: '單向 220', label: '門軌材質' },
//   { value: '4970', label: '門軌長度' },
//   { label: '門軌形式(直)', img: option_doorTrack_normal[0].icon },
// ];

// const fakeRollBox = [
//   { value: '4', label: '角鐵數量' },
//   { value: '5240', label: '捲箱角鐵尺寸' },
//   { value: '捲箱加機箱', label: '捲箱資訊', span: 2 as const },
// ];

// ======================================================================
