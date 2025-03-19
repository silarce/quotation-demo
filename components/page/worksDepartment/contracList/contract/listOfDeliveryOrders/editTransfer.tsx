import classNames from 'classnames';

// global gear
import DataEntry from 'components/global/gear/dataEntry';
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// icon
import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';
import addIcon from 'public/image/icon/add.svg';

// css
import style from './listOfDeliveryOrders.module.scss';

// other
import { optionsCreator_doorModelName } from 'js/utils/options/productOptions';
const optionMaterial = optionsCreator_doorModelName();

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
                <div
                  className={classNames(style.deleteIcon, disabled && 'invisible')}
                  onClick={() => item.onDelete(rowIndex)}
                >
                  <IconDelete01 />
                </div>
                <div className={style.indexNumber}>{rowIndex + 1}</div>
                {/*  */}
                {indexKeys.map((key, index) => {
                  const { value, onChange } = item[key];

                  const { width, marginRight, flex, center, Render } = config[key];
                  const theStyle = { width, marginRight, flex };

                  const className = center ? style.center : '';

                  return (
                    <div className={className} key={index} style={theStyle}>
                      <Render value={value} onChange={onChange} disabled={disabled} />
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
    width: string;
    marginRight: string;
    flex?: string;
    center?: boolean;
    Render: React.FC<{ value: string; onChange: (v: string) => void; disabled: boolean }>;
  };
} = {
  goodsName: {
    label: '物品名稱',
    width: '120px',
    marginRight: '22px',
    Render: ({ value, onChange, disabled }) => {
      return (
        <DataEntry>
          <DataEntry.Input disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} />
        </DataEntry>
      );
    },
  },
  goodsSpec: {
    label: '材質規格',
    width: '120px',
    marginRight: '22px',
    Render: ({ value, onChange, disabled }) => {
      return (
        <DataEntry>
          <DataEntry.InputSelect
            disabled={disabled}
            value={value}
            onChange={(value) => onChange(value)}
            options={optionMaterial}
            selectProps={{
              menuPortalTarget: document.body,
            }}
          />
        </DataEntry>
      );
    },
  },
  goodsQuantity: {
    label: '數量',
    width: '45px',
    marginRight: '22px',
    center: true,
    Render: ({ value, onChange, disabled }) => {
      return (
        <DataEntry>
          <DataEntry.Input
            disabled={disabled}
            type="number"
            min={0}
            step={0}
            value={value}
            onChange={({ target }) => target.validity.valid && onChange(target.value)}
          />
        </DataEntry>
      );
    },
  },
  reason: {
    label: '調貨理由',
    width: 'auto',
    marginRight: '0px',
    flex: 'auto',
    Render: ({ value, onChange, disabled }) => {
      return (
        <DataEntry>
          <DataEntry.Textarea disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} />
        </DataEntry>
      );
    },
  },
};
