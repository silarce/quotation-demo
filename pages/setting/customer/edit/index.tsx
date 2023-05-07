
import { useEffect, useState, } from "react";
import { useRouter } from "next/router";

// layer
import SubLayer from "components/Layer/SubLayer/SubLayer";

// component
import EditCustomer from "components/page/setting/customer/editCustomer/editCustomer";

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/PageHeader02/PageHeader02";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";


// api
import {
  TapiGetCustomersParams,
  useCustomersById, apiPatchCustomers_id, useApiCustomersNameExist,
} from "js/api/api_customer";

// hook
import { useClassCustomer } from "hooks/customer/useCustomer";


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

  const classCustomer = useClassCustomer(data)

  // ------------------------------------------------------

  const {
    check: nameCheck,
    setCheck: SetNameCheck,
    reCheck: reNameCheck
  } = useApiCustomersNameExist(classCustomer.name)

  useEffect(() => {
    SetNameCheck("loading")
    clearTimeout(timeoutId_check)
    timeoutId_check = setTimeout(() => {
      if (nameOri === classCustomer.name) return SetNameCheck("ok")
      if (!classCustomer.name) return SetNameCheck("notOk")
      reNameCheck()
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classCustomer.name, nameOri])

  // ------------------------------------------------------

  const panelList: TpanelList = [
    {
      type: "redButton",
      label: "上傳",
      onClick: async () => {
        try {
          if (nameCheck === "notOk")
            return myAlert.err({ title: "客戶全稱已被使用" })
          if (nameCheck === "loading")
            return myAlert.info({ title: "正在檢查客戶全稱" })
          const postBody = classCustomer.postBody
          if (!postBody.id) return
          setRootLoading(true)
          // 如果第一層的id存在，會在api那邊把id刪掉
          await apiPatchCustomers_id(postBody.id, postBody)
          router.push({
            pathname: "/setting/customer",
          })
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
        router.back()
      }
    },
  ]

  // =======================================================
  return (
    <SubLayer>
      <PageHeader02 tag="客戶列表"
        panelList={panelList}
      />
      <div >
        {isReady &&
          <EditCustomer
            classCustomer={classCustomer}
            nameCheck={nameCheck} />
        }
      </div>
    </SubLayer>
  )
}

