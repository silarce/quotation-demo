// 公司職等職稱
// 公司職等職稱
import {
  ChangeEvent, Dispatch, SetStateAction,
  useState, useEffect, useMemo
} from "react"

const _ = require("lodash")

// component
import List from "components/page/setting/departments/list"

// glogal gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01"



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
  // ---------------------------------------------------------
  // 取得部門列表
  const { data, setData, update } = useDepartments(params)
  const { myDepartment, setMyDepartment } = useDeparmentGrid(data)

  console.log(myDepartment)

// 資料處理好了，接下來做介面
// 資料處理好了，接下來做介面
// 資料處理好了，接下來做介面
// 資料處理好了，接下來做介面
// 資料處理好了，接下來做介面


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
      onClick: () => { alert("test") }
    }
  ]
  const panelList02: TpanelList = [
    {
      type: "addButton",
      label: "新增部門",
      onClick: () => { alert("test") }
    },
    {
      type: "redButton",
      label: "上傳",
      onClick: () => { alert("test") }
    },
    {
      type: "myButton",
      label: "取消",
      onClick: () => { alert("test") }
    },
  ]
  // ---------------------------------------------------------



  // ---------------------------------------------------------
  if (!isReady) return null
  // ---------------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader02
        tag="公司職等職稱"
        panelList={panelList01}
      />

      <div className={style.mainContainer}>
        {data.data &&
          <div className={style.department}>
            <List data={data} setData={setData} />




          </div>
        }
        <LoadingCover01 isLoading={isLoading} />
      </div>

    </div>
  )
}


// ========================================================
// ========================================================
// ========================================================

/*
1 將departmant裡的jobs填滿為數量為10的陣列
  其中必須要name grade departmentId三個property
  必須依grade排序，大的在前，也就是10 9 8 7 ......0
2 舊有的jobs沒有departmentId這個property，要加進去
3 被更動過的jobs物件，要加入method:"patch"屬性
  以此辨識是否有被編輯過而需要發patch請求
4 post前需要把多餘的屬性去掉 只留下name grade departmentId
5 patch前需要把多餘的屬性去掉 只留下name grade 
*/

type TmyJobs = Partial<Omit<TjobsData, "department">> & {
  grade: number
  // onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  id?: string
  name?: string
  departmentId?: string
  new?: boolean
  patch?: boolean
  delete?: boolean
  // method?: "post" | "patch"
}

type TmyDepartmentData = Partial<Omit<TdepartmentData, "jobs">> & {
  jobs: TmyJobs[]
  // onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  // markDelete?: () => void
  new?: boolean
  patch?: boolean
  delete?: boolean
  // method?: "post" | "patch" | "delete"
}
// ----
const useDeparmentGrid = (departments: Partial<TgetDepartments>) => {

  const [myDepartment, setMyDepartment] = useState<Partial<TmyDepartmentData>[]>([])
  useEffect(() => {
    if (!Array.isArray(departments.data)) return
    const myDepartment = _.cloneDeep(departments.data) as TmyDepartmentData[]

    // 對每一個department資料進行處理
    myDepartment.forEach((item, dIndex, arr) => {
      delete item.createdAt
      delete item.updatedAt
      const { id, jobs } = item
      // --------
      // 把jobs陣列裡的東西放進tempJobsObj裡，並以grade作為key
      const tempJobsObj: { [key: number]: TmyJobs } = {}
      jobs?.forEach((item) => {
        delete item.createdAt
        delete item.updatedAt
        tempJobsObj[item.grade] = item
      })
      // --------
      // 建立myJobs，job資料要有10筆
      // 如果tempJobsObj有對應的資料，就把對應的資料放進去
      // 否則建立空的資料放進去
      const myJobs: TmyJobs[] =
        Array(10).fill(undefined)
          .map((item, jIndex) => {
            if (tempJobsObj[jIndex + 1]) return tempJobsObj[jIndex + 1]
            return {
              grade: jIndex + 1,
              departmentId: id,
              new: true,
              onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
                const value = e.target.value
                myDepartment[dIndex].jobs[jIndex].name = value
                setMyDepartment([...myDepartment])
              }
            }
          })
      // myJobs資料處理好了，替換item.jobs
      item.jobs = myJobs
      // --------------------
      // 改變部門名稱與新增刪除部門的標記
      // item.onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      //   const value = e.target.value
      //   myDepartment[dIndex].name = value
      //   myDepartment[dIndex].patch = true

      //   setMyDepartment([...myDepartment])
      // }
      // item.markDelete = () => {
      //   myDepartment[dIndex].delete = true
      //   setMyDepartment([...myDepartment])
      // }

    })

    setMyDepartment(myDepartment)
  }, [departments])

  // const addDepartment = (name: string) => {
  //   myDepartment.push({
  //     name,
  //     method: "post",
  //     jobs: []
  //   })
  // }


  return { myDepartment, setMyDepartment }
}






