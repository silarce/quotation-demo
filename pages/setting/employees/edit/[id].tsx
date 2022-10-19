import {
  Dispatch, SetStateAction,
  useState, useEffect
} from "react";
import { useRouter } from "next/router";
const _ = require("lodash")

// component
import EditEmployee from "components/page/setting/employees/editEmployee";

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";
// css
import style from "../../employees.module.scss"

// api
import {
  TpostEmployee, TapiGetEmployee_idParams,
  useEmployeeById, apiPatchEmployee
} from "js/api/api_employee";
import type { TjobsData } from "js/api/api_department";
import type { TprePostEmployee } from "components/page/setting/employees/editEmployee";


const theUseEmployeeByIdParams: TapiGetEmployee_idParams = {
  populate: ["jobs"]
}

export default function AddEmployee() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  // ================================================

  let { data, setData, update } =
    useEmployeeById(
      router.query.id as string || "",
      theUseEmployeeByIdParams)

  useEffect(() => {
    (async () => {
      await update()
      setIsReady(true)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const panelList: TpanelList = [
    {
      type: "redButton",
      label: "取消",
      onClick: () => {
        if (router.query.isNew) {
          router.push("/setting/employees")
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
          setRootLoading(true)
          let postData = _.cloneDeep(data)
          postData.jobId = postData.jobs.map((jobs: TjobsData) => jobs.id)

          postData = postData as TpostEmployee

          await apiPatchEmployee(postData, postData.id)
          myAlert.success({ title: "變更人員資料完成" })
        }
        catch {
          myAlert.err({ title: "變更人員資料失敗" })
        }
        finally {
          setRootLoading(false)
        }
      }
    }
  ]


  return (
    <div className={style.container}>

      <PageHeader02 tag="人員資料"
        panelList={panelList}
      />
      <div className={style.mainContainer}>
        {isReady &&
          <EditEmployee
            data={data as TprePostEmployee}
            setData={setData as Dispatch<SetStateAction<TprePostEmployee>>} />
        }
      </div>
    </div>
  )
}

// ===========================================================

