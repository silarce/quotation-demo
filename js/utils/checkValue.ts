// 檢查輸入的字串是否為數字，且小數位數不超過指定的位數
function checkIsFloat(str: string, decimal = 2): boolean {
  const reg = new RegExp(`^-?\\d+(\\.\\d{1,${decimal}})?$`);

  return reg.test(str);
}

export { checkIsFloat };
