import { useState, HTMLInputTypeAttribute } from "react"
import _ from "lodash"
import Decimal from "decimal.js"
import moment from "moment"

import myAlert from "components/global/gear/modal/simpleModal/alertModals"
import { checkDateFormat } from "js/tools/date/checkDate"
import { yearConversion_chToStandard } from "js/tools/date/yearConversion_chToStandard"
import { yearConversion_standardToCh } from "js/tools/date/yearConversion_standardToCh"

import {
  optionsCre_doorTrack_normal, optionsCre_doorTrack_typhoonProtection
} from "js/utils/options/doorTrackOptions"

import {
  TlegacyContractDto, TcreateLegacyContractDto,
  TlegacyContractProductDto, TcreateLegacyContractProductDto,
  TlegacyContractAdditionDto, TcreateLegacyContractAdditionDto, TcustomerDto,
} from "js/api/dtoTypes"

const options_doorTrack_normal = optionsCre_doorTrack_normal()
const options_doorTrack_typhoonProtection = optionsCre_doorTrack_typhoonProtection()

type TreRender = () => void

// =======================================================================
class Class_basicInfo {
  constructor(
    reRender: TreRender,
    legacyContract: TlegacyContractDto | TemptyLegacyContract
  ) {
    this._reRender = reRender
    this._legacyContract = legacyContract
    this._legacyContract.quoteDate = (() => {
      if (!this._legacyContract.quoteDate) return ""
      const quoteDate = moment(this._legacyContract.quoteDate).format("YYYY-MM-DD")
      return yearConversion_standardToCh(quoteDate ?? "", true)
    })()
    this._legacyContract.deliveryDate = (() => {
      if (!this._legacyContract.deliveryDate) return ""
      const deliveryDate = moment(this._legacyContract.deliveryDate).format("YYYY-MM-DD")
      return yearConversion_standardToCh(deliveryDate ?? "", true)
    })()
  }

  private _reRender
  private _legacyContract

  get contractNumber() { return this._legacyContract.contractNumber }
  set contractNumber(v) { this._legacyContract.contractNumber = v; this._reRender() }

  get quoteValidity() { return this._legacyContract.quoteValidity }
  set quoteValidity(v) { this._legacyContract.quoteValidity = v; this._reRender() }

  get quoteDate() { return this._legacyContract.quoteDate }
  set quoteDate(v) { this._legacyContract.quoteDate = v; this._reRender() }

  get projectName() { return this._legacyContract.projectName }
  set projectName(v) { this._legacyContract.projectName = v; this._reRender() }

  get customerName() { return this._legacyContract.customerName }
  set customerName(v) { this._legacyContract.customerName = v; this._reRender() }

  get contactPerson() { return this._legacyContract.contactPerson }
  set contactPerson(v) { this._legacyContract.contactPerson = v; this._reRender() }

  get contactNumber() { return this._legacyContract.contactNumber }
  set contactNumber(v) { this._legacyContract.contactNumber = v; this._reRender() }

  get faxNumber() { return this._legacyContract.faxNumber }
  set faxNumber(v) { this._legacyContract.faxNumber = v; this._reRender() }

  get trackingStatus() { return this._legacyContract.trackingStatus }
  set trackingStatus(v) { this._legacyContract.trackingStatus = v; this._reRender() }

  get projectProgress() { return this._legacyContract.projectProgress }
  set projectProgress(v) { this._legacyContract.projectProgress = v; this._reRender() }

  get projectCity() { return this._legacyContract.projectCity }
  set projectCity(v) { this._legacyContract.projectCity = v; this._reRender() }

  get projectDistrict() { return this._legacyContract.projectDistrict }
  set projectDistrict(v) { this._legacyContract.projectDistrict = v; this._reRender() }

  get projectAddress() { return this._legacyContract.projectAddress }
  set projectAddress(v) { this._legacyContract.projectAddress = v; this._reRender() }

}



