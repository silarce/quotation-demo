// import Image from 'next/image';
import classNames from 'classnames';

import * as C from 'components/otherProject/miku-frontend/index';
import scss from './table01.module.scss';

// ===========================================

// const headBoxImageWidth = 121.5;
// const headBoxImageHeight = 121.5;

// ===========================================

type Tcontrol = {
  itemName: string;
  size: {
    qty: string;
    doorModelName: string;
    fullWidth: string;
    height: string;
    WG: string;
    gapA: string;
    gapC: string;
    /**支版尺寸 boxB*boxD */
    BD: string;
    /**捲門全高 */
    fullHeight: string;
    weightConversion: string;
  };
  roller: {
    diameter: string;
    bearingInnerDiameter: string;
    bearingName: string;
    bearingHousingTotalLength: string;
    bearingHousingSize: string;
  };
  headBox: {
    angleIronQty: string;
    angleIronSize: string;
    form: string;
    surface: string;

    headBoxCover: React.ReactNode;
    headBoxTopCover: React.ReactNode;
    hasWheel: React.ReactNode;
    // upperMask: React.ReactNode;
    headBoxSizeB: React.ReactNode;
    headBoxSizeD: React.ReactNode;
    headBoxSizeX: React.ReactNode;
    headBoxSizeY: React.ReactNode;
    headBoxSizeM: React.ReactNode;
    headBoxSizeN: React.ReactNode;
    headBoxSizeO: React.ReactNode;
    headBoxSizeP: React.ReactNode;
    headBoxSizeQ: React.ReactNode;

    svgString1: string | null;
    svgString2: string | null;
    svgString3: string | null;
    svgString4: string | null;
  };
  doorPiece: {
    material: string;
    surface: string;
    thickness: string;
    slatLength: string;
    slatCount: string;
    antyTyphoonHook: string;
  };
  motor: {
    vendor: string;
    /**相數加電壓 */
    phaseVoltage: string;
    horsepower: string;
    direction: string;
  };
  guideRail: {
    form: string;
    material: string;
    guideRailLength: string;
    guideRailName: string;
    icon: string | undefined;
    dangerSvg?: string;
    antiTyphoonHook: string;
    bendStraight: string; // 彎直
    surface: string;
  };
  chainCog: {
    sprocketWheelModel: string;
    sprocketWheelTeethNumber: string;
    bearingInnerDiameter: string;
    teethQuantity: string;
    centerDistance: string;
    eyesQuantity: string;
  };
  base: {
    material: string;
    guideRailsOpening: string;
    surface: string;
  };
  sidePlate: {
    direction: string;
    bigSidePlate: string;
    smallSidePlate: string;
  };
  memo: string;
};

export type { Tcontrol as Tcontrol_table01 };

const imgHeight = 'h-[16px]';

