import { Dispatch, SetStateAction } from 'react';

// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';

// css
import style from './powerTransmissionSpareList.module.scss';

// fake
// import type { Tprofile } from 'pages/worksDepartment/contractList/contract/powerTransmissionSpareList/edit';

// type Tprofile = {
//   projectNumber: string;
//   projectName: string;
//   requirementsDate: string; // 需要日期
//   dispatchDate: string; // 填表日期
// };
// type Tprofile = {
//   projectNumber: string;
//   projectName: string;
//   requirementsDate: string; // 需要日期
//   dispatchDate: string; // 填表日期
// };

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

// -----------------------------------------------------------
export type { Tcontroll };
// -----------------------------------------------------------

export default function Profile({
  // data,
  // setData,
  disabled,
  controll,
}: {
  // data: Partial<Tprofile>;
  // setData: Dispatch<SetStateAction<Partial<Tprofile>>>;
  disabled: boolean;
  controll: Tcontroll;
}) {
  return (
    <div className={style.profile}>
      {indexKeys.map((key, index) => {
        const { label, type } = config[key];
        const { value, onChange, disabled: disabled_single } = controll[key];

        // -----
        if (type === 'date') {
          // const onChange = (dateString: string) => {
          //   const value = dateString;
          //   setData((data) => {
          //     data[key] = value;

          //     return { ...data };
          //   });
          // };

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

        // -----
        // const onChange = (v: string) => {
        //   setData((data) => {
        //     data[key] = v;

        //     return { ...data };
        //   });
        // };

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
