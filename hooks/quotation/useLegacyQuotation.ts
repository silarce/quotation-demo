import { useState, useEffect, HTMLInputTypeAttribute } from "react"
import { Class_fakeApi_legacyQuotation } from "fakeDatabase/fakeAPI/fakeLegacyQuotationApi"
import _ from "lodash"

import {
  Toption,
  optionsCreator_doorRail_normal,
  optionsCreator_doorRail_antyTyphoon,
} from "fakeDatabase/options/options"


// type
import { TlegacyQuotation, emptyLegacyQuotation, emptyPart } from "fakeDatabase/domestic/_fakeLegacyQuotation"
type TreRender = () => void
type Tdata = ReturnType<Class_fakeApi_legacyQuotation["get"]>


const doorRail_normal = optionsCreator_doorRail_normal()
const doorRail_antiTyphoon = optionsCreator_doorRail_antyTyphoon()


// =======================================================================
class Class_basicInfo {
  constructor(
    reRender: TreRender,
    basicInfo: Tdata["basicInfo"],
    clientProfile: Tdata["fakeClienProfile"] | undefined,
    classQuotation: Class_legacyQuotation,
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
      "quoStatus" | "approvalStatus">,
    value: string
  ) => {
    this._basicInfo[key] = value
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

  get postBody(): TlegacyQuotation["basicInfo"] {
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
    this._mainProduct = mainProduct

    // this._doorRail = unexpectedOption(mainProduct.doorRail, mainProduct.doorRailIcon)


    this._partArr = mainProduct.part
      .map((partItem) => {
        return new Class_part(partItem, reRender)
      })
  } // constructor

  private _reRender
  private _mainProduct
  private _partArr
  // 這兩個資料出現在PDF中，但是沒出現在主產品設定中
  // 目前還沒接api，先用寫死的假資料
  thickness = "1.50t" //厚度
  openType = "電動"


  get partArr() { return this._partArr }

  get idNumber() { return this._mainProduct.idNumber }
  set idNumber(v) { this._mainProduct.idNumber = v; this._reRender() }

  get category() { return this._mainProduct.category }
  set category(v: string) { this._mainProduct.category = v; this._reRender() }

  get series() { return this._mainProduct.series }
  set series(v) { this._mainProduct.series = v; this._reRender() }

  get doorType() { return this._mainProduct.doorType }
  set doorType(v) { this._mainProduct.doorType = v; this._reRender() }

  get L() { return this._mainProduct.L }
  set L(v: string) { this._mainProduct.L = v; this._reRender() }

  get W() { return this._mainProduct.W }
  set W(v: string) { this._mainProduct.W = v; this._reRender() }

  get h() { return this._mainProduct.h }
  set h(v: string) { this._mainProduct.h = v; this._reRender() }

  get B() { return this._mainProduct.B }
  set B(v) { this._mainProduct.B = v; this._reRender() }

  get area() { return this._mainProduct.area }
  set area(v) { this._mainProduct.area = v; this._reRender() }

  /** 才數*/
  get cai() { return this._mainProduct.cai }
  set cai(v) { this._mainProduct.cai = v; this._reRender() }

  get material() { return this._mainProduct.material }
  set material(v) { this._mainProduct.material = v; this._reRender() }

  get surface() { return this._mainProduct.surface }
  set surface(v) { this._mainProduct.surface = v; this._reRender() }

  get doorRail() { return this._mainProduct.doorRail }
  set doorRail(v) { this._mainProduct.doorRail = v; this._reRender() }

  get doorRailIcon() { return this._mainProduct.doorRailIcon }
  set doorRailIcon(v) { this._mainProduct.doorRailIcon = v; this._reRender() }

  get horsepower() { return this._mainProduct.horsepower }
  set horsepower(v) { this._mainProduct.horsepower = v; this._reRender() }

  get qty() { return this._mainProduct.qty }
  set qty(v) { this._mainProduct.qty = v; this._reRender() }

  get unitPrice() { return this._mainProduct.unitPrice }
  set unitPrice(v) { console.log(v); this._mainProduct.unitPrice = v; this._reRender() }

  get priceSubTotal() { return this._mainProduct.priceSubTotal }
  set priceSubTotal(v) { this._mainProduct.priceSubTotal = v; this._reRender() }

  /** 防颱*/
  get typhoonProof() { return this._mainProduct.typhoonProof }
  set typhoonProof(v: boolean) { this._mainProduct.typhoonProof = v; this._reRender() }

  /** 彈射門*/
  get ejectionDoor() { return this._mainProduct.ejectionDoor }
  set ejectionDoor(v: boolean) { this._mainProduct.ejectionDoor = v; this._reRender() }

  get memo() { return this._mainProduct.memo }
  set memo(v) { this._mainProduct.memo = v; this._reRender() }

  // ------------------
  /** 門軌選項*/
  get doorRailOptions() {
    if (this.typhoonProof) return doorRail_antiTyphoon
    else return doorRail_normal
  }
  // ------------------

  addPart = () => {
    this._partArr.push(new Class_part(_.cloneDeep(emptyPart), this._reRender))
    this._reRender()
  }

  removePart = (index: number) => {
    this._partArr.splice(index, 1)
    this._reRender()
  }


  // ------------------
  get allData() {
    return {
      ...this._mainProduct,
      // pdf要的資料
      size: `${this.W || this.L} X ${this.h} + ${this.B}`,
      thickness: this.thickness,
      openType: this.openType,
    }
  }

  get postBody(): Tdata["mainProductArr"][number] {
    return {
      ... this._mainProduct,
      part: this._partArr.map((classPart) => classPart.postBody)
    }
  }
}

// =======================================================================
class Class_part {
  constructor(
    part: Tdata["mainProductArr"][0]["part"][0],
    reRender: TreRender
  ) {
    this._reRender = reRender
    this._part = part

  } // constructor
  private _reRender
  private _part

