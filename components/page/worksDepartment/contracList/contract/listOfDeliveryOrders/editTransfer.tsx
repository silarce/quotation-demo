// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// icon
import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';
import addIcon from 'public/image/icon/add.svg';

// css
import style from './listOfDeliveryOrders.module.scss';

// type
import { Toption } from 'js/utils/options/options';

// other
import { optionsCreator_doorModel_2 } from 'js/utils/options/productOptions';
const optionMaterial = optionsCreator_doorModel_2();

// ========================================================

type TcontrollItem = {
  goodsName: {
    value: string;
    onChange: (v: string) => void;
  };
  goodsSpec: {
    value: string;
    onChange: (v: string) => void;
  };
  goodsQuantity: {
    value: string;
    onChange: (v: string) => void;
  };
  reason: {
    value: string;
    onChange: (v: string) => void;
  };
  onDelete: (index: number) => void;
};

type Tcontroll = {
  arr: TcontrollItem[];
  add: () => void;
};

export type { Tcontroll };

// ========================================================
export default function EditTransfer({ disabled, controll }: { disabled: boolean; controll: Tcontroll }) {
  return (
    <div className={style.editTransfer}>
      {/* thead */}
      <div className={style.thead}>
        {/*  */}
        <div className={style.deleteIcon} /> {/* 填空格 */}
        <div className={style.indexNumber} /> {/* 填空格 */}
        {/*  */}
        {indexKeys.map((key, index) => {
          const { label, width, marginRight, flex, center } = config[key];
          const theStyle = { width, marginRight, flex };
          const className = center ? style.center : '';

          return (
            <div className={className} key={index} style={theStyle}>
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      {/* tbody */}
      <div className={style.tbody}>
        {controll.arr.map((item, rowIndex) => {
          return (
            <CellWithBar key={rowIndex}>
              <div className={style.row}>
                {/*  */}
                <div className={style.deleteIcon} onClick={() => item.onDelete(rowIndex)}>
                  <IconDelete01 />
                </div>
                <div className={style.indexNumber}>{rowIndex + 1}</div>
                {/*  */}
                {indexKeys.map((key, index) => {
                  const { value, onChange } = item[key];

                  const { type, width, marginRight, flex, options, center, inputType } = config[key];
                  const theStyle = { width, marginRight, flex };

                  const onChangeInput = (v: string) => {
                    onChange(v);
                  };

                  const onChangeSel = (option: Toption | null) => {
                    const value = option?.value ?? '';

                    onChange(value);
                  };

                  const className = center ? style.center : '';

                  return (
                    <div className={className} key={index} style={theStyle}>
                      {type === 'textarea' && (
                        <InputSel
                          textareaProps={{
                            value,
                            onChange: onChangeInput,
                            className: style.input,
                          }}
                          placeholder=""
                          disabled={disabled}
                        />
                      )}
                      {type === 'input' && (
                        <InputSel
                          inputProps={{
                            value,
                            onChange: onChangeInput,
                            className: style.input,
                            inputType: inputType,
                          }}
                          placeholder=""
                          disabled={disabled}
                        />
                      )}
                      {type === 'select' && (
                        <InputSel
                          selectProps={{
                            value,
                            onChange: onChangeSel,
                            options: options ?? [],
                            fontSize: '16px',
                            arrowType: 'black',
                          }}
                          placeholder=""
                          disabled={disabled}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              {/*  */}
            </CellWithBar> // row
          );
        })}
        {/* 新增項目 */}
        {!disabled && (
          <div className={style.row}>
            <div className={style.addIcon} onClick={controll.add}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={addIcon.src} alt="" />
              <span>新增項目</span>
            </div>
          </div>
        )}
      </div>
      {/* tbody */}
    </div>
  );
}

// ====================================================

type TindexKeys = keyof Omit<TcontrollItem, 'onDelete'>;

const indexKeys: TindexKeys[] = ['goodsName', 'goodsSpec', 'goodsQuantity', 'reason'];

const config: {
  [key in TindexKeys]: {
    label: string;
    type: 'input' | 'select' | 'textarea';
    width: string;
    marginRight: string;
    flex?: string;
    options?: Toption[];
    center?: boolean;
    inputType?: 'number';
  };
} = {
  goodsName: {
    label: '物品名稱',
    type: 'input',
    width: '120px',
    marginRight: '22px',
  },
  goodsSpec: {
    label: '材質規格',
    type: 'select',
    width: '120px',
    marginRight: '22px',
    options: optionMaterial,
  },
  goodsQuantity: {
    label: '數量',
    type: 'input',
    width: '45px',
    marginRight: '22px',
    center: true,
    inputType: 'number',
  },
  reason: {
    label: '調貨理由',
    type: 'textarea',
    width: 'auto',
    marginRight: '0px',
    flex: 'auto',
  },
};
