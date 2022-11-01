// 公司職等職稱
// 公司職等職稱
import {
  ChangeEvent, Dispatch, SetStateAction, MouseEvent,
  useState, useEffect, useMemo
} from "react"

const _ = require("lodash")

// component
import List from "components/page/setting/departments/list"
import Caption from "components/page/setting/departments/caption"


// glogal gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01"
import InputModal from "components/global/gear/modal/simpleModal/inputModal"

// api
import {
  TdepartmentData, TjobsData, TgetDepartments,
  useDepartments,  // 取得部門列表
  apiPostDepartments, // 新增部門
  apiPatchDepartments, // 更新部門名稱
  apiDeleteDepartments, // 刪除部門
  apiPostJobs, // 新增職等
  apiPatchJobs, // 更新職等
  apiDeleteJobs, // 刪除職等
} from "js/api/api_department"

// css
import style from "./departments.module.scss"



// ===========================================================
const params = {
  populate: ["jobs"]
}
// ===========================================================
export default function Department() {
  const [isReady, setIsReady] = useState(false)
  const [editable, setEditable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  // ---------------------------------------------------------
  // 取得部門列表
  const { data, setData, update } = useDepartments(params)
  const { myDepartment, setMyDepartment, addDepartment } = useDeparmentGrid(data)

  // console.log(myDepartment)

  useEffect(() => {
    (async () => {
      await update()
      setIsReady(true)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------------------------------------------------------


  const panelList01: TpanelList = [
    {
      type: "myButton",
      label: "編輯",
      onClick: () => { setEditable(true) }
    }
  ]
  const panelList02: TpanelList = [
    {
      type: "addButton",
      label: "新增部門",
      onClick: () => {
        setShowAdd(true)
      }
    },
    {
      type: "redButton",
      label: "上傳",
      onClick: () => { uploads(myDepartment) }
    },
    {
      type: "myButton",
      label: "取消",
      onClick: () => { setEditable(false) }
    },
  ]
  // ---------------------------------------------------------
  if (!isReady) return null
  // ---------------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader02
        tag="公司職等職稱"
        panelList={editable ? panelList02 : panelList01}
      />
      <div className={style.mainContainer}>
        {data.data &&
          <div className={style.department}>
            <Caption />
            <List
              myDepartment={myDepartment}
              setMyDepartment={setMyDepartment}
              editable={editable}
            />
          </div>
        }
        <LoadingCover01 isLoading={isLoading} />
      </div>
      <InputModal
        visible={showAdd}
        setVisible={setShowAdd}
        title={"請輸入新增部門"}
        placeholder={"新部門"}
        onConfirm={addDepartment}
      />
    </div>
  )
}


// ========================================================
// ========================================================
// ========================================================


type TmyDepartmentData = Partial<Omit<TdepartmentData, "jobs">> & {
  jobs: TmyJobs[]
  dMethod?: "post" | "patch" | "delete"
  new?: boolean
  dOnChange: (e: ChangeEvent<HTMLInputElement>) => void
  dMarkDel: (e: MouseEvent) => void
}

type TmyJobs = Partial<Omit<TjobsData, "department">> & {
  grade?: number
  id?: string
  name?: string
  departmentId?: string | null
  jMethod?: "post" | "patch" | "delete" | "empty"
  new?: boolean
  jOnChange: (e: ChangeEvent<HTMLInputElement>) => void
  jMarkDel: (e: MouseEvent) => void
  addJobs?: () => void
}

// ----
const useDeparmentGrid = (departments: Partial<TgetDepartments>) => {

  const [myDepartment, setMyDepartment] = useState<Partial<TmyDepartmentData>[]>([])

  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!Array.isArray(departments.data)) return
    const myDepartment = _.cloneDeep(departments.data) as TmyDepartmentData[]

    // 對每一個department資料進行處理
    myDepartment.forEach((dItem, dIndex, arr) => {
      delete dItem.createdAt
      delete dItem.updatedAt

      dItem = new DepartmentClass({
        dItem,
        setMyDepartment
      })
      arr[dIndex] = dItem

      const { id: departmentId, jobs } = dItem
      // ----------------------------------------------------------
      // 把jobs陣列裡的東西放進tempJobsObj裡，並以grade作為key
      const tempJobsObj: { [key: number]: TmyJobs } = {}
      jobs?.forEach((item) => {
        delete item.createdAt
        delete item.updatedAt
        tempJobsObj[item.grade!] = item
      })
      // --------
      // 建立myJobs，job資料要有10筆
      // 如果tempJobsObj有對應的資料，就把對應的資料放進去
      // 否則建立空的資料放進去
      const myJobs: TmyJobs[] =
        Array(10).fill(undefined)
          .map((jItem, jIndex) => {
            // const jobData = tempJobsObj[jIndex + 1]
            if (tempJobsObj[jIndex + 1]) {
              return new JobClass({
                jobData: tempJobsObj[jIndex + 1],
                departmentId,
                setMyDepartment
              })
            }

            return new EmptyJobClass({
              jIndex, departmnetId: departmentId, setMyDepartment,
              // myDepartment,dItem
            })
          })
      // myJobs資料處理好了，替換item.jobs
      dItem.jobs = myJobs
    })
    setMyDepartment(myDepartment)
  }, [departments])

  // ==========================================

  const addDepartment = (name: string) => {
    // myDepartment.push({
    //   name,
    //   dMethod: "post",
    //   jobs: []
    // })
    // setMyDepartment([...myDepartment])
  }

  // ==========================================
  return { myDepartment, setMyDepartment, addDepartment }
}

export type TuseDeparmentGrid = ReturnType<typeof useDeparmentGrid>




// =================================================================
class DepartmentClass implements TmyDepartmentData {
  id: TmyDepartmentData["id"]
  name: TmyDepartmentData["name"]
  jobs: TmyDepartmentData["jobs"]
  dMethod: TmyDepartmentData["dMethod"]
  new: TmyDepartmentData["new"]
  setMyDepartment: Dispatch<SetStateAction<Partial<TmyDepartmentData>[]>>
  constructor(
    { dItem, setMyDepartment }:
      {
        dItem: TmyDepartmentData
        setMyDepartment: Dispatch<SetStateAction<Partial<TmyDepartmentData>[]>>
      }) {
    const { id, name, jobs, } = dItem
    this.id = id
    this.name = name
    this.jobs = jobs
    this.setMyDepartment = setMyDepartment
  }

  dOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    this.name = value
    this.dMethod = "patch"
    this.setMyDepartment((myDepartment) => [...myDepartment])
  }

  dMarkDel = (e: MouseEvent) => {
    e.stopPropagation()
    this.dMethod = "delete"
    this.setMyDepartment((myDepartment) => [...myDepartment])
  }
}



