import { useState, useMemo, useEffect, forwardRef } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';
import _ from 'lodash';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import EditDefunctionBtn from 'components/page/worksDepartment/contracList/contract/accountReceivable/accountantDeductionEditor';

// gear
import SelectBar from 'components/global/gear/select/selectBar/selectBar';
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import Row, { Cell } from 'components/global/gear/table/row';
import SignatureBar, { TsignatureBarItem } from 'components/global/gear/signatureBar_v2';
import { Collapse, useActiveKey, UpDownArrow } from 'components/global/myAntd/collapse';
import ProcessChain, { Tcontrol_processChain, TstatusLabelProps } from 'components/global/gear/processChain';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// icon
import { IconCheck02, IconEdit } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './index.module.scss';

// type
import type { Tparams, TincomeBillSerialDto } from 'js/api/dtoTypes';

// api
import {
  TupdateIncomeBillSerialDto,
  apiPatchIncomeBill,
  useGetAccountReceivableIncomeBills,
  //
  apiPostIncomeBillSerialSettlementForm,
  apiPatchIncomeBillSerialSettlementForm,
  useGetIncomeBillSerialSettlementForm,
} from 'js/api/api_engineering';

// untils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ==============================================================================

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type Tquery = {
  isForeign: 'true' | 'false';
  year: string;
  month: string;
};

type Tstate_incomeBillSerial = {
  id: string;
  billSerialNumber: string;
  receiveDate: Moment | null;
  contractNumber: string;
  projectName: string;
  contractPayment: string;
  periodPayment: string;
  priorPeriodPayment: string;
  importAccountingNumber: string;
  noteNumber: string;
  noteMaturityDate: Moment | null;
  receivablePayment: string;
  deductionPayment: string;
  unpaidPayment: string;
  difference: string;
  //
  readonly fee: number; // 現在是從accountant裡面拿
  //
  note: string;
  vendorName: string;

  // 看錯需求，這是不需要的，待PR之前再把這個註解刪掉
  // temporary_separatePayment: string;

  //
  readonly accountsReceivableDeduction: TincomeBillSerialDto['accountsReceivableDeduction'];
};

type TreqPatch = (incomeBillSerialId: string, state_incomeBillSerial: Tstate_incomeBillSerial) => Promise<void>;

type TtableRow = {
  caption: React.ReactNode;
  foreign: React.ReactNode;
  domestic: React.ReactNode;
  total: React.ReactNode;
};

type TconfigItem = {
  label: string;
  style?: React.CSSProperties;
  className?: string;
  createInputSelProps: (props: {
    disabled: boolean;
    isPaperImported: boolean;
    state_incomeBillSerial: Tstate_incomeBillSerial;
    setState_incomeBillSerial: React.Dispatch<React.SetStateAction<Tstate_incomeBillSerial>>;
    //
    accountantId?: string;
    update_incomeBill?: () => void;
  }) => TinputSelProps;
};

type Tconfig = {
  [key in TconfigKey]: TconfigItem;
} & {
  btnPanel: TconfigItem;
};

// ==============================================================================

const Panel = Collapse.Panel;

// ==============================================================================

// MARK:START

