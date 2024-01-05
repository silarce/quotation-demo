import classNames from 'classnames';

// gear
import InputSel, { TinputProps, TselectProps, TdatePickerProps } from 'components/global/gear/inputAndSel/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './workSheetProductOutline.module.scss';

// ==================================================================

type ToldProductOutline = {
  itemName: string;
  doorType: string;
  fullWidth: string;
  height: string;
  boxB: string;
  quantity: string;
  material: string;
  isAntiTyphoon: boolean;
};

// type TcontrolItem = {
//   value: string;
//   onChange?: (value: string) => void;
//   disabled?: boolean;
// };

type TcontrolItem = {
  inputProps?: TinputProps;
  selectProps?: TselectProps;
  datePickerProps?: TdatePickerProps;
  disabled?: boolean;
};

type Tcontrol = {
  itemName: TcontrolItem;
  doorType: TcontrolItem;
  fullWidth: TcontrolItem;
  height: TcontrolItem;
  boxB?: TcontrolItem;
  quantity: TcontrolItem;
  material: TcontrolItem;
  isAntiTyphoon: {
    value: boolean;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
  };
};

export type { Tcontrol as Tcontrol_productOutline, ToldProductOutline };

// ==================================================================

export default function WorkSheetProductOutline({
  control,
  oldProductOutline,
  onCalcClick,
  disabled,
}: {
  control: Tcontrol;
  oldProductOutline: ToldProductOutline;
  disabled: boolean;
  onCalcClick: () => void;
}) {
  return (
    <div className={scss.container}>
      {/* left */}
      {/* <div className={scss.left}>
        <p>合約產品項目：</p>
        <div className={scss.list}>
          {configArr.map((item) => {
            const { key, label, className } = item;

            return (
              <InputSel
                key={key}
                className={classNames(scss.inputSel, className)}
                label={label}
                inputProps={{
                  value: oldProductOutline[key],
                }}
                captionColor="main"
                captionWidth={captionWidth}
                disabled={true}
                showBaseline="always"
              />
            );
          })}

          <InputSel
            className={classNames(scss.inputSel)}
            label={'防颱'}
            width="fit-content"
            checkProps={{
              propsList: { isAntiTyphoon: { value: oldProductOutline['isAntiTyphoon'] } },
              toAside: 'left',
            }}
            captionColor="main"
            captionWidth={captionWidth}
            disabled={disabled}
            showBaseline="always"
          />
        </div>
      </div> */}
      {/*  */}
      {/* <hr /> */}
      <div className={scss.right}>
        <p>調整過後項目：</p>
        <div className={scss.list}>
          {configArr.map((item) => {
            const { key, label, className, placeholder, inputType } = item;

            const theControl = control[key];

            if (!theControl) {
              return null;
            }

            return (
              <InputSel
                key={key}
                className={classNames(scss.inputSel, className)}
                label={label}
                captionColor="main"
                captionWidth={captionWidth}
                disabled={disabled || theControl.disabled}
                showBaseline="always"
                inputProps={theControl.inputProps}
                selectProps={theControl.selectProps}
                datePickerProps={theControl.datePickerProps}
              />
            );
          })}

          <InputSel
            className={classNames(scss.inputSel)}
            label={'防颱'}
            width="fit-content"
            checkProps={{
              propsList: {
                isAntiTyphoon: {
                  value: control.isAntiTyphoon.value,
                },
              },
              toAside: 'left',
              onChange: (obj) => {
                let value = false;

                if (obj.isAntiTyphoon) {
                  value = true;
                }

                control.isAntiTyphoon.onChange?.(value);
              },
            }}
            captionColor="main"
            captionWidth={captionWidth}
            disabled={disabled}
            showBaseline="always"
          />
        </div>
      </div>
      {/*  */}
      <div className={scss.btn}>
        <MyButton_v2 label="計算" preImg="upload" onClick={onCalcClick} />
      </div>
    </div>
  );
}

// ==================================================================
const captionWidth = '100px';

// type Tconfig = {
//   // key: keyof Tcontroll;
//   key: string;
//   label: string;
//   placeholder?: string;
//   className?: string;
//   inputType?: 'number';
// };

const configArr = [
  {
    key: 'itemName',
    label: '項目',
    placeholder: undefined,
    className: undefined,
    inputType: undefined,
  },
  {
    key: 'doorType',
    label: '門型',
    placeholder: undefined,
    className: undefined,
    inputType: undefined,
  },
  {
    key: 'fullWidth',
    label: '全寬(L)',
    placeholder: '請輸入全寬',
    className: undefined,
    inputType: 'number',
  },
  {
    key: 'height',
    label: '淨高(h)',
    placeholder: '請輸入淨高',
    className: undefined,
    inputType: 'number',
  },
  {
    key: 'boxB',
    label: '捲箱高(B)',
    placeholder: '請輸入捲箱高',
    className: undefined,
    inputType: 'number',
  },
  {
    key: 'quantity',
    label: '數量',
    placeholder: undefined,
    className: undefined,
    inputType: 'number',
  },
  {
    key: 'material',
    label: '材質',
    placeholder: undefined,
    className: undefined,
    inputType: undefined,
  },
] as const;
