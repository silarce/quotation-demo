






/**將數字串的千分號去掉 */
const clearThousandsSeparator = (v: string) => {
  return v.replace(/,/g, "") || "0"
}

/**檢查是否為數字串 */
const checkIsNumberStr = (v: string) => {
  const numberRegex = /^(\d+(\.\d+)?|)$/;
  if (!numberRegex.test(v)) return false;
  return true
}



export {
  clearThousandsSeparator, // 將數字串的千分號去掉
  checkIsNumberStr, // 檢查是否為數字串
}

