// 客戶列表
// 客戶列表
import {
  useState, useMemo, useRef,
  Dispatch, SetStateAction, MutableRefObject, RefObject
} from "react"

// components
import PageHeader from "components/PageTitle/pageHeader"
import List from "components/setting/clientList/list"
import EditClient from "components/setting/clientList/editClient"

// icon
import iconAdd from "public/image/icon/add.svg"
import iconSearch from "public/image/icon/search.svg"

// css
import style from "./clientList.module.scss"

// fakeData
import {
  TclientProfile, TclientProfileList,
  fakeClientList, clientEmpty
} from "meta/fakeData/fakeClientList";



export default function ClientList() {

  // data
  const [clientList, setClientList] = useState(fakeClientList)
  // ====================================================
  // 空資料，新增員工資料用
  const newClientProfile = useMemo(() => {
    const lastNum = parseInt(clientList[clientList.length - 1].id.substring(1))
    const newStaffId = "S" + (`${lastNum + 1}`.padStart(4, "0"))
    clientEmpty.id = newStaffId
    return clientEmpty
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientList.length])

  // 被編輯的員工資料，預設為空資料
  const [selClientProfile, setSelClientProfile] = useState<TclientProfile>(newClientProfile)

  // ====================================================
  const mainContainerRef = useRef<HTMLDivElement>(null)
  // ====================================================
  // 編輯頁面開關
  const [isEdit, setIsEdit] = useState(false)

  const resetEditPanel = () => {
    setIsEdit(false)
    setSelClientProfile(newClientProfile)
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = 0
    }
  }
  const editClient = (clientProfile: TclientProfile) => {
    setIsEdit(true)
    setSelClientProfile(clientProfile)
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = 0
    }
  }
  const addClient = () => {
    setIsEdit(true)
    setSelClientProfile(newClientProfile)
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = 0
    }
  }

  // ====================================================
  // 用於搜尋功能
  const clientListRef = useRef<HTMLElement[]>([])


  return (
    <div className={style.scrollContainer}>
      <PageHeader>
        {isEdit
          ? <ButtonBar02 selClientProfile={selClientProfile} resetEditPanel={resetEditPanel} />
          : <ButtonBar01
            clientListRef={clientListRef} addClient={addClient} />}
      </PageHeader>

      <div className={style.mainContainer} ref={mainContainerRef}>
        {isEdit
          ? <EditClient selData={selClientProfile} setSelData={setSelClientProfile} />
          : <List {...{ clientList, clientListRef, editClient }} />}
      </div>


    </div>
  )
}

// ================================================================

type TsetIsEdit = Dispatch<SetStateAction<boolean>>

const ButtonBar01 = ({
  addClient, clientListRef
}:
  {
    addClient: () => void
    clientListRef: MutableRefObject<HTMLElement[]>
  }) => {
  // ===========================================
  // 搜尋
  const [inputValue, setInputVaue] = useState("")
  const searchHandler = () => {
    const ref = clientListRef.current.find(item => {
      const thisClientId
        = ((item.querySelector("#clientId") as HTMLElement).innerText)
      return thisClientId === inputValue
    })

    if (ref) ref.scrollIntoView()
    else alert(`${inputValue}不存在`)

  }

  return (
    <div className={style.headerBar}>
      {/*  */}
      <div className={style.searchInput}>
        <input type="text" placeholder="輸入客戶編號"
          value={inputValue}
          onChange={e => { setInputVaue(e.target.value) }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSearch.src} alt="搜尋icon"
          onClick={searchHandler}
        />
        <div className={style.borderBottom} />
      </div>
      {/*  */}
      <button className={style.addButton}
        onClick={addClient}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconAdd.src} alt="add" />
        <span >新增客戶資料</span>
      </button>
    </div>
  )
}



const ButtonBar02 = (
  { selClientProfile, resetEditPanel }:
    {
      selClientProfile: TclientProfile
      resetEditPanel: () => void
    }
) => {

  return (
    <div className={style.headerBar}>
      <button className={style.uploadBtn}
        onClick={() => { alert(`上傳${selClientProfile.id}的資料`) }}
      >
        上傳
      </button>

      <button className={style.addButton}
        onClick={resetEditPanel}
      >
        取消
      </button>
    </div>
  )
}

