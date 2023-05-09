import { useState } from "react";


// layer
import SubLayer from "components/Layer/SubLayer/SubLayer"
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
// component
import Thead01 from "components/page/domestic/ui/table01/Thead01";
import TbodyItem01 from "components/page/domestic/ui/table01/TbodyItem01";



// option
import { optionsCreator_doorType, Toption } from 'fakeDatabase/options/options';
import { optionsCreator_county } from 'fakeDatabase/options/countryAndDistrict';
const optionsDoorType = optionsCreator_doorType()
const optionsCounty = optionsCreator_county()
optionsDoorType.unshift({ value: "", label: "不拘" })
optionsCounty.unshift({ value: "", label: "不拘" })



// fake data
import { fakeApi_projectSimple } from 'fakeDatabase/fakeAPI/fakeQuotationSimpleArrApi';

// ================================================================
// type
type TbudgetList = ReturnType<(typeof fakeApi_projectSimple)["get"]>
type TbudgetListContext = {
  approvalsStatus: TbudgetList[number]["basicInfo"]["approvalStatus"]
}




// ==================================================================

export default function LegacyContractIntegration() {


  // 資料
  const [projectSimple, setProjectSimple] = useState({ wrapper: fakeApi_projectSimple })
  const projectArr = projectSimple.wrapper.get({
    // filter: {
    //   county: searchObj.county,
    //   clientName: searchObj.clientName,
    //   constructionName: searchObj.projectName,
    // }
  })

  // --------------------------------------------------------------------

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
  const onSearch = (valueArr: (string | Toption | null)[]) => {
    console.log(valueArr)
  }


  // -------------------------------------------------------
  const panelList: TpanelList = [
    {
      searchGroup: {
        searchTargetList,
        doSearch: onSearch
      }
    },
    {
      type: "addButton",
      label: "新增報價單",
      onClick: () => { },
    }
  ]

  return (
    <SubLayer>
      <PageHeader02 tag="舊合約" panelList={panelList} />
      <div>
        <Thead01 />
        <div>
          {projectArr.map((item, index) => {
            return (
              <TbodyItem01 key={index}
                projectData={item}
                isActive={false}
                openQuotation={() => { alert("test") }}
              />
            )
          })}
        </div>
      </div>
    </SubLayer>
  )
}