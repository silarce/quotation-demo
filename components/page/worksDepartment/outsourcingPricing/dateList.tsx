import { useEffect, useMemo } from 'react';
import classNames from 'classnames';

import DateCollapse, { Tcontrol_dateCollapse } from 'components/page/worksDepartment/outsourcingPricing/dateCollapse';

// utils
import { getAllyearMonthListByRange } from 'js/utils/helpers/date/calcDate';

import { Tparams, useGetOutsourcingPayment } from 'js/api/api_outsourcing';

const DateList = ({ className, onCardClick }: { className?: string; onCardClick: (dateString: string) => void }) => {
  const params: Tparams = {
    sort: 'date',
    order: 'ASC',
    // pageSize: 999999,
  };

  // 只是為了取得最早的日期，並從該日期開始
  const { dataArr, reset } = useGetOutsourcingPayment({ customParams: params });
  // console.log(dataArr);

  const oldestDate = dataArr[0]?.date;

  useEffect(() => {
    reset();
  }, []);

  // ----------------------------------------------------------------------
  // 產生的年月表會包括沒有資料的年月，這是符合預期的
  // 另外預期每個月都會有資料，在正式環境應該是不會有點下去沒資料的情況
  const control_dateCollapse: Tcontrol_dateCollapse = useMemo(() => {
    const yearMonthList = getAllyearMonthListByRange({
      start: oldestDate,
      end: new Date().toISOString(),
    });

    let panelArr: Tcontrol_dateCollapse['panelArr'] = Object.entries(yearMonthList).map(([year, monthArr]) => {
      const twYear = String(Number(year) - 1911);

      const cardList = monthArr.map((month) => {
        return {
          label: `${month}月`,
          onClick: () => {
            onCardClick(`${year}-${month}`);
          },
        };
      });

      return {
        label: twYear,
        cardArr: cardList,
      };
    });

    panelArr = panelArr.reverse();

    return {
      panelArr,
    };
  }, [oldestDate]);

  return <DateCollapse className={classNames(className)} control={control_dateCollapse} />;
};

export default DateList;
