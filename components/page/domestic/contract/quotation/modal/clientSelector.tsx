
import {
  Dispatch, SetStateAction,
  useState, useMemo
} from 'react';

// global gear
import ModalListSelectorWithSearch from 'components/global/gear/modal/modalListSelectorWithSearch'
import CellWrapper from 'components/global/gear/cell/cellWithBar';
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';

// css
import style from "./clientSelector.module.scss"

// fakeData
import { fakeClientList, TclientProfile } from 'meta/fakeData/fakeClientList'
// fakeData/type
import { TuseProfile } from "../hook/useProfile"


export default function ClientSelector(
  { showModal, setShowModal, profileState }:
    {
      showModal: boolean
      setShowModal: Dispatch<SetStateAction<boolean>>
      profileState: TuseProfile
    }
) {

  const clientList = useMemo(() => {
    // 現在使用假資料，到時候要接api取資料
    return fakeClientList
  }, [])

  // ==================================================
  // 被選的資料
  const [selClient, setSelClient] = useState<TclientProfile>()
  // 搜尋過濾
  const [searchValue, setSearchValue] = useState("")
  // ==================================================
  const onClick = (item: TclientProfile) => {
    setSelClient(item)
  }
  const onConfirm = () => {
    if (!selClient) return ModalInfo("請選擇公司")
    const { setClientId, setClientName, setContactPerson,
      setContactPhone, setFax, } = profileState
    const { clientId, shortName, contact, fax } = selClient
    const { name: contactPerson, phone: contactPhone } = contact[0]

    setClientId(clientId)
    setClientName(shortName)
    setContactPerson(contactPerson)
    setContactPhone(contactPhone)
    setFax(fax)
    onCancel()
  }
  const onCancel = () => {
    setShowModal(false);
    setSearchValue("");
    setSelClient(undefined)
  }
  const onSearch = (value: string) => { setSearchValue(value) }
  // ==================================================

  return (
    <ModalListSelectorWithSearch {...{
      label: "請選擇公司", visible: showModal,
      setVisible: setShowModal,
      onConfirm, onCancel, onSearch
    }} >
      <ul className={style.container}>
        {clientList.map((item, index) => {
          const { clientId } = item;
          const isActive = clientId === selClient?.clientId ? true : false
          const { name } = item
          // ------
          const searchReg = new RegExp(searchValue)
          if (!searchReg.test(name)) return null
          // ------
          return (
            <CellWrapper key={index} isActive={isActive}
              element="li"
            >
              <div className={style.item}
                onClick={() => onClick(item)}
              >
                {name}
              </div>
            </CellWrapper>
          )
        })}
      </ul>
    </ModalListSelectorWithSearch >
  )
}

