import { useState, useRef, useEffect } from 'react';

// antd
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import {
  selectModalCreator_multi,
  TdailyReportItem_my,
} from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

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

const SelectGroup = selectModalCreator_multi<['dailyReport_workers_item']>({
  selectorArr: [
    {
      key: 'dailyReport_workers_item',
      tip: '請先選擇派工日期',
    },
  ],
});

// ----------------------------------------------------------
export default function EditDispatch({
  controll,
  disabled,
  dispatchDate,
}: {
  controll: Tcontroll;
  disabled?: boolean;
  dispatchDate: string | undefined;
}) {
  const [showSelector, setShowSelector] = useState(false);

  // ---------------------------------------------------------------

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

  const onSelectorConfirm = (arr: TdailyReportItem_my[]) => {
    const descriptionArr = arr.map((item) => {
      return item.description;
    });

    const descriptionStr = descriptionArr.join('\n\n');

    let value = tasks.value;

    if (value) {
      value += '\n\n';
    }

    tasks.onChange(value + descriptionStr);
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
          <span>工作內容 : </span>
          <MyButton_v2 label="請選擇工務人員日報表" px="px22" py="py4" onClick={() => setShowSelector(true)} />
        </div>
        <textarea
          disabled={disabled}
          className={scss.textarea}
          placeholder="請輸入工作內容"
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
        placeholder="請輸入待辦事項"
        value={note.value}
        onChange={(e) => note.onChange(e.target.value)}
      />

      <SelectGroup
        showModal={showSelector}
        onConfirm={(arr) => {
          onSelectorConfirm(arr[0]);
        }}
        onCancel={() => setShowSelector(false)}
        dynaSelectorPropsList={[
          {
            useNoMetaProps: { date: dispatchDate || '9999-01-01' },
          },
        ]}
      />
    </div>
  );
}