export default function IncomeSummons() {
  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth();

  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    isForeign = 'false',
    year = String(thisYear),
    month = String(thisMonth),
  } = query;

  // -----------------------------------------------------------------------------

  const [showTable, setShowTable] = useState(false);
  // const [activeIdArr, setActiveIdArr] = useState<string | string[]>([]);
  const { activePanelKeyArr, changeActive } = useActiveKey();

  // -----------------------------------------------------------------------------

  const params: Tparams = useMemo(() => {
    return {
      sort: 'billSerialNumber',
      pageSize: 999999,
      // populate: ['accountant'],
      populate: ['accountant', 'accountsReceivableDeduction'],
      filter: {
        isForeign: {
          $eq: isForeign === 'true',
        },
        incomeBillDate: {
          $gte: moment(`${year}-${month.padStart(2, '0')}`)
            .startOf('month')
            .toISOString(),
          $lte: moment(`${year}-${month.padStart(2, '0')}`)
            .endOf('month')
            .toISOString(),
        },
      },
    };
  }, [isForeign, month, year]);

  const {
    data: data_incomeBill = [],
    update: update_incomeBill,
    isFetching,
  } = useGetAccountReceivableIncomeBills({
    params,
  });

  // -----------------------------------------------------------------------------

  // region REQUEST

  const reqPatch = async (
    //
    incomeBillSerialId: string,
    state_incomeBillSerial: Tstate_incomeBillSerial
  ) => {
    const {
      receiveDate,
      contractNumber,
      projectName,
      contractPayment,
      periodPayment,
      priorPeriodPayment,
      importAccountingNumber,
      noteNumber,
      noteMaturityDate,
      receivablePayment,
      deductionPayment,
      unpaidPayment,
      difference,
      //
      note,
      accountsReceivableDeduction,
      fee,
    } = state_incomeBillSerial;

    const body: TupdateIncomeBillSerialDto = {
      receiveDate: receiveDate ? receiveDate.toISOString() : null,
      contractNumber: contractNumber,
      projectName: projectName,
      contractPayment: contractPayment ? Number(contractPayment) : null,
      periodPayment: periodPayment ? Number(periodPayment) : null,
      priorPeriodPayment: priorPeriodPayment ? Number(priorPeriodPayment) : null,
      importAccountingNumber: importAccountingNumber,
      noteNumber: noteNumber,
      noteMaturityDate: noteMaturityDate ? noteMaturityDate.toISOString() : null,
      receivablePayment: receivablePayment ? Number(receivablePayment) : null,
      deductionPayment: deductionPayment ? Number(deductionPayment) : null,
      unpaidPayment: unpaidPayment ? Number(unpaidPayment) : null,
      difference: difference ? difference : null,
      note: note,

      fee,
      incomeBillDeduction: accountsReceivableDeduction ?? [],
    };

    await apiPatchIncomeBill(incomeBillSerialId, body).then(update_incomeBill);
  };

  const reqApiPostIncomeBillSerialSettlementForm = async () => {
    return await apiPostIncomeBillSerialSettlementForm({});
  };

  // -----------------------------------------------------------------------------

  // region FUNCTION

  const handle_reqApiPostIncomeBillSerialSettlementForm = () => {
    myAlert.confirm({
      title: `確定要結算${month}月份收款統計明細表嗎`,
      content: '結算後無法回朔，且同一個月份不可以結算第二次',
      props: {
        onOk: reqApiPostIncomeBillSerialSettlementForm,
      },
    });
  };

  // -----------------------------------------------------------------------------

  // MARK: PROPS

  const tagList: TtagList = [
    {
      label: '收入傳票(內銷)',
      onClick: () => {
        router.replace({
          query: {
            ...query,
            isForeign: 'false',
          },
        });
      },
      isActive: isForeign === 'false',
    },
    {
      label: '收入傳票(外銷)',
      onClick: () => {
        router.replace({
          query: {
            ...query,
            isForeign: 'true',
          },
        });
      },
      isActive: isForeign === 'true',
    },
  ];

  const selectPropsArr = useMemo(() => {
    return [
      {
        selectProps: {
          value: year,
          options: yearOptionArr,
          onChange: (option) => {
            if (typeof option?.value === 'string') {
              router.replace({
                query: {
                  ...query,
                  year: option.value,
                },
              });
            }
          },
        },
        placeholder: '選擇年份',
        boxStyle: { width: '140px' },
      },
      {
        selectProps: {
          value: month,
          options: monthOptionArr,
          onChange: (option) => {
            if (typeof option?.value === 'string') {
              router.replace({
                query: {
                  ...query,
                  month: option.value,
                },
              });
            }
          },
        },
        placeholder: '選擇月份',
        boxStyle: { width: '140px' },
      },
    ] as TselectPropsArr;
  }, [year, month, yearOptionArr, monthOptionArr]);

  const panelList: TpanelList = [
    {
      type: 'redButton',
      label: '結算收款統計明細表',
      onClick: handle_reqApiPostIncomeBillSerialSettlementForm,
    },
    {
      type: 'myButton',
      label: '收款統計明細表',
      onClick: () => {
        setShowTable(true);
      },
    },
  ];

  // -----------------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer isLoading_subLayer={isFetching}>
      <PageHeader02
        tagList={tagList}
        customeLeft={[<SelectBar key="selectBar" className={'ml-5'} selectPropsArr={selectPropsArr} />]}
        panelList={panelList}
      />
      <div className={scss.main}>
        {/*  */}

        <div className={scss.tableWrapper}>
          <div className={scss.table}>
            <SummonsRow className={scss.thead}>
              <div style={config.btnPanel.style} className={config.btnPanel.className}></div>
              {keyArr.map((key) => {
                const { label, style, className } = config[key];

                return (
                  <div key={key} style={style} className={className}>
                    {label}
                  </div>
                );
              })}
            </SummonsRow>

            <Collapse activeKey={activePanelKeyArr} noTlrBorder={true}>
              {data_incomeBill.map((data, index) => {
                return (
                  <Panel
                    className={classNames(scss.panel, scss.plus)}
                    key={data.id}
                    header={
                      <Summons
                        incomeBillSerial={data}
                        reqPatch={reqPatch}
                        update_incomeBill={update_incomeBill}
                        changeActive={() => changeActive(data.id)}
                      />
                    }
                  >
                    <OtherInfo incomeBillSerial={data} />
                  </Panel>
                );
              })}
            </Collapse>
          </div>
        </div>
      </div>
      {/*  */}
      <Table
        //
        showTable={showTable}
        date={`${year}-${month.padStart(2, '0')}`}
        onCrossClick={() => setShowTable(false)}
      />
    </SubLayer>
  );
}

