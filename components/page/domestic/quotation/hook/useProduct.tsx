import {
  ChangeEvent, Dispatch, MouseEvent, SetStateAction, HTMLInputTypeAttribute,
  useState, useEffect, useMemo
} from "react"
import Decimal from "decimal.js"
const _ = require("lodash")


// fake
import {
  Tproduct,
  TproductString,
  TproductBoolean,
  TproductObject,
} from "fakeDatabase/domestic/quotation/fakeQuotProductionList"

import {
  Tpart, TpartList, TquoteTypeKeys,
  fakePartGroupOri
} from "fakeDatabase/domestic/quotation/fakeQuotPart"
const fakePartGroup = fakePartGroupOri()

// options
import {
  Toption,
  optionsCreator_quoteType,
  optionsCreator_material,
  optionsCreator_surface,
  optionsCreator_doorRail,
  optionsCreator_B,
  optionsCreator_horsepower,
  optionsCreator_doorType,
} from "fakeDatabase/options/options"
const optionsGroup = {
  quoteType: optionsCreator_quoteType(),
  material: optionsCreator_material(),
  surface: optionsCreator_surface(),
  doorRail: optionsCreator_doorRail(),
  B: optionsCreator_B(),
  horsepower: optionsCreator_horsepower(),
  doorType: optionsCreator_doorType(),
}

// tool
import { calcReel, calcHorsepower, calcBAndD, } from "js/tools/PSC_v1.1"

// ======================================================

const pordCellConfig = prodCellConfigOri()
let { keyList: prodKeyList,
} = pordCellConfig


// ============================================================
// ============================================================
// ============================================================


function useProduct(
  productListOri: Tproduct[] | undefined,
  disabled: boolean
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
    const newProdClass = _.cloneDeep(productList[index]) as ProdClass
    productList.splice(index, 0, newProdClass)
    setProductList([...productList])
  }

  // 變更所有prod的折數，在右下方的總折數使用
  const changeAllDiscount = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (!/^\d*\.?\d*$/.test(value)) return
    productList.forEach((prod) => {
      prod.discount = value
    })
    setProductList([...productList])
  }

  // 總折數
  const avgDiscount = (() => {
    let avg = new Decimal(0)
    productList.forEach((prod) => {
      avg = avg.plus(prod.discount)
    })
    return avg.div(productList.length || 1).toNumber()
  })()

  // 小計
  const subTotal = (() => {
    let total = new Decimal(0)
    productList.forEach((prod) => {
      const priceTotal = prod.priceTotal.replaceAll(",", "")
      total = total.plus(priceTotal)
    })
    return total.toNumber()
  })()

  // 營業稅
  const businessTax = new Decimal(subTotal).mul(0.05).toNumber()

  // 總計
  const total = new Decimal(subTotal).add(businessTax).toNumber()

  return {
    theadIndex, setTheadIndex,
    productList, setProductList,
    activeRow, setActiveRow,
    addProduct, deleteProduct, copyProduct,
    changeAllDiscount,
    disabled,
    avgDiscount, subTotal, businessTax, total
  }
} // useProduct




// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// console.log(`面積：${(L * h) / 1000}`);
// console.log(`材數：${((L * h) / 1000) * 10.89}`);
// console.log(`重量：${weight}`);
// console.log(`捲軸：${reelData}`);
// console.log(`馬力：${horsepower}`);
// console.log(`B：${B / 100}`);
// console.log(`D：${D / 100}`);
// console.log(`B的陣列：${bArray}`);



class ProdClass {
  discount: Tproduct["discount"] = ""
  _discount: Tproduct["discount"]  // 折數
  project: Tproduct["project"]  // 項目
  // L: Tproduct["L"] = ""  // L
  // W: Tproduct["W"] = ""  // W
  // h: Tproduct["h"] = ""  // h
  _L: number  // L
  _W: number  // W
  _h: number  // h
  _qty: Tproduct["qty"]  // 數量
  memo: Tproduct["memo"] // 備註

  doorType: Toption  // 門型
  quoteType: Toption  //報價別
  material: Toption  // 材料
  surface: Toption  // 表面
  doorRail: Toption  // 門軌


  ejectionDoor: Tproduct["ejectionDoor"]
  typhoonProof: Tproduct["typhoonProof"]

  part: PartClass[]

  setProductList: Dispatch<SetStateAction<ProdClass[]>>

