import { useState, useMemo, useRef } from 'react';
import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';

// antd
import { Badge } from 'antd';

// css
import scss from './monthReportTable.module.scss';

// type
import { TaccountingReportDto, TaccountingReportStatistic } from 'js/api/dtoTypes';
// other
import { Class_statisticCalc, filterIdArr } from 'pages/home/monthReport';

import { holidaysLookup } from 'config/date/holidaysLookup';

// =============================================================

export default function MonthReportTable({
  isoDate,
  accountingReport = [],
  employeeIdArr,
  pushReportId,
}: {
  isoDate: string;
  accountingReport: TaccountingReportDto[] | undefined;
  employeeIdArr: string[] | undefined;
  pushReportId: (reportId: string) => void;
}) {
  const { weekDays: dayArr, holidayLookup_month } = useMemo(() => {
    const weekDays = [];
    const date = dayjs(isoDate).startOf('month');
    const year = date.year();
    const month = (date.month() + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    const daysInMonth = date.daysInMonth();

    for (let i = 0; i < daysInMonth; i++) {
      const day = date.day(); // 使用 date() 取得當前的天數
      const dateStr = date.format('YYYY-MM-DD');
      const dateMoment = date.clone();
      weekDays.push({
        day,
        date: dateStr,
        dateMoment,
      });
      date.add(1, 'day');
    }

    const holidayLookup_month = holidaysLookup[year]?.[month];

    return { weekDays, year, month, holidayLookup_month };
  }, [isoDate]);

  // -----------------------------------------------------------------
  let monthTotal = 0;

  // const mainWidth = (() => {
  //   if (!ref_main.current?.getBoundingClientRect().width) return 0
  //   return ref_main.current?.getBoundingClientRect().width + 66 + "px"
  // })()

  // ref_main.current?.getBoundingClientRect().width  don't trigger rerender

  // const mainWidth = useMemo(() => {
  //   console.log(ref_main.current?.getBoundingClientRect().width)
  //   if (!ref_main.current?.getBoundingClientRect().width) return 0
  //   return ref_main.current?.getBoundingClientRect().width + 66 + "px"
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [ref?.current])

  // console.log(ref_main.current?.getBoundingClientRect().width)

  // console.log(router.isReady)
  // console.log(mainWidth)

  // -----------------------------------------------------------------
  return (
    <div className={scss.container}>
      <div className={scss.table}>
        <Side dayArr={dayArr} holidayLookup_month={holidayLookup_month} />
        {/* group */}
        {/* <div className={scss.main} ref={ref_main}> */}
        <div className={scss.main}>
          {accountingReport.map((accReport, aIndex) => {
            const { employeeId, employeeName, statistic } = accReport;

            // 過濾/搜尋用的
            const shouldShow = filterIdArr({ employeeIdArr, employeeId });

            if (!shouldShow) {
              return null;
            }

            const statisticsObj = (() => {
              const obj: { [key: string]: TaccountingReportStatistic } = {};
              statistic.forEach((item) => {
                const dateDay = dayjs(item.date).date();
                obj[dateDay] = item;
              });

              return obj;
            })();

            const class_statisticCalc = new Class_statisticCalc();

            return (
              <div key={aIndex} className={scss.item}>
                <Head chName={employeeName ?? ''} />

                {dayArr.map((dayObj) => {
                  const { day, date, dateMoment } = dayObj;
                  const dateDay = dateMoment.date().toString();

                  const statistics = statisticsObj[dateDay] as TaccountingReportStatistic | undefined;

                  const { dailyReportId, isWorker } = statistics ?? {};

                  const stayLength = statistics?.stayLength ?? 0;

                  /**計算合計的同時return這個item是否有早午晚餐 */
                  const { isBreakfast, isLunch, isDinner } = class_statisticCalc.calcQty(statistics?.meals ?? []);
                  class_statisticCalc.stayLength = class_statisticCalc.stayLength + stayLength;

                  // --------------
                  let isHoliday = false;
                  const { 是否放假 } = holidayLookup_month?.[dateDay] ?? {};

                  if (是否放假 === '2') {
                    isHoliday = true;
                  }

                  const onClick = () => {
                    if (dailyReportId) {
                      pushReportId(dailyReportId);
                    }
                  };

                  return (
                    <div
                      key={date}
                      onClick={onClick}
                      className={classNames(
                        scss.row,
                        { [scss.isHoliday]: isHoliday },
                        { [scss.pointer]: !!dailyReportId }
                      )}
                    >
                      <div className={scss.cell}>{isBreakfast && <MyBadge />}</div>
                      <div className={scss.cell}>{isLunch && <MyBadge />}</div>
                      <div className={scss.cell}>{isDinner && <MyBadge />}</div>
                      <div className={scss.cell}>{stayLength || null}</div>
                    </div>
                  );
                })}

                {/* 合計 */}
                <div className={classNames(scss.row)}>
                  <div className={classNames(scss.cell, scss.mainColor)}>
                    <span>{class_statisticCalc.breakfastQty}</span>
                  </div>
                  <div className={classNames(scss.cell, scss.mainColor)}>
                    <span>{class_statisticCalc.lunchQty}</span>
                  </div>
                  <div className={classNames(scss.cell, scss.mainColor)}>
                    <span>{class_statisticCalc.dinnerQty}</span>
                  </div>
                  <div className={classNames(scss.cell, scss.mainColor)}>
                    <span>{class_statisticCalc.stayLength}</span>
                  </div>
                </div>

                {(() => {
                  monthTotal = monthTotal + class_statisticCalc.subTotal;

                  return (
                    <>
                      <div className={classNames(scss.cell, scss.mainColor)}>
                        <span>{class_statisticCalc.total_mealsCost}</span>
                      </div>
                      <div className={classNames(scss.cell, scss.mainColor)}>
                        <span>{class_statisticCalc.stayCost}</span>
                      </div>
                      <div className={classNames(scss.cell, scss.bottom)}>
                        <span>{class_statisticCalc.subTotal}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            );
          })}
        </div>
        {/* group */}
      </div>{' '}
      {/* table */}
      <div className={scss.total}>
        <div>
          <div>
            <span>本月總合計</span>
          </div>
          <div>
            <span>{monthTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
// =============================================================
// =============================================================
// =============================================================

const MyBadge = () => {
  return <Badge color="#08F366" className={scss.myBadge} />;
};

const Side = ({
  dayArr,
  holidayLookup_month,
}: {
  dayArr: {
    day: number;
    date: string;
    dateMoment: Dayjs;
  }[];
  holidayLookup_month: (typeof holidaysLookup)[number][number];
}) => {
  return (
    <div className={scss.side}>
      <div className={scss.head}>
        <span>日期</span>
      </div>
      {dayArr.map((dayObj) => {
        const { day, date, dateMoment } = dayObj;
        const dateDay = dateMoment.date();

        let isHoliday = false;
        const { 是否放假 } = holidayLookup_month?.[dateDay] ?? {};

        if (是否放假 === '2') {
          isHoliday = true;
        }

        return (
          <div key={date} className={classNames(scss.cell, { [scss.isHoliday]: isHoliday })}>
            <span>{dateDay}</span>
          </div>
        );
      })}
      <div className={classNames(scss.cell, scss.mainColor)}>
        <span>合計</span>
      </div>
      <div className={classNames(scss.cell)}>
        <span>餐費</span>
      </div>
      <div className={classNames(scss.cell)}>
        <span>外宿費</span>
      </div>
      <div className={classNames(scss.cell, scss.bottom, scss.mainColor)}>
        <span>餐加宿</span>
      </div>
    </div>
  );
};

const Head = ({ chName }: { chName: string }) => {
  return (
    <div className={scss.head}>
      <div className={classNames(scss.cell, scss.chName)}>
        <span>{chName}</span>
      </div>
      <div className={scss.cell}>
        <span>早</span>
      </div>
      <div className={scss.cell}>
        <span>中</span>
      </div>
      <div className={scss.cell}>
        <span>晚</span>
      </div>
      <div className={scss.cell}>
        <span>外宿</span>
      </div>
    </div>
  );
};