// MARK: END

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// MARK: COMPONENT
//
//
//
//
//
// MARK: Row
const SummonsRow_pre = (
  {
    //
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  },
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <div ref={ref} className={classNames(scss.row, className)}>
      {children}
    </div>
  );
};

// MARK: Summons

const Summons_pre = (
  {
    //
    incomeBillSerial,
    reqPatch,
    update_incomeBill,
    changeActive,
  }: {
    incomeBillSerial: TincomeBillSerialDto;
    reqPatch: TreqPatch;
    update_incomeBill: () => void;
    changeActive: () => void;
  },
  ref: React.Ref<HTMLDivElement>
) => {
  const accountantId = incomeBillSerial.accountant.id;

  const defaultState = useMemo(() => {
    const {
      id,
      billSerialNumber,
      receiveDate,
      contractNumber,
      projectName,
      contractPayment,
      periodPayment,
      priorPeriodPayment,
      importAccountingNumber,
      noteNumber,
      noteMaturityDate,
      receivablePayment,
      deductionPayment,
      unpaidPayment,
      //
      accountant,
      //
      note,

      accountsReceivableDeduction,
      fee,
    } = incomeBillSerial;

    let { difference } = incomeBillSerial;
    difference = (difference ?? '').trimEnd();

    const defaultState: Tstate_incomeBillSerial = {
      id,
      billSerialNumber: billSerialNumber,
      receiveDate: receiveDate ? moment(receiveDate) : null,
      contractNumber: contractNumber || '',
      projectName: projectName || '',
      contractPayment: String(contractPayment || ''),
      periodPayment: String(periodPayment || ''),
      priorPeriodPayment: String(priorPeriodPayment || ''),
      importAccountingNumber: importAccountingNumber || '',
      noteNumber: noteNumber || '',
      noteMaturityDate: noteMaturityDate ? moment(noteMaturityDate) : null,
      receivablePayment: String(receivablePayment || ''),
      deductionPayment: String(deductionPayment || ''),
      unpaidPayment: String(unpaidPayment || ''),
      difference: difference || '',
      fee: fee || 0,
      //
      note: note ?? '',
      vendorName: accountant.vendorName ?? '',

      accountsReceivableDeduction: accountsReceivableDeduction,

      // 看錯需求，這是不需要的，待PR之前再把這個註解刪掉
      // temporary_separatePayment: (temporary_separatePayment || 0).toLocaleString(),
    };

    return defaultState;
  }, [incomeBillSerial]);

  const [state_incomeBillSerial, setState_incomeBillSerial] = useState<Tstate_incomeBillSerial>(defaultState);

  const [disabled, setDisabled] = useState(true);

  // isPaperImported 已匯入紙本應收帳款(舊的收款紀錄)，若為true，則可以編輯所有欄位
  const isPaperImported = incomeBillSerial.isPaperImported;

  // ---------------------------------------------------------------------

  const handle_onConfirm = async () => {
    await reqPatch(incomeBillSerial.id, state_incomeBillSerial).then(() => {
      setDisabled(true);
    });
  };

  // ---------------------------------------------------------------------

  useEffect(() => {
    setState_incomeBillSerial(defaultState);
  }, [defaultState, disabled]);

  // ---------------------------------------------------------------------

  return (
    <SummonsRow ref={ref} className={classNames(scss.tbody, !disabled && scss.enabled)}>
      <div className={scss.btnPanel} style={config.btnPanel.style}>
        <UpDownArrow className="h-[20px]" onClick={changeActive} />
        <IconEdit className={classNames(!disabled && scss.enable)} onClick={() => setDisabled((state) => !state)} />
        <IconCheck02 className={classNames(disabled && 'invisible')} onClick={handle_onConfirm} />
      </div>

      {keyArr.map((key) => {
        const { style, className, createInputSelProps: createInputAttr } = config[key];

        // 要使!isPaperImported為true的狀態仍可以編輯
        // 將送進createInputAttr中的disabled回傳即可
        const inputSelProps = createInputAttr({
          disabled: disabled,
          isPaperImported,
          state_incomeBillSerial,
          setState_incomeBillSerial,
          accountantId,
          update_incomeBill,
        });

        return (
          <div key={key} style={style} className={classNames(className)}>
            <InputSel
              //
              disabled={disabled || !isPaperImported}
              showBaseline="auto"
              {...inputSelProps}
            />
          </div>
        );
      })}
    </SummonsRow>
  );
};

