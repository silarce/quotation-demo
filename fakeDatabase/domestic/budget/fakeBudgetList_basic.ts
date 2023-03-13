const _ = require("lodash")


interface Tbudget {
  quotationId: string //報價單Id
  date: string
  clientName: string
  country: string
  projectName: string
  contactName: string
  contactPhone: string
  undertaker: string //承辦人
  discount: string | number // 總折數
  doorQty: string | number// 橖數
  budgetAmount: string | number //合約金額
  doorType: string
}

interface TbudgetObjList {
  [key: string]: Tbudget
}

let fakeBudgetObjList: TbudgetObjList = {
  "S-110211-01": {
    quotationId: "S-110211-01",
    date: "111-02-02",
    country: "台北市",

    clientName: "新加坡商犀牛頓科技股份有限公司",
    contactName: "陳小明小華",
    contactPhone: "0987654321",
    
    undertaker: "陳小明小華",
    projectName: "台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程",

    discount: "100.00",
    doorQty: "10",
    budgetAmount: "1606541",
    doorType: "SJ-30287",
  },
  "S-110211-02": {
    quotationId: "S-110211-02",
    date: "111-06-12",
    clientName: "尚比亞商大象皮成衣股份有限公司",
    country: "桃園市",
    projectName: "台灣東西南北雜衣(股)公司~東拼西湊大拍賣企劃",
    contactName: "王小華",
    contactPhone: "0987556677",
    undertaker: "王小華",
    discount: "800.00",
    doorQty: "7",
    budgetAmount: "1256942",
    doorType: "SJ-302",
  },
  "S-110211-03": {
    quotationId: "S-110211-03",
    date: "111-10-05",
    clientName: "有間有限公司",
    country: "新竹市",
    projectName: "有間客棧大飯店五百周年慶暨北海分館開幕儀式企劃",
    contactName: "林有間",
    contactPhone: "0987654321",
    undertaker: "林有間",
    discount: "67.55",
    doorQty: "5",
    budgetAmount: "863874",
    doorType: "SJ-30287",
  },
}



// 批次複製
const listLength = Object.keys(fakeBudgetObjList).length
let i = listLength + 1
for (i; i <= 12; i++) {
  const key = `S-110211-${`${i}`.padStart(2, "0")}`
  const keyToClone = `S-110211-${`${i - listLength}`.padStart(2, "0")}`

  fakeBudgetObjList[key] = _.cloneDeep(fakeBudgetObjList[keyToClone])
  fakeBudgetObjList[key].quotationId = key
}

const fakeBudgetKeyList = Object.keys(fakeBudgetObjList)

export type {
  Tbudget,
  TbudgetObjList
}

export {
  fakeBudgetObjList,
  fakeBudgetKeyList
}
