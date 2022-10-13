import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// component
import EditEmployee from "components/page/setting/employees/editEmployee";


// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02";
import LoadingCover from "components/global/gear/loadingCover";

// css
import style from "../../employees.module.scss"

// api
import { apiPostEmployee, TpostEmployee, Temployee } from "js/api/api_employee";
import { id } from "date-fns/locale";


export default function AddEmployee() {

  const router = useRouter()

  const [data, setData] = useState<Partial<Temployee>>(emptyDataOri())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // 在設定使用者代號的方案出來前，先這樣處理
    if (!data.idNumber) {
      data.idNumber = router.query.employeeId as string || ""
      setData({ ...data })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const panelList: TpanelList = [
    {
      type: "redButton",
      label: "取消",
      onClick: () => { router.back() }
    },
    {
      type: "myButton",
      label: "上傳",
      onClick: async () => {
        setIsLoading(true)
        await apiPostEmployee(data as Temployee)
        setIsLoading(false)
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
      <LoadingCover open={isLoading} />
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







