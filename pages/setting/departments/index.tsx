// 公司職等職稱
// 公司職等職稱
import {
  ChangeEvent, Dispatch, SetStateAction, MouseEvent,
  useState, useEffect, 
} from "react"


const _ = require("lodash")

// component
import List from "components/page/setting/departments/list"
import Caption from "components/page/setting/departments/caption"


// glogal gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"
import InputModal from "components/global/gear/modal/simpleModal/inputModal"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01"
import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"

// api
import {
  TdepartmentDto, TjobDto, TgetDepartments,
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


  const toUpdate = async () => {
    try {
      setIsLoading(true)
      return await update()
    }
    catch { }
    finally { setIsLoading(false) }
  }

  useEffect(() => {
    (async () => {
      await toUpdate()
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
      onClick: () => { uploads(myDepartment, toUpdate) }
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
// ========================================================
// ========================================================
// ========================================================
// ========================================================
// ========================================================
// ========================================================
// ========================================================
// ========================================================
// ========================================================


type TmyDepartmentData = Partial<Omit<TdepartmentDto, "jobs">> & {
  jobs: TmyJobs[]
  dMethod?: "post" | "patch"
  isNew?: boolean
  isMarkedDel?: boolean
  isFocus: boolean
  dOnChange: (e: ChangeEvent<HTMLInputElement>) => void
  dMarkDel: (e: MouseEvent) => void
  changeFocus: (isFocus: boolean) => void
}

type TmyJobs = Partial<Omit<TjobDto, "department">> & {
  departmentId?: string | null
  id?: string
  grade?: number
  name?: string
  jMethod?: "post" | "patch" | "nothing"
  isNew?: boolean
  isMarkedDel?: boolean
  isFocus: boolean
  jOnChange: (e: ChangeEvent<HTMLInputElement>) => void
  jMarkDel: (e: MouseEvent) => void
  addJobs?: () => void
  changeFocus: (isFocus: boolean) => void
}


// =================================================================

class DepartmentClass implements TmyDepartmentData {
  id: TmyDepartmentData["id"]
  name: TmyDepartmentData["name"]
  jobs: TmyDepartmentData["jobs"]
  isFocus: TmyDepartmentData["isFocus"] = false
  isMarkedDel: TmyDepartmentData["isMarkedDel"] = false
  dMethod: TmyDepartmentData["dMethod"]
  #setMyDepartment: Dispatch<SetStateAction<Partial<TmyDepartmentData>[]>>

  isNew: TmyDepartmentData["isNew"]
  index: number | undefined
  constructor(
    { dItem, setMyDepartment, isNew, index }:
      {
        // dItem: TmyDepartmentData
        dItem: Pick<TmyDepartmentData, "id" | "name" | "jobs">
        setMyDepartment: Dispatch<SetStateAction<Partial<TmyDepartmentData>[]>>
        isNew?: never
        index?: never
      } |
      {
        dItem: Pick<TmyDepartmentData, "id" | "name" | "jobs">
        setMyDepartment: Dispatch<SetStateAction<Partial<TmyDepartmentData>[]>>
        isNew: boolean
        index: number
      }
  ) {
    const { id, name, jobs } = dItem
    this.id = id
    this.name = name
    this.#setMyDepartment = setMyDepartment
    this.isNew = isNew ?? false
    this.index = index
    this.dMethod = isNew ? "post" : undefined
    // ----------------------------------------
    // 把jobs陣列裡的東西放進tempJobsObj裡，並以grade作為key
    const tempJobsObj: { [key: number]: TmyJobs } = {}
    jobs?.forEach((item) => {
      delete item.createdAt
      delete item.updatedAt
      tempJobsObj[item.grade!] = item
    })

    // 建立myJobs，job資料要有10筆
    // 如果tempJobsObj有對應的資料，就把對應的資料放進去
    // 否則建立空的資料放進去
    const myJobs: TmyJobs[] =
      Array(10).fill(undefined)
        .map((jItem, jIndex) => {
          if (tempJobsObj[jIndex + 1]) {
            return new JobClass({
              jobData: tempJobsObj[jIndex + 1],
              departmentId: this.id,
              setMyDepartment
            })
          }
          return new EmptyJobClass({
            jIndex, departmnetId: this.id, setMyDepartment,
          })
        })
    this.jobs = myJobs
  } // constructor
  // --------------------------------
  dOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!this.isNew) this.dMethod = "patch"
    const value = e.target.value
    this.name = value
    this.#setMyDepartment((myDepartment) => [...myDepartment])
  }
  dMarkDel = (e: MouseEvent) => {
    e.stopPropagation()
    if (this.isNew && this.index) {
      this.#setMyDepartment((myDepartment) => {
        myDepartment.splice(this.index!, 1)
        return [...myDepartment]
      })
      return
    }
    myAlert.confirm({
      title: `請確認是否刪除？`,
      content: `部門「${this.name}」`,
      className: style.modalConfirm,
      props: {
        onOk: () => {
          this.isMarkedDel = !this.isMarkedDel
          this.#setMyDepartment((myDepartment) => [...myDepartment])
        }
      }
    })
  }
  changeFocus = (isFocus: boolean) => {
    this.isFocus = isFocus
    this.#setMyDepartment((myDepartment) => [...myDepartment])
  }

}
// ================
class JobClass implements TmyJobs {
  departmentId: TmyJobs["departmentId"]
  id: TmyJobs["id"]
  grade: TmyJobs["grade"]
  name: TmyJobs["name"]
  jMethod: TmyJobs["jMethod"] = "nothing"
  isMarkedDel: TmyJobs["isMarkedDel"] = false
  isFocus: TmyJobs["isFocus"] = false
  #setMyDepartment: Dispatch<SetStateAction<Partial<TmyDepartmentData>[]>>

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
    this.#setMyDepartment = setMyDepartment
  }
  jOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (this.isMarkedDel) return
    const value = e.target.value
    this.name = value
    this.jMethod = "patch"
    this.#setMyDepartment((myDepartment) => [...myDepartment])
  }
  jMarkDel: TmyJobs["jMarkDel"] = (e: MouseEvent) => {
    e.stopPropagation()
    if (this.isMarkedDel) {
      this.jMethod = "patch"
      this.isMarkedDel = false
      this.#setMyDepartment((myDepartment) => [...myDepartment])
      return
    }
    myAlert.confirm({
      title: `請確認是否刪除？`,
      content: `職等「${this.grade}」 「${this.name}」`,
      className: style.modalConfirm,
      props: {
        onOk: () => {
          this.isMarkedDel = true
          this.#setMyDepartment((myDepartment) => [...myDepartment])
        }
      }
    })
  }
  changeFocus = (isFocus: boolean) => {
    this.isFocus = isFocus
    this.#setMyDepartment((myDepartment) => [...myDepartment])
  }
}

