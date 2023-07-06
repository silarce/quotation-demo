// import moment from 'moment';

export const yearConversion_chToStandard = (
  /** YYY-MM-DD */
  dateStringOri: string
) => {
  const pattern = /^\d{3}-\d{2}-\d{2}$/;

  if (!pattern.test(dateStringOri)) {
    return false;
  }

  const arr = dateStringOri.split('-');
  const year = (parseInt(arr[0]) + 1911).toString().padStart(4, '0');
  const dateString = `${year}-${arr[1]}-${arr[2]}`;

  return dateString;
};
