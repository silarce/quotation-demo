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


// css
import style from "./contract.module.scss"







export default function DispatchList() {
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()
  // ----------------------------------------------------
  const [data, setData] = useState<TfakeData>()

  useEffect(() => {
    setData(fakeDataOri(router.query.contractId as string ?? ""))
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

      <div className={`${style.mainContainer} ${style.dispatchList}`}>

        {data &&
          <Profile data={data} setData={setData as Dispatch<SetStateAction<TfakeData>>} />
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
  工程名稱: "",
  承包商: "",
  聯絡人: "",
  工地電話: "",
  工程地點: "",
  工程編號: 工程編號,
  管制卡編號: "",
})

const fakeDataOri = (工程編號: string) => ({
  profile: fakeProfileOri(工程編號)
})

export type TfakeData = ReturnType<typeof fakeDataOri>








