
import { useState, useEffect, HTMLInputTypeAttribute } from "react"
import { Class_fakeApi_quotation } from "fakeDatabase/fakeAPI/fakeQuotationApi";
import _ from "lodash"

import Decimal from "decimal.js"

// tool
import { calcReel, calcHorsepower, calcBAndD, } from "js/tools/PSC_v1.1"


import {
  Toption,
  optionsCreator_doorRail_normal,
  optionsCreator_doorRail_antyTyphoon,
} from "fakeDatabase/options/options"

const doorRail_normal = optionsCreator_doorRail_normal()
const doorRail_antiTyphoon = optionsCreator_doorRail_antyTyphoon()




type TreRender = () => void
type Tdata = ReturnType<Class_fakeApi_quotation["get"]>



class Class_basicInfo {
  constructor(
    basicInfo: Tdata["basicInfo"],
    clientProfile: Tdata["fakeClienProfile"] | undefined,
    reRender: TreRender) {
    this._reRender = reRender
    this._basicInfo = basicInfo
    this._clientProfile = clientProfile
  }
  private _reRender
  private _basicInfo
  private _clientProfile: Tdata["fakeClienProfile"] | undefined
  get all() {
    return {
      basicInfo: this._basicInfo,
      clientProfile: this._clientProfile
    }
  }
  setBasicInfoString = (
    key: keyof Omit<typeof this._basicInfo,
      "tempQuotationAging" | "totalDiscount" |
      "tempDoorQty" | "tempBudgetAmount" |
      "quoStatus">,
    value: string
  ) => {
    this._basicInfo[key] = value
    this._reRender()
  }
  // setBasicInfoNumber = (
  //   key: keyof Pick<typeof this._basicInfo,
  //     "tempQuotationAging" | "totalDiscount" |
  //     "tempDoorQty" | "tempBudgetAmount">,
  //   value: number,
  // ) => {
  //   this._basicInfo[key] = value
  //   this._reRender()
  // }

  set quoStatus(v: "預算" | "投標" | "發包" | "合約") {
    this._basicInfo.quoStatus = v
    this._reRender()
  }

  set clientProfile(data: Tdata["fakeClienProfile"] | undefined) {
    this._clientProfile = data
    this._reRender()
  }
}











// ==================================================
class Class_mainProduct {
  constructor(
    mainProduct: Tdata["mainProductArr"][0],
    reRender: TreRender) {
    this._reRender = reRender
    // this._mainProduct = mainProduct
    this._discount = mainProduct.discount
    this._category = mainProduct.category
    // this._series = mainProduct.series
    this._series = unexpectedOption(mainProduct.series)
    this._L = mainProduct.L
    this._W = mainProduct.W
    this._h = mainProduct.h
    this._B = (() => {
      if (mainProduct.B) return unexpectedOption(`${mainProduct.B}`)
      else return { value: "autoCalc", label: "自動計算" }
    })()
    this._doorType = unexpectedOption(mainProduct.doorType)
    this._material = unexpectedOption(mainProduct.material)
    this._surface = unexpectedOption(mainProduct.surface)
    // this._doorRail = unexpectedOption(mainProduct.doorRail)
    this._doorRail = unexpectedOption(mainProduct.doorRail, mainProduct.doorRailIcon)
    this._horsepower = unexpectedOption(mainProduct.horsepower)
    this._qty = mainProduct.qty
    this._memo = mainProduct.memo
    this._ejectionDoor = mainProduct.ejectionDoor
    this._typhoonProof = mainProduct.typhoonProof
    this._unitWeight = mainProduct.unitWeight

    this._part = mainProduct.part
      .map((partItem) => {
        return new Class_part(partItem, this, reRender)
      })
  } // constructor

  // 這兩個資料出現在PDF中，但是沒出現在主產品設定中
  // 目前還沒接api，先用寫死的假資料
  thickness = "1.50t" //厚度
  openType = "電動"

  private _part
  private _reRender

  private _discount
  get discount() { return `${this._discount}` }
  set discount(v: string) { this._discount = parseFloat(v); this._reRender() }

  private _category
  get category() { return this._category }
  set category(v: string) { this._category = v; this._reRender() }

