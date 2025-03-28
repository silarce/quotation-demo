import { useMemo } from 'react';
import classNames from 'classnames';

import { Input } from 'components/global/gear/dataEntry';

import Row, { Cell, Tprops_row } from 'components/global/gear/table/row';

import type {
  Tapi_useDetail,
  Tstate_installItem,
  TsetState_installItem,
} from 'pages/worksDepartment/outsourcingPricing/detail';

import { calcTotalPrice, calcTalent } from 'pages/worksDepartment/outsourcingPricing/detail';

import scss from './installItem.module.scss';

// icon
import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// ====================================================================

type Tkeys =
  | keyof Pick<
      Tapi_useDetail['state_installItemDict'],
      'floorNumber' | 'width' | 'height' | 'volume' | 'qty' | 'unitPrice' | 'dualPrice'
    >
  | 'btn';

type Tconfig = {
  [key in Tkeys]: {
    label: string;
    style?: React.CSSProperties;
    render: (props: {
      state: Tstate_installItem;
      setState: TsetState_installItem;
      disabled: boolean;
    }) => React.ReactNode;
  };
};

// ====================================================================

const TheRow = (props: Tprops_row) => {
  return <Row gap={false} fullWidth={true} {...props} />;
};

// ====================================================================

export default function InstallItem({
  className,
  api_useDetail,
  disabled,
}: {
  className?: string;
  api_useDetail: Tapi_useDetail;
  disabled: boolean;
}) {
  const { state_installItemDict, createEditState_installItem, total_installItem, deleteInstallItem } = api_useDetail;

  const installItemArr = useMemo(() => {
    return Object.entries(state_installItemDict);
  }, [state_installItemDict]);

  return (
    <div className={classNames('w-[1100px] bg-slate-500', scss.table, className)}>
      <TheRow thead={true}>
        <Cell style={config_useTable01.btn.style} className={classNames(scss.cell)} />
        {keyArr.map((key) => {
          const config = config_useTable01[key];

          return (
            <Cell key={key} style={config.style} className={classNames('text-main', scss.cell)}>
              {config.label}
            </Cell>
          );
        })}
      </TheRow>

      {installItemArr.map(([key, installItem]) => {
        const setState = createEditState_installItem(key);

        return (
          <TheRow key={key}>
            <Cell style={config_useTable01.btn.style} className={classNames(scss.cell_btn, disabled && 'invisible')}>
              <IconDelete01 onClick={() => deleteInstallItem(key)} />
            </Cell>

            {keyArr.map((key) => {
              const { style, render } = config_useTable01[key];

              const node = render({
                state: installItem,
                setState,
                disabled,
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
        <Cell className={classNames(scss.cell_body)} style={config_useTable01.unitPrice.style}>
          {total_installItem.toLocaleString()}
        </Cell>
      </TheRow>
    </div>
  );
}

// ====================================================================

const keyArr: Tkeys[] = ['floorNumber', 'width', 'height', 'volume', 'qty', 'unitPrice', 'dualPrice'];

const config_useTable01: Tconfig = {
  btn: {
    label: '',
    style: {
      width: '40px',
      justifyContent: 'center',
    },
    render: () => null,
  },
  floorNumber: {
    label: '樓層編號',
    style: {
      flex: 'auto',
      justifyContent: 'flex-start',
    },
    render: ({ state, setState, disabled }) => {
      return (
        <Input
          className={classNames(scss.input, scss.textLeft, disabled && scss.disabled)}
          value={state.floorNumber}
          disabled={disabled}
          onChange={(e) => {
            setState((prev) => ({ ...prev, floorNumber: e.target.value }));
          }}
        />
      );
    },
  },
  width: {
    label: '寬',
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
          value={state.width}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.validity.valid) {
              setState((prev) => {
                const copy = { ...prev };
                copy.width = e.target.value as `${number}`;
                copy.talent = calcTalent(copy);
                copy.totalPrice = calcTotalPrice(copy);

                return copy;
              });
            }
          }}
        />
      );
    },
  },
  height: {
    label: '高',
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
          step={1}
          value={state.height}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.validity.valid) {
              setState((prev) => {
                const copy = { ...prev };
                copy.height = e.target.value as `${number}`;
                copy.talent = calcTalent(copy);
                copy.totalPrice = calcTotalPrice(copy);

                return copy;
              });
            }
          }}
        />
      );
    },
  },
  volume: {
    label: '才數',
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
          step={1}
          value={state.talent}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.validity.valid) {
              setState((prev) => {
                const copy = { ...prev };
                copy.talent = e.target.value as `${number}`;
                copy.totalPrice = calcTotalPrice(copy);

                return copy;
              });
            }
          }}
        />
      );
    },
  },
  qty: {
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
          step={1}
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
          step={1}
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
  dualPrice: {
    label: '小計',
    style: {
      width: 150,
      justifyContent: 'flex-end',
    },
    render: ({ state }) => {
      return <div className={classNames(scss.money)}>{Number(state.unitPrice || 0).toLocaleString()}</div>;
    },
  },
};
