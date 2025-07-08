import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import classNames from 'classnames';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import IncomeBillSerialSettlementForm from 'components/page/worksDepartment/incomeSummons/incomeBillSerialSettlementForm';

import Summons, {
  SummonsRow,
  getKeyArr,
  cellPropsList_summon,
  Tstate_incomeBillSerial,
} from 'components/page/worksDepartment/incomeSummons/summon';

// gear
import SelectBar from 'components/global/gear/select/selectBar/selectBar';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// css
import scss from './index.module.scss';

// type
import type { Tparams } from 'js/api/dtoTypes';

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
  isForeign?: 'true' | 'false';
  year?: string;
  month?: string;
  id?: string;
};

type TreqPatch = (incomeBillSerialId: string, state_incomeBillSerial: Tstate_incomeBillSerial) => Promise<void>;

export type { TreqPatch };

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
    id,
  } = query;

  const month_whole = month.padStart(2, '0');
  const yearMonth_m = dayjs(`${year}-${month_whole}`);

  // -----------------------------------------------------------------------------

  const [showTable, setShowTable] = useState(false);

  // -----------------------------------------------------------------------------

  const params: Tparams = useMemo(() => {
    return {
      sort: 'billSerialNumber',
      pageSize: 999999,
      populate: [
        'accountant',
        'accountsReceivableDeduction',
        // 'vendorCustomer'
      ],
      filter: {
        isForeign: {
          $eq: isForeign === 'true',
        },
        incomeBillDate: {
          $gte: dayjs(`${year}-${month_whole}`).startOf('month').toISOString(),
          $lte: dayjs(`${year}-${month_whole}`).endOf('month').toISOString(),
        },
      },
    };
  }, [isForeign, month_whole, year]);

  const {
    data: data_incomeBill,
    update: update_incomeBill,
    isFetching,
  } = useGetAccountReceivableIncomeBills({
    params,
  });

  const totals = useMemo(() => {
    let total_receivablePayment = new Decimal(0);

    data_incomeBill?.forEach((data) => {
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
      //
      isCashierSeen,
      isWorkSupervisorSeen,
      isManagerSeen,
      //
      //
      declarationCurrency,
      declarationExchangeRate,
      declarationPayment,
      declarationCurrencyPayment,
      receivableCurrency,
      receivableExchangeRate,
      receivableCurrencyPayment,
      foreignFee,
      foreignCurrencyFee,
      exchangeBenefits,
      vendorName,
      vendorCustomerId,
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
      isCashierSeen,
      isWorkSupervisorSeen,
      isManagerSeen,
      //
      declarationCurrency,
      declarationExchangeRate,
      declarationPayment,
      declarationCurrencyPayment,
      receivableCurrency,
      receivableExchangeRate,
      receivableCurrencyPayment,
      foreignFee: foreignFee,
      foreignCurrencyFee,
      exchangeBenefits,
      //
      vendorName,
      vendorCustomerId,
    };

    await apiPatchIncomeBill(incomeBillSerialId, body).then(update_incomeBill);
  };

  const reqApiPostIncomeBillSerialSettlementForm = async () => {
    return await apiPostIncomeBillSerialSettlementForm({
      settlementDate: yearMonth_m.format('YYYY-MM-DD'),
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

  const keyArr = getKeyArr({ isForeign: isForeign === 'true' });

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

  useEffect(() => {
    if (data_incomeBill) {
      const target = id && document.getElementById(id);

      if (target) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              // 目標沒有被看見就滾動到目標
              if (!entry.isIntersecting) {
                target.scrollIntoView();
              }

              observer.disconnect();
            });
          },
          { threshold: 0.2 } // 目標元素至少有 10% 可見時觸發回調
        );

        // 開始觀察目標元素
        observer.observe(target);

        const targetClassName = target.className;
        target.className = classNames(targetClassName, scss.targetFlash);
        setTimeout(() => {
          target.className = targetClassName;
        }, 2000);
      }

      const { id: removed, ...remainQuery } = query;

      router.replace({
        query: { ...remainQuery },
      });
    }
  }, [data_incomeBill]);

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
              <div style={cellPropsList_summon.btnPanel.style} className={cellPropsList_summon.btnPanel.className} />
              {keyArr.map((key) => {
                const { label, style, className } = cellPropsList_summon[key];

                return (
                  <div key={key} style={style} className={className}>
                    {label}
                  </div>
                );
              })}
            </SummonsRow>

            {data_incomeBill?.map((data, index) => {
              return (
                <Summons
                  id={data.id}
                  key={data.id}
                  incomeBillSerial={data}
                  reqPatch={reqPatch}
                  update_incomeBill={update_incomeBill}
                  // changeActive={() => changeActive(data.id)}
                  changeActive={() => {}} // 棄用 待串接上審核api時再拿掉
                  isForeign={isForeign === 'true'}
                />
              );
            })}
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
  const m_today = dayjs();
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
