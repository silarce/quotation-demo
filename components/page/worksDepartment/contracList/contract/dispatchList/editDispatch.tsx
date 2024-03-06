import { useState, useRef, useEffect } from 'react';

// antd
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';

// css
import scss from './dispatchList.module.scss';

// ----------------------------------------------------------
type Tcontroll_item = {
  value: string;
  onChange: (v: string) => void;
};

type TpricingMethodControll = {
  value: string;
  onChange: (v: string) => void;
  subValue: string;
  // subOnChange: (v: string) => void;
};

type Tcontroll = {
  tasks: Tcontroll_item;
  note: Tcontroll_item;
  pricingMethod: TpricingMethodControll;
};

export type { Tcontroll, TpricingMethodControll };

// ----------------------------------------------------------
export default function EditDispatch({ controll, disabled }: { controll: Tcontroll; disabled?: boolean }) {
  const { tasks, note, pricingMethod } = controll;

  const [batchInput, setBatchInput] = useState('');
  const refInput = useRef<HTMLInputElement>(null!);

  const onChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    // setBatchType(value);
    pricingMethod.onChange(value);

    if (value.includes('修理費用')) {
      refInput.current.focus();
    }
  };

  // -----------------------------------------------------------------
  useEffect(() => {
    setBatchInput(pricingMethod.subValue);
  }, [pricingMethod.subValue]);

  // -----------------------------------------------------------------
  return (
    <div className={scss.editDispatch}>
      {/* 辦理事項 */}
      <div className={scss.handlingMatters}>
        <div className={scss.subTitle}>
          <span>辦理事項 : </span>
        </div>
        <textarea
          disabled={disabled}
          className={scss.textarea}
          placeholder="請輸入辦理事項"
          value={tasks.value}
          onChange={(e) => tasks.onChange(e.target.value)}
        />
      </div>

      {/* 派工批價 */}
      <div className={scss.dispatchPrice}>
        <div className={scss.subTitle}>
          <span>派工批價</span>
        </div>
        <Radio.Group disabled={disabled} className={scss.radioGroup} onChange={onChange} value={pricingMethod.value}>
          <Radio value={'合約內'}>合約內</Radio>
          <Radio value={'合約辦理追加'}>合約辦理追加</Radio>
          <Radio value={`修理費用${batchInput}`}>
            <label
              className={scss.myLabel}
              htmlFor="batchInput"
              onClick={() => {
                // setBatchType(`修理費用${batchInput}`);
                if (!disabled) {
                  pricingMethod.onChange(`修理費用${batchInput}`);
                }
              }}
            >
              <span>修理費用</span>
              <input
                disabled={disabled}
                id="batchInput"
                type="text"
                autoComplete="off"
                ref={refInput}
                value={pricingMethod.subValue ?? ''}
                onChange={(e) => {
                  setBatchInput(e.target.value);
                  pricingMethod.onChange(`修理費用${e.target.value}`);
                }}
              />
            </label>
          </Radio>
          <Radio value={'贈送'}>贈送</Radio>
        </Radio.Group>
      </div>

      {/* 備註下次注意事項 */}
      <div className={scss.precaution}>
        <div className={scss.subTitle}>
          <span>待辦事項 : </span>
        </div>
      </div>
      <textarea
        disabled={disabled}
        className={scss.textarea}
        placeholder="請輸入備註"
        value={note.value}
        onChange={(e) => note.onChange(e.target.value)}
      />
    </div>
  );
}
