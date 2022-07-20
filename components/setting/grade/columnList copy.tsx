
import {
  useState
  , ChangeEvent, Dispatch, SetStateAction
} from "react"



// icon
import iconCross from "public/image/icon/cross_normal.svg"
import iconAdd from "public/image/icon/add.svg"

// css
import style from "./columnList.module.scss"




interface Tdata {
  label: string
  id?: string | number
  editLabel?: (e: ChangeEvent<HTMLInputElement>) => void
  list: { label: string, editLabel?: (e: ChangeEvent<HTMLInputElement>) => void }[]
}


export default function ColumnList({ data, editable, showDepartmentModal }:
  {
    data: Tdata, editable: boolean,
    showDepartmentModal: (label: string) => void
  }) {
  // ==================================================
  // 資料
  const { label, id, list, editLabel } = data

  // ==================================================
  // 編輯中反白
  const [focusCell, setFocusCell] = useState<number>(NaN)
  // ==================================================



  // ==================================================

  return (
    <div className={style.container}>
      {/*  */}
      <div className={style.title}>
        <div className={focusCell === -1 ? style.active : ""}>
          <input type="text" value={label}
            autoComplete="off"
            readOnly={!editable}
            onChange={editLabel}
            onFocus={() => setFocusCell(-1)}
            onBlur={() => setFocusCell(NaN)}
          />
          {editable &&
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              < img className={style.deleteIcon}
                src={iconCross.src} alt="delete"
                onClick={() => { showDepartmentModal(label) }}
              />
            </>
          }
        </div>
        {id && <p>{id}</p>}
      </div>
      {/*  */}
      <ul className={style.list}>
        {list.map((item, index) => {
          const { label, editLabel } = item
          const active = focusCell === index ? style.active : ""

          return (
            <li key={index} className={active}>
              {label === null
                ? <AddLable editable={editable} />
                : <EditLable
                  label={label}
                  readOnly={!editable}
                  editLabel={editLabel as () => void}
                  setFocusCell={setFocusCell as () => void}
                  editable={editable}
                  showDepartmentModal={showDepartmentModal}
                />}
            </li>
          )
        })}
      </ul>
      {/*  */}
    </div>
  )
}

// ==================================================
// lable有值時使用
const EditLable = (
  { label, readOnly, editLabel, setFocusCell, editable, showDepartmentModal }:
    {
      label: string, readOnly: boolean,
      editLabel: () => void, setFocusCell: (p: string | null) => void,
      editable: boolean,
      showDepartmentModal: (label: string) => void
    }
) => {
  return (
    <>
      <div>
        <input type="text" value={label}
          readOnly={readOnly}
          onChange={editLabel}
          onFocus={() => setFocusCell(label)}
          onBlur={() => setFocusCell(null)}
        />
      </div>
      {editable &&
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={style.deleteIcon}
            src={iconCross.src} alt="delete"
            onClick={() => { showDepartmentModal(label) }}
          />
        </>}
    </>
  )
}
// label沒有值時使用
const AddLable = ({ editable }: { editable: boolean }) => {
  return (
    <>
      {editable &&
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={style.addIcon} src={iconAdd.src} alt="" />
        </>
      }
    </>
  )
}
