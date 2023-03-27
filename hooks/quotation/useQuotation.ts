
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

// type
import { Tquotation, } from "fakeDatabase/domestic/_fakeQuotation"

const doorRail_normal = optionsCreator_doorRail_normal()
const doorRail_antiTyphoon = optionsCreator_doorRail_antyTyphoon()


type TreRender = () => void
type Tdata = ReturnType<Class_fakeApi_quotation["get"]>

// =======================================================================
class Class_basicInfo {
  constructor(
    reRender: TreRender,
    basicInfo: Tdata["basicInfo"],
    clientProfile: Tdata["fakeClienProfile"] | undefined,
    classQuotation: Class_quotation,
  ) {
    this._classQuotation = classQuotation
    this._reRender = reRender
    this._basicInfo = basicInfo
    this._clientProfile = clientProfile
  }
  _classQuotation
  private _reRender
  private _basicInfo
  private _clientProfile: Tdata["fakeClienProfile"] | undefined

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

  set quoStatus(v: "預算" | "投標" | "發包" | "合約") {
    this._basicInfo.quoStatus = v
    this._reRender()
  }

  set clientProfile(data: Tdata["fakeClienProfile"] | undefined) {
    this._clientProfile = data
    this._classQuotation.clientId = data?.clientId ?? ""
    this._reRender()
  }

  get all() {
    return {
      basicInfo: this._basicInfo,
      clientProfile: this._clientProfile
    }
  }

  get postBody(): Tquotation["basicInfo"] {
    return {
      ...this._basicInfo
    }
  }
}



// =======================================================================
class Class_mainProduct {
  constructor(
    mainProduct: Tdata["mainProductArr"][0],
    reRender: TreRender,
  ) {
    this._reRender = reRender
    // this._mainProduct = mainProduct
    this._discount = mainProduct.discount
    this._category = mainProduct.category
    // this._series = mainProduct.series
    this._series = unexpectedOption(mainProduct.series)
    this.seriesType = mainProduct.seriesType
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
    this._doorRail = unexpectedOption(mainProduct.doorRail, mainProduct.doorRailIcon)
    this._horsepower = (() => {
      if (mainProduct.horsepower) return unexpectedOption(mainProduct.horsepower)
      else return { value: "autoCalc", label: "自動計算" }
    })()
    this._qty = mainProduct.qty
    this._memo = mainProduct.memo
    this._ejectionDoor = mainProduct.ejectionDoor
    this._typhoonProof = mainProduct.typhoonProof
    this._unitWeight = mainProduct.unitWeight

    this._partArr = mainProduct.part
      .map((partItem) => {
        return new Class_part(partItem, this, reRender)
      })
  } // constructor

  // 這兩個資料出現在PDF中，但是沒出現在主產品設定中
  // 目前還沒接api，先用寫死的假資料
  thickness = "1.50t" //厚度
  openType = "電動"

  private _reRender
  seriesType

  private _partArr
  get partArr() { return this._partArr }

  private _discount
  get discount() { return this._discount }
  set discount(v: string) { this._discount = v; this._reRender() }

  private _category
  get category() { return this._category }
  set category(v: string) { this._category = v; this._reRender() }

  private _series: Toption
  get series() { return this._series }
  set series(v: Toption) {
    this._series = v;
    this.seriesType = v.seriesType as typeof this.seriesType
    this.ejectionDoor = false
    this._reRender()
  }

  private _L
  get L() { return this._L }
  set L(v: string) {
    this._L = v
    this._W = "0"
    this._reRender()
  }

  private _W
  get W() { return this._W }
  set W(v: string) {
    this._W = v
    this._L = "0"
    this._reRender()
  }

  private _h
  get h() { return `${this._h}` }
  set h(v: string) {
    this._h = v
    this._reRender()
  }
  // 面積
  get area() {
    if (this.seriesType === "rollerDoor") {
      return new Decimal(this._L || this._W || 0)
        .mul(Decimal.add(this._h || 0, this.B.value))
        .toFixed(2).toString()

    } else {
      return new Decimal(this._L || this._W || 0)
        .mul(this._h || 0)
        .toFixed(2).toString()
    }
  }
  // 才數
  get cai() {
    return new Decimal(this.area).mul(10.89).toFixed(0).toString()
  }
  // ------
  private _unitWeight
  get weight() {
    return new Decimal(this._L || 0).mul(this._h || 0).mul(this._unitWeight || 0).toString()
  }

