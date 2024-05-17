import { useMemo } from 'react';
import { useRouter } from 'next/router';

import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// gaer
import SelectBar from 'components/global/gear/select/selectBar/selectBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import ProcessChain, { Tcontrol_processChain } from 'components/global/gear/processChain';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// option
import { optionsCreator_month, optionsCreator_year } from 'js/utils/options/options';

// css
import scss from './bonusStatisticsTable.module.scss';

import {
  TbonusDto,
  useGetReportForm_bonus,
  apiPatchReportForm_bonus_submit,
  apiPatchReportForm_bonus_review,
} from 'js/api/api_reportForm';

import { TuserDto } from 'js/api/dtoTypes';

// ========================================================================

type Tquery = {
  year: string | undefined;
  month: string | undefined;
};

type TselectPropsArr = Parameters<typeof SelectBar>[0]['selectPropsArr'];

type TreqSubmit = (bonusId: string) => Promise<void>;
type TreqReview = (bonusId: string, isPass: boolean) => Promise<void>;

// ========================================================================

const yearOptionArr = optionsCreator_year();
const monthOptionArr = optionsCreator_month({ emptyOption: true });

// ========================================================================

// region main component
export default function BonusStatisticsTable({ userInfo }: { userInfo: TuserDto }) {
  const router = useRouter();
  const query = router.query as Tquery;
  const {
    //
    year: twYear = String(new Date().getFullYear() - 1911),
    month,
  } = query;
  const year = Number(twYear) + 1911;

  // --------------------------------------------------------------------

  const params = useMemo(() => {
    return {
      populate: ['salesEmployee', 'reviewTeamLeaderEmployee', 'reviewSupervisorEmployee', 'reviewManagerEmployee'],

      pageSize: 99999,
      filter: {
        bonusYear: { $eq: String(year) },
        bonusMonth: { $eq: String(month) },
      },
    };
  }, [year, month]);

  const { data: data_bonus, update: update_bonus, isFetching } = useGetReportForm_bonus(params);

  // --------------------------------------------------------------------

  // region request

  const reqSubmit: TreqSubmit = async (bonusId: string) => {
    await apiPatchReportForm_bonus_submit(bonusId).then(update_bonus);
  };

  const reqReview: TreqReview = async (bonusId: string, isPass: boolean) => {
    await apiPatchReportForm_bonus_review(bonusId, { isPass }).then(update_bonus);
  };

  // --------------------------------------------------------------------

  // region component props
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
    {
      label: '獎金週期維護',
      onClick: () => {
        router.replace('/domestic/personalPerformanceStatistics/bonusPeriod');
      },
    },
  ];

  // --------------------------------------------------------------------
  // region render
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
            {data_bonus?.map((bonus, index) => {
              return (
                <Row
                  key={bonus.id || index}
                  data_bonus={bonus}
                  reqSubmit={reqSubmit}
                  reqReview={reqReview}
                  userInfo={userInfo}
                />
              );
            })}
          </div>
        </div>
      </div>
    </SubLayer>
  );
}

// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// region component

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

const Row = ({
  reqSubmit,
  reqReview,
  data_bonus,
  userInfo,
}: {
  data_bonus: TbonusDto;
  reqSubmit: TreqSubmit;
  reqReview: TreqReview;
  userInfo: TuserDto;
}) => {
  //
  const { id, totalSales, totalBonus, note, salesEmployee } = data_bonus;

  const isSumbit = checkIsSumbit(data_bonus);
  const statusArr = createStatusArr(data_bonus);
  const isAllowReivew = checkIsAllowReivew(data_bonus, userInfo);

  return (
    <div className={scss.row}>
      <div className={scss.cell}>{salesEmployee.chName}</div>
      <div className={scss.cell}>{totalSales.toLocaleString()}</div>
      <div className={scss.cell}>{totalBonus.toLocaleString()}</div>
      <div className={scss.cell}>{note}</div>

      <div className={classNames(scss.cell, scss.cell_processChain, 'col-span-4')}>
        <ProcessChain className={scss.processChain} control={{ statusArr }} />

        {!isSumbit && (
          <MyButton_v2
            py="py4"
            px="px22"
            onClick={() => {
              reqSubmit(id);
            }}
          >
            送審
          </MyButton_v2>
        )}
        {isAllowReivew && (
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
                    onClick: async () => {
                      await reqReview(id, true);
                      modal.destroy();
                    },
                  },
                  {
                    label: '不通過審核',
                    onClick: async () => {
                      await reqReview(id, false);
                      modal.destroy();
                    },
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
        )}
      </div>
    </div>
  );
};

// ====================================================================

// region function

const checkReview = (to: string | null, at: string | null) => {
  if (at) {
    return 'green'; // 已審核通過
  } else if (to) {
    return 'red'; // 已送審未審核
  } else {
    return 'gray'; //未送審
  }
};

const createStatusArr = (data_bonus: TbonusDto): Tcontrol_processChain['statusArr'] => {
  const {
    reviewTeamLeaderEmployee,
    toReviewTeamLeader,
    teamLeaderReviewAt,

    reviewSupervisorEmployee,
    toReviewSupervisor,
    supervisorReviewAt,

    reviewManagerEmployee,
    toReviewManager,
    managerReviewAt,
  } = data_bonus;

  const statusArr: Tcontrol_processChain['statusArr'] = [
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
};

const checkIsSumbit = (data_bonus: TbonusDto) => {
  const { toReviewTeamLeader, toReviewSupervisor, toReviewManager } = data_bonus;

  return !!(toReviewTeamLeader || toReviewSupervisor || toReviewManager);
};

const checkIsAllowReivew = (data_bonus: TbonusDto, userInfo: TuserDto) => {
  const id = userInfo.employee?.id;

  const {
    reviewTeamLeaderEmployee,
    toReviewTeamLeader,
    teamLeaderReviewAt,

    reviewSupervisorEmployee,
    toReviewSupervisor,
    supervisorReviewAt,

    reviewManagerEmployee,
    toReviewManager,
    managerReviewAt,
  } = data_bonus;

  if (
    //
    checkReview(toReviewTeamLeader, teamLeaderReviewAt) === 'red' &&
    reviewTeamLeaderEmployee.id === id
  ) {
    return true;
  }

  if (
    //
    checkReview(toReviewSupervisor, supervisorReviewAt) === 'red' &&
    reviewSupervisorEmployee.id === id
  ) {
    return true;
  }

  if (
    //
    checkReview(toReviewManager, managerReviewAt) === 'red' &&
    reviewManagerEmployee.id === id
  ) {
    return true;
  }

  return false;
};
