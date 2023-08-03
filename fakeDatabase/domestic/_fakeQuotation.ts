import { format, subYears } from 'date-fns';

// 這些是門軌的圖片，未來可能會用到
import iconDoorRail_sj302_30 from 'public/image/fakeDB/doorRail/normal/SJ302_30.svg';
import iconDoorRail_sj302_75_30t from 'public/image/fakeDB/doorRail/antiTyphoon/SJ302_75_30t.svg';
import iconDoorRail_sj302_90_30t from 'public/image/fakeDB/doorRail/antiTyphoon/SJ302_90_30t.svg';
import iconDoorRail_sj302_95_30t from 'public/image/fakeDB/doorRail/antiTyphoon/SJ302_95_30t.svg';
import iconDoorRail_sj302_95_45t from 'public/image/fakeDB/doorRail/antiTyphoon/SJ302_95_45t.svg';

// doorType: string[] // 封裝時再從主產品列表中取得資料

// contactPhone: string
// contactName: string
// clientName: string

type Tquotation = {
  basicInfo: {
    quotationId: string; //報價單Id // 報價編號
    tempQuotationAging: number; // 報價時效 天數 顯示`${quotationAging}天內`
    date: string; //報價日期
    constructionName: string; // 工程名稱
    undertaker: string; //承辦人
    totalDiscount: number; // 總折數
    tempDoorQty: number; // 橖數
    tempBudgetAmount: number; //合約金額
    constructionCounty: string; // 工程地點城市
    constructionDistrict: string; // 工程地點行政區
    constructionAddress: string; // 工程地點剩餘地址
    trackingStatus: string; // 追蹤狀態 輸入字串
    siteProgress: string; // 工地進度 輸入字串
    quoStatus: '預算' | '投標' | '發包' | '合約'; // 報價單狀態，會使報價單出現在不同的頁面
    // doorType :string // doorType可能是複數，還不確定怎麼不處理
    approvalStatus: '待審核' | '審核中' | '審核完成'; // 審核狀態
  };
  // ---------------------------------------------------------
  mainProductArr: {
    discount: string;
    category: string; // 項目
    series: string; // 報價別 // 下拉式選單
    seriesType: 'rollerDoor' | 'normal'; // 報價別類型 // 捲門或非捲門
    L: string;
    W: string;
    h: string;
    B: string; // 下拉式選單
    doorType: string; // 下拉式選單
    material: string; // 下拉式選單
    surface: string; // 下拉式選單
    doorRail: string; // 下拉式選單
    doorRailIcon: string; //門軌的圖片
    horsepower: string; // 下拉式選單
    qty: string;
    memo: string;
    ejectionDoor: boolean;
    typhoonProof: boolean;
    unitWeight: string; // 單位重量
    part: {
      partType: string;
      partName: string;
      partId: string;
      specification: string;
      material: string;
      basicWeight: string | undefined;
      unit: 'm2' | 'M' | '組' | '套' | '支' | string;
      qty: string | undefined; // 若是undefined就是從mainProduct的資料運算出來
      listPrice: string; // 牌價
    }[];
  }[];
  // ---------------------------------------------------------
  accessory: {
    accessoryId: string;
    name: string;
    unit: 'M' | '組' | string;
    qty: number;
    listPrice: number;
    totalListPrice: number;
    price: number;
    totalPrice: number;
  }[];
  // ---------------------------------------------------------
  payInfo: {
    tradingLocation: string; // 交貨地點
    tradingDate: string; // 交貨日期
    deposit: string; // 訂製同時付總金額
    deliveryPayment: string; // 交貨同時付總金額
    installedPayment: string; // 按裝完成付總金額
    eleConnectPayment: string; // 接電使用付總金額
  };
  // ---------------------------------------------------------
  signature: {
    manager: string; // 經理
    director: string; // 主管
    attn: string; // 經辦
  };
  // ---------------------------------------------------------
  //
  clientId: string; // 客戶id 用來關聯客戶資料以取得客戶名稱、聯絡人、電話那些資料
  memoArr: string[];
  quoteRangeArr: string[];
  //
  // ---------------------------------------------------------
  tempRecord: {
    date: string;
    discount: string;
    doorQty: string;
    budgetAmount: string;
    Remark: string;
  }[];
};

type TquotationList = {
  [key: string]: Tquotation;
};

