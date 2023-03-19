
import { useState } from "react"
import { Class_fakeApi_quotation } from "fakeDatabase/fakeAPI/fakeQuotationApi";

import { Toption } from "fakeDatabase/options/options";

import Decimal from "decimal.js"

// tool
import { calcReel, calcHorsepower, calcBAndD, } from "js/tools/PSC_v1.1"


type TreRender = () => void
type Tdata = ReturnType<Class_fakeApi_quotation["get"]>



const useQuotation = (data: Tdata) => {
  const [render, setRender] = useState(false)
  const reRender: TreRender = () => setRender(state => !state)


  return
}







class Class_basicInfo {
  constructor(basicInfo: Tdata["basicInfo"], reRender: TreRender) {
    this._reRender = reRender
    this._basicInfo = basicInfo
  }
  private _reRender
  private _basicInfo
  get all() {
    return this._basicInfo
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
    this._doorRail = unexpectedOption(mainProduct.doorRail)
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
    this._L = parseFloat(v)
    this._W = 0
    this._reRender()
  }

  private _W
  get W() { return `${this._W}` }
  set W(v: string) {
    this._W = parseFloat(v)
    this._L = 0
    this._reRender()
  }

  private _h
  get h() { return `${this._h}` }
  set h(v: string) {
    this._h = parseFloat(v)
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
  // ------
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
  // ------
  private _doorType
  get doorType() { return this._doorType }
  set doorType(v: Toption) { this._doorType = v; this._reRender() }

  private _material
  get material() { return this._material }
  set material(v: Toption) { this._material = v; this._reRender() }

  private _surface
  get surface() { return this._surface }
  set surface(v: Toption) { this._surface = v; this._reRender() }

  private _doorRail
  get doorRail() { return this._doorRail }
  set doorRail(v: Toption) { this._doorRail = v; this._reRender() }

  private _horsepower
  get horsepower() { return this._horsepower }
  set horsepower(v: Toption) { this._horsepower = v; this._reRender() }

  private _qty
  get qty() { return `${this._qty}` }
  set qty(v: string) { this._qty = parseFloat(v); this._reRender() }

  private _memo
  get memo() { return `${this._memo}` }
  set memo(v: string) { this._memo = v; this._reRender() }

  private _ejectionDoor
  get ejectionDoor() { return this._ejectionDoor }
  set ejectionDoor(v: boolean) { this._ejectionDoor = v; this._reRender() }

  private _typhoonProof
  get typhoonProof() { return this._typhoonProof }
  set typhoonProof(v: boolean) { this._typhoonProof = v; this._reRender() }


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








class Class_quotation {
  constructor(data: Tdata, reRender: TreRender) {
    this._reRender = reRender


  }
  private _reRender

}



















export { }



const unexpectedOption = (v: string) => ({
  value: v,
  label: v
})





