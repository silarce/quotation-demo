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
import { useCheckEmployee } from "js/api/api_employee";

// type
import type { TprePostEmployee } from "components/page/setting/employees/editEmployee";
// =====================================================

// 防抖
let timeoutId: NodeJS.Timeout;
// =====================================================
export default function AddEmployee() {
  const router = useRouter()

  const [data, setData] = useState<TprePostEmployee>(emptyDataOri())

  // =======================================================
  // 檢查idNumber是否不重複
  const {
    check,
    setCheck,
    reCheck
  } = useCheckEmployee(data.idNumber)

  useEffect(() => {
    setCheck("loading")
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      if (!data.idNumber) return setCheck("notOk")
      reCheck()
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.idNumber])
  // =======================================================
  const panelList: TpanelList = [
    {
      type: "redButton",
      label: "上傳",
      onClick: async () => {
        if (check === "notOk") return myAlert.err({ title: "使用者代號錯誤" })
        if (check === "loading") return myAlert.info({ title: "正在檢查使用者代號" })
        try {
          setRootLoading(true)
          let postData = _.cloneDeep(data)
          postData.jobId = postData.jobs.map((jobs: TjobsData) => jobs.id)
          postData = postData as TpostEmployee
          const res = await apiPostEmployee(postData) as Temployee
          router.push({
            pathname: `/setting/employees/edit/${res.id}`,
            query: {
              isNew: true
            }
          })
          myAlert.success({ title: "新增人員完成" })
        }
        catch {
          myAlert.err({ title: "新增人員失敗" })
        }
        finally {
          setRootLoading(false)
        }
      }
    },
    {
      type: "myButton",
      label: "取消",
      onClick: () => { router.back() }
    }
  ]

  // =====================================================
  return (
    <div className={style.container}>

      <PageHeader02 tag="人員資料"
        panelList={panelList}
      />
      <div className={style.mainContainer}>
        <EditEmployee data={data} setData={setData} check={check} />
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



