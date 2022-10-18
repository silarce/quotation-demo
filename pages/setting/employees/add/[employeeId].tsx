import { useState, useEffect } from "react";
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
  TpostEmployee, Temployee,
  apiPostEmployee,
} from "js/api/api_employee";
import type { TjobsData } from "js/api/api_department";

// type
import type { TprePostEmployee } from "components/page/setting/employees/editEmployee";


// =====================================================
export default function AddEmployee() {
  const router = useRouter()

  const [data, setData] = useState<TprePostEmployee>(emptyDataOri())

  useEffect(() => {
    // 在設定使用者代號的方案出來前，先這樣處理
    if (!data.idNumber) {
      data.idNumber = router.query.employeeId as string || ""
      setData({ ...data })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // =======================================================
  const panelList: TpanelList = [
    {
      type: "redButton",
      label: "取消",
      onClick: () => { router.push("/setting/employees") }
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

          const res = await apiPostEmployee(postData) as Temployee
          router.push(`/setting/employees/edit/${res.id}`)
          myAlert.success({ title: "新增人員完成" })
        }
        catch {
          myAlert.err({ title: "新增人員失敗" })
        }
        finally {
          setRootLoading(false)
        }
      }
    }
  ]

  // =====================================================
  return (
    <div className={style.container}>

      <PageHeader02 tag="人員資料"
        panelList={panelList}
      />
      <div className={style.mainContainer}>
        <EditEmployee data={data} setData={setData} />
      </div>
    </div>
  )
} // AddEmployee

// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================

const emptyDataOri = (): TprePostEmployee => ({
  "idNumber": "",
  "chName": "",
  "enName": "",
  "identity": "",
  "birthday": "",
  "gender": "",
  "marital": "",
  "education": "",
  "expertise": "",
  "phone1": "",
  "phone2": "",
  "email": "",
  "residenceCounty": "",
  "residenceDistrict": "",
  "residenceAddress": "",
  "mailingCounty": "",
  "mailingDistrict": "",
  "mailingAddress": "",
  "processPermission": true,
  "seniority": "",
  "startDate": "",
  "leaveDate": "",
  "retireDate": "",
  "severanceDate": "",
  "jobs": [],
})




// ========================================================