  get category() { return this._part.category }
  set category(v) { this._part.category = v; this._reRender() }

  get content() { return this._part.content }
  set content(v) { this._part.content = v; this._reRender() }

  get qty() { return this._part.qty }
  set qty(v) { this._part.qty = v; this._reRender() }

  get price() { return this._part.price }
  set price(v) { this._part.price = v; this._reRender() }

  get subTotalPrice() { return this._part.subTotalPrice }
  set subTotalPrice(v) { this._part.subTotalPrice = v; this._reRender() }

  get memo() { return this._part.memo }
  set memo(v) { this._part.memo = v; this._reRender() }


  get postBody(): Tdata["mainProductArr"][number]["part"][number] {
    return this._part
  }

  get allData() { return this._part }

} // Class_part
// =======================================================================
class Class_payInfo {
  constructor(reRender: () => void, payInfo: Tdata["payInfo"]) {
    this._reRender = reRender
    this._payInfo = payInfo

  }
  private _reRender
  private _payInfo

  get totalDiscount() { return this._payInfo.totalDiscount }
  set totalDiscount(v) { this._payInfo.totalDiscount = v; this._reRender() }

  get subTotal() { return this._payInfo.subTotal }
  set subTotal(v) { this._payInfo.subTotal = v; this._reRender() }

  get tax() { return this._payInfo.tax }
  set tax(v) { this._payInfo.tax = v; this._reRender() }

  get total() { return this._payInfo.total }
  set total(v) { this._payInfo.total = v; this._reRender() }

  get tradingLocation() { return this._payInfo.tradingLocation }
  set tradingLocation(v) { this._payInfo.tradingLocation = v; this._reRender() }

  get tradingDate() { return this._payInfo.tradingDate }
  set tradingDate(v) { this._payInfo.tradingDate = v; this._reRender() }

  // // @ts-ignore
  // get payWay(): typeof this._payInfo.payWay { return this._payInfo.payWay }
  // set payWay({ index, value }: { index: number, value: string }) {
  //   this._payInfo.payWay[index].value = value
  // }

