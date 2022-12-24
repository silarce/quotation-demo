// 產品列表
// 產品列表
// 產品列表
import { useState } from "react"

// component
import FilterPanel from "components/page/setting/productList/filterPanel/filterPanel"

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

  const checkProdClass = (value: TprodClassValues) => {
    const valueIndex
      = checkedProdClass.findIndex((item) => item === value)
    if (valueIndex === -1) checkedProdClass.push(value)
    else checkedProdClass.splice(valueIndex, 1)
    setCheckedProdClass([...checkedProdClass])
  }

const filterProps = {
  checkedProdClass,checkProdClass
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
          />

        </div>

        <div>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
          <h1>table</h1>
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

type TfakeData = {
  doorType: string
  prodClass: string
  part: string
  name: string
  length: number
  caliber: number // 口徑
  thickness: string //厚度
  expandHeight: number //展開門片高
  densityRatio: number // 密度比
}

const fakeData: TfakeData[] = [
  {
    doorType: "SJ-303AS",
    prodClass: "防火防煙捲門系列",
    part: "捲門片",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    doorType: "SJ-303AS",
    prodClass: "防火防煙捲門系列",
    part: "捲門片",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    doorType: "SJ-303AS",
    prodClass: "防火防煙捲門系列",
    part: "捲門片",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },
  {
    doorType: "SJ-303AS",
    prodClass: "防火防煙捲門系列",
    part: "捲門片",
    name: "一般型1.5t",
    length: 123,
    caliber: 123,
    thickness: "1.5t",
    expandHeight: 0.174,
    densityRatio: 7.63,
  },


]




// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================














