import { useMemo } from 'react';
import classNames from 'classnames';

import { Input, Select, InputSelect } from 'components/global/gear/dataEntry';

import Row, { Cell, Tprops_row } from 'components/global/gear/table/row';

import type {
  Tapi_useDetail,
  Tstate_otherWorkItem,
  TsetState_otherWorkItem,
} from 'pages/worksDepartment/outsourcingPricing/detail';

import { calcTotalPrice } from 'pages/worksDepartment/outsourcingPricing/detail';

import scss from './otherWorkItem.module.scss';

// icon
import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

import { optionsCreator_otherWorkItems, Toption } from 'js/utils/options/options';
// ==========================================================================

interface TconifgItem {
  label: string;
  style?: React.CSSProperties;
  render: (props: {
    state: Tstate_otherWorkItem;
    setState: TsetState_otherWorkItem;
    disabled: boolean;
    // options: { value: string; label: React.ReactNode }[];
    // options: O;
    options: Toption[];
  }) => React.ReactNode;
}

// ==========================================================================

const TheRow = (props: Tprops_row) => {
  return <Row gap={false} fullWidth={true} {...props} />;
};

// ==========================================================================

export default function OtherWorkItem({
  className,
  api_useDetail,
  disabled,
}: {
  className?: string;
  api_useDetail: Tapi_useDetail;
  disabled: boolean;
}) {
  const {
    state_otherWorkItemArr,
    createEditState_otherWorkItem,
    deleteOtherWorkItem,
    total_otherWorkItem,
    options_installItem,
  } = api_useDetail;

  return (
    <div className={classNames('w-[1100px] bg-slate-500', scss.table, className)}>
      <TheRow thead={true}>
        <Cell style={config.btn.style} className={classNames(scss.cell)} />
        {keyArr.map((key) => {
          const { label, style } = config[key];

          return (
            <Cell key={key} style={style} className={classNames('text-main', scss.cell)}>
              {label}
            </Cell>
          );
        })}
      </TheRow>
      {/*  */}
      {state_otherWorkItemArr.map((otherWorkItem, index) => {
        const setState = createEditState_otherWorkItem(index);

        const installItemKey = otherWorkItem.installItemKey;

        return (
          <TheRow key={index} className={classNames(!installItemKey && scss.isValid)}>
            <Cell style={config.btn.style} className={classNames(scss.cell_btn, disabled && 'invisible')}>
              <IconDelete01 onClick={() => deleteOtherWorkItem(index)} />
            </Cell>

            {keyArr.map((key) => {
              const { style, render } = config[key];

              const node = render({
                state: otherWorkItem,
                setState,
                disabled,
                options: options_installItem,
              });

              return (
                <Cell key={key} style={style} className={classNames(scss.cell_body)}>
                  {node}
                </Cell>
              );
            })}
          </TheRow>
        );
      })}
      {/*  */}
      <TheRow>
        <Cell
          className={classNames(scss.cell_body)}
          style={{
            flex: 'auto',
            justifyContent: 'flex-end',
          }}
        >
          合計
        </Cell>
        <Cell className={classNames(scss.cell_body)} style={config.unitPrice.style}>
          {total_otherWorkItem.toLocaleString()}
        </Cell>
      </TheRow>
    </div>
  );
}
// ==========================================================================

function defineConfig<T extends Record<string, TconifgItem>>(obj: T) {
  return obj;
}

const config = defineConfig({
  btn: {
    label: '',
    style: {
      width: '40px',
      justifyContent: 'center',
    },
    render: () => null,
  },
  floorNumber: {
    label: '項目',
    style: {
      flex: 'auto',
      justifyContent: 'flex-start',
    },
    render: ({ state, setState, disabled, options }) => {
      if (disabled) {
        return <div>{state.floorNumber}</div>;
      }

      return (
        <Select
          className={classNames(scss.select, scss.plus, scss.plus2)}
          value={state.floorNumber}
          disabled={disabled}
          options={options}
          onChange={(v, _option) => {
            const option = _option as Toption | undefined;

            const { value = '', floorNumber } = option ?? { floorNumber: '' };
            setState((prev) => ({
              ...prev,
              installItemKey: value,
              floorNumber: floorNumber as string,
            }));
          }}
        />
      );
    },
  },
  content: {
    label: '內容',
    style: {
      width: '450px',
      justifyContent: 'flex-start',
    },
    render: ({ state, setState, disabled }) => {
      return (
        <InputSelect
          className={classNames(scss.inputSelect, disabled && scss.disabled)}
          value={state.content}
          options={optionsCreator_otherWorkItems()}
          disabled={disabled}
          onChange={(v) => {
            setState((prev) => ({ ...prev, content: v }));
          }}
        />
      );
    },
  },
  quantity: {
    label: '樘數',
    style: {
      width: 150,
      justifyContent: 'center',
    },
    render: ({ state, setState, disabled }) => {
      return (
        <Input
          className={classNames(scss.input, disabled && scss.disabled)}
          type="number"
          min={0}
          step={0}
          value={state.quantity}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.validity.valid) {
              setState((prev) => {
                const copy = { ...prev };
                copy.quantity = e.target.value as `${number}`;
                copy.totalPrice = calcTotalPrice(copy);

                return copy;
              });
            }
          }}
        />
      );
    },
  },
  unitPrice: {
    label: '價格/才',
    style: {
      width: 150,
      justifyContent: 'flex-end',
    },
    render: ({ state, setState, disabled }) => {
      if (disabled) {
        return <div className={classNames(scss.money)}>{Number(state.unitPrice || 0).toLocaleString()}</div>;
      }

      return (
        <Input
          className={classNames(!disabled && 'border-b-[1px] border-black text-right')}
          type="number"
          min={0}
          step={0}
          value={state.unitPrice}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.validity.valid) {
              setState((prev) => {
                const copy = { ...prev };
                copy.unitPrice = e.target.value as `${number}`;
                copy.totalPrice = calcTotalPrice(copy);

                return copy;
              });
            }
          }}
        />
      );
    },
  },
  totalPrice: {
    label: '小計',
    style: {
      width: 150,
      justifyContent: 'flex-end',
    },
    render: ({ state }) => {
      return <div className={classNames(scss.money)}>{Number(state.totalPrice || 0).toLocaleString()}</div>;
    },
  },
});

const keyArr: (keyof typeof config)[] = ['floorNumber', 'content', 'quantity', 'unitPrice', 'totalPrice'];
