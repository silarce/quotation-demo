import { useState } from 'react';
import styled from '@emotion/styled';
// component
import AutosizeInput from 'react-input-autosize';


// css
import style from "./departments.module.scss"



// type
import { TgetDepartments } from "js/api/api_department"
import { Dispatch, SetStateAction } from "react"






export default function List(
  { data, setData }:
    {
      data: Partial<TgetDepartments>
      setData: Dispatch<SetStateAction<Partial<TgetDepartments>>>
    }
) {

  const list = data.data




  return (
    <div className={style.titles}>
      <div></div>

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