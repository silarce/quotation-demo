import { useEffect, useMemo } from 'react';

import classNames from 'classnames';

// gear
import InputSel, { TinputSelProps, TselectProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// css
import scss from './productForm.module.scss';

// type
import { Toption } from 'js/utils/options/options';
import { TdoorModelInfoDto } from 'js/api/dtoTypes';

// api
import { useApiGetProdDoorModels } from 'js/api/api_product';

// zustand
import { useWorksheet } from 'components/page/worksDepartment/worksheet/productForm/useWorksheet';
import { useShallow } from 'zustand/react/shallow';

import {
  optionsCreator_motorSupply,
  optionsCreator_horsePower,
  optionsCreator_motorSupportStand,
  optionsCreator_motorLockBox,
  optionsCreator_chainType,
  optionsCreator_direction,
  optionsCreator_isIntegratedHeadBox,
  optionsCreator_surface,
  optionsCreator_front,
  optionsCreator_rollerSpec,
  optionsCreator_boolean,
  optionsCreator_bottomBar_2,
} from 'js/utils/options/productOptions';

// =====================================================================

// | 'slat'
// | 'bottomBar'
// | 'guideRail'
// | 'sidePlate'
// | 'roller'
// | 'motor'
// | 'motorAccessories'
// | 'headBox';

type Tinput = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps: TinputSelProps['inputProps'];
};

type Tselect = {
  value: string | null;
  value_option?: Toption;
  options: Toption[];
  onChange: (option: Toption) => void;
  selectProps: TinputSelProps['selectProps'];
};

type TcheckBox_single = {
  value: boolean;
  onChange: (bool: boolean) => void;
  checkboxProps: TinputSelProps['checkBoxProps_v2'];
};

// =====================================================================

