
import {
  useState, useEffect
} from "react"
import { NextRouter, useRouter } from "next/router"

// component
import CustomerList from "components/page/setting/customer/customerList"

// antd
import { Pagination } from 'antd';

// global gear
import PageHeader02, { TpanelList, TsearchGroup } from "components/PageHeader/pageHeader02"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"

// api
import {
  TapiGetCustomersParams,
  useCustomers, customerTypesLookup, customerTypesArr, TcustomerDto_TC
} from "js/api/api_customer"


// css
import style from "./customer.module.scss"

// option
import { optionsCreator_county } from "fakeDatabase/options/countryAndDistrict";
const optionCountyArr = (() => {
  const arr = optionsCreator_county()
  arr.unshift({ value: "", label: "地區不拘" })
  return arr
})()
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
  // 搜尋用的filter
  const filter: TapiGetCustomersParams["filter"] = {}
  const searchTypes = router.query.searchTypes as string
  const searchCounty = router.query.searchCounty as string
  const searchOther = router.query.searchOther as string
  const searchOtherValue = router.query.searchOtherValue as string
  if (searchTypes) {
    filter.types = {}
    filter["types.name"] = {
      "$eq": searchTypes
    }
  }
  if (searchCounty) {
    filter.county = {}
    filter.county.$contains = searchCounty
  }
  if (searchOther && searchOther) {
    filter[searchOther] = {}
    filter[searchOther].$contains = searchOtherValue
  }

  let [params, setParams] = useState<TapiGetCustomersParams>({
    page: 1,
    pageSize: 8,
    populate: ["contacts", "types"],
    filter,
    // sort: []
  })

  const { data: dataOri, meta, update } = useCustomers(params)
  const data = (dataOri ?? []) as TcustomerDto_TC[]

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

  // 類別optionArr
  const typesOptionArr = (() => {
    const optionArr: { value: string, label: string }[] = customerTypesArr.map((types) => {
      return {
        value: types.value,
        label: types.label
      }
    })
    optionArr.unshift({ value: "", label: "類別不拘" })
    return optionArr
  })()

  const searchTargetList = [
    {
      options: typesOptionArr,
      width: "90px",
      placeholder: "類別不拘",
      defaultValue: customerTypesLookup[searchTypes as keyof typeof customerTypesLookup]
    },
    {
      options: optionCountyArr,
      width: "90px",
      placeholder: "地區不拘",
      defaultValue: searchCounty
    },
    {
      options: clientSearchOptions,
      width: "90px",
      defaultValue:
        clientSearchOptionsObj[searchOther] ?? clientSearchOptions[0]
    },
    {
      placeholder: "請輸入搜尋內容",
      defaultValue: searchOtherValue ?? ""
    },
  ]

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch: (valueArr: (Toption | null | string)[]) => {
      const searchTypes = (valueArr[0] as Toption).value
      const searchCounty = (valueArr[1] as Toption).value
      const searchOther = (valueArr[2] as Toption).value
      const searchOtherValue = valueArr[3] as string
      router.push({
        pathname: "/setting/customer",
        query: {
          searchTypes,
          searchCounty,
          searchOther,
          searchOtherValue
        }
      })

      setParams(params => {
        const filter: TapiGetCustomersParams["filter"] = {}

        if (searchTypes) {
          filter.types = {}
          filter["types.name"] = {
            "$eq": searchTypes
          }
          // filter["types.name"] = {
          //   "$in": [searchTypes]
          // }
        }

        filter.county = {}
        filter.county["$contains"] = searchCounty
        filter[searchOther] = {}
        filter[searchOther]["$contains"] = searchOtherValue
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
              customersList={data}
              toUpdate={update}
              isLoading={isLoading}
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
        {/* <LoadingCover01
          isLoading={isLoading}
        /> */}
      </div>
    </div>
  )
}







