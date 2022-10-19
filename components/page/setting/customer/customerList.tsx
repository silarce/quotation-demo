
import {
  useState,
  MouseEvent
} from 'react';


// component
import PanelHeader from './customerList/panelHeader';
import PanelBody from './customerList/panelBody';
// antd
import { Collapse } from 'antd';

const { Panel } = Collapse
// css
import style from "./customer.module.scss"

// type
import { TgetCustomers } from 'js/api/api_customer';


export default function CustomerList(
  { data }: { data: TgetCustomers }) {


  const customersList = data.data


  // ========================================================
  // 點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState("-1")
  const changeActive = (panelIndex: string | string[]) => {
    if (typeof panelIndex !== "string") return
    const activeIndex = panelIndex
    setActiveIndex(activeIndex)
  }
  // ========================================================
  return (
    <div className={style.customerList}>
      <Collapse
        expandIcon={() => <></>}
        accordion={true}
        onChange={changeActive}
      >
        {customersList.map((data, index) => {
          const isActive = activeIndex === `${index}`
          return (
            <Panel className={style.panel} key={index}
              header={<PanelHeader
                customersData={data}
                isActive={isActive}
              />}
            >
              <PanelBody customersData={data} />
            </Panel>
          )
        })}
      </Collapse>
    </div>
  )
}