// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';

// css
import style from './profile.module.scss';

type Tcontroll = {
  projectNumber: {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
  };
  projectName: {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
  };
  requirementsDate: {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
  };
  dispatchDate: {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
  };
};

export type { Tcontroll };
// -----------------------------------------------------------

export default function Profile({ disabled, controll }: { disabled: boolean; controll: Tcontroll }) {
  return (
    <div className={style.profile}>
      {indexKeys.map((key, index) => {
        const { label, type } = config[key];
        const { value, onChange, disabled: disabled_single } = controll[key];

        // -----
        if (type === 'date') {
          return (
            <InputSel
              className={style.input02}
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

        const showBaseline = key === 'projectName' ? 'invisible' : 'always';

        return (
          <InputSel
            key={index}
            className={style.input02}
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
    </div>
  );
}

// ===================================================

type TindexKeys = keyof Tcontroll;

const indexKeys: TindexKeys[] = ['dispatchDate', 'projectNumber', 'requirementsDate', 'projectName'];

const config: {
  [key in TindexKeys]: {
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
