import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// antd
import { Popover } from 'antd';

// gaer
import SelectBar from 'components/global/gear/select/selectBar/selectBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// option
import { optionsCreator_year } from 'js/utils/options/options';

// icon
import { IconEdit, IconCheck02, IconAddCircle, IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './bonusPeriod.module.scss';

// api
import {
  Tparams,
  TsettlementCycleDto,
  TcreateSettlementCycleDto,
  TsettleBonusDto,
  TupdateSettlementCycleDto,
  useGetReportForm_settlementCycle,
  apiPostReportForm_settlementCycle,
  apiPatchReportForm_settlementCycle,
  apiDeleteReportForm_settlementCycle,
  apiPostReportForm_bonus,
} from 'js/api/api_reportForm';

// ========================================================================

type Tquery = {
  year: string | undefined;
};

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type TstatePeriod = {
  startDate: Dayjs | null;
  dueDate: Dayjs | null;
};

// ========================================================================

const yearOptionArr = optionsCreator_year();

// ========================================================================
export default function BonusPeriod() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { year: twYear = String(new Date().getFullYear() - 1911) } = query;
  const year = Number(twYear) + 1911;
  const thisYear = dayjs().year();

  let isNewestPeriod1231 = false;
  let isAllowPost = false;

  // ------------------------------------------------------------------------

  const params: Tparams = useMemo(() => {
    return {
      pageSize: 99999,
      sort: 'startDate',
      order: 'DESC',
      filter: {
        startDate: {
          $gte: dayjs().year(year).startOf('year').toISOString(),
          $lte: dayjs().year(year).endOf('year').toISOString(),
        },
      },
    };
  }, [year]);

  const { data: periodArr, update: update_cycle } = useGetReportForm_settlementCycle(params);

  const newestPeriodDueDate_m = periodArr?.[0]?.dueDate ? dayjs(periodArr[0].dueDate) : null;

  isNewestPeriod1231 = newestPeriodDueDate_m?.month() === 11 && newestPeriodDueDate_m?.date() === 31;
  isAllowPost = year === thisYear && !isNewestPeriod1231;

  // ------------------------------------------------------------------------
  // region request

  const reqPostSettlementCycle = async () => {
    if (!isAllowPost) {
      return myAlert.info({ title: '請先將年分設為今年' });
    }

    if (isNewestPeriod1231) {
      return myAlert.info({ title: '最新週期已是12/31，本年不可以再新增週期' });
    }

    const latesPeriod = periodArr?.[0];
    // const nextStartDate_m = latesPeriod?.dueDate ? moment(latesPeriod.dueDate).add(1, 'day') : null;
    const nextStartDate_m = latesPeriod?.dueDate ? dayjs(latesPeriod.dueDate).add(1, 'day').startOf('day') : null;

    let nextStartDate = nextStartDate_m && nextStartDate_m.toISOString();
    !nextStartDate && (nextStartDate = dayjs().startOf('year').toISOString());

    const newDueDate = dayjs(nextStartDate).endOf('month').toISOString();

    // 後端取得年月的時候沒有把時區的因素算進去，因此後端取得dueDate的"日"時會少一天
    // 改送YYYY/MM/DD給後端，方便後端取得正確的台灣時區年月
    const nextStartDateYYMMDD = dayjs(nextStartDate).format('YYYY/MM/DD');
    const newDueDateYYMMDD = dayjs(newDueDate).format('YYYY/MM/DD');

    const body: TcreateSettlementCycleDto = {
      startDate: nextStartDateYYMMDD,
      dueDate: newDueDateYYMMDD,
    };

    await apiPostReportForm_settlementCycle(body).then(update_cycle);
  };

  const reqPatchSettlementCycle = async (body: TupdateSettlementCycleDto) => {
    await apiPatchReportForm_settlementCycle(body).then(update_cycle);
  };

  const reqDeleteSettlementCycle = async (id: string) => {
    await apiDeleteReportForm_settlementCycle(id).then(update_cycle);
  };

  // 結算獎金
  const reqPostReportFormBonus = async (body: TsettleBonusDto) => {
    await apiPostReportForm_bonus(body).then(() => {
      myAlert.success({ title: '獎金統計表已產生' });
      update_cycle();
    });
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
              year={year}
              reqPostReportFormBonus={reqPostReportFormBonus}
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
      <div className={scss.cell}>週期</div>
      <div className={scss.cell}>
        <Popover content={!isAllowPost ? '請先將年份設為今年或確認週期是否已至12-31' : undefined}>
          <IconAddCircle
            className={classNames(scss.btnAdd, !isAllowPost && scss.disabled)}
            onClick={isAllowPost ? reqPostSettlementCycle : undefined}
          />
        </Popover>
      </div>
      <div className={scss.cell}></div>
    </div>
  );
};

