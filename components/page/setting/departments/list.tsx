
import {
  Dispatch, SetStateAction,
  useState, useRef, Fragment
} from 'react';



// component
import AutosizeInput from 'react-input-autosize';

// icon
import { IconCross01 } from 'public/image/icon/svgComponent/svgIcons';
import iconAdd from "public/image/icon/add.svg"
import { RedoOutlined } from '@ant-design/icons';


// css
import style from "./departments.module.scss"


// type
import { TuseDeparmentGrid } from 'pages/setting/departments';




// =============================================
export default function List(
  { myDepartment, setMyDepartment, editable }:
    {
      myDepartment: TuseDeparmentGrid["myDepartment"]
      setMyDepartment: TuseDeparmentGrid["setMyDepartment"]
      editable: boolean
    }
) {

  // 這個return裡面根據不同的情況有三種return
  return (
    <div className={style.list}>
      <div className={style.row}>
        {myDepartment.map((dItem, dIndex) => {
          const { name, jobs, dMethod, isMarkedDel, isFocus,
            dOnChange, dMarkDel, changeFocus
          } = dItem

          let styleHead: string = `${style.cell} ${style.head}`
          
          if (isMarkedDel) styleHead
            = `${styleHead} ${style.delete}`

          if (isFocus) styleHead = `${styleHead} ${style.isFocus}`

          const TheIcon = isMarkedDel ? RedoOutlined : IconCross01


          return (
            <div className={`${style.columns}`} key={dIndex}>
              {/* 建立在thead裡面*/}
              <div className={styleHead}>
                <label className={style.inputBox}>
                  <AutosizeInput type="text"
                    value={name}
                    onChange={dOnChange}
                    disabled={!editable || isMarkedDel}
                    onFocus={() => changeFocus?.(true)}
                    onBlur={() => changeFocus?.(false)}
                  />
                  <TheIcon className={style.iconCross01}
                    onClick={editable ? dMarkDel : undefined} />
                </label>
                <p>A</p>
                <div className={style.focusBg} />
              </div>

              {/* ============================ */}

              {jobs?.reverse().map((item, index) => {
                const { grade, id, name, jMethod,
                  isMarkedDel, isNew, isFocus,
                  jOnChange, addJobs, jMarkDel, changeFocus
                } = item

                if (isNew && jMethod === "nothing")
                  return (
                    <div className={`${style.cell} ${style.empty}`} key={index}
                      onClick={editable ? addJobs : undefined}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={iconAdd.src} alt=""
                      />
                    </div>
                  )

                let className: string = style.cell
                if (isMarkedDel) className = `${style.cell} ${style.delete}`
                if (isFocus) className = `${style.cell} ${style.isFocus}`
                const TheIcon = isMarkedDel ? RedoOutlined : IconCross01

                return (
                  <div className={className} key={index}>
                    <label className={style.inputBox}>
                      <AutosizeInput type="text"
                        value={name ?? ""}
                        onChange={jOnChange}
                        disabled={!editable || isMarkedDel}
                        onFocus={() => { changeFocus(true) }}
                        onBlur={() => { changeFocus(false) }}
                      />
                      <TheIcon className={style.iconCross01}
                        onClick={editable ? jMarkDel : undefined} />
                    </label>
                    <div className={style.focusBg} />
                  </div>
                )
              })}
            </div> // thead
          )
        })}

      </div>{/* coulmns */}
      <div className={style.rowBg} />
    </div>
  )
}


// =====================================================
