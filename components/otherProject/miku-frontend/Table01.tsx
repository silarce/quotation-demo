import * as C from 'components/otherProject/miku-frontend/index';

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
  } = control;

  return (
    <div>
      <div className="border-l-4 border-r-4 border-black bg-gray-300">
        <C.TableHeader4 title={itemName} />
      </div>
      <div className="grid grid-cols-2">
        <div>
          <section className="border-l-4 border-r-2 border-b-4 border-black">
            <C.TableHeader2 title="尺寸" />

            <C.TableContent2 label="數量" value={size.qty} />
            <C.TableContent2 label="型號" value={size.doorModelName} />
            <C.TableContent2 label="全寬" value={`${size.fullWidth} mm`} />
            <C.TableContent2 label="淨高" value={`${size.height} mm`} />
            <C.TableContent2 label="W+G" value={`${size.WG} mm`} />
            <C.TableContent2 label="機械縫 A" value={`${size.gapA} mm`} />
            <C.TableContent2 label="機械縫 C" value={`${size.gapC} mm`} />
            <C.TableContent2 label={'支板尺寸 B*D'} value={size.BD} />
            <C.TableContent2 label="捲門全高 H" value={`${size.fullHeight} mm`} />

            <C.TableHeader2 title="捲軸" />
            <C.TableContent2 label="捲軸尺寸" value={roller.diameter} />
            <C.TableContent2 label="軸徑" value={`${roller.bearingInnerDiameter}`} />
            <C.TableContent2 label="軸承" value={`${roller.bearingName}`} />
            <C.TableContent2 label="總長" value={`${roller.bearingHousingTotalLength}`} />
            <C.TableContent2 label="寸法" value={`${roller.bearingHousingSize}`} />
            <C.TableHeader2 title={'捲箱'} />
            <C.TableContent2 label="捲箱角鐵數量" value={`${headBox.angleIronQty}`} />
            <C.TableContent2 label="捲箱角鐵尺寸" value={headBox.angleIronSize} />
            <C.TableContent2 value={'捲箱資訊：' + headBox.form} height={69} />
          </section>
        </div>

        <div>
          <section className="border-l-0 border-r-4 border-b-4 border-black">
            <C.TableHeader2 title={'門片'} />
            <C.TableContent2 label="門片材質" value={doorPiece.material} />
            <C.TableContent2 label="門片厚度" value={doorPiece.thickness} />
            <C.TableContent2 label="門片長度" value={doorPiece.slatLength} />
            <C.TableContent2 label="捲片支數" value={doorPiece.slatCount} />
            <C.TableContent2 label="防颱勾" value={doorPiece.antyTyphoonHook} />

            <C.TableHeader2 title={`電動機(${motor.vendor})`} />
            <C.TableContent2 label="電供" value={motor.phaseVoltage} />

            <C.TableContent2 label="馬力數" value={motor.horsepower} />

            <C.TableHeader2 title={'門軌'} />
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

            <C.TableHeader2 title={'底座'} />
            <C.TableContent2 label="底座材質" value={base.material} />
            <C.TableContent2 label="底座開口" value={base.guideRailsOpening} />
          </section>
        </div>
      </div>
      <div>
        <section className="border-l-4 border-r-4 border-b-4 border-black h-24">
          <div className="px-1">
            備註：
            {memo}
          </div>
        </section>
      </div>
      <div>
        <section className="border-l-4 border-r-4 border-b-4 border-black h-80">
          <div className="px-1"></div>
        </section>
      </div>
    </div>
  );
}
