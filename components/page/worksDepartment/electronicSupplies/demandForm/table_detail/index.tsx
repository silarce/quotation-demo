import { useEffect, useState } from 'react';
import classNames from 'classnames';

import Row_, { Cell as Cell_, Tprops_cell, Tprops_row } from 'components/global/gear/table/row';
import DataEntry, { Input } from 'components/global/gear/dataEntry';

import { useDemandFormDetail, Tstate, TstateKit } from '../useDemandFormDetail';

import scss from './index.module.scss';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

// =========================================================================

type Tkeys = 'catagory' | 'name' | 'spec' | 'quantity' | 'unit' | 'note';

type Tconfig = {
  [key in Tkeys]: {
    label: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    render: (props: {
      disabled: boolean;
      stateKit: TstateKit;
      state: Tstate;
      // setQuantity: (value: `${number}` | '') => void;
    }) => React.ReactNode;
  };
};

// =========================================================================

const Cell = ({ className, ...props }: Tprops_cell) => {
  return <Cell_ className={classNames(scss.cell, className)} {...props} />;
};

const Row = ({ className, ...props }: Tprops_row) => {
  return <Row_ className={classNames(scss.row, className)} {...props} />;
};

// =========================================================================
export default function Table_detail() {
  const [disabled, setDisabled] = useState(false);

  const { stateDict, createStateKit, reset } = useDemandFormDetail(undefined);

  return (
    <div className="m-5">
      <div className="mb-2">
        {disabled && <SquareBtn sharp="mini">編輯</SquareBtn>}
        {!disabled && <SquareBtn sharp="mini">上傳</SquareBtn>}
      </div>

      {/*  */}
      <div className={scss.table}>
        <Row thead={true}>
          {keyArr.map((key) => {
            const { label, style, className } = config[key];

            return (
              <Cell key={key} style={style} className={className}>
                {label}
              </Cell>
            );
          })}
        </Row>

        {Object.entries(stateDict).map(([key, state]) => {
          const stateKit = createStateKit(key);

          return (
            <Row key={key} thead={false}>
              {keyArr.map((key) => {
                const { render, style, className } = config[key];

                return (
                  <Cell key={key} style={style} className={className}>
                    {render({ disabled, state, stateKit })}
                  </Cell>
                );
              })}
            </Row>
          );
        })}
      </div>
    </div>
  );
}
// =========================================================================

const config: Tconfig = {
  catagory: {
    label: '類別',
    style: { width: 150 },
    render({ state }) {
      return state.catagory;
    },
  },
  name: {
    label: '名稱',
    style: { width: 200 },
    render({ state }) {
      return state.name;
    },
  },
  spec: {
    label: '規格',
    style: { width: 150 },
    render({ state }) {
      return state.spec;
    },
  },
  quantity: {
    label: '數量',
    style: { width: 100 },
    render({ disabled, state, stateKit }) {
      return (
        <DataEntry showBorder={!disabled}>
          <Input
            type="number"
            min={0}
            step={0}
            disabled={disabled}
            value={state.quantity}
            onChange={(e) => {
              if (e.target.validity.valid) {
                stateKit.setQuantity(e.target.value as `${number}` | '');
              }
            }}
          />
        </DataEntry>
      );
    },
  },
  unit: {
    label: '單位',
    style: { width: 100 },
    render({ state }) {
      return state.unit;
    },
  },
  note: {
    label: '備註',
    style: { width: 200 },
    render({ state }) {
      return state.note;
    },
  },
};

const keyArr: Tkeys[] = ['catagory', 'name', 'spec', 'quantity', 'unit', 'note'];
