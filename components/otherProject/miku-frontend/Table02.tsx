import Decimal from 'decimal.js';

type Tcontrol_item = {
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
    info: string;
  };
  doorPiece: {
    material: string;
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
  };
  guideRail: {
    彎直: string;
    material: string;
    guideRailLength: string;
    guideRailName: string;
    icon: string | undefined;
  };
  chainCog: {
    sprocketWheelModel: string;
    sprocketWheelTeethNumber: string;
    bearingInnerDiameter: string;
  };
  base: {
    material: string;
    guideRailsOpening: string;
  };
  memo: string;
};

type Tcontrol = {
  info: {
    projectName: string;
    totalQty: string;
  };
  itemArr: Tcontrol_item[];
};

// =====================================================================
export type { Tcontrol as Tcontrol_table02 };

// =====================================================================
export default function Miku_frontend_table02({
  //
  // itemArr,
  // info,
  control,
  index,
}: {
  // itemArr: Tcontrol_item[];
  // info: {
  //   projectName: string;
  //   totalQty: string;
  // };
  control: Tcontrol;
  index: number;
}) {
  const { info, itemArr } = control;

  const pages = Math.ceil(itemArr.length);

  // let allCount = 0;
  // itemArr.map((spec, cellIndex) => {
  //   allCount += new Decimal(spec.count).toNumber();
  // });
  let allCount = 0;
  itemArr.map((spec, cellIndex) => {
    allCount += new Decimal(1).toNumber();
  });

  return (
    <div className="mx-5">
      <table className="w-full text-center border-4 border-black">
        <tbody>
          <tr>
            <td colSpan={14} className="report border-b-2 border-black">
              <span>{`工程名稱: ${info.projectName}`}</span>
              <span className="ml-4">{`總樘數: ${info.totalQty}`}</span>
            </td>
          </tr>
          <tr className="font-bold">
            <td rowSpan={2} className="w-56 report border-b-2 border-r border-black">
              <div className="flex justify-around">
                <div>編</div>
                <div>號</div>
              </div>
            </td>
            <td rowSpan={2} className="w-9 report border-b-2 border-r-2 border-black">
              <div className="flex justify-around">
                <div>數</div>
                <div>量</div>
              </div>
            </td>
            <td
              colSpan={5}
              className="report border-b border-r-2 border-black"
              style={{
                borderBottomColor: 'rgb(107, 114, 128)',
                borderLeftColor: 'rgb(107, 114, 128)',
              }}
            >
              <div className="flex justify-around">
                <div>寬</div>
                <div>度</div>
              </div>
            </td>
            <td
              colSpan={4}
              className="report border-b border-r-2 border-black"
              style={{
                borderBottomColor: 'rgb(107, 114, 128)',
                borderLeftColor: 'rgb(107, 114, 128)',
              }}
            >
              <div className="flex justify-around">
                <div>門</div>
                <div>片</div>
              </div>
            </td>
            <td colSpan={3} className="report border-b border-gray-500">
              <div className="flex justify-around">
                <div>電</div>
                <div>動</div>
                <div>機</div>
              </div>
            </td>
          </tr>
          <tr className="font-bold">
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              門型
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              W+G
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              機械縫(大)
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              機械縫(小)
            </td>
            <td className="report border-b-2 border-r-2 border-black">淨高</td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              門片材質
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              表面
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              門片長度
            </td>
            <td className="report border-b-2 border-r-2 border-black">門片支數</td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              廠牌
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              方向
            </td>
            <td className="report border-b-2 border-black">馬達馬力</td>
          </tr>
          {itemArr.slice(index * 7, index * 7 + 7).map((item, cellIndex) => {
            // const pageIndex = index * 7 + cellIndex;
            // // predefined fields
            // const _modelData = appCtx.specs[pageIndex].modelData;
            // const _model = appCtx.specs[pageIndex].model;
            // const _count = appCtx.specs[pageIndex].count;
            // const _width = appCtx.specs[pageIndex].width;
            // const _height = appCtx.specs[pageIndex].height;
            // const _wg = appCtx.specs[pageIndex].wg;
            // const _angleIronCount = appCtx.specs[pageIndex].angleIronCount;
            // const _data = appCtx.specs[pageIndex].data;
            // const _useHook = appCtx.specs[pageIndex].useHook!;
            // const _motorIndex = appCtx.specs[pageIndex].motorIndex;
            // const _motorUnitIndex = appCtx.specs[pageIndex].motorUnitIndex;
            // const _doorTrackIndex = appCtx.specs[pageIndex].doorTrackIndex;
            // const _baseMtlIndex = appCtx.specs[pageIndex].baseMtlIndex;
            // const _doorMtlIndex = appCtx.specs[pageIndex].doorMtlIndex;
            // const _doorTrackMtlIndex = appCtx.specs[pageIndex].doorTrackMtlIndex;
            // const _doorTrackTypeIndex = appCtx.specs[pageIndex].doorTrackTypeIndex;
            // const _doorSectionLength = appCtx.specs[pageIndex].doorSectionLength;
            // const _useBakeDoorMt = appCtx.specs[pageIndex].useBakeDoorMt;
            // const _useBakeDoorTrackMt = appCtx.specs[pageIndex].useBakeDoorTrackMt;
            // const _useBakeBaseMt = appCtx.specs[pageIndex].useBakeBaseMt;
            // const _useBakeRollBox = appCtx.specs[pageIndex].useBakeRollBox;
            // const _power = appCtx.specs[pageIndex].powerIndex;
            // const _preferredBDirectionIndex = appCtx.specs[pageIndex].preferredBDirectionIndex;
            // const _rollBox = appCtx.specs[pageIndex].rollBoxIndexs;
            // const _memo = appCtx.specs[pageIndex].memoIndexs;
            // const _minA = appCtx.specs[pageIndex].minA;
            // const _minB = appCtx.specs[pageIndex].minB;
            // const _minC = appCtx.specs[pageIndex].minC;
            // const _minD = appCtx.specs[pageIndex].minD;
            // const _preferredA = appCtx.specs[pageIndex].preferredA;
            // const _preferredB = appCtx.specs[pageIndex].preferredB;
            // const _preferredC = appCtx.specs[pageIndex].preferredC;
            // const _preferredD = appCtx.specs[pageIndex].preferredD;
            // const _info = appCtx.specs[pageIndex].info;
            // const _calculatedWidth = _width
            //   ? Decimal.mul(Number(_width), 1000).toNumber()
            //   : Decimal.mul(Number(_wg), 1000).plus(Number(_preferredA)).plus(Number(_preferredC)).toNumber();

            // const specialSpec: Partial<SpecDataType> = SpecData[_model];

            // const finalSpec = Object.assign({ ...commonSpec }, specialSpec) as SpecDataType;

            const { itemName, size, roller, headBox, doorPiece, motor, guideRail, chainCog, base, memo } = item;

            if (cellIndex !== 6) {
              return (
                <>
                  <tr>
                    <td className="report border-b border-r border-gray-500">{itemName}</td>
                    <td
                      className="report border-b border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {size.qty}
                    </td>
                    <td className="report border-b border-r border-gray-500">{size.doorModelName}</td>
                    <td className="report border-b border-r border-gray-500">{size.WG}</td>
                    <td className="report border-b border-r border-gray-500">{size.gapA}</td>
                    <td className="report border-b border-r border-gray-500">{size.gapC}</td>
                    <td
                      className="report border-b border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {size.height}
                    </td>
                    <td className="report border-b border-r border-gray-500">{doorPiece.material}</td>
                    <td className="report border-b border-r border-gray-500">{'???'}</td>
                    <td className="report border-b border-r border-gray-500">{doorPiece.slatLength}</td>
                    <td
                      className="report border-b border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {doorPiece.slatCount}
                    </td>
                    <td className="report border-b border-r border-gray-500">{motor.vendor}</td>
                    <td className="report border-b border-r border-gray-500">{'???'}</td>
                    <td className="report border-b border-gray-500">{motor.horsepower}</td>
                  </tr>
                </>
              );
            } else {
              return (
                <>
                  <tr>
                    <td className="report border-r border-gray-500">{itemName}</td>
                    <td
                      className="report border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {size.qty}
                    </td>
                    <td className="report border-r border-gray-500">{size.doorModelName}</td>
                    <td className="report border-r border-gray-500">{size.WG}</td>
                    <td className="report border-r border-gray-500">{size.gapA}</td>
                    <td className="report border-r border-gray-500">{size.gapC}</td>
                    <td
                      className="report border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {size.height}
                    </td>
                    <td className="report border-r border-gray-500">{doorPiece.material}</td>
                    <td className="report border-r border-gray-500">{'???'}</td>
                    <td className="report border-r border-gray-500">{doorPiece.slatLength}</td>
                    <td
                      className="report border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {doorPiece.slatCount}
                    </td>
                    <td className="report border-r border-gray-500">{motor.vendor}</td>
                    <td className="report border-r border-gray-500">{'???'}</td>
                    <td className="report border-gray-500">{motor.horsepower}</td>
                  </tr>
                </>
              );
            }
          })}

          {Array(pages)
            .fill(null)
            .map((item, pageIndex) => null)}
        </tbody>
      </table>

      <table className="w-full text-center mt-5 border-4 border-black">
        <tbody>
          <tr className="font-bold">
            <td rowSpan={2} className="w-56 report border-b-2 border-r border-black">
              <div className="flex justify-around">
                <div>編</div>
                <div>號</div>
              </div>
            </td>
            <td rowSpan={2} className="w-9 report border-b-2 border-r-2 border-black">
              <div className="flex justify-around">
                <div>數</div>
                <div>量</div>
              </div>
            </td>
            <td
              colSpan={3}
              className="report border-b border-r-2 border-black"
              style={{
                borderBottomColor: 'rgb(107, 114, 128)',
                borderLeftColor: 'rgb(107, 114, 128)',
              }}
            >
              <div className="flex justify-around">
                <div>支</div>
                <div>板</div>
              </div>
            </td>
            <td
              colSpan={4}
              className="report border-b border-r-2 border-black"
              style={{
                borderBottomColor: 'rgb(107, 114, 128)',
                borderLeftColor: 'rgb(107, 114, 128)',
              }}
            >
              <div className="flex justify-around">
                <div>門</div>
                <div>軌</div>
              </div>
            </td>
            <td colSpan={5} className="report border-b border-gray-500">
              <div className="flex justify-around">
                <div>鏈</div>
                <div>齒</div>
                <div>輪</div>
              </div>
            </td>
          </tr>
          <tr className="font-bold">
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              方向
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              大支板
            </td>
            <td className="report border-b-2 border-r-2 border-black">小支板</td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              門軌尺寸
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              門軌形式
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              材質/規格
            </td>
            <td className="report border-b-2 border-r-2 border-black">一般/防颱</td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              番號
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              齒數
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              孔徑
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              中心距
            </td>
            <td className="report border-b-2 border-black">目數</td>
          </tr>
          {itemArr.slice(index * 7, index * 7 + 7).map((item, cellIndex) => {
            // const pageIndex = index * 7 + cellIndex;

            // // predefined fields
            // const _modelData = appCtx.specs[pageIndex].modelData;
            // const _model = appCtx.specs[pageIndex].model;
            // const _count = appCtx.specs[pageIndex].count;
            // const _width = appCtx.specs[pageIndex].width;
            // const _height = appCtx.specs[pageIndex].height;
            // const _wg = appCtx.specs[pageIndex].wg;
            // const _angleIronCount = appCtx.specs[pageIndex].angleIronCount;
            // const _data = appCtx.specs[pageIndex].data;
            // const _useHook = appCtx.specs[pageIndex].useHook!;
            // const _motorIndex = appCtx.specs[pageIndex].motorIndex;
            // const _motorUnitIndex = appCtx.specs[pageIndex].motorUnitIndex;
            // const _doorTrackIndex = appCtx.specs[pageIndex].doorTrackIndex;
            // const _baseMtlIndex = appCtx.specs[pageIndex].baseMtlIndex;
            // const _doorMtlIndex = appCtx.specs[pageIndex].doorMtlIndex;
            // const _doorTrackMtlIndex = appCtx.specs[pageIndex].doorTrackMtlIndex;
            // const _doorTrackTypeIndex = appCtx.specs[pageIndex].doorTrackTypeIndex;
            // const _doorSectionLength = appCtx.specs[pageIndex].doorSectionLength;
            // const _useBakeDoorMt = appCtx.specs[pageIndex].useBakeDoorMt;
            // const _useBakeDoorTrackMt = appCtx.specs[pageIndex].useBakeDoorTrackMt;
            // const _useBakeBaseMt = appCtx.specs[pageIndex].useBakeBaseMt;
            // const _useBakeRollBox = appCtx.specs[pageIndex].useBakeRollBox;
            // const _power = appCtx.specs[pageIndex].powerIndex;
            // const _preferredBDirectionIndex = appCtx.specs[pageIndex].preferredBDirectionIndex;
            // const _rollBox = appCtx.specs[pageIndex].rollBoxIndexs;
            // const _memo = appCtx.specs[pageIndex].memoIndexs;
            // const _minA = appCtx.specs[pageIndex].minA;
            // const _minB = appCtx.specs[pageIndex].minB;
            // const _minC = appCtx.specs[pageIndex].minC;
            // const _minD = appCtx.specs[pageIndex].minD;
            // const _preferredA = appCtx.specs[pageIndex].preferredA;
            // const _preferredB = appCtx.specs[pageIndex].preferredB;
            // const _preferredC = appCtx.specs[pageIndex].preferredC;
            // const _preferredD = appCtx.specs[pageIndex].preferredD;
            // const _info = appCtx.specs[pageIndex].info;
            // const _calculatedWidth = _width
            //   ? Decimal.mul(Number(_width), 1000).toNumber()
            //   : Decimal.mul(Number(_wg), 1000).plus(Number(_preferredA)).plus(Number(_preferredC)).toNumber();

            // const specialSpec: Partial<SpecDataType> = SpecData[_model];

            // const finalSpec = Object.assign({ ...commonSpec }, specialSpec) as SpecDataType;

            const { itemName, size, roller, headBox, doorPiece, motor, guideRail, chainCog, base, memo } = item;

            if (cellIndex !== 6) {
              return (
                <>
                  <tr>
                    <td className="report border-b border-r border-gray-500">{itemName}</td>
                    <td
                      className="report border-b border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {size.qty}
                    </td>
                    {/* 方向 */}
                    <td className="report border-b border-r border-gray-500">{'???'}</td>
                    {/* 大支版 */}
                    <td className="report border-b border-r border-gray-500">{'???'}</td>
                    {/* 小支版 */}
                    <td
                      className="report border-b border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {'???'}
                    </td>
                    <td className="report border-b border-r border-gray-500">{guideRail.guideRailLength}</td>
                    <td className="report border-b border-r border-gray-500">{'???'}</td>
                    <td className="report border-b border-r border-gray-500">{guideRail.material}</td>
                    <td
                      className="report border-b border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {'???'}
                    </td>
                    <td className="report border-b border-r border-gray-500">{chainCog.sprocketWheelModel}</td>
                    <td className="report border-b border-r border-gray-500">{'???'}</td>
                    <td className="report border-b border-r border-gray-500">{chainCog.bearingInnerDiameter}</td>
                    <td className="report border-b border-r border-gray-500">{'???'}</td>
                    <td className="report border-b border-gray-500">{'???'}</td>
                  </tr>
                </>
              );
            } else {
              return (
                <>
                  <tr>
                    <td className="report border-r border-gray-500">{itemName}</td>
                    <td
                      className="report border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {size.qty}
                    </td>
                    <td className="report border-r border-gray-500">{'???'}</td>
                    <td className="report border-r border-gray-500">{'???'}</td>
                    <td
                      className="report border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {'???'}
                    </td>
                    <td className="report border-r border-gray-500">{guideRail.guideRailLength}</td>
                    <td className="report border-r border-gray-500">{'???'}</td>
                    <td className="report border-r border-gray-500">{guideRail.material}</td>
                    <td
                      className="report border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {'???'}
                    </td>
                    <td className="report border-r border-gray-500">{chainCog.sprocketWheelModel}</td>
                    <td className="report border-r border-gray-500">{'???'}</td>
                    <td className="report border-r border-gray-500">{chainCog.bearingInnerDiameter}</td>
                    <td className="report border-r border-gray-500">{'???'}</td>
                    <td className="report border-gray-500">{'???'}</td>
                  </tr>
                </>
              );
            }
          })}

          {Array(pages)
            .fill(null)
            .map((item, pageIndex) => null)}
        </tbody>
      </table>

      <table className="w-full text-center mt-5 border-4 border-black">
        <tbody>
          <tr className="font-bold">
            <td rowSpan={2} className="w-56 report border-b-2 border-r border-black">
              <div className="flex justify-around">
                <div>編</div>
                <div>號</div>
              </div>
            </td>
            <td rowSpan={2} className="w-9 report border-b-2 border-r-2 border-black">
              <div className="flex justify-around">
                <div>數</div>
                <div>量</div>
              </div>
            </td>
            <td
              colSpan={4}
              className="report border-b border-r-2 border-black"
              style={{
                borderBottomColor: 'rgb(107, 114, 128)',
                borderLeftColor: 'rgb(107, 114, 128)',
              }}
            >
              <div className="flex justify-around">
                <div>捲</div>
                <div>軸</div>
              </div>
            </td>
            <td
              colSpan={4}
              className="report border-b border-r-2 border-black"
              style={{
                borderBottomColor: 'rgb(107, 114, 128)',
                borderLeftColor: 'rgb(107, 114, 128)',
              }}
            >
              <div className="flex justify-around">
                <div>捲</div>
                <div>箱</div>
              </div>
            </td>
            <td colSpan={3} className="report border-b border-gray-500">
              <div className="flex justify-around">
                <div>底</div>
                <div>座</div>
              </div>
            </td>
          </tr>
          <tr className="font-bold">
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              口徑
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              軸承
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              總長
            </td>
            <td className="report border-b-2 border-r-2 border-black">寸法</td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              角鐵尺寸
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              形式
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              表面
            </td>
            <td className="report border-b-2 border-r-2 border-black">支數</td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              材質
            </td>
            <td className="report border-b-2 border-r border-black" style={{ borderRightColor: 'rgb(107, 114, 128)' }}>
              表面
            </td>
            <td className="report border-b-2 border-black">角鐵開口</td>
          </tr>

          {itemArr.slice(index * 7, index * 7 + 7).map((item, cellIndex) => {
            // const pageIndex = index * 7 + cellIndex;
            // // predefined fields
            // const _modelData = appCtx.specs[pageIndex].modelData;
            // const _model = appCtx.specs[pageIndex].model;
            // const _count = appCtx.specs[pageIndex].count;
            // const _width = appCtx.specs[pageIndex].width;
            // const _height = appCtx.specs[pageIndex].height;
            // const _wg = appCtx.specs[pageIndex].wg;
            // const _angleIronCount = appCtx.specs[pageIndex].angleIronCount;
            // const _data = appCtx.specs[pageIndex].data;
            // const _useHook = appCtx.specs[pageIndex].useHook!;
            // const _motorIndex = appCtx.specs[pageIndex].motorIndex;
            // const _motorUnitIndex = appCtx.specs[pageIndex].motorUnitIndex;
            // const _doorTrackIndex = appCtx.specs[pageIndex].doorTrackIndex;
            // const _baseMtlIndex = appCtx.specs[pageIndex].baseMtlIndex;
            // const _doorMtlIndex = appCtx.specs[pageIndex].doorMtlIndex;
            // const _doorTrackMtlIndex = appCtx.specs[pageIndex].doorTrackMtlIndex;
            // const _doorTrackTypeIndex = appCtx.specs[pageIndex].doorTrackTypeIndex;
            // const _doorSectionLength = appCtx.specs[pageIndex].doorSectionLength;
            // const _useBakeDoorMt = appCtx.specs[pageIndex].useBakeDoorMt;
            // const _useBakeDoorTrackMt = appCtx.specs[pageIndex].useBakeDoorTrackMt;
            // const _useBakeBaseMt = appCtx.specs[pageIndex].useBakeBaseMt;
            // const _useBakeRollBox = appCtx.specs[pageIndex].useBakeRollBox;
            // const _power = appCtx.specs[pageIndex].powerIndex;
            // const _preferredBDirectionIndex = appCtx.specs[pageIndex].preferredBDirectionIndex;
            // const _rollBox = appCtx.specs[pageIndex].rollBoxIndexs;
            // const _memo = appCtx.specs[pageIndex].memoIndexs;
            // const _minA = appCtx.specs[pageIndex].minA;
            // const _minB = appCtx.specs[pageIndex].minB;
            // const _minC = appCtx.specs[pageIndex].minC;
            // const _minD = appCtx.specs[pageIndex].minD;
            // const _preferredA = appCtx.specs[pageIndex].preferredA;
            // const _preferredB = appCtx.specs[pageIndex].preferredB;
            // const _preferredC = appCtx.specs[pageIndex].preferredC;
            // const _preferredD = appCtx.specs[pageIndex].preferredD;
            // const _info = appCtx.specs[pageIndex].info;
            // const _calculatedWidth = _width
            //   ? Decimal.mul(Number(_width), 1000).toNumber()
            //   : Decimal.mul(Number(_wg), 1000).plus(Number(_preferredA)).plus(Number(_preferredC)).toNumber();

            // const specialSpec: Partial<SpecDataType> = SpecData[_model];

            // const finalSpec = Object.assign({ ...commonSpec }, specialSpec) as SpecDataType;

            const { itemName, size, roller, headBox, doorPiece, motor, guideRail, chainCog, base, memo } = item;

            if (cellIndex !== 6) {
              return (
                <>
                  <tr>
                    <td className="report border-b border-r border-gray-500">{itemName}</td>
                    <td
                      className="report border-b border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {size.qty}
                    </td>
                    <td className="report border-b border-r border-gray-500">{roller.diameter}</td>
                    <td className="report border-b border-r border-gray-500">{roller.bearingName}</td>
                    <td className="report border-b border-r border-gray-500">{roller.bearingHousingTotalLength}</td>
                    <td
                      className="report border-b border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {roller.bearingHousingSize}
                    </td>
                    <td className="report border-b border-r border-gray-500">{headBox.angleIronSize}</td>
                    <td className="report border-b border-r border-gray-500">{'???'}</td>
                    <td className="report border-b border-r border-gray-500">{'???'}</td>
                    <td
                      className="report border-b border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {headBox.angleIronQty}
                    </td>
                    <td className="report border-b border-r border-gray-500">{base.material}</td>
                    <td className="report border-b border-r border-gray-500">{'???'}</td>
                    <td className="report border-b border-gray-500">{base.guideRailsOpening}</td>
                  </tr>
                </>
              );
            } else {
              return (
                <>
                  <tr>
                    <td className="report border-r border-gray-500">{itemName}</td>
                    <td
                      className="report border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {size.qty}
                    </td>
                    <td className="report border-r border-gray-500">{roller.diameter}</td>
                    <td className="report border-r border-gray-500">{roller.bearingName}</td>
                    <td className="report border-r border-gray-500">{roller.bearingHousingTotalLength}</td>
                    <td
                      className="report border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {roller.bearingHousingSize}
                    </td>
                    <td className="report border-r border-gray-500">{headBox.angleIronSize}</td>
                    <td className="report border-r border-gray-500">{'???'}</td>
                    <td className="report border-r border-gray-500">{'???'}</td>
                    <td
                      className="report border-r-2 border-black"
                      style={{
                        borderBottomColor: 'rgb(107, 114, 128)',
                        borderLeftColor: 'rgb(107, 114, 128)',
                      }}
                    >
                      {headBox.angleIronQty}
                    </td>
                    <td className="report border-r border-gray-500">{base.material}</td>
                    <td className="report border-r border-gray-500">{'???'}</td>
                    <td className="report border-gray-500">{base.guideRailsOpening}</td>
                  </tr>
                </>
              );
            }
          })}

          {Array(pages)
            .fill(null)
            .map((item, pageIndex) => null)}
        </tbody>
      </table>
    </div>
  );
}
