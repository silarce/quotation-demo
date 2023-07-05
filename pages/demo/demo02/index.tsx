import {
  useRef, useEffect, useState,
  MutableRefObject, ForwardRefRenderFunction, forwardRef,
  MouseEvent
} from "react"

import { Moment } from "moment";

import SubLayer from "components/Layer/SubLayer/SubLayer";

import * as React from 'react';


import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from '@mui/material/TextField';
import { TimeField } from '@mui/x-date-pickers/TimeField';

import InputSel from "components/global/gear/inputAndSel/inputSel";


import scss from "./demo02.module.scss"


export default function Labe00() {

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement>(null!);
  const ref = useRef<HTMLDivElement>(null!)


  const [open, setOpen] = useState(false)


  return (
    <SubLayer className="">
      <div></div>

      <div className="p-5">

        <div 
        // className={scss.box}
        //  ref={ref}
        // onClick={() => { open || setOpen(true) }}
        >
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <TimePicker

              // label="喵喵喵"
              // value={value || null}
              ampm={true}
              // className={scss.foo}
              /**	If true, the open picker button will not be rendered (renders only the field). */
              // disableOpenPicker={true}

              // open={open}
              // onClose={() => setOpen(false)}
              // onAccept={(date) => {
              //   // const thedate = date
              //   setOpen(false)
              //   // console.log("acc", date)
              //   // setValue(date!)
              //   // console.log(thedate.format("HH:mm"))


              // }}


              // onChange={(date) => { console.log("onChange",date) }}

              // selectedSections="hours"
              // skipDisabled={true}


              // slotProps={{
              //   popper: { anchorEl: ref.current },
              // }}

              // slots={{
              //   field: (params) => {
              //     return (
              //       <TimeField
              //         {...params}
              //         onClick={(e) => {
              //           // @ts-ignore
              //           if (params.onClick) params.onClick(e)
              //           setOpen(true)
              //         }}
              //       />
              //     );
              //   }
              // }}


            />
          </LocalizationProvider>
        </div>
        <br />
        <br />

        <div className="w-[150px] inline-block">
          <InputSel
            label="DEMO"
            timePickerProps_mui={{
            }}
          />
        </div>





      </div>



    </SubLayer >
  )
}

