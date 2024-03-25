import { use, useEffect, useMemo } from 'react';

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
  const {
    doorModelInfo,
    basicSpec,
    setBasicSpec_str,
    setBasicSpec_bool,
    setBasicSpec_strNum,
    setDoorModelInfo,
    getOptions_material,
    setBasicSpec_material,
  } = useWorksheet((state) => ({
    doorModelInfo: state.doorModelInfo,
    basicSpec: state.basicSpec,
    setBasicSpec_str: state.setBasicSpec_str,
    setBasicSpec_bool: state.setBasicSpec_bool,
    setBasicSpec_strNum: state.setBasicSpec_strNum,
    setDoorModelInfo: state.setDoorModelInfo,
    getOptions_material: state.getOptions_material,
    setBasicSpec_material: state.setBasicSpec_material,
  }));

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
    <div className={scss.grid}>
      <InputSel
        {...basicConfig}
        caption="項目"
        inputProps={{
          props: {
            value: basicSpec.itemName,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setBasicSpec_str({ key: 'itemName', value: e.target.value });
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
              setBasicSpec_strNum({ key: 'fullWidth', value: e.target.value });
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
            type: 'number',
            value: basicSpec.WG,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setBasicSpec_strNum({ key: 'WG', value: e.target.value });
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
              setBasicSpec_material(option?.value ?? '');
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
              setBasicSpec_strNum({ key: 'height', value: e.target.value });
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
              setBasicSpec_bool({ key: 'isAntiTyphoon', value: isAntiTyphoon });
            },
          },
        }}
      />
    </div>
  );
}

// =====================================================================

function Form_product_ABCD() {
  const { ABCD, setABCD } = useWorksheet((state) => ({
    ABCD: state.ABCD,
    setABCD: state.setABCD,
  }));

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
              setABCD({ key: 'gapA', value: e.target.value });
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
              setABCD({ key: 'gapC', value: e.target.value });
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
              setABCD({ key: 'boxB', value: e.target.value });
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
              setABCD({ key: 'boxD', value: e.target.value });
            },
          },
        }}
      />
    </div>
  );
}

// =====================================================================

