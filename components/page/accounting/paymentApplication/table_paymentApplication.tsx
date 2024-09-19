import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';

// gear
import Row, { Cell, Tprops_cell } from 'components/global/gear/table/row';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { TablePanel_basic } from 'components/global/gear/table/tablePanel';

import scss from './table_paymentApplication.module.scss';

// ============================================================================

interface Tstate {
  沖銷: boolean;
  立帳單號: string;
  來源單號: string;
  交易日期: Moment | null;
  應付帳款: `${number}`;
  本次沖銷: `${number}`;
  發票號碼: string;
  未充盈餘: `${number}`;
  摘要說明: string;
}

interface TfakeData {
  沖銷: boolean;
  立帳單號: string;
  來源單號: string;
  交易日期: string;
  應付帳款: number;
  本次沖銷: number;
  發票號碼: string;
  未充盈餘: number;
  摘要說明: string;
}

type TconfigKeys =
  | 'panel'
  | 'indexNumber'
  | '沖銷'
  | '立帳單號'
  | '來源單號'
  | '交易日期'
  | '應付帳款'
  | '本次沖銷'
  | '發票號碼'
  | '未充盈餘'
  | '摘要說明';

// type TconfigKeys_inputSel =

type Tconfig_cell = {
  [key in TconfigKeys]: {
    label?: string;
    style: Tprops_cell['style'];
  };
};

type Tconfig_inputSel = {
  [key in TconfigKeys]: (props: {
    state: Tstate;
    setState: React.Dispatch<React.SetStateAction<Tstate>>;
    disabled: boolean;
  }) => TinputSelProps;
};

// ============================================================================
export default function Table_paymentApplication({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className={classNames(scss.title, 'mb-2')}>
        <span>明細資料</span>
        <SquareBtn label="查詢應付帳款" sharp="long" />
      </div>
      <div className={scss.table}>
        <Row className={scss.thead} thead={true}>
          <Cell style={config_cell.panel.style}></Cell>
          <Cell style={config_cell.indexNumber.style}></Cell>

          {cellKeyArr.map((key) => {
            const { label, style } = config_cell[key];

            return (
              <Cell key={key} style={style}>
                {label}
              </Cell>
            );
          })}
        </Row>

        {Array.from({ length: 10 }).map((_, index) => {
          return <DataRow key={index} indexNumber={index + 1} />;
        })}
      </div>
    </div>
  );
}

// ==============================================================================

const DataRow = ({ indexNumber }: { indexNumber: React.ReactNode }) => {
  const [disabled, setDisabled] = useState(true);

  const defaultState = useMemo(() => {
    const { 沖銷, 立帳單號, 來源單號, 交易日期, 應付帳款, 本次沖銷, 發票號碼, 未充盈餘, 摘要說明 } = fakeData();

    return {
      沖銷,
      立帳單號,
      來源單號,
      交易日期: moment(交易日期),
      應付帳款: String(應付帳款) as `${number}`,
      本次沖銷: String(本次沖銷) as `${number}`,
      發票號碼,
      未充盈餘: String(未充盈餘) as `${number}`,
      摘要說明,
    };
  }, [fakeData]);

  const [state, setState] = useState<Tstate>(defaultState);

  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  useEffect(() => {
    if (disabled) {
      setState(defaultState);
    }
  }, [disabled]);

  return (
    <Row>
      <Cell style={config_cell.panel.style}>
        <TablePanel_basic
          disabled={disabled}
          onEdit={() => {
            setDisabled((prev) => !prev);
          }}
          onDelete={() => {}}
        />
      </Cell>
      <Cell style={config_cell.indexNumber.style}>
        {config_cell.panel.label}
        {indexNumber}
      </Cell>

      {cellKeyArr.map((key) => {
        const { style } = config_cell[key];
        const inputSelProps = config_inputSel[key]({ state, setState, disabled });

        return (
          <Cell key={key} style={style}>
            <InputSel disabled={disabled} showBaseline="auto" {...inputSelProps} />
          </Cell>
        );
      })}
    </Row>
  );
};

// ==============================================================================

const cellKeyArr: TconfigKeys[] = [
  '沖銷',
  '立帳單號',
  '來源單號',
  '交易日期',
  '應付帳款',
  '本次沖銷',
  '發票號碼',
  '未充盈餘',
  '摘要說明',
];