  private _series: Toption
  get series() { return this._series }
  set series(v: Toption) { this._series = v; this._reRender() }

  private _L
  get L() { return `${this._L}` }
  set L(v: string) {
    this._L = new Decimal(parseFloat(v) || 0).toNumber()
    this._W = 0
    this._reRender()
  }

  private _W
  get W() { return `${this._W}` }
  set W(v: string) {
    this._W = new Decimal(parseFloat(v) || 0).toNumber()
    this._L = 0
    this._reRender()
  }

  private _h
  get h() { return `${this._h}` }
  set h(v: string) {
    this._h = new Decimal(parseFloat(v) || 0).toNumber()
    this._reRender()
  }

  get area() {
    return new Decimal(this._L || this._W)
      .mul(Decimal.add(this._h, this.B.value))
      .toFixed(2).toString()
  }

  get cai() {
    return new Decimal(this.area).mul(10.89).toFixed(0).toString()
  }
  // ------
  private _unitWeight
  get weight() {
    return this._L * this._h * this._unitWeight
  }

  get reel() {
    return calcReel(this._L, this.weight)
  }
  // ------------------
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

  private _B
  get B() {
    if (this._B.value === "autoCalc") {
      return unexpectedOption(`${this.B_D_bArray.B / 100}`)
    }
    else return this._B
  }
  set B(v: Toption) { this._B = v; this._reRender() }
  // ------------------
  private _doorType
  get doorType() { return this._doorType }
  set doorType(v: Toption) { this._doorType = v; this._reRender() }

  private _material
  get material() { return this._material }
  set material(v: Toption) { this._material = v; this._reRender() }

  private _surface
  get surface() { return this._surface }
  set surface(v: Toption) { this._surface = v; this._reRender() }

  private _horsepower: Toption  // 馬力
  get horsepower() {
    if (this._horsepower.value === "autoCalc") {
      return unexpectedOption(calcHorsepower(this.weight))
    }
    else return this._horsepower
  }
  set horsepower(v: Toption) {
    this._horsepower = v
    this._reRender()
  }

  private _qty
  get qty() { return `${this._qty}` }
  set qty(v: string) { this._qty = parseFloat(v); this._reRender() }

  private _memo
  get memo() { return `${this._memo}` }
  set memo(v: string) { this._memo = v; this._reRender() }

  private _ejectionDoor
  get ejectionDoor() { return this._ejectionDoor }
  set ejectionDoor(v: boolean) { this._ejectionDoor = v; this._reRender() }

  private _doorRail
  get doorRail() { return this._doorRail }
  set doorRail(v: Toption) { this._doorRail = v; this._reRender() }

  // ------------------
  // 門軌選項
  get doorRailOptions() {
    if (this.typhoonProof) return doorRail_antiTyphoon
    else return doorRail_normal
  }

  // 防颱
  private _typhoonProof
  get typhoonProof() { return this._typhoonProof }
  set typhoonProof(v: boolean) {
    this._typhoonProof = v;
    this._doorRail = this.doorRailOptions[0]
    this._reRender()
  }
  // ------------------

