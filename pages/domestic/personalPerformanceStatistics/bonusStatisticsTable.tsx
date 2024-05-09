import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Decimal from 'decimal.js';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gaer
import SelectBar, { TselectProps } from 'components/global/gear/select/selectBar/selectBar';
import myAlert, { TbtnPropsArr } from 'components/global/gear/modal/simpleModal/alertModals';
import ProcessChain, { Tcontrol_processChain } from 'components/global/gear/processChain';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// option
import { optionsCreator_month, optionsCreator_year } from 'js/utils/options/options';

// css
import scss from './bonusStatisticsTable.module.scss';

import { TbonusDto, useGetQuotationAccounting_bonus } from 'js/api/api_quotation';
import { TemployeeDto } from 'js/api/dtoTypes';

// ========================================================================

type Tquery = {
  year: string | undefined;
  month: string | undefined;
};

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

// ========================================================================

const yearOptionArr = optionsCreator_year();
const monthOptionArr = optionsCreator_month({ emptyOption: true });

// ========================================================================

export default function BonusStatisticsTable() {
  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    year = String(new Date().getFullYear() - 1911),
    month,
  } = query;

  // --------------------------------------------------------------------

  const params = {
    year: Number(year) + 1911,
    month: month ? Number(month) : undefined,
  };

  const {
    data: data_bonus = fakeDataArr_bonus,
    // update: update_bonus,
    isFetching,
  } = useGetQuotationAccounting_bonus(params, { isAutoUpdate: false });

  // --------------------------------------------------------------------
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
      onClick: () => {},
      isActive: true,
    },
  ];

  // --------------------------------------------------------------------

  // --------------------------------------------------------------------
  return (
    <SubLayer isLoading_subLayer={isFetching}>
      <PageHeader02 tagList={tagList} />
      <div className="ml-5 mb-5">
        <div className={scss.selectBarWrapper}>
          <SelectBar selectPropsArr={selectPropsArr} />
        </div>
        <div className={classNames(scss.table)}>
          <Thead />
          <div className={classNames(scss.tbody)}>
            {data_bonus.map((bonus, index) => {
              return <Row key={bonus.id || index} data_bonus={fakeData_bonus} />;
            })}
          </div>
        </div>
      </div>
    </SubLayer>
  );
}

// ====================================================================

//  ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████
// ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██
// ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██
// ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██
//  ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██

const Thead = () => {
  return (
    <div className={classNames(scss.thead)}>
      <div className={scss.cell}>員工姓名</div>
      <div className={scss.cell}>當月業績</div>
      <div className={scss.cell}>當月獎金</div>
      <div className={scss.cell}>備註</div>
    </div>
  );
};

