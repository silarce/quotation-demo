
import {
  useState,
  MouseEvent
} from 'react';

import { useRouter } from 'next/router';


// components
import ListTop01 from '../local/list/list01/listTop01';
import ListHeader01 from '../local/list/list01/listHeader01';

// css
import style from "./budgetList.module.scss"


// fakeData
import { TcontractList } from "meta/fakeData/fakeContractList";


export default function BudgetList({ contractList }:
  { contractList: TcontractList }) {

  const router = useRouter()

  return (
    <div className={style.container}>
      <ListTop01 />
      {contractList.map((item, index) => {
        const { quotationId } = item
        const onClick = () => {
          router.push(`/domestic/contract/quotation/${quotationId}`)
        }
        return (
          <ListHeader01 key={index} contract={item} onClick={onClick} />
        )
      })}
    </div>
  )


}











