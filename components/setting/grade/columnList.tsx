
import {
  useState, useRef
  , ChangeEvent, Dispatch, SetStateAction,
  RefObject
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
        <input type="text" value={label || ""}
            autoComplete="off"
            disabled={!editable}
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
              <EditLable
                label={label}
                disabled={!editable}
                editLabel={editLabel as () => void}
                setFocusCell={setFocusCell as () => void}
                editable={editable}
                showDepartmentModal={showDepartmentModal}
                index={index}
              />
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
  { label, disabled,
    editLabel, setFocusCell,
    editable, showDepartmentModal,
    index
  }:
    {
      label: string, disabled: boolean,
      editLabel: () => void, setFocusCell: (p: number) => void,
      editable: boolean,
      showDepartmentModal: (label: string) => void,
      index: number
    }
) => {
  // ======================================
  const [addingLabel, setAddingLable] = useState(false)

  const inpuRef = useRef<HTMLInputElement | null>(null)

  // 卸載加號按鈕並focus底下的input
  const toAddLabel = () => {
    if (inpuRef?.current) {
      inpuRef.current.focus()
    }
    setAddingLable(true)
  }
  // input blur時的處置
  const onBlur = () => {
    setFocusCell(NaN)
    setAddingLable(false)
  }

  return (
    <>
      <div className={style.editLable}>
        <input type="text" value={label || ""}
          ref={inpuRef}
          disabled={disabled}
          onChange={editLabel}
          onFocus={() => setFocusCell(index)}
          onBlur={onBlur}
        />
      </div>
      {editable &&
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={style.deleteIcon}
            src={iconCross.src} alt="delete"
            onClick={() => { showDepartmentModal(label) }}
          />
          {/*  */}
          {!label && !addingLabel &&
            <div className={style.addLabel}
              onClick={toAddLabel}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={style.addIcon} src={iconAdd.src} alt="" />
            </div>}
        </>}
    </>
  )
}
