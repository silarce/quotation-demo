

import SubLayer from "components/Layer/SubLayer/SubLayer"
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"





// option
import { optionsCreator_doorType, Toption } from 'fakeDatabase/options/options';
import { optionsCreator_county } from 'fakeDatabase/options/countryAndDistrict';
const optionsDoorType = optionsCreator_doorType()
const optionsCounty = optionsCreator_county()
optionsDoorType.unshift({ value: "", label: "不拘" })
optionsCounty.unshift({ value: "", label: "不拘" })












export default function LegacyContractIntegration() {













  
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
        舊合約
      </div>
    </SubLayer>
  )


}