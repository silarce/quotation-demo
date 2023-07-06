import moment, { Moment } from 'moment';
import { Tparams } from 'js/api/dtoTypes';

/** 回傳一個params，內含一個filter。以theMoment為基點，上個月的開始到下個月的結束*/
const filterCre_nextAndPrevMonth = (theMoment: Moment) => {
  const monthStart = theMoment.clone().subtract(1, 'month').startOf('month').toISOString();
  const monthEnd = theMoment.clone().endOf('month').add(1, 'month').toISOString();
  const filter: Tparams['filter'] = {
    date: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  };

  return filter;
};

export { filterCre_nextAndPrevMonth };
