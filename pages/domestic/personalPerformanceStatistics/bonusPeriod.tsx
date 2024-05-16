import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import moment, { Moment } from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

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

// ========================================================================

type Tquery = {
  year: string | undefined;
};

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type Tperiod = {
  id: string;
  startAt: string;
  endAt: string;
  periodNumber: string;
};

type TstatePeriod = {
  startAt: Moment | null;
  endAt: Moment | null;
};

// ========================================================================

const yearOptionArr = optionsCreator_year();

// ========================================================================
export default function BonusPeriod() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { year = String(new Date().getFullYear() - 1911) } = query;

  // ------------------------------------------------------------------------

  const selectPropsArr: TselectPropsArr = [
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

  return (
    <SubLayer>
      <PageHeader02 tagList={tagList} />

      <div className="ml-5 mb-5">
        <div className={scss.selectBarWrapper}>
          <SelectBar selectPropsArr={selectPropsArr} />
        </div>
        <div className={classNames(scss.table)}>
          <Thead />

          {fakeDataArr.map((data, index) => (
            <Row key={index} data_period={data} isNewest={index === 0} />
          ))}
        </div>
      </div>
    </SubLayer>
  );
}

// ========================================================================
// region component

const Thead = () => {
  return (
    <div className={classNames(scss.thead)}>
      <div className={scss.cell}>週期編號</div>
      <div className={scss.cell}>週期</div>
      <div className={scss.cell}>
        <IconAddCircle className={scss.btnAdd} />
      </div>
    </div>
  );
};

const Row = ({ data_period, isNewest }: { data_period: Tperiod; isNewest?: boolean }) => {
  //

  const [disabled, setDisabled] = useState(true);

  const [period, setPeriod] = useState<Tperiod>();
  const [state_period, setState_period] = useState<TstatePeriod>({ startAt: null, endAt: null });

  useEffect(() => {
    setPeriod(data_period);
  }, [data_period]);

  useEffect(() => {
    if (period) {
      setState_period({
        startAt: period.startAt ? moment(period.startAt) : null,
        endAt: period.endAt ? moment(period.endAt) : null,
      });
    }
  }, [period?.endAt, period?.startAt, setPeriod, disabled, period]);

  return (
    <div className={scss.row}>
      <div className={scss.cell}>{period?.periodNumber}</div>
      <div className={scss.cell}>
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          wrapperStyle={{ width: 110 }}
          datePickerProps={{
            props: {
              value: state_period.startAt,
              onChange(value) {
                setState_period((prev) => {
                  return {
                    ...prev,
                    startAt: value,
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
          wrapperStyle={{ width: 110 }}
          datePickerProps={{
            props: {
              value: state_period.endAt,
              onChange(value, dateString) {
                setState_period((prev) => {
                  return {
                    ...prev,
                    endAt: value,
                  };
                });
              },
            },
          }}
        />
      </div>
      <div className={classNames(scss.cell, !isNewest && 'invisible')}>
        <IconEdit
          className={classNames(!disabled && scss.activeEdit, scss.plus)}
          onClick={() => setDisabled((prev) => !prev)}
        />
        {disabled && (
          <>
            <IconDelete01 />
          </>
        )}
        {!disabled && (
          <>
            <IconCheck02 />
          </>
        )}
      </div>
    </div>
  );
};
// ======================================================================

// region fake data

const fakeDataArr: Tperiod[] = [
  {
    id: '1',
    startAt: '2021-01-01',
    endAt: '2021-01-31',
    periodNumber: '20210101',
  },
  {
    id: '2',
    startAt: '2021-05-05',
    endAt: '2021-05-31',
    periodNumber: '20210501',
  },
  {
    id: '3',
    startAt: '2022-02-02',
    endAt: '2022-02-28',
    periodNumber: '20220201',
  },
];
