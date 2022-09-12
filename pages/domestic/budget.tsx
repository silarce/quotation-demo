import {
  ChangeEvent
  , useState
} from 'react'
import { useRouter } from "next/router";


// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"
import { TsearchObj } from 'components/global/gear/HOC/searchBar/searchBar';


// components
import BudgeList from "components/page/domestic/budget/budgetList"

// css
import style from "./budget.module.scss"

// fakeData
import { fakeBudgetListGroup } from 'fakeDatabase/domestic/budget/fakeBudgetListGroup';
// type
import { Toption } from "components/global/gear/select/select03"

// ===========================================

export default function Budget() {
  const router = useRouter()
  const { fakeBudgetList } = fakeBudgetListGroup

  // ===================================================
  // 搜尋用的
  const [searchObj, setSearchObj] = useState<TsearchObj>({
    doorType: "",
    country: "",
    clientName: "",
    projectName: "",
  })

  const [doorType, setDoorType] = useState(doorTypeOptions[0])
  const [country, setCountry] = useState(countryOptions[0])
  const [clientName, setClientName] = useState("")
  const [projectName, setProjectName] = useState("")

  const searchTargetList = [
    {
      stateValue: doorType,
      options: doorTypeOptions,
      placeholder: "選擇門型",
      width: "110px",
      onChange: (option: Toption | null) => {
        if (!option) return
        setDoorType(option)
      }
    },
    {
      stateValue: country,
      options: countryOptions,
      placeholder: "選擇城市",
      width: "110px",
      onChange: (option: Toption | null) => {
        if (!option) return
        setCountry(option)
      }
    },
    {
      stateValue: clientName,
      placeholder: "請輸入客戶名稱",
      onChange: (e: ChangeEvent<HTMLInputElement>) => setClientName(e.target.value)
    },
    {
      stateValue: projectName,
      placeholder: "請輸入專案名稱",
      onChange: (e: ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)
    },
  ]

  const doSearch = () => {
    setSearchObj({
      doorType: doorType.value,
      country: country.value,
      clientName: clientName,
      projectName: projectName,
    })
  }

  const searchGroup = {
    searchTargetList,
    doSearch
  }
  // -----------------------

  const panelList: TpanelList = [
    { searchGroup },
    {
      type: "addButton",
      label: "新增報價單",
      onClick: () => {
        let newQuotationId = `${fakeBudgetList.length + 1}`.padStart(2, "0")
        newQuotationId = "S-110211-" + newQuotationId
        router.push({
          pathname: `/domestic/contract/quotation/newQuotation`,
          query: { newQuotationId }
        })
      }
    },
  ]

  // ===================================================

  return (
    <div className={style.container}>
      {/* header panel */}
      <PageHeader02 tag="預算" panelList={panelList} />
      {/*  */}
      <div className={style.mainContainer}>
        <BudgeList budgetList={fakeBudgetList} searchObj={searchObj} />
      </div>
    </div>
  )
}

// ==========================================================
// ==========================================================
// ==========================================================
const doorTypeOptions: Toption[] = [
  { value: "", label: "不拘" },
  { value: "SJ-30287", label: "SJ-30287" },
  { value: "SJ-302", label: "SJ-302" },
  { value: "門型一", label: "門型一" },
  { value: "門型二", label: "門型二" },
  { value: "門型三", label: "門型三" },
]
const countryOptions: Toption[] = [
  { value: "", label: "不拘" },
  { value: "台北市", label: "台北市" },
  { value: "新北市", label: "新北市" },
  { value: "基隆縣", label: "基隆縣" },
  { value: "桃園市", label: "桃園市" },
  { value: "新竹縣", label: "新竹縣" },
  { value: "新竹市", label: "新竹市" },
  { value: "苗栗縣", label: "苗栗縣" },
  { value: "台中市", label: "台中市" },
]


// ==========================================================
