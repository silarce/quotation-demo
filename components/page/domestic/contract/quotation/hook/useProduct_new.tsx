import {
  ChangeEvent, Dispatch, MouseEvent, SetStateAction,
  useState, useEffect
} from "react"
import Decimal from "decimal.js"
const _ = require("lodash")


// fake
import {
  Tproduct,
  TproductString,
  TproductBoolean,
  TproductObject,
} from "fakeDatabase/domestic/quotation/fakeQuotProductionList_new"

import {
  Tpart, TpartList, TquoteTypeKeys,
  fakePartGroupOri
} from "fakeDatabase/domestic/quotation/fakeQuotPart"
const fakePartGroup = fakePartGroupOri()

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
  id: TprodKeys
  label: string
  width: string
  options?: Toption[]
}
interface TtheadItemObjList {
  [key: string]: TtheadItem
}


// ======================================================

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


  const addProduct = () => {
    const newProd = new ProdClass({
      product: emptyProduct(),
      setProductList
    })
    productList.push(newProd)
    setProductList([...productList])
  }
  const deleteProduct = (e: MouseEvent, index: number) => {
    e.stopPropagation()
    productList.splice(index, 1)
    setActiveRow(-1)
    setProductList([...productList])
  }

  const copyProduct = (index: number) => {
    productList.splice(index, 0, _.cloneDeep(productList[index]) as ProdClass)
    setProductList([...productList])
  }



  return {
    theadIndex, setTheadIndex,
    productList, setProductList,
    activeRow, setActiveRow,
    addProduct, deleteProduct, copyProduct,
    disabled
  }
}



// =============================================================
type TuseProduct_new = ReturnType<typeof useProduct_new>

export type { TuseProduct_new, TtheadItem, Tproduct, TprodKeys, ProdClass }




// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================



// porduction要新增牌價與牌價複價欄位
// porduction要新增牌價與牌價複價欄位
// porduction要新增牌價與牌價複價欄位
// porduction要新增牌價與牌價複價欄位
// porduction要新增牌價與牌價複價欄位
// porduction要新增牌價與牌價複價欄位

class ProdClass {
  discount: Tproduct["discount"]  // 折數
  project: Tproduct["project"]  // 項目
  _L: Tproduct["L"]  // L
  _W: Tproduct["W"]  // W
  _H: Tproduct["H"]  // H
  // _cai: Tproduct["cai"]  // 才數 // 只有台灣在用的單位，沒有英文譯名
  doorType: Tproduct["doorType"]  // 門型
  horsepower: Tproduct["horsepower"]  // 馬力
  qty: Tproduct["qty"]  // 數量
  // unitPrice: Tproduct["unitPrice"]  // 單價
  // subTotal: Tproduct["subTotal"]  // 複價
  memo: Tproduct["memo"] // 備註

  quoteType: Toption //報價別
  material: Toption // 材料
  surface: Toption // 表面
  doorRail: Toption // 門軌
  B: Toption // B

  ejectionDoor: Tproduct["ejectionDoor"]
  typhoonProof: Tproduct["typhoonProof"]

