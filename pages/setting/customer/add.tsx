import { useEffect } from "react";
import { useRouter } from "next/router";

// layer
import SubLayer from "components/Layer/SubLayer/SubLayer";

// component
import EditCustomer from "components/page/setting/customer/editCustomer/editCustomer";

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";


// api
import { apiPostCustomers, useApiCustomersNameExist, } from "js/api/api_customer";

// hook
import { useClassCustomer } from "hooks/customer/useCustomer";

// ====================================================
// 防抖
let timeoutId_check: NodeJS.Timeout;
// ====================================================
export default function Add() {
  const router = useRouter()
  // ------------------------------------------------------
  const classCustomer = useClassCustomer()

  // ------------------------------------------------------
  // 檢查客戶全稱不重複
  const {
    check: nameCheck,
    setCheck: SetNameCheck,
    reCheck: reNameCheck
  } = useApiCustomersNameExist(classCustomer.name)

  useEffect(() => {
    SetNameCheck("loading")
    clearTimeout(timeoutId_check)
    timeoutId_check = setTimeout(() => {
      if (!classCustomer.name) return SetNameCheck("notOk")
      reNameCheck()
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classCustomer.name])

  // ------------------------------------------------------

  const panelList: TpanelList = [
    {
      type: "redButton",
      label: "上傳",
      onClick: async () => {

        if (nameCheck === "notOk")
          return myAlert.err({ title: "客戶全稱已被使用" })
        if (nameCheck === "loading")
          return myAlert.info({ title: "正在檢查客戶全稱" })
        try {
          const postBody = classCustomer.postBody
          setRootLoading(true)
          const res = await apiPostCustomers(postBody)
          router.push({
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
    <SubLayer >
      <PageHeader02 tag="客戶列表"
        panelList={panelList}
      />
      <div>
        <EditCustomer
          classCustomer={classCustomer}
          nameCheck={nameCheck}
        />
      </div>
    </SubLayer>
  )
}

