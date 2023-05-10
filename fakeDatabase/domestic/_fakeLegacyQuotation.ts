
// 這些是門軌的圖片，未來可能會用到
import iconDoorRail_sj302_30
  from "public/image/fakeDB/doorRail/normal/SJ302_30.svg"
// import iconDoorRail_sj302_75_30t
//   from "public/image/fakeDB/doorRail/antiTyphoon/SJ302_75_30t.svg"
// import iconDoorRail_sj302_90_30t
//   from "public/image/fakeDB/doorRail/antiTyphoon/SJ302_90_30t.svg"
// import iconDoorRail_sj302_95_30t
//   from "public/image/fakeDB/doorRail/antiTyphoon/SJ302_95_30t.svg"
// import iconDoorRail_sj302_95_45t
//   from "public/image/fakeDB/doorRail/antiTyphoon/SJ302_95_45t.svg"


type TlegacyQuotation = {
  clientId: string, // 客戶id 用來關聯客戶資料以取得客戶名稱、聯絡人、電話那些資料
  // ---------------------------------------------------------
  basicInfo: {
    quotationId: string //報價單Id // 報價編號
    tempQuotationAging: number // 報價時效 天數 顯示`${quotationAging}天內`
    date: string  //報價日期
    constructionName: string // 工程名稱
    undertaker: string //承辦人

    totalDiscount: number // 總折數
    tempDoorQty: number// 橖數
    tempBudgetAmount: number //合約金額

    constructionCounty: string // 工程地點城市
    constructionDistrict: string // 工程地點行政區
    constructionAddress: string // 工程地點剩餘地址
    trackingStatus: string // 追蹤狀態 輸入字串
    siteProgress: string // 工地進度 輸入字串
  }
  // ---------------------------------------------------------
  mainProductArr: {
    idNumber: string //編號
    category: string // 項目
    series: string // 報價別
    doorType: string // 門型
    L: string
    W: string
    h: string
    B: string
    area: string // 面積
    cai: string // 才數
    material: string // 材質
    surface: string // 表面
    doorRail: string // 門軌 下拉式選單
    doorRailIcon: string //門軌的圖片 // 隨doorRail變動
    horsepower: string //馬力
    qty: string //數量
    unitPrice: string // 單價
    priceSubTotal: string // 複價
    typhoonProof: boolean // 防颱
    ejectionDoor: boolean // 彈射門
    memo: string
    part: {
      category: string // 項目
      content: string // 內容
      qty: string //數量
      price: string  // 單價
      subTotalPrice: string // 複價
      memo: string // 備註
    }[]
  }[]
  // ---------------------------------------------------------
  payInfo: {
    totalDiscount: string // 總折數
    subTotal: string // 小計
    tax: string // 營業稅
    total: string // 總計
    tradingLocation: string // 交貨地點
    tradingDate: string  // 交貨日期
    payWay: {
      label: string
      value: string
    }[] // 付款方式
  }
  // ---------------------------------------------------------
  memoArr: string[]
  quoteRangeArr: string[]
  // ---------------------------------------------------------
  signature: {
    manager: string // 經理
    director: string // 主管
    attn: string // 經辦
  }
  // ---------------------------------------------------------
}

type TlegacyQuotationList = {
  [key: string]: TlegacyQuotation
}

