

export function generateYearArray(
  { startYear, endYear }:
    {
      startYear?: number
      endYear?: number
    } = {}
) {
  if (!startYear) startYear = 80;
  if (!endYear) endYear = new Date().getFullYear() - 1911;
  const yearArray = [];
  for (let i = startYear; i <= endYear; i++) {
    yearArray.push(i.toString());
  }
  return yearArray;
}