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

// option
import { optionsCreator_doorType } from 'fakeDatabase/options/options';
import { optionsCreator_county } from 'fakeDatabase/options/countryAndDistrict';
const optionsDoorType = optionsCreator_doorType()
const optionsCounty = optionsCreator_county()
optionsDoorType.unshift({ value: "", label: "不拘" })
optionsCounty.unshift({ value: "", label: "不拘" })


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

  const [doorType, setDoorType] = useState(optionsDoorType[0])
  const [country, setCountry] = useState(optionsCounty[0])
  const [clientName, setClientName] = useState("")
  const [projectName, setProjectName] = useState("")

  const searchTargetList = [
    {
      stateValue: doorType,
      options: optionsDoorType,
      placeholder: "選擇門型",
      width: "100px",
      onChange: (option: Toption | null) => {
        if (!option) return
        setDoorType(option)
      }
    },
    {
      stateValue: country,
      options: optionsCounty,
      placeholder: "選擇地區",
      width: "80px",
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
          pathname: `/domestic/budget/quotation/newQuotation`,
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


// ==========================================================
