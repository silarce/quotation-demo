import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import _ from "lodash"

// layer
import SubLayer from "components/Layer/SubLayer/SubLayer"
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
import { TsearchObj } from 'components/global/gear/HOC/searchBar/searchBar';
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
import { fakeApi_legacyProjectSimple } from "fakeDatabase/fakeAPI/fakeLegacyQuotationSimpleArrApi";
// ==================================================================

export default function LegacyContractIntegration() {
  const router = useRouter()
  // -----------------------------------------------------------------------
  // 搜尋用的 //這個資料不會render在畫面上
  // render在畫面上的是PageHeader02元件裡的狀態
  const [searchObj, setSearchObj] = useState<TsearchObj>({
    doorType: "",
    county: "",
    clientName: "",
    projectName: "",
  })
  // 資料
  const [projectSimple, setProjectSimple] = useState({ wrapper: fakeApi_legacyProjectSimple })
  const projectArr = projectSimple.wrapper.get({
    filter: {
      county: searchObj.county,
      clientName: searchObj.clientName,
      constructionName: searchObj.projectName,
    }
  })

  useEffect(() => {
    const { doorType, county, clientName, projectName, }
      = router.query as Record<string, string | undefined>
    setSearchObj({
      doorType: doorType ?? "",
      county: county ?? "",
      clientName: clientName ?? "",
      projectName: projectName ?? "",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query])

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
  const doSearch = (valueArr: (string | Toption | null)[]) => {
    const [doorTypeOption, countyOption, clientName, projectName] = valueArr;
    const query = _.cloneDeep(router.query);
    const params = [
      { key: "doorType", value: (doorTypeOption as Toption).value },
      { key: "county", value: (countyOption as Toption).value },
      { key: "clientName", value: clientName as string },
      { key: "projectName", value: projectName as string },
    ];
    params.forEach(({ key, value }) => {
      value = value.trim()
      if (value) query[key] = value;
      else delete query[key];
    });

    router.push({
      href: "",
      query,
    });
  };

  // -------------------------------------------------------
  const panelList: TpanelList = [
    {
      searchGroup: {
        searchTargetList,
        doSearch
      }
    },
    {
      type: "addButton",
      label: "新增報價單",
      onClick: () => {
        let newQuotationId = `${projectArr.length + 1}`.padStart(2, "0")
        newQuotationId = "S-110211-" + newQuotationId
        router.push({
          pathname: `/domestic/legacyContractIntegration/quotation`,
          query: {
            quotationId: newQuotationId,
            isNewQuotation: true
          }
        })
      }
    }
  ]

  return (
    <SubLayer>
      <PageHeader02 tag="舊合約" panelList={panelList} />
      <div>
        <Thead01 />
        <div>
          {projectArr.map((item, index) => {
            const quotationId = item.basicInfo.quotationId
            const href = {
              pathname: "/domestic/legacyContractIntegration/quotation/",
              query: { quotationId }
            }
            return (
              <TbodyItem01 key={index}
                projectData={item}
                isActive={false}
                openQuotation={() => { router.push(href) }}
              />
            )
          })}
        </div>
      </div>
    </SubLayer>
  )
}