  // 這兩個資料出現在PDF中，但是沒出現在主產品設定中
  // 目前還沒接api，先用寫死的假資料
  thickness = "1.50t" //厚度
  openType = "電動"

  _unitWeight: number
  get weight() {
    return this._L * this._h * this._unitWeight
  }
  get reel() {
    return calcReel(this._L, this.weight)
  }

  // ---
  _horsepower: Toption  // 馬力

  get horsepower() {
    if (this._horsepower.value === "autoCalc") {
      return unexpectedOption(calcHorsepower(this.weight))
    }
    else return this._horsepower
  }
  set horsepower(v: Toption) {
    this._horsepower = v
  }
  // ---
  _B: Toption  // _B
  get B_D_bArray() {
    return calcBAndD(this.reel, this._h)
  }
  get D() {
    return this.B_D_bArray.D / 100
  }
  get BOption(): Toption[] {
    const optionArr = this.B_D_bArray.bArray.map((item) => {
      return unexpectedOption(`${item}`)
    })
    if (optionArr[0]) { optionArr.unshift({ value: "autoCalc", label: "自動計算" }) }
    return optionArr
  }

  get B() {
    if (this._B.value === "autoCalc") {
      return unexpectedOption(`${this.B_D_bArray.B / 100}`)
    }
    else return this._B
  }
  set B(v: Toption) {
    this._B = v
  }
  // ---

  // constructor
  constructor(
    { product, setProductList }:
      {
        product: Tproduct
        setProductList: Dispatch<SetStateAction<ProdClass[]>>
      }
  ) {
    const {
      discount, project, L, W,
      h, B,
      doorType, horsepower, qty,
      quoteType, material, surface, doorRail, memo,
      ejectionDoor, typhoonProof, unitWeight
    } = product
    this.setProductList = setProductList

    this._discount = discount
    this.project = project
    this._L = parseFloat(L)
    this._W = parseFloat(W)
    this._h = parseFloat(h)
    this.memo = memo

    this._qty = qty

    this.ejectionDoor = ejectionDoor
    this.typhoonProof = typhoonProof

    this._unitWeight = unitWeight

    this.doorType = optionsGroup["doorType"].find((item) => item.value === doorType)
      ?? unexpectedOption(doorType)

    if (horsepower) {
      this._horsepower = optionsGroup["horsepower"].find((item) => item.value === horsepower)
        ?? unexpectedOption(horsepower)
    }
    else this._horsepower = { value: "autoCalc", label: "自動計算" }

    this.quoteType = optionsGroup["quoteType"].find((item) => item.value === quoteType)
      ?? unexpectedOption(quoteType)
    this.material = optionsGroup["material"].find((item) => item.value === material)
      ?? unexpectedOption(material)
    this.surface = optionsGroup["surface"].find((item) => item.value === surface)
      ?? unexpectedOption(surface)
    this.doorRail = optionsGroup["doorRail"].find((item) => item.value === doorRail)
      ?? unexpectedOption(doorRail)

    this._B = (() => {
      if (B) return unexpectedOption(B)
      else return { value: "autoCalc", label: "自動計算" }
    })()

    let keys = ["discount",]
    keys.forEach((key) => {
      Object.defineProperty(this, key, {
        get() {
          return this[`_${key}`]
        },
        set(v) {
          // if (!/^\d*\.?\d*$/.test(v)) return
          this[`_${key}`] = new Decimal(parseFloat(v) || 0).toString()
        },
      })
    })

    // 建立part
    this.part = fakePartGroup[quoteType as TquoteTypeKeys]
      .map((partData) => new PartClass({
        partData,
        setProductList,
        parent: this
      }))
  } //  constructor constructor constructor constructor constructor

  get L() {
    return `${this._L}`
  }
  set L(v) {
    this._W = 0
    this._L = new Decimal(parseFloat(v) || 0).toNumber()
  }
  get W() {
    return `${this._W}`
  }
  set W(v) {
    this._L = 0
    // this._W = new Decimal(parseFloat(v) || 0).toNumber()
    this._W = 0 // 暫時先固定為0
  }
  get h() {
    return `${this._h}`
  }
  set h(v) {
    this._h = new Decimal(parseFloat(v) || 0).toNumber()
  }

