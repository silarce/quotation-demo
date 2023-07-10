import { useMemo } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';

// antd
import { Badge } from 'antd';

// global gear
import CellWithBar from 'components/global/gear/cell/cellWithBar';

// css
import scss from './reporterList.module.scss';

// type
import { TdailyReportDto } from 'js/api/api_dailyReport';
import { TdailyReportReviewStatusDto } from 'js/api/dtoTypes';
import { Ttag } from 'pages/home/dailyReport';
import { convertDate_reduce1911 } from 'js/utils/helpers/date/convertDate';

type TgroupReport = { date: string; reportArr: TdailyReportDto[] };

export default function ReporterList({
  dailyReportArr,
  addTag,
  viewRef,
}: {
  dailyReportArr: TdailyReportDto[];
  addTag: (employee: Ttag) => void;
  viewRef: (node?: Element | null | undefined) => void;
}) {
  const groupReportArr = useMemo(() => {
    const groupReportList = _.groupBy(dailyReportArr, 'date');
    const groupReportArr: TgroupReport[] = [];

    for (const [key, value] of Object.entries(groupReportList)) {
      groupReportArr.push({
        date: key,
        reportArr: value,
      });
    }

    return groupReportArr;
  }, [dailyReportArr]);

  return (
    <div className={scss.container}>
      {groupReportArr.map((group, gIndex) => {
        const { date, reportArr } = group;
        const twDate = moment(convertDate_reduce1911(date)).format('y-MM-DD');

        return (
          <div key={gIndex}>
            <div className={classNames(scss.groupHeader)}>
              <span>{twDate}</span>
            </div>

            {reportArr.map((report, rIndex) => {
              const ref = (() => {
                if (groupReportArr.length - 3 === gIndex) {
                  if (reportArr.length >= 3) {
                    if (reportArr.length - 3 === rIndex) {
                      return viewRef;
                    }
                  } else if (rIndex === 0) {
                    return viewRef;
                  }
                }

                return undefined;
              })();

              const { date, employee, id: reportId, reviewStatus } = report;
              const { chName, id: employeeId } = employee;
              const twDate = moment(convertDate_reduce1911(date)).format('y-MM-DD');

              const tag: Ttag = {
                reportId,
                employeeId,
                name: chName,
                date: twDate,
                prevDate: groupReportArr?.[gIndex + 1]?.date,
              };

              const statusChecker = (status: TdailyReportReviewStatusDto) => {
                const { reviewedAt, type } = status;

                if (type === 'examiner') {
                  return 1;
                }

                if (!reviewedAt) {
                  return 2;
                } else {
                  return 3;
                }
              };

              const gradeChecker = (status: TdailyReportReviewStatusDto) => {
                const jobArr = status.reviewerEmployee.jobs ?? [];
                const sortedJobs = _.sortBy(jobArr, 'grade').reverse();
                const grade = sortedJobs[0]?.grade || 0;

                return grade;
              };

              const sortteStatuArr = _.sortBy(reviewStatus, [statusChecker, gradeChecker]).reverse();

              return (
                <CellWithBar
                  key={rIndex}
                  className={classNames(scss.row)}
                  onClick={() => {
                    addTag(tag);
                  }}
                >
                  <div ref={ref} className={classNames(scss.chName, 'w-[120px]')}>
                    <span>{chName}</span>
                  </div>

                  <div className={classNames(scss.reviewerList, 'w-full')}>
                    {sortteStatuArr?.map((item, index) => {
                      const { reviewerEmployee, reviewedAt, type } = item;
                      const statu = (() => {
                        if (type === 'examiner') {
                          return 'gray';
                        }

                        if (reviewedAt) {
                          return 'green';
                        }

                        return 'red';
                      })();
                      const { chName } = reviewerEmployee;

                      return <StatuBtn key={index} statu={statu} name={chName} />;
                    })}
                  </div>
                </CellWithBar>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ==========================================================================

const StatuBtn = ({ statu, name }: { statu: string; name: string }) => {
  return (
    <div className={scss.statuBtn}>
      <Badge color={statu} />
      <span>{name}</span>
    </div>
  );
};

// ==========================================================================