const Row = ({ data_bonus }: { data_bonus: TbonusDto }) => {
  //
  const {
    // bonusYear,
    // bonusMonth,
    totalSales,
    totalBonus,
    note,

    // salesEmployeeId,
    salesEmployee,

    // reviewTeamLeaderEmployeeId,
    reviewTeamLeaderEmployee,
    toReviewTeamLeader,
    teamLeaderReviewAt,

    // reviewSupervisorEmployeeId,
    reviewSupervisorEmployee,
    toReviewSupervisor,
    supervisorReviewAt,

    // reviewManagerEmployeeId,
    reviewManagerEmployee,
    toReviewManager,
    managerReviewAt,
  } = data_bonus;

  const statusArr: Tcontrol_processChain['statusArr'] = (() => {
    const statusArr: Tcontrol_processChain['statusArr'] = [
      // {
      //   label: `業務 ${salesEmployee?.chName ?? ''}`,
      //   dotColor: 'green',
      // },
      {
        label: `課長 ${reviewTeamLeaderEmployee?.chName ?? ''}`,
        dotColor: checkReview(toReviewTeamLeader, teamLeaderReviewAt),
      },
      {
        label: `審核主管 ${reviewSupervisorEmployee?.chName ?? ''}`,
        dotColor: checkReview(toReviewSupervisor, supervisorReviewAt),
      },
      {
        label: `總經理 ${reviewManagerEmployee?.chName ?? ''}`,
        dotColor: checkReview(toReviewManager, managerReviewAt),
      },
    ];

    return statusArr;
  })(); // statusArr

  return (
    <div className={scss.row}>
      <div className={scss.cell}>{salesEmployee.chName}</div>
      <div className={scss.cell}>{totalSales.toLocaleString()}</div>
      <div className={scss.cell}>{totalBonus.toLocaleString()}</div>
      <div className={scss.cell}>{note}</div>
      {/*  */}
      <div className={classNames(scss.cell, scss.cell_processChain, 'col-span-4')}>
        <ProcessChain className={scss.processChain} control={{ statusArr }} />
        <MyButton_v2
          py="py4"
          px="px22"
          onClick={() => {
            const modal = myAlert.btnBar({
              title: '是否通過審核?',
              btnPropsArr: [
                {
                  label: '通過審核',
                  theme: 'danger',
                  onClick: () => {},
                },
                {
                  label: '不通過審核',
                  onClick: () => {},
                },
                {
                  label: '取消',
                  onClick: () => {
                    modal.destroy();
                  },
                },
              ],
            });
          }}
        >
          審核
        </MyButton_v2>
        {/* cell_processChain close*/}
      </div>
      {/*  */}
    </div>
  );
};

// ====================================================================

const checkReview = (to: string | null, at: string | null) => {
  if (at) {
    return 'green';
  } else if (to) {
    return 'red';
  } else {
    return 'gray';
  }
};

// ====================================================================

// ███████  █████  ██   ██ ███████     ██████   █████  ████████  █████
// ██      ██   ██ ██  ██  ██          ██   ██ ██   ██    ██    ██   ██
// █████   ███████ █████   █████       ██   ██ ███████    ██    ███████
// ██      ██   ██ ██  ██  ██          ██   ██ ██   ██    ██    ██   ██
// ██      ██   ██ ██   ██ ███████     ██████  ██   ██    ██    ██   ██

const fakeData_bonus: TbonusDto = {
  id: '',
  createdAt: '2011-01-01',
  updatedAt: '2011-01-01',

  // 獎金年份
  bonusYear: '1911',
  // 獎金月份
  bonusMonth: '2',
  // 業績總額
  totalSales: 99999,
  // 獎金總額
  totalBonus: 99999,
  // 備註
  note: '喵喵喵喵喵 喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵',
  // 業務id
  salesEmployeeId: null,
  // 業務
  salesEmployee: { id: 'dsfasfasdf', chName: 'aaaaa' } as TemployeeDto,
  // 課長Id
  reviewTeamLeaderEmployeeId: 'dfsdfsdfsdf',
  // 審核課長
  reviewTeamLeaderEmployee: { id: 'dsfasfasdf', chName: 'bbbbb' } as TemployeeDto,
  // 送審給課長審核時間
  toReviewTeamLeader: '2011-01-01',
  // 課長審核時間
  teamLeaderReviewAt: '2011-01-01',
  // 審核主管Id
  reviewSupervisorEmployeeId: 'fsdfsdfsdf',
  // 審核主管
  reviewSupervisorEmployee: { id: 'dsfasfasdf', chName: 'cccccc' } as TemployeeDto,
  // 送審給主管審核時間
  toReviewSupervisor: '2011-01-01',
  // 主管審核時間
  supervisorReviewAt: null,
  // 審核總經理Id
  reviewManagerEmployeeId: 'fdsdsfasdsfsdfsdfsdf',
  // 審核總經理
  reviewManagerEmployee: { id: 'dsfasfasdf', chName: 'ddddd' } as TemployeeDto,
  // 送審給總經理審核時間
  toReviewManager: null,
  // 總經理審核時間
  managerReviewAt: null,
};

const fakeDataArr_bonus = [
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
  fakeData_bonus,
];
