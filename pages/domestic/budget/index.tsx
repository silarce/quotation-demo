import { useState } from 'react'
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
// fake
import { fakeApi_projectSimple } from 'fakeDatabase/fakeAPI/fakeQuotationSimpleArrApi';
// type
import { Toption } from "components/global/gear/select/select03"

// ===========================================
// 預算、投標、發包 的介面完全一樣，僅是取得之資料的狀態不同
// 點進去的報價單也一樣，僅是取得之資料的狀態不同
// 預算、投標、發包 的介面完全一樣，僅是取得之資料的狀態不同
// 點進去的報價單也一樣，僅是取得之資料的狀態不同
// 預算、投標、發包 的介面完全一樣，僅是取得之資料的狀態不同
// 點進去的報價單也一樣，僅是取得之資料的狀態不同
// 預算、投標、發包 的介面完全一樣，僅是取得之資料的狀態不同
// 點進去的報價單也一樣，僅是取得之資料的狀態不同

export default function Budget() {
  const router = useRouter()
  // 搜尋用的
  const [searchObj, setSearchObj] = useState<TsearchObj>({
    doorType: "",
    county: "",
    clientName: "",
    projectName: "",
  })

  // 資料
  const [projectSimple, setProjectSimple] = useState({ wrapper: fakeApi_projectSimple })
  const projectArr = projectSimple.wrapper.get({
    filter: {
      county: searchObj.county,
      clientName: searchObj.clientName,
      constructionName: searchObj.projectName,
    }
  })


  // ===================================================
  // panelList

  const searchTargetList = [
    {
      stateValue: optionsDoorType[0],
      options: optionsDoorType,
      placeholder: "選擇門型",
      width: "100px",
    },
    {
      stateValue: optionsCounty[0],
      options: optionsCounty,
      placeholder: "選擇地區",
      width: "80px",
    },
    {
      stateValue: "",
      placeholder: "請輸入客戶名稱",
    },
    {
      stateValue: "",
      placeholder: "請輸入專案名稱",
    },
  ]

  const doSearch = (valueArr: (string | Toption | null)[]) => {
    let [doorTypeOption, countyOption, clientName, projectName] = valueArr
    const doorType = (doorTypeOption as Toption).value
    const county = (countyOption as Toption).value
    clientName = clientName as string
    projectName = projectName as string
    setSearchObj({
      doorType,
      county,
      clientName,
      projectName,
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
        let newQuotationId = `${projectArr.length + 1}`.padStart(2, "0")
        newQuotationId = "S-110211-" + newQuotationId
        router.push({
          pathname: `/domestic/budget/quotation`,
          query: {
            quotationId: newQuotationId,
            isNewQuotation: true
          }
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
        <BudgeList budgetList={projectArr} />
      </div>
    </div>
  )
}
