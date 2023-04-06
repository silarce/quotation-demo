import {
  Dispatch, SetStateAction,
  useEffect, useState
} from "react";
import { useRouter } from "next/router";

// component
import EditCustomer from "components/page/setting/customer/editCustomer/editCustomer";


// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";

// css
import style from "./customer.module.scss"

// api
import {
  TapiGetCustomersParams, TcustomerDto, TpostCustomer,
  apiPostCustomers, useCheckCustomers, TprePostCustomer,
  useCheckCustomers_name,
} from "js/api/api_customer";
// ====================================================
// 防抖
let timeoutId: NodeJS.Timeout;
let timeoutId_check: NodeJS.Timeout;
// ====================================================
export default function Add() {
  const router = useRouter()
  // ------------------------------------------------------

  const [data, setData] = useState(emptyCustomerOri())

  // ------------------------------------------------------
  // 檢查customerNumber是否不重複
  const {
    check,
    setCheck,
    reCheck
  } = useCheckCustomers(data.customerNumber)
  const {
    check: nameCheck,
    setCheck: SetNameCheck,
    reCheck: reNameCheck
  } = useCheckCustomers_name(data.name)


  useEffect(() => {
    setCheck("loading")
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      if (!data.customerNumber) return setCheck("notOk")
      reCheck()
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.customerNumber])


  useEffect(() => {
    SetNameCheck("loading")
    clearTimeout(timeoutId_check)
    timeoutId_check = setTimeout(() => {
      if (!data.name) return SetNameCheck("notOk")
      reNameCheck()
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.name])

  // ------------------------------------------------------

  const panelList: TpanelList = [
    {
      type: "redButton",
      label: "上傳",
      onClick: async () => {


        // if (check === "notOk") return myAlert.err({ title: "客戶編號錯誤" })
        // if (check === "loading") return myAlert.info({ title: "正在檢查客戶編號" })
        if (check === "notOk" || nameCheck === "notOk")
          return myAlert.err({ title: "客戶編號或客戶全稱已被使用" })
        if (check === "loading" || nameCheck === "loading")
          return myAlert.info({ title: "正在檢查客戶編號或客戶全稱" })


        try {
          const postBody: TpostCustomer = {
            ...data,
            category: JSON.stringify(data.category)
          }
          setRootLoading(true)
          const res = await apiPostCustomers(postBody)
          router.push({
            // pathname: `/setting/customer/edit/${res.id}`,
            pathname: "/setting/customer",
          })
          myAlert.success({ title: "新增客戶資料完成" })
        }
        catch {
          myAlert.err({ title: "新增客戶資料失敗" })
        }
        finally {
          setRootLoading(false)
        }
      }
    },
    {
      type: "myButton",
      label: "取消",
      onClick: () => {
        router.back()
      }
    },
  ]

  return (
    <div className={style.container}>

      <PageHeader02 tag="客戶列表"
        panelList={panelList}
      />
      <div className={style.mainContainer}>

        <EditCustomer
          data={data}
          setData={setData}
          check={check}
          nameCheck={nameCheck}
        />

      </div>
    </div>
  )


}

// =============================================================
// TpostCustomer

const emptyCustomerOri = (): TprePostCustomer => ({
  "customerNumber": "", //客戶編號
  "name": "", //客戶全稱
  "nickname": "", //客戶簡稱
  "category": [], //客戶類型
  "principal": "", //客戶負責人
  "taxDeductionCategory": "", //扣稅類別
  "taxId": "", //統一編號
  "phone": "",
  "fax": "",
  "county": "",
  "district": "",
  "address": "",
  "invoiceCounty": "", //發票地址縣市
  "invoiceDistrict": "", //發票地址區域
  "invoiceAddress": "", //發票地址剩餘地址
  "contacts": [{
    name: "",
    phone: ""
  }]
})
