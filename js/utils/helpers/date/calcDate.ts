import dayjs, { Dayjs } from 'dayjs';

function getAllMonthByRange({ start, end }: { start: Dayjs | Date; end: Dayjs | Date }): string[] {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
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

function getAllyearMonthListByRange({
  start,
  end,
}: {
  start: Dayjs | Date | undefined;
  end: Dayjs | Date | undefined;
}) {
  let startDate = dayjs(start);
  const endDate = dayjs(end);

  const dateObj: TyearMonthList = {};

  while (startDate.startOf('month') <= endDate.startOf('month')) {
    const year = startDate.year();
    const month = startDate.month() + 1; // month() returns 0-11, so we add 1 to get 1-12

    if (!dateObj[year]) {
      dateObj[year] = [];
    }

    if (!dateObj[year].includes(month)) {
      dateObj[year].push(month);
    }

    startDate = startDate.add(1, 'month');
  }

  return dateObj;
}

export { getAllMonthByRange, getAllyearMonthListByRange };
