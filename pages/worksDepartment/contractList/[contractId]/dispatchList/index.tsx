// 派工單列表
// 派工單列表
// 派工單列表

import {
  Dispatch, SetStateAction,
  useState, useEffect
} from "react"
import { useRouter } from "next/router"




// component
import PageHeader, { TpanelList } from "components/page/worksDepartment/contracList/contract/gear/PageHeader"
import Profile from "components/page/worksDepartment/contracList/contract/dispatchList/profile"
import List from "components/page/worksDepartment/contracList/contract/dispatchList/list"

// css
import style from "./dispatchList.module.scss"


export default function DispatchList() {
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()
  // ----------------------------------------------------
  // const [data, setData] = useState<TfakeData>()
  const [profile, setProfile] = useState<TfakeProfile>()
  const [list, setList] = useState<TfakeDispatch[]>()


  useEffect(() => {
    setProfile(fakeProfileOri(router.query.contractId as string ?? ""))
    setList(fakeListOri())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  // ----------------------------------------------------
  const panelList: TpanelList = [
    {
      type: "addButton",
      label: "新增派工單",
      onClick: () => router.push(`${router.asPath}/add`)
    }
  ]

  return (
    <div className={style.container}>

      <PageHeader panelList={panelList} />

      <div className={style.mainContainer}>

        {profile && list &&
          <div className={style.dispatchList}>
            <Profile profile={profile!} setProfile={setProfile as Dispatch<SetStateAction<TfakeProfile>>} />
            <List list={list} setList={setList as Dispatch<SetStateAction<TfakeDispatch[]>>} />
          </div>
        }
      </div>
    </div>
  )
}

// =============================================

// 假資料，為了開發方便容易辨識，
// 暫時先用中文變數
export type TfakeProfile = {
  工程名稱: string,
  承包商: string,
  聯絡人: string,
  工地電話: string,
  工程地點: string,
  工程編號: string,
  管制卡編號: string,
}


const fakeProfileOri = (工程編號: string): TfakeProfile => ({
  工程名稱: "台灣日鑛金屬(股)公司~JX金屬台灣彰濱廠房增建工程",
  承包商: "創典科技A有限公司",
  聯絡人: "林先生",
  工地電話: "04-1234567",
  工程地點: "臺中市梧棲區經二路27號",
  工程編號: 工程編號,
  管制卡編號: "",
})


export type TfakeDispatch = {
  日期: string,
  工務人員: string,
  辦理事項: string,
}


const fakeListOri = (): TfakeDispatch[] => [
  {
    日期: "100-01-01",
    工務人員: "王先生小文",
    辦理事項: `辦理事項`,
  },
  {
    日期: "100-01-02",
    工務人員: "王先生",
    辦理事項: `辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項`,
  },
  {
    日期: "100-01-05",
    工務人員: "王先生",
    辦理事項: `辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項`,
  },
  {
    日期: "100-11-01",
    工務人員: "王先生大文",
    辦理事項: `辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項`,
  },
  {
    日期: "100-05-01",
    工務人員: "小文",
    辦理事項: `辦理事項辦理事項辦理事項辦理事項辦理事
    項辦理事項辦理事項`,
  },
  {
    日期: "105-01-26",
    工務人員: "王先生小文",
    辦理事項: `辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項`,
  },
  {
    日期: "109-12-01",
    工務人員: "王先生小文",
    辦理事項: `辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項辦理事項`,
  },
]




// const fakeDataOri = (工程編號: string) => ({
//   profile: fakeProfileOri(工程編號),
//   list: fakeList()
// })

// export type TfakeData = ReturnType<typeof fakeDataOri>




