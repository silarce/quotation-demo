import Decimal from 'decimal.js';

import * as C from 'components/otherProject/miku-frontend/index';

// ===========================================

export default function Miku_frontend_table01() {
  // const appCtx = React.useContext(C.AppContext);

  // predefined fields
  const _modelData = 'foo';
  const _model = 'foo';
  const _width = 'foo';
  const _height = 'foo';
  const _wg = 'foo';
  const _angleIronCount = 'foo';
  // const _data = appCtx.specs[index].data;
  const _useHook = 'foo';
  const _motorIndex = 'foo';
  const _motorUnitIndex = 'foo';
  const _doorTrackIndex = 'foo';
  const _baseMtlIndex = 'foo';
  const _doorMtlIndex = 'foo';
  const _doorTrackMtlIndex = 'foo';
  const _doorTrackTypeIndex = 'foo';
  const _doorSectionLength = 'foo';
  const _useBakeDoorMt = 'foo';
  const _useBakeDoorTrackMt = 'foo';
  const _useBakeBaseMt = 'foo';
  const _useBakeRollBox = 'foo';
  const _power = 'foo';
  const _preferredBDirectionIndex = 'foo';
  const _rollBox = 'foo';
  const _memo = 'foo';
  const _minA = 'foo';
  const _minB = 'foo';
  const _minC = 'foo';
  const _minD = 'foo';
  const _preferredA = '999';
  const _preferredB = '999';
  const _preferredC = '999';
  const _preferredD = '999';
  // const _calculatedWidth = _width
  //   ? Decimal.mul(Number(_width), 1000).toNumber()
  //   : Decimal.mul(Number(_wg), 1000).plus(Number(_preferredA)).plus(Number(_preferredC)).toNumber();
  const _calculatedWidth = 500;

  // const specialSpec: Partial<SpecDataType> = SpecData[_model];

  // const finalSpec = Object.assign({ ...commonSpec }, specialSpec) as SpecDataType;

  return (
    <div className="w-[500px]">
      <div className="border-l-4 border-r-4 border-black bg-gray-300">
        <C.TableHeader4 title={'foo'} />
      </div>
      <div className="grid grid-cols-2">
        <div>
          <section className="border-l-4 border-r-2 border-b-4 border-black">
            <C.TableHeader2 title="尺寸" />

            <C.TableContent2 label="數量" value={'foo'} />
            <C.TableContent2 label="型號" value={_model} />
            <C.TableContent2 label="全寬" value={`${Number(_calculatedWidth)}mm`} />
            <C.TableContent2 label="淨高" value={`${Decimal.mul(Number(_height), 1000).toNumber()}mm`} />
            <C.TableContent2
              label="W+G"
              value={`${new Decimal(_calculatedWidth)
                .minus(Number(_preferredA))
                .minus(Number(_preferredC))
                .toNumber()}mm`}
            />
            <C.TableContent2 label="機械縫 A" value={`${_preferredA}mm`} />
            <C.TableContent2 label="機械縫 C" value={`${_preferredC}mm`} />
            <C.TableContent2
              label={
                'foo'
                // _preferredBDirectionIndex != undefined && _preferredBDirectionIndex !== -1
                //   ? `支板尺寸 B*D(${finalSpec.PreferredCheckOptions[_preferredBDirectionIndex].title})`
                //   : '支板尺寸 B*D'
              }
              value={`${_preferredB}*${_preferredD}`}
            />
            <C.TableContent2
              label="捲門全高 H"
              value={`${Decimal.mul(Number(_height), 1000).plus(_preferredB).toNumber()}mm`}
            />

            <C.TableHeader2 title="捲軸" />
            <C.TableContent2
              label="捲軸尺寸"
              value={'foo'}
              parentheses={'foo'}
              // parenthesesColor={
              //   _data
              //     ? finalSpec.calculateDeflection(_data) > Decimal.div(Number(_data.bearingHousingSize), 200).toNumber()
              //       ? 'text-red-500'
              //       : ''
              //     : ''
              // }
            />
            <C.TableContent2 label="軸徑" value={`${'foo'}`} />
            <C.TableContent2 label="軸承" value={`${'foo'}`} />
            <C.TableContent2 label="總長" value={`${'foo'}`} />
            <C.TableContent2 label="寸法" value={`${'foo'}`} />
            <C.TableHeader2
              // title={'捲箱' + (_useBakeRollBox !== -1 ? '(' + finalSpec.CheckOptions[_useBakeRollBox].title + ')' : '')}
              title={'捲箱' + 'foo'}
            />
            <C.TableContent2 label="捲箱角鐵數量" value={`${_angleIronCount}`} />
            <C.TableContent2 label="捲箱角鐵尺寸" value={'foo'} />
            <C.TableContent2 value={'捲箱資訊：' + 'foo'} height={69} />
          </section>
        </div>

        <div>
          <section className="border-l-0 border-r-4 border-b-4 border-black">
            <C.TableHeader2 title={'門片' + 'foo'} />
            <C.TableContent2 label="門片材質" value={'foo'} />
            <C.TableContent2 label="門片厚度" value={'foo'} />
            <C.TableContent2
              label="門片長度"
              value={
                'foo'
                // _data &&
                // _height !== undefined &&
                // (_useHook
                //   ? _modelData?.filter((item) => item.model === _model)?.[0]?.doorTracksWithHook?.[_doorTrackIndex]
                //       ?.thickness !== '客製'
                //   : _modelData?.filter((item) => item.model === _model)?.[0]?.doorTracksWithoutHook?.[_doorTrackIndex]
                //       ?.thickness !== '客製')
                //   ? `${finalSpec.calculateDoorLength(
                //       _data,
                //       _useHook,
                //       _calculatedWidth,
                //       _preferredA,
                //       _preferredC,
                //       _height,
                //       _modelData !== null
                //         ? _useHook
                //           ? _modelData.filter((item) => item.model === _model)[0]?.doorTracksWithHook[_doorTrackIndex]
                //               .imgSrc
                //           : _modelData.filter((item) => item.model === _model)[0]?.doorTracksWithoutHook[
                //               _doorTrackIndex
                //             ].imgSrc
                //         : ''
                //     )}`
                //   : ''
              }
            />
            <C.TableContent2 label="捲片支數" value={'foo'} />
            <C.TableContent2 label="防颱勾" value={'foo'} />

            <C.TableHeader2
              title={`電動機(${'foo'})`}
              // parentheses={`${
              //   finalSpec.MotorUnitCheckOptions[_motorUnitIndex]?.title === '大同' &&
              //   _data &&
              //   _data.diameter &&
              //   _data.diameter > 10
              //     ? '需與研發部接洽'
              //     : ''
              // }`}
              parenthesesColor="text-red-500"
            />
            <C.TableContent2 label="電供" value={'foo'} />

            <C.TableContent2
              label="馬力數"
              value={'foo'}
              // parentheses={_data ? finalSpec.calculateMotor(_data, _motorIndex).toString() : ''}
              // parenthesesColor={
              //   _data
              //     ? finalSpec.MotorTable[_data.motors[_motorIndex].hp].HPValue <
              //       finalSpec.calculateMotor(_data, _motorIndex)
              //       ? 'text-red-500'
              //       : ''
              //     : ''
              // }
            />

            <C.TableHeader2 title={'門軌' + 'foo'} />
            <C.TableContent2 label="門軌材質" value={'foo'} />
            <C.TableContent2 label="門軌長度" value={'foo'} />
            <C.TableContentWithImage2 label="門軌形式" label2={'foo'} value={'foo'} image={''} />

            <C.TableHeader2 title="鏈齒輪" />
            <C.TableContent2 label="鏈齒輪番號" value={'foo'} />
            <C.TableContent2 label="大鏈輪" value={'foo'} />

            <C.TableContent2 label="孔徑" value={'foo'} />

            <C.TableHeader2 title={'底座' + 'foo'} />
            <C.TableContent2 label="底座材質" value={'foo'} />
            <C.TableContent2 label="底座開口" value={'foo'} />
          </section>
        </div>
      </div>
      <div>
        <section className="border-l-4 border-r-4 border-b-4 border-black h-24">
          <div className="px-1">
            備註：
            {'foo'}
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
