import { Fragment } from "react";

// css
import style from "./listBody01.module.scss";


// fakeData
import { Tcontract } from "meta/fakeData/fakeContractList";



export default function ListBody01({ memoList }:
  { memoList: Tcontract["memoList"] }) {





  return (
    <div className={style.container}>

      {memoList.map((item, index) => {

        const { memoId, memoDate, memoContent } = item

        return (
          <Fragment key={index}>
            <span>{memoId}</span>
            <span>{memoDate}</span>
            <span>{memoContent}</span>
          </Fragment>
        )
      })}

    </div>
  )
}