import {
  useState,
  MouseEvent
} from 'react';


// components
import PanelHeader from './panel/panelHeader';
import PanelBody from './panel/panelBody';

// antd
import { Collapse as AntdCollapse } from 'antd';

// css
import style from "./list.module.scss"

// fakeData
import {
  TclientProfile, TclientProfileList,
} from "meta/fakeData/fakeClientList";



const { Panel } = AntdCollapse

export default function List(
  { clientList, editClient, openDeletePanel }:
    {
      clientList: TclientProfileList
      editClient: (profile: TclientProfile) => void
      openDeletePanel: (profile: TclientProfile) => void
    }) {

  // 點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1)
  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string)
    setActiveIndex(activeIndex)
  }

  return (
    <div className={style.container}>
      <AntdCollapse
        expandIcon={() => <></>}
        accordion={true}
        onChange={changeActive}
      >
        {clientList.map((item, index) => {
          const isActive = activeIndex === index ? true : false
          const newEditClient = () => editClient(item)
          const newOpenDeletePanel = (e: MouseEvent) => {
            e.stopPropagation()
            openDeletePanel(item)
          }

          return (
            <Panel className={style.panel} key={index}
              header={
                <PanelHeader clientData={item} isActive={isActive}
                  editClient={newEditClient} openDeletePanel={newOpenDeletePanel}
                />}
            >
              <PanelBody clientData={item} />
            </Panel>
          )
        })}
      </AntdCollapse>
    </div>
  )

}


