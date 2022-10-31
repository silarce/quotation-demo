
import {
  Dispatch, SetStateAction,
  useState, useRef, Fragment
} from 'react';



// component
import AutosizeInput from 'react-input-autosize';

// icon
import { IconCross01 } from 'public/image/icon/svgComponent/svgIcons';
import iconAdd from "public/image/icon/add.svg"

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


  return (
    <div className={style.list}>


      <div className={style.row}>
        {myDepartment.map((dItem, dIndex) => {
          const { name, jobs, dMethod,
            dOnChange, dMarkDel } = dItem

          let styleHead: string = `${style.cell} ${style.head}`
          if (dMethod === "delete") styleHead
            = `${styleHead} ${style.delete}`

          return (
            <div className={`${style.columns}`} key={dIndex}>
              {/* 建立在thead裡面*/}
              <div className={styleHead}>
                <label className={style.inputBox}>
                  <AutosizeInput type="text"
                    value={name}
                    onChange={dOnChange}
                  />
                  <IconCross01 onClick={dMarkDel} />
                </label>
                <p>A</p>
              </div>

              {/* ============================ */}

              {jobs?.reverse().map((item, index) => {
                const { grade, id, name, jMethod,
                  jOnChange, addJobs, jMarkDel,
                } = item

                if (jMethod === "empty") return (
                  <div className={`${style.cell} ${style.empty}`} key={index}
                    onClick={addJobs}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={iconAdd.src} alt=""
                    />
                  </div>
                )

                let className: string = style.cell
                if (jMethod === "delete") className = `${style.cell} ${style.delete}`

                return (
                  <div className={className} key={index}>
                    <label className={style.inputBox}>
                      <AutosizeInput type="text"
                        value={name ?? ""}
                        onChange={jOnChange}
                      />
                      <IconCross01 onClick={jMarkDel} />
                    </label>
                  </div>
                )
              })}
            </div> // thead
          )
        })}
      </div>{/* coulmns */}
    </div>
  )
}


// =====================================================



