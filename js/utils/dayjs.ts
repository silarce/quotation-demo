import dayjs, { Dayjs } from 'dayjs';

export const fromMinguoYear = (rocDateStr: string): Dayjs | null => {
  if (!rocDateStr) {
    return null;
  }

  const [rocYear, month, day] = rocDateStr.split('-');

  if (!rocYear || !month || !day) {
    return null;
  }

  const year = parseInt(rocYear, 10) + 1911;

  const parsed = dayjs(`${year}-${month}-${day}`);

  return parsed.isValid() ? parsed : null;
};

export const toMinguoYear = (date: Dayjs | string | null | undefined): string => {
  if (!date) {
    return '';
  }

  const d = typeof date === 'string' ? dayjs(date) : date;

  if (!d.isValid()) {
    return '';
  }

  const year = d.year() - 1911;
  const month = d.format('MM');
  const day = d.format('DD');

  return `${year}-${month}-${day}`;
};

export const toADYear = (rocString: string) => {
  const [rocYear, month, day] = rocString.split('-');

  return dayjs(`${parseInt(rocYear, 10) + 1911}-${month}-${day}`).format('YYYY-MM-DD');
};

// const getYearMonth = (date: Moment) => date.year() * 12 + date.month();

// export const disabled31DaysDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
//   if (from) {
//     const minDate = from.add(-31, 'days');
//     const maxDate = from.add(31, 'days');

//     switch (type) {
//       case 'year':
//         return current.year() < minDate.year() || current.year() > maxDate.year();

//       case 'month':
//         return getYearMonth(current) < getYearMonth(minDate) || getYearMonth(current) > getYearMonth(maxDate);

//       default:
//         return Math.abs(current.diff(from, 'days')) >= 31;
//     }
//   }

//   return false;
// };

export const getOneMonthAgo = (): [Dayjs, Dayjs] => {
  const oneMonthAge = dayjs().add(-1, 'month').startOf('day');
  const today = dayjs().startOf('day');

  return [oneMonthAge, today];
};
