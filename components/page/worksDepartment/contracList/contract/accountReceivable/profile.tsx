import classNames from 'classnames';

// gear

import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import scss from './profile.module.scss';

// ========================================================================

type TcontrolItem = {
  value: string;
  onChange?: (str: string) => void;
};

type Tcontrol = {
  // left
  projectName: TcontrolItem; // 工程名稱
  contractor: TcontrolItem; // 承包商
  companyName: TcontrolItem; // 公司名稱
  contactPerson: TcontrolItem; // 聯絡人
  businessIdNumber: TcontrolItem; // 統一編號
  companyAddress: TcontrolItem; // 公司地址
  companyPhoneNumber: TcontrolItem; // 公司電話
  projectAddress: TcontrolItem; // 工程地點
  projectPhoneNumber: TcontrolItem; // 工地電話
  // right
  warrantyPeriod: TcontrolItem; // 保固期間
  projectNumber: TcontrolItem; // 工程編號
  valuationDate: TcontrolItem; // 估價日
  paymentDate: TcontrolItem; // 付清日
};

export type { Tcontrol as Tcontrol_profile };

// ========================================================================

// ========================================================================

export default function Profile({
  //
  control,
  disabled,
}: {
  control: Tcontrol;
  disabled?: boolean;
}) {
  return (
    <div>
      <div className={scss.profileGrid}>
        {/* left */}
        <div className={scss.left}>
          {/*  */}
          {leftTopKeys.map((key, index) => {
            const { label } = config[key];

            return (
              <div key={index} className={scss.span2}>
                <InputSel
                  className={scss.inputSel}
                  wrapperStyle={{ gap }}
                  caption={label}
                  captionClassName={scss.caption}
                  disabled={control[key].onChange ? disabled : true}
                  showBaseline="auto"
                  inputProps={{
                    props: {
                      value: control[key].value,
                      onChange: (e) => {
                        control[key].onChange?.(e.target.value);
                      },
                    },
                  }}
                />
              </div>
            );
          })}
          {/*  */}

          {leftBottomKeys.map((key, index) => {
            const { label, textaresProps } = config[key];

            let props: TinputSelProps = {
              inputProps: {
                props: {
                  value: control[key].value,
                  onChange: (e) => {
                    control[key].onChange?.(e.target.value);
                  },
                },
              },
            };

            if (textaresProps) {
              props = {
                textareaProps: {
                  props: {
                    value: control[key].value,
                    onChange: (e) => {
                      control[key].onChange?.(e.target.value);
                    },
                  },
                  ...textaresProps,
                },
              };
            }

            return (
              <div key={index} className={scss.span1}>
                <InputSel
                  //
                  wrapperStyle={{ gap }}
                  caption={label}
                  captionClassName={scss.caption}
                  disabled={control[key].onChange ? disabled : true}
                  showBaseline="auto"
                  {...props}
                />
              </div>
            );
          })}

          {/*  */}
        </div>
        {/* right */}
        <div className={scss.right}>
          {rightKeys.map((key, index) => {
            const { label } = config[key];

            return (
              <div key={index} className={scss.span1}>
                <InputSel
                  wrapperStyle={{ gap }}
                  caption={label}
                  captionClassName={scss.caption}
                  disabled={control[key].onChange ? disabled : true}
                  showBaseline="auto"
                  inputProps={{
                    props: {
                      value: control[key].value,
                      onChange: (e) => {
                        control[key].onChange?.(e.target.value);
                      },
                    },
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ========================================================================
const gap = '24px';

const leftTopKeys: (keyof Tcontrol)[] = ['projectName', 'contractor', 'companyName'];
const leftBottomKeys: (keyof Tcontrol)[] = [
  'contactPerson',
  'businessIdNumber',
  'companyAddress',
  'companyPhoneNumber',
  'projectAddress',
  'projectPhoneNumber',
];
const rightKeys: (keyof Tcontrol)[] = ['warrantyPeriod', 'projectNumber', 'valuationDate', 'paymentDate'];

type Tconfig = {
  [key: string]: {
    label: string;
    textaresProps?: TinputSelProps['textareaProps'];
  };
};

const config: Tconfig = {
  projectName: {
    label: '工程名稱',
  },
  contractor: {
    label: '承包商',
  },
  companyName: {
    label: '公司名稱',
  },
  contactPerson: {
    label: '聯絡人',
  },
  businessIdNumber: {
    label: '統一編號',
  },
  companyAddress: {
    label: '公司地址',
    textaresProps: {},
  },
  companyPhoneNumber: {
    label: '公司電話',
  },
  projectAddress: {
    label: '工程地點',
    textaresProps: {},
  },
  projectPhoneNumber: {
    label: '工地電話',
  },
  warrantyPeriod: {
    label: '保固期間',
  },
  projectNumber: {
    label: '工程編號',
  },
  valuationDate: {
    label: '估價日',
  },
  paymentDate: {
    label: '付清日',
  },
};
