import classNames from 'classnames';

// gear
import InputSel, { TselectProps, TcheckProps } from 'components/global/gear/inputAndSel/inputSel';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { OptionWithIcon01 } from 'components/global/gear/select/optionWithIcon';
import { SingleValueWithIcon01 } from 'components/global/gear/select/singleValueWithIcon';

import scss from './workSheetProductDetail01.module.scss';
// other
import { Toption } from 'js/utils/options/options';
import { optionsCre_doorTrack_normal } from 'js/utils/options/doorTrackOptions';

// ============================================================================

type TcontrolItem = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  forbidden?: boolean;
  icon?: string;
  optionArr?: Toption[];
  checkBarOptionArr?: { key: string; label: string }[];
};

type Tcontrol = {
  reel: {
    [key: string]: TcontrolItem | undefined;
    size: TcontrolItem;
    hasConvex: TcontrolItem;
  };
  reelBox: {
    [key: string]: TcontrolItem | undefined;
    material: TcontrolItem;
    thickness: TcontrolItem;
    surface: TcontrolItem;
    front: TcontrolItem;
    hasConvex: TcontrolItem;
    type: TcontrolItem;
  };
  base: {
    [key: string]: TcontrolItem | undefined;
    material: TcontrolItem;
    angleMaterial: TcontrolItem;
    baseMaterial: TcontrolItem;
    type: TcontrolItem;
    surface: TcontrolItem;
  };
  support: {
    [key: string]: TcontrolItem | undefined;
    bearing: TcontrolItem;
    chain: TcontrolItem;
  };
  //
  doorPiece: {
    [key: string]: TcontrolItem | undefined;
    material: TcontrolItem;
    surface: TcontrolItem;
  };
  motor: {
    [key: string]: TcontrolItem | undefined;
    horsepower: TcontrolItem;
    manufacturer: TcontrolItem;
    powerSupply: TcontrolItem;
    voltage: TcontrolItem;
    support: TcontrolItem;
    chainType: TcontrolItem;
    lockBox: TcontrolItem;
  };
  doorTrack: {
    [key: string]: TcontrolItem | undefined;
    material: TcontrolItem;
    thickness: TcontrolItem;
    surface: TcontrolItem;
    silencer: TcontrolItem;
    doorTrackType: TcontrolItem;
    doorTrackName: TcontrolItem;
  };
};

export type { Tcontrol as Tcontrol_detail };

// ============================================================================
const option_doorTrack_normal = optionsCre_doorTrack_normal();

// ============================================================================
export default function WorkSheetProductDetail01({
  control,
  supportTip,
  disabled,
}: {
  control: Tcontrol;
  supportTip: string;
  disabled: boolean;
}) {
  return (
    <div className={scss.container}>
      <p>設定產品細部規格：</p>
      <div className={scss.left}>
        {configArr_left.map((item) => {
          const { pKey: pKey, label, arr: list } = item;

          return (
            <Item
              key={pKey}
              pKey={pKey}
              label_p={label}
              arr={list}
              control={control}
              disabled={disabled}
              supportTip={supportTip}
            />
          );
        })}
      </div>{' '}
      {/* left */}
      <div className={scss.right}>
        {configArr_right.map((item) => {
          const { pKey: pKey, label, arr: list } = item;

          return <Item key={pKey} pKey={pKey} label_p={label} arr={list} control={control} disabled={disabled} />;
        })}
      </div>
      {/* right */}
    </div>
  );
}

// ==================================================================