  get payWay() { return this._payInfo.payWay }
  editPayWay = (index: number, v: string) => {
    this._payInfo.payWay[index].value = v;
    this._reRender()
  }
  addPayWay = (label: string) => {
    this._payInfo.payWay.push({ label, value: "" })
    this._reRender()
  }
  removePayWay = (index: number) => {
    this._payInfo.payWay.splice(index, 1)
    this._reRender()
  }
  // ----------------------------------------------------
  postBody = () => {
    return this._payInfo
  }

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
class Class_legacyQuotation {
  constructor(
    reRender: TreRender,
    data: Tdata,
    prodCellConfig: TprodCellConfig,
    partCellConfig: TpartCellConfig
  ) {
    this._quotaionDataOri = data
    this._reRender = reRender

    this.clientId = data.clientId
    this.quotationId = data.basicInfo.quotationId

    /**  報價單基本資料*/
    this.classBasicInfo
      = new Class_basicInfo(reRender, data.basicInfo, data.fakeClienProfile, this)
    /**  主產品設定 (包括材料配件設定) 裡面裝的是class*/
    this.mainProductArr =
      data.mainProductArr.map((mainProduct) => new Class_mainProduct(mainProduct, reRender))
    /**   付款資訊*/
    this.classPayInfo = new Class_payInfo(reRender, data.payInfo)
    /**  備註*/
    this.classMemo = new Class_listString(reRender, data.memoArr)
    /**  報價範圍*/
    this.classQuoteRange = new Class_listString(reRender, data.quoteRangeArr)
    /**  簽名*/
    this.classSignature = new Class_signature(reRender, data.signature)

    this.mainProdCellConfig = prodCellConfig
    this.partCellConfig = partCellConfig


  } // constructor

  private _quotaionDataOri
  readonly quotationId
  private _reRender
  /**用來判斷這是哪個class */
  identify = "legacy" as const
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
    // this.mainProductArr.push(new Class_mainProduct(emptyMainProd, this._reRender))
    this.mainProductArr.push(new Class_mainProduct(_.cloneDeep(emptyLegacyQuotation.mainProductArr[0]), this._reRender))
    this._activeMainProd = this.mainProductArr.length - 1
    this._reRender()
  }
  // ---------------------
  partCellConfig
  // ---------------------
  clientId
  // ---------------------

