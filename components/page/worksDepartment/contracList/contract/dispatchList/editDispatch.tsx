import { useState, useRef } from 'react';

// antd
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';

// css
import style from './dispatchList.module.scss';

// ----------------------------------------------
export default function EditDispatch() {
  const [batchType, setBatchType] = useState('');
  const [batchInput, setBatchInput] = useState('');
  const refInput = useRef<HTMLInputElement>(null!);

  const onChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setBatchType(value);

    if (value.includes('修理費用')) {
      refInput.current.focus();
    }
  };

  return (
    <div className={style.editDispatch}>
      {/* 辦理事項 */}
      <div className={style.handlingMatters}>
        <div className={style.subTitle}>
          <span>辦理事項</span>
        </div>
        <textarea className={style.textarea} placeholder="請輸入辦理事項" />
      </div>

      {/* 派工批價 */}
      <div className={style.dispatchPrice}>
        <div className={style.subTitle}>
          <span>派工批價</span>
        </div>
        <Radio.Group className={style.radioGroup} onChange={onChange} value={batchType}>
          <Radio value={'合約內'}>合約內</Radio>
          <Radio value={'合約辦理追加'}>合約辦理追加</Radio>
          <Radio value={`修理費用${batchInput}`}>
            <label
              className={style.myLabel}
              htmlFor="batchInput"
              onClick={() => {
                setBatchType(`修理費用${batchInput}`);
              }}
            >
              <span>修理費用</span>
              <input
                id="batchInput"
                type="text"
                ref={refInput}
                onChange={(e) => {
                  setBatchInput(e.target.value);
                  setBatchType(`修理費用${e.target.value}`);
                }}
              />
            </label>
          </Radio>
          <Radio value={'贈送'}>贈送</Radio>
        </Radio.Group>
      </div>

      {/* 備註下次注意事項 */}
      <div className={style.precaution}>
        <div className={style.subTitle}>
          <span>備註下次注意事項 : </span>
          <span>預備工具或聯絡、報價事宜、待完成事項</span>
        </div>
      </div>
      <textarea className={style.textarea} placeholder="請輸入備註" />
    </div>
  );
}
