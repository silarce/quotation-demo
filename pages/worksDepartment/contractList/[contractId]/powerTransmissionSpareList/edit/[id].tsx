import {
  Dispatch, SetStateAction,
  useState, useEffect
} from "react"
import { useRouter } from "next/router"



// component
import PageHeader, { TpanelList } from "components/page/worksDepartment/contracList/contract/gear/PageHeader"
import Profile from "components/page/worksDepartment/contracList/contract/powerTransmissionSpareList/profile"
import Sheet from "components/page/worksDepartment/contracList/contract/powerTransmissionSpareList/sheet"
import Signature from "components/page/worksDepartment/contracList/contract/powerTransmissionSpareList/signature"

// css
import style from "../powerTransmissionSpareList.module.scss"




// ======================================================
export default function Edit() {
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()
  const [editable, setEditable] = useState(false)
  // ----------------------------------------------------
  const [profile, setProfile] = useState<Partial<Tprofile>>({})
  const [signature, setSignature] = useState<Partial<Tsignature>>({})

  const init = () => {
    setProfile(fakeProfileOri())
    setSignature(fakeSignatureOri())
  }

  useEffect(() => {
    init()
    setIsReady(true)
  }, [])



  // ----------------------------------------------------
  const panelList: TpanelList = [
    {
      type: editable ? "redButton" : "myButton",
      label: editable ? "取消" : "編輯",
      onClick: () => {
        if (editable) { init(); setEditable(false) }
        else setEditable(true)
      }
    },
    {
      type: "exportButton",
      label: "匯出送電配料單",
      onClick: () => alert("test")
    },
    {
      type: "myButton",
      label: "返回",
      onClick: () => router.back()
    },
  ]

  // ----------------------------------------------------
  if (!isReady) return null
  return (

    <div className={style.container}>

      <PageHeader panelList={panelList} />

      <div className={`${style.mainContainer}`}>
        <div className={style.powerTransmissionSpareList}>
          <Profile data={profile} setData={setProfile}
            editable={editable} />
          <Sheet editable={editable}/>
          <Signature
            signature={signature} setSignature={setSignature}
            editable={editable}
          />
        </div>
      </div>

    </div>


  )
}

// ===========================================================

export type Tprofile = {
  // id: string
  projectId: string
  projectName: string
  neededDate: string
  applyDate: string
}


const fakeProfileOri = (): Tprofile => ({
  // id: "111001",
  projectId: "M-1102112",
  projectName: "台中港加工處理區-宇隆科技廠房增建工程A",
  neededDate: "111-02-02",
  applyDate: "111-02-02",
})


// ===================================================
export type Tsignature = {
  領料人員: string
  配料人員: string
  填表人員: string
}

const fakeSignatureOri = (): Tsignature => ({
  領料人員: "林曉雯",
  配料人員: "林曉雯",
  填表人員: "林曉雯",
})