const fakeQuotationDataList: TquotationList = {
  'S-110211-01': {
    // ---------------------------------------------------------
    basicInfo: {
      quotationId: 'S-110211-01',
      tempQuotationAging: 10,
      date: '110-02-02',
      constructionName: '台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程',
      undertaker: '陳小明小華',
      totalDiscount: 99.99,
      tempDoorQty: 99,
      tempBudgetAmount: 999999,
      constructionCounty: '臺北市',
      constructionDistrict: '大安區',
      constructionAddress: '什麼什麼路',
      trackingStatus: '', // 追蹤狀態 輸入字串
      siteProgress: '', //  工地進度 輸入字串
      quoStatus: '預算',
      approvalStatus: '待審核',
    },
    // ---------------------------------------------------------
    mainProductArr: [
      {
        discount: '100',
        category: 'SD1',
        series: '不是捲門',
        L: '3',
        W: '0',
        h: '2',
        B: '3.5',
        doorType: 'SJ-302', //門型
        material: 'SST304#',
        surface: '2B',
        doorRail: 'sj302_30',
        doorRailIcon: iconDoorRail_sj302_30.src,
        horsepower: '1/4 HP',
        qty: '1',
        memo: '防颱',
        ejectionDoor: false,
        typhoonProof: false,
        unitWeight: '22',
        seriesType: 'normal',
        part: [
          {
            partType: 'SJ00',
            partName: '捲門片',
            partId: 'SJ0000A0000',
            specification: '規格001',
            material: 'SST 304',
            basicWeight: '99.99',
            unit: 'm2',
            listPrice: '499',
            qty: undefined,
          },
          {
            partType: 'SJ00',
            partName: '馬達機',
            partId: 'SJ0000A0000',
            specification: '規格002',
            material: 'SST 304',
            basicWeight: '99.99',
            unit: '組',
            listPrice: '499',
            qty: '1',
          },
        ],
      },
    ],
    // ---------------------------------------------------------
    accessory: [
      {
        accessoryId: 'SJ0A09',
        name: '鋁合金障礙感知器',
        unit: 'M',
        qty: 1,
        listPrice: 999,
        totalListPrice: 999,
        price: 999,
        totalPrice: 999,
      },
    ],
    // ---------------------------------------------------------
    payInfo: {
      tradingLocation: '', // 交貨地點
      tradingDate: '', // 交貨日期
      deposit: '', // 訂製同時付總金額
      deliveryPayment: '', // 交貨同時付總金額
      installedPayment: '', // 按裝完成付總金額
      eleConnectPayment: '', // 接電使用付總金額
    },
    // ---------------------------------------------------------
    signature: {
      manager: '王小明',
      director: '李小華',
      attn: '林小善',
    },
    // ---------------------------------------------------------
    //
    clientId: 'S00001', // 客戶id 用來關聯客戶資料
    memoArr: [
      '備註一備註一備註一備註一',
      '備註二備註二備註二備註二備註二備註二',
      '備註三備註三備註三備註三備註三備註三備註三備註三',
    ],
    quoteRangeArr: ['報價範圍一報價範圍一報價範圍一', '報價範圍二報價範圍二報價範圍二報價範圍二', '報價範圍三'],
    //
    // ---------------------------------------------------------
    // tempRecord 暫時先這樣，之後要改用編號關聯其他的資料
    tempRecord: [
      {
        date: '111-01-02',
        discount: '88.88',
        doorQty: '88',
        budgetAmount: '888,888',
        Remark: '備註備註備註備註',
      },
      {
        date: '111-01-01',
        discount: '77.77',
        doorQty: '77',
        budgetAmount: '777,777',
        Remark: '備註備註備註備註',
      },
    ],
  },
};

function checkData(projectData: TquotationList): void {
  for (const [key, value] of Object.entries(projectData)) {
    if (key !== value.basicInfo.quotationId) {
      // 建立資料時quotationId必須要與其所屬物件的key相符
      throw new Error(`quotationId of project ${key} does not match its key`);
    }
  }
}

checkData(fakeQuotationDataList);

export type { Tquotation, TquotationList };
export { fakeQuotationDataList, emptyQuotation };

