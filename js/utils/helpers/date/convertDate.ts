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
  if (!date) {
    return '';
  }

  const d = dayjs(date);

  if (!d.isValid()) {
    return 'invalid date';
  }

  let format = 'YYYY-MM-DD';

  if (withUnit) {
    format = 'YYYY年MM月DD日';
  }

  return dayjs(convertDate_reduce1911(d)).format(format).replace(/(^0+)/, '');
};

/**
 * 檢查日期格式是否為 YYYY-MM-DD 或 YYYY/MM/DD
 *
 * 不檢查日期是否實際存在
 *
 * YYYY可以為任意位數 例如111-01-01
 *
 * 0111-01-01視為合法
 */
const checkIsYMD = (value: string) => {
  if (!checkIsYYYYMMDD_simple(value)) {
    return false;
  }

  let arr = value.split('-');

  arr.length !== 3 && (arr = value.split('/'));

  if (arr.length !== 3) {
    return false;
  }

  const year = Number(arr[0]);
  const month = Number(arr[1]);
  const day = Number(arr[2]);

  if (isNaN(year) || isNaN(month) || isNaN(day) || year <= 0 || month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  return true;
};

/**
 * 僅簡單檢查格式，不可能檢查是否為時間
 */
const checkIsYYYYMMDD_simple = (value: string) => {
  return /^\d+-\d{1,2}-\d{1,2}$/.test(value) || /^\d+\/\d{1,2}\/\d{1,2}$/.test(value);
};

export { checkIsYMD };
