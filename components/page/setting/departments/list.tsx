
import {
  Dispatch, SetStateAction,
  useState, useRef
} from 'react';

import { createPortal } from 'react-dom';


// component
import AutosizeInput from 'react-input-autosize';


// css
import style from "./departments.module.scss"


// type
import { TuseDeparmentGrid } from 'pages/setting/departments';




// =============================================
export default function List(
  { myDepartment, setMyDepartment }:
    {
      myDepartment: TuseDeparmentGrid["myDepartment"]
      setMyDepartment: TuseDeparmentGrid["setMyDepartment"]
    }
) {



  const theadRef = useRef(null!)


  console.log(myDepartment)


  return (
    <div className={style.list}>
      <div className={style.thead} ref={theadRef}>

      </div>


      {/* tbody */}
      <div className={style.tbody}>

        {myDepartment.map((dItem, dIndex) => {
          if (!theadRef?.current) return null

          const { name, dOnChange, jobs } = dItem


          return (
            <div className={style.jobsColumn} key={dIndex}>
              {/* 建立在thead裡面*/}
              {createPortal(
                <div>
                  <input type="text"
                    value={name}
                    onChange={dOnChange}
                  />
                </div>,
                theadRef.current)}
              {/* ============================ */}





            </div>
          )

        })}




      </div>




    </div>
  )

}


// =====================================================





{/* <AutosizeInput
value={foo}
onChange={function (event) {
  setFoo(event.target.value)
}}
placeholder="test"
/> */}