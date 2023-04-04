
import { MouseEvent, } from 'react';

// component
import AutosizeInput from 'react-input-autosize';

// icon
import { IconCross01 } from 'public/image/icon/svgComponent/svgIcons';
import iconAdd from "public/image/icon/add.svg"
import { RedoOutlined } from '@ant-design/icons';

// css
import style from "./departments.module.scss"

// type
import { ClassDepartment } from 'pages/setting/departments';




// =============================================
export default function List(
  {
    editable,
    CdepartmentArr,
    removeCdepartment
  }:
    {
      editable: boolean
      CdepartmentArr: ClassDepartment[]
      removeCdepartment: (index: number) => void
    }
) {

  // 這個return裡面根據不同的情況有三種return
  return (
    <div className={style.list}>
      <div className={style.row}>
        {CdepartmentArr.map((department, dIndex) => {
          const { id, name, jobs, isFocus,
            dWillDelete, dWillPatch, dIsNew,
            dShowDeletePanel, addJob, removeJob,
          } = department

          let styleHead: string = `${style.cell} ${style.head}`

          if (dWillDelete) styleHead
            = `${styleHead} ${style.delete}`

          if (isFocus) styleHead = `${styleHead} ${style.isFocus}`

          const DeleteSwitch = dWillDelete ? RedoOutlined : IconCross01

          const onDelete = (e: MouseEvent) => {
            if (dIsNew) removeCdepartment(dIndex)
            else dShowDeletePanel(e)
          }

          return (
            <div className={`${style.columns}`} key={dIndex}>
              {/* 建立在thead裡面*/}
              <div className={styleHead}>
                <label className={style.inputBox}>
                  <AutosizeInput type="text"
                    value={name}
                    onChange={(e) => { department.name = e.target.value }}
                    disabled={!editable || dWillDelete}
                    onFocus={() => department.isFocus = true}
                    onBlur={() => department.isFocus = false}
                  />
                  {editable &&
                    <DeleteSwitch className={style.iconCross01}
                      onClick={editable ? onDelete : undefined} />
                  }

                </label>
                <label className={style.inputBox}>
                  <AutosizeInput type="text"
                    defaultValue={"A" + dIndex + 1}
                    // value={name}
                    // onChange={(e) => { department.name = e.target.value }}
                    disabled={!editable || dWillDelete}
                    onFocus={() => department.isFocus = true}
                    onBlur={() => department.isFocus = false}
                  />
                </label>
                <div className={style.focusBg} />
              </div>

              {/* ============================ */}

              {jobs.map((job, jIndex) => {

                if (job === undefined) {
                  const styleDelete = dWillDelete ? style.delete : ""
                  let className = `${style.cell} ${style.empty} ${styleDelete}`

                  return (
                    <div className={className} key={jIndex}
                      onClick={editable && !dWillDelete ? () => addJob(jIndex) : undefined}
                    >
                      {/*  eslint-disable-next-line @next/next/no-img-element */}
                      <img src={iconAdd.src} alt="" />
                    </div>
                  )
                }

                const { name, grade, isFocus,
                  jWillDelete, jWillPatch, jIsNew,
                  jShowDeletePanel,
                } = job

                const onDelete = (e: MouseEvent) => {
                  jIsNew ? removeJob(jIndex) : jShowDeletePanel(e)
                }

                let className: string = style.cell
                if (jWillDelete || dWillDelete) className = `${style.cell} ${style.delete}`
                if (isFocus) className = `${style.cell} ${style.isFocus}`
                const DeleteSwitch = jWillDelete ? RedoOutlined : IconCross01

                return (
                  <div className={className} key={jIndex}>
                    <label className={style.inputBox}>
                      <AutosizeInput type="text"
                        value={name ?? ""}
                        onChange={(e) => job.name = e.target.value}
                        disabled={!editable || jWillDelete || dWillDelete}
                        onFocus={() => { job.isFocus = true }}
                        onBlur={() => { job.isFocus = false }}
                      />
                      {editable && !dWillDelete &&
                        <DeleteSwitch className={style.iconCross01}
                          onClick={onDelete} />
                      }
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