// ================
class EmptyJobClass implements TmyJobs {
  // department: TmyDepartmentData
  departmentId: TmyJobs["departmentId"]
  grade: TmyJobs["grade"]
  name: TmyJobs["name"]
  jMethod: TmyJobs["jMethod"]
  isNew: TmyJobs["isNew"]
  isMarkedDel: TmyJobs["isMarkedDel"] = false
  isFocus: TmyJobs["isFocus"] = false
  #setMyDepartment: Dispatch<SetStateAction<Partial<TmyDepartmentData>[]>>
  // -------
  constructor(
    { jIndex, departmnetId, setMyDepartment, }:
      {
        jIndex: number
        departmnetId: string | undefined
        setMyDepartment: Dispatch<SetStateAction<Partial<TmyDepartmentData>[]>>
      }
  ) {
    this.grade = jIndex + 1
    this.departmentId = departmnetId
    this.jMethod = "nothing"
    this.isNew = true
    this.#setMyDepartment = setMyDepartment
  }
  // -------
  jOnChange: TmyJobs["jOnChange"] = (e: ChangeEvent<HTMLInputElement>) => {
    if (this.isMarkedDel) return
    const value = e.target.value
    this.name = value
    this.#setMyDepartment((myDepartment) => [...myDepartment])
  }
  addJobs: TmyJobs["addJobs"] = () => {
    this.jMethod = "post"
    this.#setMyDepartment((myDepartment) => [...myDepartment])
  }
  jMarkDel: TmyJobs["jMarkDel"] = (e: MouseEvent) => {
    e.stopPropagation()
    // 因為本來就不存在於資料庫，
    // 所以只要把jMethod改回"nothing"，避免post就好了
    this.jMethod = "nothing"
    this.name = ""
    this.#setMyDepartment((myDepartment) => [...myDepartment])
  }
  changeFocus = (isFocus: boolean) => {
    this.isFocus = isFocus
    this.#setMyDepartment((myDepartment) => [...myDepartment])
  }
}
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
const useDeparmentGrid = (departments: Partial<TgetDepartments>) => {

  const [myDepartment, setMyDepartment] = useState<Partial<TmyDepartmentData>[]>([])

  useEffect(() => {
    if (!Array.isArray(departments.data)) return
    const myDepartment = _.cloneDeep(departments.data) as TmyDepartmentData[]

    // 對每一個department資料進行處理
    myDepartment.forEach((dItem, dIndex, arr) => {
      delete dItem.createdAt
      delete dItem.updatedAt

      dItem = new DepartmentClass({
        dItem, setMyDepartment
      })
      arr[dIndex] = dItem
    })
    setMyDepartment(myDepartment)
  }, [departments])

  // -------------------------------------------------------------
  const addDepartment = (name: string) => {
    const dItem: Pick<TmyDepartmentData, "id" | "name" | "jobs"> = {
      id: undefined,
      name: name ?? "",
      jobs: []
    }
    const newDepartment = new DepartmentClass(
      {
        dItem, setMyDepartment,
        isNew: true,
        index: myDepartment.length
      }
    )
    myDepartment.push(newDepartment)
    setMyDepartment([...myDepartment])
  }

  // ------------------------------------------------------------
  return { myDepartment, setMyDepartment, addDepartment }
}

export type TuseDeparmentGrid = ReturnType<typeof useDeparmentGrid>

// =================================================================

// 批次上傳
const uploads = async (
  myDepartment: TuseDeparmentGrid["myDepartment"],
  toUpdate: () => void
) => {

  try {
    setRootLoading(true)
    for (let department of myDepartment) {
      const {
        name: dName,
        dMethod,
        jobs, isMarkedDel
      } = department

      let departmentId = department.id

      if (dMethod === "patch") await apiPatchDepartments(departmentId!, { name: dName! })
      if (isMarkedDel) {
        await apiDeleteDepartments(departmentId!)
        continue
      }
      let newDepartment;
      if (dMethod === "post") newDepartment = await apiPostDepartments({ name: dName ?? "" })
      departmentId = newDepartment?.id
      if (!departmentId) continue

      for (let job of jobs!) {
        const { grade, id, jMethod: method, isMarkedDel } = job
        let { name } = job
        if (!grade) continue
        if (name === undefined) name = ""
        if (isMarkedDel) await apiDeleteJobs(id!)
        if (method === "patch") await apiPatchJobs(id!, { grade, name, departmentId })
        if (method === "post") await apiPostJobs({ grade, name, departmentId })
      }
    }
  } // try
  catch (err) {
    myAlert.err({
      title: "批次上傳發生錯誤",
    })
  }
  finally {
    setRootLoading(false)
    toUpdate()
  }
}
