import { useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';

// global gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal';
import MustTip_simple from 'components/global/gear/other/mustTip_simple';
// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './payInfo.module.scss';

export type Tcontrol = {
  payment: {
    discountRate: {
      value: string;
      onChange: (v: string) => void;
    };
    subTotal: {
      value: string;
      onChange: (v: string) => void;
    };
    salesTax: {
      value: string;
      onChange: (v: string) => void;
    };
    total: {
      value: string;
      onChange: (v: string) => void;
    };
  };
  delivery: {
    deliveryLocation: {
      value: string;
      onChange: (v: string) => void;
    };
    deliveryDate: {
      value: string;
      onChange: (v: string) => void;
    };
  };
  paymentMethod: {
    arr: {
      label: string;
      value: string;
      onChange: (v: string) => void;
      delSelf: (index: number) => void;
    }[];
    addMethod: (v: string) => void;
  };
};

export default function PayInfo({ disabled, control }: { disabled: boolean; control: Tcontrol }) {
  const [modalIsShow, setModalIsShow] = useState(false);
  // -----------------------------------------------------------------------
  const { payment, delivery, paymentMethod } = control;
  // -----------------------------------------------------------------------
  const countList = [
    { label: '小計', key: 'subTotal' },
    { label: '營業稅(5%)', key: 'salesTax' },
    { label: '總計', key: 'total' },
  ] as const;

  // -----------------------------------------------------------------------
  return (
    <div className={classNames(scss.container, scss.legacy)}>
      <div className={scss.payBox}>
        <div className={classNames(scss.avgDiscount, 'relative')}>
          <span className="relative">
            {'總折數'}
            <MustTip_simple preStyle="minimal" />
          </span>
          <div>
            <input
              type="number"
              className="bg-transparent"
              value={payment.discountRate.value}
              onChange={(e) => payment.discountRate.onChange(e.target.value)}
              disabled={disabled}
            />
            <span>%</span>
          </div>
        </div>

        {countList.map((item, index) => {
          const { label, key } = item;

          return (
            <div key={index} className={classNames(scss.avgDiscount, 'relative')}>
              <span className="relative">
                {label}
                <MustTip_simple preStyle="minimal" />
              </span>
              <div>
                <input
                  type="text"
                  className="bg-transparent"
                  value={payment[key].value}
                  onChange={(e) => payment[key].onChange(e.target.value)}
                  disabled={disabled}
                />
                <span></span>
              </div>
            </div>
          );
        })}
      </div>

      <hr className={scss.grayHr} />
      <div>
        <div className={scss.inputBox01}>
          <span>交貨地點</span>
          <InputSel
            disabled={disabled}
            inputProps={{
              props: {
                value: delivery.deliveryLocation.value,
                onChange: (v) => {
                  delivery.deliveryLocation.onChange(v.target.value);
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
                value: delivery.deliveryDate.value ? moment(delivery.deliveryDate.value) : null,
                onChange: (date_m) => {
                  const isoString = date_m?.toISOString() || '';
                  delivery.deliveryDate.onChange(isoString);
                },
              },
            }}
          />
        </div>
        {/* 付款辦法 */}
        <div className={classNames(scss.payMethodContainer, 'relative')}>
          <span>付款辦法</span>
          {paymentMethod.arr.map((item, index) => {
            const { label, value, onChange, delSelf } = item;

            return (
              <div key={index} className={classNames(scss.inputBox02, scss.legacy)}>
                <IconRemoveCircle className={scss.btn} onClick={() => delSelf(index)} />
                <span className={scss.label}>
                  {index + 1}.{label}
                </span>
                <InputSel
                  disabled={disabled}
                  inputProps={{
                    props: {
                      placeholder: '請輸入%數',
                      value: value,
                      onChange: (e) => onChange(e.target.value),
                      type: 'number',
                    },
                  }}
                />
                <span>%</span>
              </div>
            );
          })}
          {!disabled && (
            <IconAddCircle
              className={scss.btn}
              onClick={() => {
                setModalIsShow(true);
              }}
            />
          )}
        </div>
      </div>
      <InputModal
        visible={modalIsShow}
        title="新增付款辦法"
        placeholder="請輸入付款辦法描述"
        onConfirm={(v) => {
          paymentMethod.addMethod(v);
          setModalIsShow(false);
        }}
        onCancel={() => {
          setModalIsShow(false);
        }}
      />
    </div>
  );
} // PayInfo
// ============================
