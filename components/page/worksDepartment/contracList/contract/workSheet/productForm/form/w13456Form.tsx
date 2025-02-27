import { useMemo } from 'react';

import classNames from 'classnames';

// component;
import { Form_specialProd_location } from './specialProdForm';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import {
  Container,
  Section,
} from 'components/page/worksDepartment/contracList/contract/workSheet/productForm/productFormLayout';

// css
import scss from './productForm.module.scss';

// type

import type { Tstate_specialDoor } from 'components/page/worksDepartment/contracList/contract/workSheet/hook/useSpecialDoor';

import { TsetState, options_electricSupply, basicConfig, createElectricSupply } from './shared';

import { optionsCreator_closingType } from 'js/utils/options/productOptions';
import { findOption } from 'js/utils/options/findOption';

// ===============================================================================================================

const options_closingtype = optionsCreator_closingType();
// ===============================================================================================================

type Tstate_specialProd_w1w3 = {
  itemName: string;
  quoteType: string;
  doorModelName: string;
  qty: number;
  fullWidth: `${number}` | '';
  height: `${number}` | '';
  materialSurface: string;
  closingType: string;
  motorVoltage: 110 | 380 | null;
  motorPhase: 1 | 3 | null;
  skeleton: string;
  doorModelName_whole: () => string;
};

// ===============================================================================================================

// W1是扇形水閘門
// W3是電動油壓水閘門
// W1 W3 W4 W5 W6 是水閘門系列

const WorksheetForm_w13456 = ({
  disabled,
  state_specialDoor,
  setState_specialDoor,
  onConfirm,
  invalidKeyArr,
  readonlyKeyArr,
}: {
  disabled: boolean;
  state_specialDoor: Tstate_specialDoor;
  setState_specialDoor: React.Dispatch<React.SetStateAction<Tstate_specialDoor>>;
  onConfirm: () => void;
  invalidKeyArr: (keyof Tstate_specialDoor)[];
  readonlyKeyArr: (keyof Tstate_specialDoor)[];
}) => {
  type TsetStateAction = Partial<Tstate_specialDoor> | ((prev: Tstate_specialDoor) => Partial<Tstate_specialDoor>);

  const setState = (action: TsetStateAction) => {
    setState_specialDoor((prev) => ({
      ...prev,
      ...(typeof action === 'function' ? action(prev) : action),
    }));
  };

  const { isClosingTypeValid, isClosingTypeReadOnly } = useMemo(() => {
    const isClosingTypeValid = !invalidKeyArr.includes('closingType');
    const isClosingTypeReadOnly = readonlyKeyArr.includes('closingType');

    return {
      isClosingTypeValid,
      isClosingTypeReadOnly,
    };
  }, [invalidKeyArr, readonlyKeyArr]);

  const props = {
    state: state_specialDoor,
    setState,
    disabled,
  };

  return (
    <Container>
      <div>
        <Section>位置與編號：</Section>
        <Form_specialProd_location {...props} />
      </div>
      <div>
        <Section>設定產品基本規格：</Section>
        <Form_specialProd_basic
          {...props}
          isClosingTypeValid={isClosingTypeValid}
          isClosingTypeReadOnly={isClosingTypeReadOnly}
        />
      </div>

      <div className={classNames('relative', disabled && 'hidden')}>
        <MyButton_v2 px="px32" className="block m-auto " onClick={onConfirm}>
          確認上傳
        </MyButton_v2>
      </div>
    </Container>
  );
};

const Form_specialProd_basic = ({
  state,
  setState,
  disabled,
  customLabel_surface,
  isClosingTypeValid,
  isClosingTypeReadOnly,
}: {
  state: Tstate_specialProd_w1w3;
  setState: TsetState<Tstate_specialProd_w1w3>;
  disabled: boolean;
  customLabel_surface?: React.ReactNode;
  isClosingTypeValid: boolean;
  isClosingTypeReadOnly: boolean;
}) => {
  const {
    itemName,
    quoteType,
    // doorModelName,
    qty,
    fullWidth,
    height,
    materialSurface,
    closingType,
    motorVoltage,
    motorPhase,
    skeleton,
  } = state;

  const value_electricSupply = createElectricSupply({
    motorVoltage,
    motorPhase,
  });

  return (
    <div>
      <div className={scss.grid}>
        <InputSel {...basicConfig} disabled={true} caption="報價別" node={quoteType} showBaseline="invisible" />
        <InputSel {...basicConfig} disabled={true} caption="項目" node={itemName} showBaseline="invisible" />
        <InputSel
          {...basicConfig}
          caption="門型"
          disabled={true}
          node={state.doorModelName_whole()}
          showBaseline="invisible"
        />
        <InputSel {...basicConfig} caption="數量" disabled={true} node={qty} showBaseline="invisible" />

        <InputSel
          {...basicConfig}
          caption="全寬(L)"
          disabled={disabled}
          inputProps={{
            props: {
              type: 'number',
              min: 0,
              step: 1,
              value: fullWidth,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.validity.valid) {
                  const value = e.target.value as `${number}`;
                  setState((prev) => ({ ...prev, fullWidth: value }));
                }
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="擋水高度"
          disabled={disabled}
          inputProps={{
            props: {
              type: 'number',
              min: 0,
              step: 1,
              value: height,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.validity.valid) {
                  const value = e.target.value as `${number}`;
                  setState((prev) => ({ ...prev, height: value }));
                }
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption={customLabel_surface ?? '面材'}
          disabled={disabled}
          inputProps={{
            props: {
              value: materialSurface,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setState((prev) => ({ ...prev, materialSurface: e.target.value }));
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="電供"
          disabled={disabled}
          selectProps={{
            props: {
              options: options_electricSupply,
              value: value_electricSupply,
              onChange: (option) => {
                const value = option?.value;

                if (!value) {
                  setState({ motorPhase: null, motorVoltage: null });
                } else {
                  const { motorPhase, motorVoltage } = JSON.parse(value);
                  setState({ motorPhase, motorVoltage });
                }
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="骨架"
          disabled={disabled}
          inputProps={{
            props: {
              value: skeleton,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setState({ skeleton: e.target.value });
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="開閉方式"
          disabled={isClosingTypeReadOnly ? true : disabled}
          className={classNames(!isClosingTypeValid && scss.inValid)}
          captionClassName={classNames(!isClosingTypeValid && scss.inValid)}
          selectProps={{
            props: {
              value: findOption({ value: String(closingType), options: options_closingtype }),
              options: options_closingtype,
              onChange: (option) => {
                setState((prev) => ({ ...prev, closingType: option?.value ?? '' }));
              },
              classNames: {
                singleValue(props) {
                  return classNames(classNames(!isClosingTypeValid && scss.inValid));
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default WorksheetForm_w13456;
