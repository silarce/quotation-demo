// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';

// css
import scss from './profile.module.scss';

type TdoorTypeItem = { doorTypeName: string; qty: string };

type Tcontroll = {
  info: {
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
      {indexKeys.map((key, index) => {
        const { label, type } = config[key] ?? {};
        const { value, onChange, disabled: disabled_single, showBaseline } = controll.info[key];

        // -----
        if (type === 'date') {
          return (
            <InputSel
              className={scss.input02}
              key={index}
              datePickerProps={{
                //
                value: value,
                // onChange,
                onChange02: (m) => {
                  onChange(m?.toISOString() ?? '');
                },
              }}
              label={label}
              captionWidth="80px"
              gap="40px"
              captionColor="main"
              disabled={disabled}
            />
          );
        }

        return (
          <InputSel
            key={index}
            className={scss.input02}
            disabled={disabled_single || disabled}
            inputProps={{
              value: value,
              onChange,
            }}
            label={label}
            captionWidth="80px"
            captionColor="main"
            gap="40px"
            width={key === 'projectName' ? '700px' : '255px'}
            showBaseline={showBaseline}
          />
        );
      })}

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
          <InputSel
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
          />
        </>
      )}
      {/*  */}
    </div>
  );
}

// ===================================================

type TindexKeys = keyof Tcontroll['info'];

const indexKeys: TindexKeys[] = ['dispatchDate', 'projectNumber', 'requirementsDate', 'projectName'];

const config: {
  [key in TindexKeys]?: {
    label: string;
    type?: 'date';
  };
} = {
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
