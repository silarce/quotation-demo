import {
  Dispatch, SetStateAction,
  useState, useMemo
} from "react"




interface TuseProduct {
  theadList: TtheadItem[]
  setTheadList: Dispatch<SetStateAction<TtheadItem[]>>
  dndProductList: string[][]
  setDndProductList: Dispatch<SetStateAction<string[][]>>
}

export default function UseProduct(): TuseProduct {
  // dnd用的狀態
  const [theadList, setTheadList] = useState(theadListOri)


  // 原始資料，接上api前還用不到
  const [productList, setProductList] = useState(fakeProductList)

  // 修改格式後的資料，用於dnd
  const [dndProductList, setDndProductList]
    = useState(dndListCreator(productList))




  return {
    theadList, setTheadList,
    dndProductList, setDndProductList
  }
}

// =============================================================
// =============================================================
// =============================================================
interface TtheadItem {
  id: number
  label: string
  width: string
}
// 因為要操作陣列，所以id限定為數字或是數值
// 不過用數值會比較方便
// id不可以是0，不然第一個dndItem會不能拖動
const theadListOri: TtheadItem[] = [
  { id: 1, label: "折數", width: "75px" },
  { id: 2, label: "項目", width: "60px" },
  { id: 3, label: "報價別", width: "97px" },
  { id: 4, label: "L", width: "60px" },
  { id: 5, label: "W", width: "60px" },
  { id: 6, label: "H", width: "60px" },
  { id: 7, label: "B", width: "60px" },
  { id: 8, label: "面積", width: "60px" },
  { id: 9, label: "才數", width: "60px" },
  { id: 10, label: "門型", width: "60px" },
  { id: 11, label: "材料", width: "120px" },
  { id: 12, label: "表面", width: "45px" },
  { id: 13, label: "馬力", width: "60px" },
  { id: 14, label: "數量", width: "43px" },
  { id: 15, label: "單價", width: "84px" },
  { id: 16, label: "複價", width: "84px" },
  { id: 17, label: "備註", width: "90px" },
]


// ====================================================
// fake data

interface TfakeProduct {
  discount: string  // 折數
  project: string  // 項目
  quoteType: string  // 報價別
  L: string  // L
  W: string  // W
  H: string  // H
  B: string  // B
  area: string  // 面積
  cai: string  // 才數 // 只有台灣在用的單位，沒有英文譯名
  doorType: string  // 門型
  material: string  // 材料
  surface: string  // 表面
  horsepower: string  // 馬力
  qty: string  // 數量
  unitPrice: string  // 單價
  subTotal: string  // 複價
  memo: string  // 備註
}


const fakeProductList: TfakeProduct[] = [
  {
    discount: "100.00",
    project: "SD1",
    quoteType: "捲門捲門捲",
    L: "516",
    W: "230",
    H: "230",
    B: "45",
    area: "14.19",
    cai: "154.52",
    doorType: "SJ-302",
    material: "不鏽鋼304#",
    surface: "BA",
    horsepower: "1/3HP",
    qty: "1",
    unitPrice: "158610",
    subTotal: "158610",
    memo: "防颱防颱"
  },
  {
    discount: "100.00",
    project: "SD1",
    quoteType: "捲門捲門捲",
    L: "516",
    W: "230",
    H: "230",
    B: "45",
    area: "14.19",
    cai: "154.52",
    doorType: "SJ-302",
    material: "不鏽鋼304#",
    surface: "BA",
    horsepower: "1/3HP",
    qty: "1",
    unitPrice: "158610",
    subTotal: "158610",
    memo: "防颱防颱"
  },
]

const dndListCreator = (list: TfakeProduct[]) => {
  return list.map((item) => {
    const {
      discount, project, quoteType, L, W,
      H, B, area, cai, doorType,
      material, surface, horsepower, qty, unitPrice,
      subTotal, memo
    } = item
    return [discount, project, quoteType, L, W,
      H, B, area, cai, doorType,
      material, surface, horsepower, qty, unitPrice,
      subTotal, memo]
  })
}







export type { TuseProduct, TtheadItem, TfakeProduct }
// export { theadListOri as theadList }