  // L*(h+B)/10000 = area
  get area() {
    return new Decimal(this._L || this._W)
      .mul(this._h)
      // .div(1000) // 把單位從平方公分轉為平方公尺
      .toFixed(2).toString()
    // return new Decimal(this._L || this._W)
    //   .mul(Decimal.add(this._h, this.B.value))
    //   .div(100 * 100) // 把單位從平方公分轉為平方公尺
    //   .toFixed(2).toString()
  }
  // area *10.89 = cai 取整數
  get cai() {
    return new Decimal(this.area).mul(10.89).toFixed(0).toString()
  }

  get qty() {
    return this._qty
  }
  set qty(v) {
    if (!/^\d*\.?\d*$/.test(v)) return
    this._qty = new Decimal(parseInt(v) || 0).abs().toString()
  }

  // 牌價
  get listPrice() {
    let listPrice = new Decimal(0)
    this.part.forEach((part) => {
      listPrice = listPrice.plus(part.totalListPrice)
    })
    return listPrice.toNumber().toLocaleString()
  }
  // 牌價複價
  get listPriceTotal() {
    return new Decimal(this.qty || 0)
      .mul(this.listPrice.replaceAll(",", ""))
      .toNumber().toLocaleString()
  }

  // 單價
  get unitPrice() {
    let unitPrice = new Decimal(0)
    this.part.forEach((part) => {
      unitPrice = unitPrice.plus(part.totalPrice)
    })
    return unitPrice.toNumber().toLocaleString()
  }
  // 複價
  get priceTotal() {
    return new Decimal(this.qty || 0)
      .mul(this.unitPrice.replaceAll(",", ""))
      .toNumber().toLocaleString()
  }
  // --------------
  onInputChange(
    value: string,
    key: keyof TproductString
  ) {
    const regex = /^area$|^unitPrice$|^subTotal$|^cai$/
    if (regex.test(key)) return
    key = key as Exclude<keyof TproductString,
      "area" | "unitPrice" | "subTotal" | "cai" | "unitWeight"
    >
    this[key] = value
    this.setProductList(state => [...state])
  }

  onSelChange(
    option: Toption | null,
    key: keyof TproductObject
  ) {
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

  onChcekBoxClick(
    key: keyof TproductBoolean
  ) {
    this[key] = !this[key]
    this.setProductList(state => [...state])
  }

  get allData() {
    return {
      reel: this.reel,

      discount: this.discount,
      project: this.project,
      L: this.L,
      W: this.W,
      h: this.h,
      qty: this.qty,
      area: this.area,
      cai: this.cai,
      memo: this.memo,

      doorType: this.doorType.value,
      horsepower: this.horsepower.value,
      quoteType: this.quoteType.value,
      material: this.material.value,
      surface: this.surface.value,
      doorRail: this.doorRail.value,
      B: this.B.value,

      ejectionDoor: this.ejectionDoor,
      typhoonProof: this.typhoonProof,

      listPrice: this.listPrice,
      listPriceTotal: this.listPriceTotal,
      unitPrice: this.unitPrice,
      priceTotal: this.priceTotal,

      // pdf要的資料
      size: `${this._W || this._L} X ${this.h} + ${this.B.value}`,
      thickness: this.thickness,
      openType: this.openType,
    }
  }
}


// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

class PartClass {
  subType: string
  subTypeName: string
  id: string | null
  // material: Toption | string
  // surface: Toption | string
  material: Toption | string
  surface: Toption | string
  basicWeight: string | null // 重量基重
  unit: string | null
  _qty: string | null
  listPrice: string //牌價
  // price: string //單價
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
      // price,
    } = partData
    this.setProductList = setProductList

    this.subType = subType
    this.subTypeName = subTypeName
    this.id = id
    this.basicWeight = basicWeight
    this.unit = unit

    this._qty = qty ?? null

    this.listPrice = listPrice
    // this.price = price



    // this.material = optionsGroup["material"].find((item) => item.value === material)
    //   ?? material
    // this.surface = optionsGroup["surface"].find((item) => item.value === surface)
    //   ?? surface

    this.surface = optionsGroup["surface"].find((item) => item.value === surface)
      ?? surface

    this.material = material + " " + surface