// =======================================================================
/**單一個product */
class Class_product {
  constructor(
    reRender: TreRender,
    legacyProduct: TlegacyContractProductDto | TcreateLegacyContractProductDto
  ) {
    this._reRender = reRender
    this._product = legacyProduct
  } // constructor

  private _reRender
  private _product

  // 這兩個資料出現在PDF中，但是沒出現在主產品設定中
  // 目前還沒接api，先用寫死的假資料
  // thickness = "1.50t" //厚度
  readonly openType = "電動"

  readonly options_doorTrack_normal = options_doorTrack_normal
  readonly options_doorTrack_typhoonProtection = options_doorTrack_typhoonProtection

  get options_doorTrack() {
    if (this.typhoonProtection) return this.options_doorTrack_typhoonProtection
    else return this.options_doorTrack_normal
  }

  get id() {
    if ("id" in this._product) return this._product.id
    return undefined
  }

  get idNumber() { return this._product.idNumber.toString() }
  set idNumber(v) { this._product.idNumber = parseFloat(v); this._reRender() }

  get itemName() { return this._product.itemName }
  set itemName(v) { this._product.itemName = v; this._reRender() }

  get quoteType() { return this._product.quoteType }
  set quoteType(v) { this._product.quoteType = v; this._reRender() }

  get doorType() { return this._product.doorType }
  set doorType(v) { this._product.doorType = v; this._reRender() }

  get length() { return this._product.length.toString() }
  set length(v) { this._product.length = parseFloat(v); this._reRender() }

  get width() { return this._product.width.toString() }
  set width(v) { this._product.width = parseFloat(v); this._reRender() }

  get height() { return this._product.height.toString() }
  set height(v) { this._product.height = parseFloat(v); this._reRender() }

  get thickness() { return this._product.thickness.toString() }
  set thickness(v) { this._product.thickness = parseFloat(v); this._reRender() }

  get area() { return this._product.area }
  set area(v) { this._product.area = v; this._reRender() }

  get volume() { return this._product.volume }
  set volume(v) { this._product.volume = v; this._reRender() }

  get material() { return this._product.material }
  set material(v) { this._product.material = v; this._reRender() }

  get surface() { return this._product.surface }
  set surface(v) { this._product.surface = v; this._reRender() }

  get doorTrack() { return this._product.doorTrack }
  set doorTrack(v) { this._product.doorTrack = v; this._reRender() }

  get horsepower() { return this._product.horsepower }
  set horsepower(v) { this._product.horsepower = v; this._reRender() }

  get quantity() { return this._product.quantity.toString() }
  set quantity(v) { this._product.quantity = parseFloat(v); this._reRender() }

  get unitPrice() { return this._product.unitPrice.toString() }
  set unitPrice(v) { this._product.unitPrice = parseFloat(v); this._reRender() }

  get totalPrice() { return this._product.totalPrice.toString() }
  set totalPrice(v) { this._product.totalPrice = parseFloat(v); this._reRender() }

  get typhoonProtection() { return this._product.typhoonProtection }
  set typhoonProtection(v) {
    this._product.typhoonProtection = v;
    this._product.doorTrack = ""
    this._reRender()
  }

  get bounceDoor() { return this._product.bounceDoor }
  set bounceDoor(v) { this._product.bounceDoor = v; this._reRender() }

  get notes() { return this._product.notes }
  set notes(v) { this._product.notes = v; this._reRender() }

  get postProd() { return this._product }
}

// =======================================================================
/**單一個addition */
class Class_addition {
  constructor(
    reRender: TreRender,
    // addition: TlegacyContractDto["additions"][number]
    addition: TlegacyContractAdditionDto | TcreateLegacyContractAdditionDto
  ) {
    this._reRender = reRender
    this._addition = addition

  } // constructor
  private _reRender
  private _addition

  get id() {
    if ("id" in this._addition) return this._addition.id
    return undefined
  }

  get itemIndex() { return this._addition.itemIndex.toString() }
  set itemIndex(v) { this._addition.itemIndex = parseFloat(v); this._reRender() }