const Item = ({
  pKey,
  label_p: label_p,
  arr,
  control,
  disabled,
  supportTip,
}: {
  // pKey: string;
  pKey: Tconfig['pKey'];
  label_p: string;
  arr: Tconfig['arr'];
  // control: Control<TfakeworkSheet, any>;
  control: Tcontrol;
  disabled: boolean;
  supportTip?: string;
}) => {
  return (
    <div className={scss.item}>
      <p className={scss.sutTitle}>
        {label_p}
        {pKey === 'support' && <span>{supportTip}</span>}
      </p>
      <div className={scss.list}>
        {arr.map((item) => {
          const {
            cKey: cKey,
            module,
            label: label_c,
            placeholder,
            className: className_inputSel,
            options: options_fake,
            checkBarPropsListCre,
          } = item;

          if (!control[pKey][cKey]) {
            myAlert.err({ title: '開發者提示，Tcontrol的key與config不相符', content: `pKey:${pKey} cKey:${cKey}` });

            return null;
          }

          const {
            //
            value,
            onChange,
            disabled: disabled_control,
            forbidden,
            icon,
            checkBarOptionArr,
            optionArr,
          } = control[pKey][cKey]!;

          let selectProps: TselectProps | undefined = undefined;
          let checkProps: TcheckProps | undefined = undefined;

          if (module === 'select') {
            selectProps = {
              value: value,
              onChange: (v) => {
                onChange(v?.value ?? '');
              },
              options: optionArr ?? options_fake ?? [],
              selClassNames: {
                singleValue: (state) => {
                  return scss.selSingleValue;
                },
                option: (state) => {
                  return scss.selSingleValue;
                },
              },
              arrowType: 'black',
            };

            if (cKey === 'doorTrackName') {
              selectProps.value = {
                value: value,
                label: value,
                icon,
              };

              selectProps = {
                ...selectProps,
                onChange: (v) => {
                  onChange(v?.value ?? '');
                },
                customComponents: {
                  Option: (props) =>
                    OptionWithIcon01(props, {
                      showLabel: false,
                      className: scss.selOption_custom,
                    }),
                  SingleValue: (props) =>
                    SingleValueWithIcon01(props, {
                      showLabel: false,
                      className: scss.selSingleValue_custom,
                    }),
                },
              };
            }
          } //   if (module === "select")

          if (module === 'checkBar') {
            // const checkBarPropsList = checkBarPropsListCre!();

            const checkBarPropsList = (() => {
              if (checkBarOptionArr) {
                return createCheckBarPropsList(checkBarOptionArr);
              } else {
                return checkBarPropsListCre!();
              }
            })();

            if (checkBarPropsList[value]) {
              checkBarPropsList[value].value = true;
            }

            // const objArr = Object.values(checkBarPropsList);

            // if (objArr[objArr.length - 3]) {
            //   objArr[objArr.length - 3].style = { width: '45px' };
            // }

            // if (objArr[objArr.length - 2]) {
            //   objArr[objArr.length - 2].style = { width: '100px' };
            // }

            // if (objArr[objArr.length - 1]) {
            //   objArr[objArr.length - 1].style = { width: '80px' };
            // }

            checkProps = {
              propsList: {
                ...checkBarPropsList,
              },
              isRadio: true,
              onChange: (list) => {
                const keyArr = Object.keys(list);
                let theValue = '';
                keyArr.forEach((key) => {
                  if (list[key]) {
                    theValue = key;
                  }
                });
                onChange(theValue);
              },
              containerClassName: scss.checkBar,
            };
          }

          return (
            <InputSel
              key={cKey}
              className={classNames(
                //
                cKey === 'doorTrackName' && scss.inputSel_big,
                forbidden && scss.forbidden,
                className_inputSel
              )}
              label={label_c}
              selectProps={selectProps}
              checkProps={checkProps}
              captionColor="main"
              captionWidth={captionWidth}
              disabled={forbidden || disabled_control || disabled}
              showBaseline="always"
            />
          );
        })}
      </div>
    </div>
  );
};

// ==================================================================
// ==================================================================
// ==================================================================
const captionWidth = '100px';

const fakeOption_material: Toption[] = [
  { value: '304#', label: 'SST 304# (2B 霧面)' },
  { value: '305#', label: 'SST 305# (2A 平面)' },
  { value: '306#', label: 'SST 306# (3C 霧面)' },
];

const fakeOption_size: Toption[] = [
  { value: '5', label: '5"' },
  { value: '6', label: '6"' },
  { value: '7', label: '7"' },
  { value: '8', label: '8"' },
];

