import moment from 'moment';

/**返回ISOString */
export const convertDate_reduce1911 = (ISOString: string) => {
  if (!ISOString) {
    return ISOString;
  }

  const dateTime = moment(ISOString);

  if (!dateTime.isValid()) {
    return ISOString;
  }

  dateTime.subtract(1911, 'year');

  return dateTime.toISOString();

  // const dateTime = new Date(ISOString);
  // const year = dateTime.getFullYear();
  // const chYear = year - 1911;
  // dateTime.setFullYear(chYear);

  // return dateTime.toISOString();
};

/**返回ISOString */
export const convertDate_add1911 = (ISOString: string) => {
  if (!ISOString) {
    return ISOString;
  }

  const dateTime = new Date(ISOString);
  const twYear = dateTime.getFullYear();
  const year = twYear + 1911;
  dateTime.setFullYear(year);

  return dateTime.toISOString();
};

export const getTaiwanDateStr = (ISOString: string | undefined | null) => {
  if (!ISOString) {
    return '';
  }

  return moment(convertDate_reduce1911(ISOString)).format('yy-MM-DD');
};
