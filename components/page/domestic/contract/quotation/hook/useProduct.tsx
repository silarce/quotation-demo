import {
  ChangeEvent, MouseEvent,
  useState,
} from "react"


// global gear

import { Toption } from "components/global/gear/select/select03"

// data type
import type { Tproduct } from "fakeDatabase/domestic/quotation/fakeQuotationList"
import {
  TprodCellKey,
  emptyProduct, prodCellConfigOri
} from "fakeDatabase/domestic/quotation/fakeQuotProductionList"

// options
import {
  optionsCreator_quoteType,
  optionsCreator_material,
  optionsCreator_surface,
  optionsCreator_memo,
} from "fakeDatabase/options/options"


const _ = require("lodash")

// ======================================================
// type
interface TtheadItem {
  id: TprodCellKey
  label: string
  width: string
  options?: Toption[]
}
interface TtheadItemObjList {
  [key: string]: TtheadItem
}


// ======================================================
// data
const pordCellConfig = prodCellConfigOri()
let { keyList: prodKeyList, cellConfig } = pordCellConfig

const theadCellConfigObjList = cellConfig as TtheadItemObjList

theadCellConfigObjList.quoteType.options = optionsCreator_quoteType()
theadCellConfigObjList.material.options = optionsCreator_material()
theadCellConfigObjList.surface.options = optionsCreator_surface()
theadCellConfigObjList.memo.options = optionsCreator_memo()

// ============================================================
// ============================================================
// ============================================================


export default function useProduct(
  productListOri?: Tproduct[],
  disabled: boolean = false
) {

  // dnd head的狀態，也是資料分類目錄
  const [theadIndex, setTheadIndex] = useState(prodKeyList)

  // 將資料轉為狀態
  const [productList, setProductList] = useState<Tproduct[]>(productListOri || [])

  // 被選中的row
  const [activeRow, setActiveRow] = useState(-1)


  const addProduct = () => {
    productList.push(JSON.parse(JSON.stringify(emptyProduct)))
    setProductList([...productList])
  }
  const deleteProduct = (e: MouseEvent, index: number) => {
    e.stopPropagation()
    productList.splice(index, 1)
    setActiveRow(-1)
    setProductList([...productList])
  }

  const copyProduct = (index: number) => {
    productList.splice(index, 0, { ...productList[index] })
    setProductList([...productList])
  }

  const onInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    pIndex: number,
    key: TprodCellKey
  ) => {
    if (key === "ejectionDoor") return
    setProductList(list => {
      list[pIndex][key] = e.target.value
      return [...list]
    })
  }

  const onSelChange = (
    option: Toption | null,
    pIndex: number,
    key: TprodCellKey
  ) => {
    if (!option) return 
    const { value } = option
    if (key === "ejectionDoor") return
    const { quoteTypeType } = option
    if (quoteTypeType) {
      setProductList(list => {
        list[pIndex]["quoteTypeType"] = quoteTypeType
        if (quoteTypeType !== "rollerDoor") list[pIndex]["ejectionDoor"] = false
        return [...list]
      })
    }

    setProductList(list => {
      list[pIndex][key] = value
      return [...list]
    })
  }

  const onCheckboxClick = (
    pIndex: number,
    key: TprodCellKey
  ) => {
    if (key !== "ejectionDoor") return
    productList[pIndex][key] = !(productList[pIndex][key])
    setProductList([...productList])
  }


  return {
    theadIndex, setTheadIndex,
    productList, setProductList,
    activeRow, setActiveRow,
    addProduct, deleteProduct, copyProduct,
    onInputChange, onSelChange, onCheckboxClick, disabled
  }
}

// =============================================================
type TuseProduct = ReturnType<typeof useProduct>

export type { TuseProduct, TtheadItem, Tproduct, TprodCellKey }








