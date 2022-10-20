
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

// icon
import { IconCheck01, IconCross01 } from "public/image/icon/svgComponent/svgIcons";
import CircularProgress from '@mui/material/CircularProgress';

// api
import {
  TapiGetCustomersParams, TcustomersData, TpostCustomer,
  useCustomersById, apiPatchCustomers_id
} from "js/api/api_customer";

// css
import style from "../../customer.module.scss"
import { id } from "date-fns/locale";

const params: TapiGetCustomersParams = {
  populate: ["contacts"]
}


// =========================================================
export default function Edit() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  // ------------------------------------------------------
  const {
    data, setData, update
  } = useCustomersById(router.query.id as string || "", params)
  // ------------------------------------------------------
  useEffect(() => {
    (async () => {
      await update()
      setIsReady(true)
    })()
  }, [])
  // ------------------------------------------------------

  const panelList: TpanelList = [
    {
      type: "redButton",
      label: "取消",
      onClick: () => {
        if (router.query.isNew) {
          window.history.go(-2)
          return
        }
        router.back()
      }
    },
    {
      type: "myButton",
      label: "上傳",
      onClick: async () => {
        try {
          if (!data.id) return
          setRootLoading(true)
          // 如果第一層的id存在，會在api那邊把id刪掉
          await apiPatchCustomers_id(data.id, data as TpostCustomer)
          myAlert.success({ title: "變更客戶資料完成" })
        }
        catch {
          myAlert.err({ title: "變更客戶資料失敗" })
        }
        finally {
          setRootLoading(false)
        }
      }
    }
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
            data={data as TcustomersData}
            setData={setData as Dispatch<SetStateAction<TcustomersData>>} />
        }
      </div>



    </div>
  )

}