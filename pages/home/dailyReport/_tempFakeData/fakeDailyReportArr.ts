
interface TfakeDailyReport {
  job: string
  name: string
  isChecked: boolean,
  isForbidden: boolean,
  date: string,
}

const fakeDailyReport: TfakeDailyReport[] = [
  {
    job: "BO",
    name: "葉大雄",
    isChecked: false,
    isForbidden: true,
    date: "2023-03-01",
  },
  {
    job: "BO",
    name: "靜靜香",
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
  data: TfakeDailyReport[],
  startDate: string,
  endDate: string
): TfakeDailyReport[] {
  const newData: TfakeDailyReport[] = []

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


// const lotFakeData = generateData(fakeDailyReport, "2023-04-26", "2023-05-03")


export type { TfakeDailyReport }
export { fakeDailyReport, generateData }

