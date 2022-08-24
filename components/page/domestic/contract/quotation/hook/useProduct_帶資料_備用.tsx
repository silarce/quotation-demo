import {
  Dispatch, SetStateAction, ChangeEvent,
  useState, useMemo
} from "react"


// global gear
import Input03 from "components/global/gear/input/input03"
import Select03, { Toption } from "components/global/gear/select/select03"
// ======================================================
interface TuseProduct {
  theadList: TtheadItem[]
  setTheadList: Dispatch<SetStateAction<TtheadItem[]>>
  productList: TfakeProduct[]
  addProduct: () => void
  deleteProduct: (index: number) => void
  copyProduct: (index: number) => void
  dndBody: JSX.Element[][]
}



export default function UseProduct(): TuseProduct {
  // dnd head的狀態，也是資料分類目錄
  const [theadList, setTheadList] = useState<TtheadItem[]>(theadListOri)

  // 原始資料，接上api前還用不到
  const [productList, setProductList] = useState(fakeProductList)


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
    productList.push({ ...emptyProduct })
    setProductList([...productList])
  }
  const deleteProduct = (index: number) => {
    productList.splice(index, 1)
    setProductList([...productList])
  }
  const copyProduct = (index: number) => {
    productList.splice(index, 0, { ...productList[index] })
    setProductList([...productList])
  }


  return {
    theadList, setTheadList,
    productList, addProduct, deleteProduct, copyProduct,
    dndBody
  }
}

// =============================================================
// =============================================================
// =============================================================
interface TtheadItem {
  id: keyof TfakeProduct
  label: string
  width: string
  options?: Toption[]
}

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
    id: "quoteType", label: "報價別", width: "97px",
    options: quoteTypeOptions
  },
  { id: "L", label: "L", width: "60px" },
  { id: "W", label: "W", width: "60px" },
  { id: "H", label: "H", width: "60px" },
  { id: "B", label: "B", width: "60px" },
  { id: "area", label: "面積", width: "60px" },
  { id: "cai", label: "才數", width: "60px" },
  { id: "doorType", label: "門型", width: "60px" },
  {
    id: "material", label: "材料", width: "120px",
    options: materialOptions
  },
  {
    id: "surface", label: "表面", width: "45px",
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
    discount: "86.43",
    project: "SD2",
    quoteType: "捲門",
    L: "416",
    W: "100",
    H: "330",
    B: "20",
    area: "22.66",
    cai: "200.87",
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

const emptyProduct = {
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
}


// ================================

// pIndex為上層的index，cIndex為下層的index
const inputCellCreator = ({ pIndex, id, productList, setProductList }:
  {
    pIndex: number
    id: keyof TfakeProduct
    productList: TfakeProduct[]
    setProductList: Dispatch<SetStateAction<TfakeProduct[]>>
  }) => {

  const stateValue = productList[pIndex][id]
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProductList(list => {
      list[pIndex][id] = e.target.value
      return [...list]
    })
  }
  // const placeholder = ""

  return (
    <Input03 key={`${pIndex}${id}`}
      {...{ stateValue, onChange }} />
  )
} //  inputCellCreator


// =============
// pIndex為上層的index，cIndex為下層的index
const selectCellCreator = (
  { pIndex, id, productList, setProductList, options }:
    {
      pIndex: number
      id: keyof TfakeProduct
      productList: TfakeProduct[]
      setProductList: Dispatch<SetStateAction<TfakeProduct[]>>
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



export type { TuseProduct, TtheadItem, TfakeProduct }