function Form_product_motor() {
  const { motor, setMotor_supply, setMotor_str } = useWorksheet((state) => ({
    motor: state.motor,
    setMotor_supply: state.setMotor_supply,
    setMotor_str: state.setMotor_str,
  }));

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
              options: optionsCreator_motorSupply(),
              value: { value: motor.getElectricSupply(), label: motor.getElectricSupply() },
              onChange: (option) => {
                const phase = option?.phase as string | undefined;
                const voltage = option?.voltage as string | undefined;

                if (phase && voltage) {
                  setMotor_supply({ phase, voltage });
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
              options: optionsCreator_horsePower(),
              value: { value: motor.horsepower, label: motor.horsepower },
              onChange: (option) => {
                // setMotor_horsepower(option?.value ?? '');
                setMotor_str({ key: 'horsepower', value: option?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="廠商"
          selectProps={{ props: { value: { value: motor.vendor, label: motor.vendor } } }}
        />
        <InputSel
          {...basicConfig}
          caption="馬達支撐架"
          selectProps={{
            props: {
              options: optionsCreator_motorSupportStand(),
              value: { value: motor.hasMotorSupportStand, label: motor.hasMotorSupportStand },
              onChange: (option) => {
                setMotor_str({ key: 'hasMotorSupportStand', value: option?.value ?? '' });
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
                setMotor_str({ key: 'electricMotorChainType', value: option?.value ?? '' });
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
                setMotor_str({ key: 'motorLockBox', value: option?.value ?? '' });
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
                setMotor_str({ key: 'electricMotorDirection', value: option?.value ?? '' });
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
    setHeadBox_str,
    setHeadBox_bool,
    getIsIntegratedHeadBox,
  } = useWorksheet((state) => ({
    headBox: state.headBox,
    getOptions_material: state.getOptions_material,
    setHeadBox_str: state.setHeadBox_str,
    setHeadBox_bool: state.setHeadBox_bool,
    getIsIntegratedHeadBox: state.headBox.getIsIntegratedHeadBox,
  }));

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
                setHeadBox_str({ key: 'material', value: option?.value ?? '' });
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="厚度"
          selectProps={{
            props: {
              value: { value: headBox.headBoxThickness, label: headBox.headBoxThickness },
              onChange: (options) => {
                setHeadBox_str({ key: 'headBoxThickness', value: options?.value ?? '' });
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
                setHeadBox_str({ key: 'surface', value: options?.value ?? '' });
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
                setHeadBox_str({ key: 'headBoxFront', value: options?.value ?? '' });
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
                setHeadBox_str({ key: 'headBoxProtruding', value: options?.value ?? '' });
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
              value: { value: getIsIntegratedHeadBox(), label: getIsIntegratedHeadBox() },
              onChange: (option) => {
                const value = option?.value;
                const bool = value === 'true';
                setHeadBox_bool({ key: 'isIntegratedHeadBox', value: bool });
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
                setHeadBox_str({ key: 'headBoxAngleIronQuantity', value: e.target.value });
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// =====================================================================

type Tcontrol_roller = {
  diameter: Tselect; // 直徑
  rollerSpec: Tselect; // 有無凸 //  雙凸 無凸
};

function Form_product_roller({
  //
  control,
}: {
  control?: Tcontrol_roller;
}) {
  const { roller, setRoller_str } = useWorksheet((state) => ({
    roller: state.roller,
    setRoller_str: state.setRoller_str,
  }));

  return (
    <div>
      <p className={scss.caption}>●捲軸</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="尺寸"
          selectProps={{
            props: {
              value: { value: roller.diameter, label: roller.diameter },
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
                setRoller_str({ key: 'rollerSpec', value: option?.value ?? '' });
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// =====================================================================

type Tcontrol_slat = {
  material: Tselect; // 材質 comList.slat.material;
  surface: Tselect; // 表面 comList.slat.materialSurface;
};

function Form_product_slat({
  //
  control,
}: {
  control?: Tcontrol_slat;
}) {
  return (
    <div>
      <p className={scss.caption}>●門片</p>
      <div className={scss.grid}>
        <InputSel {...basicConfig} caption="材質`" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="表面" selectProps={selectPropsAccessor()} />
      </div>
    </div>
  );
}

// =====================================================================

type Tcontrol_guideRail = {
  material: Tselect; // 材質 comList.guideRail.material;
  guideRailThickness: Tselect; // 厚度 prod.guideRailThickness
  surface: Tselect; // 表面 comList.guideRail.materialSurface;
  hasSilencingStrip: Tselect; // 消音條 // 有 無 _prod.hasSilencingStrip;
  guideRailType: Tselect; // 彎直 // 彎 直 _prod.guideRailType;
  // 編輯guideRail要同時編輯 guideRailsOpening guideRailG
  guideRail: Tselect; // 形式  // 門軌的name，下拉式選單的label為門軌的icon _prod.guideRail
};

function Form_product_guideRail({
  //
  control,
}: {
  control?: Tcontrol_guideRail;
}) {
  return (
    <div>
      <p className={scss.caption}>●門軌</p>
      <div className={scss.grid}>
        <InputSel {...basicConfig} caption="材質" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="厚度" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="表面" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="消音條" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="彎直" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="形式" selectProps={selectPropsAccessor()} />
      </div>
    </div>
  );
}

// =====================================================================

type Tcontrol_bottomBar = {
  material: Tselect; // 材質 // comList.bottomBar.material
  bottomBarAngleIron: Tselect; // 角鐵材質 // 底座角鐵
  baseMaterial: Tselect; // 底座鈑材質
  bottomBar: Tselect; // 類型 // 鋁障感型 止水型
  surface: Tselect; // 表面 //comList.bottomBar.materialSurface
};

function Form_product_bottomBar({
  //
  control,
}: {
  control?: Tcontrol_bottomBar;
}) {
  return (
    <div>
      <p className={scss.caption}>●底座</p>
      <div className={scss.grid}>
        <InputSel {...basicConfig} caption="材質" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="角鐵材質" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="底座鈑材質" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="類型" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="表面" selectProps={selectPropsAccessor()} />
      </div>
    </div>
  );
}

// =====================================================================

type Tcontrol_sidePlate = {
  bearingName: Tselect; // 軸承 // spec.bearingName
  sprocketWheelModel: Tselect; // 鍊條 // spec.sprocketWheelModel
  sidePlateDirection: Tselect; // 方向
};

function Form_product_sidePlate({
  //
  control,
}: {
  control?: Tcontrol_sidePlate;
}) {
  return (
    <div>
      <p className={scss.caption}>●支鈑</p>
      <div className={scss.grid}>
        <InputSel {...basicConfig} caption="軸承" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="鍊條" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="方向" selectProps={selectPropsAccessor()} />
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
