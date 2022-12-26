// 產品列表
// 產品列表
// 產品列表
import { useState } from "react"

// component
import FilterPanel from "components/page/setting/productList/filterPanel/filterPanel"
import ProductList_Table from "components/page/setting/productList/productList_Table/productList_Table"


// glogal gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"

// scss
import scss from "./productList.module.scss"



// ==============================================================================
export default function ProductList() {


  // ---------------------------------------------------------------------------
  const [checkedProdClass, setCheckedProdClass] = useState<TprodClassValues[]>([])
  const [checkedDoorType, setCheckedDoorType] = useState<TdoorTypeValues[]>([])
  const [checkedPart, setCheckedPart] = useState<TpartValues[]>([])
  // 因為要按下篩選按鈕才做篩選的行為，所以要另外建立一個狀態
  const [filterParams, setFilterParams]
    = useState({
      checkedProdClass: [...checkedProdClass],
      checkedDoorType: [...checkedDoorType],
      checkedPart: [...checkedPart],
    })

  // 點擊類別的checkBox
  const checkProdClass = (value: TprodClassValues) => {
    const valueIndex
      = checkedProdClass.findIndex((item) => item === value)
    if (valueIndex === -1) checkedProdClass.push(value)
    else checkedProdClass.splice(valueIndex, 1)
    setCheckedProdClass([...checkedProdClass])
  }
  // 點擊門型的checkBox
  const checkDoorType = (value: TdoorTypeValues) => {
    const valueIndex
      = checkedDoorType.findIndex((item) => item === value)
    if (valueIndex === -1) checkedDoorType.push(value)
    else checkedDoorType.splice(valueIndex, 1)
    setCheckedDoorType([...checkedDoorType])
  }
// 點擊顯示條件的checkBox
  const checkPark = (value: TpartValues) => {
    const valueIndex
      = checkedPart.findIndex((item) => item === value)
    if (valueIndex === -1) checkedPart.push(value)
    else checkedPart.splice(valueIndex, 1)
    setCheckedPart([...checkedPart])
  }

  // 篩選按鈕
  const filterConfirm = () => {
    setFilterParams({
      checkedProdClass: [...checkedProdClass],
      checkedDoorType: [...checkedDoorType],
      checkedPart: [...checkedPart],
    })
  }
  // 清除按鈕
  const filterClear = () => {
    setCheckedProdClass([]);
    setCheckedDoorType([]);
    setCheckedPart([]);
    setFilterParams({
      checkedProdClass: [],
      checkedDoorType: [],
      checkedPart: [],
    })
  }

  // 打包起來送進FilterPanel
  const filterCtrl: TfilterCtrl = {
    checkedProdClass, checkProdClass,
    checkedDoorType, checkDoorType,
    checkedPart, checkPark,
    filterConfirm, filterClear
  }

  // 送到ProductList_Table裡面做篩選
  const doFilter = (data: TfakeData) => {
    const { checkedProdClass, checkedDoorType, checkedPart } = filterParams
    const { prodClass, doorType, part, } = data
    let check01 = true
    if (checkedProdClass[0])
      check01 = !!checkedProdClass.find((item) => item === prodClass)
    let check02 = true
    if (checkedDoorType[0])
      check02 = !!checkedDoorType.find((item) => item === doorType)
    let check03 = true
    if (checkedPart[0])
      check03 = !!checkedPart.find((item) => item === part)

    if (check01 && check02 && check03) return true
    return false
  }


  // ---------------------------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: "inputSearch",
      placeholder: "請輸入搜尋內容",
      onClick: () => { }
    },
    {
      type: "addButton",
      label: "新增備註",
      onClick: () => { }
    },
  ]

  // ---------------------------------------------------------------------------
  return (
    <div className={scss.container}>
      <PageHeader02
        tag="產品列表"
        panelList={panelList}
      />

      <div className={scss.mainContainer}>
        <div>
          <FilterPanel
            prodClassOptions={prodClassOptions}
            doorTypeOptions={doorTypeOptions}
            partOptions={partOptions}
            filterCtrl={filterCtrl}
          />
        </div>
        <div>
          <ProductList_Table
            fakeData={fakeData}
            doFilter={doFilter}
          />
        </div>
      </div>

    </div>
  )
}