  get reel() {
    return calcReel(parseFloat(this._L), parseFloat(this.weight))
  }
  // ------------------
  get B_D_bArray() {
    return calcBAndD(this.reel, parseFloat(this._h))
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
      return unexpectedOption(calcHorsepower(parseFloat(this.weight)))
    }
    else return this._horsepower
  }
  set horsepower(v: Toption) {
    this._horsepower = v
    this._reRender()
  }

  private _qty
  get qty() { return this._qty }
  set qty(v: string) { this._qty = v; this._reRender() }

  private _memo
  get memo() { return this._memo }
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
    this._partArr.forEach((part) => {
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
    this._partArr.forEach((part) => {
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

  get postBody(): Tdata["mainProductArr"][number] {
    return {
      discount: this.discount,
      category: this.category,
      L: this.L,
      W: this.W,
      h: this.h,
      qty: this.qty,


      memo: this.memo,
      doorType: this.doorType.value,
      horsepower: this.horsepower.value,
      series: this.series.value,

      material: this.material.value,
      surface: this.surface.value,
      doorRail: this.doorRail.value,
      B: this.B.value,

      ejectionDoor: this.ejectionDoor,
      typhoonProof: this.typhoonProof,

      seriesType: this.seriesType,
      doorRailIcon: this.doorRail.icon ?? "",
      unitWeight: this._unitWeight,
      part: this._partArr.map((classPart) => classPart.postBody)
    }
  }
}

// =======================================================================
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
    if (this._qty) return parseFloat(this._qty).toFixed(2)
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
    return Decimal.mul(this.listPrice, this._parent.discount || 0)
      .div(100).toFixed(2)
      .toString()
  }
  //複價 (有計算折數的複價)
  get totalPrice() {
    return Decimal.mul(this.totalListPrice, this._parent.discount || 0)
      .div(100).toFixed(2)
      .toString()
  }

  get postBody(): Tdata["mainProductArr"][number]["part"][number] {
    return {
      partType: this.partType,
      partName: this.partName,
      partId: this.partId,
      material: this._material.value,
      basicWeight: this.basicWeight,
      unit: this.unit,
      qty: this.qty,
      listPrice: this.listPrice,
    }
  }

  get allData() {
    return {
      partType: this.partType,
      partName: this.partName,
      partId: this.partId,
      material: this._material.value,
      basicWeight: this.basicWeight,
      unit: this.unit,
      qty: this.qty,
      listPrice: this.listPrice,
      price: this.price,
      totalPrice: this.totalPrice,
    }
  }

} // Class_part
// =======================================================================
class Class_payInfo {
  constructor(reRender: () => void, payInfo: Tdata["payInfo"]) {
    this._reRender = reRender
    this._tradingLocation = payInfo.tradingLocation
    this._tradingDate = payInfo.tradingDate
    this._deposit = payInfo.deposit
    this._deliveryPayment = payInfo.deliveryPayment
    this._installedPayment = payInfo.installedPayment
    this._eleConnectPayment = payInfo.eleConnectPayment
  }
  private _reRender

  private _tradingLocation
  get tradingLocation() { return this._tradingLocation }
  set tradingLocation(v: string) { this._tradingLocation = v; this._reRender() }

  private _tradingDate
  get tradingDate() { return this._tradingDate }
  set tradingDate(v: string) { this._tradingDate = v; this._reRender() }

  private _deposit
  get deposit() { return this._deposit }
  set deposit(v: string) { this._deposit = v; this._reRender() }

  private _deliveryPayment
  get deliveryPayment() { return this._deliveryPayment }
  set deliveryPayment(v: string) { this._deliveryPayment = v; this._reRender() }

  private _installedPayment
  get installedPayment() { return this._installedPayment }
  set installedPayment(v: string) { this._installedPayment = v; this._reRender() }

  private _eleConnectPayment
  get eleConnectPayment() { return this._eleConnectPayment }
  set eleConnectPayment(v: string) { this._eleConnectPayment = v; this._reRender() }
} // Class_payInfo

// =======================================================================


class Class_listString { // memo與 quoteRange
  constructor(reRender: () => void, stringArr: Tdata["quoteRangeArr" | "memoArr"]) {
    this._reRender = reRender
    this.stringArr = stringArr
  }

  private _reRender
  stringArr

  editString = (index: number, v: string) => {
    this.stringArr[index] = v
    this._reRender()
  }
  addString = (v: string | string[]) => {
    if (typeof v === "string") this.stringArr.push(v)
    else this.stringArr = [...this.stringArr, ...v]
    this._reRender()
  }
  delString = (index: number) => {
    this.stringArr.splice(index, 1)
    this._reRender()
  }
} // Class_listString

// =======================================================================
class Class_signature {
  constructor(reRender: () => void, signature: Tdata["signature"]) {
    this._reRender = reRender
    this._manager = signature.manager
    this._director = signature.director
    this._attn = signature.attn
  }
  private _reRender

  private _manager // 經理
  get manager() { return this._manager }
  set manager(v: string) { this._manager = v; this._reRender() }

  private _director // 主管
  get director() { return this._director }
  set director(v: string) { this._director = v; this._reRender() }

  private _attn // 經辦
  get attn() { return this._attn }
  set attn(v: string) { this._attn = v; this._reRender() }
} // Class_signature

// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
class Class_quotation {
  constructor(
    reRender: TreRender,
    data: Tdata,
    prodCellConfig: TprodCellConfig,
    partCellConfig: TpartCellConfig
  ) {

    this._quotaionDataOri = data

    this._reRender = reRender

    // 選配設定目前沒有設計要可以編輯，所以暫時直接在元件內用固定資料

    this.quotationId = data.basicInfo.quotationId
    // 報價單基本資料
    this.classBasicInfo
      = new Class_basicInfo(reRender, data.basicInfo, data.fakeClienProfile, this)
    // 主產品設定 (包括材料配件設定)
    this.mainProductArr =
      data.mainProductArr.map((mainProduct) => new Class_mainProduct(mainProduct, reRender))
    //  付款資訊
    this.classPayInfo = new Class_payInfo(reRender, data.payInfo)
    // 備註
    this.classMemo = new Class_listString(reRender, data.memoArr)
    // 報價範圍
    this.classQuoteRange = new Class_listString(reRender, data.quoteRangeArr)
    // 簽名
    this.classSignature = new Class_signature(reRender, data.signature)

    this.mainProdCellConfig = prodCellConfig
    this.partCellConfig = partCellConfig

    this.clientId = data.clientId

  } // constructor

  private _quotaionDataOri
  readonly quotationId
  private _reRender
  // ---------------------
  classBasicInfo
  mainProductArr
  classPayInfo
  classMemo
  classQuoteRange
  classSignature
  // ---------------------
  mainProdCellConfig  // dnd head的狀態，也是資料分類目錄
  get mainProdkeyList() {
    return this.mainProdCellConfig.keyList
  }
  set mainProdkeyList(v: typeof this.mainProdCellConfig.keyList) {
    this.mainProdCellConfig.keyList = v
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
  addMainProd = () => {
    this.mainProductArr.push(new Class_mainProduct(emptyMainProd, this._reRender))
    this._activeMainProd = this.mainProductArr.length - 1
    this._reRender()
  }
  // ---------------------
  partCellConfig
  // ---------------------
  // 總折數
  get avgDiscount() {
    let avg = new Decimal(0)
    this.mainProductArr.forEach((prod) => {
      avg = avg.plus(prod.discount || 0)
    })
    return avg.div(this.mainProductArr.length || 1).toString()
  }
  // 小計
  get subTotal() {
    let total = new Decimal(0)
    this.mainProductArr.forEach((prod) => {
      const priceTotal = prod.priceTotal.replaceAll(",", "")
      total = total.plus(priceTotal)
    })
    return total.toString()
  }
  // 營業稅
  get businessTax() { return new Decimal(this.subTotal).mul(0.05).toString() }
  // 總計
  get total() { return new Decimal(this.subTotal).add(this.businessTax).toString() }
  // 變更所有mainProduct的折數
  changeAllDiscount = (v: string) => {
    this.mainProductArr.forEach((prod) => {
      prod.discount = v
    })
    this._reRender()
  }

  // ---------------------
  clientId
  // ---------------------

  get postData(): Tquotation {
    return {
      basicInfo: this.classBasicInfo.postBody,
      mainProductArr: this.mainProductArr.map((mp) => mp.postBody),
      accessory: this._quotaionDataOri.accessory,
      payInfo: this.classPayInfo,
      signature: this.classSignature,
      clientId: this.clientId,
      memoArr: this.classMemo.stringArr,
      quoteRangeArr: this.classQuoteRange.stringArr,
      tempRecord: this._quotaionDataOri.tempRecord,
    }
  }
  // ---------------------
} // Class_quotation




const useQuotation = (data: Tdata | undefined) => {
  const [render, setRender] = useState(0)
  const reRender: TreRender = () => setRender(state => state + 1)
  const checkData = () => {
    if (data) return new Class_quotation(
      reRender,
      data,
      mainProdCellConfigOri(),
      partCellConfigOri()
    )
    return undefined
  }
  const reNew = () => {
    setQuotation(checkData())
  }

  const [classQuotation, setQuotation] = useState(checkData())
  return { classQuotation, reNew }
}

export {
  Class_quotation,
  Class_basicInfo,
  Class_mainProduct,
  Class_part,
  Class_payInfo,
  Class_listString,
  useQuotation
}

const unexpectedOption = (v: string, icon?: string) => {
  if (icon) return { value: v, label: v, icon }
  return { value: v, label: v, }
}



// ==========================================================================

type TmainProdInputCellType =
  { [key in keyof Pick<Class_mainProduct,
    "discount" | "category" | "L" | "W" | "h" | "qty" | "memo">]
    : { type: "input" } }
type TmainProdSelectCellType =
  { [key in keyof Pick<Class_mainProduct,
    "series" | "B" | "doorType" | "material" | "surface" | "horsepower">]
    : { type: "select" } }
type TmainProdSelectWithIconCellType =
  { [key in keyof Pick<Class_mainProduct, "doorRail">]: { type: "selectWithIcon" } }
type TmainProdCheckboxCellType =
  { [key in keyof Pick<Class_mainProduct, "ejectionDoor" | "typhoonProof">]
    : { type: "checkbox" } }
type TmainProdReadOnlyCellType =
  { [key in keyof Pick<Class_mainProduct,
    "listPrice" | "listPriceTotal" | "unitPrice" |
    "priceTotal" | "area" | "cai">]
    : { type: "readOnly" } }


type TprodKeys = keyof (
  TmainProdInputCellType & TmainProdSelectCellType & TmainProdSelectWithIconCellType &
  TmainProdCheckboxCellType & TmainProdReadOnlyCellType
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
  TmainProdInputCellType & TmainProdSelectCellType &
  TmainProdSelectWithIconCellType & TmainProdCheckboxCellType &
  TmainProdReadOnlyCellType

}

function mainProdCellConfigOri(): TprodCellConfig {
  return {
    // 這個會影響一開始的排列順序
    keyList: [
      "discount", "category", "series", "L", "W",
      "h", "B", "area", "cai", "doorType",
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
      // reel: { id: "reel", label: "捲軸", width: "75px", type: "readOnly" },
    }
  }
}

// =============================================================

type TpartReadOnlyCellType =
  { [key in keyof Pick<Class_part,
    "partType" | "partName" | "partId" | "basicWeight" |
    "unit" | "listPrice" | "qty" |
    "totalListPrice" | "price" | "totalPrice">]
    : { type: "readOnly" } }
type TpartSelectCellType =
  { [key in keyof Pick<Class_part, "material">]: { type: "select" } }

type TpartKeys = keyof (TpartReadOnlyCellType & TpartSelectCellType)

type TpartCellConfig = {
  keyList: TpartKeys[]
  cellConfig: {
    [key in TpartKeys]: {
      label: string
      width: string
      inputType?: HTMLInputTypeAttribute
    }
  } & TpartReadOnlyCellType & TpartSelectCellType
}

const partCellConfigOri = (): TpartCellConfig => {
  return {
    keyList: [
      "partType", "partName", "partId", "material",
      "basicWeight", "unit", "qty", "listPrice", "totalListPrice",
      "price", "totalPrice",
    ],
    cellConfig: {
      "partType": { label: "中類", width: "45px", type: "readOnly" },
      "partName": { label: "種類名稱", width: "160px", type: "readOnly" },
      "partId": { label: "代號", width: "116px", type: "readOnly" },
      // "surface": { label: "表面", width: "55p,x" type:readOnly""},
      "basicWeight": { label: "重量基重", width: "75px", type: "readOnly" },
      "unit": { label: "單位", width: "40px", type: "readOnly" },
      "qty": { label: "數量", width: "60px", type: "readOnly" },
      "listPrice": { label: "牌價", width: "84px", type: "readOnly" },
      "totalListPrice": { label: "牌價複價", width: "84px", type: "readOnly" },
      "price": { label: "單價", width: "84px", type: "readOnly" },
      "totalPrice": { label: "複價", width: "84px", type: "readOnly" },
      "material": { label: "材料", width: "120px", type: "select" },
    }
  }
}



// =============================================================
export type {
  // mainProduct
  TmainProdInputCellType, TmainProdSelectCellType,
  TmainProdSelectWithIconCellType, TmainProdCheckboxCellType,
  TmainProdReadOnlyCellType,
  // part
  TpartReadOnlyCellType, TpartSelectCellType
}


// ===============================================================

const emptyMainProd: Tdata["mainProductArr"][0] = {
  discount: "100",
  category: "",
  series: "",
  L: "0",
  W: "0",
  h: "0",
  B: "0", //送到class裡面會被轉為"autoCalc"
  doorType: "",
  material: "",
  surface: "",
  doorRail: "",
  doorRailIcon: "",
  horsepower: "",
  qty: "1",
  memo: "",
  ejectionDoor: false,
  typhoonProof: false,
  unitWeight: "22",
  seriesType: "normal",
  part: [
    {
      partType: "SJ00",
      partName: "捲門片",
      partId: "SJ0000A0000",
      material: "SST 304",
      basicWeight: "99.99",
      unit: "m2",
      listPrice: "499",
      qty: undefined
    },
    {
      partType: "SJ00",
      partName: "馬達機",
      partId: "SJ0000A0000",
      material: "SST 304",
      basicWeight: "99.99",
      unit: "組",
      listPrice: "499",
      qty: "1"
    }
  ]
}
