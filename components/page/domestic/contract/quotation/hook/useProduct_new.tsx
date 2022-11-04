import {
  ChangeEvent, Dispatch, MouseEvent, SetStateAction,
  useState, useEffect
} from "react"
// 
const _ = require("lodash")


// fake
import {
  Tproduct,
  TprodCellKey,
  emptyProduct, prodCellConfigOri,
  TproductString,
  TproductBoolean,
  TproductObject,
} from "fakeDatabase/domestic/quotation/fakeQuotProductionList_new"

// options
import {
  Toption, ToptionPlus,
  optionsCreator_quoteType_new,
  optionsCreator_material_new,
  optionsCreator_surface_new,
  optionsCreator_doorRail_new,
  optionsCreator_B_new,
} from "fakeDatabase/options/options"
const optionsGroup = {
  quoteType: optionsCreator_quoteType_new(),
  material: optionsCreator_material_new(),
  surface: optionsCreator_surface_new(),
  doorRail: optionsCreator_doorRail_new(),
  B: optionsCreator_B_new(),
}




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
let { keyList: prodKeyList,
  // cellConfig 
} = pordCellConfig


// ============================================================
// ============================================================
// ============================================================


export default function useProduct_new(
  productListOri?: Tproduct[],
  disabled: boolean = false
) {

  // // dnd head的狀態，也是資料分類目錄
  const [theadIndex, setTheadIndex] = useState(prodKeyList)

  // // 被選中的row
  const [activeRow, setActiveRow] = useState(-1)

  // 資料
  const [productList, setProductList] = useState<ProdClass[]>([])

  useEffect(() => {
    if (!productListOri) return

    const newList = productListOri.map((item, index) => {
      return new ProdClass({ product: item, setProductList })
    })

    setProductList(newList)


  }, [productListOri])


  // const addProduct = () => {
  //   productList.push(JSON.parse(JSON.stringify(emptyProduct)))
  //   setProductList([...productList])
  // }
  // const deleteProduct = (e: MouseEvent, index: number) => {
  //   e.stopPropagation()
  //   productList.splice(index, 1)
  //   setActiveRow(-1)
  //   setProductList([...productList])
  // }

  // const copyProduct = (index: number) => {
  //   productList.splice(index, 0, { ...productList[index] })
  //   setProductList([...productList])
  // }



  return {
    theadIndex, setTheadIndex,
    productList, setProductList,
    activeRow, setActiveRow,
    // addProduct, deleteProduct, copyProduct,
    // onInputChange, onSelChange, onCheckboxClick,
    disabled
  }
}



// =============================================================
type TuseProduct_new = ReturnType<typeof useProduct_new>

export type { TuseProduct_new, TtheadItem, Tproduct, TprodCellKey, ProdClass }




// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

class ProdClass {
  discount: Tproduct["discount"]  // 折數
  project: Tproduct["project"]  // 項目
  L: Tproduct["L"]  // L
  W: Tproduct["W"]  // W
  H: Tproduct["H"]  // H
  // area: Tproduct["area"]  // 面積
  cai: Tproduct["cai"]  // 才數 // 只有台灣在用的單位，沒有英文譯名
  doorType: Tproduct["doorType"]  // 門型
  horsepower: Tproduct["horsepower"]  // 馬力
  qty: Tproduct["qty"]  // 數量
  unitPrice: Tproduct["unitPrice"]  // 單價
  // subTotal: Tproduct["subTotal"]  // 複價
  memo: Tproduct["memo"] // 備註

  quoteType: Toption //報價別
  material: Toption // 材料
  surface: Toption // 表面
  doorRail: Toption // 門軌
  B: Toption // B

  ejectionDoor: Tproduct["ejectionDoor"]
  typhoonProof: Tproduct["typhoonProof"]


  setProductList: Dispatch<SetStateAction<ProdClass[]>>

  constructor(
    { product, setProductList }:
      {
        product: Tproduct
        setProductList: Dispatch<SetStateAction<ProdClass[]>>
      }
  ) {
    const {
      discount, project, L, W,
      H, B, area, cai,
      doorType, horsepower, qty, unitPrice, subTotal,
      quoteType, material, surface, doorRail, memo,
      ejectionDoor, typhoonProof
    } = product
    this.setProductList = setProductList

    this.discount = discount
    this.project = project
    this.L = L
    this.W = W
    this.H = H

    // this._area = area
    this.cai = cai

    this.doorType = doorType
    this.horsepower = horsepower
    this.qty = qty
    this.unitPrice = unitPrice
    // this.subTotal = subTotal
    this.memo = memo

    this.ejectionDoor = ejectionDoor
    this.typhoonProof = typhoonProof

    this.quoteType = optionsGroup["quoteType"].obj[quoteType]
    this.material = optionsGroup["material"].obj[material]
    this.surface = optionsGroup["surface"].obj[surface]
    this.doorRail = optionsGroup["doorRail"].obj[doorRail]
    this.B = optionsGroup["B"].obj[B]
  }

  get area() {
    const L = parseInt(this.L)
    const H = parseInt(this.H)
    const B = parseInt(this.B.value)
    return `${L * (H + B) / 100}`
  }
  get subTotal() {
    const qty = parseInt(this.qty) || 0
    const unitPrice = parseInt(this.unitPrice)
    return `${qty * unitPrice}`

  }

  // get cai() {
  //   return this._cai
  // }

  // --------------
  onInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: keyof TproductString
  ) => {
    if (key === "area" || key === "subTotal") return
    this[key] = e.target.value
    this.setProductList(state => [...state])
  }

  onSelChange = (
    option: Toption | null,
    key: keyof TproductObject
  ) => {
    if (!option) return
    this[`${key}`] = option
    this.setProductList(state => [...state])
  }

  onChcekBoxClick = (
    key: keyof TproductBoolean
  ) => {
    this[key] = !this[key]
    this.setProductList(state => [...state])
  }
}


// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

class ComponentClass {
subType:string = ""


}
































// 如果之後要動態生成getter與setter，可以這樣做
// class Foo {
//   a = 1
//   b = 2
//   bar: any
//   constructor() {
//     Object.defineProperty(this, "bar", {
//       get() {
//         // console.log(this.a + this.b)
//         return this.a + this.b
//       },
//       set(v) {
//         this.a = v
//       },
//     })
//   }
// }










