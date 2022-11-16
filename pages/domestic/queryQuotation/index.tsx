
import {
  ChangeEvent
  , useState
} from 'react'
import { useRouter } from "next/router";


// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"
import { TsearchObj } from 'components/global/gear/HOC/searchBar/searchBar';


// components
// import BudgeList from "components/page/domestic/budget/budgetList"
import QueryQuotationList from 'components/page/domestic/queryQuotation/queryQuotationList';
// css
import style from "./queryQuotation.module.scss"

// fakeData
import { fakeBudgetListGroup } from 'fakeDatabase/domestic/budget/fakeBudgetListGroup';
// type
// import { Toption } from "components/global/gear/select/select03"

// ===========================================

export default function Budget() {
  const router = useRouter()
  const { fakeBudgetList } = fakeBudgetListGroup

  // ===================================================
  // 搜尋用的
  const [searchObj, setSearchObj] = useState<TsearchObj>({
    queryQuotationId: "",
  })



  const [queryQuotationId, setQueryQuotationId] = useState("")

  const searchTargetList = [
    {
      stateValue: queryQuotationId,
      placeholder: "請輸入報價單編號",
      onChange: (e: ChangeEvent<HTMLInputElement>) => setQueryQuotationId(e.target.value)
    },
  ]

  const doSearch = () => {
    setSearchObj({
      queryQuotationId: queryQuotationId,
    })
  }

  const searchGroup = {
    searchTargetList,
    doSearch
  }
  // -----------------------

  const panelList: TpanelList = [
    { searchGroup },
  ]

  // ===================================================

  return (
    <div className={style.container}>
      {/* header panel */}
      <PageHeader02 tag="報價單列表" panelList={panelList} />
      {/*  */}
      <div className={style.mainContainer}>
        <QueryQuotationList
          queryQuotationList={queryQuotationList}
          searchObj={searchObj}
        />
      </div>
    </div>
  )
}

// ==========================================================
// ==========================================================
// ==========================================================


type TqueryQuotation = {
  queryQuotationId: string
  contactPerson: string
  phone: string
  stepList: {
    step: string
    date: string
    clientName: string
  }[]
}

export type { TqueryQuotation }


// ==========================================================
// ==========================================================
// ==========================================================


// fakeData
const queryQuotationListOri = (): TqueryQuotation[] => [
  {
    queryQuotationId: "M-220222-01",
    contactPerson: "李曉明",
    phone: "0987654321",
    stepList: [
      {
        step: "合約",
        date: "111-02-02",
        clientName: "新加坡商犀牛頓科技股份有限公司"
      },
      {
        step: "發包",
        date: "111-12-17",
        clientName: "新加坡商犀牛頓科技股份有限公司"
      },
      {
        step: "投標",
        date: "111-10-23",
        clientName: "新加坡商犀牛頓科技股份有限公司"
      },
      {
        step: "預算",
        date: "110-08-10",
        clientName: "新加坡商犀牛頓科技股份有限公司"
      },
    ]
  },
  {
    queryQuotationId: "M-220222-01",
    contactPerson: "李曉明小華",
    phone: "0987123456",
    stepList: [
      {
        step: "發包",
        date: "110-05-07",
        clientName: "英屬維京群島商加勒比貿易股份有限公司台灣分公司"
      },
      {
        step: "投標",
        date: "110-02-20",
        clientName: "英屬維京群島商加勒比貿易股份有限公司台灣分公司"
      },
      {
        step: "預算",
        date: "110-01-04",
        clientName: "英屬維京群島商加勒比貿易股份有限公司台灣分公司"
      },
    ]
  },
  {
    queryQuotationId: "M-220222-01",
    contactPerson: "李曉",
    phone: "0911223344",
    stepList: [
      {
        step: "投標",
        date: "109-07-02",
        clientName: "尚比亞商大象皮成衣股份有限公司"
      },
      {
        step: "預算",
        date: "109-08-09",
        clientName: "尚比亞商大象皮成衣股份有限公司"
      },
    ]
  },
]

const queryQuotationList: TqueryQuotation[] =
  queryQuotationListOri()
    .concat(queryQuotationListOri())
    .concat(queryQuotationListOri())
    .concat(queryQuotationListOri())
    .concat(queryQuotationListOri())
    .concat(queryQuotationListOri())

queryQuotationList.forEach((item, index) => {
  item.queryQuotationId = `M-220222-${`${index + 1}`.padStart(2, "0")}`
})





