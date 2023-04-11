
import { MouseEvent, } from 'react';
import classNames from 'classnames';

// component
import AutosizeInput from 'react-input-autosize';

// icon
import { IconCross01 } from 'public/image/icon/svgComponent/svgIcons';
import iconAdd from "public/image/icon/add.svg"
import { RedoOutlined } from '@ant-design/icons';

// css
import scss from "./departments.module.scss"

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
    <div className={scss.list}>
      <div className={scss.row}>
        {CdepartmentArr.map((department, dIndex) => {
          const { id, name, jobs, isFocus, code,
            dWillDelete, dWillPatch, dIsNew,
            dShowDeletePanel, addJob, removeJob,
          } = department

          let styleHead: string = `${scss.cell} ${scss.head}`

          if (dWillDelete) styleHead
            = `${styleHead} ${scss.delete}`

          if (isFocus) styleHead = `${styleHead} ${scss.isFocus}`

          const DeleteSwitch = dWillDelete ? RedoOutlined : IconCross01

          const onDelete = (e: MouseEvent) => {
            if (dIsNew) removeCdepartment(dIndex)
            else dShowDeletePanel(e)
          }

          return (
            <div className={`${scss.columns}`} key={dIndex}>
              {/* 建立在thead裡面*/}
              <div className={styleHead}>
                <label className={scss.inputBox}>
                  <AutosizeInput type="text"
                    value={name}
                    onChange={(e) => { department.name = e.target.value }}
                    disabled={!editable || dWillDelete}
                    onFocus={() => department.isFocus = true}
                    onBlur={() => department.isFocus = false}
                  />
                  {editable &&
                    <DeleteSwitch className={scss.iconCross01}
                      onClick={editable ? onDelete : undefined} />
                  }

                </label>

                <label className={classNames(
                  scss.inputBox,
                  { [scss.notEditable]: !editable || dWillDelete })}>
                  <AutosizeInput type="text"
                    // defaultValue={"A" + dIndex + 1}
                    value={code}
                    onChange={(e) => { department.code = e.target.value }}
                    disabled={!editable || dWillDelete}
                    onFocus={() => department.isFocus = true}
                    onBlur={() => department.isFocus = false}
                  />
                </label>
                <div className={scss.focusBg} />
              </div>

              {/* ============================ */}

              {jobs.map((job, jIndex) => {

                if (job === undefined) {
                  const styleDelete = dWillDelete ? scss.delete : ""
                  let className = `${scss.cell} ${scss.empty} ${styleDelete}`

                  return (
                    <div className={className} key={jIndex}
                      onClick={editable && !dWillDelete ? () => addJob(jIndex) : undefined}
                    >
                      {/*  eslint-disable-next-line @next/next/no-img-element */}
                      {editable && <img src={iconAdd.src} alt="" />}
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

                let className: string = scss.cell
                if (jWillDelete || dWillDelete) className = `${scss.cell} ${scss.delete}`
                if (isFocus) className = `${scss.cell} ${scss.isFocus}`
                const DeleteSwitch = jWillDelete ? RedoOutlined : IconCross01

                return (
                  <div className={className} key={jIndex}>
                    <label className={scss.inputBox}>
                      <AutosizeInput type="text"
                        value={name ?? ""}
                        onChange={(e) => job.name = e.target.value}
                        disabled={!editable || jWillDelete || dWillDelete}
                        onFocus={() => { job.isFocus = true }}
                        onBlur={() => { job.isFocus = false }}
                      />
                      {editable && !dWillDelete &&
                        <DeleteSwitch className={scss.iconCross01}
                          onClick={onDelete} />
                      }
                    </label>
                    <div className={scss.focusBg} />
                  </div>
                )
              })}
            </div> // thead
          )
        })}

      </div>{/* coulmns */}
      <div className={scss.rowBg} />

    </div>
  )
}


// =====================================================
