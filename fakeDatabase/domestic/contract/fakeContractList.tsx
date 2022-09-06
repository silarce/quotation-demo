const _ = require("lodash")


interface Tcontract {
  quotationId: string //報價單Id
  clientName: string
  projectName: string
  schedule: string //進度
  money: string
  contactName: string
  contactPhone: string
  undertaker: string //承辦人
}

interface TcontractObjList {
  [key: string]: Tcontract
}

let fakeContractObjList: TcontractObjList = {
  "S-110211-01": {
    quotationId: "S-110211-01",
    clientName: "新加坡商犀牛頓科技股份有限公司",
    projectName: "台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程",
    schedule: "100.00",
    money: "1606541",
    contactName: "陳小明小華",
    contactPhone: "0987654321",
    undertaker: "陳小明小華",
  },
  "S-110211-02": {
    quotationId: "S-110211-02",
    clientName: "尚比亞商大象皮成衣股份有限公司",
    projectName: "台灣東西南北雜衣(股)公司~東拼西湊大拍賣企劃",
    schedule: "56.08",
    money: "763000",
    contactName: "王小華",
    contactPhone: "0987556677",
    undertaker: "王小華",
  },
  "S-110211-03": {
    quotationId: "S-110211-03",
    clientName: "有間有限公司",
    projectName: "有間客棧大飯店五百周年慶暨北海分館開幕儀式企劃",
    schedule: "23.55",
    money: "50000000",
    contactName: "林有間",
    contactPhone: "0987654321",
    undertaker: "林有間",
  },
}

const fakeContractKeyList = Object.keys(fakeContractObjList)

// 批次複製
const listLength = Object.keys(fakeContractObjList).length
let i = listLength + 1
for (i; i <= 12; i++) {
  const key = `S-110211-${`${i}`.padStart(2, "0")}`
  const keyToClone = `S-110211-${`${i - listLength}`.padStart(2, "0")}`

  fakeContractObjList[key] = _.cloneDeep(fakeContractObjList[keyToClone])
  fakeContractObjList[key].quotationId = key
}

export type {
  Tcontract,
  TcontractObjList,
}

export {
  fakeContractObjList,
  fakeContractKeyList
}
