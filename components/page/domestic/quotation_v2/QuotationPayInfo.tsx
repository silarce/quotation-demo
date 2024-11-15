import { useState } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';

// antd
import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

//  gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

// type
import { Tcurrency } from 'js/api/dtoTypes';

import { optionsCreator_currency } from 'js/utils/options/options';

import scss from './QuotationPayInfo.module.scss';

// ========================================================================

type TnumberStr = `${number}` | '';

interface TpaymentMethod {
  milestone: {
    value: string;
    onChange?: (v: string) => void;
  };
  totalPaymentRatio: {
    value: string;
    onChange?: (v: string) => void;
  };
  onDelete?: () => void;
}

interface Tform_pay {
  // 是否含稅
  haveTax: {
    value: boolean;
    onChange?: (value: boolean) => void;
    disabled?: boolean;
  };
  // 總折數
  discountRate: {
    value: TnumberStr;
    onChange?: (value: TnumberStr) => void;
    disabled?: boolean;
  };
  // 小計調整
  tuneTotal: {
    value: TnumberStr;
    onChange?: (value: TnumberStr) => void;
  };
  // 幣別
  currency: {
    value: string;
    onChange?: (value: Tcurrency) => void;
    disabled?: boolean;
  };
  // 匯率
  exchangeRate: {
    value: TnumberStr;
    onChange?: (value: TnumberStr) => void;
    disabled?: boolean;
  };

  avgDiscount_withQty: string | number; // 平均折數
  subTotal: string | number; // 小計
  salesTax: string | number; // 營業稅
  total: string | number; // 總計
  foreignTotal: string | number; // 外幣計價
}

interface Tform_info {
  // 交貨地點
  deliveryLocation: {
    value: string;
    onChange?: (value: string) => void;
  };
  // 交貨日期
  deliveryDate: {
    value: Moment | null;
    onChange?: (value: Moment | null) => void;
  };
  //付款辦法
  paymentMethod: TpaymentMethod[];
  addPaymentMethod?: () => void;

  //
}

interface Tprops {
  disabled: boolean;
  form: Tform_pay & Tform_info;
}

// ========================================================================

