
import {
  Dispatch, SetStateAction,
  useEffect, useState, useMemo
} from "react";
import { useRouter } from "next/router";

// component
import EditCustomer from "components/page/setting/customer/editCustomer/editCustomer";

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";


// api
import {
  TapiGetCustomersParams, TcustomerDto, TpostCustomer, TprePostCustomer,
  useCustomersById, apiPatchCustomers_id, useCheckCustomers_name,
} from "js/api/api_customer";

// css
import style from "../customer.module.scss"

const params: TapiGetCustomersParams = {
  populate: ["contacts"]
}


// =========================================================
// 防抖
let timeoutId_check: NodeJS.Timeout;
// =========================================================
export default function Edit() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  // ------------------------------------------------------
  const {
    data, setData, update
  } = useCustomersById(router.query.id as string || "", params)

  if (typeof data?.category === "string") { // 基本上data.category一定會是string
    try {
      data.category = JSON.parse(data.category) as string[]
    } catch {
      data.category = [data.category as string]
    }
  }

  // 原本的客戶全稱
  const [nameOri, setNameOri] = useState<string>()
  useEffect(() => {
    if (nameOri) return
    setNameOri(data?.name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.name])


  // ------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await update()
        if (res.contacts.length === 0) {
          setData({
            ...res,
            contacts: [{ name: "", phone: "" }]
          })
        }
        setIsReady(true)
      }
      catch {
        myAlert.err({
          title: "取得客戶資料失敗"
        })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // ------------------------------------------------------

  const {
    check: nameCheck,
    setCheck: SetNameCheck,
    reCheck: reNameCheck
  } = useCheckCustomers_name(data?.name ?? "")

  useEffect(() => {
    SetNameCheck("loading")
    clearTimeout(timeoutId_check)
    timeoutId_check = setTimeout(() => {
      if (nameOri === data?.name) return SetNameCheck("ok")
      if (!data?.name) return SetNameCheck("notOk")
      reNameCheck()
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.name, nameOri])

  // ------------------------------------------------------

  const panelList: TpanelList = [
    {
      type: "redButton",
      label: "上傳",
      onClick: async () => {
        try {
          if (!data?.id) return
          const postBody: TpostCustomer = (() => {
            return {
              ...data,
              category: JSON.stringify(data.category),
              county: data.county ?? "",
              district: data.district ?? "",
              address: data.address ?? "",
              invoiceCounty: data.invoiceCounty ?? "",
              invoiceDistrict: data.invoiceDistrict ?? "",
              invoiceAddress: data.invoiceAddress ?? "",
              contacts: data.contacts ?? []
            }

          })()
          setRootLoading(true)
          // 如果第一層的id存在，會在api那邊把id刪掉
          await apiPatchCustomers_id(data.id, postBody)
          myAlert.success({ title: "變更客戶資料完成" })
        }
        catch {
          myAlert.err({ title: "變更客戶資料失敗" })
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
        if (router.query.isNew) {
          window.history.go(-2)
          return
        }
        router.back()
      }
    },
  ]

  // =======================================================
  return (
    <div className={style.container}>

      <PageHeader02 tag="客戶列表"
        panelList={panelList}
      />

      <div className={style.mainContainer}>
        {isReady &&
          <EditCustomer
            data={data as TprePostCustomer}
            setData={setData as Dispatch<SetStateAction<TprePostCustomer>>}
            nameCheck={nameCheck} />
        }
      </div>
    </div>
  )

}