const Row = ({
  data_period,
  isAllowEdit,
  reqPatchSettlementCycle,
  reqDeleteSettlementCycle,
  reqPostReportFormBonus,
  year,
}: {
  data_period: TsettlementCycleDto;
  isAllowEdit: boolean;
  reqPatchSettlementCycle: (body: TupdateSettlementCycleDto) => Promise<void>;
  reqDeleteSettlementCycle: (id: string) => Promise<void>;
  reqPostReportFormBonus: (body: TsettleBonusDto) => Promise<void>;
  year: number;
}) => {
  //

  const [disabled, setDisabled] = useState(true);
  const [state_period, setState_period] = useState<TstatePeriod>({ startDate: null, dueDate: null });

  const now = dayjs();
  const dueDate_m = dayjs(data_period.dueDate).endOf('day');
  let periodStatus: '可結算' | '已結算' | '結算週期未結束' = '可結算';

  if (data_period.status !== 'set') {
    periodStatus = '已結算';
  } else if (!now.isAfter(dueDate_m)) {
    periodStatus = '結算週期未結束';
  }

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
      // startDate: startDate.toISOString(),
      // dueDate: dueDate.toISOString(),
      startDate: startDate.format('YYYY/MM/DD'),
      dueDate: dueDate.format('YYYY/MM/DD'),
      id: data_period.id,
    };

    await reqPatchSettlementCycle(body).then(() => setDisabled(true));
  };

  const onDelete = async () => {
    if (!isAllowEdit) {
      return myAlert.info({ title: '不可刪除', content: '非最新週期或已產生獎金統計表' });
    }

    await reqDeleteSettlementCycle(data_period.id);
  };

  const onSettle = async () => {
    if (periodStatus === '已結算') {
      return myAlert.info({ title: '結算失敗', content: '對應的獎金統計表已結算' });
    }

    if (periodStatus === '結算週期未結束') {
      return myAlert.info({ title: '結算失敗', content: '結算週期未結束' });
    }

    const body: TsettleBonusDto = {
      settlementCycleId: data_period.id,
    };

    await reqPostReportFormBonus(body);
  };

  // ---------------------------------------------------------------------

  useEffect(() => {
    if (disabled) {
      setState_period({
        startDate: data_period.startDate ? dayjs(data_period.startDate) : null,
        dueDate: data_period.dueDate ? dayjs(data_period.dueDate) : null,
      });
    }
  }, [data_period, disabled]);

  return (
    <div className={scss.row}>
      <div className={scss.cell}>
        <InputSel
          disabled={true}
          showBaseline="auto"
          wrapperStyle={{ width: 110 }}
          datePickerProps={{
            props: {
              value: state_period.startDate,
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
              disabledDate(date) {
                return date.year() !== year || date.isBefore(state_period.startDate);
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
      <div className={scss.cell}>
        {periodStatus === '可結算' && <MyButton_v2 onClick={onSettle}>結算獎金</MyButton_v2>}
        {periodStatus === '已結算' && <span>已結算</span>}
      </div>
    </div>
  );
};
// ======================================================================
