import { useState, useEffect } from 'react'
import { useRouter } from "next/router";
import _ from "lodash"
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02"
import { TsearchObj } from 'components/global/gear/HOC/searchBar/searchBar';

// components
import BudgeList from "components/page/domestic/budget/budgetList"

// css
import scss from "./budget.module.scss"

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
import { Toption } from "fakeDatabase/options/options"

type Trouter = ReturnType<typeof useRouter>

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
  const [projectSimple, setProjectSimple] = useState({ wrapper: fakeApi_projectSimple })
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


  // ----------------------------------------------------------
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

  const searchGroup = {
    searchTargetList,
    doSearch
  }

  // ----------------------------------------------------------

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

  // ----------------------------------------------------------

  return (
    <SubLayer>
      <PageHeader02 tag="預算" panelList={panelList} />
      <div >
        <ApprovalsBar router={router} />
        <BudgeList className="m-[4px] mt-0"
          budgetList={projectArr} />
      </div>
    </SubLayer>
  )
}

// ========================================================
// ========================================================
// ========================================================
// ========================================================

const ApprovalsBar = (
  { router }:
    { router: Trouter }
) => {
  const query = router.query
  const linkList = [
    {
      label: "待審核",
      href: {
        pathname: "",
        query: {
          ...query,
          approvalsStatus: "待審核"
        }
      },
      // isActive: query.approvalsStatus === "待審核"
      isActive: !query.approvalsStatus || query.approvalsStatus === "待審核"
    },
    {
      label: "審核中",
      href: {
        pathname: "",
        query: {
          ...query,
          approvalsStatus: "審核中"
        }
      },
      isActive: query.approvalsStatus === "審核中"
    },
    {
      label: "審核完成",
      href: {
        pathname: "",
        query: {
          ...query,
          approvalsStatus: "審核完成"
        }
      },
      isActive: query.approvalsStatus === "審核完成"
    },
  ]

  return (
    <div className={scss.approvalsBar}>
      <PageHeader02 linkList={linkList} />
    </div>
  )
}




