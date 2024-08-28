import { useState, useMemo, useEffect } from 'react';
import moment from 'moment';
import Decimal from 'decimal.js';
import _ from 'lodash';
import classNames from 'classnames';

// gear
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import Row, { Cell } from 'components/global/gear/table/row';
import SignatureBar, { TsignatureBarItem } from 'components/global/gear/signatureBar_v2';

import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { apiPatchIncomeBillSerialSettlementForm, useGetIncomeBillSerialSettlementForm } from 'js/api/api_engineering';

// css
import scss from './incomeBillSerialSettlementForm.module.scss';

// ============================================================================

type Tstate = {
  foreign: number;
  domestic: number;
  total: number;
};

type Tconfig_table_item = {
  label: string;
  style?: React.CSSProperties;
  className?: string;
};

type TcellProps_table = {
  [key: string]: Tconfig_table_item;
};

// ============================================================================
const IncomeBillSerialSettlementForm = ({
  //
  showTable,
  date,
  onCrossClick,
}: {
  showTable: boolean;
  date: string;
  onCrossClick: () => void;
}) => {
  const [disabled, setDisabled] = useState(true);

  const [state_nextMonthEstimatePayment, setState_nextMonthEstimatePayment] = useState<Tstate>({
    foreign: 0,
    domestic: 0,
    total: 0,
  });

  const [state_receivablePayment, setState_receivablePayment] = useState<Tstate>({
    foreign: 0,
    domestic: 0,
    total: 0,
  });

  // ------------------------------------------------------------------------
  const { data, update } = useGetIncomeBillSerialSettlementForm(new Date(date), { autoUpdate: false });
  // ------------------------------------------------------------------------

  const title = useMemo(() => {
    if (!data) {
      return '';
    }

    const date_m = moment(data.date);
    const year = date_m.year() - 1911;
    const month = (date_m.month() + 1).toString().padStart(2, '0');

    return `${year}年${month}月收款統計明細表`;
  }, [data]);

  const {
    //
    rowArr,
    defaultState_nextMonthEstimatePayment,
    defaultState_receivablePayment,
  } = useMemo(() => {
    if (!data) {
      return {
        rowArr: [],
        defaultState_nextMonthEstimatePayment: createEmptyState(),
        defaultState_receivablePayment: createEmptyState(),
      };
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

      // 不足預估之收款
      internalUnderestimationPayment,
      // 不足預估之收款(外銷)
      foreignUnderestimationPayment,
    } = data;

    const rowArr = [
      {
        caption: '本月實際收款額',
        foreign: foreignActualReceivablePayment.toLocaleString(),
        domestic: internalActualReceivablePayment.toLocaleString(),
        total: new Decimal(internalActualReceivablePayment)
          .add(foreignActualReceivablePayment)
          .toNumber()
          .toLocaleString(),
      },
      {
        caption: '本月預估收款額',
        foreign: foreignEstimatePayment.toLocaleString(),
        domestic: internalEstimatePayment.toLocaleString(),
        total: new Decimal(internalEstimatePayment).add(foreignEstimatePayment).toNumber().toLocaleString(),
      },
      // {
      //   caption: '應收帳款總額',
      //   domestic: internalReceivablePayment.toLocaleString(),
      //   foreign: foreignReceivablePayment.toLocaleString(),
      //   total: new Decimal(internalReceivablePayment).add(foreignReceivablePayment).toNumber().toLocaleString(),
      // },
      {
        caption: '年度至今累積收款額',
        foreign: foreignAccumulatePayment.toLocaleString(),
        domestic: internalAccumulatePayment.toLocaleString(),
        total: new Decimal(internalAccumulatePayment).add(foreignAccumulatePayment).toNumber().toLocaleString(),
      },
      {
        caption: '不足預估之收款',
        foreign: foreignUnderestimationPayment?.toLocaleString() || '0',
        domestic: internalUnderestimationPayment?.toLocaleString() || '0',
        total: new Decimal(internalUnderestimationPayment || 0)
          .add(foreignUnderestimationPayment || 0)
          .toNumber()
          .toLocaleString(),
      },
      // {
      //   caption: '下月預估收款額',
      //   foreign: foreignNextMonthEstimatePayment.toLocaleString(),
      //   domestic: internalNextMonthEstimatePayment.toLocaleString(),
      //   total: new Decimal(internalNextMonthEstimatePayment)
      //     .add(foreignNextMonthEstimatePayment)
      //     .toNumber()
      //     .toLocaleString(),
      // },
    ];

    const defaultState_nextMonthEstimatePayment = {
      foreign: foreignNextMonthEstimatePayment,
      domestic: internalNextMonthEstimatePayment,
      total: new Decimal(internalNextMonthEstimatePayment).add(foreignNextMonthEstimatePayment).toNumber(),
    };

    const defaultState_receivablePayment = {
      foreign: foreignReceivablePayment,
      domestic: internalReceivablePayment,
      total: new Decimal(internalReceivablePayment).add(foreignReceivablePayment).toNumber(),
    };

    return {
      rowArr,
      defaultState_nextMonthEstimatePayment,
      defaultState_receivablePayment,
    };
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

  // -=---------------------------------------------------------------------

  const reqApiPatchIncomeBillSerialSettlementForm = async () => {
    if (!data?.id) {
      myAlert.err({ title: '錯誤', content: '沒有收款統計明細表' });

      return;
    }

    const body = {
      // 下月預估收款額
      internalNextMonthEstimatePayment: state_nextMonthEstimatePayment.domestic,
      foreignNextMonthEstimatePayment: state_nextMonthEstimatePayment.foreign,
      // 應收帳款總額
      internalReceivablePayment: state_receivablePayment.domestic,
      foreignReceivablePayment: state_receivablePayment.foreign,
    };

    await apiPatchIncomeBillSerialSettlementForm(data.id, body)
      .then(update)
      .then(() => setDisabled(true));
  };

  // -=---------------------------------------------------------------------

  const editNextMonthEstimatePayment = (key: 'foreign' | 'domestic', value: string) => {
    value = value.replace(/,/g, '');
    const value_num = Number(value || '0');

    setState_nextMonthEstimatePayment((prev) => {
      const copy = { ...prev };
      copy[key] = value_num;
      copy.total = new Decimal(copy.foreign).add(copy.domestic).toNumber();

      return copy;
    });
  };

  const editInternalReceivablePayment = (key: 'foreign' | 'domestic', value: string) => {
    value = value.replace(/,/g, '');
    const value_num = Number(value || '0');

    setState_receivablePayment((prev) => {
      const copy = { ...prev };
      copy[key] = value_num;
      copy.total = new Decimal(copy.foreign).add(copy.domestic).toNumber();

      return copy;
    });
  };

  // -=---------------------------------------------------------------------
  useEffect(() => {
    showTable && update();
  }, [showTable, date]);

  useEffect(() => {
    setState_nextMonthEstimatePayment(defaultState_nextMonthEstimatePayment);
  }, [defaultState_nextMonthEstimatePayment, disabled]);

  useEffect(() => {
    setState_receivablePayment(defaultState_receivablePayment);
  }, [defaultState_receivablePayment, disabled]);

  // -=---------------------------------------------------------------------

  return (
    <DragableModal
      handleText="收款統計明細表"
      //
      show={showTable}
      onCrossClick={onCrossClick}
    >
      <div className={scss.nextMonthEstimatePayment_tableContainer}>
        <div className={scss.top}>
          <p className={scss.tableTitle}>{title}</p>
          <div className={classNames(scss.btnBar, !data?.id && 'invisible')}>
            {disabled && (
              <>
                <MyButton_v2 px="px22" py="py4" onClick={() => setDisabled(false)}>
                  編輯
                </MyButton_v2>
              </>
            )}

            {!disabled && (
              <>
                <MyButton_v2 theme={'danger'} px="px22" py="py4" onClick={reqApiPatchIncomeBillSerialSettlementForm}>
                  確認
                </MyButton_v2>

                <MyButton_v2 px="px22" py="py4" onClick={() => setDisabled(true)}>
                  取消
                </MyButton_v2>
              </>
            )}
          </div>
        </div>

        <div>
          <Row thead={true}>
            <Cell style={cellProps_table.caption.style}></Cell>
            <Cell style={cellProps_table.foreign.style}>外銷</Cell>
            <Cell style={cellProps_table.domestic.style}>國內</Cell>
            <Cell style={cellProps_table.total.style}>合計</Cell>
          </Row>
          {rowArr.map((data, index) => {
            const { caption, foreign, domestic, total } = data;

            return (
              <Row key={index}>
                <Cell style={cellProps_table.caption.style}>{caption}</Cell>
                <Cell style={cellProps_table.foreign.style}>{foreign}</Cell>
                <Cell style={cellProps_table.domestic.style}>{domestic}</Cell>
                <Cell style={cellProps_table.total.style}>{total}</Cell>
              </Row>
            );
          })}
          {/*  */}
          <br />
          <Row>
            <Cell style={cellProps_table.caption.style}>{'應收帳款總額'}</Cell>
            <Cell style={cellProps_table.foreign.style}>
              <input
                readOnly={disabled}
                className={classNames(scss.input, disabled && scss.disabled)}
                type={disabled ? 'text' : 'number'}
                value={disabled ? state_receivablePayment.foreign.toLocaleString() : state_receivablePayment.foreign}
                onChange={(e) => editInternalReceivablePayment('foreign', e.target.value)}
              />
            </Cell>
            <Cell style={cellProps_table.domestic.style}>
              <input
                readOnly={disabled}
                className={classNames(scss.input, disabled && scss.disabled)}
                type={disabled ? 'text' : 'number'}
                value={disabled ? state_receivablePayment.domestic.toLocaleString() : state_receivablePayment.domestic}
                onChange={(e) => editInternalReceivablePayment('domestic', e.target.value)}
              />
            </Cell>
            <Cell style={cellProps_table.total.style}>{state_receivablePayment.total}</Cell>
          </Row>
          {/*  */}
          <br />
          <Row>
            <Cell style={cellProps_table.caption.style}>{'下月預估收款額'}</Cell>
            <Cell style={cellProps_table.foreign.style}>
              <input
                readOnly={disabled}
                className={classNames(scss.input, disabled && scss.disabled)}
                type={disabled ? 'text' : 'number'}
                value={
                  disabled
                    ? state_nextMonthEstimatePayment.foreign.toLocaleString()
                    : state_nextMonthEstimatePayment.foreign
                }
                onChange={(e) => editNextMonthEstimatePayment('foreign', e.target.value)}
              />
            </Cell>
            <Cell style={cellProps_table.domestic.style}>
              <input
                readOnly={disabled}
                className={classNames(scss.input, disabled && scss.disabled)}
                type={disabled ? 'text' : 'number'}
                value={
                  disabled
                    ? state_nextMonthEstimatePayment.domestic.toLocaleString()
                    : state_nextMonthEstimatePayment.domestic
                }
                onChange={(e) => editNextMonthEstimatePayment('domestic', e.target.value)}
              />
            </Cell>
            <Cell style={cellProps_table.total.style}>{state_nextMonthEstimatePayment.total}</Cell>
          </Row>
          {/*  */}
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

// ============================================================================

const cellProps_table: TcellProps_table = {
  caption: {
    label: '',
    style: {
      width: 150,
      justifyContent: 'flex-start',
      // flex: '1',
    },
  },
  foreign: {
    label: '外銷',
    style: { width: 120, justifyContent: 'flex-end' },
    className: 'text-right',
  },
  domestic: {
    label: '國內',
    style: { width: 120, justifyContent: 'flex-end' },
    className: 'text-right',
  },
  total: {
    label: '合計',
    style: { width: 120, justifyContent: 'flex-end' },
  },
};

const createEmptyState = (): Tstate => ({
  foreign: 0,
  domestic: 0,
  total: 0,
});

// ===============================================================================
export default IncomeBillSerialSettlementForm;
