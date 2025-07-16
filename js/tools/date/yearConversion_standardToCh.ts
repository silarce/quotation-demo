export const yearConversion_standardToCh = (dateStringOri: string, noLeading = false) => {
  if (!dateStringOri) {
    return '';
  }

  const yearLength = noLeading ? 3 : 4;

  const arr = dateStringOri.split('-');
  const year = (parseInt(arr[0]) - 1911).toString().padStart(yearLength, '0');

  const dateString = `${year}-${arr[1]}-${arr[2]}`;

  return dateString;
};