// MARK: Table

const Table = ({
  //
  showTable,
  date,
  onCrossClick,
}: {
  showTable: boolean;
  date: string;
  onCrossClick: () => void;
}) => {
  const { data, update } = useGetIncomeBillSerialSettlementForm(new Date(date), { autoUpdate: false });

  const title = useMemo(() => {
    if (!data) {
      return '';
    }

    const date_m = moment(data.date);
    const year = date_m.year() - 1911;
    const month = (date_m.month() + 1).toString().padStart(2, '0');

    return `${year}年${month}月收款統計明細表`;
  }, [data]);

  const rowArr = useMemo(() => {
    if (!data) {
      return [];
    }

    const {
      // 本月實際收款額(國內)
      internalActualReceivablePayment,
      // 本月實際收款額(外銷)
      foreignActualReceivablePayment,

      // 本月預估收款額(國內)
      internalEstimatePayment,
      // 本月預估收款額(外銷)
      foreignEstimatePayment,

      // 下月預估收款額(國內)
      internalNextMonthEstimatePayment,
      // 下月預估收款額(外銷)
      foreignNextMonthEstimatePayment,

      // 應收帳款總額(國內)
      internalReceivablePayment,
      // 應收帳款總額(外銷)
      foreignReceivablePayment,

      // 年度至今累積收款額(國內)
      internalAccumulatePayment,
      // 年度至今累積收款額(外銷)
      foreignAccumulatePayment,
    } = data;

    return [
      {
        caption: '本月實際收款額',
        foreign: internalActualReceivablePayment.toLocaleString(),
        domestic: foreignActualReceivablePayment.toLocaleString(),
        total: new Decimal(internalActualReceivablePayment)
          .add(foreignActualReceivablePayment)
          .toNumber()
          .toLocaleString(),
      },
      {
        caption: '本月預估收款額',
        foreign: internalEstimatePayment.toLocaleString(),
        domestic: foreignEstimatePayment.toLocaleString(),
        total: new Decimal(internalEstimatePayment).add(foreignEstimatePayment).toNumber().toLocaleString(),
      },
      {
        caption: '下月預估收款額',
        foreign: internalNextMonthEstimatePayment.toLocaleString(),
        domestic: foreignNextMonthEstimatePayment.toLocaleString(),
        total: new Decimal(internalNextMonthEstimatePayment)
          .add(foreignNextMonthEstimatePayment)
          .toNumber()
          .toLocaleString(),
      },
      {
        caption: '應收帳款總額',
        foreign: internalReceivablePayment.toLocaleString(),
        domestic: foreignReceivablePayment.toLocaleString(),
        total: new Decimal(internalReceivablePayment).add(foreignReceivablePayment).toNumber().toLocaleString(),
      },
      {
        caption: '年度至今累積收款額',
        foreign: internalAccumulatePayment.toLocaleString(),
        domestic: foreignAccumulatePayment.toLocaleString(),
        total: new Decimal(internalAccumulatePayment).add(foreignAccumulatePayment).toNumber().toLocaleString(),
      },
    ];
  }, [data]);

  const signatureArr: TsignatureBarItem[] = useMemo(() => {
    if (!data) {
      return [];
    }

    let {
      // 應收帳款狀態
      // reviewStatus,
      // 審核狀態
      reviewRecord,

      // // 經辦(製表)
      // agentEmployeeId,
      // // 經辦(製表)
      // agentEmployee,
      // // 包含的所有收入傳票
      // incomeBills,
    } = data;

    reviewRecord = _.sortBy(reviewRecord, 'level');

    const signatureArr: TsignatureBarItem[] = reviewRecord.map((record) => {
      const {
        //
        // reviewerEmployeeId,
        reviewerTitle: label,
        reviewerName: value,
        status,
        // level,
        // settlementFormId,
        // settlementForm,
      } = record;

      const isReviewed = status === 'audited' ? true : false;

      return {
        label,
        value,
        isReviewed,
        className: 'w-[100px]',
      };
    });

    return signatureArr;
  }, [data]);

  useEffect(() => {
    showTable && update();
  }, [showTable, date]);

  return (
    <DragableModal
      handleText="收款統計明細表"
      //
      show={showTable}
      onCrossClick={onCrossClick}
    >
      <div className={scss.tableContainer}>
        <p className={scss.tableTitle}>{title}</p>

        <div className={scss.table}>
          <Row thead={true}>
            <Cell style={config_table.caption.style}></Cell>
            <Cell style={config_table.foreign.style}>外銷</Cell>
            <Cell style={config_table.domestic.style}>國內</Cell>
            <Cell style={config_table.total.style}>合計</Cell>
          </Row>
          {rowArr.map((data, index) => {
            const { caption, foreign, domestic, total } = data;

            return (
              <Row key={index}>
                <Cell style={config_table.caption.style}>{caption}</Cell>
                <Cell style={config_table.foreign.style}>{foreign}</Cell>
                <Cell style={config_table.domestic.style}>{domestic}</Cell>
                <Cell style={config_table.total.style}>{total}</Cell>
              </Row>
            );
          })}
        </div>
        <SignatureBar
          className="mt-5"
          control={{
            signatureArr: signatureArr,
          }}
        />
      </div>
    </DragableModal>
  );
};

