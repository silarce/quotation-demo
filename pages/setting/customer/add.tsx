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
import style from "../customer.module.scss"

// api
import {
  TapiGetCustomersParams, TcustomersData, TpostCustomer,
  apiPostCustomers, useCheckCustomers
} from "js/api/api_customer";
// ====================================================
// 防抖
let timeoutId: NodeJS.Timeout;
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

  useEffect(() => {
    setCheck("loading")
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      if (!data.customerNumber) return setCheck("notOk")
      reCheck()
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.customerNumber])
  // ------------------------------------------------------

  const panelList: TpanelList = [
    {
      type: "myButton",
      label: "上傳",
      onClick: async () => {
        try {
          if (!data.customerNumber) return
          setRootLoading(true)
          // 
          await apiPostCustomers(data)
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
      type: "redButton",
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
          data={data as TcustomersData}
          setData={setData as Dispatch<SetStateAction<TcustomersData>>}
          check={check}
        />

      </div>
    </div>
  )


}

// =============================================================
// TpostCustomer

const emptyCustomerOri = (): TpostCustomer => ({
  "customerNumber": "", //客戶編號
  "name": "", //客戶全稱
  "nickname": "", //客戶簡稱
  "category": "", //客戶類型
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
