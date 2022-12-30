// 公司職等職稱
// 公司職等職稱
import {
  ChangeEvent, Dispatch, SetStateAction, MouseEvent,
  useState, useEffect, useMemo,
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
import { setRootLoading, showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"

// api
import {
  TdepartmentDto, TjobDto, TgetDepartments, TupdateDepartmentJobDto,
  useDepartments,  // 取得部門列表
  apiPostDepartments, // 新增部門
  apiPatchDepartments_id, // 更新部門名稱
  apiDeleteDepartments, // 刪除部門
  apiPostJobs, // 新增職等
  apiPatchJobs, // 更新職等
  apiDeleteJobs, // 刪除職等
  apiPatchDepartments, // 批次更新部門資料(包括name與底下的jobs)
} from "js/api/api_department"

// css
import style from "./departments.module.scss"



// ===========================================================
const params = {
  // order: "ASC",
  // order:"DESC",
  populate: ["jobs"],
  // sort: "jobs.grade",
  // explain: true
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
  const departmentArr = data?.data ?? []

  const { myDepartment, setMyDepartment, addDepartment } = useDeparmentGrid(data ?? {})

  // 將部門資料轉為Class
  const { CdepartmentArr, addCdepartment, removeCdepartment, getChangedData }
    = useClass(departmentArr)

  // -------------------------------------------------------------------------

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
  const upload = async () => {
    // 刪除部門>刪除職等>新增部門>更新部門職等

    // -------------------------------
    // 刪除部門
    showRootLoading(true, "正在刪除部門")
    // 移除dWillDelete為true的Cdepartment，並取得被移除的Cdepartment
    const departmentWillDeleteArr
      = _.remove(CdepartmentArr, (item: ClassDepartment) => item.dWillDelete)
    // dwe === departmentWillRemove
    for (let dwr of departmentWillDeleteArr) {
      const id = dwr.id
      const name = dwr.name
      try {
        await apiDeleteDepartments(id)
      }
      catch {
        alert(`刪除部門${name}發生錯誤`)
      }
    }
    // -------------------------------
    // 刪除職等
    showRootLoading(true, "正在刪除職等")
    const jobIdWillDeleteArr: ClassJob[] = []
    // 把jWillDelete為true的job設為undefined
    CdepartmentArr.forEach((department) => {
      department.jobs.forEach((job, index) => {
        if (job?.jWillDelete) {
          jobIdWillDeleteArr.push(job)
          department.jobs[index] = undefined
        }
      })
    })

    for (let Cjob of jobIdWillDeleteArr) {
      const { id, name } = Cjob
      try {
        await apiDeleteJobs(id)
      }
      catch {
        alert(`刪除職等${name}發生錯誤`)
      }
    }
    // -------------------------------
    // 新增部門
    showRootLoading(true, "正在新增部門")
    for (let Cdepartment of CdepartmentArr) {
      if (Cdepartment.dIsNew) {
        try {
          const res = await apiPostDepartments({ name: Cdepartment.name })
          Cdepartment.id = res.id
        }
        catch {
          alert(`新增部門${Cdepartment.name}發生錯誤，流程中斷`)
          showRootLoading(false)
          toUpdate()
          return
        }
      }
    }
    // -------------------------------
    showRootLoading(true, "正在更新部門名稱與職等")
    // 更新部門職等
    const patchBody = getChangedData()
    try {
      await apiPatchDepartments(patchBody)
    }
    catch {
      alert("更新部門名稱與職等發生錯誤")
    }
    // -------------------------------
    showRootLoading(false)
    await toUpdate()
  }

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
      // onClick: () => { uploads(myDepartment, toUpdate) }
      onClick: () => { upload() }
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
        {data?.data &&
          <div className={style.department}>
            <Caption />
            <List
              myDepartment={myDepartment}
              setMyDepartment={setMyDepartment}
              editable={editable}
              CdepartmentArr={CdepartmentArr}
              removeCdepartment={removeCdepartment}
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
        onConfirm={(v) => addCdepartment(v)}
      />
    </div>
  )
}

// ==============================================================================
// ==============================================================================
// ==============================================================================

export class ClassDepartment {
  id: string
  _name: string
  jobs: (ClassJob | undefined)[]
  reRender: () => void //更新狀態

  _isFocus = false

  dWillDelete = false
  dWillPatch = false
  dIsNew = false

  // --------------------------------------------------------
  // --------------------------------------------------------
  constructor(
    department: TdepartmentDto | { newDepartmentName: string },
    reRender: () => void
  ) {

    let jobs: TdepartmentDto["jobs"];
    if ("id" in department) {
      this.id = department.id
      this._name = department.name
      jobs = department.jobs ?? []
    }
    else {
      this.id = ""
      this._name = department.newDepartmentName
      jobs = []
      this.dIsNew = true
    }

    const preJobs: (ClassJob | undefined)[] = new Array(10).fill(undefined)
    jobs.forEach((job) => {
      const theIndex = job.grade - 1
      preJobs[theIndex] = new ClassJob(job, reRender)
    })
    this.jobs = preJobs

    this.reRender = reRender
  } // constructor ------------------
  // --------------------------------------------------------

  get name() { return this._name }
  set name(v: string) {
    this._name = v
    this.dWillPatch = true
    this.reRender()
  }

  get isFocus() { return this._isFocus }
  set isFocus(v: boolean) {
    this._isFocus = v
    this.reRender()
  }

  addJob = (newJobindex: number) => {
    this.jobs[newJobindex] = new ClassJob({ newJobindex }, this.reRender)
    this.reRender()
  }

  // 刪除與反刪除按鈕
  dShowDeletePanel = (e: MouseEvent) => {
    e.preventDefault()
    if (this.dWillDelete) {
      this.dWillDelete = false
      this.reRender()
    }
    else {
      myAlert.confirm({
        title: `請確認是否刪除？`,
        content: `部門「${this.name}」`,
        className: style.modalConfirm,
        props: {
          onOk: () => {
            this.dWillDelete = !this.dWillDelete
            this.reRender()
          }
        }
      })
    }


  } // dShowDeletePanel

  // 移除job
  removeJob = (index: number) => {
    this.jobs[index] = undefined
    this.reRender()
  }


} // ClassDepartment ======================================================

class ClassJob {
  id: string
  _name: string
  grade: number
  reRender: () => void
  _isFocus = false

  jWillDelete = false
  jWillPatch = false
  jIsNew = false

  // -----------------------------------------------------
  // -----------------------------------------------------
  constructor(

    job: TjobDto | { newJobindex: number },
    reRender: () => void
  ) {
    if ("id" in job) {
      this.id = job.id
      this._name = job.name
      this.grade = job.grade
    }
    else {
      this.id = ""
      this._name = "新職稱"
      this.grade = job.newJobindex + 1
      this.jIsNew = true
    }
    this.reRender = reRender

  } // constructor ------------------
  // -----------------------------------------------------

  get name() { return this._name }
  set name(v: string) {
    this._name = v
    this.jWillPatch = true
    this.reRender()
  }

  get isFocus() { return this._isFocus }
  set isFocus(v: boolean) {
    this._isFocus = v
    this.reRender()
  }


  // 刪除與反刪除按鈕
  jShowDeletePanel = (e: MouseEvent) => {
    e.preventDefault()

    if (this.jWillDelete) {
      this.jWillDelete = false
      this.reRender()
      return
    }

    myAlert.confirm({
      title: `請確認是否刪除？`,
      content: `職稱「${this.name}」`,
      className: style.modalConfirm,
      props: {
        onOk: () => {
          this.jWillDelete = !this.jWillDelete
          this.reRender()
        }
      }
    })

  } // dShowDeletePanel


} // ClassJob=================================================================

const useClass = (departmentArr: TdepartmentDto[]) => {
  const [CdepartmentArr, setCdepartmentArr] = useState<ClassDepartment[]>([])
  const reRender = () => setCdepartmentArr(state => [...state])

  useEffect(() => {
    if (!departmentArr[0]) return;
    const classArr
      = departmentArr.map((department) => new ClassDepartment(department, reRender))
    setCdepartmentArr(classArr)
  }, [departmentArr])

  const addCdepartment = (newDepartmentName: string) => {
    CdepartmentArr.push(
      new ClassDepartment({ newDepartmentName }, reRender)
    )
    reRender()
  }
  const removeCdepartment = (index: number) => {
    CdepartmentArr.splice(index, 1)
    reRender()
  }

  const getChangedData = () => {

    const patchArr: TupdateDepartmentJobDto[] = []

    CdepartmentArr.forEach((department) => {
      const { name, id,
        dIsNew, dWillDelete, dWillPatch,
      } = department

      if (dWillDelete) return

      const patchObj: TupdateDepartmentJobDto
        = { id: id, name: name, jobs: [] }


      if (!dWillPatch) patchObj.name = undefined

      department.jobs.forEach((job) => {
        if (!job) return
        const { name, grade,
          jWillDelete, jWillPatch, jIsNew,
        } = job

        if ((!jIsNew && !jWillPatch) || jWillDelete) return

        patchObj.jobs.push({ name, grade })
      })

      if (!dWillPatch && !patchObj.jobs[0]) return;


      patchArr.push(patchObj)
    })

    return patchArr
  }


  return { CdepartmentArr, addCdepartment, removeCdepartment, getChangedData }

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
const uploads_old = async (
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

      if (dMethod === "patch") await apiPatchDepartments_id(departmentId!, { name: dName! })
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
