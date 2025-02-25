import classNames from 'classnames';
import Image from 'next/image';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import {
  Container,
  Section,
  MainFormWrapper,
  FormGrid,
} from 'components/page/worksDepartment/contracList/contract/workSheet/productForm/productFormLayout';

// css
import scss from './productForm.module.scss';

// type
import { TupdateContractProductItemDto, TquotationProductItemDto } from 'js/api/dtoTypes';
import type { Tstate_specialDoor } from 'components/page/worksDepartment/contracList/contract/workSheet/productForm/useSpecialDoor';

import {
  TsetState,
  //
  options_motorSupportStand,
  options_electricSupply,
  options_boolean,
  options_前遮,
  basicConfig,
  inputNumberProps,
  getHeadBoxSvgUrl1,
  getHeadBoxSvgUrl2,
  getHeadBoxSvgUrl3,
  getHeadBoxSvgUrl4,
} from './shared';

import { findOption } from 'js/utils/options/findOption';

import {
  optionsCreator_motorLockBox,
  optionsCreator_direction,
  optionsCreator_isIntegratedHeadBox,
  optionsCreator_front,
  optionsCreator_bendStright,
  optionsCreator_boolean,
  optionsCreator_horsePower,
  optionsCreator_motorVender,
  optionsCreator_closingType,
  //
} from 'js/utils/options/productOptions';

const options_horsepower = optionsCreator_horsePower();
const options_motorVendor = optionsCreator_motorVender();
const options_motorLockBox = optionsCreator_motorLockBox();
const options_closingtype = optionsCreator_closingType();
const options_front = optionsCreator_front();

// ====================================================================================================================

const WorksheetForm_specialDoor = ({
  disabled,
  state_specialDoor,
  setState_specialDoor,
  onConfirm,
  customLabel,
}: {
  disabled: boolean;
  state_specialDoor: Tstate_specialDoor;
  setState_specialDoor: React.Dispatch<React.SetStateAction<Tstate_specialDoor>>;
  onConfirm: () => void;
  customLabel?: {
    surface?: React.ReactNode;
  };
}) => {
  type TsetStateAction = Partial<Tstate_specialDoor> | ((prev: Tstate_specialDoor) => Partial<Tstate_specialDoor>);

  const setState = (action: TsetStateAction) => {
    setState_specialDoor((prev) => ({
      ...prev,
      ...(typeof action === 'function' ? action(prev) : action),
    }));
  };

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
        <Form_specialProd_basic {...props} customLabel_surface={customLabel?.surface} />
      </div>
      <MainFormWrapper>
        <Section>設定產品細部規格：</Section>
        <FormGrid>
          <Form_specialProduct_ABCD {...props} />
          <Form_specialProduct_motor {...props} />
          <Form_specialProd_headBox {...props} />
          <Form_specialProd_roller {...props} />
          <Form_specialProd_guideRail {...props} />
          <Form_specialProd_bottomBar {...props} />
          <Form_specialProd_sidePlate {...props} />
          <Form_specailProd_other {...props} />
        </FormGrid>
      </MainFormWrapper>

      <div className={classNames('relative', disabled && 'hidden')}>
        <MyButton_v2 px="px32" className="block m-auto " onClick={onConfirm}>
          確認上傳
        </MyButton_v2>
      </div>
    </Container>
  );
};

// ====================================================================================================================

// MARK:Form_specialProd_location
type Tstate_specialProd_location = {
  serialNumberArr: string[];
  floor: string;
  locationArea: string;
};

const Form_specialProd_location = ({
  state: { serialNumberArr, floor, locationArea },
  setState,
  disabled,
}: {
  state: Tstate_specialProd_location;
  setState: TsetState<Tstate_specialProd_location>;
  disabled: boolean;
}) => {
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
              setState((prev) => ({ ...prev, floor: e.target.value }));
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
              setState((prev) => ({ ...prev, locationArea: e.target.value }));
            },
          },
        }}
      />
      <div className="col-span-2">
        <InputSel {...basicConfig} disabled={true} caption="門編號" showBaseline="invisible" />

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
                    setState((prev) => {
                      const copy = [...prev.serialNumberArr];
                      copy[index] = e.target.value;

                      return {
                        ...prev,
                        serialNumberArr: copy,
                      };
                    });
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

