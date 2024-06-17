import { useState, useMemo, useEffect } from 'react';

import classNames from 'classnames';
import { useRouter } from 'next/router';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
// import Table01, { Ttable, Tcell, Tconfig_table } from 'components/global/gear/table/table01';

// icon
import { IconCheck02, IconEdit } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './index.module.scss';

// type
import type { TincomeBillSerialDto } from 'js/api/dtoTypes';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ==============================================================================

type Tquery = {
  tab: 'domestic' | 'export';
  year: string;
  month: string;
};

type Tstate_incomeBillSerial = {
  billSerialNumber: string;
  receiveDate: string;
  contractNumber: string;
  projectName: string;
  contractPayment: string;
  periodPayment: string;
  priorPeriodPayment: string;
  importAccountingNumber: string;
  noteNumber: string;
  noteMaturityDate: string;
  receivablePayment: string;
  deductionPayment: string;
  unpaidPayment: string;
};

// ==============================================================================

// MARK:START

export default function IncomeSummons() {
  const router = useRouter();
  const query = router.query as Tquery;

  // -----------------------------------------------------------------------------

  // MARK: PROPS

  // -----------------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02 tagList={createTagList()} />
      <div className={scss.main}>
        <div className={scss.tableWrapper}>
          <div className={scss.table}>
            <Row className={scss.thead}>
              <div style={config.btnPanel.style}></div>
              {keyArr.map((key) => {
                const { label, style } = config[key];

                return (
                  <div key={key} style={style}>
                    {label}
                  </div>
                );
              })}
            </Row>

            {fakeDataArr.map((data, index) => {
              return <Summons key={data.id} incomeBillSerial={data} />;
            })}
          </div>
        </div>
        {/*  */}
      </div>
    </SubLayer>
  );
}

// MARK: END

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// MARK: COMPONENT

const Row = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={classNames(scss.row, className)}>{children}</div>;
};

const Summons = ({ incomeBillSerial }: { incomeBillSerial: TincomeBillSerialDto }) => {
  const defaultData = useMemo(() => {
    return incomeBillSerial;
  }, [incomeBillSerial]);

  const [disabled, setDisabled] = useState(true);
  const [state_incomeBillSerial, setState_incomeBillSerial] = useState<TincomeBillSerialDto>(defaultData);

  // ---------------------------------------------------------------------
  const handle_onChange = (
    //
    key: 'contractPayment' | 'periodPayment' | 'priorPeriodPayment',
    str: string
  ) => {
    const num = Number(str);

    if (isNaN(num)) {
      return;
    }

    setState_incomeBillSerial((prev) => {
      return {
        ...prev,
        [key]: num,
      };
    });
  };

  const reqPatch = () => {};

  // ---------------------------------------------------------------------

  useEffect(() => {
    setState_incomeBillSerial(defaultData);
  }, [defaultData, disabled]);

  // ---------------------------------------------------------------------

  return (
    <Row className={classNames(scss.tbody, !disabled && scss.enabled)}>
      <div className={scss.btnPanel} style={config.btnPanel.style}>
        <IconEdit className={classNames(!disabled && scss.enable)} onClick={() => setDisabled((state) => !state)} />
        <IconCheck02 className={classNames(disabled && 'invisible')} />
      </div>

      {keyArr.map((key) => {
        const { style, createInputAttr } = config[key];

        const attr = createInputAttr({
          disabled,
          state_incomeBillSerial,
          handle_onChange,
        });
        const isReadOnly = attr?.readOnly;

        return (
          <div key={key} style={style}>
            <input
              //
              className={classNames(isReadOnly && scss.readOnly)}
              {...attr}
            />
          </div>
        );
      })}
    </Row>
  );
};

// ==============================================================================

// MARK: PROPS

const createTagList = (): TtagList => {
  return [
    {
      label: '收入傳票(內銷)',
      onClick: () => {},
      isActive: undefined,
    },
    {
      label: '收入傳票(外銷)',
      onClick: () => {},
      isActive: undefined,
    },
  ];
};

// ==============================================================================

// MARK: config

// type TconfigKey =
//   | 'billSerialNumber'
//   | 'invoiceType'
//   | 'receiveDate'
//   | 'contractNumber'
//   | 'projectName'
//   | 'contractPayment'
//   | 'periodPayment'
//   | 'priorPeriodPayment'
//   | 'importAccountingNumber'
//   | 'noteNumber'
//   | 'noteMaturityDate'
//   | 'receivablePayment'
//   | 'deductionAmount'
//   | 'unpaidPayment';

type TconfigKey = keyof Omit<TincomeBillSerialDto, 'id' | 'createdAt' | 'updatedAt'>;

type TconfigItem = {
  label: string;
  style?: React.CSSProperties;
  createInputAttr: (props: {
    disabled: boolean;
    state_incomeBillSerial: TincomeBillSerialDto;
    handle_onChange: (key: 'contractPayment' | 'periodPayment' | 'priorPeriodPayment', str: string) => void;
  }) => React.InputHTMLAttributes<HTMLInputElement> | void;
};

type Tconfig = {
  [key in TconfigKey]: TconfigItem;
} & {
  btnPanel: TconfigItem;
};

const keyArr: TconfigKey[] = [
  'billSerialNumber',
  // 'invoiceType',
  'receiveDate',
  'contractNumber',
  'projectName',
  'contractPayment',
  'periodPayment',
  'priorPeriodPayment',
  'importAccountingNumber',
  'noteNumber',
  'noteMaturityDate',
  'receivablePayment',
  'deductionPayment',
  'unpaidPayment',
];