function Form_product_basic() {
  const { res: doorModelArr, update: update_doorModel, doorModelList } = useApiGetProdDoorModels();

  // --------------------------------------------------

  const { doorModelInfo, basicSpec, setDoorModelInfo, getOptions_material, calcData } = useWorksheet(
    useShallow((state) => ({
      doorModelInfo: state.doorModelInfo,
      basicSpec: state.basicSpec,
      setDoorModelInfo: state.setDoorModelInfo,
      getOptions_material: state.getOptions_material,
      calcData: state.calcData,
      generalSpec: state.generalSpec, // 用於更新getOptions
      // avalibleComponent: state.avalibleComponents, // 用於更新getOptions
    }))
  );

  // ---------------------------------------------------------------------

  const options_doorModel: Toption[] = useMemo(() => {
    return (doorModelArr ?? []).map((doorModel) => {
      const { name } = doorModel;

      return { label: name, value: name, obj: doorModel };
    });
  }, [doorModelArr]);

  // ---------------------------------------------------------------------

  useEffect(() => {
    update_doorModel();
  }, []);

  useEffect(() => {
    if (!doorModelInfo && doorModelList) {
      const doorModelName = basicSpec.doorModelName;
      const doorModelInfo = doorModelList[doorModelName];
      setDoorModelInfo(doorModelInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doorModelList, basicSpec]);

  // ---------------------------------------------------------------------

  return (
    <div>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="項目"
          inputProps={{
            props: {
              value: basicSpec.itemName,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                basicSpec.setBasicSpec_str({ key: 'itemName', value: e.target.value });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="門型"
          selectProps={{
            props: {
              value: { value: basicSpec.doorModelName, label: basicSpec.doorModelName },
              options: options_doorModel,
              onChange: (option) => {
                const obj = option?.obj as TdoorModelInfoDto;
                setDoorModelInfo(obj);
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="全寬(L)"
          inputProps={{
            props: {
              type: 'number',
              value: basicSpec.fullWidth,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                basicSpec.setBasicSpec_strNum({ key: 'fullWidth', value: e.target.value });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="數量"
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
          inputProps={{
            props: {
              readOnly: true,
              type: 'number',
              value: basicSpec.WG,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                basicSpec.setBasicSpec_strNum({ key: 'WG', value: e.target.value });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="材質"
          selectProps={{
            props: {
              value: { value: basicSpec.material, label: basicSpec.material },
              options: getOptions_material(),
              onChange: (option) => {
                basicSpec.setBasicSpec_material(option?.value ?? '');
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="淨高(h)"
          inputProps={{
            props: {
              type: 'number',
              value: basicSpec.height,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                basicSpec.setBasicSpec_strNum({ key: 'height', value: e.target.value });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="防颱"
          wrapperStyle={{ width: '140px' }}
          checkBoxProps_v2={{
            props: {
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
      <MyButton_v2 preImg="upload" px="px32" className="block m-auto mr-0 mt-5" onClick={calcData}>
        計算
      </MyButton_v2>
    </div>
  );
}

// =====================================================================

function Form_product_ABCD() {
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

function Form_product_motor() {
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
          selectProps={{
            props: {
              options: getOptions_horsepower(),
              value: { value: motor.horsepower, label: motor.horsepower },
              onChange: (option) => {
                motor.setMotor_str({ key: 'horsepower', value: option?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="廠商"
          selectProps={{
            props: {
              options: getOptions_motorVendor(),
              value: { value: motor.vendor, label: motor.vendor },
              onChange: (option) => {
                motor.setMotor_str({ key: 'vendor', value: option?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="馬達支撐架"
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
        <InputSel
          {...basicConfig}
          caption="鏈條型式"
          selectProps={{
            props: {
              options: optionsCreator_chainType(),
              value: { value: motor.electricMotorChainType, label: motor.electricMotorChainType },
              onChange: (option) => {
                motor.setMotor_str({ key: 'electricMotorChainType', value: option?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="馬達鎖盒"
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
        <InputSel
          {...basicConfig}
          caption="方向"
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
        />
      </div>
    </div>
  );
}

// =====================================================================

function Form_product_headBox() {
  const {
    //
    headBox,
    getOptions_material,
    isIntegratedHeadBox,
    getOptions_headBoxThickness,
  } = useWorksheet(
    useShallow((state) => ({
      headBox: state.headBox,
      isIntegratedHeadBox: state.headBox.getIsIntegratedHeadBox(),
      getOptions_material: state.getOptions_material,
      getOptions_headBoxThickness: state.getOptions_headBoxThickness,
      generalSpec: state.generalSpec, // 用於更新getOptions
      avalibleComponent: state.avalibleComponents, // 用於更新getOptions
    }))
  );

  return (
    <div>
      <p className={scss.caption}>●捲箱</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="材質"
          selectProps={{
            props: {
              options: getOptions_material(),
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
          selectProps={{
            props: {
              value: { value: headBox.headBoxThickness, label: headBox.headBoxThickness + 'T' },
              options: getOptions_headBoxThickness(),
              onChange: (options) => {
                headBox.setHeadBox_str({ key: 'headBoxThickness', value: options?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="表面"
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
          selectProps={{
            props: {
              value: { value: headBox.headBoxFront, label: headBox.headBoxFront },
              options: optionsCreator_front(),
              onChange: (options) => {
                headBox.setHeadBox_str({ key: 'headBoxFront', value: options?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="有無凸"
          selectProps={{
            props: {
              value: { value: headBox.headBoxProtruding, label: headBox.headBoxProtruding },
              options: optionsCreator_rollerSpec(),
              onChange: (options) => {
                headBox.setHeadBox_str({ key: 'headBoxProtruding', value: options?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="形式"
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
          caption="角鐵數量"
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
      </div>
    </div>
  );
}

// =====================================================================

function Form_product_roller() {
  const { roller, getOptions_diameter } = useWorksheet(
    useShallow((state) => ({
      roller: state.roller,
      getOptions_diameter: state.getOptions_diameter,
      avalibleComponent: state.avalibleComponents, // 用於更新getOptions
    }))
  );

  return (
    <div>
      <p className={scss.caption}>●捲軸</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="尺寸"
          selectProps={{
            props: {
              value: { value: roller.getDiameter(), label: roller.getDiameter() },
              options: getOptions_diameter(),
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="有無凸"
          selectProps={{
            props: {
              value: { value: roller.rollerSpec, label: roller.rollerSpec },
              options: optionsCreator_rollerSpec(),
              onChange: (option) => {
                roller.setRoller_str({ key: 'rollerSpec', value: option?.value ?? '' });
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// =====================================================================

function Form_product_slat() {
  const { slat, getOptions_material } = useWorksheet(
    useShallow((state) => ({
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
        <InputSel
          {...basicConfig}
          caption="表面"
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
      </div>
    </div>
  );
}

// =====================================================================

function Form_product_guideRail() {
  const { guideRail, hasSilencingStrip, getOptions_material } = useWorksheet(
    useShallow((state) => ({
      guideRail: state.guideRail,
      hasSilencingStrip: state.guideRail.getHasSilencingStrip(),
      getOptions_material: state.getOptions_material,
      generalSpec: state.generalSpec, // 用於更新getOptions
      avalibleComponent: state.avalibleComponents, // 用於更新getOptions
    }))
  );

  return (
    <div>
      <p className={scss.caption}>●門軌</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="材質"
          selectProps={{
            props: {
              options: getOptions_material(),
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
          selectProps={{
            props: {
              value: {
                value: guideRail.guideRailThickness,
                label: guideRail.guideRailThickness,
              },
              onChange: (option) => {
                guideRail.setGuideRail_str({ key: 'guideRailThickness', value: option?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="表面"
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
        <InputSel
          {...basicConfig}
          caption="消音條"
          selectProps={{
            props: {
              options: optionsCreator_boolean(),
              value: {
                value: hasSilencingStrip,
                label: hasSilencingStrip,
              },
              onChange: (option) => {
                const bool = !!(option?.value === 'true');

                guideRail.setGuideRail_hasSilencingStrip(bool);
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="彎直"
          selectProps={{
            props: {
              options: optionsCreator_direction(),
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
        <InputSel
          {...basicConfig}
          caption="形式"
          selectProps={{
            props: {
              value: {
                value: guideRail.guideRail,
                label: guideRail.guideRail,
              },
              onChange: (option) => {
                guideRail.setGuideRail_str({ key: 'guideRail', value: option?.value ?? '' });
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// =====================================================================

function Form_product_bottomBar() {
  const { bottomBar, getOptions_material, getOptions_bottomBarAngleIronAndPlate } = useWorksheet(
    useShallow((state) => ({
      bottomBar: state.bottomBar,
      getOptions_material: state.getOptions_material,
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
          selectProps={{
            props: {
              value: { value: bottomBar.material, label: bottomBar.material },
              options: getOptions_material(),
              onChange: (option) => {
                bottomBar.setBottomBar_str({ key: 'material', value: option?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="角鐵材質"
          selectProps={{
            props: {
              value: { value: bottomBar.bottomBarAngleIron, label: bottomBar.bottomBarAngleIron },
              options: options_angleIron,
              onChange: (option) => {
                bottomBar.setBottomBar_str({ key: 'bottomBarAngleIron', value: option?.value ?? '' });
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="底座鈑材質"
          selectProps={{
            props: {
              value: { value: bottomBar.bottomBarPlate, label: bottomBar.bottomBarPlate },
              options: options_plate,
              onChange: (option) => {
                bottomBar.setBottomBar_str({ key: 'bottomBarPlate', value: option?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="類型"
          selectProps={{
            props: {
              value: { value: bottomBar.bottomBar, label: bottomBar.bottomBar },
              options: optionsCreator_bottomBar_2(),
              onChange: (option) => {
                bottomBar.setBottomBar_str({ key: 'bottomBar', value: option?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="表面"
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
      </div>
    </div>
  );
}

// =====================================================================

function Form_product_sidePlate() {
  const sidePlate = useWorksheet((state) => state.sidePlate);

  return (
    <div>
      <p className={scss.caption}>●支鈑</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="軸承"
          selectProps={{
            props: {
              isDisabled: true,
              value: { value: sidePlate.getBearingName(), label: sidePlate.getBearingName() },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="鍊條"
          selectProps={{
            props: {
              isDisabled: true,
              value: { value: sidePlate.getSprocketWheelModel(), label: sidePlate.getSprocketWheelModel() },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="方向"
          selectProps={{
            props: {
              value: { value: sidePlate.sidePlateDirection, label: sidePlate.sidePlateDirection },
              options: optionsCreator_direction(),
              onChange: (option) => {
                sidePlate.setSidePlate_str({ key: 'sidePlateDirection', value: option?.value ?? '' });
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// =====================================================================
// =====================================================================
// =====================================================================

const selectPropsAccessor = (simpleSelectProps?: Tselect): TselectProps => {
  return {
    props: {
      options: fakeOptions,
    },
  };
};

// =====================================================================

const basicConfig: TinputSelProps = {
  wrapperStyle: { gap: '10px' },
  captionStyle: { width: '100px' },
  captionSize: '18',
  captionColor: 'main',
  fontSize: '18',
  showBaseline: 'always',
  hrClassName: classNames(scss.inputSel_hr, scss.plus),
};

// ======================================================================

const fakeOptions = [
  { value: '1', label: '選項1' },
  { value: '2', label: '選項2' },
  { value: '3', label: '選項3' },
];

export {
  Form_product_basic,
  Form_product_ABCD,
  Form_product_motor,
  Form_product_headBox,
  Form_product_roller,
  Form_product_slat,
  Form_product_guideRail,
  Form_product_bottomBar,
  Form_product_sidePlate,
  //
};
