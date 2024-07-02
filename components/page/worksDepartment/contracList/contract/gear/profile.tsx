import moment from 'moment';

// global gear
// import InputSel from 'components/global/gear/inputAndSel/inputSel';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// css
import scss from './profile.module.scss';

type TdoorTypeItem = { doorTypeName: string; qty: string };

type Tcontroll = {
  info: {
    sheetNumber: {
      value: string;
      onChange: (v: string) => void;
      disabled?: boolean;
      showBaseline?: 'invisible' | 'always';
    };
    projectNumber: {
      value: string;
      onChange: (v: string) => void;
      disabled?: boolean;
      showBaseline?: 'invisible' | 'always';
    };
    projectName: {
      value: string;
      onChange: (v: string) => void;
      disabled?: boolean;
      showBaseline?: 'invisible' | 'always';
    };
    requirementsDate: {
      value: string;
      onChange: (v: string) => void;
      disabled?: boolean;
      showBaseline?: 'invisible' | 'always';
    };
    dispatchDate: {
      value: string;
      onChange: (v: string) => void;
      disabled?: boolean;
      showBaseline?: 'invisible' | 'always';
    };
  };
  doorType?: {
    arr: TdoorTypeItem[];
    totalQty: string;
  };
};

export type { Tcontroll, TdoorTypeItem };
// -----------------------------------------------------------

export default function Profile({ disabled, controll }: { disabled: boolean; controll: Tcontroll }) {
  const control_doorType = controll.doorType;

  return (
    <div className={scss.profile}>
      <InputSel
        {...inputSelProps}
        caption="調貨單編號"
        disabled={disabled}
        showBaseline="auto"
        inputProps={{
          props: {
            value: controll.info.sheetNumber.value,
            onChange: (e) => {
              controll.info.sheetNumber.onChange(e.target.value);
            },
          },
        }}
      />

      <InputSel
        {...inputSelProps}
        caption="填表日期"
        disabled={disabled}
        showBaseline="auto"
        datePickerProps={{
          props: {
            value: controll.info.dispatchDate.value ? moment(controll.info.dispatchDate.value) : null,
            onChange: (m) => {
              controll.info.dispatchDate.onChange(m?.toISOString() ?? '');
            },
          },
        }}
      />

      <InputSel
        {...inputSelProps}
        caption="工程編號"
        disabled={true}
        showBaseline="invisible"
        inputProps={{
          props: {
            value: controll.info.projectNumber.value,
            onChange: (e) => {
              controll.info.projectNumber.onChange(e.target.value);
            },
          },
        }}
      />

      <InputSel
        {...inputSelProps}
        caption="需要日期"
        disabled={disabled}
        showBaseline="auto"
        datePickerProps={{
          props: {
            value: controll.info.requirementsDate.value ? moment(controll.info.requirementsDate.value) : null,
            onChange: (m) => {
              controll.info.requirementsDate.onChange(m?.toISOString() ?? '');
            },
          },
        }}
      />

      <InputSel
        {...inputSelProps}
        caption="工程名稱"
        disabled={true}
        showBaseline="invisible"
        inputProps={{
          props: {
            value: controll.info.projectName.value,
            onChange: (e) => {
              controll.info.projectName.onChange(e.target.value);
            },
          },
        }}
      />

      {/*  */}

      {control_doorType && (
        <>
          <div className={scss.doorTypeList}>
            <div className={scss.caption}>
              <span>門型數量</span>
            </div>
            <ul className={scss.list}>
              {control_doorType.arr.map((item, index) => {
                return (
                  <li key={index}>
                    <span>{item.doorTypeName}</span>
                    <span>{item.qty}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/*  */}
          {/* <InputSel
            className={scss.input03}
            disabled={disabled}
            inputProps={{
              value: control_doorType.totalQty,
              }}
              label={'總樘數'}
              captionWidth="80px"
              captionColor="main"
              gap="40px"
              width={'700px'}
              showBaseline={'invisible'}
              /> */}
          <InputSel
            //
            caption="總樘數"
            disabled={disabled}
            showBaseline={'invisible'}
            inputProps={{
              props: {
                value: control_doorType.totalQty,
              },
            }}
          />
        </>
      )}
      {/*  */}
    </div>
  );
}

// ===================================================

const inputSelProps: TinputSelProps = {
  // wrapperStyle: { width: 100 },
  captionStyle: { width: 100 },
};

type TindexKeys = keyof Tcontroll['info'];

const indexKeys: TindexKeys[] = ['sheetNumber', 'dispatchDate', 'projectNumber', 'requirementsDate', 'projectName'];

const config: {
  [key in TindexKeys]?: {
    label: string;
    type?: 'date';
  };
} = {
  sheetNumber: {
    label: '調貨單編號',
  },
  projectNumber: {
    label: '工程編號',
  },
  projectName: {
    label: '工程名稱',
  },
  requirementsDate: {
    label: '需要日期',
    type: 'date',
  },
  dispatchDate: {
    label: '填表日期',
    type: 'date',
  },
};
// ===================================================

// {indexKeys.map((key, index) => {
//   const { label, type } = config[key] ?? {};
//   const { value, onChange, disabled: disabled_single, showBaseline } = controll.info[key];

//   // -----
//   if (type === 'date') {
//     return (
//       <InputSel
//         className={scss.input02}
//         key={index}
//         datePickerProps={{
//           //
//           value: value,
//           // onChange,
//           onChange02: (m) => {
//             onChange(m?.toISOString() ?? '');
//           },
//         }}
//         label={label}
//         captionWidth="80px"
//         gap="40px"
//         captionColor="main"
//         disabled={disabled}
//       />
//     );
//   }

//   return (
//     <InputSel
//       key={index}
//       className={scss.input02}
//       disabled={disabled_single || disabled}
//       inputProps={{
//         value: value,
//         onChange,
//       }}
//       label={label}
//       captionWidth="100px"
//       captionColor="main"
//       gap="40px"
//       width={key === 'projectName' ? '700px' : '255px'}
//       showBaseline={showBaseline}
//     />
//   );
// })}