  get postData(): TlegacyQuotation {
    return {
      basicInfo: this.classBasicInfo.postBody,
      mainProductArr: this.mainProductArr.map((mp) => mp.postBody),
      payInfo: this.classPayInfo,
      signature: this.classSignature,
      clientId: this.clientId,
      memoArr: this.classMemo.stringArr,
      quoteRangeArr: this.classQuoteRange.stringArr,
    }
  }
  // ---------------------
} // Class_quotation




const useLegacyQuotation = (data: Tdata | undefined) => {
  const [render, setRender] = useState(0)
  const reRender: TreRender = () => setRender(state => state + 1)
  const checkData = () => {
    if (data) return new Class_legacyQuotation(
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
  Class_legacyQuotation,
  Class_basicInfo,
  Class_mainProduct,
  Class_part,
  Class_payInfo,
  Class_listString,
  useLegacyQuotation
}

const unexpectedOption = (v: string, icon?: string) => {
  if (icon) return { value: v, label: v, icon }
  return { value: v, label: v, }
}



// ==========================================================================

type TmainProdInputCellType =
  { [key in keyof Pick<Class_mainProduct,
    "idNumber" | "category" | "series" |
    "L" | "W" | "h" | "B" | "area" | "cai" |
    "doorType" | "material" | "surface" | "horsepower" |
    "qty" | "unitPrice" | "priceSubTotal" |
    "memo"
  >]
    : { type: "input" } }
type TmainProdSelectWithIconCellType =
  { [key in keyof Pick<Class_mainProduct, "doorRail">]: { type: "selectWithIcon" } }
type TmainProdCheckboxCellType =
  { [key in keyof Pick<Class_mainProduct, "ejectionDoor" | "typhoonProof">]
    : { type: "checkbox" } }

type TprodKeys = keyof (
  TmainProdInputCellType & TmainProdSelectWithIconCellType &
  TmainProdCheckboxCellType
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
  TmainProdInputCellType &
  TmainProdSelectWithIconCellType & TmainProdCheckboxCellType
}

function mainProdCellConfigOri(): TprodCellConfig {
  return {
    // 這個會影響一開始的排列順序
    keyList: [
      "idNumber", "category", "series",
      "L", "W", "h", "B", "area", "cai",
      "doorType", "material", "surface", "doorRail",
      "typhoonProof", "horsepower",
      "qty", "unitPrice", "priceSubTotal",
      "memo",
      "ejectionDoor",
    ],
    cellConfig: {
      // input
      idNumber: { id: "idNumber", label: "編號", width: "60px", type: "input" },
      category: { id: "category", label: "項目", width: "60px", type: "input" },
      L: { id: "L", label: "L(m)", width: "60px", type: "input", inputType: "number" },
      W: { id: "W", label: "W(m)", width: "60px", type: "input", inputType: "number" },
      h: { id: "h", label: "h(m)", width: "60px", type: "input", inputType: "number" },
      B: { id: "B", label: "B(m)", width: "60px", type: "input", inputType: "number" },
      qty: { id: "qty", label: "數量", width: "55px", type: "input", inputType: "number" },
      memo: { id: "memo", label: "備註", width: "90px", type: "input" },
      unitPrice: { id: "unitPrice", label: "單價", width: "120px", type: "input", inputType: "number" },
      priceSubTotal: { id: "priceSubTotal", label: "複價", width: "140px", type: "input", inputType: "number" },
      area: { id: "area", label: "面積", width: "60px", type: "input", inputType: "number" },
      cai: { id: "cai", label: "才數", width: "75px", type: "input", inputType: "number" },
      series: { id: "series", label: "報價別", width: "105px", type: "input" },
      doorType: { id: "doorType", label: "門型", width: "100px", type: "input" },
      material: { id: "material", label: "材料", width: "120px", type: "input" },
      surface: { id: "surface", label: "表面", width: "55px", type: "input" },
      horsepower: { id: "horsepower", label: "馬力", width: "90px", type: "input" },
      // selectWithIcon
      doorRail: { id: "doorRail", label: "門軌", width: "210px", type: "selectWithIcon" },
      // checkbox
      ejectionDoor: { id: "ejectionDoor", label: "彈射門", width: "60px", type: "checkbox" },
      typhoonProof: { id: "typhoonProof", label: "防颱", width: "60px", type: "checkbox" },
    }
  }
}

// =============================================================

type TpartInputCellType =
  { [key in keyof Pick<Class_part,
    "category" | "content" | "qty" |
    "price" | "subTotalPrice" | "memo"
  >]
    : { type: "input" } }

type TpartKeys = keyof (TpartInputCellType)

type TpartCellConfig = {
  keyList: TpartKeys[]
  cellConfig: {
    [key in TpartKeys]: {
      label: string
      width: string
      flex?: string
      inputType?: HTMLInputTypeAttribute
    }
  } & TpartInputCellType
}

const partCellConfigOri = (): TpartCellConfig => {
  return {
    keyList: [
      "category", "content", "qty",
      "price", "subTotalPrice", "memo",
    ],
    cellConfig: {
      "category": { label: "項目", width: "60px", type: "input" },
      "content": { label: "內容", width: "auto", flex: "auto", type: "input" },
      "qty": { label: "數量", width: "60px", type: "input" },
      "price": { label: "單價", width: "84px", type: "input" },
      "subTotalPrice": { label: "複價", width: "60px", type: "input" },
      "memo": { label: "備註", width: "60px", type: "input" },

    }
  }
}



// =============================================================
export type {
  // mainProduct
  TmainProdInputCellType,
  TmainProdSelectWithIconCellType, TmainProdCheckboxCellType,
  // part
  TpartInputCellType,
}


