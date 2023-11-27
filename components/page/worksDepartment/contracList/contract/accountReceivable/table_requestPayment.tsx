// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

import scss from './table_requestPayment.module.scss';

// ========================================================================

type TcontrolItem = {
  value: string;
  onChange?: (str: string) => void;
};

type TcontrolColumn = {
  caption: string;
  paymentRatio: TcontrolItem;
  loanPeriod: TcontrolItem;
  remark: TcontrolItem;
};

type Tcontrol = {
  columnArr: TcontrolColumn[];
};

export type { Tcontrol as Tcontrol_table_requestPayment };

// ========================================================================
export default function Table_requestPayment({ control, disabled }: { control: Tcontrol; disabled?: boolean }) {
  const { columnArr } = control;

  return (
    <div className={scss.container}>
      <div className={scss.wrapper}>
        <div className={scss.table}>
          <Column
            disabled={true}
            controlColumn={{
              caption: '請款',
              paymentRatio: {
                value: '請款比例',
              },
              loanPeriod: {
                value: '放款票期',
              },
              remark: {
                value: '備註',
              },
            }}
          />

          {columnArr.map((control, index) => {
            return <Column key={index} disabled={disabled} controlColumn={control} />;
          })}
        </div>
      </div>
    </div>
  );
}

// ========================================================================

const Column = ({ controlColumn, disabled }: { controlColumn: TcontrolColumn; disabled?: boolean }) => {
  const { caption, paymentRatio, loanPeriod, remark } = controlColumn;

  return (
    <div className={scss.column}>
      <div>
        <span>{caption}</span>
      </div>
      <div>
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          inputProps={{
            props: {
              value: paymentRatio.value,
              onChange: (e) => {
                paymentRatio.onChange?.(e.target.value);
              },
            },
          }}
        />
      </div>
      <div>
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          inputProps={{
            props: {
              value: loanPeriod.value,
              onChange: (e) => {
                loanPeriod.onChange?.(e.target.value);
              },
            },
          }}
        />
      </div>
      <div>
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          inputProps={{
            props: {
              value: remark.value,
              onChange: (e) => {
                remark.onChange?.(e.target.value);
              },
            },
          }}
        />
      </div>
    </div>
  );
};