// MARK:Form_specialProd_basic
type Tstate_specialProd_basic = {
  itemName: string;
  quoteType: string;
  doorModelName: string;
  qty: number;
  fullWidth: `${number}` | '';
  WG: `${number}` | '';
  height: `${number}` | '';
  materialName: string;
  materialSurface: string;
  isAntiTyphoon: boolean;
  closingType: string;
};

const Form_specialProd_basic = ({
  state: {
    itemName,
    quoteType,
    doorModelName,
    fullWidth,
    WG,
    height,
    qty,
    materialName,
    materialSurface,
    isAntiTyphoon,
    closingType,
  },
  setState,
  disabled,
  customLabel_surface,
}: {
  state: Tstate_specialProd_basic;
  setState: TsetState<Tstate_specialProd_basic>;
  disabled: boolean;
  customLabel_surface?: React.ReactNode;
}) => {
  return (
    <div>
      <div className={scss.grid}>
        <InputSel {...basicConfig} disabled={true} caption="報價別" node={quoteType} showBaseline="invisible" />
        <InputSel {...basicConfig} disabled={true} caption="項目" node={itemName} showBaseline="invisible" />
        <InputSel {...basicConfig} caption="門型" disabled={true} node={doorModelName} showBaseline="invisible" />
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
          caption="W+G"
          disabled={disabled}
          inputProps={{
            props: {
              type: 'number',
              min: 0,
              step: 1,
              value: WG,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.validity.valid) {
                  const value = e.target.value as `${number}`;
                  setState((prev) => ({ ...prev, WG: value }));
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
          caption="材質"
          disabled={disabled}
          inputProps={{
            props: {
              value: materialName,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setState((prev) => ({ ...prev, materialName: e.target.value }));
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption={customLabel_surface ?? '表面'}
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
          caption="防颱"
          disabled={disabled}
          wrapperStyle={{ width: '140px' }}
          checkBoxProps_v2={{
            props: {
              disabled,
              value: isAntiTyphoon ? ['isAntiTyphoon'] : [],
              options: [{ label: null, value: 'isAntiTyphoon' }],
              onChange: (strArr) => {
                const isAntiTyphoon = strArr.includes('isAntiTyphoon');
                setState((prev) => ({ ...prev, isAntiTyphoon }));
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="開閉方式"
          disabled={disabled}
          selectProps={{
            props: {
              value: findOption({ value: String(closingType), options: options_closingtype }),
              options: options_closingtype,
              onChange: (option) => {
                setState((prev) => ({ ...prev, closingType: option?.value ?? '' }));
              },
            },
          }}
        />
      </div>
    </div>
  );
};

// MARK:Form_specialProduct_ABCD

type Tstate_specialProduct_ABCD = {
  gapA: `${number}` | '';
  gapC: `${number}` | '';
  boxB: `${number}` | '';
  boxD: `${number}` | '';
};

function Form_specialProduct_ABCD({
  state: { gapA, gapC, boxB, boxD },
  setState,
  disabled,
}: {
  state: Tstate_specialProduct_ABCD;
  setState: TsetState<Tstate_specialProduct_ABCD>;
  disabled: boolean;
}) {
  return (
    <div className={scss.grid}>
      <InputSel
        {...basicConfig}
        caption="機械縫 A"
        disabled={disabled}
        inputProps={{
          props: {
            type: 'number',
            min: 0,
            step: 1,
            value: gapA,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.validity.valid) {
                setState((prev) => ({ ...prev, gapA: e.target.value as `${number}` }));
              }
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
            min: 0,
            step: 1,
            value: gapC,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.validity.valid) {
                setState((prev) => ({ ...prev, gapC: e.target.value as `${number}` }));
              }
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
            min: 0,
            step: 1,
            value: boxB,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.validity.valid) {
                setState((prev) => ({ ...prev, boxB: e.target.value as `${number}` }));
              }
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
            min: 0,
            step: 1,
            value: boxD,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.validity.valid) {
                setState((prev) => ({ ...prev, boxD: e.target.value as `${number}` }));
              }
            },
          },
        }}
      />
    </div>
  );
}

// MARK:Form_specialProduct_motor
type Tprops_specialProduct_motor = {
  motorVoltage: 110 | 380 | null;
  motorPhase: 1 | 3 | null;
  horsepower: string;
  motorVendor: string;
  hasMotorSupportStand: boolean;
  motorLockBox: string;
};

function Form_specialProduct_motor({
  state: { motorVoltage, motorPhase, horsepower, motorVendor, hasMotorSupportStand, motorLockBox },
  setState,
  disabled,
}: {
  state: Tprops_specialProduct_motor;
  setState: TsetState<Tprops_specialProduct_motor>;
  disabled: boolean | undefined;
}) {
  let value_electricSupply = {
    value: JSON.stringify({ motorPhase, motorVoltage }),
    label: `${motorPhase === 1 ? '單' : motorPhase === 3 ? '三' : motorPhase}相 ${motorVoltage}V`,
  };

  if (!motorVoltage && !motorPhase) {
    value_electricSupply = { value: JSON.stringify({ motorPhase: null, motorVoltage: null }), label: '無' };
  }

  const value_horsepower = findOption({ value: horsepower, options: options_horsepower });
  const value_motorVendor = findOption({ value: motorVendor, options: options_motorVendor });
  const value_motorSupportStand = findOption({
    value: String(hasMotorSupportStand),
    options: options_motorSupportStand,
  });
  const value_motorLockBox = findOption({ value: motorLockBox, options: options_motorLockBox });

  return (
    <div>
      <p className={scss.caption}>●電動機</p>
      <div className={scss.grid}>
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
          caption="馬力"
          disabled={disabled}
          selectProps={{
            props: {
              options: options_horsepower,
              isSearchable: true,
              value: value_horsepower,
              onChange: (option) => {
                setState({ horsepower: option?.value ?? '' });
              },
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  setState({ horsepower: value });
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
              options: options_motorVendor,
              isSearchable: true,
              value: value_motorVendor,
              onChange: (option) => {
                setState({ motorVendor: option?.value ?? '' });
              },
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  setState({ motorVendor: value });
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
              options: options_motorSupportStand,
              value: value_motorSupportStand,
              onChange: (option) => {
                setState({ hasMotorSupportStand: option?.value === 'true' });
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="馬達鎖盒"
          disabled={disabled}
          selectProps={{
            props: {
              options: options_motorLockBox,
              value: value_motorLockBox,
              isSearchable: true,
              onChange: (option) => {
                setState({ motorLockBox: option?.value ?? '' });
              },
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  setState({ motorLockBox: value });
                }
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// MARK:Form_specialProd_headBox

type Tstate_specialProd_headBox = {
  headBoxThickness: `${number}` | '';
  headBoxFront: string;
  headBoxAngleIronQuantity: `${number}` | '';
  isIntegratedHeadBox: boolean;
  boxB: `${number}` | '';
  boxD: `${number}` | '';

  hasWheel: boolean;
  headBoxCover: TupdateContractProductItemDto['headBoxCover'] | null;
  headBoxTopCover: boolean;

  headBoxSizeX: `${number}` | '';
  headBoxSizeY: `${number}` | '';
  headBoxSizeM: `${number}` | '';
  headBoxSizeN: `${number}` | '';
  headBoxSizeO: `${number}` | '';
  headBoxSizeP: `${number}` | '';
  headBoxSizeQ: `${number}` | '';

  upperMask: boolean;
};

function Form_specialProd_headBox({
  //
  state: {
    headBoxThickness,
    headBoxFront,
    headBoxAngleIronQuantity,
    isIntegratedHeadBox,
    boxB,
    boxD,
    hasWheel,
    headBoxCover,
    headBoxTopCover,
    headBoxSizeX,
    headBoxSizeY,
    headBoxSizeM,
    headBoxSizeN,
    headBoxSizeO,
    headBoxSizeP,
    headBoxSizeQ,

    upperMask,
  },
  setState,
  disabled,
}: {
  state: Tstate_specialProd_headBox;
  setState: TsetState<Tstate_specialProd_headBox>;
  disabled: boolean | undefined;
}) {
  const url1 = getHeadBoxSvgUrl1({ isIntegratedHeadBox, hasWheel });
  const url2 = getHeadBoxSvgUrl2({ isIntegratedHeadBox, hasWheel });
  const url3 = getHeadBoxSvgUrl3({ headBoxTopCover });
  const url4 = getHeadBoxSvgUrl4({ headBoxCover: headBoxCover ?? 'none' });

  return (
    <div>
      <p className={scss.caption}>●捲箱</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="厚度"
          disabled={disabled}
          inputProps={{
            props: {
              value: headBoxThickness,
              type: 'number',
              min: 0,
              step: 0,
              onChange: (e) => {
                if (e.target.validity.valid) {
                  setState((prev) => ({ ...prev, headBoxThickness: e.target.value as `${number}` }));
                }
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
              options: options_front,
              isSearchable: true,

              value: findOption({
                value: headBoxFront,
                options: options_front,
              }),
              onChange: (options) => {
                const value = options?.value ?? '';
                setState((prev) => ({ ...prev, headBoxFront: value }));
              },
              onInputChange: (value, action) => {
                if (action.action === 'input-change') {
                  setState((prev) => ({ ...prev, headBoxFront: value }));
                }
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="角鐵數量"
          disabled={disabled}
          inputProps={{
            props: {
              value: headBoxAngleIronQuantity,
              type: 'number',
              min: 0,
              step: 0,
              onChange: (e) => {
                if (e.target.validity.valid) {
                  setState((prev) => ({ ...prev, headBoxAngleIronQuantity: e.target.value as `${number}` }));
                }
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="形式"
          disabled={disabled}
          selectProps={{
            props: {
              options: optionsCreator_isIntegratedHeadBox(),
              value: findOption({
                value: String(isIntegratedHeadBox),
                options: optionsCreator_isIntegratedHeadBox(),
              }),
              onChange: (option) => {
                const value = option?.value;
                const bool = value === 'true';
                setState((prev) => ({ ...prev, isIntegratedHeadBox: bool }));
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
                value: String(hasWheel),
              }),
              onChange: (option) => {
                const value = (option?.value ?? 'false') as 'true' | 'false';
                setState((prev) => ({ ...prev, hasWheel: value === 'true' }));
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
                const value = (option?.value ?? 'none') as NonNullable<TquotationProductItemDto['headBoxCover']>;
                setState((prev) => ({ ...prev, headBoxCover: value }));
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="上遮"
          disabled={disabled}
          selectProps={{
            props: {
              options: options_boolean,
              value: findOption({
                options: options_boolean,
                value: String(upperMask),
              }),
              onChange: (option) => {
                const value = (option?.value ?? 'false') as 'true' | 'false';
                setState((prev) => ({ ...prev, upperMask: value === 'true' }));
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
                value: String(headBoxTopCover),
              }),
              onChange: (option) => {
                const value = (option?.value ?? 'false') as 'true' | 'false';
                setState((prev) => ({ ...prev, headBoxTopCover: value === 'true' }));
              },
            },
          }}
        />

        <div className={scss.headBoxImgContainer}>
          <div>{url1 && <Image src={url1} alt="" width={243} height={243} />}</div>
          <div>{url2 && <Image src={url2} alt="" width={243} height={243} />}</div>
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
                  if (e.target.validity.valid) {
                    const value = e.target.value as `${number}`;
                    setState((prev) => ({ ...prev, headBoxSizeX: value }));
                  }
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
                  if (e.target.validity.valid) {
                    const value = e.target.value as `${number}`;
                    setState((prev) => ({ ...prev, headBoxSizeY: value }));
                  }
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
                  if (e.target.validity.valid) {
                    const value = e.target.value as `${number}`;
                    setState((prev) => ({ ...prev, headBoxSizeM: value }));
                  }
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
                  if (e.target.validity.valid) {
                    const value = e.target.value as `${number}`;
                    setState((prev) => ({ ...prev, headBoxSizeN: value }));
                  }
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
                  if (e.target.validity.valid) {
                    const value = e.target.value as `${number}`;
                    setState((prev) => ({ ...prev, headBoxSizeO: value }));
                  }
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
                  if (e.target.validity.valid) {
                    const value = e.target.value as `${number}`;
                    setState((prev) => ({ ...prev, headBoxSizeP: value }));
                  }
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
                  if (e.target.validity.valid) {
                    const value = e.target.value as `${number}`;
                    setState((prev) => ({ ...prev, headBoxSizeQ: value }));
                  }
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

// MARK:Form_specialProd_roller

type Tstate_specialProd_roller = {
  diameter: `${number}` | '';
};

function Form_specialProd_roller({
  state: { diameter },
  setState,
  disabled,
}: {
  state: Tstate_specialProd_roller;
  setState: TsetState<Tstate_specialProd_roller>;
  disabled: boolean | undefined;
}) {
  return (
    <div>
      <p className={scss.caption}>●捲軸</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="尺寸"
          disabled={disabled}
          inputProps={{
            props: {
              type: 'number',
              min: 0,
              step: 0,
              value: diameter,
              onChange: (e) => {
                if (e.target.validity.valid) {
                  setState((prev) => ({ ...prev, diameter: e.target.value as `${number}` }));
                }
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// MARK:Form_specialProd_slat

// type Tstate_specialProd_slat = {};

// function Form_specialProd_slat({ disabled }: { disabled: boolean | undefined }) {
//   return (
//     <div>
//       <p className={scss.caption}>●門片</p>
//       <div className={scss.grid}></div>
//     </div>
//   );
// }

// MARK:Form_specialProd_guideRail

type Tstate_specialProd_guideRail = {
  guideRailThickness: `${number}` | '';
  hasSilencingStrip: boolean;
  guideRailType: string;
  guideRail: string;
};

function Form_specialProd_guideRail({
  state: { guideRailThickness, hasSilencingStrip, guideRailType, guideRail },
  setState,
  disabled,
}: {
  state: Tstate_specialProd_guideRail;
  setState: TsetState<Tstate_specialProd_guideRail>;
  disabled: boolean | undefined;
}) {
  return (
    <div>
      <p className={scss.caption}>●門軌</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="厚度"
          disabled={disabled}
          inputProps={{
            props: {
              type: 'number',
              min: 0,
              step: 0,
              value: guideRailThickness,
              onChange: (e) => {
                if (e.target.validity.valid) {
                  setState((prev) => ({ ...prev, guideRailThickness: e.target.value as `${number}` }));
                }
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="消音條"
          disabled={disabled}
          selectProps={{
            props: {
              value: findOption({ value: String(hasSilencingStrip), options: options_boolean }),
              options: options_boolean,
              onChange: (option) => {
                const value = option?.value === 'true';
                setState((prev) => ({ ...prev, hasSilencingStrip: value }));
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="彎直"
          disabled={disabled}
          selectProps={{
            props: {
              options: optionsCreator_bendStright(),
              value: findOption({ value: guideRailType, options: optionsCreator_bendStright() }),
              onChange: (option) => {
                setState((prev) => ({ ...prev, guideRailType: option?.value ?? '' }));
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="形式"
          disabled={disabled}
          inputProps={{
            props: {
              value: guideRail,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setState((prev) => ({ ...prev, guideRail: e.target.value }));
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// MAKR:Form_specialProd_bottomBar

type Tstate_specialProd_bottomBar = {
  bottomBarAngleIron: string;
  bottomBarPlate: string;
  bottomBar: string;
};

function Form_specialProd_bottomBar({
  state: { bottomBarAngleIron, bottomBarPlate, bottomBar },
  setState,
  disabled,
}: {
  state: Tstate_specialProd_bottomBar;
  setState: TsetState<Tstate_specialProd_bottomBar>;
  disabled: boolean | undefined;
}) {
  return (
    <div>
      <p className={scss.caption}>●底座</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="角鐵材質"
          disabled={disabled}
          inputProps={{
            props: {
              value: bottomBarAngleIron,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setState((prev) => ({ ...prev, bottomBarAngleIron: e.target.value }));
              },
            },
          }}
        />

        <InputSel
          {...basicConfig}
          caption="底座板材質"
          disabled={disabled}
          inputProps={{
            props: {
              value: bottomBarPlate,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setState((prev) => ({ ...prev, bottomBarPlate: e.target.value }));
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="類型"
          disabled={disabled}
          inputProps={{
            props: {
              value: bottomBar,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setState((prev) => ({ ...prev, bottomBar: e.target.value }));
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// MARK:Form_specialProd_sidePlate

type Tstate_specialProd_sidePlate = {
  bearingName: string;
  sprocketWheelModel: string;
  sidePlateDirection: string;
};

function Form_specialProd_sidePlate({
  state: { bearingName, sprocketWheelModel, sidePlateDirection },
  setState,
  disabled,
}: {
  state: Tstate_specialProd_sidePlate;
  setState: TsetState<Tstate_specialProd_sidePlate>;
  disabled: boolean | undefined;
}) {
  return (
    <div>
      <p className={scss.caption}>●支板</p>
      <div className={scss.grid}>
        <InputSel
          {...basicConfig}
          caption="軸承"
          disabled={disabled}
          inputProps={{
            props: {
              value: bearingName,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setState((prev) => ({ ...prev, bearingName: e.target.value }));
              },
            },
          }}
        />
        <InputSel
          {...basicConfig}
          caption="鏈條"
          disabled={disabled}
          inputProps={{
            props: {
              value: sprocketWheelModel,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setState((prev) => ({ ...prev, sprocketWheelModel: e.target.value }));
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
              value: findOption({ value: sidePlateDirection, options: optionsCreator_direction() }),
              options: optionsCreator_direction(),
              onChange: (option) => {
                setState((prev) => ({ ...prev, sidePlateDirection: option?.value ?? '' }));
              },
            },
          }}
        />
      </div>
    </div>
  );
}

// MARK:Form_specailProd_other
type Tstate_specialProd_other = {
  isULGuideRail: boolean;
  skeleton: string;
};

function Form_specailProd_other({
  state: { isULGuideRail, skeleton },
  setState,
  disabled,
}: {
  state: Tstate_specialProd_other;
  setState: TsetState<Tstate_specialProd_other>;
  disabled: boolean | undefined;
}) {
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
              value: findOption({ value: String(isULGuideRail), options: optionsCreator_boolean() }),
              options: optionsCreator_boolean(),
              onChange: (option) => {
                const value = option?.value === 'true';
                setState({ isULGuideRail: value });
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
      </div>
    </div>
  );
}

export default WorksheetForm_specialDoor;

export {
  Form_specialProd_basic,
  Form_specialProd_location,
  Form_specialProduct_ABCD,
  Form_specialProduct_motor,
  Form_specialProd_headBox,
  Form_specialProd_roller,
  Form_specialProd_guideRail,
  Form_specialProd_bottomBar,
  Form_specialProd_sidePlate,
  Form_specailProd_other,
};
