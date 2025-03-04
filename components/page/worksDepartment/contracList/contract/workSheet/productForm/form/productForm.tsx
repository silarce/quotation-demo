import classNames from 'classnames';
import Image from 'next/image';

// antd
import { Checkbox, Radio } from 'antd';

// gear
import InputSel, { TinputSelProps, TinputProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import {
  Container,
  Section,
  MainFormWrapper,
  FormGrid,
} from 'components/page/worksDepartment/contracList/contract/workSheet/productForm/productFormLayout';

// css
import scss from './productForm.module.scss';

// zustand
import {
  useWorksheet,
  Tworksheet,
} from 'components/page/worksDepartment/contracList/contract/workSheet/hook/useWorksheet';
import { useShallow } from 'zustand/react/shallow';

import {
  optionsCreator_motorSupportStand,
  optionsCreator_motorLockBox,
  optionsCreator_direction,
  optionsCreator_isIntegratedHeadBox,
  optionsCreator_surface,
  optionsCreator_front,
  optionsCreator_bottomBar_2,
  optionsCreator_bendStright,
  optionsCreator_quoteType,
  optionsCreator_boolean,
  optionsCreator_sprocketWheelModel,
  optionsCreator_bearingName,
} from 'js/utils/options/productOptions';

// utils
import { findOption } from 'js/utils/options/findOption';

import {
  options_boolean,
  options_前遮,
  basicConfig,
  inputNumberProps,
  getHeadBoxSvgUrl1,
  getHeadBoxSvgUrl2,
  getHeadBoxSvgUrl3,
  getHeadBoxSvgUrl4,
} from './shared';

import type { TdoorModelInfoDto } from 'js/api/dtoTypes';

// ==============================================================================

const options_doorType = optionsCreator_quoteType();

// ==============================================================================

function WorksheetForm(props: { reqPatchWorkSheet?: () => void; disabled?: boolean; calcOnly?: boolean }) {
  const { reqPatchWorkSheet = () => {}, disabled, calcOnly = false } = props;

  const { doorModelName, calcData_2, shouldCalcData, shouldCalcData2 } = useWorksheet(
    useShallow((state) => ({
      doorModelName: state.basicSpec.doorModelName,
      shouldCalcData: state.shouldCalcData,
      shouldCalcData2: state.shouldCalcData2,
      calcData_2: state.calcData_2,
    }))
  );

  const jsx = (() => {
    if (doorModelName === 'W2') {
      return (
        <>
          <Form_product_slat disabled={disabled} />
          <Form_product_guideRail disabled={disabled} />
          <Form_product_bottomBar disabled={disabled} />
          <Form_product_other disabled={disabled} />
        </>
      );
    }

    return (
      <>
        <Form_product_motor disabled={disabled} />
        <Form_product_headBox disabled={disabled} />
        <Form_product_roller disabled={disabled} />
        <Form_product_slat disabled={disabled} />
        <Form_product_guideRail disabled={disabled} />
        <Form_product_bottomBar disabled={disabled} />
        <Form_product_sidePlate disabled={disabled} />
        <Form_product_other disabled={disabled} />
      </>
    );
  })();

  return (
    <Container>
      <div>
        <Section>位置與編號：</Section>
        <Form_product_location disabled={disabled} />
      </div>
      <div>
        <Section>設定產品基本規格：</Section>
        <Form_product_basic disabled={disabled} calcOnly={calcOnly} />
      </div>
      <MainFormWrapper>
        <Section>設定產品細部規格：</Section>
        <FormGrid>
          <Form_product_ABCD disabled={disabled} />
          {jsx}
        </FormGrid>
        <div className={classNames(scss.cover, !shouldCalcData && 'hidden')}></div>
      </MainFormWrapper>
      <div>
        <Form_product_accessories disabled={disabled} />
      </div>
      <div className={classNames('relative', disabled && 'hidden')}>
        <MyButton_v2 px="px32" className={classNames('block m-auto')} onClick={calcData_2}>
          取得剩餘資料
        </MyButton_v2>
        <div className={classNames(scss.cover, !shouldCalcData && 'hidden')}></div>
      </div>
      <div className="relative">
        <WorksheetTable />
        {shouldCalcData2 && <div className={scss.cover}></div>}
      </div>
      {!calcOnly && (
        <div className={classNames('relative', disabled && 'hidden')}>
          <MyButton_v2 px="px32" className="block m-auto " onClick={reqPatchWorkSheet}>
            確認上傳
          </MyButton_v2>
          <div className={classNames(scss.cover, !shouldCalcData2 && 'hidden')}></div>
        </div>
      )}
    </Container>
  );
}

// ==============================================================================

// MARK: location
function Form_product_location({ disabled }: { disabled: boolean | undefined }) {
  const { locationArea, setLocationArea, floor, setFloor, serialNumberArr, setSerialNumber } = useWorksheet(
    useShallow((state) => ({
      locationArea: state.locationArea,
      setLocationArea: state.setLocationArea,
      floor: state.floor,
      setFloor: state.setFloor,
      serialNumberArr: state.serialNumberArr,
      setSerialNumber: state.setSerialNumber,
    }))
  );

  return (
    <div className={scss.grid}>
      <InputSel
        {...basicConfig}
        disabled={disabled}
        caption="樓層"
        inputProps={{
          props: {
            value: floor,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setFloor(e.target.value);
            },
          },
        }}
      />
      <InputSel
        {...basicConfig}
        disabled={disabled}
        caption="區域"
        inputProps={{
          props: {
            value: locationArea,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setLocationArea(e.target.value);
            },
          },
        }}
      />
      <div className="col-span-2">
        <InputSel {...basicConfig} disabled={true} caption="門編號" showBaseline="invisible" />

        {/* serialNumberArr
        setSerialNumber */}

        <ul className="grid grid-cols-8 gap-10">
          {serialNumberArr.map((value, index) => {
            return (
              <li key={index}>
                <input
                  placeholder="選填"
                  className={`border-b border-black w-full text-[${basicConfig.fontSize}px]`}
                  readOnly={disabled}
                  value={value}
                  onChange={(e) => {
                    setSerialNumber({ index, value: e.target.value });
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// =====================================================================

// MARK: basic

function Form_product_basic({ disabled, calcOnly }: { disabled: boolean | undefined; calcOnly?: boolean }) {
  const {
    //
    basicSpec,
    setDoorModelInfo,
    getOptions_material,
    calcData,
    isAntiTyphoonLock,
    getOptions_doorModelInfo,
    // isSpecialProd,
    calcTarget,
    setCalcTarget,
    // options_doorType,
  } = useWorksheet(
    useShallow((state) => ({
      doorModelInfo: state.doorModelInfo,
      basicSpec: state.basicSpec,
      setDoorModelInfo: state.setDoorModelInfo,
      getOptions_material: state.getOptions_material,
      calcData: state.calcData,
      isAntiTyphoonLock: state.getIsAntiTyphoonLock(),
      getOptions_doorModelInfo: state.getOptions_doorModelInfo,
      // isSpecialProd: state.getIsSpecialProd(),
      generalSpec: state.generalSpec, // 用於更新getOptions
      // avalibleComponent: state.avalibleComponents, // 用於更新getOptions
      calcTarget: state.calcTarget,
      setCalcTarget: state.setCalcTarget,
      // options_doorType: state.getOptions_doorModelInfo(),
      // options_type:state.getOptions
    }))
  );

  // ---------------------------------------------------------------------

  const props_quoteType: TinputSelProps = calcOnly
    ? {
        disabled: false,
        selectProps: {
          props: {
            value: { value: basicSpec.quoteType, label: basicSpec.quoteType },
            options: options_doorType,
            isSearchable: true,
            onChange: (options) => {
              basicSpec.setBasicSpec_quoteType(options?.value ?? '');
            },
          },
        },
      }
    : {
        disabled: true,
        node: basicSpec.quoteType,
        showBaseline: 'invisible',
      };

  const props_doorModelName: TinputSelProps = calcOnly
    ? {
        disabled: false,
        selectProps: {
          props: {
            options: getOptions_doorModelInfo(),
            value: { value: basicSpec.doorModelName, label: basicSpec.doorModelName },
            onChange: (option) => {
              const obj = option?.obj as TdoorModelInfoDto;
              setDoorModelInfo(obj);
            },
            onInputChange: (value, action) => {
              if (action.action === 'input-change') {
                basicSpec.setBasicSpec_doorModelName(value);
              }
            },
          },
        },
      }
    : {
        disabled: true,
        node: basicSpec.doorModelName_whole(),
        showBaseline: 'invisible',
      };

  // ---------------------------------------------------------------------

  return (
    <div>
      <div className={scss.grid}>
        <InputSel {...basicConfig} {...props_quoteType} caption="報價別" />
        <div></div>
        <InputSel
          {...basicConfig}
          disabled={disabled}
          caption="項目"
          inputProps={{
            props: {
              value: basicSpec.itemName,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                basicSpec.setBasicSpec_itemName(e.target.value);
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          {...props_doorModelName}
          // disabled={true}
          // showBaseline="invisible"
          caption="門型"
          // node={basicSpec.doorModelName}
          // node={basicSpec.doorModelName_whole()}
          // selectProps={{
          //   props: {
          //     options: isSpecialProd ? [] : getOptions_doorModelInfo(),
          //     isSearchable: isSpecialProd,
          //     menuIsOpen: isSpecialProd ? false : undefined,

          //     value: { value: basicSpec.doorModelName, label: basicSpec.doorModelName },
          //     onChange: (option) => {
          //       if (isSpecialProd) {
          //         // setDoorModelInfo(undefined);
          //         basicSpec.setBasicSpec_doorModelName(option?.value ?? '');
          //       } else {
          //         const obj = option?.obj as TdoorModelInfoDto;
          //         setDoorModelInfo(obj);
          //       }
          //     },
          //     onInputChange: (value, action) => {
          //       if (action.action === 'input-change') {
          //         basicSpec.setBasicSpec_doorModelName(value);
          //       }
          //     },
          //   },
          // }}
        />
        <InputSel
          {...basicConfig}
          caption="全寬(L)"
          disabled={disabled}
          inputProps={{
            props: {
              placeholder: '全寬與WG擇一輸入',
              type: 'number',
              value: basicSpec.fullWidth,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                basicSpec.setBasicSpec_fullWidth(e.target.value);
                setCalcTarget('fullWidth');
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="數量"
          disabled={disabled}
          inputProps={{
            props: {
              value: basicSpec.qty,
              readOnly: true,
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="W+G"
          disabled={disabled}
          inputProps={{
            props: {
              placeholder: '全寬與WG擇一輸入',
              type: 'number',
              value: basicSpec.WG,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                basicSpec.setBasicSpec_WG(e.target.value);
                setCalcTarget('WG');
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="材質"
          disabled={disabled}
          selectProps={{
            props: {
              options: getOptions_material(),
              value: { value: basicSpec.material, label: basicSpec.material },
              onChange: (option) => {
                basicSpec.setBasicSpec_material(option?.value ?? '');
              },
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  basicSpec.setBasicSpec_material(value);
                }
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="淨高(h)"
          disabled={disabled}
          inputProps={{
            props: {
              type: 'number',
              value: basicSpec.height,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                basicSpec.setBasicSpec_height(e.target.value);
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="防颱"
          disabled={disabled}
          wrapperStyle={{ width: '140px' }}
          checkBoxProps_v2={{
            props: {
              disabled: isAntiTyphoonLock,
              value: basicSpec.isAntiTyphoon ? ['isAntiTyphoon'] : [],
              options: [{ label: null, value: 'isAntiTyphoon' }],
              onChange: (strArr) => {
                const isAntiTyphoon = strArr.includes('isAntiTyphoon');
                basicSpec.setBasicSpec_bool({ key: 'isAntiTyphoon', value: isAntiTyphoon });
              },
            },
          }}
        />
      </div>

      <div className={classNames('mt-5', disabled && 'invisible')}>
        <Radio.Group
          value={calcTarget}
          onChange={(value) => {
            setCalcTarget(value.target.value);
          }}
        >
          <Radio value="fullWidth">以全寬計算</Radio>
          <Radio value="WG">以WG計算</Radio>
        </Radio.Group>

        <MyButton_v2
          //
          className={classNames('')}
          preImg="upload"
          px="px32"
          onClick={calcData}
        >
          計算
        </MyButton_v2>
      </div>
    </div>
  );
}

// =====================================================================

// MARK: ABCD

function Form_product_ABCD({ disabled }: { disabled: boolean | undefined }) {
  const ABCD = useWorksheet(
    useShallow((state) => ({
      gapA: state.ABCD.getGapA(),
      gapC: state.ABCD.getGapC(),
      boxB: state.ABCD.boxB,
      boxD: state.ABCD.boxD,
      setGapA: state.ABCD.setGapA,
      setGapC: state.ABCD.setGapC,
      setBoxB: state.ABCD.setBoxB,
      setBoxD: state.ABCD.setBoxD,
    }))
  );

  return (
    <div className={scss.grid}>
      <InputSel
        {...basicConfig}
        caption="機械縫 A"
        disabled={disabled}
        inputProps={{
          props: {
            type: 'number',
            value: ABCD.gapA,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              ABCD.setGapA(e.target.value);
            },
          },
        }}
      />
      <InputSel
        {...basicConfig}
        caption="機械縫 C"
        disabled={disabled}
        inputProps={{
          props: {
            type: 'number',
            value: ABCD.gapC,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              ABCD.setGapC(e.target.value);
            },
          },
        }}
      />
      <InputSel
        {...basicConfig}
        caption="支板尺寸 B"
        disabled={disabled}
        inputProps={{
          props: {
            type: 'number',
            value: ABCD.boxB,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              ABCD.setBoxB(e.target.value);
            },
          },
        }}
      />
      <InputSel
        {...basicConfig}
        caption="支板尺寸 D"
        disabled={disabled}
        inputProps={{
          props: {
            type: 'number',
            value: ABCD.boxD,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              ABCD.setBoxD(e.target.value);
            },
          },
        }}
      />
    </div>
  );
}

// =====================================================================

// MARK: motor

function Form_product_motor({ disabled }: { disabled: boolean | undefined }) {
  const { motor, getOptions_horsepower, getOptions_motorVendor, getOptions_electricSupply } = useWorksheet(
    useShallow((state) => ({
      motor: state.motor,
      getOptions_horsepower: state.getOptions_horsepower,
      getOptions_motorVendor: state.getOptions_motorVendor,
      getOptions_electricSupply: state.getOptions_electricSupply,
      generalSpec: state.generalSpec, // 用於更新getOptions
      avalibleComponent: state.avalibleComponents, // 用於更新getOptions
    }))
  );

  return (
    <div>
      <p className={scss.caption}>●電動機</p>
      <div className={scss.grid}>
        {/* motor */}
        <InputSel
          {...basicConfig}
          caption="電供"
          disabled={disabled}
          selectProps={{
            props: {
              options: getOptions_electricSupply(),
              value: { value: motor.getElectricSupply(), label: motor.getElectricSupply() },
              onChange: (option) => {
                const phase = option?.phase as string | undefined;
                const voltage = option?.voltage as string | undefined;

                if (phase && voltage) {
                  motor.setMotor_supply({ phase, voltage });
                }
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="馬力"
          disabled={disabled}
          selectProps={{
            props: {
              options: getOptions_horsepower(),
              value: { value: motor.horsepower, label: motor.horsepower },
              onChange: (option) => {
                motor.setMotor_str({ key: 'horsepower', value: option?.value ?? '' });
              },
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  motor.setMotor_str({ key: 'horsepower', value });
                }
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="廠商"
          disabled={disabled}
          selectProps={{
            props: {
              options: getOptions_motorVendor(),
              value: { value: motor.vendor, label: motor.vendor },
              onChange: (option) => {
                motor.setMotor_str({ key: 'vendor', value: option?.value ?? '' });
              },

              // inputValue: motor.vendor,
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  motor.setMotor_str({ key: 'vendor', value });
                }
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="馬達支撐架"
          disabled={disabled}
          selectProps={{
            props: {
              options: optionsCreator_motorSupportStand(),
              value: { value: motor.hasMotorSupportStand, label: motor.hasMotorSupportStand },
              onChange: (option) => {
                motor.setMotor_str({ key: 'hasMotorSupportStand', value: option?.value ?? '' });
              },
            },
          }}
        />
        {/* <InputSel
          {...basicConfig}
          caption="鏈條型式"
          disabled={disabled}
          selectProps={{
            props: {
              options: optionsCreator_chainType(),
              value: { value: motor.electricMotorChainType, label: motor.electricMotorChainType },
              isSearchable: isSpecialProd,
              onChange: (option) => {
                motor.setMotor_str({ key: 'electricMotorChainType', value: option?.value ?? '' });
              },
            },
          }}
        /> */}
        <InputSel
          {...basicConfig}
          caption="馬達鎖盒"
          disabled={disabled}
          selectProps={{
            props: {
              options: optionsCreator_motorLockBox(),
              value: { value: motor.motorLockBox, label: motor.motorLockBox },
              onChange: (option) => {
                motor.setMotor_str({ key: 'motorLockBox', value: option?.value ?? '' });
              },
            },
          }}
        />
        {/* <InputSel
          {...basicConfig}
          caption="方向"
          disabled={disabled}
          selectProps={{
            props: {
              options: optionsCreator_direction(),
              value: {
                value: motor.electricMotorDirection,
                label: motor.electricMotorDirection,
              },
              onChange: (option) => {
                motor.setMotor_str({ key: 'electricMotorDirection', value: option?.value ?? '' });
              },
            },
          }}
        /> */}
      </div>
    </div>
  );
}

// =====================================================================
// MARK:headBox
function Form_product_headBox({ disabled }: { disabled: boolean | undefined }) {
  const {
    //
    headBox,
    getOptions_material_stable,
    isIntegratedHeadBox,
    getOptions_headBoxThickness,

    headBoxCover,
    headBoxTopCover,
    hasWheel,
    headBoxSizeX,
    headBoxSizeY,
    headBoxSizeM,
    headBoxSizeN,
    headBoxSizeO,
    headBoxSizeP,
    headBoxSizeQ,
    setHeadBoxCover,
    setBoxTopCover,
    setHasWheel,
    setBoxXYMNOPQ,
    // getHeadBoxImage,

    boxB,
    boxD,
  } = useWorksheet(
    useShallow((state) => ({
      headBox: state.headBox,
      isIntegratedHeadBox: state.headBox.getIsIntegratedHeadBox(),
      getOptions_material_stable: state.getOptions_material_stable,
      getOptions_headBoxThickness: state.getOptions_headBoxThickness,
      generalSpec: state.generalSpec, // 用於更新getOptions
      avalibleComponent: state.avalibleComponents, // 用於更新getOptions

      headBoxCover: state.headBox.headBoxCover,
      headBoxTopCover: state.headBox.headBoxTopCover,
      hasWheel: state.headBox.hasWheel,
      headBoxSizeX: state.headBox.headBoxSizeX,
      headBoxSizeY: state.headBox.headBoxSizeY,
      headBoxSizeM: state.headBox.headBoxSizeM,
      headBoxSizeN: state.headBox.headBoxSizeN,
      headBoxSizeO: state.headBox.headBoxSizeO,
      headBoxSizeP: state.headBox.headBoxSizeP,
      headBoxSizeQ: state.headBox.headBoxSizeQ,
      setHeadBoxCover: state.headBox.setHeadBoxCover,
      setBoxTopCover: state.headBox.setBoxTopCover,
      setHasWheel: state.headBox.setHasWheel,
      setBoxXYMNOPQ: state.headBox.setBoxXYMNOPQ,
      // getHeadBoxImage: state.headBox.getHeadBoxImage,

      boxB: state.ABCD.boxB,
      boxD: state.ABCD.boxD,
    }))
  );

  const isIsIntegratedHeadBoxValid = isIntegratedHeadBox === '一體式捲箱' || isIntegratedHeadBox === '捲箱加機箱';

  const url1 = isIsIntegratedHeadBoxValid
    ? getHeadBoxSvgUrl1({
        isIntegratedHeadBox: isIntegratedHeadBox === '一體式捲箱',
        hasWheel: hasWheel === 'true',
      })
    : isIntegratedHeadBox;
  const url2 = isIsIntegratedHeadBoxValid
    ? getHeadBoxSvgUrl2({
        isIntegratedHeadBox: isIntegratedHeadBox === '一體式捲箱',
        hasWheel: hasWheel === 'true',
      })
    : isIntegratedHeadBox;
  const url3 = getHeadBoxSvgUrl3({ headBoxTopCover: headBoxTopCover === 'true' });
  const url4 = getHeadBoxSvgUrl4({ headBoxCover: headBoxCover ?? 'none' });

  return (
    <div>
      <p className={scss.caption}>●捲箱</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="材質"
          disabled={disabled}
          selectProps={{
            props: {
              options: getOptions_material_stable(),
              value: { value: headBox.material, label: headBox.material },
              onChange: (option) => {
                headBox.setHeadBox_str({ key: 'material', value: option?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="厚度"
          disabled={disabled}
          selectProps={{
            props: {
              options: getOptions_headBoxThickness(),

              value: { value: headBox.headBoxThickness, label: headBox.headBoxThickness + 'T' },
              onChange: (options) => {
                headBox.setHeadBox_str({ key: 'headBoxThickness', value: options?.value ?? '' });
              },
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  const value_num = parseFloat(value);

                  if (Number.isNaN(value_num)) {
                    return;
                  }

                  headBox.setHeadBox_str({ key: 'headBoxThickness', value: String(value_num) });
                }
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="表面"
          disabled={disabled}
          selectProps={{
            props: {
              value: { value: headBox.surface, label: headBox.surface },
              options: optionsCreator_surface(),
              onChange: (options) => {
                headBox.setHeadBox_str({ key: 'surface', value: options?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="正面"
          disabled={disabled}
          selectProps={{
            props: {
              options: optionsCreator_front(),

              value: { value: headBox.headBoxFront, label: headBox.headBoxFront },
              onChange: (options) => {
                headBox.setHeadBox_str({ key: 'headBoxFront', value: options?.value ?? '' });
              },
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  headBox.setHeadBox_str({ key: 'headBoxFront', value });
                }
              },
            },
          }}
        />
        {/* 棄用 */}
        {/* <InputSel
          {...basicConfig}
          caption="有無凸"
          disabled={disabled}
          selectProps={{
            props: {
              value: { value: headBox.headBoxProtruding, label: headBox.headBoxProtruding },
              options: optionsCreator_rollerSpec(),
              onChange: (options) => {
                headBox.setHeadBox_str({ key: 'headBoxProtruding', value: options?.value ?? '' });
              },
            },
          }}
        /> */}

        <InputSel
          {...basicConfig}
          caption="角鐵數量"
          disabled={disabled}
          inputProps={{
            props: {
              value: headBox.headBoxAngleIronQuantity,
              type: 'number',
              onChange: (e) => {
                headBox.setHeadBox_str({ key: 'headBoxAngleIronQuantity', value: e.target.value });
              },
            },
          }}
        />

        <br />

        <br />
        <br />

        <InputSel
          {...basicConfig}
          caption="形式"
          disabled={disabled}
          selectProps={{
            props: {
              options: optionsCreator_isIntegratedHeadBox(),
              value: { value: isIntegratedHeadBox, label: isIntegratedHeadBox },
              onChange: (option) => {
                const value = option?.value;
                const bool = value === 'true';
                headBox.setHeadBox_bool({ key: 'isIntegratedHeadBox', value: bool });
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="檔輪"
          disabled={disabled}
          selectProps={{
            props: {
              options: options_boolean,
              value: findOption({
                options: options_boolean,
                value: hasWheel,
              }),
              onChange: (option) => {
                const value = (option?.value ?? 'false') as 'true' | 'false';
                setHasWheel(value);
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="前遮"
          disabled={disabled}
          selectProps={{
            props: {
              options: options_前遮,
              value: findOption({
                options: options_前遮,
                value: headBoxCover ?? '',
              }),
              onChange: (option) => {
                const value = (option?.value ?? 'none') as Tworksheet['headBox']['headBoxCover'];
                setHeadBoxCover(value);
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="上蓋"
          disabled={disabled}
          selectProps={{
            props: {
              options: options_boolean,
              value: findOption({
                options: options_boolean,
                value: headBoxTopCover,
              }),
              onChange: (option) => {
                const value = (option?.value ?? 'false') as 'true' | 'false';
                setBoxTopCover(value);
              },
            },
          }}
        />

        <div className={scss.headBoxImgContainer}>
          <div>{url1 && <Image src={url1} alt={url1} width={243} height={243} />}</div>
          <div>{url2 && <Image src={url2} alt={url2} width={243} height={243} />}</div>
          <div>{url3 && <Image src={url3} alt="上蓋" width={243} height={243} />}</div>
          <div>{url4 && <Image src={url4} alt="前遮" width={243} height={243} />}</div>
        </div>

        <div className="grid gap-[25px] content-start">
          <InputSel {...basicConfig} caption="SizeB" disabled={true} showBaseline="invisible" node={boxB} />
          <InputSel {...basicConfig} caption="SizeD" disabled={true} showBaseline="invisible" node={boxD} />
          <InputSel
            {...basicConfig}
            caption="SizeX"
            disabled={disabled}
            inputProps={{
              props: {
                ...inputNumberProps,
                value: headBoxSizeX,
                onChange: (e) => {
                  if (!e.target.validity.valid) {
                    return;
                  }

                  const value = e.target.value as `${number}`;
                  setBoxXYMNOPQ({ key: 'headBoxSizeX', value: value });
                },
              },
            }}
          />
          <InputSel
            {...basicConfig}
            caption="SizeY"
            disabled={disabled}
            inputProps={{
              props: {
                ...inputNumberProps,
                value: headBoxSizeY,
                onChange: (e) => {
                  if (!e.target.validity.valid) {
                    return;
                  }

                  const value = e.target.value as `${number}`;
                  setBoxXYMNOPQ({ key: 'headBoxSizeY', value: value });
                },
              },
            }}
          />
          <InputSel
            {...basicConfig}
            caption="SizeM"
            disabled={disabled}
            inputProps={{
              props: {
                ...inputNumberProps,
                value: headBoxSizeM,
                onChange: (e) => {
                  if (!e.target.validity.valid) {
                    return;
                  }

                  const value = e.target.value as `${number}`;
                  setBoxXYMNOPQ({ key: 'headBoxSizeM', value: value });
                },
              },
            }}
          />
          <InputSel
            {...basicConfig}
            caption="SizeN"
            disabled={disabled}
            inputProps={{
              props: {
                ...inputNumberProps,
                value: headBoxSizeN,
                onChange: (e) => {
                  if (!e.target.validity.valid) {
                    return;
                  }

                  const value = e.target.value as `${number}`;
                  setBoxXYMNOPQ({ key: 'headBoxSizeN', value: value });
                },
              },
            }}
          />
          <InputSel
            {...basicConfig}
            caption="SizeO"
            disabled={disabled}
            inputProps={{
              props: {
                ...inputNumberProps,
                value: headBoxSizeO,
                onChange: (e) => {
                  if (!e.target.validity.valid) {
                    return;
                  }

                  const value = e.target.value as `${number}`;
                  setBoxXYMNOPQ({ key: 'headBoxSizeO', value: value });
                },
              },
            }}
          />
          <InputSel
            {...basicConfig}
            caption="SizeP"
            disabled={disabled}
            inputProps={{
              props: {
                ...inputNumberProps,
                value: headBoxSizeP,
                onChange: (e) => {
                  if (!e.target.validity.valid) {
                    return;
                  }

                  const value = e.target.value as `${number}`;
                  setBoxXYMNOPQ({ key: 'headBoxSizeP', value: value });
                },
              },
            }}
          />
          <InputSel
            {...basicConfig}
            caption="SizeQ"
            disabled={disabled}
            inputProps={{
              props: {
                ...inputNumberProps,
                value: headBoxSizeQ,
                onChange: (e) => {
                  if (!e.target.validity.valid) {
                    return;
                  }

                  const value = e.target.value as `${number}`;
                  setBoxXYMNOPQ({ key: 'headBoxSizeQ', value: value });
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// MARK:roller
function Form_product_roller({ disabled }: { disabled: boolean | undefined }) {
  const { roller, getOptions_diameter, diameter } = useWorksheet(
    useShallow((state) => ({
      roller: state.roller,
      getOptions_diameter: state.getOptions_diameter,

      avalibleComponent: state.avalibleComponents, // 用於更新getOptions
      diameter: state.roller.getDiameter(),
    }))
  );

  return (
    <div>
      <p className={scss.caption}>●捲軸</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="尺寸"
          disabled={disabled}
          selectProps={{
            props: {
              options: getOptions_diameter(),

              value: { value: diameter, label: diameter },
              onChange: (option) => {
                roller.setDiameter(option?.value ?? '');
              },
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  roller.setDiameter(value);
                }
              },
            },
          }}
        />
        {/* 棄用 */}
        {/* <InputSel
          {...basicConfig}
          caption="有無凸"
          disabled={disabled}
          selectProps={{
            props: {
              value: { value: roller.rollerSpec, label: roller.rollerSpec },
              options: optionsCreator_rollerSpec(),
              onChange: (option) => {
                roller.setRoller_str({ key: 'rollerSpec', value: option?.value ?? '' });
              },
            },
          }}
        /> */}
      </div>
    </div>
  );
}

// =====================================================================
// MARK:slat
function Form_product_slat({ disabled }: { disabled: boolean | undefined }) {
  const { doorModelName, slat, getOptions_material } = useWorksheet(
    useShallow((state) => ({
      doorModelName: state.basicSpec.doorModelName,
      slat: state.slat,
      getOptions_material: state.getOptions_material,
      generalSpec: state.generalSpec, // 用於更新getOptions
      // avalibleComponent: state.avalibleComponents, // 用於更新getOptions
    }))
  );

  return (
    <div>
      <p className={scss.caption}>●門片</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="材質"
          disabled={disabled}
          selectProps={{
            props: {
              value: { value: slat.material, label: slat.material },
              options: getOptions_material(),
              onChange: (option) => {
                slat.setSlat_str({ key: 'material', value: option?.value ?? '' });
              },
            },
          }}
        />
        {doorModelName !== 'W2' && (
          <InputSel
            {...basicConfig}
            caption="表面"
            disabled={disabled}
            selectProps={{
              props: {
                value: { value: slat.surface, label: slat.surface },
                options: optionsCreator_surface(),
                onChange: (option) => {
                  slat.setSlat_str({ key: 'surface', value: option?.value ?? '' });
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

// =====================================================================
// MARK:guideRail
function Form_product_guideRail({ disabled }: { disabled: boolean | undefined }) {
  const {
    doorModelName,
    guideRail,
    hasSilencingStrip,
    getOptions_material_stable,
    getOptions_guideRailThickness,
    getOptions_guideRail,
  } = useWorksheet(
    useShallow((state) => ({
      doorModelName: state.basicSpec.doorModelName,
      guideRail: state.guideRail,
      hasSilencingStrip: state.guideRail.getHasSilencingStrip(),
      getOptions_material_stable: state.getOptions_material_stable,
      getOptions_guideRailThickness: state.getOptions_guideRailThickness,
      getOptions_guideRail: state.getOptions_guideRail,

      generalSpec: state.generalSpec, // 用於更新getOptions
      avalibleComponent: state.avalibleComponents, // 用於更新getOptions
      doorModelInfo: state.doorModelInfo, // 用於更新getOptions
    }))
  );

  const props_hasSilencingStrip: TinputSelProps = (() => {
    const inputProps: TinputProps = {
      props: {
        readOnly: true,
        value: hasSilencingStrip,
      },
    };

    return { inputProps };
  })();

  return (
    <div>
      <p className={scss.caption}>●門軌</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="材質"
          disabled={disabled}
          selectProps={{
            props: {
              options: getOptions_material_stable(),
              value: {
                value: guideRail.material,
                label: guideRail.material,
              },
              onChange: (option) => {
                guideRail.setGuideRail_str({ key: 'material', value: option?.value ?? '' });
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="厚度"
          disabled={disabled}
          selectProps={{
            props: {
              options: getOptions_guideRailThickness(),

              value: {
                value: guideRail.guideRailThickness,
                label: guideRail.guideRailThickness + 'T',
              },
              onChange: (option) => {
                guideRail.setGuideRail_str({ key: 'guideRailThickness', value: option?.value ?? '' });
              },
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  const value_num = parseFloat(value);

                  if (Number.isNaN(value_num)) {
                    return;
                  }

                  guideRail.setGuideRail_str({ key: 'guideRailThickness', value: String(value_num) });
                }
              },
            },
          }}
        />

        {doorModelName !== 'W2' && (
          <InputSel
            {...basicConfig}
            caption="表面"
            disabled={disabled}
            selectProps={{
              props: {
                options: optionsCreator_surface(),
                value: {
                  value: guideRail.surface,
                  label: guideRail.surface,
                },
                onChange: (option) => {
                  guideRail.setGuideRail_str({ key: 'surface', value: option?.value ?? '' });
                },
              },
            }}
          />
        )}

        <InputSel
          //
          {...basicConfig}
          caption="消音條"
          disabled={disabled}
          {...props_hasSilencingStrip}
        />

        <InputSel
          {...basicConfig}
          caption="彎直"
          disabled={disabled}
          selectProps={{
            props: {
              options: optionsCreator_bendStright(),
              value: {
                value: guideRail.guideRailType,
                label: guideRail.guideRailType,
              },
              onChange: (option) => {
                guideRail.setGuideRail_str({ key: 'guideRailType', value: option?.value ?? '' });
              },
            },
          }}
        />

        <div>{/* 這個div是為了將下一個InputSel推到下一行 */}</div>
        {doorModelName !== 'W2' && (
          <InputSel
            {...basicConfig}
            caption="形式"
            disabled={disabled}
            selectProps={{
              withIcon: true,
              props: {
                className: scss.inputSelWithIcon,

                options: getOptions_guideRail(),
                value: {
                  value: guideRail.guideRail,
                  // label: guideRail.guideRail,
                  label: '',
                  icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${guideRail.guideRail}`,
                },
                onChange: (option) => {
                  const value = option?.value ?? '';
                  const hasSilencingStrip = option?.hasSilencingStrip as boolean;
                  let thickness = (option?.thickness ?? '') as string;
                  const width = (option?.width ?? 0) as number;
                  const opening = option?.opening as string;

                  thickness = thickness.replace('t', '');

                  guideRail.setGuideRail({
                    //
                    guideRail: value,
                    opening,
                    thickness,
                    width,
                    hasSilencingStrip,
                  });
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

// =====================================================================
// MARK:bottomBar
function Form_product_bottomBar({ disabled }: { disabled: boolean | undefined }) {
  const { doorModelName, bottomBar, getOptions_material_stable, getOptions_bottomBarAngleIronAndPlate } = useWorksheet(
    useShallow((state) => ({
      doorModelName: state.basicSpec.doorModelName,
      bottomBar: state.bottomBar,
      getOptions_material_stable: state.getOptions_material_stable,
      getOptions_bottomBarAngleIronAndPlate: state.getOptions_bottomBarAngleIronAndPlate,
      generalSpec: state.generalSpec, // 用於更新getOptions
      // avalibleComponent: state.avalibleComponents, // 用於更新getOptions
    }))
  );

  const { options_angleIron, options_plate } = getOptions_bottomBarAngleIronAndPlate();

  return (
    <div>
      <p className={scss.caption}>●底座</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="材質"
          disabled={disabled}
          selectProps={{
            props: {
              value: { value: bottomBar.material, label: bottomBar.material },
              options: getOptions_material_stable(),
              onChange: (option) => {
                bottomBar.setBottomBar_str({ key: 'material', value: option?.value ?? '' });
              },
            },
          }}
        />

        {doorModelName !== 'W2' && (
          <>
            <InputSel
              {...basicConfig}
              caption="角鐵材質"
              disabled={disabled}
              selectProps={{
                props: {
                  options: options_angleIron,

                  value: { value: bottomBar.bottomBarAngleIron, label: bottomBar.bottomBarAngleIron },
                  onChange: (option) => {
                    bottomBar.setBottomBar_str({ key: 'bottomBarAngleIron', value: option?.value ?? '' });
                  },
                  onInputChange: (value, action) => {
                    if (action.action === 'input-change') {
                      bottomBar.setBottomBar_str({ key: 'bottomBarAngleIron', value });
                    }
                  },
                },
              }}
            />

            <InputSel
              {...basicConfig}
              caption="底座板材質"
              disabled={disabled}
              selectProps={{
                props: {
                  options: options_plate,

                  value: { value: bottomBar.bottomBarPlate, label: bottomBar.bottomBarPlate },
                  onChange: (option) => {
                    bottomBar.setBottomBar_str({ key: 'bottomBarPlate', value: option?.value ?? '' });
                  },
                  onInputChange: (value, action) => {
                    if (action.action === 'input-change') {
                      bottomBar.setBottomBar_str({ key: 'bottomBarPlate', value });
                    }
                  },
                },
              }}
            />
            <InputSel
              {...basicConfig}
              caption="表面"
              disabled={disabled}
              selectProps={{
                props: {
                  value: { value: bottomBar.surface, label: bottomBar.surface },
                  options: optionsCreator_surface(),
                  onChange: (option) => {
                    bottomBar.setBottomBar_str({ key: 'surface', value: option?.value ?? '' });
                  },
                },
              }}
            />
          </>
        )}

        <InputSel
          {...basicConfig}
          caption="類型"
          disabled={disabled}
          selectProps={{
            props: {
              options: optionsCreator_bottomBar_2(),

              value: findOption({ value: bottomBar.bottomBar, options: optionsCreator_bottomBar_2() }),
              onChange: (option) => {
                bottomBar.setBottomBar_str({ key: 'bottomBar', value: option?.value ?? '' });
              },
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  bottomBar.setBottomBar_str({ key: 'bottomBar', value });
                }
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// =====================================================================
// MARK:sidePlate
function Form_product_sidePlate({ disabled }: { disabled: boolean | undefined }) {
  const { sidePlate, bearingName, sprocketWheelModel } = useWorksheet(
    useShallow((state) => ({
      sidePlate: state.sidePlate,
      bearingName: state.sidePlate.getBearingName(),
      sprocketWheelModel: state.sidePlate.getSprocketWheelModel(),
    }))
  );

  return (
    <div>
      <p className={scss.caption}>●支板</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="軸承"
          disabled={disabled}
          selectProps={{
            props: {
              value: { value: bearingName, label: bearingName },
              options: optionsCreator_bearingName(),
              onChange: (option) => {
                sidePlate.setBearingName(option?.value ?? '');
              },
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  sidePlate.setBearingName(value);
                }
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="鏈條"
          // disabled={disabled || !isSpecialProd}
          disabled={disabled}
          selectProps={{
            props: {
              value: { value: sprocketWheelModel, label: sprocketWheelModel },
              options: optionsCreator_sprocketWheelModel(),
              onChange: (option) => {
                // w  setSprocketWheelModel會同時改變gearNumber、sprocketWheelChains、electricMotorChainType
                sidePlate.setSprocketWheelModel(option?.value ?? '');
              },

              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  sidePlate.setSprocketWheelModel(value);
                }
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="方向"
          disabled={disabled}
          selectProps={{
            props: {
              value: { value: sidePlate.sidePlateDirection, label: sidePlate.sidePlateDirection },
              options: optionsCreator_direction(),
              onChange: (option) => {
                sidePlate.setSidePlate_sidePlateDirection(option?.value ?? '');
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// =====================================================================
// MARK:other
function Form_product_other({ disabled }: { disabled: boolean | undefined }) {
  const { other } = useWorksheet(useShallow((state) => ({ other: state.other })));

  const isULGuideRail = other.isULGuideRail;
  const value_isULGuideRail = isULGuideRail ? { value: 'true', label: '有' } : { value: 'false', label: '無' };

  return (
    <div>
      <p className={scss.caption}>●其他</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="UL"
          disabled={disabled}
          selectProps={{
            props: {
              value: value_isULGuideRail,
              options: optionsCreator_boolean(),
              onChange: (option) => {
                const value = option?.value === 'true';
                other.setIsULGuideRail(value);
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// =====================================================================

// MARK:accessories
function Form_product_accessories({ disabled }: { disabled: boolean | undefined }) {
  const { accessories, getOptions_accessories, setAccessories } = useWorksheet(
    useShallow((state) => ({
      accessories: state.accessories,
      getOptions_accessories: state.getOptions_accessories,
      setAccessories: state.setAccessories,
    }))
  );

  const foo = accessories.map((item) => {
    return item.name;
  });

  return (
    <div className={scss.form_product_accessories}>
      <p className={scss.title}>選配 ： </p>
      <div>
        <Checkbox.Group
          disabled={disabled}
          className={scss.checkGroup}
          // disabled={disabled}
          options={getOptions_accessories()}
          value={foo}
          onChange={(arr) => {
            setAccessories(arr as string[]);
          }}
        />
      </div>
    </div>
  );
}

// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================

// MARK:WorksheetTable

const WorksheetTable = () => {
  return (
    <div className="relative">
      <p className={scss.title}>產品規格表單： </p>
      <Table_size />
      <Table_motor />
      <Table_headBox />
      <Table_roller />
      <Table_slat />
      <Table_guideRail />
      <Table_gear />
      <Table_bottomBar />
    </div>
  );
};

// MARK:Table_size

const Table_size = () => {
  const { basicSpec, ABCD, fullWidth_mm, height_mm, WG_mm, fullHeight_mm } = useWorksheet(
    useShallow((state) => ({
      basicSpec: state.basicSpec,
      ABCD: state.ABCD,
      fullWidth_mm: state.getFullWidth_mm(),
      height_mm: state.getHeight_mm(),
      WG_mm: state.getWG_mm(),
      fullHeight_mm: state.getFullHeight_mm(),
      generalSpec: state.generalSpec,
    }))
  );

  return (
    <div className={scss.worksheetTable}>
      <div className={scss.cell}>尺寸</div>

      <div className={scss.cell}>型號</div>
      <div className={scss.cell}>{basicSpec.doorModelName}</div>

      <div className={scss.cell}>全寬</div>
      <div className={scss.cell}>{fullWidth_mm}</div>

      <div className={scss.cell}>淨高</div>
      <div className={scss.cell}>{height_mm}</div>

      <div className={scss.cell}>W+G</div>
      <div className={scss.cell}>{WG_mm}</div>

      <div className={scss.cell}>機械縫A</div>
      <div className={scss.cell}>{ABCD.getGapA()}</div>

      <div className={scss.cell}>機械縫C</div>
      <div className={scss.cell}>{ABCD.getGapC()}</div>

      <div className={scss.cell}>支板尺寸 B*D(右)</div>
      <div className={scss.cell}>{`${ABCD.boxB}*${ABCD.boxD}`}</div>

      <div className={scss.cell}>捲門全高 H</div>
      <div className={scss.cell}>{fullHeight_mm}</div>
    </div>
  );
};

// MARK:Table_motor

const Table_motor = () => {
  const { motor } = useWorksheet(
    useShallow((state) => ({
      motor: state.motor,
    }))
  );

  return (
    <div className={scss.worksheetTable}>
      <div className={scss.cell}>{`電動機(${motor.vendor})`}</div>

      <div className={scss.cell}>電供</div>
      <div className={scss.cell}>{motor.getElectricSupply()}</div>

      <div className={scss.cell}>馬力數</div>
      <div className={scss.cell}>{motor.horsepower}</div>
    </div>
  );
};

// MARK:Table_headBox
const Table_headBox = () => {
  const { headBox, angleIronSize_mm } = useWorksheet(
    useShallow((state) => ({
      headBox: state.headBox,
      angleIronSize_mm: state.getAngleIronSize_mm(),
    }))
  );

  return (
    <div className={scss.worksheetTable}>
      <div className={scss.cell}>捲箱</div>

      <div className={scss.cell}>角鐵數量</div>
      <div className={scss.cell}>{headBox.headBoxAngleIronQuantity}</div>

      <div className={scss.cell}>捲箱角鐵尺寸</div>
      <div className={scss.cell}>{angleIronSize_mm}</div>

      <div className={scss.cell}>表面</div>
      <div className={scss.cell}>{headBox.surface}</div>

      <div className={scss.cell}>捲箱資訊</div>
      <div className={classNames(scss.cell)}>{headBox.getIsIntegratedHeadBox()}</div>
    </div>
  );
};

// MARK:Table_roller
const Table_roller = () => {
  const { roller, generalSpec } = useWorksheet(
    useShallow((state) => ({
      roller: state.roller,
      generalSpec: state.generalSpec,
    }))
  );

  return (
    <div className={scss.worksheetTable}>
      <div className={scss.cell}>捲軸</div>

      <div className={scss.cell}>捲軸尺寸</div>
      <div className={scss.cell}>{roller.getDiameter()}</div>

      <div className={scss.cell}>軸徑</div>
      <div className={scss.cell}>{generalSpec?.bearingInnerDiameter}</div>

      <div className={scss.cell}>軸承</div>
      <div className={scss.cell}>{generalSpec?.bearingName}</div>

      <div className={scss.cell}>總長</div>
      <div className={scss.cell}>{generalSpec?.bearingHousingTotalLength}</div>

      <div className={scss.cell}>寸法</div>
      <div className={scss.cell}>{generalSpec?.bearingHousingSize}</div>

      <div className={scss.cell}></div>
      <div className={scss.cell}></div>
    </div>
  );
};

// MARK:Table_slat
const Table_slat = () => {
  const { slat, generalSpec, antiTyphoonHook } = useWorksheet(
    useShallow((state) => ({
      slat: state.slat,
      generalSpec: state.generalSpec,
      antiTyphoonHook: state.basicSpec.isAntiTyphoon ? '有' : '無',
    }))
  );

  return (
    <div className={scss.worksheetTable}>
      <div className={scss.cell}>門片</div>

      <div className={scss.cell}>門片材質</div>
      <div className={scss.cell}>{slat.material}</div>

      <div className={scss.cell}>門片厚度</div>
      <div className={scss.cell}>{generalSpec?.thickness}</div>

      <div className={scss.cell}>門片長度</div>
      <div className={scss.cell}>{generalSpec?.slatLength}</div>

      <div className={scss.cell}>捲片支數</div>
      <div className={scss.cell}>{slat.slatCount}</div>

      <div className={scss.cell}>表面</div>
      <div className={scss.cell}>{slat.surface}</div>

      <div className={scss.cell}>防颱勾</div>
      <div className={scss.cell}>{antiTyphoonHook}</div>
    </div>
  );
};

// MARK:Table_guideRail
const Table_guideRail = () => {
  const { guideRail, generalSpec } = useWorksheet(
    useShallow((state) => ({
      guideRail: state.guideRail,
      generalSpec: state.generalSpec,
    }))
  );

  return (
    <div className={scss.worksheetTable}>
      <div className={scss.cell}>門軌</div>

      <div className={scss.cell}>門軌材質</div>
      <div className={scss.cell}>{guideRail.material}</div>

      <div className={scss.cell}>門軌長度</div>
      <div className={scss.cell}>{generalSpec?.guideRailLength}</div>

      <div className={scss.cell}>表面</div>
      <div className={scss.cell}>{guideRail.surface}</div>

      <div className={scss.cell}>{`門軌形式(${guideRail.guideRailType})`}</div>
      <div className={scss.cell}>
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${guideRail.guideRail}`}
          alt="door-track"
          className=" h-20"
        />
      </div>
    </div>
  );
};

// MARK:Table_gear
const Table_gear = () => {
  const { generalSpec } = useWorksheet(
    useShallow((state) => ({
      generalSpec: state.generalSpec,
    }))
  );

  return (
    <div className={scss.worksheetTable}>
      <div className={scss.cell}>鏈齒輪</div>

      <div className={scss.cell}>鏈齒輪番號</div>
      <div className={scss.cell}>{generalSpec?.sprocketWheelModel}</div>

      <div className={scss.cell}>大鏈輪</div>
      <div className={scss.cell}>{generalSpec?.sprocketWheelTeethNumber}</div>

      <div className={scss.cell}>孔徑</div>
      <div className={scss.cell}>{generalSpec?.bearingInnerDiameter}</div>

      <div className={scss.cell}></div>
      <div className={scss.cell}></div>
    </div>
  );
};

// MARK:Table_bottomBar
const Table_bottomBar = () => {
  const { bottomBar, guideRail } = useWorksheet(
    useShallow((state) => ({
      bottomBar: state.bottomBar,
      guideRail: state.guideRail,
    }))
  );

  return (
    <div className={scss.worksheetTable}>
      <div className={scss.cell}>底座</div>

      <div className={scss.cell}>底座材質</div>
      <div className={scss.cell}>{bottomBar.material}</div>

      <div className={scss.cell}>底座開口</div>
      <div className={scss.cell}>{guideRail.guideRailsOpening}</div>

      <div className={scss.cell}>表面</div>
      <div className={scss.cell}>{bottomBar.surface}</div>

      <div className={scss.cell}></div>
      <div className={scss.cell}></div>
    </div>
  );
};

// =====================================================================
// =====================================================================
// =====================================================================
// =====================================================================

export default WorksheetForm;

export {
  WorksheetTable,
  Form_product_location,
  Form_product_basic,
  Form_product_ABCD,
  Form_product_motor,
  Form_product_headBox,
  Form_product_roller,
  Form_product_slat,
  Form_product_guideRail,
  Form_product_bottomBar,
  Form_product_sidePlate,
  Form_product_accessories,
  Form_product_other,
};
