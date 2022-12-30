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
  // order:"DESC",
  populate: ["jobs"],
  // jobs的逆序排列在ClassDepartment做處理了
  // sort: "jobs.grade",
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


  // 將部門資料轉為Class
  const { CdepartmentArr, addCdepartment, removeCdepartment, getChangedData }
    = useClass(departmentArr, editable)

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
    // 將preJobs轉為逆序排列再賦值
    this.jobs = preJobs.reverse()

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

const useClass = (departmentArr: TdepartmentDto[], editable: boolean) => {
  const [CdepartmentArr, setCdepartmentArr] = useState<ClassDepartment[]>([])
  const reRender = () => setCdepartmentArr(state => [...state])

  useEffect(() => {
    if (!departmentArr[0] || editable) return;
    const classArr
      = departmentArr.map((department) => new ClassDepartment(department, reRender))
    setCdepartmentArr(classArr)
  }, [departmentArr, editable])

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




