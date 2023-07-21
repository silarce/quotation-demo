import { useState, useMemo, useRef } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { useRouter } from 'next/router';

// antd
import { Badge } from 'antd';

// css
import scss from './monthReportTable.module.scss';

// type
import { TaccountingReportDto, TaccountingReportStatistic } from 'js/api/dtoTypes';
import { TemployeeDto } from 'js/api/api_dailyReport';
// other
import { myConfig } from 'config/myConfig';

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
  const ref_main = useRef<HTMLDivElement>(null);
  const [ref, setRef] = useState(ref_main);

  const { weekDays: dayArr, holidayLookup_month } = useMemo(() => {
    const weekDays = [];
    const date = moment(isoDate).startOf('month');
    const year = date.year();
    const month = (date.month() + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    const daysInMonth = date.daysInMonth();

    for (let i = 0; i < daysInMonth; i++) {
      const day = date.day(); // 使用 date() 取得當前的天數
      const dateStr = date.format('yyyy-MM-DD');
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
            const shouldShow = (() => {
              if (!employeeIdArr) {
                return true;
              }

              if (employeeIdArr.includes(employeeId)) {
                return true;
              }

              return false;
            })();

            if (!shouldShow) {
              return null;
            }

            const statisticsObj = (() => {
              const obj: { [key: string]: TaccountingReportStatistic } = {};
              statistic.forEach((item) => {
                const dateDay = moment(item.date).date();
                obj[dateDay] = item;
              });

              return obj;
            })();

            /**
              多個worker會共用同一個(同一個id)日報表
              為了避免重複計算月總計
             */
            // 用於顯示這個item的總計，不管isWorker為何都會計算
            let breakfastTotal_item = 0;
            let lunchTotal_item = 0;
            let dinnerTotal_item = 0;
            let stayLengthTotal_item = 0;

            // 用於計算月總計，如果isWorker為false，就不計算
            let breakfastTotal_calc = 0;
            let lunchTotal_calc = 0;
            let dinnerTotal_calc = 0;
            let stayLengthTotal_calc = 0;

            return (
              <div key={aIndex} className={scss.item}>
                <Head chName={employeeName ?? ''} />

                {dayArr.map((dayObj) => {
                  const { day, date, dateMoment } = dayObj;
                  const dateDay = dateMoment.date().toString();

                  const statistics = statisticsObj[dateDay] as TaccountingReportStatistic | undefined;

                  const { dailyReportId, isWorker } = statistics ?? {};

                  let breakfast = 0;
                  let lunch = 0;
                  let dinner = 0;
                  const stayLength = statistics?.stayLength ?? 0;

                  statistics?.meals?.forEach((meal) => {
                    if (meal === 'breakfast') {
                      breakfast++;
                    }

                    if (meal === 'lunch') {
                      lunch++;
                    }

                    if (meal === 'dinner') {
                      dinner++;
                    }
                  });

                  breakfastTotal_item = breakfastTotal_item + breakfast;
                  lunchTotal_item = lunchTotal_item + lunch;
                  dinnerTotal_item = dinnerTotal_item + dinner;
                  stayLengthTotal_item = stayLengthTotal_item + stayLength;

                  // if (!isWorker) {
                  breakfastTotal_calc = breakfastTotal_calc + breakfast;
                  lunchTotal_calc = lunchTotal_calc + lunch;
                  dinnerTotal_calc = dinnerTotal_calc + dinner;
                  stayLengthTotal_calc = stayLengthTotal_calc + stayLength;
                  // }

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
                      <div className={scss.cell}>{breakfast !== 0 && <MyBadge />}</div>
                      <div className={scss.cell}>{lunch !== 0 && <MyBadge />}</div>
                      <div className={scss.cell}>{dinner !== 0 && <MyBadge />}</div>
                      <div className={scss.cell}>{stayLength || null}</div>
                    </div>
                  );
                })}

                <div className={classNames(scss.row)}>
                  <div className={classNames(scss.cell, scss.mainColor)}>
                    <span>{breakfastTotal_item}</span>
                  </div>
                  <div className={classNames(scss.cell, scss.mainColor)}>
                    <span>{lunchTotal_calc}</span>
                  </div>
                  <div className={classNames(scss.cell, scss.mainColor)}>
                    <span>{dinnerTotal_item}</span>
                  </div>
                  <div className={classNames(scss.cell, scss.mainColor)}>
                    <span>{stayLengthTotal_item}</span>
                  </div>
                </div>

                {(() => {
                  const { breakfastCost, lunchCost, dinnerCost, stayCost } = myConfig;

                  // -------
                  // const mealsCostTotal_item =
                  //   breakfastTotal_item * breakfastCost +
                  //   lunchTotal_item * lunchCost +
                  //   dinnerTotal_item * dinnerCost

                  // const styCostTotal_item = stayLengthTotal_item * stayCost
                  // const total_item = mealsCostTotal_item + styCostTotal_item
                  // -------
                  const mealsCostTotal =
                    breakfastTotal_calc * breakfastCost + lunchTotal_calc * lunchCost + dinnerTotal_calc * dinnerCost;

                  const styCostTotal = stayLengthTotal_calc * stayCost;
                  const total = mealsCostTotal + styCostTotal;

                  monthTotal = monthTotal + total;
                  // -------

                  return (
                    <>
                      <div className={classNames(scss.cell, scss.mainColor)}>
                        <span>{mealsCostTotal}</span>
                      </div>
                      <div className={classNames(scss.cell, scss.mainColor)}>
                        <span>{styCostTotal}</span>
                      </div>
                      <div className={classNames(scss.cell, scss.bottom)}>
                        <span>{total}</span>
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
    dateMoment: moment.Moment;
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