const emptyQuotation: Tquotation = {
  // ---------------------------------------------------------
  basicInfo: {
    quotationId: '',
    tempQuotationAging: 99,
    date: '', // 時間是new date()，要在建立新報價單時處理，如果使用者操作時剛好過了一天，時間就不對了
    constructionName: '',
    undertaker: '',
    totalDiscount: 99.99,
    tempDoorQty: 99,
    tempBudgetAmount: 999999,
    constructionCounty: '',
    constructionDistrict: '',
    constructionAddress: '',
    trackingStatus: '', // 追蹤狀態 輸入字串
    siteProgress: '', //  工地進度 輸入字串
    quoStatus: '預算',
    approvalStatus: '待審核',
  },
  // ---------------------------------------------------------
  mainProductArr: [
    {
      discount: '100',
      category: '',
      series: '',
      L: '0',
      W: '0',
      h: '0',
      B: '0', //送到class裡面會被轉為"autoCalc"
      doorType: '',
      material: '',
      surface: '',
      doorRail: '',
      doorRailIcon: '',
      horsepower: '',
      qty: '1',
      memo: '',
      ejectionDoor: false,
      typhoonProof: false,
      unitWeight: '22',
      seriesType: 'normal',
      part: [
        {
          partType: 'SJ00',
          partName: '捲門片',
          partId: 'SJ0000A0000',
          specification: '規格001',
          material: 'SST 304',
          basicWeight: '99.99',
          unit: 'm2',
          listPrice: '499',
          qty: undefined,
        },
        {
          partType: 'SJ00',
          partName: '馬達機',
          partId: 'SJ0000A0000',
          specification: '規格001',
          material: 'SST 304',
          basicWeight: '99.99',
          unit: '組',
          listPrice: '499',
          qty: '1',
        },
      ],
    },
  ],
  // ---------------------------------------------------------
  accessory: [
    {
      accessoryId: 'SJ0A09',
      name: '鋁合金障礙感知器',
      unit: 'M',
      qty: 1,
      listPrice: 999,
      totalListPrice: 999,
      price: 999,
      totalPrice: 999,
    },
  ],
  // ---------------------------------------------------------
  payInfo: {
    tradingLocation: '', // 交貨地點
    tradingDate: '', // 交貨日期
    deposit: '', // 訂製同時付總金額
    deliveryPayment: '', // 交貨同時付總金額
    installedPayment: '', // 按裝完成付總金額
    eleConnectPayment: '', // 接電使用付總金額
  },
  // ---------------------------------------------------------
  signature: {
    manager: '',
    director: '',
    attn: '',
  },
  // ---------------------------------------------------------
  //
  clientId: '', // 客戶id 用來關聯客戶資料
  memoArr: [],
  quoteRangeArr: [],
  //
  // ---------------------------------------------------------
  // tempRecord 暫時先這樣，之後要改用編號關聯其他的資料
  tempRecord: [
    {
      date: '111-01-02',
      discount: '88.88',
      doorQty: '88',
      budgetAmount: '888,888',
      Remark: '備註備註備註備註',
    },
    {
      date: '111-01-01',
      discount: '77.77',
      doorQty: '77',
      budgetAmount: '777,777',
      Remark: '備註備註備註備註',
    },
  ],
};

// const fakeProjectData: Tproject = {
//   "S-110211-01": {
//     quotationId: "S-110211-01",
//     tempQuotationAging: 10,
//     date: "110-02-02",
//     projectName: "台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程",
//     undertaker: "陳小明小華",
//     discount: 99.99,
//     tempDoorQty: 99,
//     tempBudgetAmount: 999999,
//     projectCounty: "臺北市",
//     projectDistrict: "大安區",
//     projectAddress: "什麼什麼路",
//     trackingStatus: "",
//     siteProgress: "",
//     quoStatus: "預算",
//     clientId: "S00001",
//     tempRecord: [
//       {
//         date: "111-01-02",
//         discount: "88.88",
//         doorQty: "88",
//         budgetAmount: "888,888",
//         Remark: "備註備註備註備註",
//       },
//       {
//         date: "111-01-01",
//         discount: "77.77",
//         doorQty: "77",
//         budgetAmount: "777,777",
//         Remark: "備註備註備註備註",
//       },
//     ]
//   },
//   "S-110211-02": {
//     quotationId: "S-110211-02",
//     tempQuotationAging: 10,
//     date: "110-02-05",
//     projectName: "台灣東西南北雜衣(股)公司~東拼西湊大拍賣企劃",
//     undertaker: "陳小明小華",
//     discount: 88.88,
//     tempDoorQty: 88,
//     tempBudgetAmount: 888888,
//     projectCounty: "桃園市",
//     projectDistrict: "楊梅區",
//     projectAddress: "什麼什麼路",
//     trackingStatus: "",
//     siteProgress: "",
//     quoStatus: "預算",
//     clientId: "S00002",
//     tempRecord: [
//       {
//         date: "111-01-02",
//         discount: "88.88",
//         doorQty: "88",
//         budgetAmount: "888,888",
//         Remark: "備註備註備註備註",
//       },
//       {
//         date: "111-01-01",
//         discount: "77.77",
//         doorQty: "77",
//         budgetAmount: "777,777",
//         Remark: "備註備註備註備註",
//       },
//     ]
//   },
//   "S-110211-03": {
//     quotationId: "S-110211-03",
//     tempQuotationAging: 10,
//     date: "110-03-12",
//     projectName: "有間客棧大飯店五百周年慶暨北海分館開幕儀式企劃",
//     undertaker: "陳小明小華",
//     discount: 77.77,
//     tempDoorQty: 77,
//     tempBudgetAmount: 777777,
//     projectCounty: "新竹市",
//     projectDistrict: "北區",
//     projectAddress: "什麼什麼路",
//     trackingStatus: "",
//     siteProgress: "",
//     quoStatus: "預算",
//     clientId: "S00003",
//     tempRecord: [
//       {
//         date: "111-01-02",
//         discount: "88.88",
//         doorQty: "88",
//         budgetAmount: "888,888",
//         Remark: "備註備註備註備註",
//       },
//       {
//         date: "111-01-01",
//         discount: "77.77",
//         doorQty: "77",
//         budgetAmount: "777,777",
//         Remark: "備註備註備註備註",
//       },
//     ]
//   },
// }
