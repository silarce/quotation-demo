// 檢查輸入的字串是否為數字，且小數位數不超過指定的位數
function checkIsFloat(value: string | number, decimal = 2): boolean {
  const reg = new RegExp(`^-?\\d+(\\.\\d{1,${decimal}})?$`);

  return reg.test(String(value));
}

export { checkIsFloat };
