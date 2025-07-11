import dayjs, { Dayjs } from 'dayjs';

/**返回ISOString */
export const convertDate_reduce1911 = (date: string | Date | Dayjs) => {
  let dateTime = dayjs(date);

  if (!dateTime.isValid()) {
    return 'invalid date';
  }

  dateTime = dateTime.subtract(1911, 'year');

  return dateTime.toISOString();
};

/**返回ISOString */
export const convertDate_add1911 = (date: string | Date | Dayjs) => {
  let dateTime = dayjs(date);

  if (!dateTime.isValid()) {
    return 'invalid date';
  }

  dateTime = dateTime.add(1911, 'year');

  return dateTime.toISOString();
};

export const getTaiwanDateStr = (
  date: string | Date | Dayjs | undefined | null,
  {
    withUnit,
  }: {
    withUnit?: boolean;
  } = {}
) => {
  const d = dayjs(date || undefined);

  if (!d.isValid()) {
    return 'invalid date';
  }

  let format = 'YYYY-MM-DD';

  if (withUnit) {
    format = 'YYYY年MM月DD日';
  }

  return dayjs(convertDate_reduce1911(d)).format(format).replace(/(^0+)/, '');
};