const OtherInfo = ({ incomeBillSerial }: { incomeBillSerial: TincomeBillSerialDto }) => {
  const processChainControl = useMemo(() => {
    // Tcontrol_processChain
    // TstatusLabelProps
    const arr: TstatusLabelProps[] = [
      {
        label: 'MEOW',
        dotColor: 'gray',
      },
      {
        label: 'WANG',
        dotColor: 'red',
      },
      {
        label: 'WEEEEEEEEE',
        dotColor: 'green',
      },
    ];

    const processChainControl = {
      statusArr: arr,
    };

    return processChainControl;
  }, [incomeBillSerial]);

  return (
    <div className={scss.otherInfo}>
      <div className={scss.reviewBar}>
        <MyButton_v2 px="px22" py="py4">
          審核
        </MyButton_v2>
        <ProcessChain control={processChainControl} />
      </div>
    </div>
  );
};

// forwardRef
const SummonsRow = forwardRef(SummonsRow_pre);
const Summons = forwardRef(Summons_pre);

// ==============================================================================

// MARK: HOOK

const useYearMonth = () => {
  const m_today = moment();
  const thisYear = m_today.year();
  const thisMonth = m_today.month() + 1;

  const yearOptionArr = useMemo(() => {
    const yearOptionArr = Array.from({ length: 20 }, (_, i) => {
      const year = thisYear - i;
      const year_tw = year - 1911;

      return { label: year_tw.toString(), value: year.toString() };
    });

    return yearOptionArr;
  }, [thisYear]);

  const monthOptionArr = useMemo(() => {
    const monthOptionArr = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;

      return { label: month.toString(), value: month.toString() };
    });

    return monthOptionArr;
  }, []);

  return {
    yearOptionArr,
    monthOptionArr,
    thisYear,
    thisMonth,
  };
};

// ==============================================================================

// MARK: FUNCTION

const reducer_input = ({ disabled, value }: { disabled: boolean; value: string | number }) => {
  const type = disabled ? 'text' : 'number';
  const value_num = Number(value);

  const theValue = (disabled ? value_num?.toLocaleString() : value) || '';

  return {
    type,
    value: theValue,
  };
};