  part: PartClass[]

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
      H, B,
      doorType, horsepower, qty,
      quoteType, material, surface, doorRail, memo,
      ejectionDoor, typhoonProof
    } = product
    this.setProductList = setProductList

    this.discount = discount
    this.project = project
    this._L = L
    this._W = W
    this._H = H
    this.memo = memo

    this.doorType = doorType
    this.horsepower = horsepower
    this.qty = qty

    this.ejectionDoor = ejectionDoor
    this.typhoonProof = typhoonProof

    this.quoteType = optionsGroup["quoteType"].obj[quoteType]
    this.material = optionsGroup["material"].obj[material]
    this.surface = optionsGroup["surface"].obj[surface]
    this.doorRail = optionsGroup["doorRail"].obj[doorRail]
    this.B = optionsGroup["B"].obj[B]

    this.part = fakePartGroup[quoteType as TquoteTypeKeys]
      .map((partData) => new PartClass({
        partData,
        setProductList,
        parent: this
      }))
  }

  get L() {
    return this._L
  }
  set L(v) {
    this._L = new Decimal(parseFloat(v) || 0).abs().toString()
  }
  get W() {
    return this._W
  }
  set W(v) {
    this._W = new Decimal(parseFloat(v) || 0).abs().toString()
  }
  get H() {
    return this._H
  }
  set H(v) {
    this._H = new Decimal(parseFloat(v) || 0).abs().toString()
  }


  get area() {
    return new Decimal(this._L)
      .mul(Decimal.add(this._H, this.B.value))
      .div(100 * 100) // 把單位從平方公分轉為平方公尺
      .toFixed(2).toString()
  }
  get cai() {
    // return new Decimal(this._cai).toFixed(1).toString()
    return new Decimal(999).toFixed(1).toString()
  }
  // 單價
  get unitPrice() {
    let listPrice = new Decimal(0)
    this.part.forEach((part) => {
      listPrice = listPrice.plus(part.totalPrice)
    })
    return listPrice.toString()
  }
  // 複價
  get subTotal() {
    const qty = parseInt(this.qty) || 0
    const unitPrice = parseInt(this.unitPrice)
    return `${qty * unitPrice}`
  }
  // --------------
  onInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: keyof TproductString
  ) => {
    const regex = /^area$|^unitPrice$|^subTotal$|^cai$/
    if (regex.test(key)) return
    key = key as Exclude<keyof TproductString,
      "area" | "unitPrice" | "subTotal" | "cai"
    >
    this[key] = e.target.value
    this.setProductList(state => [...state])
  }

  onSelChange = (
    option: Toption | null,
    key: keyof TproductObject
  ) => {
    if (!option) return
    this[`${key}`] = option

    if (key === "quoteType") {
      this.part = fakePartGroup[this.quoteType.value as TquoteTypeKeys]
        .map((partData) => new PartClass(
          {
            partData,
            setProductList: this.setProductList,
            parent: this
          }))
    }
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

export class PartClass {
  subType: string
  subTypeName: string
  id: string | null
  material: Toption | string
  surface: Toption | string
  basicWeight: string | null // 重量基重
  unit: string | null
  _qty: string | null
  listPrice: string //牌價
  price: string //單價
  setProductList: Dispatch<SetStateAction<ProdClass[]>>

  parent: ProdClass

  constructor(
    { partData, setProductList, parent }:
      {
        partData: Tpart
        setProductList: Dispatch<SetStateAction<ProdClass[]>>
        parent: ProdClass
      }) {

    const {
      subType, subTypeName, id, material, surface,
      basicWeight, unit, qty, listPrice,
      price,
    } = partData
    this.setProductList = setProductList

    this.subType = subType
    this.subTypeName = subTypeName
    this.id = id
    this.basicWeight = basicWeight
    this.unit = unit

    this._qty = qty ?? null

    this.listPrice = listPrice
    this.price = price

    this.material = optionsGroup["material"].obj[material] ?? material
    this.surface = optionsGroup["surface"].obj[surface] ?? surface

    this.parent = parent
  }

  get qty() {
    if (this._qty) return this._qty
    if (this.unit === "M") return this.parent.L
    return this.parent.area
  }
  //牌價複價
  get totalListPrice() {
    return Decimal.mul(this.qty, this.listPrice).toString()
  }
  //複價 (有計算折數的複價)
  get totalPrice() {
    return Decimal.mul(this.totalListPrice, this.parent.discount)
      .div(100)
      .toString()
  }

  onSelChange = (
    option: Toption | null,
    key: "material" | "surface"
  ) => {
    if (!option) return
    this[`${key}`] = option
    this.setProductList(state => [...state])
  }
}



// ================================================================

type TprodKeys = keyof Pick<ProdClass,
  "discount" | "project" | "quoteType" | "L" | "W" |
  "H" | "B" | "area" | "cai" | "doorType" |
  "material" | "surface" | "doorRail" | "horsepower" | "qty" | "unitPrice" |
  "subTotal" | "memo" | "typhoonProof" | "ejectionDoor"
>

type TprodCellConfig = {
  keyList: TprodKeys[]
  cellConfig: {
    [key in TprodKeys]: {
      id: key
      label: string
      width: string
      type: "input" | "select" | "selectWithIcon" | "checkbox" | "readOnly"
    }
  }
}

export function prodCellConfigOri(): TprodCellConfig {
  return {
    keyList: [
      "discount", "project", "quoteType", "L", "W",
      "H", "B", "area", "cai", "doorType",
      "material", "surface", "doorRail", "horsepower", "qty", "unitPrice",
      "subTotal", "memo", "typhoonProof", "ejectionDoor",
    ],
    cellConfig: {
      discount: { id: "discount", label: "折數", width: "75px", type: "input" },
      project: { id: "project", label: "項目", width: "60px", type: "input" },
      quoteType: { id: "quoteType", label: "報價別", width: "105px", type: "select" },
      L: { id: "L", label: "L", width: "60px", type: "input" },
      W: { id: "W", label: "W", width: "60px", type: "input" },
      H: { id: "H", label: "H", width: "60px", type: "input" },
      B: { id: "B", label: "B", width: "60px", type: "select" },
      area: { id: "area", label: "面積", width: "60px", type: "readOnly" },
      cai: { id: "cai", label: "才數", width: "75px", type: "readOnly" },
      doorType: { id: "doorType", label: "門型", width: "75px", type: "input" },
      material: { id: "material", label: "材料", width: "120px", type: "select" },
      surface: { id: "surface", label: "表面", width: "55px", type: "select" },
      doorRail: { id: "doorRail", label: "門軌", width: "70px", type: "selectWithIcon" },
      horsepower: { id: "horsepower", label: "馬力", width: "60px", type: "input" },
      qty: { id: "qty", label: "數量", width: "43px", type: "input" },

      unitPrice: { id: "unitPrice", label: "單價", width: "100px", type: "readOnly" },
      subTotal: { id: "subTotal", label: "複價", width: "100px", type: "readOnly" },

      memo: { id: "memo", label: "備註", width: "90px", type: "input" },
      ejectionDoor: { id: "ejectionDoor", label: "彈射門", width: "60px", type: "checkbox" },
      typhoonProof: { id: "typhoonProof", label: "防颱", width: "60px", type: "checkbox" },
    }
  }
}

// ============================================================================
const emptyProduct = (): Tproduct => ({
  discount: "100.00",
  project: "",
  quoteType: "不是捲門",
  L: "0",
  W: "0",
  H: "0",
  B: "20",
  doorType: "",
  material: "不鏽鋼304#",
  surface: "BA",
  doorRail: "60",
  horsepower: "",
  qty: "",
  memo: "",
  ejectionDoor: false,
  typhoonProof: false,
})































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



