const config: Tconfig = {
  btnPanel: {
    label: '',
    style: { width: 80 },
    createInputAttr: () => {},
  },

  billSerialNumber: {
    label: '收入傳票序號',
    style: { width: 120 },
    createInputAttr: () => ({
      readOnly: true,
    }),
  },
  // invoiceType: {
  //   label: '發票類別',
  //   style: { width: 80 },
  // },
  receiveDate: {
    label: '日期',
    style: { width: 80 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      defaultValue: getTaiwanDateStr(state_incomeBillSerial.receiveDate) ?? '',
      readOnly: true,
    }),
  },
  contractNumber: {
    label: '合約編號',
    style: { width: 100 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      defaultValue: state_incomeBillSerial.contractNumber ?? '',
      readOnly: true,
    }),
  },
  projectName: {
    label: '工程名稱',
    style: {
      flex: '1',
    },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      defaultValue: state_incomeBillSerial.projectName ?? '',
      readOnly: true,
    }),
  },
  contractPayment: {
    label: '承攬價',
    style: { width: 100 },
    createInputAttr: ({ disabled, state_incomeBillSerial, handle_onChange }) => {
      const type = disabled ? 'text' : 'number';
      const value =
        (disabled
          ? state_incomeBillSerial.contractPayment?.toLocaleString()
          : state_incomeBillSerial.contractPayment) ?? '';
      const readOnly = disabled ? true : false;
      const className = classNames(readOnly && scss.readOnly);

      return {
        type,
        value,
        readOnly,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handle_onChange('contractPayment', e.target.value);
        },
        className,
      };
    },
  },
  periodPayment: {
    label: '本期計價',
    style: { width: 100 },
    createInputAttr: ({ disabled, state_incomeBillSerial, handle_onChange }) => {
      const type = disabled ? 'text' : 'number';
      const value =
        (disabled ? state_incomeBillSerial.periodPayment?.toLocaleString() : state_incomeBillSerial.periodPayment) ??
        '';
      const readOnly = disabled ? true : false;

      return {
        type,
        value,
        readOnly,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handle_onChange('periodPayment', e.target.value);
        },
      };
    },
  },
  priorPeriodPayment: {
    label: '前期已收',
    style: { width: 100 },
    createInputAttr: ({ disabled, state_incomeBillSerial, handle_onChange }) => {
      const type = disabled ? 'text' : 'number';
      const value =
        (disabled
          ? state_incomeBillSerial.priorPeriodPayment?.toLocaleString()
          : state_incomeBillSerial.priorPeriodPayment) ?? '';
      const readOnly = disabled ? true : false;

      return {
        type,
        value,
        readOnly,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handle_onChange('priorPeriodPayment', e.target.value);
        },
      };
    },
  },
  importAccountingNumber: {
    label: '票據/匯入帳號',
    style: { width: 120 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      defaultValue: state_incomeBillSerial.importAccountingNumber ?? '',
      readOnly: true,
    }),
  },
  noteNumber: {
    label: '票據號碼',
    style: { width: 100 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      defaultValue: state_incomeBillSerial.noteNumber ?? '',
      readOnly: true,
    }),
  },
  noteMaturityDate: {
    label: '票據日期', // (到期日)
    style: { width: 80 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      defaultValue: getTaiwanDateStr(state_incomeBillSerial.noteMaturityDate) ?? '',
      readOnly: true,
    }),
  },
  receivablePayment: {
    label: '收款金額',
    style: { width: 100 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      defaultValue: state_incomeBillSerial.receivablePayment ?? '',
      readOnly: true,
    }),
  },
  deductionPayment: {
    label: '扣款金額',
    style: { width: 100 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      defaultValue: state_incomeBillSerial.deductionPayment ?? '',
      readOnly: true,
    }),
  },
  unpaidPayment: {
    label: '餘額',
    style: { width: 100 },
    createInputAttr: ({ state_incomeBillSerial }) => ({
      defaultValue: state_incomeBillSerial.unpaidPayment ?? '',
      readOnly: true,
    }),
  },
} as const;

// ==============================================================================

// MARK: FAKE DATA

const fakeDataArr: TincomeBillSerialDto[] = [
  {
    id: '1',
    createdAt: '2021-10-01',
    updatedAt: '2021-10-01',
    billSerialNumber: '1',
    receiveDate: '2021-10-01',
    contractNumber: '1',
    projectName: '1',
    contractPayment: 1,
    periodPayment: 1,
    priorPeriodPayment: 1,
    importAccountingNumber: '1',
    noteNumber: '1',
    noteMaturityDate: '2021-10-01',
    receivablePayment: 1,
    deductionPayment: 1,
    unpaidPayment: 1,
  },
  {
    id: '2',
    createdAt: '2021-10-01',
    updatedAt: '2021-10-01',
    billSerialNumber: '2',
    receiveDate: '2021-10-01',
    contractNumber: '2',
    projectName: '2',
    contractPayment: 20000,
    periodPayment: 2,
    priorPeriodPayment: 2,
    importAccountingNumber: '2',
    noteNumber: '2',
    noteMaturityDate: '2021-10-01',
    receivablePayment: 2,
    deductionPayment: 2,
    unpaidPayment: 2,
  },
  {
    id: '3',
    createdAt: '2021-10-01',
    updatedAt: '2021-10-01',
    billSerialNumber: '3',
    receiveDate: '2021-10-01',
    contractNumber: '3',
    projectName: '3',
    contractPayment: 3,
    periodPayment: 3,
    priorPeriodPayment: 3,
    importAccountingNumber: '3',
    noteNumber: '3',
    noteMaturityDate: '2021-10-01',
    receivablePayment: 3,
    deductionPayment: 3,
    unpaidPayment: 3,
  },
];

// ==============================================================================