const calcUnpaidPayment = (state_incomeBillSerial: Tstate_incomeBillSerial) => {
  // 餘額=承攬價/本期計價-上期已計價-扣款-匯費

  const {
    //
    contractPayment,
    periodPayment,
    priorPeriodPayment,
    deductionPayment,
    fee,
  } = state_incomeBillSerial;

  const unpaidPayment = new Decimal(contractPayment || periodPayment || 0)
    .minus(priorPeriodPayment || 0)
    .minus(deductionPayment || 0)
    .minus(fee || 0)
    .toNumber();

  return unpaidPayment;
};

// ==============================================================================

// MARK: config

type TconfigKey =
  | keyof Pick<
      TincomeBillSerialDto,
      | 'billSerialNumber'
      | 'receiveDate'
      | 'contractNumber'
      | 'projectName'
      | 'contractPayment'
      | 'periodPayment'
      | 'priorPeriodPayment'
      | 'importAccountingNumber'
      | 'noteNumber'
      | 'noteMaturityDate'
      | 'receivablePayment'
      | 'deductionPayment'
      | 'unpaidPayment'
      | 'difference'
      | 'note'

      // 看錯需求，這是不需要的，待PR之前再把這個註解刪掉
      // | 'temporary_separatePayment'
    >
  | 'fee'
  | 'vendorName';

const keyArr: TconfigKey[] = [
  'billSerialNumber',
  // 'invoiceType',
  'receiveDate',
  'contractNumber',
  'projectName',
  'vendorName',
  'contractPayment',
  'periodPayment',
  'priorPeriodPayment',
  'importAccountingNumber',
  'noteNumber',
  'noteMaturityDate',
  'receivablePayment',
  'deductionPayment',
  'fee',
  'unpaidPayment',
  'difference',

  'note',

  // 看錯需求，這是不需要的，待PR之前再把這個註解刪掉
  // 'temporary_separatePayment',
];

