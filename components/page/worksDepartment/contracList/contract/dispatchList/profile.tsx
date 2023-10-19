import { useState } from 'react';

import { useRouter } from 'next/router';
// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import EmployeeSelector, { TemployeeDto } from 'components/global/gear/modal/employeeSelector';

// css
import style from './dispatchList.module.scss';

type Tprofile01 = {
  projectName: string;
  contractor: string;
  contact: string;
  contactNumber: string;
  allAddress: string;

  projectNumber: string;
  badgeNumber: string;
};

type Tprofile02 = {
  dispatchDate: string;
  // workerName: string;
  finalContact: string;
};

type Tprofile03 = {
  workerEmployee: TemployeeDto | undefined;
};

export type { Tprofile01, Tprofile02, Tprofile03 };

// ============================================================================
export default function Profile({
  profile01,
  onProfile01Change,
  profile02,
  onProfile02Change,
  profile03,
  onProfile03Change,
  disabled,
}: {
  profile01: Tprofile01 | undefined;
  onProfile01Change: (key: keyof Tprofile01, v: string) => void;
  profile02?: Tprofile02;
  onProfile02Change?: (key: keyof Tprofile02, v: string) => void;
  profile03?: Tprofile03;
  onProfile03Change?: (key: keyof Tprofile03, v: TemployeeDto) => void;
  disabled?: boolean;
}) {
  // ------------------------------------------------

  // ------------------------------------------------

  const [showSelector, setShowSelector] = useState(false);

  // ------------------------------------------------

  return (
    <div className={style.profile}>
      {/* left */}
      <div className={style.left}>
        {profile02 && (
          <InputSel
            disabled={disabled}
            className={`${style.input02}`}
            datePickerProps={{
              value: profile02.dispatchDate ?? '',
              onChange02: (m) => {
                onProfile02Change?.('dispatchDate', m?.toISOString() ?? '');
              },
            }}
            label={'派工日期'}
            width={'255px'}
            captionWidth={'80px'}
            gap={'24px'}
            captionClassName={style.caption}
            captionColor="main"
          />
        )}

        {indexKeys01.map((key, index) => {
          const value = profile01?.[key] ?? '';
          const { label, labelWidth, disabled: disabled_2, showBaseline } = config[key];

          const onChange = (v: string) => {
            onProfile01Change(key, v);
          };

          return (
            <InputSel
              className={`${style.input02}`}
              key={index}
              inputProps={{ value, onChange }}
              label={label}
              captionWidth={labelWidth}
              captionColor="main"
              gap={'24px'}
              disabled={disabled || disabled_2}
              // showBaseline="invisible"
              showBaseline={showBaseline ?? 'invisible'}
            />
          );
        })}
      </div>

      {/* right */}
      <div className={style.right}>
        {indexKeys02.map((key, index) => {
          const value = profile01?.[key] ?? '';
          const { label, labelWidth } = config[key];

          const onChange = (v: string) => {
            onProfile01Change(key, v);
          };

          // let styleShowUnderline = '';

          // if (key === 'projectNumber') {
          //   styleShowUnderline = style.showUnderline;
          // }

          // if (key === 'badgeNumber' && !isAdd) {
          //   styleShowUnderline = style.showUnderline;
          // }

          // const className = `${style.input02} ${styleShowUnderline}`;
          const className = `${style.input02}`;

          return (
            <InputSel
              className={className}
              key={index}
              disabled={disabled}
              inputProps={{ value, onChange }}
              label={label}
              captionWidth={labelWidth}
              captionColor="main"
              gap={'24px'}
              // disabled={styleShowUnderline ? true : false}
            />
          );
        })}
        {/*  */}

        {profile03 && (
          <div
            onClick={() => {
              if (!disabled) {
                setShowSelector(true);
              }
            }}
          >
            <InputSel
              disabled={disabled}
              className={`${style.input02}`}
              inputProps={{
                value: profile03?.workerEmployee?.chName ?? '',
                // onChange: (v) => {
                //   onProfile02Change?.('workerName', v);
                // },
              }}
              label={'工務人員'}
              captionWidth={'100px'}
              captionColor="main"
              gap={'24px'}
            />
          </div>
        )}

        {profile02 && (
          <InputSel
            className={`${style.input02}`}
            disabled={disabled}
            inputProps={{
              value: profile02?.finalContact ?? '',
              onChange: (v) => {
                onProfile02Change?.('finalContact', v);
              },
            }}
            label={'完工聯絡人'}
            captionWidth={'100px'}
            captionColor="main"
            gap={'24px'}
          />
        )}
      </div>

      <EmployeeSelector
        showModal={showSelector}
        onConfirm={(arr) => {
          onProfile03Change?.('workerEmployee', arr[0]);
        }}
        onCancel={() => {
          setShowSelector(false);
        }}
      />
    </div>
  );
}
// ============================================================

type TindexKey01 = keyof Pick<Tprofile01, 'projectName' | 'contractor' | 'contact' | 'contactNumber' | 'allAddress'>;
type TindexKey02 = keyof Pick<Tprofile01, 'projectNumber' | 'badgeNumber'>;
// type TindexKey03 = keyof Pick<Tprofile02, 'workerName' | 'finalContact'>;

const indexKeys01: TindexKey01[] = ['projectName', 'contractor', 'contact', 'contactNumber', 'allAddress'];
const indexKeys02: TindexKey02[] = ['projectNumber', 'badgeNumber'];
// const indexKeys03: TindexKey03[] = ['workerName', 'finalContact'];

type Tconfig<keys extends string> = {
  [key in keys]: {
    label: string;
    labelWidth: string;
    disabled?: boolean;
    showBaseline?: 'invisible' | 'auto';
  };
};

const config: Tconfig<
  TindexKey01 | TindexKey02
  // | TindexKey03
> = {
  projectName: {
    label: '工程名稱',
    labelWidth: '80px',
    disabled: true,
  },
  contractor: {
    label: '承包商',
    labelWidth: '80px',
    showBaseline: 'auto',
  },
  contact: {
    label: '聯絡人',
    labelWidth: '80px',
    showBaseline: 'auto',
  },
  contactNumber: {
    label: '工地電話',
    labelWidth: '80px',
    disabled: true,
  },
  allAddress: {
    label: '工程地點',
    labelWidth: '80px',
    disabled: true,
  },
  // TindexKey02
  projectNumber: {
    label: '工程編號',
    labelWidth: '100px',
  },
  badgeNumber: {
    label: '管制卡編號',
    labelWidth: '100px',
  },
  // TindexKey03
  // workerName: {
  //   label: '工務人員',
  //   labelWidth: '100px',
  // },
  // finalContact: {
  //   label: '完工聯絡人',
  //   labelWidth: '100px',
  // },
};

// ==========================================
