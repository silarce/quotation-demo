import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// antd
// import { Popover } from 'antd';
import { Popover } from 'antd';

// gaer
import SelectBar, { TselectProps } from 'components/global/gear/select/selectBar/selectBar';
import myAlert, { TbtnPropsArr } from 'components/global/gear/modal/simpleModal/alertModals';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// option
import { optionsCreator_month, optionsCreator_year } from 'js/utils/options/options';

// icon
import { IconEdit, IconCheck02, IconAddCircle, IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './bonusPeriod.module.scss';

// api
import {
  Tparams,
  TsettlementCycleDto,
  TcreateSettlementCycleDto,
  useGetReportForm_settlementCycle,
  apiPostReportForm_settlementCycle,
  apiPatchReportForm_settlementCycle,
  apiDeleteReportForm_settlementCycle,
} from 'js/api/api_reportForm';

// ========================================================================

type Tquery = {
  year: string | undefined;
};

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type TstatePeriod = {
  startDate: Moment | null;
  dueDate: Moment | null;
};

// ========================================================================

const yearOptionArr = optionsCreator_year();

// ========================================================================
export default function BonusPeriod() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { year: twYear = String(new Date().getFullYear() - 1911) } = query;
  const year = Number(twYear) + 1911;
  const thisYear = moment().year();

  const isAllowPost = year === thisYear;

  // ------------------------------------------------------------------------

  const params: Tparams = useMemo(() => {
    return {
      pageSize: 99999,
      sort: 'startDate',
      order: 'DESC',
      filter: {
        startDate: {
          $gte: moment().year(year).startOf('year').toISOString(),
        },
      },
    };
  }, [year]);

  const { data: periodArr, update: update_cycle } = useGetReportForm_settlementCycle(params);

  // ------------------------------------------------------------------------
  // region request

  const reqPostSettlementCycle = async () => {
    if (!isAllowPost) {
      return myAlert.info({ title: '請先將年分設為今年' });
    }

    let nextStartDate = periodArr?.[0] && moment(periodArr[0].dueDate).add(1, 'day').toISOString();
    !nextStartDate && (nextStartDate = moment().startOf('year').toISOString());
    const dueDate = moment(nextStartDate).endOf('month').toISOString();

    const body: TcreateSettlementCycleDto = {
      startDate: nextStartDate,
      dueDate,
    };

    await apiPostReportForm_settlementCycle(body).then(update_cycle);
  };

  const reqPatchSettlementCycle = async (id: string, body: TcreateSettlementCycleDto) => {
    await apiPatchReportForm_settlementCycle(id, body).then(update_cycle);
  };

  const reqDeleteSettlementCycle = async (id: string) => {
    await apiDeleteReportForm_settlementCycle(id).then(update_cycle);
  };

  // ------------------------------------------------------------------------

  const selectPropsArr: TselectPropsArr = [
    {
      selectProps: {
        value: twYear,
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
  ];

  const tagList: TtagList = [
    {
      label: '個人業績統計表',
      onClick: () => {
        router.replace('/domestic/personalPerformanceStatistics');
      },
    },
    {
      label: '獎金統計表',
      onClick: () => {
        router.replace('/domestic/personalPerformanceStatistics/bonusStatisticsTable');
      },
    },
    {
      label: '獎金週期維護',
      onClick: () => {},
      isActive: true,
    },
  ];

  // ==========================================================================
  // region render
  return (
    <SubLayer>
      <PageHeader02 tagList={tagList} />

      <div className="ml-5 mb-5">
        <div className={scss.selectBarWrapper}>
          <SelectBar selectPropsArr={selectPropsArr} />
        </div>
        <div className={classNames(scss.table)}>
          <Thead reqPostSettlementCycle={reqPostSettlementCycle} isAllowPost={isAllowPost} />

          {periodArr?.map((data, index) => (
            <Row
              key={index}
              data_period={data}
              isAllowEdit={index === 0 && data.status === 'set'}
              reqPatchSettlementCycle={reqPatchSettlementCycle}
              reqDeleteSettlementCycle={reqDeleteSettlementCycle}
            />
          ))}
        </div>
      </div>
    </SubLayer>
  );
}

// ========================================================================
// region component

const Thead = ({
  isAllowPost,
  reqPostSettlementCycle,
}: {
  isAllowPost: boolean;
  reqPostSettlementCycle: () => void;
}) => {
  return (
    <div className={classNames(scss.thead)}>
      {/* <div className={scss.cell}>週期編號</div> */}
      <div className={scss.cell}>週期</div>
      <div className={scss.cell}>
        <Popover content={!isAllowPost ? '請先將年份設為今年' : undefined}>
          <IconAddCircle
            className={classNames(scss.btnAdd, !isAllowPost && scss.disabled)}
            onClick={isAllowPost ? reqPostSettlementCycle : undefined}
          />
        </Popover>
      </div>
    </div>
  );
};

const Row = ({
  data_period,
  isAllowEdit,
  reqPatchSettlementCycle,
  reqDeleteSettlementCycle,
}: {
  data_period: TsettlementCycleDto;
  isAllowEdit: boolean;
  reqPatchSettlementCycle: (id: string, body: TcreateSettlementCycleDto) => Promise<void>;
  reqDeleteSettlementCycle: (id: string) => Promise<void>;
}) => {
  //

  const [disabled, setDisabled] = useState(true);
  const [state_period, setState_period] = useState<TstatePeriod>({ startDate: null, dueDate: null });

  // ---------------------------------------------------------------------
  const onConfirm = async () => {
    if (!isAllowEdit) {
      return myAlert.info({ title: '不可編輯', content: '非最新週期或已產生獎金統計表' });
    }

    const { startDate, dueDate } = state_period;

    if (!startDate || !dueDate) {
      return myAlert.info({ title: '請選擇日期' });
    }

    const body = {
      startDate: startDate.toISOString(),
      dueDate: dueDate.toISOString(),
    };

    await reqPatchSettlementCycle(data_period.id, body).then(() => setDisabled(false));
  };

  const onDelete = async () => {
    if (!isAllowEdit) {
      return myAlert.info({ title: '不可刪除', content: '非最新週期或已產生獎金統計表' });
    }

    await reqDeleteSettlementCycle(data_period.id);
  };

  // ---------------------------------------------------------------------

  useEffect(() => {
    if (disabled) {
      setState_period({
        startDate: data_period.startDate ? moment(data_period.startDate) : null,
        dueDate: data_period.dueDate ? moment(data_period.dueDate) : null,
      });
    }
  }, [data_period, disabled]);

  return (
    <div className={scss.row}>
      {/* <div className={scss.cell}>{data_period?.periodNumber}</div> */}
      <div className={scss.cell}>
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          wrapperStyle={{ width: 110 }}
          datePickerProps={{
            props: {
              value: state_period.startDate,
              onChange(value) {
                setState_period((prev) => {
                  return {
                    ...prev,
                    startDate: value,
                  };
                });
              },
            },
          }}
        />
        ～
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          wrapperStyle={{ width: 110, transform: 'translateX(30px)' }}
          datePickerProps={{
            props: {
              value: state_period.dueDate,
              onChange(value) {
                setState_period((prev) => {
                  return {
                    ...prev,
                    dueDate: value,
                  };
                });
              },
            },
          }}
        />
      </div>
      <div className={classNames(scss.cell, !isAllowEdit && 'invisible')}>
        <IconEdit
          className={classNames(!disabled && scss.activeEdit, scss.plus)}
          onClick={() => setDisabled((prev) => !prev)}
        />
        {disabled && (
          <>
            <IconDelete01 onClick={onDelete} />
          </>
        )}
        {!disabled && (
          <>
            <IconCheck02 onClick={onConfirm} />
          </>
        )}
      </div>
    </div>
  );
};
// ======================================================================