  get content() { return this._addition.content }
  set content(v) { this._addition.content = v; this._reRender() }

  get quantity() { return this._addition.quantity.toString() }
  set quantity(v) { this._addition.quantity = parseFloat(v); this._reRender() }

  get unitPrice() { return this._addition.unitPrice.toString() }
  set unitPrice(v) { this._addition.unitPrice = parseFloat(v); this._reRender() }

  get totalPrice() { return this._addition.totalPrice.toString() }
  set totalPrice(v) { this._addition.totalPrice = parseFloat(v); this._reRender() }

  get notes() { return this._addition.notes }
  set notes(v) { this._addition.notes = v; this._reRender() }

  get postAddition() { return this._addition }

} // Class_part
// =======================================================================
class Class_payInfo {
  constructor(
    reRender: () => void,
    legacyContract: TlegacyContractDto | TemptyLegacyContract
  ) {
    this._reRender = reRender
    this._legacyContract = legacyContract
  }
  private _reRender
  private _legacyContract

  get discountRate() {
    // return Decimal.mul(this._legacyContract.discountRate || "0", 100).toString()
    return this._legacyContract.discountRate
  }
  set discountRate(v) {
    // if (!v) v = "0"
    // this._legacyContract.discountRate = Decimal.div(v, 100).toString();
    this._legacyContract.discountRate = v;
    this._reRender()
  }


  get subTotal() { return this._legacyContract.subTotal.toString() }
  set subTotal(v) { this._legacyContract.subTotal = parseFloat(v); this._reRender() }

  get salesTax() { return this._legacyContract.salesTax.toString() }
  set salesTax(v) { this._legacyContract.salesTax = parseFloat(v); this._reRender() }

  get total() { return this._legacyContract.total.toString() }
  set total(v) { this._legacyContract.total = parseFloat(v); this._reRender() }

  get deliveryLocation() { return this._legacyContract.deliveryLocation }
  set deliveryLocation(v) { this._legacyContract.deliveryLocation = v; this._reRender() }

  get deliveryDate() { return this._legacyContract.deliveryDate }
  set deliveryDate(v) { this._legacyContract.deliveryDate = v; this._reRender() }

  get paymentMethods() { return this._legacyContract.paymentMethods }
  editPayMethod = (index: number, v: string) => {
    this._legacyContract.paymentMethods[index].totalPaymentRatio = v;
    this._reRender()
  }
  addPayMethod = (milestone: string) => {
    this._legacyContract.paymentMethods.push({ milestone, totalPaymentRatio: "0" })
    this._reRender()
  }
  removePayMethod = (index: number) => {
    this._legacyContract.paymentMethods.splice(index, 1)
    this._reRender()
  }
} // Class_payInfo

// =======================================================================

/**備註notes與報價範圍quoteScopes*/
class Class_listString {
  constructor(
    reRender: () => void,
    stringArr: (TlegacyContractDto | TemptyLegacyContract)["notes" | "quoteScopes"]
  ) {
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
  constructor(
    reRender: () => void,
    legacyContract: TlegacyContractDto | TemptyLegacyContract
  ) {
    this._reRender = reRender
    this._legacyContract = legacyContract
  }
  private _reRender
  private _legacyContract

  // 經理
  get managerName() { return this._legacyContract.managerName }
  set managerName(v: string) { this._legacyContract.managerName = v; this._reRender() }

  // 主管
  get supervisorName() { return this._legacyContract.supervisorName }
  set supervisorName(v: string) { this._legacyContract.supervisorName = v; this._reRender() }

  // 經辦人
  get operatorName() { return this._legacyContract.operatorName }
  set operatorName(v: string) { this._legacyContract.operatorName = v; this._reRender() }
} // Class_signature

// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
class Class_legacyContract {
  constructor(
    reRender: TreRender,
    legacyContract: (TlegacyContractDto | TemptyLegacyContract) & { customer?: TcustomerDto | undefined },
    prodCellConfig: TprodCellConfig,
    additionCellConfig: TadditionCellConfig
  ) {
    this._legacyContract = legacyContract
    this._reRender = reRender

    /**  報價單基本資料*/
    this.classBasicInfo
      = new Class_basicInfo(reRender, this._legacyContract)
    /**  主產品設定 (包括材料配件設定) 裡面裝的是class*/
    this.classProductArr =
      this._legacyContract.products.map((product) => new Class_product(reRender, product))
    /**額外項目 */
    this.classAdditionArr =
      this._legacyContract.additions.map((addition) => new Class_addition(reRender, addition))
    /**   付款資訊*/
    this.classPayInfo = new Class_payInfo(reRender, this._legacyContract)
    /**  備註*/
    this.classMemo = new Class_listString(reRender, this._legacyContract.notes)
    /**  報價範圍*/
    this.classQuoteRange = new Class_listString(reRender, this._legacyContract.quoteScopes)
    /**  簽名*/
    this.classSignature = new Class_signature(reRender, this._legacyContract)

    this.prodCellConfig = prodCellConfig
    this.additionCellConfig = additionCellConfig

  } // constructor

