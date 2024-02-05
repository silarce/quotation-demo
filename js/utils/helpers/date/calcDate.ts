import moment, { MomentInput } from 'moment';

function getAllMonthByRange({ start, end }: { start: MomentInput; end: MomentInput }): string[] {
  const startDate = moment(start);
  const endDate = moment(end);
  const currentDate = startDate.clone();
  const dateArr: string[] = [];

  while (currentDate <= endDate) {
    dateArr.push(currentDate.format('YYYY-MM'));
    currentDate.add(1, 'month');
  }

  return dateArr;
}

type TyearMonthList = {
  [year: number]: number[];
};

function getAllyearMonthListByRange({ start, end }: { start: MomentInput; end: MomentInput }) {
  const startDate = moment(start);
  const endDate = moment(end);
  // const currentDate = startDate.clone();
  const dateObj: TyearMonthList = {};

  while (startDate <= endDate) {
    const year = startDate.year();
    const month = startDate.month() + 1; // month() returns 0-11, so we add 1 to get 1-12

    if (!dateObj[year]) {
      dateObj[year] = [];
    }

    if (!dateObj[year].includes(month)) {
      dateObj[year].push(month);
    }

    startDate.add(1, 'month');
  }

  return dateObj;
}

export { getAllMonthByRange, getAllyearMonthListByRange };
