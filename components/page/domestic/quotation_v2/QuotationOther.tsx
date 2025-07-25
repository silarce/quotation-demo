import { useState, useEffect } from 'react';

import classNames from 'classnames';

// component
import { QuotationRow, QuotationRow_thead, Cell } from 'components/page/domestic/quotation_v2/quotationRow';

// gear
import { TinputSelProps, InputSel_prod } from './hook/quotationProduct/ui/InputSel_prod';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

// icon
// import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
// import iconReset from 'public/image/icon/reset.svg?url';
// import iconChange from 'public/image/icon/change.svg?url';

import inputLocaleStringSwitcher from 'js/utils/helpers/inputLocaleStringSwitcher';

// hook type
import type { TstateOther, TsetOther, Tinstance_useQuotationOther } from './hook/quotationProduct/useQuotationOther';

// css
import scss from 'components/page/domestic/quotation_v2/QuotationProdTable.module.scss';

import { Cell_indexNumber, Cell_delete } from './hook/quotationProduct/ui/cell';

// ===========================================================

interface TconfigItem {
  readonly label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  createNode: (props: { disabled: boolean; state_other: TstateOther; setOther: TsetOther }) => React.ReactNode;
}

type Tconfig = Record<keyof TstateOther, TconfigItem>;

type Tkey = keyof Tconfig;

// ===========================================================
// MARK: START

export default function QuotationOther({
  className,
  disabled,
  instance_useQuotationOther: { state_otherArr, createSetOther, addOther, removeOther },
}: {
  className?: string;
  disabled: boolean;
  instance_useQuotationOther: Tinstance_useQuotationOther;
}) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    setActiveIndex(-1);
  }, [disabled]);

  // MARK: RENDER
  return (
    <div>
      <div className={classNames(scss.title, 'p-[10px]')}>其他設定</div>
      <div className={classNames(scss.otherTable, className)}>
        <div className={scss.table}>
          <QuotationRow_thead
            className={scss.rowThead}
            left={
              <>
                <Cell_delete className={'invisible'} onClick={() => {}} />
                <Cell_indexNumber className="invisible" />
                <Cell
                  className={classNames('text-xl text-main', config['item'].className)}
                  style={config['item'].style}
                >
                  {config['item'].label}
                </Cell>
              </>
            }
          >
            {keyArr.map((cellKey) => {
              const { label, style, className } = config[cellKey];

              return (
                <Cell key={cellKey} style={style} className={classNames(className, 'text-lg text-main')}>
                  {label}
                </Cell>
              );
            })}
          </QuotationRow_thead>

          <div>
            {state_otherArr?.map((state_other, index) => {
              const setOther = createSetOther(index);

              const isActive = activeIndex === index;

              const left = (
                <>
                  <Cell_delete className={classNames(disabled && 'invisible')} onClick={() => removeOther(index)} />
                  <Cell_indexNumber>{index + 1}</Cell_indexNumber>
                  <Cell className={classNames()} style={config.item.style}>
                    {config.item.createNode({
                      disabled,
                      state_other,
                      setOther,
                    })}
                  </Cell>
                </>
              );

              return (
                <QuotationRow
                  key={index}
                  isActive={isActive}
                  left={left}
                  onClick={() => setActiveIndex(index)}
                  className={classNames(isActive && scss.active)}
                >
                  {keyArr.map((cellKey) => {
                    const { style, className, createNode } = config[cellKey];

                    const node = createNode({
                      disabled,
                      state_other,
                      setOther,
                    });

                    return (
                      <Cell key={cellKey} className={classNames(className)} style={style}>
                        {node}
                      </Cell>
                    );
                  })}
                </QuotationRow>
              );
            })}
          </div>
        </div>
        <div className={classNames(scss.bottom, disabled && 'invisible')}>
          <SquareBtn
            sharp="mini"
            className={scss.btn}
            //
            onClick={addOther}
          >
            新增其他
          </SquareBtn>
        </div>
      </div>
    </div>
  );
}
// MARK: END

// ===========================================================

const keyArr: Tkey[] = ['description', 'quantity', 'unit', 'unitPrice', 'totalPrice', 'notes', 'spec'];

const config: Tconfig = {
  item: {
    label: '項目',
    style: { width: 100 },
    createNode({ disabled, state_other, setOther }) {
      const inputSelProps: TinputSelProps = {
        disabled,
        inputProps: {
          props: {
            value: state_other.item,
            onChange(e) {
              setOther('item', e.target.value);
            },
          },
        },
      };

      return <InputSel_prod {...inputSelProps} />;
    },
  },
  description: {
    label: '內容',
    style: { width: 200 },
    createNode({ disabled, state_other, setOther }) {
      const inputSelProps: TinputSelProps = {
        disabled,
        inputProps: {
          props: {
            value: state_other.description,
            onChange(e) {
              setOther('description', e.target.value);
            },
          },
        },
      };

      return <InputSel_prod {...inputSelProps} />;
    },
  },
  quantity: {
    label: '數量',
    style: { width: 50 },
    createNode({ disabled, state_other, setOther }) {
      const inputSelProps: TinputSelProps = {
        disabled,
        inputProps: {
          props: {
            type: 'number',
            value: state_other.quantity,
            onChange(e) {
              setOther('quantity', e.target.value as `${number}` | '');
            },
          },
        },
      };

      return <InputSel_prod {...inputSelProps} />;
    },
  },
  unit: {
    label: '單位',
    style: { width: 50 },
    createNode({ disabled, state_other, setOther }) {
      const inputSelProps: TinputSelProps = {
        disabled,
        inputProps: {
          props: {
            value: state_other.unit ?? '',
            onChange(e) {
              setOther('unit', e.target.value);
            },
          },
        },
      };

      return <InputSel_prod {...inputSelProps} />;
    },
  },
  unitPrice: {
    label: '單價',
    style: { width: 100, textAlign: 'right' },
    createNode({ disabled, state_other, setOther }) {
      const { value, type } = inputLocaleStringSwitcher(state_other.unitPrice, disabled);

      const inputSelProps: TinputSelProps = {
        disabled,
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value: value,
            onChange(e) {
              setOther('unitPrice', e.target.value as `${number}` | '');
            },
          },
        },
      };

      return <InputSel_prod {...inputSelProps} />;
    },
  },
  totalPrice: {
    label: '複價',
    style: { width: 100, textAlign: 'right' },
    createNode(props) {
      const { disabled, state_other, setOther } = props;
      const totalPrice_num = Number(state_other.totalPrice || 0);
      const inputSelProps: TinputSelProps = {
        disabled,
        showBaseline: 'invisible',
        node: totalPrice_num.toLocaleString(),
      };

      return <InputSel_prod {...inputSelProps} />;
    },
  },
  notes: {
    label: '備註',
    style: { width: 200 },
    createNode({ disabled, state_other, setOther }) {
      const inputSelProps: TinputSelProps = {
        disabled,
        inputProps: {
          props: {
            value: state_other.notes,
            onChange(e) {
              setOther('notes', e.target.value);
            },
          },
        },
      };

      return <InputSel_prod {...inputSelProps} />;
    },
  },
  spec: {
    label: '尺寸規格',
    style: { width: 200 },
    createNode({ disabled, state_other, setOther }) {
      const inputSelProps: TinputSelProps = {
        disabled,
        inputProps: {
          props: {
            value: state_other.spec ?? '',
            onChange(e) {
              setOther('spec', e.target.value);
            },
          },
        },
      };

      return <InputSel_prod {...inputSelProps} />;
    },
  },
};

// ===========================================================
