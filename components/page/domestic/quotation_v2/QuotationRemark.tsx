import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import classNames from 'classnames';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

import scss from './QuotationRemark.module.scss';

// =======================================================================

interface Tremark {
  value: string;
  onChange: (v: string) => void;
  onDelete: () => void;
}

interface Tprops {
  disabled: boolean;
  label: string;
  onAddClick: () => void;
  onUpponAddClick: () => void;
  remarkArr: Tremark[];
}

// =======================================================================

export default function QuotationRemark({ disabled, label, onAddClick, onUpponAddClick, remarkArr }: Tprops) {
  return (
    <div className={scss.listContainer}>
      <div className={scss.labelBox}>
        <p>{label}</p>
        <IconAddCircle
          className={classNames(disabled && 'invisible')}
          onClick={() => {
            onUpponAddClick();
          }}
        />
      </div>
      {remarkArr.map((remark, index) => {
        const { value, onChange, onDelete } = remark;

        return (
          <div key={index}>
            <IconRemoveCircle className={classNames(disabled && 'invisible')} onClick={onDelete} />
            <span className={scss.serialNumber}></span>
            <InputSel
              className={classNames(scss.inputSel)}
              textareaProps={{
                allowNewLineByUser: true,
                props: {
                  value,
                  onChange: (e) => onChange(e.target.value),
                },
              }}
              showBaseline="auto"
              disabled={disabled}
            />
          </div>
        );
      })}
      <div>
        <IconAddCircle className={classNames(disabled && 'invisible')} onClick={() => onAddClick()} />
      </div>
    </div>
  );
}

export type { Tprops as Tprops_quotationRemark };
