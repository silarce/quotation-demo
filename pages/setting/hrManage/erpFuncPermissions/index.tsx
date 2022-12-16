// ERP功能權限
// ERP功能權限
// ERP功能權限


// component
import Header from "components/page/setting/hrManage/header/header"
import Card from "components/page/setting/hrManage/card/card"

// css
import scss from "./erpFuncPermissions.module.scss"






export default function ErpFuncPermissions() {



  return (
    <div className={scss.container}>

      <Header />

      <div className={scss.mainContainer}>

        <div>
          {indexKey.map((key, index) => {
            const { label } = config[key]
            const dataArr = fakeData[key].map((item) => item.label)
            return (
              <Card key={index}
                label={label}
                addLabel={"新增管理部門"}
                noDataTip="尚未新增管理部門"
                dataArr={dataArr}
                showAdd={() => { }}
                removeData={() => { alert("未串接API，目前無功能") }}
              />
            )
          })}
        </div>
      </div>

    </div>
  )
}


// ===============================================================================

// fakeData
type TindexKey =
  "setting" | "domestic" | "foreign" | "worksDepartment" | "quoteRangeList"

const indexKey: TindexKey[]
  = ["setting", "domestic", "foreign", "worksDepartment", "quoteRangeList"]

type Tconfig = {
  [key in TindexKey]: {
    label: string
  }
}

type TdepartmentInfo = {
  departmentId: number
  label: string
}

type TfakeData = {
  [key in TindexKey]: TdepartmentInfo[]
}


const config: Tconfig = {
  setting: {
    label: "公司設定"
  },
  domestic: {
    label: "營業部-國內工程"
  },
  foreign: {
    label: "營業部-國外工程"
  },
  worksDepartment: {
    label: "工務部"
  },
  quoteRangeList: {
    label: "報價範圍列表"
  },
}




const fakeData: TfakeData = {
  setting: [
    {
      departmentId: 0,
      label: "管理部",
    },
    {
      departmentId: 0,
      label: "業務部",
    },
    {
      departmentId: 0,
      label: "人事部",
    },
    {
      departmentId: 0,
      label: "營業部",
    },
  ],
  domestic: [
    {
      departmentId: 0,
      label: "管理部",
    },
    {
      departmentId: 0,
      label: "業務部",
    },
    {
      departmentId: 0,
      label: "人事部",
    },
    {
      departmentId: 0,
      label: "人事部",
    },
    {
      departmentId: 0,
      label: "人事部",
    },
    {
      departmentId: 0,
      label: "人事部",
    },
  ],
  foreign: [
    {
      departmentId: 0,
      label: "管理部",
    },
    {
      departmentId: 0,
      label: "業務部",
    },
    {
      departmentId: 0,
      label: "業務部",
    },
    {
      departmentId: 0,
      label: "業務部",
    },
    {
      departmentId: 0,
      label: "業務部",
    },
    {
      departmentId: 0,
      label: "人事部",
    },
  ],
  worksDepartment: [
    {
      departmentId: 0,
      label: "管理部",
    },
    {
      departmentId: 0,
      label: "業務部",
    },
    {
      departmentId: 0,
      label: "業務部",
    },
    {
      departmentId: 0,
      label: "業務部",
    },
    {
      departmentId: 0,
      label: "業務部",
    },
    {
      departmentId: 0,
      label: "人事部",
    },
  ],
  quoteRangeList: [
  ],
}

























