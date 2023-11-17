import classNames from 'classnames';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

import scss from './deductionDetails.module.scss';

// ============================================================================
type TcontrolItem = {
  value: string;
  onChange?: (str: string) => void;
};

type TcontrolColumn = {
  caption: string;
  arr: TcontrolItem[];
  subTotal: string;
  tax: string;
  total: string;
};

type Tcontrol = {
  sideColumn: TcontrolColumn;
  columnArr: TcontrolColumn[];
};

export type { Tcontrol as Tcontrol_deductionDetails };

// ============================================================================
export default function DeductionDetails({ control, disabled }: { control: Tcontrol; disabled?: boolean }) {
  const { sideColumn, columnArr } = control;

  return (
    <div className={scss.container}>
      <div className={scss.wrapper}>
        <div className={scss.top}>
          <span>扣款明細</span>
        </div>
        <div className={scss.table}>
          {/*  */}
          <Column disabled={true} controlColumn={sideColumn} />
          {columnArr.map((column, index) => {
            return (
              <Column
                //
                key={index}
                disabled={disabled}
                controlColumn={column}
                inputType="number"
              />
            );
          })}
          {/*  */}
        </div>
        {/* wrapper close */}
      </div>
    </div>
  );
}

// ============================================================================

const Column = ({
  controlColumn,
  disabled,
  inputType,
}: {
  controlColumn: TcontrolColumn;
  disabled?: boolean;
  inputType?: 'number';
}) => {
  const { caption, arr, subTotal, tax, total } = controlColumn;

  return (
    <div className={scss.column}>
      <div>
        <span>{caption}</span>
      </div>
      {/*  */}
      {arr.map((item, index) => {
        return (
          <div key={index}>
            <InputSel
              disabled={disabled}
              showBaseline="auto"
              inputProps={{
                props: {
                  value: item.value,
                  onChange: (e) => {
                    item.onChange?.(e.target.value);
                  },
                  type: inputType,
                },
              }}
            />
          </div>
        );
      })}
      {/*  */}
      <div className={scss.totalCell}>
        <InputSel
          disabled={true}
          showBaseline="invisible"
          inputProps={{
            props: {
              value: subTotal,
            },
          }}
        />
      </div>
      <div className={scss.totalCell}>
        <InputSel
          disabled={true}
          showBaseline="invisible"
          inputProps={{
            props: {
              value: tax,
            },
          }}
        />
      </div>
      <div className={scss.totalCell}>
        <InputSel
          disabled={true}
          showBaseline="invisible"
          inputProps={{
            props: {
              value: total,
            },
          }}
        />
      </div>
      {/*  */}
    </div>
  );
};
