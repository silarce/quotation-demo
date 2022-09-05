
import {
  useState,
  MouseEvent
} from 'react';
import { useRouter } from 'next/router';

// components
import ListTop01 from '../local/list/list01/listTop01';
import ListHeader01 from '../local/list/list01/listHeader01';
import ListBody01 from '../local/list/list01/listBody01';


// antd
import { Collapse } from 'antd';

// css
import style from "./contractList.module.scss"

// fakeData
import { TcontractList } from "meta/fakeData/fakeContractList";




const { Panel } = Collapse


export default function ContractList({ contractList }:
  { contractList: TcontractList }) {

  const router = useRouter()

  // 點擊變粉紅色用
  const [activeIndex, setActiveIndex] = useState(-1)
  const changeActive = (panelIndex: string | string[]) => {
    const activeIndex = parseInt(panelIndex as string)
    setActiveIndex(activeIndex)
  }
  // =============================================


  return (
    <div className={style.container}>
      <ListTop01 />
      <Collapse
        expandIcon={() => <></>}
        accordion={true}
        destroyInactivePanel={true}
        onChange={changeActive}
      >
        {contractList.map((item, index) => {
          const { memoList, quotationId } = item
          const isActive = activeIndex === index

          const onClick = (e: MouseEvent) => {
            e.stopPropagation()
            const isContract = true
            router.push({
              pathname: `/domestic/contract/quotation/${quotationId}`,
              query: { isContract }
            })
          }

          return (
            <Panel key={index} className={style.panel}
              header={
                <ListHeader01 contract={item} onClick={onClick} isActive={isActive} />
              }
            >
              <ListBody01 memoList={memoList} />
            </Panel>
          )
        })}
      </Collapse>
    </div>
  )
}



