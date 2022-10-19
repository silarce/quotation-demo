// 客戶列表
// 客戶列表
import {
  ChangeEvent, Dispatch, SetStateAction,
  useState, useMemo,
} from "react"

// components
import List from "components/page/setting/clientList/list"
import EditClient from "components/page/setting/clientList/editClient"

// global gear
import TwoButtonModal from "components/global/gear/modal/simpleModal/twoButtonModal"
import PageHeader02, { TpanelList, TsearchObj } from "components/PageHeader/pageHeader02"

// api
import { useCustomers } from "js/api/api_customer"

// css
import style from "./clientList.module.scss"

// fakeData
import {
  TclientProfile,
  fakeClientProfileList,
} from "fakeDatabase/client/fakeClientList"
import { optionsCreator_clientSearch, Toption } from "fakeDatabase/options/options"


export default function ClientList() {


  // =============================================================
  // data
  const [clientList, setClientList] = useState(fakeClientProfileList)
  // ====================================================
  // 空資料，新增員工資料用
  const newClientProfile = useMemo(() => {
    const lastNum = parseInt(clientList[clientList.length - 1].clientId.substring(1))
    const newStaffId = "S" + (`${lastNum + 1}`.padStart(4, "0"))
    clientEmpty.clientId = newStaffId
    return clientEmpty
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientList.length])

  // 被編輯的資料，預設為空資料
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
    const id = selClientProfile.clientId
    const delIndex = clientList.findIndex((item) => item.clientId === id)
    setClientList(state => {
      state.splice(delIndex, 1)
      return [...state]
    })
    setShowDeletePanel(false)
  }
  // ====================================================
  // 用於搜尋功能，過濾資料

  const [searchObj, setSearchObj] = useState<TsearchObj>({
    searchType: "clientId",
    searchContent: "",
  })

  const filteredList = useMemo(() => {
    const { searchType, searchContent } = searchObj
    let filteredList;
    const reg = new RegExp(searchContent)

    if (searchType === "clientId") {
      filteredList =
        clientList
          .filter((item) => reg.test(item.clientId))
    }
    if (searchType === "name") {
      filteredList =
        clientList
          .filter((item) => reg.test(item.name))
    }
    if (searchType === "contactPerson") {
      filteredList =
        clientList
          .filter((item) => {
            const contact = item.contact
            return contact.find((item) => reg.test(item.name))
          })
    }
    if (searchType === "phone") {
      filteredList =
        clientList
          .filter((item) => {
            const contact = item.contact
            return contact.find((item) => reg.test(item.phone))
          })
    }
    return filteredList || []
  }, [searchObj, clientList])


  // ====================================================
  return (
    <div className={style.container}>
      {isEdit
        ? <ButtonBar02 selClientProfile={selClientProfile} resetEditPanel={resetEditPanel} />
        : <ButtonBar01
          addClient={addClient}
          setSearchObj={setSearchObj}
        />}

      <div className={style.mainContainer} >
        {isEdit
          ? <EditClient selData={selClientProfile} setSelData={setSelClientProfile} />
          : <List {...{
            clientList: (filteredList),
            editClient, openDeletePanel
          }} />}
      </div>

      <TwoButtonModal
        {...{
          visible: showDeletePanel,
          setVisible: setShowDeletePanel,
          text: `請確定要刪除「${selClientProfile.clientId}」「${selClientProfile.name}」?`,
          onConfirm: deleteSelProfile
        }} />
    </div>
  )
}

// ================================================================

const ButtonBar01 = ({
  addClient, setSearchObj
}:
  {
    addClient: () => void
    setSearchObj: Dispatch<SetStateAction<TsearchObj>>
  }) => {
  // ===========================================
  const clientSearchOptions = optionsCreator_clientSearch()
  const [searchType, setSearchType] = useState<Toption>(clientSearchOptions[0])
  const [searchContent, setSearchContent] = useState("")

  const searchTargetList = [
    {
      stateValue: searchType,
      options: clientSearchOptions,

      width: "90px",
      onChange: (option: Toption | null) => {
        if (!option) return
        setSearchType(option)
      }
    },
    {
      stateValue: searchContent,
      placeholder: "請輸入搜尋內容",
      onChange: (e: ChangeEvent<HTMLInputElement>) => setSearchContent(e.target.value)
    },
  ]

  const doSearch = () => {
    setSearchObj({
      searchType: searchType.value,
      searchContent
    })
  }

  const searchGroup = {
    searchTargetList,
    doSearch
  }

  // ===========================================

  const panelList: TpanelList = [
    {
      searchGroup
    },
    {
      type: "addButton",
      label: "新增客戶資料",
      onClick: addClient
    }
  ]
  return (
    <PageHeader02 tag="客戶列表" panelList={panelList} />
  )
}

const ButtonBar02 = (
  { selClientProfile, resetEditPanel }:
    {
      selClientProfile: TclientProfile
      resetEditPanel: () => void
    }
) => {

  const panelList: TpanelList = [
    {
      type: "myButton",
      label: "上傳",
      onClick: () => alert(`上傳${selClientProfile.clientId}的資料`)
    },
    {
      type: "redButton",
      label: "取消",
      onClick: resetEditPanel
    },
  ]
  return (
    <PageHeader02 tag="客戶列表" panelList={panelList} />
  )
}

// ===================================================================================================
const clientEmpty: TclientProfile = {
  clientId: "",
  type: "",
  name: "",
  shortName: "",
  phone: "",
  fax: "",
  head: "",
  address: "",
  billAddress: "",
  taxtNumber: "",
  taxtType: "",
  clientState: "",
  contact: [
    {
      name: "",
      phone: "",
    },
  ]
}
