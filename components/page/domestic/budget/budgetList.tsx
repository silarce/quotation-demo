import {
  useState,
  MouseEvent
} from 'react';

import { useRouter } from 'next/router';

// components
import Thead from './budgetList/thead';
import PanelHeader from './budgetList/panelHeader';
import PanelBody from './budgetList/panelBody';

// antd
import { Collapse } from 'antd';

// css
import style from "./budgetList.module.scss"




// fake
import { fakeApi_projectSimple } from 'fakeDatabase/fakeAPI/fakeQuotationSimpleArrApi';


type TbudgetList = ReturnType<(typeof fakeApi_projectSimple)["get"]>


const { Panel } = Collapse
// ========================



export default function BudgetList({ budgetList }:
  {
    budgetList: TbudgetList
  }) {
  const router = useRouter()

  // ----------------------------------------------------------------


  // panelHeader點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1)
  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string)
    setActiveIndex(activeIndex)
  }



  return (
    <div className={style.container}>
      <Thead />

      <Collapse
        expandIcon={() => <></>}
        accordion={true}
        destroyInactivePanel={true}
        onChange={changeActive}
      >
        {budgetList.map((item, index) => {
          const { tempRecord, } = item
          const { quotationId, } = item.basicInfo
          const isActive = activeIndex === index

          const openQuotation = (e: MouseEvent) => {
            e.stopPropagation()
            router.push({
              pathname: "/domestic/budget/quotation",
              query: { quotationId }
            })
          }

          return (
            <Panel key={index} className={style.panel}
              header={<PanelHeader projectData={item} isActive={isActive} openQuotation={openQuotation} />}
            >
              <PanelBody projectSimpleRecord={tempRecord} openQuotation={openQuotation} />
            </Panel>
          )
        })}

      </Collapse>
    </div >
  )
}










