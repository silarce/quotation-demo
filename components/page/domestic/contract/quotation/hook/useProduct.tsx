import {
  Dispatch, SetStateAction, ChangeEvent,
  useState, useMemo
} from "react"


// global gear
import Input03 from "components/global/gear/input/input03"
import Select03, { Toption } from "components/global/gear/select/select03"

// data type
import { fakeComponent, fakeAccessory } from "meta/fakeData/fakeQuotation"
import type { Tcomponent, Tproduct } from "meta/fakeData/fakeQuotation"


// ======================================================
// type
interface TuseProduct {
  theadList: TtheadItem[]
  setTheadList: Dispatch<SetStateAction<TtheadItem[]>>
  productList: Tproduct[]
  setProductList: Dispatch<SetStateAction<Tproduct[]>>
  addProduct: () => void
  deleteProduct: (index: number) => void
  copyProduct: (index: number) => void
  dndBody: JSX.Element[][]
  activeRow: number
  setActiveRow: Dispatch<SetStateAction<number>>
}

interface TtheadItem {
  id: Exclude<(keyof Tproduct), "component" | "accessory">
  label: string
  width: string
  options?: Toption[]
}


export default function useProduct(productListOri?: Tproduct[]): TuseProduct {
  // dnd head的狀態，也是資料分類目錄
  const [theadList, setTheadList] = useState<TtheadItem[]>(theadListOri)

  // 將資料轉為狀態
  const [productList, setProductList] = useState<Tproduct[]>(productListOri || [])

  // 被選中的row
  const [activeRow, setActiveRow] = useState(-1)

  // 這個部分好像可以分出去，直接在productList執行
  // 要接API時再說吧
  const dndBody = useMemo(() => {
    return productList.map((row, pIndex) => {
      return theadList.map((column) => {
        const { id, options } = column
        return (
          options
            ? selectCellCreator({ pIndex, id, productList, setProductList, options })
            : inputCellCreator({ pIndex, id, productList, setProductList })
        )
      })
    })
  }, [productList, theadList])

  const addProduct = () => {
    productList.push(JSON.parse(JSON.stringify(emptyProduct)))
    // productList.push({ ...emptyProduct })
    setProductList([...productList])
  }
  const deleteProduct = (index: number) => {
    productList.splice(index, 1)
    setActiveRow(-1)
    setProductList([...productList])
  }
  const copyProduct = (index: number) => {
    productList.splice(index, 0, { ...productList[index] })
    setProductList([...productList])
  }
  // ===============================================================


  return {
    theadList, setTheadList,
    productList, setProductList, addProduct, deleteProduct, copyProduct,
    dndBody, activeRow, setActiveRow

  }
}

// =============================================================
// =============================================================
// =============================================================
// 要帶進thead或body的東西

// 關於options
// 未來有需要時再改成 memoList的作法
const quoteTypeOptions: Toption[] = [
  { value: "捲門", label: "捲門" },
  { value: "特大號捲門", label: "特大號捲門" },
  { value: "大捲門", label: "大捲門" },
]
const materialOptions: Toption[] = [
  { value: "不鏽鋼304#", label: "不鏽鋼304#" },
  { value: "烤漆鐵", label: "烤漆鐵" },
  { value: "鍍鋅鋼", label: "鍍鋅鋼" },
  { value: "合金鋼", label: "合金鋼" },
  { value: "耐候鋼", label: "耐候鋼" },
  { value: "鋁合金", label: "鋁合金" },
  { value: "陽極鋁合金", label: "陽極鋁合金" },
]
const surfaceOptions: Toption[] = [
  { value: "AA", label: "AA" },
  { value: "BA", label: "BA" },
  { value: "CC", label: "CC" },
  { value: "DS", label: "DS" },
]
const memoOptions: Toption[] = [
  { value: "防颱", label: "防颱" },
  { value: "耐候", label: "耐候" },
  { value: "耐酸腐蝕", label: "耐酸腐蝕" },
]


const theadListOri: TtheadItem[] = [
  { id: "discount", label: "折數", width: "75px" },
  { id: "project", label: "項目", width: "60px" },
  {
    id: "quoteType", label: "報價別", width: "105px",
    options: quoteTypeOptions
  },
  { id: "L", label: "L", width: "60px" },
  { id: "W", label: "W", width: "60px" },
  { id: "H", label: "H", width: "60px" },
  { id: "B", label: "B", width: "60px" },
  { id: "area", label: "面積", width: "60px" },
  { id: "cai", label: "才數", width: "75px" },
  { id: "doorType", label: "門型", width: "75px" },
  {
    id: "material", label: "材料", width: "120px",
    options: materialOptions
  },
  {
    id: "surface", label: "表面", width: "55px",
    options: surfaceOptions
  },
  { id: "horsepower", label: "馬力", width: "60px" },
  { id: "qty", label: "數量", width: "43px" },
  { id: "unitPrice", label: "單價", width: "84px" },
  { id: "subTotal", label: "複價", width: "84px" },
  {
    id: "memo", label: "備註", width: "90px",
    options: memoOptions
  },
]



// ====================================================

const emptyProduct: Tproduct = {
  discount: "",
  project: "",
  quoteType: "",
  L: "",
  W: "",
  H: "",
  B: "",
  area: "",
  cai: "",
  doorType: "",
  material: "",
  surface: "",
  horsepower: "",
  qty: "",
  unitPrice: "",
  subTotal: "",
  memo: "",
  component: JSON.parse(JSON.stringify(fakeComponent)),
  accessory: JSON.parse(JSON.stringify(fakeAccessory))
}


// ================================

// pIndex為上層的index
const inputCellCreator = ({ pIndex, id, productList, setProductList }:
  {
    pIndex: number
    id: Exclude<(keyof Tproduct), "component" | "accessory">
    // id: keyof Tproduct
    productList: Tproduct[]
    setProductList: Dispatch<SetStateAction<Tproduct[]>>
  }) => {

  const stateValue = productList[pIndex][id]
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProductList(list => {
      list[pIndex][id] = e.target.value
      return [...list]
    })
  }

  return (
    <Input03 key={`${pIndex}${id}`}
      {...{ stateValue, onChange }} />
  )
} //  inputCellCreator


// =============
// pIndex為上層的index
const selectCellCreator = (
  { pIndex, id, productList, setProductList, options }:
    {
      pIndex: number
      id: Exclude<(keyof Tproduct), "component" | "accessory">
      productList: Tproduct[]
      setProductList: Dispatch<SetStateAction<Tproduct[]>>
      options: Toption[]
    }) => {

  const stateValue = productList[pIndex][id]
  const onChange = (option: Toption | null) => {
    if (!option) return
    const { value } = option
    setProductList(list => {
      list[pIndex][id] = value
      return [...list]
    })
  }
  return <Select03 {...{
    stateValue, options, onChange,
  }} />
} //  selectCellCreator




export type { TuseProduct, TtheadItem, Tproduct }






