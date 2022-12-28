import {
  ChangeEvent,
  useState
} from "react";


// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"
import { TsearchObj } from 'components/global/gear/HOC/searchBar/searchBar';

// components
import BudgeList from "components/page/domestic/budget/budgetList"
import ContractList from "components/page/domestic/contract/contractList";

// option
import { optionsCreator_doorType, Toption } from 'fakeDatabase/options/options';
import { optionsCreator_county } from 'fakeDatabase/options/countryAndDistrict';
const optionsDoorType = optionsCreator_doorType()
const optionsCounty = optionsCreator_county()
optionsDoorType.unshift({ value: "", label: "不拘" })
optionsCounty.unshift({ value: "", label: "不拘" })

// css
import style from "./contract.module.scss"

// fakeData
import { fakeContractListSimple } from "fakeDatabase/domestic/contractCombinder";

// ===========================================
// 合約列表單個項目展開裡的內容是追加追減項目
// 合約列表單個項目展開裡的內容是追加追減項目
// 合約列表單個項目展開裡的內容是追加追減項目
// 合約列表單個項目展開裡的內容是追加追減項目
// 合約列表單個項目展開裡的內容是追加追減項目
export default function Contract() {

  // ===================================================
  // panelList

  // 搜尋用的
  const [searchObj, setSearchObj] = useState<TsearchObj>({
    doorType: "",
    county: "",
    clientName: "",
    projectName: "",
  })

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
  const panelList: TpanelList = [{
    searchGroup
  }]

  // ===================================================

  return (
    <div className={style.container}>
      {/* header panel */}
      <PageHeader02 tag="合約" panelList={panelList} />
      {/*  */}
      <div className={style.mainContainer}>
        <ContractList contractList={fakeContractListSimple} searchObj={searchObj} />
      </div>
    </div>
  )
}