
import {
  useState,
  MouseEvent
} from 'react';

// components
import ListTop01 from '../local/list/list01/listTop01';
import ListHeader01 from '../local/list/list01/listHeader01';

// css
import style from "./budgetList.module.scss"

// fakeData
import { TcontractList } from "meta/fakeData/fakeContractList";


export default function BudgetList({ contractList }:
  { contractList: TcontractList }) {


  // ===================================================
  const onClick = () => alert("test")
  // ===================================================




  return (
    <div className={style.container}>
      <ListTop01 />
      {contractList.map((item, index) => {
        return (
          <ListHeader01 key={index} contract={item} onClick={onClick} />
        )
      })}
    </div>
  )


}











