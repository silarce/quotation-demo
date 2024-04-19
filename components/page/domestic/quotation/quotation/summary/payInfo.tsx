import { useState } from 'react';
import classNames from 'classnames';
import moment from 'moment';

// antd
import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

// global gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import InputModal from 'components/global/gear/modal/simpleModal/inputModal';
// import MustTip_simple from 'components/global/gear/other/mustTip_simple';
// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './payInfo.module.scss';

type TinputCell = {
  inputAttr: React.InputHTMLAttributes<HTMLInputElement>;
};

export type Tcontrol = {
  payment: {
    haveTax?: {
      value: boolean;
      onChange?: (v: boolean) => void;
    };
    discountRate: TinputCell;
    subTotal: TinputCell;
    salesTax: TinputCell;
    total: TinputCell;
  };
  delivery: {
    deliveryLocation: {
      value: string;
      onChange?: (v: string) => void;
    };
    deliveryDate: {
      value: string;
      onChange?: (v: string) => void;
    };
  };
  paymentMethod: {
    arr: {
      label: string;
      value: string;
      onChange: (v: string) => void;
      onChangeMilestone?: (v: string) => void;
      delSelf: (index: number) => void;
    }[];
    addMethod: (v: string) => void;
  };
};

export default function PayInfo({
  //
  disabled,
  control,
  avgDiscount_withQty,
}: {
  disabled: boolean;
  control: Tcontrol;
  avgDiscount_withQty: string | number;
}) {
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
        {payment.haveTax && (
          <InputSel
            className="m-auto mr-0 mb-5 "
            wrapperStyle={{ width: '97px' }}
            showBaseline="invisible"
            disabled={disabled}
            checkBoxProps_v2={{
              props: {
                value: payment.haveTax.value ? ['haveTax'] : [],
                onChange: (e) => {
                  const haveTax = e.includes('haveTax');
                  payment.haveTax?.onChange?.(haveTax);
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
        )}

        <div className={classNames(scss.avgDiscount, 'relative')}>
          <span className="relative">
            {'總折數'}
            {/* <MustTip_simple preStyle="minimal" /> */}
          </span>

          <div>
            <input
              type="number"
              onWheel={(e) => {
                e.currentTarget.blur();
              }}
              className={classNames(
                //
                'bg-transparent',
                payment.discountRate.inputAttr.disabled && scss.noBaseLine
              )}
              {...payment.discountRate.inputAttr}
              // value={payment.discountRate.value}
              // onChange={(e) => payment.discountRate.onChange?.(e.target.value)}
              // disabled={disabled}
            />
            <span>%</span>
          </div>
        </div>

        <div className={classNames(scss.avgDiscount, 'relative')}>
          <span className={scss.avgDiscount}>
            {'平均折數'}
            {/* <MustTip_simple preStyle="minimal" /> */}
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

        {countList.map((item, index) => {
          const { label, key } = item;

          return (
            <div key={index} className={classNames(scss.avgDiscount, 'relative')}>
              <span className="relative">
                {label}
                {/* <MustTip_simple preStyle="minimal" /> */}
              </span>
              <div>
                <input
                  type="text"
                  // className="bg-transparent"
                  className={classNames(
                    //
                    'bg-transparent',
                    payment[key].inputAttr.disabled && scss.noBaseLine
                  )}
                  {...payment[key].inputAttr}
                  value={payment[key].inputAttr.value?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  // onChange={(e) => payment[key].onChange?.(e.target.value)}
                  disabled={disabled}
                />
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
                  delivery.deliveryLocation.onChange?.(v.target.value);
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
                  delivery.deliveryDate.onChange?.(isoString);
                },
              },
            }}
          />
        </div>
        {/* 付款辦法 */}
        <div className={classNames(scss.payMethodContainer, 'relative')}>
          <span>付款辦法</span>
          {paymentMethod.arr.map((item, index) => {
            const { label, value, onChange, onChangeMilestone, delSelf } = item;

            return (
              <div key={index} className={classNames(scss.inputBox02, scss.legacy)}>
                <IconRemoveCircle
                  className={classNames(scss.btn, disabled && scss.hidden)}
                  onClick={() => delSelf(index)}
                />

                <span className={scss.label}>
                  {/* {index + 1}.{label} */}
                  {index + 1}.
                  <input
                    type="text"
                    value={label ?? ''}
                    onChange={(e) => onChangeMilestone?.(e.target.value)}
                    disabled={disabled}
                  />
                </span>
                <InputSel
                  disabled={disabled}
                  inputProps={{
                    props: {
                      placeholder: '請輸入比例',
                      value: value,
                      onChange: (e) => onChange(e.target.value),
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
