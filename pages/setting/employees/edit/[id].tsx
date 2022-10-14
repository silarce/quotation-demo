import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// component
import EditEmployee from "components/page/setting/employees/editEmployee";

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02";
import LoadingCover from "components/global/gear/loadingCover";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import { setRootLoading } from "components/global/gear/important/rootLoadingCover";
// css
import style from "../../employees.module.scss"

// api
import {
  TpostEmployee,
  useEmployeeById, apiPatchEmployee
} from "js/api/api_employee";


export default function AddEmployee() {

  const router = useRouter()

  let { data, setData, update } = useEmployeeById(router.query.id as string || "")

  useEffect(() => {
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])




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
          await apiPatchEmployee(data as TpostEmployee, data.id!)
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
        <EditEmployee data={data} setData={setData} />
      </div>
    </div>
  )
}

// ===========================================================



const emptyDataOri = (): TpostEmployee => ({
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
  // "jobId": [""]
})

// const emptyData: TpostEmployee = {
  //   "idNumber": "",
//   "chName": "",
//   "enName": "",
//   "identity": "",
//   "birthday": "",
//   "gender": "",
//   "marital": "",
//   "education": "",
//   "expertise": "",
//   "phone1": "",
//   "phone2": "",
//   "email": "",
//   "residenceCounty": "",
//   "residenceDistrict": "",
//   "residenceAddress": "",
//   "mailingCounty": "",
//   "mailingDistrict": "",
//   "mailingAddress": "",
//   "processPermission": true,
//   "seniority": "",
//   "startDate": "",
//   "leaveDate": "",
//   "retireDate": "",
//   "severanceDate": "",
//   "jobId": [""]
// }







