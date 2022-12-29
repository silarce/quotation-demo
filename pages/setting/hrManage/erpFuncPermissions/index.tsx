// ERP功能權限
// ERP功能權限
// ERP功能權限

import { useState, useEffect } from "react"

// component
import Header from "components/page/setting/hrManage/header/header"
import Card from "components/page/setting/hrManage/card/card"
import GridPanel from "components/page/setting/hrManage/modal/gridSelector.tsx/gridPanel"

// gear
import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01"
import TwoButtonModal from "components/global/gear/modal/simpleModal/twoButtonModal"

// api
import {
  useErpFeatures,
  apiPostErpFeatures_id_departments, apiDeleteErpFeatures_id_departments
} from "js/api/api_erpFeature"
import { useDepartments } from "js/api/api_department"

// css
import scss from "./erpFuncPermissions.module.scss"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"


// =============================================================================
export default function ErpFuncPermissions() {
  const [isLoading, setIsLoading] = useState(false)
  // --------------------------------------------------------------------------
  const { data: erpData, update: updateErp } = useErpFeatures()
  const erpArr = erpData ?? []

  const updateList = async () => {
    setIsLoading(true)
    await updateErp()
    setIsLoading(false)
  }


  const { data: departmentsData, update: updateDepartments } = useDepartments()
  const departmentArr = departmentsData?.data ?? []
  const departmentNameArr = departmentArr.map((item) => item.name)

  // --------------------------------------------------------------------------





  useEffect(() => {
    (async () => {
      setIsLoading(true)
      await Promise.all([updateErp(), updateDepartments()])
      setIsLoading(false)
    })()
  }, [])

  // --------------------------------------------------------------------------


  // 新增部門
  const [erpId_add, setErpId_add] = useState<string>()

  const openAddPanel = (erpId: string) => {
    setErpId_add(erpId)
  }

  const cancelAddPanel = () => {
    setErpId_add(undefined)
  }
  
  const addDepartment = async (indexArr: number[]) => {
    if (!erpId_add) return

    const departmentsIdArr = departmentArr.map((item) => item.id)
    const body = {
      departmentIds: departmentsIdArr.filter((item, index) => {
        return indexArr.includes(index)
      })
    }

    try {
      setRootLoading(true)
      await apiPostErpFeatures_id_departments(erpId_add, body)
      cancelAddPanel()
    }
    catch {
      myAlert.err({ title: "新增部門失敗" })
    }
    setRootLoading(false)
    await updateList()
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
          {erpArr.map((erp, index) => {

            const { departments, id } = erp
            const demparmentsNameArr = departments.map((item) => item.name)

            const removeData = (index: number) => {
              // openDelete(fakeData[key][index])

            }

            return (
              <Card key={index}
                label={"NAME"}
                addLabel={"新增管理部門"}
                noDataTip="尚未新增管理部門"
                dataArr={demparmentsNameArr}
                showAdd={() => openAddPanel(id)}
                removeData={removeData}
              />
            )
          })}
        </div>
        <LoadingCover01 isLoading={isLoading} />
      </div>



      <GridPanel
        visible={!!erpId_add}
        title="請選擇部門"
        note="可複選"
        dataArr={departmentNameArr}
        onCancel={cancelAddPanel}
        onConfirm={addDepartment}
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























