import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import IncomeBillSerialSettlementForm from 'components/page/worksDepartment/incomeSummons/incomeBillSerialSettlementForm';
import OtherInfo from 'components/page/worksDepartment/incomeSummons/otherInfo';
import Summons, {
  SummonsRow,
  keyArr,
  cellPropsList_summon,
  Tstate_incomeBillSerial,
} from 'components/page/worksDepartment/incomeSummons/summon';

// gear
import SelectBar from 'components/global/gear/select/selectBar/selectBar';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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
} from 'js/api/api_engineering';

// ==============================================================================

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type Tquery = {
  isForeign: 'true' | 'false';
  year: string;
  month: string;
};

// type Tstate_incomeBillSerial = {
//   id: string;
//   billSerialNumber: string;
//   receiveDate: Moment | null;
//   contractNumber: string;
//   projectName: string;
//   contractPayment: string;
//   periodPayment: string;
//   priorPeriodPayment: string;
//   importAccountingNumber: string;
//   noteNumber: string;
//   noteMaturityDate: Moment | null;
//   receivablePayment: string;
//   deductionPayment: string;
//   unpaidPayment: string;
//   difference: string;
//   //
//   readonly fee: number; // 現在是從accountant裡面拿
//   //
//   note: string;
//   vendorName: string;

//   //
//   readonly accountsReceivableDeduction: TincomeBillSerialDto['accountsReceivableDeduction'];
// };

type TreqPatch = (incomeBillSerialId: string, state_incomeBillSerial: Tstate_incomeBillSerial) => Promise<void>;

export type { TreqPatch };

// ==============================================================================

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

  const month_whole = month.padStart(2, '0');
  const isoDate = moment(`${year}-${month_whole}`).toISOString();

  // -----------------------------------------------------------------------------

  const [showTable, setShowTable] = useState(false);
  // const { activePanelKeyArr, changeActive } = useActiveKey(); // 棄用

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
          $gte: moment(`${year}-${month_whole}`).startOf('month').toISOString(),
          $lte: moment(`${year}-${month_whole}`).endOf('month').toISOString(),
        },
      },
    };
  }, [isForeign, month_whole, year]);

  const {
    data: data_incomeBill = [],
    update: update_incomeBill,
    isFetching,
  } = useGetAccountReceivableIncomeBills({
    params,
  });

  const totals = useMemo(() => {
    let total_receivablePayment = new Decimal(0);

    data_incomeBill.forEach((data) => {
      const receivablePayment = new Decimal(data.receivablePayment || 0);
      total_receivablePayment = total_receivablePayment.add(receivablePayment);
    });

    return {
      receivablePayment: total_receivablePayment.toNumber(),
    };
  }, [data_incomeBill]);

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
      state_deduction,
      fee,
    } = state_incomeBillSerial;

    const incomeBillDeduction = state_deduction.map((item) => {
      return {
        ...item,
        detailedAmount: Number(item.detailedAmount || 0),
      };
    });

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
      incomeBillDeduction: incomeBillDeduction,
    };

    await apiPatchIncomeBill(incomeBillSerialId, body).then(update_incomeBill);
  };

  const reqApiPostIncomeBillSerialSettlementForm = async () => {
    return await apiPostIncomeBillSerialSettlementForm({
      temp_date: isoDate,
    });
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
              <div
                style={cellPropsList_summon.btnPanel.style}
                className={cellPropsList_summon.btnPanel.className}
              ></div>
              {keyArr.map((key) => {
                const { label, style, className } = cellPropsList_summon[key];

                return (
                  <div key={key} style={style} className={className}>
                    {label}
                  </div>
                );
              })}
            </SummonsRow>

            {data_incomeBill.map((data, index) => {
              return (
                <Summons
                  key={data.id}
                  incomeBillSerial={data}
                  reqPatch={reqPatch}
                  update_incomeBill={update_incomeBill}
                  // changeActive={() => changeActive(data.id)}
                  changeActive={() => {}} // 棄用 待串接上審核api時再拿掉
                />
              );
            })}

            {/* <Collapse activeKey={activePanelKeyArr} noTlrBorder={true}>
              {data_incomeBill.map((data, index) => {
                return (
                  <Panel
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
            </Collapse> */}
          </div>
        </div>
        {/*  */}

        <div className={scss.totalBar}>
          <SummonsRow className={scss.thead}>
            <div style={cellPropsList_summon.btnPanel.style} className={cellPropsList_summon.btnPanel.className}></div>
            {keyArr.map((key) => {
              const { label, style, className } = cellPropsList_summon[key];

              let node: React.ReactNode = null;

              if (key === 'receivablePayment') {
                node = <div className={scss.total_receivablePayment}>{totals.receivablePayment.toLocaleString()}</div>;
              }

              return (
                <div key={key} style={style} className={className}>
                  {node}
                </div>
              );
            })}
          </SummonsRow>
        </div>
      </div>
      {/*  */}
      <IncomeBillSerialSettlementForm
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