const fakeOption_thickness: Toption[] = [
  { value: '0.4', label: '0.4T' },
  { value: '0.6', label: '0.6T' },
  { value: '0.8', label: '0.8T' },
  { value: '1.0', label: '1.0T' },
  { value: '1.2', label: '1.2T' },
];

const fakeOption_reelBoxType: Toption[] = [
  { value: 'rollBox', label: '捲箱' },
  { value: 'Chassis', label: '機箱' },
  { value: 'rollBoxAndChassis', label: '捲箱+機箱' },
];
const fakeOption_bearing: Toption[] = [
  { value: '6208', label: '6208#' },
  { value: '1251', label: '1251#' },
  { value: '356', label: '356#' },
];

const fakeOption_chain: Toption[] = [
  { value: '640', label: '640#' },
  { value: '580', label: '580#' },
  { value: '455', label: '455#' },
];

const fakeOption_horsepower: Toption[] = [
  { value: '0.25', label: '1/4HP' },
  { value: '0.5', label: '1/2HP' },
  { value: '1', label: '1HP' },
  { value: '1.5', label: '1 1/2HP' },
];

const fakeOption_manufacturer: Toption[] = [
  { value: '大同', label: '大同' },
  { value: '士林電機', label: '士林電機' },
  { value: '東元', label: '東元' },
];

const fakeOption_powerSupply: Toption[] = [
  { value: '單相', label: '單相' },
  { value: '三相', label: '三相' },
];

const fakeOption_voltage: Toption[] = [
  { value: '110V', label: '110V' },
  { value: '220V', label: '220V' },
];

// --------------------------------

const createCheckBarPropsList = (arr: { key: string; label: string }[]): TcheckProps['propsList'] => {
  const obj: TcheckProps['propsList'] = {};

  arr.forEach((item) => {
    obj[item.key] = {
      value: false,
      label: item.label,
    };
  });

  return obj;
};

// const undefinedCheckBarPropsList = {
//   _undefined: { value: false, label: 'undefined' },
// };

const checkBarPropsList_boolean = (): TcheckProps['propsList'] => ({
  no: { value: false, label: '無' },
  yes: { value: false, label: '有' },
});

const checkBarPropsListCre_surface = (): TcheckProps['propsList'] => ({
  無: { value: false, label: '無' },
  一般烤: { value: false, label: '一般烤' },
  氟烤: { value: false, label: '氟烤' },
});
const checkBarPropsListCre_front = (): TcheckProps['propsList'] => ({
  無: { value: false, label: '無' },
  正雲白: { value: false, label: '正雲白' },
  正乳白: { value: false, label: '正乳白' },
});

const checkBarPropsListCre_bastType = (): TcheckProps['propsList'] => ({
  無: { value: false, label: '無' },
  鋁障感型: { value: false, label: '鋁障感型' },
  止水型: { value: false, label: '止水型' },
});

const checkBarPropsListCre_chainType = (): TcheckProps['propsList'] => ({
  單排: { value: false, label: '單排' },
  雙排: { value: false, label: '雙排' },
});

const checkBarPropsListCre_lockBox = (): TcheckProps['propsList'] => ({
  外露式: { value: false, label: '外露式' },
  防盜式: { value: false, label: '防盜式' },
});

const checkBarPropsListCre_doorTrackType = (): TcheckProps['propsList'] => ({
  直: { value: false, label: '直' },
  彎: { value: false, label: '彎' },
});

type Tconfig = {
  // readonly pKey: string;
  readonly pKey: keyof Tcontrol;
  readonly label: string;
  readonly arr: {
    readonly cKey: string;
    // readonly cKey: keyof Tcontroll[keyof Tcontroll];
    readonly module: 'select' | 'checkBar';
    readonly label: string;
    readonly placeholder: string | undefined;
    readonly className: string | undefined;
    readonly options: Toption[] | undefined;
    readonly checkBarPropsListCre: (() => TcheckProps['propsList']) | undefined;
  }[];
};