    this.parent = parent
  }

  get qty() {
    if (this._qty) return parseFloat(this._qty).toFixed(2)
    if (this.subTypeName === "門軌") {
      const length = this.parent._h
      return new Decimal(length).div(100).toFixed(2).toString()
    }
    if (this.unit === "M") {
      const length = this.parent._L || this.parent.W
      return new Decimal(length).div(100).toFixed(2).toString()
    }
    return this.parent.area
  }
  //牌價複價
  get totalListPrice() {
    return Decimal.mul(this.qty, this.listPrice).toFixed(2).toString()
  }
  // 單價 (有計算折數的單價)
  get price() {
    return Decimal.mul(this.listPrice, this.parent.discount)
      .div(100).toFixed(2)
      .toString()
  }
  //複價 (有計算折數的複價)
  get totalPrice() {
    return Decimal.mul(this.totalListPrice, this.parent.discount)
      .div(100).toFixed(2)
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
  "h" | "B" | "area" | "cai" | "doorType" |
  "material" | "surface" | "doorRail" | "horsepower" | "qty" | "unitPrice" |
  "priceTotal" | "memo" | "typhoonProof" | "ejectionDoor" |
  "listPrice" | "listPriceTotal" |
  "reel"
>

type TprodCellConfig = {
  keyList: TprodKeys[]
  cellConfig: {
    [key in TprodKeys]: {
      id: key
      label: string
      width: string
      type: "input" | "select" | "selectWithIcon" | "checkbox" | "readOnly"
      inputType?: HTMLInputTypeAttribute
    }
  }
}

function prodCellConfigOri(): TprodCellConfig {
  return {
    keyList: [
      "discount", "project", "quoteType", "L", "W",
      "h", "B", "area", "cai", "reel", "doorType",
      "material", "surface", "doorRail", "horsepower", "qty",
      "listPrice", "listPriceTotal", "unitPrice", "priceTotal",
      "memo", "typhoonProof", "ejectionDoor",
    ],
    cellConfig: {
      discount: { id: "discount", label: "折數", width: "75px", type: "input", inputType: "number" },
      project: { id: "project", label: "項目", width: "60px", type: "input" },
      quoteType: { id: "quoteType", label: "報價別", width: "105px", type: "select" },
      L: { id: "L", label: "L(m)", width: "60px", type: "input", inputType: "number" },
      W: { id: "W", label: "W(m)", width: "60px", type: "input", inputType: "number" },
      h: { id: "h", label: "h(m)", width: "60px", type: "input", inputType: "number" },
      B: { id: "B", label: "B(m)", width: "60px", type: "select" },
      area: { id: "area", label: "面積", width: "60px", type: "readOnly" },
      cai: { id: "cai", label: "才數", width: "75px", type: "readOnly" },
      doorType: { id: "doorType", label: "門型", width: "100px", type: "select" },
      material: { id: "material", label: "材料", width: "120px", type: "select" },
      surface: { id: "surface", label: "表面", width: "55px", type: "select" },
      doorRail: { id: "doorRail", label: "門軌", width: "75px", type: "selectWithIcon" },
      horsepower: { id: "horsepower", label: "馬力", width: "90px", type: "select" },
      qty: { id: "qty", label: "數量", width: "43px", type: "input" },
      listPrice: { id: "listPrice", label: "牌價", width: "120px", type: "readOnly" },
      listPriceTotal: { id: "listPriceTotal", label: "牌價複價", width: "140px", type: "readOnly" },
      unitPrice: { id: "unitPrice", label: "單價", width: "120px", type: "readOnly" },
      priceTotal: { id: "priceTotal", label: "複價", width: "140px", type: "readOnly" },
      memo: { id: "memo", label: "備註", width: "90px", type: "input" },
      ejectionDoor: { id: "ejectionDoor", label: "彈射門", width: "60px", type: "checkbox" },
      typhoonProof: { id: "typhoonProof", label: "防颱", width: "60px", type: "checkbox" },
      reel: { id: "reel", label: "捲軸", width: "75px", type: "readOnly" },
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
  h: "0",
  B: "",
  doorType: "",
  material: "不鏽鋼304#",
  surface: "BA",
  doorRail: "60",
  horsepower: "",
  qty: "",
  memo: "",
  ejectionDoor: false,
  typhoonProof: false,
  unitWeight: 22,
})

const unexpectedOption = (v: string) => ({
  value: v,
  label: v
})





// =============================================================
type TuseProduct = ReturnType<typeof useProduct>

export default useProduct
export { prodCellConfigOri }
export type { TuseProduct, Tproduct, TprodKeys, ProdClass, PartClass }



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

