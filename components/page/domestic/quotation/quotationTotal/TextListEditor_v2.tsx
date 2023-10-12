// global gear
// import InputSel from 'components/global/gear/inputAndSel/inputSel';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import classNames from 'classnames';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './TextListEditor_v2.module.scss';

export default function TextListEditor_v2({
  stringObj,
  label,
  disabled,
}: {
  stringObj: {
    stringArr: string[];
    editString: (index: number, v: string) => void;
    delString: (index: number) => void;
    showSelector: () => void;
    addString: (v: string) => void;
  };
  label: string;
  disabled: boolean;
}) {
  const { stringArr, editString, delString, showSelector, addString } = stringObj;

  const toShowAdd = () => {
    showSelector();
  };

  return (
    <div className={scss.listContainer}>
      <div className={scss.labelBox}>
        <p>{label}</p>
        <IconAddCircle className={classNames(disabled && 'hidden')} onClick={toShowAdd} />
      </div>
      {stringArr.map((memo, index) => {
        return (
          <div key={index}>
            {disabled ? <span></span> : <IconRemoveCircle onClick={() => delString(index)} />}
            <span className={scss.serialNumber}>{index + 1}.</span>
            <InputSel
              className={classNames(scss.inputSel)}
              textareaProps={{
                props: {
                  placeholder: '請輸入' + label,
                  value: memo,
                  onChange: (e) => editString(index, e.target.value),
                },
              }}
              showBaseline="auto"
              disabled={disabled}
            />
          </div>
        );
      })}
      <div>{disabled ? <span></span> : <IconAddCircle onClick={() => addString('')} />}</div>
    </div>
  );
}
