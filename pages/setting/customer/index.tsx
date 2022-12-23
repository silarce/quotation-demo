
import {
  useState, useEffect
} from "react"
import { NextRouter, useRouter } from "next/router"

// component
import CustomerList from "components/page/setting/customer/customerList"

// antd
import { Pagination } from 'antd';

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"

// api
import {
  TgetCustomers, TapiGetCustomersParams,
  useCustomers
} from "js/api/api_customer"

// css
import style from "./customer.module.scss"

// option
import { optionsCreator_clientSearch, Toption } from "fakeDatabase/options/options"
const clientSearchOptions = optionsCreator_clientSearch()
const clientSearchOptionsObj: { [key: string]: Toption } = {}
clientSearchOptions.forEach((item, index) => {
  const { value, label } = item
  clientSearchOptionsObj[value] = { value, label }
})

// ========================================================
export default function Customer() {
  const router = useRouter()
  if (!router.isReady) return null
  return (
    <TheCustomer router={router} />
  )
}
// ========================================================

function TheCustomer({ router }: { router: NextRouter }) {
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // -----------------------------------------------------
  const filter: TapiGetCustomersParams["filter"] = {}
  const searchProperty = router.query.searchProperty as string
  const searchValue = router.query.searchValue as string
  if (searchProperty && searchProperty) {
    filter[searchProperty] = {}
    filter[searchProperty].$contains = searchValue
  }

  let [params, setParams] = useState<TapiGetCustomersParams>({
    page: 1,
    pageSize: 8,
    populate: ["contacts"],
    filter,
    // sort: []
  })

  const { data, update } = useCustomers(params)
  const meta = data?.meta
  // -----------------------------------------------------
  const setPage = (page: number) => {
    setParams(params => {
      params.page = page
      return { ...params }
    })
  }

  // -----------------------------------------------------
  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        await update()
        setIsReady(true)
      }
      catch {
        myAlert.err({ title: "取得資料失敗" })
      }
      finally {
        setIsLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  // -----------------------------------------------------
  // pageHeader
  const searchTargetList = [
    {
      options: clientSearchOptions,
      width: "90px",
      defaultValue:
        clientSearchOptionsObj[searchProperty] ?? clientSearchOptions[0]
    },
    {
      placeholder: "請輸入搜尋內容",
      defaultValue: searchValue ?? ""
    },
  ]

  const searchGroup = {
    searchTargetList,
    doSearch: (valueArr: (Toption | null | string)[]) => {
      // if (typeof valueArr[0] === "string") return console.log("搜尋功能有錯誤")
      // if (!valueArr?.[0]?.value) return console.log("搜尋功能有錯誤")
      const searchProperty = (valueArr[0] as Toption).value
      const searchValue = valueArr[1] as string

      router.push({
        pathname: "/setting/customer",
        query: {
          searchProperty,
          searchValue
        }
      })

      setParams(params => {
        const filter: TapiGetCustomersParams["filter"] = {}
        filter[searchProperty] = {}
        filter[searchProperty]["$contains"] = searchValue
        return ({
          ...params,
          page: 1,
          filter
        })
      })
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

  // -----------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader02 tag="客戶列表" panelList={panelList} />
      <div className={style.mainContainer} >
        {isReady &&
          <>
            <CustomerList
              data={data as TgetCustomers}
              toUpdate={update}
            />
            <div className={style.paginationBox}>
              <Pagination
                current={meta?.page ?? 1} total={meta?.itemCount ?? 0}
                pageSize={meta?.pageSize ?? 0}
                onChange={setPage}
              />
            </div>
          </>
        }
        <LoadingCover01
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}