export default function QuotationPayInfo(props: Tprops) {
  const {
    disabled,
    form,
    //
  } = props;

  const {
    haveTax,
    discountRate,
    tuneTotal,
    currency,
    exchangeRate,

    avgDiscount_withQty,
    subTotal,
    salesTax,
    total,
    foreignTotal,
    //
    //
    deliveryLocation,
    deliveryDate,
    paymentMethod,
    addPaymentMethod,
    //
  } = form;

  return (
    <div className={classNames(scss.container, scss.legacy)}>
      <div className={scss.payBox}>
        <InputSel
          className={classNames('m-auto mr-0 mb-5', !haveTax && 'invisible')}
          wrapperStyle={{ width: '97px' }}
          showBaseline="invisible"
          disabled={!!haveTax || disabled}
          checkBoxProps_v2={{
            props: {
              value: haveTax.value ? ['haveTax'] : [],
              onChange: (e) => {
                const bool = e.includes('haveTax');
                haveTax.onChange?.(bool);
              },
            },
            checkBoxPropsArr: [
              {
                value: 'haveTax',
                children: '是否含稅',
              },
            ],
          }}
        />

        <div className={classNames(scss.avgDiscount, 'relative')}>
          <span className="relative">{'總折數'}</span>

          <div>
            <input
              type="number"
              onWheel={(e) => {
                e.currentTarget.blur();
              }}
              className={classNames(
                //
                'bg-transparent',
                (disabled || discountRate.disabled) && scss.noBaseLine
              )}
              value={discountRate.value}
              onChange={(e) => discountRate.onChange?.(e.target.value as `${number}` | '')}
              readOnly={disabled || discountRate.disabled}
            />
            <span>%</span>
          </div>
        </div>

        <div className={classNames(scss.avgDiscount, 'relative')}>
          <span className={scss.avgDiscount}>
            {'平均折數'}
            <Popover
              content={
                <>
                  <span>平均折數計算方式</span>
                  <br />
                  <span>{`(所有主產品各自的折數*數量 的加總) / 總數量 * 總折數/100`}</span>
                  <br />
                  <span>例如有兩個主產品A與B，A的數量為兩個、折數為100，B的數量為一個、折數50，總折數75</span>
                  <br />
                  <span>{'平均折數的計算就是 (100*2 + 50*1) / 3 * 75 / 100'}</span>
                </>
              }
              trigger="hover"
            >
              <InfoCircleOutlined />
            </Popover>
          </span>

          <div>
            <span>{avgDiscount_withQty}</span>
            <span>%</span>
          </div>
        </div>

        <div className={classNames(scss.avgDiscount, 'relative')}>
          <span className={scss.avgDiscount}>
            {'小計調整'}
            <Popover content={'不可以大於1000，不可以小於-1000'} trigger="hover">
              <InfoCircleOutlined />
            </Popover>
          </span>
          <div>
            <input
              onWheel={(e) => e.currentTarget.blur()}
              type="number"
              className={classNames(
                //
                'bg-transparent',
                disabled && scss.noBaseLine
              )}
              disabled={disabled}
              value={tuneTotal.value}
              onChange={(e) => tuneTotal.onChange?.(e.target.value as `${number}` | '')}
            />
          </div>
        </div>

        <div className={classNames(scss.avgDiscount, 'relative')}>
          <span className="relative">小計</span>
          <div>
            <input
              type="text"
              className={classNames('bg-transparent', scss.noBaseLine)}
              value={subTotal}
              readOnly={true}
            />
          </div>
        </div>
        <div className={classNames(scss.avgDiscount, 'relative')}>
          <span className="relative">營業稅</span>
          <div>
            <input
              type="text"
              className={classNames('bg-transparent', scss.noBaseLine)}
              value={salesTax}
              readOnly={true}
            />
          </div>
        </div>
        <div className={classNames(scss.avgDiscount, 'relative')}>
          <span className="relative">總計</span>
          <div>
            <input
              type="text"
              className={classNames('bg-transparent', scss.noBaseLine)}
              value={total}
              readOnly={true}
            />
          </div>
        </div>

        <hr />
        <div className={classNames(scss.avgDiscount, 'relative')}>
          <span className="relative">{'幣別'}</span>
          <div>
            <InputSel
              wrapperStyle={{ width: 150 }}
              showBaseline="auto"
              disabled={disabled || currency.disabled}
              selectProps={{
                props: {
                  placeholder: '',
                  value: { value: currency.value, label: currency.value },
                  options: optionsCreator_currency(),
                  onChange(option) {
                    if (option) {
                      const value = option.value as Tcurrency;
                      currency.onChange?.(value);
                    }
                  },
                  classNames: {
                    singleValue: () => 'text-right',
                    option: () => 'text-right',
                  },
                },
              }}
            />
          </div>
        </div>
        <div className={classNames(scss.avgDiscount, 'relative')}>
          <span className="relative">{'匯率(外幣兌新台幣)'}</span>
          <div>
            <input
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              className={classNames('bg-transparent', (disabled || exchangeRate.disabled) && scss.noBaseLine)}
              value={exchangeRate.value}
              onChange={(e) => exchangeRate.onChange?.(e.target.value as TnumberStr)}
              readOnly={disabled || exchangeRate.disabled}
            />
          </div>
        </div>
        <div className={classNames(scss.avgDiscount, 'relative')}>
          <span className="relative">外幣計價</span>
          <div>
            <input className={classNames('bg-transparent', scss.noBaseLine)} value={foreignTotal} readOnly={true} />
          </div>
        </div>
      </div>

      <hr className={scss.grayHr} />
      <div>
        <div className={scss.inputBox01}>
          <span>交貨地點</span>
          <InputSel
            disabled={disabled}
            inputProps={{
              props: {
                value: deliveryLocation.value,
                onChange: (v) => {
                  deliveryLocation.onChange?.(v.target.value);
                },

                placeholder: '請輸入交貨地址',
              },
            }}
          />
        </div>
        <div className={classNames(scss.inputBox01, scss.date)}>
          <span className={'relative'}>
            {/* <MustTip_simple /> */}
            交貨日期
          </span>
          <InputSel
            disabled={disabled}
            datePickerProps={{
              props: {
                className: scss.datePicker,
                placeholder: '例 : 100-01-01',
                value: deliveryDate.value,
                onChange: (date_m) => {
                  deliveryDate.onChange?.(date_m);
                },
              },
            }}
          />
        </div>
        {/* 付款辦法 */}
        <div className={classNames(scss.payMethodContainer, 'relative')}>
          <span>付款辦法</span>
          {paymentMethod.map((item, index) => {
            const { milestone, totalPaymentRatio, onDelete } = item;

            return (
              <div key={index} className={classNames(scss.inputBox02, scss.legacy)}>
                <IconRemoveCircle
                  className={classNames(scss.btn, disabled && scss.hidden)}
                  onClick={() => onDelete?.()}
                />

                <span className={scss.label}>
                  {index + 1}.
                  <input
                    type="text"
                    value={milestone.value}
                    onChange={(e) => milestone.onChange?.(e.target.value)}
                    disabled={disabled}
                  />
                </span>
                <InputSel
                  disabled={disabled}
                  inputProps={{
                    props: {
                      placeholder: '請輸入比例',
                      value: totalPaymentRatio.value,
                      onChange: (e) => totalPaymentRatio.onChange?.(e.target.value),
                      type: 'number',
                      onWheel: (e) => {
                        e.currentTarget.blur();
                      },
                    },
                  }}
                />
                <span>%</span>
              </div>
            );
          })}
          {!disabled && <IconAddCircle className={scss.btn} onClick={() => addPaymentMethod?.()} />}
        </div>
      </div>
    </div>
  );
}