const config_cell: Tconfig_cell = {
  panel: {
    style: { width: 80 },
  },
  indexNumber: {
    style: { width: 30 },
  },
  沖銷: {
    label: '沖銷',
    style: { width: 40 },
  },
  立帳單號: {
    label: '立帳單號',
    style: { width: 100 },
  },
  來源單號: {
    label: '來源單號',
    style: { width: 100 },
  },
  交易日期: {
    label: '交易日期',
    style: { width: 120 },
  },
  應付帳款: {
    label: '應付帳款',
    style: { width: 100 },
  },
  本次沖銷: {
    label: '本次沖銷',
    style: { width: 100 },
  },
  發票號碼: {
    label: '發票號碼',
    style: { width: 120 },
  },
  未充盈餘: {
    label: '未充盈餘',
    style: { width: 100 },
  },
  摘要說明: {
    label: '摘要說明',
    style: { width: 100 },
  },
};

const config_inputSel: Tconfig_inputSel = {
  panel: () => ({}),
  indexNumber: () => ({}),
  沖銷: ({ state, setState, disabled }) => {
    const props: TinputSelProps = {
      showBaseline: 'invisible',
      wrapperStyle: {
        width: 'fit-content',
      },
      checkBoxProps_v2: {
        props: {},
        checkBoxPropsArr: [
          {
            checked: state.沖銷,
            onChange: (e) => {
              const checked = e.target.checked;
              setState((state) => ({
                ...state,
                沖銷: checked,
              }));
            },
          },
        ],
      },
    };

    return props;
  },

  立帳單號: ({ state, setState, disabled }) => {
    const props: TinputSelProps = {
      showBaseline: 'invisible',
      node: state.立帳單號,
    };

    return props;
  },

  來源單號: ({ state, setState, disabled }) => {
    const props: TinputSelProps = {
      showBaseline: 'invisible',
      node: state.來源單號,
    };

    return props;
  },

  交易日期: ({ state, setState, disabled }) => {
    const props: TinputSelProps = {
      datePickerProps: {
        props: {
          value: state.交易日期,
          onChange: (date) => {
            setState((state) => ({ ...state, 交易日期: date }));
          },
        },
      },
    };

    return props;
  },

  應付帳款: ({ state, setState, disabled }) => {
    const { type, value } = parseInput(disabled, state.應付帳款);

    const props: TinputSelProps = {
      inputProps: {
        props: {
          type,
          value,
          onChange: (e) => {
            setState((state) => ({ ...state, 應付帳款: e.target.value as `${number}` }));
          },
        },
      },
    };

    return props;
  },

  本次沖銷: ({ state, setState, disabled }) => {
    const { type, value } = parseInput(disabled, state.本次沖銷);

    const props: TinputSelProps = {
      inputProps: {
        props: {
          type,
          value,
          onChange: (e) => {
            setState((state) => ({ ...state, 應付帳款: e.target.value as `${number}` }));
          },
        },
      },
    };

    return props;
  },

  發票號碼: ({ state, setState, disabled }) => {
    const props: TinputSelProps = {
      showBaseline: 'invisible',
      node: state.發票號碼,
    };

    return props;
  },

  未充盈餘: ({ state, setState, disabled }) => {
    const { type, value } = parseInput(disabled, state.未充盈餘);

    const props: TinputSelProps = {
      inputProps: {
        props: {
          type,
          value,
          onChange: (e) => {
            setState((state) => ({ ...state, 應付帳款: e.target.value as `${number}` }));
          },
        },
      },
    };

    return props;
  },

  摘要說明: ({ state, setState, disabled }) => {
    const props: TinputSelProps = {
      inputProps: {
        props: {
          type: 'text',
          value: state.摘要說明,
          onChange: (e) => {
            setState((state) => ({ ...state, 摘要說明: e.target.value }));
          },
        },
      },
    };

    return props;
  },
};

// =====================================================================

const parseInput = (disabled: boolean, value: `${number}`) => {
  if (disabled) {
    return {
      type: 'text',
      value: Number(value).toLocaleString(),
    };
  } else {
    return {
      type: 'number',
      value: value,
    };
  }
};

// =====================================================================

const fakeData = (): TfakeData => ({
  沖銷: false,
  立帳單號: '123',
  來源單號: '321',
  交易日期: '2022-11-11',
  應付帳款: 9999,
  本次沖銷: 9999,
  發票號碼: 'AA-11223344',
  未充盈餘: 9999,
  摘要說明: 'FOOOO',
});
