import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import classNames from 'classnames';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

import scss from './QuotationRemark.module.scss';

const fakeData = [
  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum dolorum sed delectus quod optio placeat consequatur qui fugiat animi, illum earum libero minima possimus, id reiciendis, officiis reprehenderit cum perferendis.',
  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum dolorum sed delectus quod optio placeat consequatur qui fugiat animi, illum earum libero minima possimus, id reiciendis, officiis reprehenderit cum perferendis.',
  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum dolorum sed delectus quod optio placeat consequatur qui fugiat animi, illum earum libero minima possimus, id reiciendis, officiis reprehenderit cum perferendis.',
  'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nostrum dolorum sed delectus quod optio placeat consequatur qui fugiat animi, illum earum libero minima possimus, id reiciendis, officiis reprehenderit cum perferendis.',
];

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
          className={classNames(disabled && 'hidden')}
          onClick={() => {
            onUpponAddClick();
          }}
        />
      </div>
      {remarkArr.map((remark, index) => {
        const { value, onChange, onDelete } = remark;

        return (
          <div key={index}>
            {disabled ? <span></span> : <IconRemoveCircle onClick={onDelete} />}
            {/* <span className={scss.serialNumber}>{index + 1}.</span> */}
            <span className={scss.serialNumber}></span>
            <InputSel
              className={classNames(scss.inputSel)}
              textareaProps={{
                props: {
                  // placeholder: '請輸入' + label,
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
      <div>{disabled ? <span></span> : <IconAddCircle onClick={() => onAddClick()} />}</div>
    </div>
  );
}