// ==============================================================================
type TprodClassValues =
  "防火防煙捲門系列" | "防水防洪門系列" | "抗風防颱捲門系列" | "廠辦管制門" |
  "圍牆大門" | "機庫門" | "客製化"

type TdoorTypeValues =
  "120A" | "SJ-312" | "SJ-302" | "SJ-303A" | "SJ-303AS" | "SJ-305D"

type TpartValues =
  "支板" | "捲門片" | "底座" | "電動機" | "門軌" |
  "配電箱及按鈕開關" | "門箱" | "安裝費(含送電及試車)" | "捲軸"

type TcheckOption<value> = {
  label: string
  value: value
}

const prodClassOptions: TcheckOption<TprodClassValues>[] = [
  { label: "防火防煙捲門系列", value: "防火防煙捲門系列" },
  { label: "防水防洪門系列", value: "防水防洪門系列" },
  { label: "抗風防颱捲門系列", value: "抗風防颱捲門系列" },
  { label: "廠辦管制門", value: "廠辦管制門" },
  { label: "圍牆大門", value: "圍牆大門" },
  { label: "機庫門", value: "機庫門" },
  { label: "客製化", value: "客製化" },
]
const doorTypeOptions: TcheckOption<TdoorTypeValues>[] = [
  { label: "120A", value: "120A" },
  { label: "SJ-312", value: "SJ-312" },
  { label: "SJ-302", value: "SJ-302" },
  { label: "SJ-303A", value: "SJ-303A" },
  { label: "SJ-303AS", value: "SJ-303AS" },
  { label: "SJ-305D", value: "SJ-305D" },
]
const partOptions: TcheckOption<TpartValues>[] = [
  { label: "支板", value: "支板" },
  { label: "底座", value: "底座" },
  { label: "門軌", value: "門軌" },
  { label: "門箱", value: "門箱" },
  { label: "捲軸", value: "捲軸" },
  { label: "捲門片", value: "捲門片" },
  { label: "電動機", value: "電動機" },
  { label: "配電箱及按鈕開關", value: "配電箱及按鈕開關" },
  { label: "安裝費(含送電及試車)", value: "安裝費(含送電及試車)" },
]



// ==============================================================================

export type TprodClassOptions = typeof prodClassOptions
export type TdoorTypeOptions = typeof doorTypeOptions
export type TpartOptions = typeof partOptions

export type TfilterCtrl = {
  checkedProdClass: TprodClassValues[]
  checkProdClass: (value: TprodClassValues) => void
  checkedDoorType: TdoorTypeValues[]
  checkDoorType: (value: TdoorTypeValues) => void
  checkedPart: TpartValues[]
  checkPark: (value: TpartValues) => void
  filterConfirm: () => void
  filterClear: () => void
}


// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================

export type TfakeData = {
  prodClass: string
  doorType: string
  part: string
  name: string
  // breach: string // 底座角鐵開口
  length: number
  caliber: number // 口徑
  thickness: string //厚度
  expandHeight: number //展開門片高
  densityRatio: number // 密度比
}

const fakeData: TfakeData[] = [
  {
    prodClass: "防火防煙捲門系列",
    doorType: "SJ-303AS",
    part: "捲門片",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "防水防洪門系列",
    doorType: "120A",
    part: "捲門片",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "防火防煙捲門系列",
    doorType: "SJ-302",
    part: "支板",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "防火防煙捲門系列",
    doorType: "SJ-303AS",
    part: "門箱",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "廠辦管制門",
    doorType: "SJ-303AS",
    part: "門箱",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "客製化",
    doorType: "SJ-305D",
    part: "電動機",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "圍牆大門",
    doorType: "SJ-302",
    part: "門箱",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "防水防洪門系列",
    doorType: "SJ-303A",
    part: "安裝費(含送電及試車)",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "防水防洪門系列",
    doorType: "120A",
    part: "配電箱及按鈕開關",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "防水防洪門系列",
    doorType: "SJ-305D",
    part: "捲門片",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "機庫門",
    doorType: "SJ-312",
    part: "門軌",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "防水防洪門系列",
    doorType: "SJ-303A",
    part: "電動機",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "圍牆大門",
    doorType: "SJ-303AS",
    part: "支板",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    prodClass: "防火防煙捲門系列",
    doorType: "SJ-312",
    part: "捲門片",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
]




