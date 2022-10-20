


import {
  ChangeEvent, Dispatch, SetStateAction,
  useState, useMemo, useEffect
} from "react"
import { useRouter } from "next/router"

// component
import CustomerList from "components/page/setting/customer/customerList"

// global gear
import TwoButtonModal from "components/global/gear/modal/simpleModal/twoButtonModal"
import PageHeader02, { TpanelList, TsearchObj } from "components/PageHeader/pageHeader02"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01"




// api
import {
  TgetCustomers, TapiGetCustomersParams,
  useCustomers
} from "js/api/api_customer"

// css
import style from "./customer.module.scss"

// other
import { optionsCreator_clientSearch, Toption } from "fakeDatabase/options/options"






export default function Customer() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // =====================================================
  const [params, setParams] = useState<TapiGetCustomersParams>({
    page: 1,
    pageSize: 999,
    populate: ["contacts"],
    // filter: {},
    // sort: []
  })
  const { data, setData, update } = useCustomers(params)
  // =====================================================
  useEffect(() => {
    (async () => {
      setIsLoading(true)
      await update()
      setIsLoading(false)
      setIsReady(true)
    })()

  }, [])

  // =====================================================
  // pageHeader
  const clientSearchOptions = optionsCreator_clientSearch()
  const [searchType, setSearchType] = useState<Toption | null>(clientSearchOptions[0])
  const [searchContent, setSearchContent] = useState("")

  const searchTargetList = [
    {
      options: clientSearchOptions,
      width: "90px",
    },
    {
      placeholder: "請輸入搜尋內容",
    },
  ]

  const searchGroup = {
    searchTargetList,
    doSearch: (valueArr: (Toption | null | string)[]) => {
      alert("製作中")
    }
  }

  const panelList: TpanelList = [
    {
      searchGroup
    },
    {
      type: "addButton",
      label: "新增客戶資料",
      onClick: () => router.push("/setting/customer/add")
    }
  ]

  // =====================================================






  // =====================================================
  return (
    <div className={style.container}>

      <PageHeader02 tag="客戶列表" panelList={panelList} />


      <div className={style.mainContainer} >
        {isReady &&
          <CustomerList data={data as TgetCustomers} />
        }
        <LoadingCover01
          isLoading={isLoading}
        />
      </div>


    </div>
  )
}







