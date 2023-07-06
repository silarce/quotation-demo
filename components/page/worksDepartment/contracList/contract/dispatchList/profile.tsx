import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';

// css
import style from './dispatchList.module.scss';

// fake
import type { TfakeProfile } from 'pages/worksDepartment/contractList/contract/dispatchList';
import type { TdispatchEmpty } from 'pages/worksDepartment/contractList/contract/dispatchList/add';

export default function Profile({
  profile,
  setProfile,
  profile02,
  setProfile02,
}: {
  profile: Partial<TfakeProfile>;
  setProfile: Dispatch<SetStateAction<Partial<TfakeProfile>>>;
  profile02?: TdispatchEmpty;
  setProfile02?: Dispatch<SetStateAction<TdispatchEmpty>>;
}) {
  // ------------------------------------------------
  const router = useRouter();
  const isAdd = router.route.split('/').pop() === 'add';
  // ------------------------------------------------
  const { 派工日期, 工務人員, 完工聯絡人 } = profile02 ?? {};

  return (
    <div className={style.profile}>
      {/* left */}
      <div className={style.left}>
        {profile02 && (
          <InputSel
            className={`${style.input02}`}
            inputProps={{
              value: 派工日期 ?? '',
              onChange: (v: string) => {
                setProfile02!((data) => {
                  data.派工日期 = v;

                  return { ...data };
                });
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
          const value = profile[key] ?? '';
          const { label, labelWidth } = config[key];

          const onChange = (v: string) => {
            setProfile((data) => {
              data[key] = v;

              return { ...data };
            });
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
              disabled={true}
              showBaseline="invisible"
            />
          );
        })}
      </div>

      {/* right */}
      <div className={style.right}>
        {indexKeys02.map((key, index) => {
          const value = profile[key] ?? '';
          const { label, labelWidth } = config[key];

          const onChange = (v: string) => {
            setProfile((data) => {
              data[key] = v;

              return { ...data };
            });
          };

          let styleShowUnderline = '';

          if (key === '工程編號') {
            styleShowUnderline = style.showUnderline;
          }

          if (key === '管制卡編號' && !isAdd) {
            styleShowUnderline = style.showUnderline;
          }

          const className = `${style.input02} ${styleShowUnderline}`;

          return (
            <InputSel
              className={className}
              key={index}
              inputProps={{ value, onChange }}
              label={label}
              captionWidth={labelWidth}
              captionColor="main"
              gap={'24px'}
              disabled={styleShowUnderline ? true : false}
            />
          );
        })}
        {/*  */}
        {indexKeys03.map((key, index) => {
          if (!profile02) {
            return null;
          }

          const value = profile02[key];
          const { label, labelWidth } = config[key];

          const onChange = (v: string) => {
            setProfile((data) => {
              profile02[key] = v;

              return { ...data };
            });
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
            />
          );
        })}
      </div>
    </div>
  );
}
// ============================================================

type TindexKey01 = keyof Pick<TfakeProfile, '工程名稱' | '承包商' | '聯絡人' | '工地電話' | '工程地點'>;
type TindexKey02 = keyof Pick<TfakeProfile, '工程編號' | '管制卡編號'>;
type TindexKey03 = keyof Pick<TdispatchEmpty, '工務人員' | '完工聯絡人'>;

const indexKeys01: TindexKey01[] = ['工程名稱', '承包商', '聯絡人', '工地電話', '工程地點'];
const indexKeys02: TindexKey02[] = ['工程編號', '管制卡編號'];
const indexKeys03: TindexKey03[] = ['工務人員', '完工聯絡人'];

type Tconfig<keys extends string> = {
  [key in keys]: {
    label: string;
    labelWidth: string;
  };
};

const config: Tconfig<TindexKey01 | TindexKey02 | TindexKey03> = {
  工程名稱: {
    label: '工程名稱',
    labelWidth: '80px',
  },
  承包商: {
    label: '承包商',
    labelWidth: '80px',
  },
  聯絡人: {
    label: '聯絡人',
    labelWidth: '80px',
  },
  工地電話: {
    label: '工地電話',
    labelWidth: '80px',
  },
  工程地點: {
    label: '工程地點',
    labelWidth: '80px',
  },
  // TindexKey02
  工程編號: {
    label: '工程編號',
    labelWidth: '100px',
  },
  管制卡編號: {
    label: '管制卡編號',
    labelWidth: '100px',
  },
  // TindexKey03
  工務人員: {
    label: '工務人員',
    labelWidth: '100px',
  },
  完工聯絡人: {
    label: '完工聯絡人',
    labelWidth: '100px',
  },
};

// ==========================================