const config: Tconfig = {
  btnPanel: {
    label: '',
    style: { width: 120 },
    className: scss.btnPanel,
    createInputSelProps: () => ({}),
  },

  billSerialNumber: {
    label: '收入傳票序號',
    style: { width: 150 },
    className: scss.billSerialNumber,
    createInputSelProps: ({ state_incomeBillSerial }) => ({
      disabled: true,
      showBaseline: 'invisible',
      inputProps: {
        props: {
          className: 'text-center',
          value: state_incomeBillSerial.billSerialNumber,
          onChange: () => {},
        },
      },
    }),
  },

  receiveDate: {
    label: '日期',
    style: { width: 130 },
    className: 'text-center',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const datePickerProps: TinputSelProps['datePickerProps'] = {
        props: {
          value: state_incomeBillSerial.receiveDate,
          onChange: (date) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                receiveDate: date,
              };
            });
          },
        },
      };

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-center',
          value: state_incomeBillSerial.receiveDate
            ? getTaiwanDateStr(state_incomeBillSerial.receiveDate.toISOString()) ?? ''
            : '',
          onChange: () => {},
        },
      };

      const inputSelProps = disabled || !isPaperImported ? { inputProps } : { datePickerProps };

      return inputSelProps;
    },
  },
  contractNumber: {
    label: '合約編號',
    style: { width: 100 },
    createInputSelProps: ({ state_incomeBillSerial, setState_incomeBillSerial: setState_incomeBillSerial }) => ({
      inputProps: {
        props: {
          className: 'text-center',
          value: state_incomeBillSerial.contractNumber,
          onChange: (e) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                contractNumber: e.target.value,
              };
            });
          },
        },
      },
    }),
  },
  projectName: {
    label: '工程名稱',
    style: {
      // flex: '1',
      width: 200,
    },
    createInputSelProps: ({ state_incomeBillSerial, setState_incomeBillSerial: setState_incomeBillSerial }) => {
      //
      // const inputProps: TinputSelProps['inputProps'] = {
      //   props: {
      //     // className: 'text-center',
      //     value: state_incomeBillSerial.projectName,
      //     onChange: (e) => {
      //       setState_incomeBillSerial((prev) => {
      //         return {
      //           ...prev,
      //           projectName: e.target.value,
      //         };
      //       });
      //     },
      //   },
      // };
      //

      const textareaProps: TinputSelProps['textareaProps'] = {
        props: {
          value: state_incomeBillSerial.projectName,
          onChange: (e) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                projectName: e.target.value,
              };
            });
          },
        },
      };

      //

      return { textareaProps };
    },
  },
  contractPayment: {
    label: '承攬價',
    style: { width: 100 },
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.contractPayment,
      });

      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState_incomeBillSerial((prev) => {
          const copy = { ...prev };
          copy.contractPayment = e.target.value;
          copy.unpaidPayment = calcUnpaidPayment(copy).toString();
          copy.periodPayment = '';

          return copy;
        });
      };

      const inputSelProps = {
        disabled,
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            readOnly: disabled,
            onChange,
          },
        },
      };

      return inputSelProps;
    },
  },
  periodPayment: {
    label: '本期計價',
    style: { width: 100 },
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.periodPayment,
      });

      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState_incomeBillSerial((prev) => {
          const copy = { ...prev };
          copy.periodPayment = e.target.value;
          copy.unpaidPayment = calcUnpaidPayment(copy).toString();
          copy.contractPayment = '';

          return copy;
        });
      };

      const inputSelProps = {
        disabled,
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            readOnly: disabled,
            onChange: onChange,
          },
        },
      };

      return inputSelProps;
    },
  },
  priorPeriodPayment: {
    label: '前期已收',
    style: { width: 100 },
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.priorPeriodPayment,
      });

      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState_incomeBillSerial((prev) => {
          const copy = { ...prev };
          copy.priorPeriodPayment = e.target.value;
          copy.unpaidPayment = calcUnpaidPayment(copy).toString();

          return copy;
        });
      };

      const inputSelProps = {
        disabled,
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            readOnly: disabled,
            onChange: onChange,
          },
        },
      };

      return inputSelProps;
    },
  },
  importAccountingNumber: {
    label: '票據/匯入帳號',
    className: 'text-center',
    style: { width: 250 },
    createInputSelProps: ({ state_incomeBillSerial, setState_incomeBillSerial: setState_incomeBillSerial }) => ({
      inputProps: {
        props: {
          className: 'text-center',
          value: state_incomeBillSerial.importAccountingNumber,
          onChange: (e) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                importAccountingNumber: e.target.value,
              };
            });
          },
        },
      },
    }),
  },
  noteNumber: {
    label: '票據號碼',
    style: { width: 150 },
    className: 'text-center',
    createInputSelProps: ({ state_incomeBillSerial, setState_incomeBillSerial: setState_incomeBillSerial }) => ({
      inputProps: {
        props: {
          className: 'text-center',
          value: state_incomeBillSerial.noteNumber,
          onChange: (e) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                noteNumber: e.target.value,
              };
            });
          },
        },
      },
    }),
  },
  noteMaturityDate: {
    label: '票據日期', // (到期日)
    style: { width: 130 },
    className: 'text-center',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const datePickerProps: TinputSelProps['datePickerProps'] = {
        props: {
          placeholder: '',
          value: state_incomeBillSerial.noteMaturityDate,
          className: 'text-center',
          onChange: (date) => {
            setState_incomeBillSerial((prev) => {
              return {
                ...prev,
                noteMaturityDate: date,
              };
            });
          },
        },
      };

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-center',
          placeholder: '',
          value: state_incomeBillSerial.noteMaturityDate
            ? getTaiwanDateStr(state_incomeBillSerial.noteMaturityDate.toISOString()) ?? ''
            : '',
          onChange: () => {},
        },
      };

      const inputSelProps = disabled || !isPaperImported ? { inputProps } : { datePickerProps };

      return inputSelProps;
    },
  },
  receivablePayment: {
    label: '收款金額',
    style: { width: 100 },
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled,
        value: state_incomeBillSerial.receivablePayment,
      });

      return {
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value: value,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  receivablePayment: e.target.value,
                };
              });
            },
          },
        },
      };
    },
  },
  deductionPayment: {
    label: '扣款金額',
    style: { width: 150 },
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial,
      accountantId,
      update_incomeBill,
    }) => {
      const { type, value } = reducer_input({
        disabled: disabled || !isPaperImported,
        value: state_incomeBillSerial.deductionPayment,
      });

      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState_incomeBillSerial((prev) => {
          const copy = { ...prev };
          copy.deductionPayment = e.target.value;
          copy.unpaidPayment = calcUnpaidPayment(copy).toString();

          return copy;
        });
      };

      const inputSelProps: TinputSelProps = {
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            onChange: onChange,
          },
        },
        suffix: accountantId && (
          <EditDefunctionBtn
            //
            accountantId={accountantId}
            incomeBillId={state_incomeBillSerial.id}
            onConfirm={update_incomeBill}
          />
        ),
      };

      return inputSelProps;
    },
  },
  unpaidPayment: {
    label: '餘額',
    style: { width: 100 },
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      isPaperImported,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      const { type, value } = reducer_input({
        disabled: disabled || !isPaperImported,
        value: state_incomeBillSerial.unpaidPayment,
      });

      return {
        inputProps: {
          props: {
            className: 'text-right',
            type,
            value,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  unpaidPayment: e.target.value,
                };
              });
            },
          },
        },
      };
    },
  },

  difference: {
    label: '差額',
    style: { width: 200 },
    className: 'text-right',
    createInputSelProps: ({
      disabled,
      state_incomeBillSerial,
      setState_incomeBillSerial: setState_incomeBillSerial,
    }) => {
      // const { type, value } = reducer_input({
      //   disabled,
      //   value: state_incomeBillSerial.difference,
      // });

      return {
        textareaProps: {
          allowNewLineByUser: true,
          props: {
            className: 'text-right',
            placeholder: '',
            // type,
            value: state_incomeBillSerial.difference,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  difference: e.target.value,
                };
              });
            },
          },
        },
      };
    },
  },

  fee: {
    label: '匯費',
    style: { width: 100 },
    className: 'text-right',
    createInputSelProps: ({ disabled, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const inputSelProps: TinputSelProps = {
        disabled: true,
        inputProps: {
          props: {
            className: 'text-right',
            defaultValue: state_incomeBillSerial.fee.toLocaleString(),
          },
        },
      };

      return inputSelProps;
    },
  },

  note: {
    label: '備註',
    style: { width: 200 },
    className: '',
    createInputSelProps: ({ disabled, state_incomeBillSerial, setState_incomeBillSerial }) => {
      const inputSelProps: TinputSelProps = {
        disabled,
        textareaProps: {
          allowNewLineByUser: true,
          props: {
            value: state_incomeBillSerial.note,
            onChange: (e) => {
              setState_incomeBillSerial((prev) => {
                return {
                  ...prev,
                  note: e.target.value,
                };
              });
            },
          },
        },
      };

      return inputSelProps;
    },
  },

  vendorName: {
    label: '廠商名稱',
    style: { width: 150 },
    // className: 'text-center',
    createInputSelProps: ({ state_incomeBillSerial }) => {
      const inputSelProps: TinputSelProps = {
        disabled: true,
        showBaseline: 'invisible',
        inputProps: {
          props: {
            // className: 'text-center',
            value: state_incomeBillSerial.vendorName,
            disabled: true,
          },
        },
      };

      return inputSelProps;
    },
  },

  // 看錯需求，這是不需要的，待PR之前再把這個註解刪掉
  // temporary_separatePayment: {
  //   label: '分出金額',
  //   style: { width: 100 },
  //   className: 'text-right',
  //   createInputSelProps: ({ disabled, state_incomeBillSerial, setState_incomeBillSerial }) => {
  //     const inputSelProps: TinputSelProps = {
  //       disabled: true,
  //       inputProps: {
  //         props: {
  //           className: 'text-right',
  //           defaultValue: state_incomeBillSerial.temporary_separatePayment,
  //         },
  //       },
  //     };

  //     return inputSelProps;
  //   },
  // },

  //
} as const;

type Tconfig_table_item = {
  label: string;
  style?: React.CSSProperties;
  className?: string;
};

type Tconfig_table = {
  [key: string]: Tconfig_table_item;
};

const config_table: Tconfig_table = {
  caption: {
    label: '',
    style: {
      width: 150,
      // flex: '1',
    },
  },
  foreign: {
    label: '外銷',
    style: { width: 120 },
  },
  domestic: {
    label: '國內',
    style: { width: 120 },
  },
  total: {
    label: '合計',
    style: { width: 120 },
  },
};

{
  /* <span className="text-9xl">&#11137;</span> */
}
