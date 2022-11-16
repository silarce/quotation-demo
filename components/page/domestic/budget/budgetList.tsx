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

// data type
import {
  TbudgetList,
} from 'fakeDatabase/domestic/budget/fakeBudgetListGroup';
import { TsearchObj } from 'components/global/gear/HOC/searchBar/searchBar';


const { Panel } = Collapse
// ========================



export default function BudgetList({ budgetList, searchObj }:
  {
    budgetList: TbudgetList
    searchObj: TsearchObj
  }) {
  const router = useRouter()


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
          const { quotationId,
            doorType,
            country,
            clientName,
            projectName, } = item
          const isActive = activeIndex === index

          const openQuotation = (e: MouseEvent) => {
            e.stopPropagation()
            router.push(`/domestic/budget/quotation/${quotationId}`)
          }
        const {detail} = item
        // ===========================
        // 搜尋過濾
        const regDoorType = new RegExp(searchObj.doorType)
        const regCountry = new RegExp(searchObj.country)
        const regClientName = new RegExp(searchObj.clientName)
        const regProjectName = new RegExp(searchObj.projectName)
        if (
        !regDoorType.test(doorType) ||
        !regCountry.test(country) ||
        !regClientName.test(clientName) ||
        !regProjectName.test(projectName)
        ) return null
        // ===========================

        return (
        <Panel key={index} className={style.panel}
          header={<PanelHeader budget={item} isActive={isActive} openQuotation={openQuotation} />}
        >
          <PanelBody budgetDetail={detail} />
        </Panel>
        )
        })}
      </Collapse>
    </div >
  )
}










