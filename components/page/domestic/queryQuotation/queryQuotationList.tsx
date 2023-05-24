


import {
  useState,
  MouseEvent
} from 'react';

import { useRouter } from 'next/router';

// components
import Thead from './queryQuotationList/thead';
import PanelHeader from './queryQuotationList/panelHeader';
import PanelBody from './queryQuotationList/panelBody';

// antd
import { Collapse } from 'antd';

// css
import style from "./queryQuotationList.module.scss"

// data type
// import {
//   TbudgetList,
// } from 'fakeDatabase/domestic/budget/fakeBudgetListGroup';
import { TqueryQuotation } from 'pages/domestic/queryQuotation';
import { TsearchObj } from 'components/global/gear/HOC/searchBar/searchBar';


const { Panel } = Collapse
// ========================



export default function QueryQuotationList(
  { queryQuotationList, searchObj }:
    {
      queryQuotationList: TqueryQuotation[]
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
        {queryQuotationList.map((item, index) => {
          const { stepList, queryQuotationId } = item
          const isActive = activeIndex === index

          const openQuotation = (e: MouseEvent) => {
            e.stopPropagation()
            // router.push(`/domestic/contract/quotation/${quotationId}`)
            alert("test")
          }
          // ===========================
          // 搜尋過濾
          const regQueryQuotationId = new RegExp(searchObj.queryQuotationId ?? "")
          if (!regQueryQuotationId.test(queryQuotationId)) return null
          // ===========================

          return (
            <Panel key={index} className={style.panel}
              header={<PanelHeader queryQuotation={item} isActive={isActive} openQuotation={openQuotation} />}
            >
              <PanelBody stepList={stepList} />
            </Panel>
          )
        })}
      </Collapse>

    </div >


  )
}