const fakeLegacyQuotationDataList: TlegacyQuotationList = {
  "S-110211-01": {
    clientId: "S00001", // 客戶id 用來關聯客戶資料
    // ---------------------------------------------------------
    basicInfo: {
      quotationId: "S-110211-01",
      tempQuotationAging: 10,
      date: "110-02-02",
      constructionName: "台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程",
      undertaker: "陳小明小華",
      totalDiscount: 99.99,
      tempDoorQty: 99,
      tempBudgetAmount: 999999,
      constructionCounty: "臺北市",
      constructionDistrict: "大安區",
      constructionAddress: "什麼什麼路",
      trackingStatus: "", // 追蹤狀態 輸入字串
      siteProgress: "", //  工地進度 輸入字串
    },
    // ---------------------------------------------------------
    mainProductArr: [
      {
        idNumber: "legacy001",
        category: "SD1",
        series: "不是捲門",
        doorType: "SJ-302",
        L: "3",
        W: "0",
        h: "2",
        B: "3.5",
        area: "999",
        cai: "999",
        material: "SST304#",
        surface: "2B",
        doorRail: "sj302_30",
        doorRailIcon: iconDoorRail_sj302_30.src,
        horsepower: "1/4 HP",
        qty: "1",
        unitPrice: "99",
        priceSubTotal: "999",
        memo: "防颱",
        ejectionDoor: false,
        typhoonProof: false,

        part: [
          {
            category: "SD2",
            content: "",
            qty: "2",
            price: "299",
            subTotalPrice: "",
            memo: "",
          },
          {
            category: "SD1",
            content: "",
            qty: "1",
            price: "499",
            subTotalPrice: "",
            memo: "",
          }
        ]
      }
    ],

    // ---------------------------------------------------------
    payInfo: {
      totalDiscount: "99",
      subTotal: "99",
      tax: "9",
      total: "999",
      tradingLocation: "", // 交貨地點
      tradingDate: "",  // 交貨日期
      payWay: [
        { label: "訂製同時付總金額", value: "10" },
        { label: "交貨同時付總金額", value: "60" },
        { label: "按裝同時付總金額", value: "80" },
        { label: "接電同時付總金額", value: "100" },
      ]
    },
    // ---------------------------------------------------------
    signature: {
      manager: "王小明",
      director: "李小華",
      attn: "林小善",
    },
    // ---------------------------------------------------------
    memoArr: [
      "備註一備註一備註一備註一",
      "備註二備註二備註二備註二備註二備註二",
      "備註三備註三備註三備註三備註三備註三備註三備註三",
    ],
    quoteRangeArr: [
      "報價範圍一報價範圍一報價範圍一",
      "報價範圍二報價範圍二報價範圍二報價範圍二",
      "報價範圍三",
    ],
  },
}



function checkData(projectData: TlegacyQuotationList): void {
  for (const [key, value] of Object.entries(projectData)) {
    if (key !== value.basicInfo.quotationId) {
      // 建立資料時quotationId必須要與其所屬物件的key相符
      throw new Error(`quotationId of project ${key} does not match its key`);
    }
  }
}

checkData(fakeLegacyQuotationDataList)

export type { TlegacyQuotation , TlegacyQuotationList }
export { fakeLegacyQuotationDataList, emptyLegacyQuotation }




const emptyLegacyQuotation: TlegacyQuotation = {
  clientId: "", // 客戶id 用來關聯客戶資料
  // ---------------------------------------------------------
  basicInfo: {
    quotationId: "",
    tempQuotationAging: 99,
    date: "", // 時間是new date()，要在建立新報價單時處理，如果使用者操作時剛好過了一天，時間就不對了
    constructionName: "",
    undertaker: "",
    totalDiscount: 99.99,
    tempDoorQty: 99,
    tempBudgetAmount: 999999,
    constructionCounty: "",
    constructionDistrict: "",
    constructionAddress: "",
    trackingStatus: "", // 追蹤狀態 輸入字串
    siteProgress: "", //  工地進度 輸入字串
  },
  // ---------------------------------------------------------
  mainProductArr: [
    {
      idNumber: "",
      category: "",
      series: "",
      doorType: "",
      L: "",
      W: "",
      h: "",
      B: "",
      area: "",
      cai: "",
      material: "",
      surface: "",
      doorRail: "",
      doorRailIcon: "",
      horsepower: "",
      qty: "",
      unitPrice: "",
      priceSubTotal: "",
      memo: "",
      ejectionDoor: false,
      typhoonProof: false,
      part: []
    }
  ],
  // ---------------------------------------------------------
  payInfo: {
    totalDiscount: "",
    subTotal: "",
    tax: "",
    total: "",
    tradingLocation: "", // 交貨地點
    tradingDate: "",  // 交貨日期
    payWay: []
  },
  // ---------------------------------------------------------
  signature: {
    manager: "",
    director: "",
    attn: "",
  },
  // ---------------------------------------------------------
  memoArr: [],
  quoteRangeArr: [],
}

