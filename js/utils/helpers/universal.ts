






/**將數字串的千分號去掉 */
const clearThousandsSeparator = (v: string) => {
  return v.replace(/,/g, "") || 0
}




export {
  clearThousandsSeparator // 將數字串的千分號去掉
}

