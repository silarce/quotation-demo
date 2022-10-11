import { useState } from "react";


// component
import EditEmployee from "components/page/setting/employees/editEmployee";



// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02";

// css
import style from "../../employees.module.scss"

// api
import { apiPostEmployee, TpostEmployee } from "js/api/api_employee";

export default function AddEmployee() {

  const [data, setData] = useState(emptyData)



  const panelList: TpanelList = [
    {
      type: "redButton",
      label: "取消",
      onClick: () => { }
    },
    {
      type: "myButton",
      label: "上傳",
      onClick: () => { }
    }
  ]


  return (
    <div className={style.container}>

      <PageHeader02 tag="人員資料"
        panelList={panelList}
      />

      <div className={style.mainContainer}>

        <EditEmployee data={data} setData={setData}/>

      </div>



    </div>
  )
}

// ===========================================================



const emptyData: TpostEmployee = {
  "id_number": "test",
  "ch_name": "",
  "en_name": "",
  "identity": "",
  "birthday": "",
  "gender": "",
  "marital": "",
  "education": "",
  "expertise": "",
  "phone1": "",
  "phone2": "",
  "email": "",
  "residence_address": "",
  "mailing_address": "",
  "process_permission": true,
  "seniority": "",
  "start_date": "",
  "leave_date": "",
  "retire_date": "",
  "severance_date": "",
  "departmentId": []
}







