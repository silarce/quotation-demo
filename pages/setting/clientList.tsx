// 客戶列表
// 客戶列表
import {
  useState, useMemo,
} from "react"

// components
import PageHeader from "components/PageTitle/pageHeader"
import List from "components/setting/clientList/list"
import EditClient from "components/setting/clientList/editClient"
import InputSearch from "components/global/gear/input/inputSearch"
import AddButton from "components/global/gear/button/addButton"

// global gear
import TwoButtonModal from "components/global/gear/modal/simpleModal/twoButtonModal"


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
  // 編輯/新增
  const [isEdit, setIsEdit] = useState(false)

  const resetEditPanel = () => {
    setIsEdit(false)
    setSelClientProfile(newClientProfile)
  }
  const editClient = (clientProfile: TclientProfile) => {
    setIsEdit(true)
    setSelClientProfile(clientProfile)
  }
  const addClient = () => {
    setIsEdit(true)
    setSelClientProfile(newClientProfile)
  }

  // ====================================================
  // 刪除功能

  const [showDeletePanel, setShowDeletePanel] = useState(false)
  const openDeletePanel = (clientProfile: TclientProfile) => {
    setShowDeletePanel(true)
    setSelClientProfile(clientProfile)
  }

  const deleteSelProfile = () => {
    const id = selClientProfile.id
    const delIndex = clientList.findIndex((item) => item.id === id)
    setClientList(state => {
      state.splice(delIndex, 1)
      return [...state]
    })
    setShowDeletePanel(false)
  }
  // ====================================================
  // 用於搜尋功能
  const [filteredList, setFilteredList] = useState<typeof fakeClientList>([])

  const searchClient = (searchValue: string) => {

    // 搜尋編號
    let filteredList =
      clientList.filter((item) => searchValue === item.id)
    // 搜尋類別
    if (!filteredList[0]) {
      filteredList =
        clientList.filter((item) => searchValue === item.type)
    }
    // 搜尋全稱
    const regName = new RegExp(searchValue)
    if (!filteredList[0]) {
      filteredList =
        clientList.filter((item) => regName.test(item.name))
    }
    setFilteredList(filteredList)
  }

  return (
    <div className={style.container}>
      <PageHeader>
        {isEdit
          ? <ButtonBar02 selClientProfile={selClientProfile} resetEditPanel={resetEditPanel} />
          : <ButtonBar01
            addClient={addClient}
            searchClient={searchClient}
          />}
      </PageHeader>

      <div className={style.mainContainer} >
        {isEdit
          ? <EditClient selData={selClientProfile} setSelData={setSelClientProfile} />
          : <List {...{
            clientList: (filteredList[0] ? filteredList : clientList),
            editClient, openDeletePanel
          }} />}
      </div>

      <TwoButtonModal
        {...{
          visible: showDeletePanel,
          setVisible: setShowDeletePanel,
          text: `請確定要刪除「${selClientProfile.id}」「${selClientProfile.name}」?`,
          onOk: deleteSelProfile,
        }} />

    </div>
  )
}

// ================================================================

const ButtonBar01 = ({
  addClient, searchClient
}:
  {
    addClient: () => void
    searchClient: (searchValue: string) => void
  }) => {
  // ===========================================

  return (
    <div className={style.headerBar}>
      <InputSearch placeholder="編號/類別/全稱字段" onClick={searchClient} />
      <AddButton text="新增客戶資料" onClick={addClient} />
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

