import { useState } from 'react';

// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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
  };
  label: string;
  disabled: boolean;
}) {
  const { stringArr, editString, delString, showSelector } = stringObj;

  const toShowAdd = () => {
    showSelector();
  };

  return (
    <div className={scss.listContainer}>
      <p>{label}</p>
      {stringArr.map((memo, index) => {
        return (
          <div key={index}>
            {disabled ? <span></span> : <IconRemoveCircle onClick={() => delString(index)} />}
            <span className={scss.serialNumber}></span>
            <InputSel
              className={scss.inputSel}
              textareaProps={{
                value: memo,
                onChange: (v) => editString(index, v),
              }}
              placeholder={'請輸入' + label}
              showBaseline="auto"
              disabled={disabled}
            />
          </div>
        );
      })}
      <div>{disabled ? <span></span> : <IconAddCircle onClick={toShowAdd} />}</div>
    </div>
  );
}
