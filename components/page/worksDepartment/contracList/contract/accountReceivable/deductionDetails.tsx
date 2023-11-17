import classNames from 'classnames';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// icon
import { IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

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
  onDeleteClick?: () => void;
};

type Tcontrol = {
  sideColumn: TcontrolColumn;
  columnArr: TcontrolColumn[];
  onTopBtnClick: () => void;
};

export type { Tcontrol as Tcontrol_deductionDetails };

// ============================================================================
export default function DeductionDetails({ control, disabled }: { control: Tcontrol; disabled?: boolean }) {
  const { sideColumn, columnArr, onTopBtnClick } = control;

  return (
    <div className={scss.container}>
      <div className={scss.wrapper}>
        <div className={scss.top}>
          <span>扣款明細</span>
          <div>
            <MyButton_v2 label="新增項目" px="px22" onClick={onTopBtnClick} />
          </div>
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
  const { caption, arr, subTotal, tax, total, onDeleteClick } = controlColumn;

  return (
    <div className={scss.column}>
      <div className={scss.headCell}>
        <span>{caption}</span>
        {onDeleteClick && !disabled && <IconRemoveCircle onClick={onDeleteClick} />}
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
