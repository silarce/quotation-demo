import {
  Dispatch, SetStateAction,
  useState, useEffect
} from "react"
import { useRouter } from "next/router"



// component
import PageHeader, { TpanelList } from "components/page/worksDepartment/contracList/contract/gear/PageHeader"
import Profile from "components/page/worksDepartment/contracList/contract/listOfDeliveryOrders/profile"
import EditTransfer from "components/page/worksDepartment/contracList/contract/listOfDeliveryOrders/editTransfer"
import IconEdit from "components/page/worksDepartment/contracList/contract/listOfDeliveryOrders/iconEdit"

// css
import style from "../listOfDeliveryOrders.module.scss"



export default function Edit() {
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()
  // ----------------------------------------------------
  const [profile, setProfile] = useState<Partial<Tprofile>>({})
  const [transferList, setTransferList] = useState<Ttransfer[]>([])

  const addTransfer = () => {
    transferList.push(fakeTransferOri())
    setTransferList([...transferList])
  }
  const delTransfer = (index: number) => {
    transferList.splice(index, 1)
    setTransferList([...transferList])
  }



  useEffect(() => {
    setProfile(fakeProfileOri())
    setTransferList(fakeTransferListOri())
    setIsReady(true)
  }, [])



  // ----------------------------------------------------
  const panelList: TpanelList = [
    {
      type: "myButton",
      label: "編輯",
      onClick: () => alert("test")
    },
    {
      type: "exportButton",
      label: "匯出調(退)貨憑單",
      onClick: () => alert("test")
    },
    {
      type: "myButton",
      label: "取消",
      onClick: () => router.back()
    },
  ]

  // ----------------------------------------------------
  if (!isReady) return null
  return (

    <div className={style.container}>

      <PageHeader panelList={panelList} />

      <div className={`${style.mainContainer} ${style.powerTransmissionSpareList}`}>
        <Profile data={profile} setData={setProfile} />
        <EditTransfer
          transferList={transferList}
          setTransferList={setTransferList}
          addTransfer={addTransfer}
          delTransfer={delTransfer}
        />
        <IconEdit />
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


// ===========================================================

export type Ttransfer = {
  itemName: string
  material: string
  qty: string
  reason: string
}

const fakeTransferListOri = (): Ttransfer[] => {
  const transferOri = () => ({
    itemName: "SD1",
    material: "不鏽鋼304#",
    qty: "1",
    reason: "退貨理由退貨理由退貨理由退貨理由退貨理由退貨理由退貨理由",
  })
  return Array(4)
    .fill(undefined)
    .map(() => transferOri())
}

const fakeTransferOri = (): Ttransfer => ({
  itemName: "",
  material: "",
  qty: "",
  reason: "",
})

