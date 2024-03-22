import classNames from 'classnames';

// gear
import InputSel, { TinputSelProps, TselectProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// css
import scss from './productForm.module.scss';

// type
import { Toption } from 'js/utils/options/options';

// =====================================================================

type Tinput = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputProps: TinputSelProps['inputProps'];
};

type Tselect = {
  value: string;
  options: Toption;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectProps: TinputSelProps['selectProps'];
};

type TcheckBox_single = {
  value: boolean;
  onChange: (bool: boolean) => void;
  checkboxProps: TinputSelProps['checkBoxProps_v2'];
};

type Tcontrol_basic = {
  itemName: Tinput;
  doorModel: Tselect;
  fullWidth: Tinput;
  qty: string;
  WG: Tinput;
  material: Tselect;
  height: Tinput;
  isAntiTyphoon: TcheckBox_single;
};

// =====================================================================

export function Form_Product_basic({
  //
  control,
}: {
  control?: Tcontrol_basic;
}) {
  return (
    <div className={scss.container}>
      <p className={scss.caption01}>設定產品基本規格：</p>
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
        <InputSel
          {...basicConfig}
          caption="材質"
          selectProps={{
            props: {
              options: fakeOptions,
            },
          }}
        />
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
      <MyButton_v2 preImg="upload" className="block m-auto mr-0 mt-5">
        計算
      </MyButton_v2>
    </div>
  );
}

// =====================================================================

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
