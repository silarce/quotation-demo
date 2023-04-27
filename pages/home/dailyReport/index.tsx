import { useState } from "react"

import _ from "lodash"

// component
import TheCalendar from "components/page/home/dailyReport/TheCalendar"
import SetReportEmpModal from "components/page/home/dailyReport/SetReportEmpModal"

// layer
import PageHeader02 from "components/PageHeader/PageHeader02/PageHeader02"
import SubLayer from "components/Layer/SubLayer/SubLayer"


// =====================================================================

export default function DailyReport() {
  const [showSetReportEmpModal, setShowSetReportEmpModal] = useState(true)





  const onConfirm = (employee: TfakeEmployee[]) => {
    console.log(employee)
  }
  const onCancel = () => {
    setShowSetReportEmpModal(false)
  }
  const onSearch = (v: string) => {
    console.log(v)
  }


  return (
    <>
      <SubLayer>
        <PageHeader02 tag="日報表" />
        <div >
          <TheCalendar dataArr={lotFakeData} />
        </div>

      </SubLayer>

      <SetReportEmpModal
        visible={showSetReportEmpModal}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onSearch={onSearch}
        dataArr={_.cloneDeep(fakeEmployeeArr)}
      />
    </>
  )
}

// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================
// ===============================================================

type TfakeEmployee = {
  idNumber: string
  chName: string
  jobName: string
  grade: string
  shouldReport: boolean
}


const fakeEmployeeArr: TfakeEmployee[] = [
  {
    idNumber: "EM-11204-01",
    chName: "李建一",
    jobName: "助理",
    grade: "Level 1",
    shouldReport: false,
  },
  {
    idNumber: "EM-11204-02",
    chName: "王志二",
    jobName: "助理",
    grade: "Level 1",
    shouldReport: true,
  },
  {
    idNumber: "EM-11204-03",
    chName: "張國三",
    jobName: "助理",
    grade: "Level 1",
    shouldReport: false,
  },
  {
    idNumber: "EM-11204-04",
    chName: "劉文四",
    jobName: "助理",
    grade: "Level 1",
    shouldReport: true,
  },
  {
    idNumber: "EM-11204-05",
    chName: "趙春五",
    jobName: "助理",
    grade: "Level 1",
    shouldReport: false,
  },
  {
    idNumber: "EM-11204-06",
    chName: "陳慧六",
    jobName: "助理",
    grade: "Level 1",
    shouldReport: true,
  },
  {
    idNumber: "EM-11204-07",
    chName: "楊天七",
    jobName: "資深助理",
    grade: "Level 2",
    shouldReport: false,
  },
  {
    idNumber: "EM-11204-08",
    chName: "黃德八",
    jobName: "助理",
    grade: "Level 1",
    shouldReport: false,
  },
  {
    idNumber: "EM-11204-09",
    chName: "周勇九",
    jobName: "非常資深助理",
    grade: "Level 3",
    shouldReport: false,
  },
  {
    idNumber: "EM-11204-10",
    chName: "吳華十",
    jobName: "助理",
    grade: "Level 1",
    shouldReport: false,
  },
]

// ===============================================================

interface Tdata {
  job: string
  name: string
  isChecked: boolean,
  isForbidden: boolean,
  date: string,
}

const fakeData: Tdata[] = [
  {
    job: "BO",
    name: "大雄",
    isChecked: false,
    isForbidden: true,
    date: "2023-03-01",
  },
  {
    job: "BO",
    name: "靜香",
    isChecked: false,
    isForbidden: false,
    date: "2023-03-01",
  },
  {
    job: "PD",
    name: "小夫",
    isChecked: false,
    isForbidden: false,
    date: "2023-03-01",
  },
  {
    job: "BO",
    name: "胖虎",
    isChecked: true,
    isForbidden: false,
    date: "2023-03-01",
  },
  {
    job: "GA",
    name: "小明",
    isChecked: false,
    isForbidden: false,
    date: "2023-03-01",
  },
  {
    job: "ED",
    name: "曉東",
    isChecked: true,
    isForbidden: false,
    date: "2023-03-01",
  },
  {
    job: "ED",
    name: "傑西",
    isChecked: false,
    isForbidden: false,
    date: "2023-03-01",
  },
  {
    job: "RD",
    name: "凱莉",
    isChecked: false,
    isForbidden: false,
    date: "2023-03-01",
  },
  {
    job: "HR",
    name: "哆啦",
    isChecked: false,
    isForbidden: true,
    date: "2023-03-01",
  },
  {
    job: "RD",
    name: "A夢",
    isChecked: false,
    isForbidden: false,
    date: "2023-03-01",
  },
]


function generateData(
  data: Tdata[],
  startDate: string,
  endDate: string
): Tdata[] {
  const newData: Tdata[] = []

  const startTime = new Date(startDate).getTime()
  const endTime = new Date(endDate).getTime()

  data.forEach((item) => {
    const { job, name, isChecked, isForbidden } = item

    // 86400000 是一天
    for (let time = startTime; time <= endTime; time += 86400000) {
      const date = new Date(time).toISOString().slice(0, 10)
      newData.push({
        job,
        name,
        isChecked: isChecked,
        isForbidden: isForbidden,
        date,
      })
    }
  })

  return newData
}


const lotFakeData = generateData(fakeData, "2023-04-26", "2023-05-03")