const configArr_left: Tconfig[] = [
  {
    pKey: 'reel',
    label: '捲軸',
    arr: [
      {
        cKey: 'size',
        module: 'select',
        label: '尺寸',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_size,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'hasConvex',
        module: 'checkBar',
        label: '有無凸',
        placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsList_boolean,
      },
    ],
  },
  {
    pKey: 'reelBox',
    label: '捲箱',
    arr: [
      {
        cKey: 'material',
        module: 'select',
        label: '材質',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_material,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'thickness',
        module: 'select',
        label: '厚度',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_thickness,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'surface',
        module: 'checkBar',
        label: '表面',
        placeholder: undefined,
        // className: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_surface,
      },
      {
        cKey: 'front',
        module: 'checkBar',
        label: '正面',
        placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_front,
      },
      {
        cKey: 'hasConvex',
        module: 'checkBar',
        label: '有無凸',
        placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsList_boolean,
      },
      {
        cKey: 'type',
        module: 'select',
        label: '捲相型式',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_reelBoxType,
        checkBarPropsListCre: undefined,
      },
    ],
  },
  {
    pKey: 'base',
    label: '底座',
    arr: [
      {
        cKey: 'material',
        module: 'select',
        label: '材質',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_material,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'angleMaterial',
        module: 'select',
        label: '角鐵材質',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_material,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'baseMaterial',
        module: 'select',
        label: '底座板材質',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_material,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'type',
        module: 'checkBar',
        label: '型式',
        placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_bastType,
      },
      {
        cKey: 'surface',
        module: 'checkBar',
        label: '表面',
        placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_surface,
      },
    ],
  },
  {
    pKey: 'support',
    label: '支版',
    arr: [
      {
        cKey: 'bearing',
        module: 'select',
        label: '軸承',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_bearing,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'chain',
        module: 'select',
        label: '鏈條',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_chain,
        checkBarPropsListCre: undefined,
      },
    ],
  },
];

const configArr_right: Tconfig[] = [
  {
    pKey: 'doorPiece',
    label: '門片',
    arr: [
      {
        cKey: 'material',
        module: 'select',
        label: '材質',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_material,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'surface',
        module: 'checkBar',
        label: '表面',
        placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_surface,
      },
    ],
  },
  {
    pKey: 'motor',
    label: '電動機',
    arr: [
      {
        cKey: 'horsepower',
        module: 'select',
        label: '馬力數',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_horsepower,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'manufacturer',
        module: 'select',
        label: '廠商',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_manufacturer,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'powerSupply',
        module: 'select',
        label: '電供',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_powerSupply,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'voltage',
        module: 'select',
        label: '電壓',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_voltage,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'support',
        module: 'checkBar',
        label: '支撐架',
        placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsList_boolean,
      },
      {
        cKey: 'chainType',
        module: 'checkBar',
        label: '鏈條型式',
        placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_chainType,
      },
      {
        cKey: 'lockBox',
        module: 'checkBar',
        label: '鎖盒',
        placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_lockBox,
      },
    ],
  },
  {
    pKey: 'doorTrack',
    label: '門軌',
    arr: [
      {
        cKey: 'material',
        module: 'select',
        label: '材質',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_material,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'thickness',
        module: 'select',
        label: '厚度',
        placeholder: undefined,
        className: undefined,
        options: fakeOption_thickness,
        checkBarPropsListCre: undefined,
      },
      {
        cKey: 'surface',
        module: 'checkBar',
        label: '表面',
        placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_surface,
      },
      {
        cKey: 'silencer',
        module: 'checkBar',
        label: '消音條',
        placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsList_boolean,
      },
      {
        cKey: 'doorTrackType',
        module: 'checkBar',
        label: '型式',
        placeholder: undefined,
        className: undefined,
        options: undefined,
        checkBarPropsListCre: checkBarPropsListCre_doorTrackType,
      },
      {
        cKey: 'doorTrackName',
        module: 'select',
        label: '型式',
        placeholder: undefined,
        className: scss.doorTrackName,
        options: option_doorTrack_normal,
        checkBarPropsListCre: undefined,
      },
    ],
  },
];