  // 牌價
  get listPrice() {
    let listPrice = new Decimal(0)
    this._part.forEach((part) => {
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
    this._part.forEach((part) => {
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




  get allData() {
    return {
      discount: this.discount,
      category: this.category,
      L: this.L,
      W: this.W,
      h: this.h,
      qty: this.qty,
      area: this.area,
      cai: this.cai,
      memo: this.memo,
      doorType: this.doorType.value,
      horsepower: this.horsepower.value,
      series: this.series.value,
      reel: this.reel,
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


class Class_part {
  constructor(
    part: Tdata["mainProductArr"][0]["part"][0],
    parent: Class_mainProduct,
    reRender: TreRender
  ) {
    this._reRender = reRender
    this._parent = parent

    this.partType = part.partType;
    this.partName = part.partName;
    this.partId = part.partId;
    this._material = unexpectedOption(part.material);
    this.basicWeight = part.basicWeight;
    this.unit = part.unit;
    this.listPrice = part.listPrice;
    this._qty = part.qty;
  } // constructor
  private _reRender
  private _parent

  partType
  partName
  partId

  basicWeight
  unit
  listPrice

  _material
  get material() { return this._material }
  set material(v: Toption) { this._material = v; this._reRender() }


  private _qty
  get qty() {
    if (this._qty) return this._qty.toFixed(2)
    if (this.partType === "門軌") {
      const length = this._parent.h
      return new Decimal(length).div(100).toFixed(2).toString()
    }
    if (this.unit === "M") {
      const length = this._parent.L || this._parent.W
      return new Decimal(length).div(100).toFixed(2).toString()
    }
    return this._parent.area
  }

  //牌價複價
  get totalListPrice() {
    return Decimal.mul(this.qty, this.listPrice).toFixed(2).toString()
  }
  // 單價 (有計算折數的單價)
  get price() {
    return Decimal.mul(this.listPrice, this._parent.discount)
      .div(100).toFixed(2)
      .toString()
  }
  //複價 (有計算折數的複價)
  get totalPrice() {
    return Decimal.mul(this.totalListPrice, this._parent.discount)
      .div(100).toFixed(2)
      .toString()
  }
} // Class_part



// =============================================================
class Class_quotation {
  constructor(
    reRender: TreRender,
    data: Tdata,
    prodCellConfig: TprodCellConfig
  ) {
    this._reRender = reRender

    this.basicInfo
      = new Class_basicInfo(data.basicInfo, data.fakeClienProfile, reRender)
    this.mainProductArr =
      data.mainProductArr
        .map((mainProduct) => new Class_mainProduct(mainProduct, reRender))
    this.prodCellConfig = prodCellConfig
  } // constructor

  private _reRender
  // ---------------------
  basicInfo
  // ---------------------

  mainProductArr
  prodCellConfig  // dnd head的狀態，也是資料分類目錄
  get mainProdkeyList() {
    return this.prodCellConfig.keyList
  }
  set mainProdkeyList(v: typeof this.prodCellConfig.keyList) {
    this.prodCellConfig.keyList = v
    this._reRender()
  }

  private _activeMainProd = -1 // 被選中的mainProduct的index
  get activeMainProd() { return this._activeMainProd }
  set activeMainProd(v: number) {
    this._activeMainProd = v
    this._reRender()
  }

  delMainProd = (index: number) => {
    this.mainProductArr.splice(index, 1)
    this.activeMainProd = -1
    this._reRender()
  }
  copyMainProd = (index: number) => {
    this.mainProductArr.push(_.cloneDeep(this.mainProductArr[index]))
    this.activeMainProd = index
    this._reRender()
  }
  // ---------------------
  // private _disabled = true
  // get disabled() { return this._disabled }
  // set disabled(v: boolean) { this._disabled = v; this._reRender() }
  // -----
}




const useQuotation = (data: Tdata | undefined) => {
  const [render, setRender] = useState(0)
  const reRender: TreRender = () => setRender(state => state + 1)

  const checkData = () => {
    if (data) return new Class_quotation(reRender, data, prodCellConfigOri())
    return undefined
  }
  const [classQuotaion, setQuotation] = useState(checkData())
  return classQuotaion
}







export {
  Class_quotation,
  Class_basicInfo,
  Class_mainProduct,
  Class_part,
  useQuotation
}




const unexpectedOption = (v: string, icon?: string) => {

  if (icon) return {
    value: v,
    label: v,
    icon
  }


  return {
    value: v,
    label: v,
  }
}





// ==========================================================================


// type TprodKeys = keyof Pick<Class_mainProduct,
//   "discount" | "category" | "series" | "L" | "W" |
//   "h" | "B" | "area" | "cai" | "doorType" |
//   "material" | "surface" | "doorRail" | "horsepower" | "qty" | "unitPrice" |
//   "priceTotal" | "memo" | "typhoonProof" | "ejectionDoor" |
//   "listPrice" | "listPriceTotal" |
//   "reel"
// >

// export type TinputCellType =
//   { [key in Extract<TprodKeys,
//     "discount" | "category" | "L" | "W" | "h" | "qty" | "memo">]
//     : { type: "input" } }
// type TselectCellType =
//   { [key in Extract<TprodKeys,
//     "series" | "B" | "doorType" | "material" | "surface" | "horsepower">]
//     : { type: "select" } }
// type TselectWithIconCellType =
//   { [key in Extract<TprodKeys, "doorRail">]: { type: "selectWithIcon" } }
// type TcheckboxCellType =
//   { [key in Extract<TprodKeys, "ejectionDoor" | "typhoonProof">]
//     : { type: "checkbox" } }
// type TreadOnlyCellType =
//   { [key in Extract<TprodKeys,
//     "listPrice" | "listPriceTotal" | "unitPrice" |
//     "priceTotal" | "area" | "cai" | "reel">]
//     : { type: "readOnly" } }



type TinputCellType =
  { [key in keyof Pick<Class_mainProduct,
    "discount" | "category" | "L" | "W" | "h" | "qty" | "memo">]
    : { type: "input" } }
type TselectCellType =
  { [key in keyof Pick<Class_mainProduct,
    "series" | "B" | "doorType" | "material" | "surface" | "horsepower">]
    : { type: "select" } }
type TselectWithIconCellType =
  { [key in keyof Pick<Class_mainProduct, "doorRail">]: { type: "selectWithIcon" } }
type TcheckboxCellType =
  { [key in keyof Pick<Class_mainProduct, "ejectionDoor" | "typhoonProof">]
    : { type: "checkbox" } }
type TreadOnlyCellType =
  { [key in keyof Pick<Class_mainProduct,
    "listPrice" | "listPriceTotal" | "unitPrice" |
    "priceTotal" | "area" | "cai" | "reel">]
    : { type: "readOnly" } }


type TprodKeys = keyof (
  TinputCellType & TselectCellType & TselectWithIconCellType &
  TcheckboxCellType & TreadOnlyCellType
)


type TprodCellConfig = {
  keyList: TprodKeys[]
  cellConfig: {
    [key in TprodKeys]: {
      id: key
      label: string
      width: string
      // type: "input" | "select" | "selectWithIcon" | "checkbox" | "readOnly"
      inputType?: HTMLInputTypeAttribute
    }
  } &
  TinputCellType & TselectCellType &
  TselectWithIconCellType & TcheckboxCellType & TreadOnlyCellType

}




function prodCellConfigOri(): TprodCellConfig {
  return {
    // 這個會影響一開始的排列順序
    keyList: [
      "discount", "category", "series", "L", "W",
      "h", "B", "area", "cai", "reel", "doorType",
      "material", "surface", "doorRail", "typhoonProof", "horsepower", "qty",
      "listPrice", "listPriceTotal", "unitPrice", "priceTotal",
      "memo", "ejectionDoor",
    ],
    cellConfig: {
      // input
      discount: { id: "discount", label: "折數", width: "75px", type: "input", inputType: "number" },
      category: { id: "category", label: "項目", width: "60px", type: "input" },
      L: { id: "L", label: "L(m)", width: "60px", type: "input", inputType: "number" },
      W: { id: "W", label: "W(m)", width: "60px", type: "input", inputType: "number" },
      h: { id: "h", label: "h(m)", width: "60px", type: "input", inputType: "number" },
      qty: { id: "qty", label: "數量", width: "43px", type: "input" },
      memo: { id: "memo", label: "備註", width: "90px", type: "input" },
      // select
      series: { id: "series", label: "報價別", width: "105px", type: "select" },
      B: { id: "B", label: "B(m)", width: "60px", type: "select" },
      doorType: { id: "doorType", label: "門型", width: "100px", type: "select" },
      material: { id: "material", label: "材料", width: "120px", type: "select" },
      surface: { id: "surface", label: "表面", width: "55px", type: "select" },
      horsepower: { id: "horsepower", label: "馬力", width: "90px", type: "select" },
      // selectWithIcon
      doorRail: { id: "doorRail", label: "門軌", width: "210px", type: "selectWithIcon" },
      // checkbox
      ejectionDoor: { id: "ejectionDoor", label: "彈射門", width: "60px", type: "checkbox" },
      typhoonProof: { id: "typhoonProof", label: "防颱", width: "60px", type: "checkbox" },
      // readOnly
      listPrice: { id: "listPrice", label: "牌價", width: "120px", type: "readOnly" },
      listPriceTotal: { id: "listPriceTotal", label: "牌價複價", width: "140px", type: "readOnly" },
      unitPrice: { id: "unitPrice", label: "單價", width: "120px", type: "readOnly" },
      priceTotal: { id: "priceTotal", label: "複價", width: "140px", type: "readOnly" },
      area: { id: "area", label: "面積", width: "60px", type: "readOnly" },
      cai: { id: "cai", label: "才數", width: "75px", type: "readOnly" },
      reel: { id: "reel", label: "捲軸", width: "75px", type: "readOnly" },
    }
  }
}


export type {
  TinputCellType, TselectCellType, TselectWithIconCellType,
  TcheckboxCellType, TreadOnlyCellType,
}


// type TprodKeys = keyof Pick<Class_mainProduct,
//   "discount" | "category" | "series" | "L" | "W" |
//   "h" | "B" | "area" | "cai" | "doorType" |
//   "material" | "surface" | "doorRail" | "horsepower" | "qty" | "unitPrice" |
//   "priceTotal" | "memo" | "typhoonProof" | "ejectionDoor" |
//   "listPrice" | "listPriceTotal" |
//   "reel"
// >

// type TprodCellConfig = {
//   keyList: TprodKeys[]
//   cellConfig: {
//     [key in TprodKeys]: {
//       id: key
//       label: string
//       width: string
//       type: "input" | "select" | "selectWithIcon" | "checkbox" | "readOnly"
//       inputType?: HTMLInputTypeAttribute
//     }
//   }
// }


// function prodCellConfigOri(): TprodCellConfig {
//   return {
//     // 這個會影響一開始的排列順序
//     keyList: [
//       "discount", "category", "series", "L", "W",
//       "h", "B", "area", "cai", "reel", "doorType",
//       "material", "surface", "doorRail", "typhoonProof", "horsepower", "qty",
//       "listPrice", "listPriceTotal", "unitPrice", "priceTotal",
//       "memo", "ejectionDoor",
//     ],
//     cellConfig: {
//       discount: { id: "discount", label: "折數", width: "75px", type: "input", inputType: "number" },
//       category: { id: "category", label: "項目", width: "60px", type: "input" },
//       series: { id: "series", label: "報價別", width: "105px", type: "select" },
//       L: { id: "L", label: "L(m)", width: "60px", type: "input", inputType: "number" },
//       W: { id: "W", label: "W(m)", width: "60px", type: "input", inputType: "number" },
//       h: { id: "h", label: "h(m)", width: "60px", type: "input", inputType: "number" },
//       B: { id: "B", label: "B(m)", width: "60px", type: "select" },
//       area: { id: "area", label: "面積", width: "60px", type: "readOnly" },
//       cai: { id: "cai", label: "才數", width: "75px", type: "readOnly" },
//       doorType: { id: "doorType", label: "門型", width: "100px", type: "select" },
//       material: { id: "material", label: "材料", width: "120px", type: "select" },
//       surface: { id: "surface", label: "表面", width: "55px", type: "select" },
//       doorRail: { id: "doorRail", label: "門軌", width: "145px", type: "selectWithIcon" },
//       horsepower: { id: "horsepower", label: "馬力", width: "90px", type: "select" },
//       qty: { id: "qty", label: "數量", width: "43px", type: "input" },
//       listPrice: { id: "listPrice", label: "牌價", width: "120px", type: "readOnly" },
//       listPriceTotal: { id: "listPriceTotal", label: "牌價複價", width: "140px", type: "readOnly" },
//       unitPrice: { id: "unitPrice", label: "單價", width: "120px", type: "readOnly" },
//       priceTotal: { id: "priceTotal", label: "複價", width: "140px", type: "readOnly" },
//       memo: { id: "memo", label: "備註", width: "90px", type: "input" },
//       ejectionDoor: { id: "ejectionDoor", label: "彈射門", width: "60px", type: "checkbox" },
//       typhoonProof: { id: "typhoonProof", label: "防颱", width: "60px", type: "checkbox" },
//       reel: { id: "reel", label: "捲軸", width: "75px", type: "readOnly" },
//     }
//   }
// }


