export default function Miku_frontend_table01({ control }: { control: Tcontrol }) {
  const {
    itemName,
    memo,

    size,
    roller,
    headBox,
    doorPiece,
    motor,
    guideRail,
    chainCog,
    base,
    sidePlate,
  } = control;

  return (
    <div>
      <div className="border-l-4 border-r-4 border-black bg-gray-300">
        <C.TableHeader4 title={itemName} />
      </div>
      <div className="grid grid-cols-2">
        <section className="border-l-4 border-r-2 border-black">
          <C.TableHeader2 title="尺寸" />

          <C.TableContent2 label="數量" value={size.qty} />
          <C.TableContent2 label="型號" value={size.doorModelName} />
          <C.TableContent2 label="全寬" value={`${size.fullWidth} mm`} />
          <C.TableContent2 label="淨高" value={`${size.height} mm`} />
          <C.TableContent2 label="W+G" value={`${size.WG} mm`} />
          <C.TableContent2 label="機械縫 A" value={`${size.gapA} mm`} />
          <C.TableContent2 label="機械縫 C" value={`${size.gapC} mm`} />
          <C.TableContent2 label={`支板尺寸 B*D (${sidePlate.direction})`} value={size.BD} />
          <C.TableContent2 label="捲門全高 H" value={`${size.fullHeight} mm`} />

          <C.TableHeader2 title="捲軸" />
          <C.TableContent2 label="捲軸尺寸" value={roller.diameter} />
          <C.TableContent2 label="軸徑" value={`${roller.bearingInnerDiameter}`} />
          <C.TableContent2 label="軸承" value={`${roller.bearingName}`} />
          <C.TableContent2 label="總長" value={`${roller.bearingHousingTotalLength}`} />
          <C.TableContent2 label="寸法" value={`${roller.bearingHousingSize}`} />
          <C.TableHeader2 title={`捲箱(${headBox.surface})`} />
          <C.TableContent2 label="捲箱角鐵數量" value={`${headBox.angleIronQty}`} />
          <C.TableContent2 label="捲箱角鐵尺寸" value={headBox.angleIronSize} />
          <C.TableContent2 value={'捲箱資訊：' + headBox.form} height={69} />
        </section>

        <section className="border-l-0 border-r-4  border-black">
          <C.TableHeader2 title={`門片(${doorPiece.surface})`} />
          <C.TableContent2 label="門片材質" value={doorPiece.material} />
          <C.TableContent2 label="門片厚度" value={doorPiece.thickness + 'mm'} />
          <C.TableContent2 label="門片長度" value={doorPiece.slatLength} />
          <C.TableContent2 label="捲片支數" value={doorPiece.slatCount} />
          <C.TableContent2 label="防颱勾" value={doorPiece.antyTyphoonHook} />

          <C.TableHeader2 title={`電動機(${motor.vendor})`} />
          <C.TableContent2 label="電供" value={motor.phaseVoltage} />

          <C.TableContent2 label="馬力數" value={motor.horsepower} />

          <C.TableHeader2 title={`門軌(${guideRail.surface})`} />
          {/* <C.TableHeader2 title={`門軌`} /> */}
          <C.TableContent2 label="門軌材質" value={guideRail.material} />
          <C.TableContent2 label="門軌長度" value={guideRail.guideRailLength} />
          <C.TableContentWithImage2
            label="門軌形式"
            label2={`(${guideRail.bendStraight})`}
            value={guideRail.guideRailName}
            image={guideRail.icon}
            dangerSvg={guideRail.dangerSvg}
          />

          <C.TableHeader2 title="鏈齒輪" />
          <C.TableContent2 label="鏈齒輪番號" value={chainCog.sprocketWheelModel} />
          <C.TableContent2 label="大鏈輪" value={chainCog.sprocketWheelTeethNumber} />

          <C.TableContent2 label="孔徑" value={chainCog.bearingInnerDiameter} />

          <C.TableHeader2 title={`底座(${base.surface})`} />
          <C.TableContent2 label="底座材質" value={base.material} />
          <C.TableContent2 label="底座開口" value={base.guideRailsOpening} />
        </section>

        {/*  */}

        <C.TableHeader2 title={`捲箱細節`} className="col-span-2 border-l-4 border-r-4" />
        <section className="border-l-4 border-r-2 border-black">
          <C.TableContent2
            //
            label={<span className={classNames('inline-block', imgHeight)}></span>}
            height="auto"
          />
          <C.TableContent2
            className="border-t-0"
            height="auto"
            // label={<HeadBoxImg url={headBox.imgUrl1} />}
            // value={<HeadBoxImg url={headBox.imgUrl2} />}
            label={<HeadBoxSvg svgString={headBox.svgString1 ?? ''} />}
            value={<HeadBoxSvg svgString={headBox.svgString2 ?? ''} />}
          />
          <C.TableContent2
            height="auto"
            // label={<HeadBoxImg url={headBox.imgUrl3} />}
            // value={<HeadBoxImg url={headBox.imgUrl4} />}
            label={<HeadBoxSvg svgString={headBox.svgString3 ?? ''} />}
            value={<HeadBoxSvg svgString={headBox.svgString4 ?? ''} />}
          />
          <C.TableContent2
            className="border-t-0"
            height="auto"
            label={<span className={classNames('inline-block', imgHeight)}></span>}
          />
        </section>
        <section className="border-l-0 border-r-4  border-black">
          <C.TableContent2 label="檔輪" value={headBox.hasWheel} />
          <C.TableContent2 label="前遮" value={headBox.headBoxCover} />
          <C.TableContent2 label="上蓋" value={headBox.headBoxTopCover} />
          {/* <C.TableContent2 label="上遮" value={headBox.upperMask} /> */}
          <C.TableContent2 label="sizeB" value={headBox.headBoxSizeB} />
          <C.TableContent2 label="sizeD" value={headBox.headBoxSizeD} />
          <C.TableContent2 label="sizeX" value={headBox.headBoxSizeX} />
          <C.TableContent2 label="sizeY" value={headBox.headBoxSizeY} />
          <C.TableContent2 label="sizeM" value={headBox.headBoxSizeM} />
          <C.TableContent2 label="sizeN" value={headBox.headBoxSizeN} />
          <C.TableContent2 label="sizeO" value={headBox.headBoxSizeO} />
          <C.TableContent2 label="sizeP" value={headBox.headBoxSizeP} />
          <C.TableContent2 label="sizeQ" value={headBox.headBoxSizeQ} />
          {/* <hr className="border-black" /> */}
        </section>
        <hr className="col-span-2 border-black border-b-4 border-t-0" />

        {/*  */}
      </div>

      <section className="border-l-4 border-r-4 border-b-4 border-black h-20">
        <div className="px-1">
          備註：
          {memo}
        </div>
      </section>

      <section className="border-l-4 border-r-4 border-b-4 border-black h-24">
        <div className="px-1"></div>
      </section>
    </div>
  );
}

// const HeadBoxImg = ({ url }: { url: string | null | undefined }) => {
//   if (url) {
//     return (
//       <Image
//         src={url}
//         alt="圖片錯誤"
//         width={headBoxImageWidth}
//         height={headBoxImageHeight}
//         style={{
//           width: headBoxImageWidth,
//           height: headBoxImageHeight,
//         }}
//       />
//     );
//   } else {
//     return (
//       <div
//         style={{
//           width: headBoxImageWidth,
//           height: headBoxImageHeight,
//         }}
//       />
//     );
//   }
// };

const HeadBoxSvg = ({ svgString }: { svgString: string }) => {
  return <div className={scss.svgContainer} dangerouslySetInnerHTML={{ __html: svgString }} />;
};
