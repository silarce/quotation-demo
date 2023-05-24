
import {
  Dispatch, SetStateAction,
  useState, useMemo, useEffect
} from 'react';
import { useInView } from 'react-intersection-observer';

// global gear
import ModalListSelectorWithSearch from 'components/global/gear/modal/modalListSelectorWithSearch'
import CellWrapper from 'components/global/gear/cell/cellWithBar';
import { ModalInfo } from 'components/global/gear/modal/simpleModal/alertModals';

// css
import style from "./clientSelector.module.scss"

// type
import { TcustomerDto } from 'js/api/dtoTypes';



export default function CustomerSelector(
  {
    showModal, setShowModal,
    customerArr, getCustomerByPage,
    searchCustomer,
    onConfirm }:
    {
      showModal: boolean
      setShowModal: Dispatch<SetStateAction<boolean>>
      customerArr: TcustomerDto[]
      getCustomerByPage: () => void
      searchCustomer: (v: string) => void
      onConfirm: (v: TcustomerDto) => void
    }
) {

  const [viewRef, inView] = useInView();


  useEffect(() => {
    if (!inView) return
    getCustomerByPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])


  // ==================================================
  // 被選的資料
  const [selClient, setSelClient] = useState<TcustomerDto>()
  // 搜尋過濾
  const [searchValue, setSearchValue] = useState("")
  // ==================================================
  const onClick = (item: TcustomerDto) => {
    setSelClient(item)
  }

  const theOnConfirm = () => {
    if (!selClient) return ModalInfo("請選擇公司")
    onConfirm(selClient)
    onCancel()
  }

  const onCancel = () => {
    setShowModal(false);
    setSearchValue("");
    setSelClient(undefined)
    searchCustomer("")
  }

  // const onSearch = (value: string) => { setSearchValue(value) }
  // ==================================================

  return (
    <ModalListSelectorWithSearch {...{
      label: "請選擇公司", visible: showModal,
      setVisible: setShowModal,
      onConfirm: theOnConfirm, onCancel
    }}
      onSearch={searchCustomer}
    >
      <ul className={style.container}>
        {customerArr.map((item, index, arr) => {
          const { id } = item;
          const isActive = id === selClient?.id ? true : false
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
                ref={arr.length - 7 === index ? viewRef : undefined}
                onClick={() => onClick(item)}>
                {name}
              </div>
            </CellWrapper>
          )
        })}
      </ul>
    </ModalListSelectorWithSearch >
  )
}

