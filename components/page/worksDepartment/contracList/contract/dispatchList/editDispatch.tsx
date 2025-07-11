import { useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';

// antd
import { Radio } from 'antd';

// gear
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import {
  selectModalCreator_multi,
  TdailyReportItem_my,
} from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// css
import scss from './dispatchList.module.scss';

// ----------------------------------------------------------
type Tcontroll_item = {
  value: string;
  onChange: (v: string) => void;
};
type Tcontroll_item_num = {
  value: `${number}` | '';
  onChange: (v: `${number}` | '') => void;
};

type TpricingMethodControll = {
  value: '合約內' | '合約辦理追加' | '贈送' | '修繕計價' | '其他' | '保固內' | '';
  note: string;
  onChange: (v: TpricingMethodControll['value']) => void;
  onInputChange: (v: string) => void;
};

type Tcontroll = {
  tasks: Tcontroll_item;
  note: Tcontroll_item;
  pricingMethod: TpricingMethodControll;
  isCompleted: {
    value: boolean;
    onChange: (v: boolean) => void;
  };
  //
  rollingOther: Tcontroll_item;
  rollingKeyNumber: Tcontroll_item;
  rollingRemote: Tcontroll_item_num;
  rollingKey: Tcontroll_item_num;
  gateOther: Tcontroll_item;
  gateRemote: Tcontroll_item_num;
  gateControllerKey: Tcontroll_item_num;
  gateMotorKey: Tcontroll_item_num;
  ejectionDoorKey: Tcontroll_item_num;
};

export type { Tcontroll, TpricingMethodControll };

// ----------------------------------------------------------

const SelectGroup = selectModalCreator_multi<['dailyReport_workers_item']>({
  selectorArr: [
    {
      key: 'dailyReport_workers_item',
      tip: '請先選擇派工日期與派工日期',
    },
  ],
});

// ----------------------------------------------------------
export default function EditDispatch({
  controll,
  disabled,
  dispatchDate,
  workerIdArr,
}: {
  controll: Tcontroll;
  disabled?: boolean;
  dispatchDate: string | undefined;
  workerIdArr?: string[];
}) {
  const [showSelector, setShowSelector] = useState(false);
  const {
    tasks,
    note,
    pricingMethod,

    rollingRemote, // '捲門遙控器數量'
    rollingKey, // '捲門鑰匙數量'
    rollingKeyNumber,
    rollingOther,
    ejectionDoorKey,

    gateRemote, // '大門遙控器數量'
    gateControllerKey, // '大門控制箱鑰匙數量'
    gateMotorKey, // '馬達鑰匙數量'
    gateOther,
  } = controll;

  const dispatchDate_m = moment(dispatchDate);
  dispatchDate = dispatchDate_m.isValid() ? dispatchDate_m.format('YYYY-MM-DD') : '9999-01-01';

  // ----------------------------------------------------------------------

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
  return (
    <div className={scss.editDispatch}>
      {/* 辦理事項 */}
      <div className={scss.handlingMatters}>
        <div className={scss.subTitle}>
          <span>工作內容 : </span>
          <MyButton_v2
            className={classNames(disabled && 'cursor-not-allowed')}
            label="請選擇工務人員日報表"
            px="px22"
            py="py4"
            onClick={() => !disabled && setShowSelector(true)}
          />
        </div>
        <textarea
          disabled={disabled}
          className={scss.textarea}
          placeholder=""
          value={tasks.value}
          onChange={(e) => tasks.onChange(e.target.value)}
        />
      </div>

      {/* 派工批價 */}
      <div className={scss.dispatchPrice}>
        <div className={scss.subTitle}>
          <span>派工批價</span>
        </div>
        <Radio.Group
          disabled={disabled}
          className={scss.radioGroup}
          onChange={(e) => pricingMethod.onChange(e.target.value)}
          value={pricingMethod.value}
        >
          <Radio value={'合約內'}>合約內</Radio>
          <Radio value={'合約辦理追加'}>合約辦理追加</Radio>
          <Radio value={'贈送'}>贈送</Radio>
          <Radio value={'保固內'}>保固內</Radio>

          <Radio
            value={`修繕計價`}
            onChange={(e) => {
              const currentTarget = e.nativeEvent.currentTarget as HTMLDivElement;
              const fixFee = currentTarget.querySelector('#dispatch-fixFee') as HTMLInputElement;
              fixFee.focus();
            }}
          >
            <span className={scss.myLabel}>
              <span>修繕計價</span>
              <input
                id="dispatch-fixFee"
                disabled={disabled}
                autoComplete="off"
                value={(pricingMethod.value === '修繕計價' && pricingMethod.note) || ''}
                onChange={(e) => {
                  const isPositiveInteger = checkIsPositiveInteger(e.target.value);

                  if (checkAndReport(e, isPositiveInteger)) {
                    pricingMethod.value === '修繕計價' && pricingMethod.onInputChange(e.target.value);
                  }
                }}
                onClick={() => {
                  pricingMethod.onChange('修繕計價');
                }}
              />
            </span>
          </Radio>

          <Radio
            value={`其他`}
            onChange={(e) => {
              const currentTarget = e.nativeEvent.currentTarget as HTMLDivElement;
              const fixFee = currentTarget.querySelector('#dispatch-other') as HTMLInputElement;
              fixFee.focus();
            }}
          >
            <span className={scss.myLabel}>
              <span>其他</span>
              <input
                id="dispatch-other"
                disabled={disabled}
                type="text"
                autoComplete="off"
                value={(pricingMethod.value === '其他' && pricingMethod.note) || ''}
                onChange={(e) => {
                  pricingMethod.value === '其他' && pricingMethod.onInputChange(e.target.value);
                }}
                onClick={() => {
                  pricingMethod.onChange('其他');
                }}
              />
            </span>
          </Radio>
        </Radio.Group>
      </div>
      {/*  */}
      <div>
        <div>
          <p className="text-2xl font-semibold text-main mb-0">捲門</p>
          <div className="grid grid-cols-4 gap-10 gap-y-4">
            <SameInputSel
              caption="遙控器數量"
              disabled={disabled}
              showBaseline="auto"
              inputProps={{
                props: {
                  value: rollingRemote.value,
                  onChange: (e) => {
                    const isPositiveInteger = checkIsPositiveInteger(e.target.value);

                    if (checkAndReport(e, isPositiveInteger)) {
                      rollingRemote.onChange(e.target.value as `${number}` | '');
                    }
                  },
                },
              }}
            />

            <SameInputSel
              caption="鑰匙數量"
              disabled={disabled}
              showBaseline="auto"
              inputProps={{
                props: {
                  value: rollingKey.value,
                  onChange: (e) => {
                    const isPositiveInteger = checkIsPositiveInteger(e.target.value);

                    if (checkAndReport(e, isPositiveInteger)) {
                      rollingKey.onChange(e.target.value as `${number}` | '');
                    }
                  },
                },
              }}
            />

            <SameInputSel
              caption="彈射門鑰匙數量"
              disabled={disabled}
              showBaseline="auto"
              inputProps={{
                props: {
                  value: ejectionDoorKey.value,
                  onChange: (e) => {
                    const isPositiveInteger = checkIsPositiveInteger(e.target.value);

                    if (checkAndReport(e, isPositiveInteger)) {
                      ejectionDoorKey.onChange(e.target.value as `${number}` | '');
                    }
                  },
                },
              }}
            />

            <br />

            <SameInputSel
              caption="鑰匙號碼"
              disabled={disabled}
              showBaseline="auto"
              inputProps={{
                props: {
                  value: rollingKeyNumber.value,
                  onChange: (e) => {
                    rollingKeyNumber.onChange(e.target.value);
                  },
                },
              }}
            />

            <SameInputSel
              caption="其他"
              disabled={disabled}
              showBaseline="auto"
              inputProps={{
                props: {
                  value: rollingOther.value,
                  onChange: (e) => {
                    rollingOther.onChange(e.target.value);
                  },
                },
              }}
            />
          </div>
        </div>
        <br />
        <div>
          <p className="text-2xl font-semibold text-main mb-0">大門</p>
          <div className="grid grid-cols-4 gap-10 gap-y-4">
            <SameInputSel
              caption="遙控器數量"
              disabled={disabled}
              showBaseline="auto"
              inputProps={{
                props: {
                  value: gateRemote.value,
                  onChange: (e) => {
                    const isPositiveInteger = checkIsPositiveInteger(e.target.value);

                    if (checkAndReport(e, isPositiveInteger)) {
                      gateRemote.onChange(e.target.value as `${number}` | '');
                    }
                  },
                },
              }}
            />
            <SameInputSel
              caption="控箱鑰匙數量"
              disabled={disabled}
              showBaseline="auto"
              inputProps={{
                props: {
                  value: gateControllerKey.value,
                  onChange: (e) => {
                    const isPositiveInteger = checkIsPositiveInteger(e.target.value);

                    if (checkAndReport(e, isPositiveInteger)) {
                      gateControllerKey.onChange(e.target.value as `${number}` | '');
                    }
                  },
                },
              }}
            />
            <SameInputSel
              caption="馬達鑰匙數量"
              disabled={disabled}
              showBaseline="auto"
              inputProps={{
                props: {
                  value: gateMotorKey.value,
                  onChange: (e) => {
                    const isPositiveInteger = checkIsPositiveInteger(e.target.value);

                    if (checkAndReport(e, isPositiveInteger)) {
                      gateMotorKey.onChange(e.target.value as `${number}` | '');
                    }
                  },
                },
              }}
            />

            <br />

            <SameInputSel
              caption="其他"
              disabled={disabled}
              showBaseline="auto"
              inputProps={{
                props: {
                  value: gateOther.value,
                  onChange: (e) => {
                    gateOther.onChange(e.target.value);
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      <br />
      {/*  */}
      {/* 備註下次注意事項 */}
      <div className={scss.precaution}>
        <div className={scss.subTitle}>
          <span>待辦事項 : </span>
        </div>
      </div>
      <textarea
        disabled={disabled}
        className={scss.textarea}
        placeholder=""
        value={note.value}
        onChange={(e) => note.onChange(e.target.value)}
      />
      <div className=" w-fit m-auto mt-5 mr-0">
        <InputSel
          showBaseline="invisible"
          disabled={disabled}
          fontColor="active"
          checkBoxProps={{
            onChange: (arr) => {
              const isCompleted = arr.includes('isCompleted');
              controll.isCompleted.onChange(isCompleted);
            },
            propsArr: [
              {
                //
                key: 'isCompleted',
                value: controll.isCompleted.value,
                label: '完工',
              },
            ],
          }}
        />
      </div>

      <SelectGroup
        showModal={showSelector}
        onConfirm={(arr) => {
          onSelectorConfirm(arr[0]);
        }}
        onCancel={() => setShowSelector(false)}
        dynaSelectorPropsList={[
          {
            caption: '工務人員日報表回報',
            useNoMetaProps: {
              date: dispatchDate,
            },
            filter_clientSide: (data, searchArr) => {
              const id = data.employee.id;
              const employeeName = data.employee.chName || data.employee.enName;

              const check01 = !!workerIdArr?.includes(id);
              const check02 = employeeName.includes(searchArr[0] ?? '');

              return check01 && check02;
            },
          },
        ]}
      />
    </div>
  );
}

// ============================================================================

const SameInputSel = (props: TinputSelProps) => {
  return <InputSel captionStyle={{ width: '140px' }} {...props} />;
};

// ============================================================================

const checkIsPositiveInteger = (v: string | number) => {
  const num = Number(v);

  return Number.isInteger(num) && num >= 0;
};

const checkAndReport = (e: React.ChangeEvent<HTMLInputElement>, isPositiveInteger: boolean) => {
  if (!isPositiveInteger) {
    e.target.setCustomValidity('請輸入正整數');
    e.target.reportValidity();

    return false;
  } else {
    e.target.setCustomValidity('');

    return true;
  }
};