  private _legacyContract
  private _reRender
  /**用來判斷這是哪個class */
  identify = "legacy" as const
  // ---------------------
  classBasicInfo
  classProductArr
  classAdditionArr
  classPayInfo
  classMemo
  classQuoteRange
  classSignature
  // ---------------------

  get customer() {
    return this._legacyContract.customer
  }
  set customer(v) {
    this._legacyContract.customer = v
    this._reRender()
  }

  // ---------------------
  get prodkeyList() {
    return this.prodCellConfig.keyList
  }
  set prodkeyList(v) {
    this.prodCellConfig.keyList = v
    this._reRender()
  }

  private _activeProd = -1 // 被選中的mainProduct的index
  get activeProd() { return this._activeProd }
  set activeProd(v) {
    this._activeProd = v
    this._reRender()
  }

  delProd = (index: number) => {
    this.classProductArr.splice(index, 1)
    this.activeProd = -1
    this._reRender()
  }
  copyProd = (index: number) => {
    this.classProductArr.push(_.cloneDeep(this.classProductArr[index]))
    this.activeProd = index
    this._reRender()
  }
  addProd = () => {
    this.classProductArr.push(new Class_product(this._reRender, emptyProdCre()))
    this._activeProd = this.classProductArr.length - 1
    this._reRender()
  }

  delAddition = (index: number) => {
    this.classAdditionArr.splice(index, 1)
    this._reRender()
  }
  copyAddition = (index: number) => {
    this.classAdditionArr.push(_.cloneDeep(this.classAdditionArr[index]))
    this._reRender()
  }
  addAddition = () => {
    this.classAdditionArr.push(new Class_addition(this._reRender, emptyAdditionCre()))
    this._reRender()
  }

  // ---------------------
  prodCellConfig  // dnd head的狀態，也是資料分類目錄
  additionCellConfig
  // ---------------------

