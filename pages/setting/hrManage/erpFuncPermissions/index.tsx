// ERP功能權限
// ERP功能權限
// ERP功能權限

import { useState } from "react"

// component
import Header from "components/page/setting/hrManage/header/header"
import Card from "components/page/setting/hrManage/card/card"
import GridPanel from "components/page/setting/hrManage/modal/gridSelector.tsx/gridPanel"
import TwoButtonModal from "components/global/gear/modal/simpleModal/twoButtonModal"

// css
import scss from "./erpFuncPermissions.module.scss"






export default function ErpFuncPermissions() {



  const [showPanel, setShowPanel] = useState(false)

  const openPanel = () => {
    setShowPanel(true)
  }

  const panelOnCancel = () => {
    setShowPanel(false)
  }
  const panelOnConfirm = (indexArr: number[]) => {
    alert("被選擇的index" + indexArr.join(","))
    setShowPanel(false)
  }

  // --------------------------------------------------------------------------

  const [preDelData, setPreDelData] = useState<TdepartmentInfo>()
  const [showDelete, setShowDelete] = useState(false)

  const openDelete = (department: TdepartmentInfo) => {
    setPreDelData(department)
    setShowDelete(true)
  }

  const confirmDelete = () => {
    if (!preDelData) return;

    const { label } = preDelData
    alert(`移除${label}`)
  }

  // --------------------------------------------------------------------------
  return (
    <div className={scss.container}>

      <Header />

      <div className={scss.mainContainer}>
        <div>
          {indexKey.map((key, index) => {
            const { label } = config[key]
            const dataArr = fakeData[key].map((item) => item.label)

            const removeData = (index: number) => {
              openDelete(fakeData[key][index])
            }

            return (
              <Card key={index}
                label={label}
                addLabel={"新增管理部門"}
                noDataTip="尚未新增管理部門"
                dataArr={dataArr}
                showAdd={openPanel}
                removeData={removeData}
              />
            )
          })}
        </div>
      </div>

      <GridPanel
        visible={showPanel}
        title="請選擇部門"
        note="可複選"
        dataArr={fakeDepartments}
        onCancel={panelOnCancel}
        onConfirm={panelOnConfirm}
      />

      <TwoButtonModal
        visible={showDelete}
        setVisible={setShowDelete}
        // 用刪除的字眼不準確，應該是請確認是否從xxx移除yy部
        // 串接api時再處理
        text={`請確認是否刪除${preDelData?.label}`}
        onConfirm={confirmDelete}
        onCancel={() => setShowDelete(false)}
      />

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

// ============================================================================

const fakeDepartments = [
  "管理部",
  "管理部",
  "管理部",
  "管理部",

  "管理部",
  "管理部",
  "管理部",
  "管理部",

  "管理部",
  "管理部",
  "管理部",
  "管理部",
]























