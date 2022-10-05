import { Tproduct } from "fakeDatabase/domestic/quotation/fakeQuotationList"


import iconDoorRail75 from "public/image/icon/doorRail/doorRail75.svg"
import iconDoorRail60 from "public/image/icon/doorRail/doorRail60.svg"

interface TrecordProduct
  extends Omit<Tproduct,
    "component" | "accessory" |
    "quoteType" | "material" | "surface" | "doorRail" | "memo"
  > {
  action: string
  quoteType: string
  material: string
  surface: string
  doorRail: {
    label: string
    icon: string
  }
  memo: string
}





interface TchangeListItem {
  id: string // 編號
  date: string // 日期
  priceChange: number // 追加追減項目
  remark: string // 備註
  product: TrecordProduct[]
}


interface TchangeList {
  [key: string]: TchangeListItem
}


interface TchangeRecord {
  quotationId: string
  list: TchangeList
}


interface TprodChangingRecordList {
  [key: string]: TchangeRecord
}


const fakeProduct01: TrecordProduct = {
  action: "add",
  discount: "100.00",
  project: "SD1",
  quoteType: "不是捲門",
  L: "516",
  W: "230",
  H: "230",
  B: "45",
  area: "14.19",
  cai: "15400.52", //才數
  doorType: "SJ-30287", //門型
  material: "不鏽鋼304#",
  surface: "BA",
  doorRail: {
    label: "60",
    icon: iconDoorRail60.src
  },
  horsepower: "1/3HP",
  qty: "1",
  unitPrice: "158610",
  subTotal: "158610",
  memo: "防颱防颱",
  ejectionDoor: false,
}

const fakeProduct02: TrecordProduct = {
  action: "remove",
  discount: "100.00",
  project: "SD1",
  quoteType: "捲門",
  L: "516",
  W: "230",
  H: "230",
  B: "45",
  area: "14.19",
  cai: "15400.52", //才數
  doorType: "SJ-30287", //門型
  material: "不鏽鋼304#",
  surface: "BA",
  doorRail: {
    label: "75",
    icon: iconDoorRail75.src
  },
  horsepower: "1/3HP",
  qty: "1",
  unitPrice: "158610",
  subTotal: "158610",
  memo: "防颱防颱",
  ejectionDoor: true,
}


const fakeChangeList: TchangeList = {
  "M-1110101-01": {
    id: "M-1110101-01",
    date: "111-02-22",
    priceChange: 100000,
    remark: "備註一備註一備註一備註一備註一備註一備註一",
    product: [
      fakeProduct01, fakeProduct01, fakeProduct02
    ]
  },
  "M-1110101-02": {
    id: "M-1110101-02",
    date: "111-02-23",
    priceChange: -100000,
    remark: "備註二備註二備註二備註二備註二備註二",
    product: [
      fakeProduct01, fakeProduct01, fakeProduct01
    ]
  },
  "M-1110101-03": {
    id: "M-1110101-03",
    date: "111-02-25",
    priceChange: 100000,
    remark: "備註三備註三備註三備註三備註三備註三備註三備註三",
    product: [
      fakeProduct01, fakeProduct02, fakeProduct01
    ]
  },
  "M-1110101-04": {
    id: "M-1110101-04",
    date: "111-03-02",
    priceChange: 100000,
    remark: "備註備註備註備註備註",
    product: [
      fakeProduct02, fakeProduct01
    ]
  },
  "M-1110101-05": {
    id: "M-1110101-05",
    date: "111-03-15",
    priceChange: -100000,
    remark: "很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註很多備註",
    product: [
      fakeProduct02
    ]
  },
}




const fakeProdChangingRecordList: TprodChangingRecordList = {
  "S-110211-01": {
    quotationId: "S-110211-01",
    list: fakeChangeList
  },
  "S-110211-02": {
    quotationId: "S-110211-02",
    list: fakeChangeList
  },
  "S-110211-03": {
    quotationId: "S-110211-03",
    list: fakeChangeList
  },
  "S-110211-04": {
    quotationId: "S-110211-04",
    list: fakeChangeList
  },
  "S-110211-05": {
    quotationId: "S-110211-05",
    list: fakeChangeList
  },
  "S-110211-06": {
    quotationId: "S-110211-06",
    list: fakeChangeList
  },
  "S-110211-07": {
    quotationId: "S-110211-07",
    list: fakeChangeList
  },
  "S-110211-08": {
    quotationId: "S-110211-08",
    list: fakeChangeList
  },
  "S-110211-09": {
    quotationId: "S-110211-09",
    list: fakeChangeList
  },
  "S-110211-010": {
    quotationId: "S-110211-010",
    list: fakeChangeList
  },
  "S-110211-011": {
    quotationId: "S-110211-011",
    list: fakeChangeList
  },
  "S-110211-012": {
    quotationId: "S-110211-012",
    list: fakeChangeList
  },
}




export type {
  TprodChangingRecordList,
  TchangeRecord,
  TchangeListItem,
  TrecordProduct
}
export { fakeProdChangingRecordList }





