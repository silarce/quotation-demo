import classNames from 'classnames';

// gear
import InputSel, { TinputSelProps, TselectProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// css
import scss from './productForm.module.scss';

// type
import { Toption } from 'js/utils/options/options';

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
type Tcontrol_basic = {
  itemName: Tinput;
  doorModel: Tselect;
  fullWidth: Tinput;
  qty: string;
  WG: Tinput;
  material: Tselect;
  height: Tinput;
  isAntiTyphoon: TcheckBox_single;
  onCalcClick: () => void;
};

function Form_product_basic({
  //
  control,
}: {
  control?: Tcontrol_basic;
}) {
  return (
    <div className={scss.grid}>
      <InputSel {...basicConfig} caption="項目" inputProps={{}} />
      <InputSel
        {...basicConfig}
        caption="門型"
        selectProps={{
          props: {
            options: fakeOptions,
          },
        }}
      />
      <InputSel {...basicConfig} caption="全寬(L)" inputProps={{}} />
      <InputSel
        {...basicConfig}
        caption="數量"
        inputProps={{
          props: {
            value: '999',
            readOnly: true,
          },
        }}
      />
      <InputSel {...basicConfig} caption="W+G" inputProps={{}} />
      <InputSel {...basicConfig} caption="材質" selectProps={selectPropsAccessor()} />
      <InputSel {...basicConfig} caption="淨高(h)" inputProps={{}} />
      <InputSel
        {...basicConfig}
        caption="防颱"
        wrapperStyle={{ width: '140px' }}
        checkBoxProps_v2={{
          props: {
            options: [{ label: null, value: 'isAntiTyphoon' }],
          },
        }}
      />
    </div>
  );
}

// =====================================================================

type Tcontrol_ABCD = {
  gapA: Tinput;
  gapC: Tinput;
  boxB: Tinput;
  boxD: Tinput;
};

function Form_product_ABCD({
  //
  control,
}: {
  control?: Tcontrol_ABCD;
}) {
  return (
    <div className={scss.grid}>
      <InputSel {...basicConfig} caption="機械縫 A" inputProps={{}} />
      <InputSel {...basicConfig} caption="機械縫 C" inputProps={{}} />
      <InputSel {...basicConfig} caption="支板尺寸 B" inputProps={{}} />
      <InputSel {...basicConfig} caption="支板尺寸 D" inputProps={{}} />
    </div>
  );
}

// =====================================================================

type Tcontrol_motor = {
  horsepower: Tselect; // 馬力
  electricSupply: Tselect; // 電供 下拉是選單 同時選擇電壓與電相
  vendor: Tselect; // 廠商
  hasMotorSupportStand: Tselect; // 馬達支撐架
  electricMotorChainType: Tselect; // 鏈條型式 // 單排 雙排
  motorLockBox: Tselect; // 馬達鎖盒 // 防盜式 外露式
  electricMotorDirection: Tselect; // 方向 // 左右
};

function Form_product_motor({
  //
  control,
}: {
  control?: Tcontrol_motor;
}) {
  return (
    <div>
      <p className={scss.caption}>●電動機</p>
      <div className={scss.grid}>
        <InputSel {...basicConfig} caption="馬力" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="電供" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="廠商" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="馬達支撐架" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="鏈條型式" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="馬達鎖盒" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="方向" selectProps={selectPropsAccessor()} />
      </div>
    </div>
  );
}

// =====================================================================

type Tcontrol_headBox = {
  material: Tselect; // 材質  comList.headBox.material
  headBoxThickness: Tselect; // 厚度
  surface: Tselect; // 表面 comList.headBox.materialSurface
  headBoxFront: Tselect; //正面 // 正雲白 正乳白
  headBoxProtruding: Tselect; // 有無凸 //  雙凸 無凸
  isIntegratedHeadBox: Tselect; // 形式 // 一體式捲箱 捲箱加機箱
  headBoxAngleIronQuantity: Tinput; // 角鐵數量
};

function Form_product_headBox({
  //
  control,
}: {
  control?: Tcontrol_headBox;
}) {
  return (
    <div>
      <p className={scss.caption}>●捲箱</p>
      <div className={scss.grid}>
        <InputSel {...basicConfig} caption="材質" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="厚度" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="表面" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="正面" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="有無凸" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="形式" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="角鐵數量" inputProps={{}} />
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
  return (
    <div>
      <p className={scss.caption}>●捲軸</p>
      <div className={scss.grid}>
        <InputSel {...basicConfig} caption="尺寸" selectProps={selectPropsAccessor()} />
        <InputSel {...basicConfig} caption="有無凸" inputProps={{}} />
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

export type { Tcontrol_basic, Tcontrol_ABCD };