  get postBody(): TcreateLegacyContractDto | false {
    const customerId = (() => {
      return this._legacyContract.customer?.id
    })()
    if (!customerId) { myAlert.warning({ title: "沒有選擇客戶" }); return false }

    const { quoteDate, deliveryDate, } = this._legacyContract

    if (!checkDateFormat(quoteDate as string ?? "", "tw")) {
      myAlert.warning({ title: "報價日期格式錯誤", content: "格式例:100-01-01" }); return false
    }
    if (!checkDateFormat(deliveryDate as string ?? "", "tw")) {
      myAlert.warning({ title: "交貨日期格式錯誤", content: "格式例:100-01-01" }); return false
    }


    const legacyContractCopy = _.cloneDeep(this._legacyContract)

    legacyContractCopy.products = this.classProductArr.map((prod) => prod.postProd)
    legacyContractCopy.additions = this.classAdditionArr.map((prod) => prod.postAddition)

    const quoteDate_Date
      = new Date(yearConversion_chToStandard(legacyContractCopy.quoteDate as string) as string)

    const deliveryDate_Date
      = new Date(yearConversion_chToStandard(legacyContractCopy.deliveryDate as string) as string)

    legacyContractCopy.discountRate
      = Decimal.div(legacyContractCopy.discountRate, 100).toString()

    legacyContractCopy.paymentMethods.forEach((item) => {
      item.totalPaymentRatio = Decimal.div(item.totalPaymentRatio, 100).toString()
    })

    return {
      ...legacyContractCopy,
      customerId,
      quoteDate: quoteDate_Date,
      deliveryDate: deliveryDate_Date,
    }
  }
  // ---------------------
} // Class_legacyContract


const useLegacyContract = (data: TlegacyContractDto | undefined) => {
  const [render, setRender] = useState(0)
  const reRender: TreRender = () => setRender(state => state + 1)

  const checkData = () => {
    return new Class_legacyContract(
      reRender,
      _.cloneDeep(data) ?? emptyLegacyContract(),
      prodCellConfigCre(),
      additionCellConfigCre()
    )
  }
  // 回朔到修改前的狀態
  const rewind = () => {
    setClassLegacyContract(checkData())
  }

  const [classLegacyContract, setClassLegacyContract] = useState(checkData())
  return { classLegacyContract, rewind }
}

export {
  Class_legacyContract,
  Class_basicInfo,
  Class_product,
  Class_addition,
  Class_payInfo,
  Class_listString,
  useLegacyContract
}

// 這是什麼?
const unexpectedOption = (v: string, icon?: string) => {
  if (icon) return { value: v, label: v, icon }
  return { value: v, label: v, }
}



// ==========================================================================

type TprodInputCellType =
  { [key in keyof Pick<Class_product,
    "idNumber" | "itemName" | "quoteType" | "doorType" |
    "length" | "width" | "height" | "thickness" | "area" | "volume" |
    "material" | "surface" | "horsepower" |
    "quantity" | "unitPrice" | "totalPrice" |
    "notes"
  >]: { type: "input" } }

type TprodSelectWithIconCellType =
  { [key in keyof Pick<Class_product, "doorTrack">]: { type: "selectWithIcon" } }
type TprodCheckboxCellType =
  { [key in keyof Pick<Class_product, "bounceDoor" | "typhoonProtection">]
    : { type: "checkbox" } }

type TprodKeys = keyof (
  TprodInputCellType & TprodSelectWithIconCellType &
  TprodCheckboxCellType
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
  TprodInputCellType &
  TprodSelectWithIconCellType & TprodCheckboxCellType
}

function prodCellConfigCre(): TprodCellConfig {
  return {
    // 這個會影響一開始的排列順序
    keyList: [
      "idNumber", "itemName", "quoteType",
      "length", "width", "height", "thickness", "area", "volume",
      "doorType", "material", "surface", "doorTrack",
      "typhoonProtection", "horsepower",
      "quantity", "unitPrice", "totalPrice",
      "notes",
      "bounceDoor",
    ],
    cellConfig: {
      // input
      idNumber: { id: "idNumber", label: "編號", width: "100px", type: "input", inputType: "number" },
      itemName: { id: "itemName", label: "項目", width: "60px", type: "input" },
      quoteType: { id: "quoteType", label: "報價別", width: "105px", type: "input" },
      doorType: { id: "doorType", label: "門型", width: "100px", type: "input" },
      length: { id: "length", label: "L(m)", width: "60px", type: "input", inputType: "number" },
      width: { id: "width", label: "W(m)", width: "60px", type: "input", inputType: "number" },
      height: { id: "height", label: "h(m)", width: "60px", type: "input", inputType: "number" },
      thickness: { id: "thickness", label: "B(m)", width: "60px", type: "input", inputType: "number" },
      area: { id: "area", label: "面積", width: "60px", type: "input" },
      volume: { id: "volume", label: "才數", width: "75px", type: "input" },
      material: { id: "material", label: "材料", width: "120px", type: "input" },
      surface: { id: "surface", label: "表面", width: "55px", type: "input" },
      doorTrack: { id: "doorTrack", label: "門軌", width: "300px", type: "selectWithIcon" },
      horsepower: { id: "horsepower", label: "馬力", width: "90px", type: "input" },
      quantity: { id: "quantity", label: "數量", width: "55px", type: "input", inputType: "number" },
      unitPrice: { id: "unitPrice", label: "單價", width: "120px", type: "input", inputType: "number" },
      totalPrice: { id: "totalPrice", label: "複價", width: "140px", type: "input", inputType: "number" },
      typhoonProtection: { id: "typhoonProtection", label: "防颱", width: "60px", type: "checkbox" },
      bounceDoor: { id: "bounceDoor", label: "彈射門", width: "60px", type: "checkbox" },
      notes: { id: "notes", label: "備註", width: "90px", type: "input" },
    }
  }
}

// =============================================================

type TaddtionInputCellType =
  { [key in keyof Pick<Class_addition,
    "itemIndex" | "content" | "quantity" |
    "unitPrice" | "totalPrice" | "notes"
  >]: { type: "input" } }

type TadditionKeys = keyof (TaddtionInputCellType)

type TadditionCellConfig = {
  keyList: TadditionKeys[]
  cellConfig: {
    [key in TadditionKeys]: {
      label: string
      width: string
      flex?: string
      inputType?: HTMLInputTypeAttribute
    }
  } & TaddtionInputCellType
}

const additionCellConfigCre = (): TadditionCellConfig => {
  return {
    keyList: [
      "itemIndex", "content", "quantity",
      "unitPrice", "totalPrice", "notes",
    ],
    cellConfig: {
      "itemIndex": { label: "項目", width: "60px", type: "input" },
      "content": { label: "內容", width: "auto", flex: "auto", type: "input" },
      "quantity": { label: "數量", width: "60px", type: "input" },
      "unitPrice": { label: "單價", width: "110px", type: "input" },
      "totalPrice": { label: "複價", width: "110px", type: "input" },
      "notes": { label: "備註", width: "170px", type: "input" },

    }
  }
}



// =============================================================
export type {
  // mainProduct
  TprodInputCellType,
  TprodSelectWithIconCellType, TprodCheckboxCellType,
  // addition
  TaddtionInputCellType,
}


// ===================================================================




const emptyProdCre = (): TcreateLegacyContractProductDto => {
  return {
    idNumber: 0,
    itemName: "",
    quoteType: "",
    doorType: "",
    length: 0,
    width: 0,
    height: 0,
    thickness: 0,
    area: "",
    volume: "",
    material: "",
    surface: "",
    doorTrack: "",
    horsepower: "",
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    typhoonProtection: false,
    bounceDoor: false,
    notes: "",
  }
}

const emptyAdditionCre = (): TcreateLegacyContractAdditionDto => {
  return {
    itemIndex: 0,
    content: "",
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    notes: "",
  }
}


type TemptyLegacyContract =
  Omit<TcreateLegacyContractDto, "deliveryDate"> &
  { deliveryDate: TcreateLegacyContractDto["deliveryDate"] | string }


// const emptyLegacyContract = (): TcreateLegacyContractDto => {
const emptyLegacyContract = (): TemptyLegacyContract => {
  return {
    customerId: "",
    contractNumber: "",
    quoteValidity: null,
    quoteDate: null,
    projectName: "",
    customerName: "",
    contactPerson: "",
    contactNumber: "",
    faxNumber: null,
    trackingStatus: null,
    projectProgress: null,
    projectCity: "",
    projectDistrict: "",
    projectAddress: "",
    discountRate: "0",
    subTotal: 0,
    salesTax: 0,
    total: 0,
    deliveryLocation: "",
    deliveryDate: "",
    paymentMethods: [],
    notes: [],
    quoteScopes: [],
    managerName: "",
    supervisorName: "",
    operatorName: "",
    products: [],
    additions: [],
  }
}



