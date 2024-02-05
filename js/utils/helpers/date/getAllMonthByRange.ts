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

export { getAllMonthByRange };
