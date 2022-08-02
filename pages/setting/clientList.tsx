// 客戶列表
// 客戶列表
import {
  useState, useMemo, useRef,
  Dispatch, SetStateAction, MutableRefObject
} from "react"

// components
import PageHeader from "components/PageTitle/pageHeader"
import PanelHeader from "components/setting/clientList/panel/panelHeader"
import PanelBody from "components/setting/clientList/panel/panelBody"

// antd
import { Collapse } from 'antd';

// icon
import iconAdd from "public/image/icon/add.svg"
import iconSearch from "public/image/icon/search.svg"

// css
import style from "./clientList.module.scss"

// fakeData
import { fakeClientList } from "meta/fakeData/fakeClientList";


const { Panel } = Collapse

export default function ClientList() {

  // data
  const [clientList, setClientList] = useState(fakeClientList)

  // ======================================================
  // 點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1)
  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string)
    setActiveIndex(activeIndex)
  }

  // ====================================================
  const [isEdit, setIsEdit] = useState(false)

  // ====================================================
  // 用於搜尋功能
  const clientListRef = useRef<HTMLElement[]>([])









  return (
    <div className={style.scrollContainer}>
      <PageHeader>
        <ButtonBar01
          clientListRef={clientListRef} setIsEdit={setIsEdit} />
      </PageHeader>

      <div >
        <Collapse
          expandIcon={() => <></>}
          accordion={true}
          onChange={changeActive}
        >

          {clientList.map((item, index) => {

            const isActive = activeIndex === index ? true : false
            return (
              <Panel className={style.panel} key={index}
                header={
                  <PanelHeader clientData={item} isActive={isActive}
                    clientListRef={clientListRef} index={index}
                  />}
              >
                <PanelBody clientData={item} />
              </Panel>
            )
          })}

        </Collapse>


      </div>
    </div>
  )
}

// ================================================================

type TsetIsEdit = Dispatch<SetStateAction<boolean>>

const ButtonBar01 = ({
  setIsEdit, clientListRef
}:
  {
    setIsEdit: TsetIsEdit
    clientListRef: MutableRefObject<HTMLElement[]>
  }) => {
  // ===========================================
  // 搜尋
  const [inputValue, setInputVaue] = useState("")
  const searchHandler = () => {
    const ref = clientListRef.current.find(item => {
      const thisClientId
        = ((item.querySelector("#clientId") as HTMLElement).innerText)
      // = (item.attributes.getNamedItem("data-clientid") as Attr).value
      return thisClientId === inputValue
    })

    if (ref) ref.scrollIntoView()
    else alert(`${inputValue}不存在`)

    // 兩種取法，暫時先留著未來參考
    // console.log((clientListRef.current[0].attributes.getNamedItem("data-staffid") as Attr).value)
    // console.log((clientListRef.current[0].querySelector("td") as HTMLElement).innerText)
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
      // onClick={() => { setIsEditStaff(true) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconAdd.src} alt="add" />
        <span >新增客戶資料</span>
      </button>
    </div>
  )
}