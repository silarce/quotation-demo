

// doorType: string[] // 封裝時再從主產品列表中取得資料

// contactPhone: string
// contactName: string
// clientName: string


type Tproject = {
  [key: string]: {
    quotationId: string //報價單Id // 報價編號
    tempQuotationAging: number // 報價時效 天數 顯示`${quotationAging}天內`
    date: string  //報價日期
    projectName: string // 專案(報價單)名稱
    undertaker: string //承辦人
    discount: number // 總折數
    tempDoorQty: number// 橖數
    tempBudgetAmount: number //合約金額
    projectCounty: string // 工程地點城市
    projectDistrict: string // 工程地點行政區
    projectAddress: string // 工程地點剩餘地址
    trackingStatus: string // 追蹤狀態
    siteProgress: string // 工地進度

    quoStatus: "預算" | "投標" | "發包" | "合約"

    // 客戶資料id
    clientId: string,
    tempRecord: {
      date: string
      discount: string
      doorQty: string
      budgetAmount: string
      Remark: string
    }[]
  }
}

const fakeProjectData: Tproject = {
  "S-110211-01": {
    quotationId: "S-110211-01",
    tempQuotationAging: 10,
    date: "110-02-02",
    projectName: "台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程",
    undertaker: "陳小明小華",
    discount: 99.99,
    tempDoorQty: 99,
    tempBudgetAmount: 999999,
    projectCounty: "臺北市",
    projectDistrict: "大安區",
    projectAddress: "什麼什麼路",
    trackingStatus: "",
    siteProgress: "",
    quoStatus: "預算",
    clientId: "S00001",
    tempRecord: [
      {
        date: "111-01-02",
        discount: "88.88",
        doorQty: "88",
        budgetAmount: "888,888",
        Remark: "備註備註備註備註",
      },
      {
        date: "111-01-01",
        discount: "77.77",
        doorQty: "77",
        budgetAmount: "777,777",
        Remark: "備註備註備註備註",
      },
    ]
  },
  "S-110211-02": {
    quotationId: "S-110211-02",
    tempQuotationAging: 10,
    date: "110-02-05",
    projectName: "台灣東西南北雜衣(股)公司~東拼西湊大拍賣企劃",
    undertaker: "陳小明小華",
    discount: 88.88,
    tempDoorQty: 88,
    tempBudgetAmount: 888888,
    projectCounty: "桃園市",
    projectDistrict: "楊梅區",
    projectAddress: "什麼什麼路",
    trackingStatus: "",
    siteProgress: "",
    quoStatus: "預算",
    clientId: "S00002",
    tempRecord: [
      {
        date: "111-01-02",
        discount: "88.88",
        doorQty: "88",
        budgetAmount: "888,888",
        Remark: "備註備註備註備註",
      },
      {
        date: "111-01-01",
        discount: "77.77",
        doorQty: "77",
        budgetAmount: "777,777",
        Remark: "備註備註備註備註",
      },
    ]
  },
  "S-110211-03": {
    quotationId: "S-110211-03",
    tempQuotationAging: 10,
    date: "110-03-12",
    projectName: "有間客棧大飯店五百周年慶暨北海分館開幕儀式企劃",
    undertaker: "陳小明小華",
    discount: 77.77,
    tempDoorQty: 77,
    tempBudgetAmount: 777777,
    projectCounty: "新竹市",
    projectDistrict: "北區",
    projectAddress: "什麼什麼路",
    trackingStatus: "",
    siteProgress: "",
    quoStatus: "預算",
    clientId: "S00003",
    tempRecord: [
      {
        date: "111-01-02",
        discount: "88.88",
        doorQty: "88",
        budgetAmount: "888,888",
        Remark: "備註備註備註備註",
      },
      {
        date: "111-01-01",
        discount: "77.77",
        doorQty: "77",
        budgetAmount: "777,777",
        Remark: "備註備註備註備註",
      },
    ]
  },
}



function checkData(projectData: Tproject): void {
  for (const [key, value] of Object.entries(projectData)) {
    if (key !== value.quotationId) {
      // 建立資料時quotationId必須要與其所屬物件的key相符
      throw new Error(`quotationId of project ${key} does not match its key`);
    }
  }
}

checkData(fakeProjectData)

export type { Tproject }
export { fakeProjectData }