class JobClass implements TmyJobs {
  departmentId: TmyJobs["departmentId"]
  id: TmyJobs["id"]
  grade: TmyJobs["grade"]
  name: TmyJobs["name"]
  jMethod: TmyJobs["jMethod"]
  setMyDepartment: Dispatch<SetStateAction<Partial<TmyDepartmentData>[]>>

  constructor(
    { jobData, departmentId, setMyDepartment }:
      {
        jobData: TmyJobs
        departmentId: string | undefined
        setMyDepartment: Dispatch<SetStateAction<Partial<TmyDepartmentData>[]>>
      }
  ) {
    const { grade, name, id } = jobData
    this.departmentId = departmentId
    this.id = id
    this.grade = grade
    this.name = name
    this.setMyDepartment = setMyDepartment
  }
  jOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    this.name = value
    this.jMethod = "patch"
    this.setMyDepartment((myDepartment) => [...myDepartment])
  }
  jMarkDel = () => {
    this.jMethod = "delete"
    this.setMyDepartment((myDepartment) => [...myDepartment])
  }
}



class EmptyJobClass implements TmyJobs {
  // department: TmyDepartmentData
  grade: TmyJobs["grade"]
  departmentId: TmyJobs["departmentId"]
  jMethod: TmyJobs["jMethod"]
  new: TmyJobs["new"]
  name: TmyJobs["name"]

  // myDepartment: Partial<TmyDepartmentData>[]
  setMyDepartment: Dispatch<SetStateAction<Partial<TmyDepartmentData>[]>>
  // -------
  constructor(
    { jIndex, departmnetId, setMyDepartment,
      //  myDepartment ,dItem
    }:
      {
        // dItem: TmyDepartmentData
        jIndex: number
        departmnetId: string | undefined
        // myDepartment: Partial<TmyDepartmentData>[]
        setMyDepartment: Dispatch<SetStateAction<Partial<TmyDepartmentData>[]>>
      }
  ) {
    // this.department = dItem
    this.grade = jIndex + 1
    this.departmentId = departmnetId
    this.jMethod = "empty"
    this.new = true
    // this.myDepartment = myDepartment
    this.setMyDepartment = setMyDepartment
  }
  // -------
  jOnChange: TmyJobs["jOnChange"] = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    this.name = value
    this.setMyDepartment((myDepartment) => [...myDepartment])
  }
  addJobs: TmyJobs["addJobs"] = () => {
    this.jMethod = "post"
    this.setMyDepartment((myDepartment) => [...myDepartment])
  }
  jMarkDel: TmyJobs["jMarkDel"] = (e: MouseEvent) => {
    e.stopPropagation()
    this.jMethod = "delete"
    this.setMyDepartment((myDepartment) => [...myDepartment])
  }
}






// =================================================================

// 批次上傳
const uploads = async (myDepartment: TuseDeparmentGrid["myDepartment"]) => {

  for (let department of myDepartment) {
    const {
      id: departmentId,
      name: dName,
      dMethod,
      jobs,
    } = department

    if (dMethod === "patch") await apiPatchDepartments(departmentId!, { name: dName! })
    if (dMethod === "delete") {
      await apiDeleteDepartments(departmentId!)
      continue
    }


    for (let job of jobs!) {
      const { grade, id, name, jMethod: method } = job
      if (!departmentId || !grade || !name) continue
      if (method === "patch") await apiPatchJobs(id!, { grade, name, departmentId })
      if (method === "post") await apiPostJobs({ grade, name, departmentId })
      if (method === "delete") await apiDeleteJobs(id!)
    }
  }
}


