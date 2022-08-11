import { useState, Fragment } from "react"

// components
import MyButton from "components/global/gear/button/myButton"
import RedButton from "components/global/gear/button/redButton"
import AddButton from "components/global/gear/button/addButton"
import InputSearch from "components/global/gear/input/inputSearch"

// css
import style from "./pageHeader02.module.scss"




// type
interface Ttag {
  label: string
  onClick: () => void
}

const fakeTag: Ttag[] = [
  { label: "花哈哈", onClick: () => alert("花哈哈") },
  { label: "喵喵喵", onClick: () => alert("喵喵喵") }
]


interface Tpanel01 {
  type: "myButton" | "redButton" | "addButton"
  label: string
  placeholder?: string
  onClick: () => void
}
interface Tpanel02 {
  type: "inputSearch"
  label?: string
  placeholder: string
  onClick: (value: string | number) => void
}

type Tpanel = Tpanel01 | Tpanel02


const fakeButton: Tpanel[] = [
  {
    label: "按鈕一",
    type: "myButton",
    onClick: () => alert("按鈕一")
  },
  {
    label: "按鈕二",
    type: "addButton",
    onClick: () => alert("按鈕二")
  },
  {
    placeholder: "搜尋",
    type: "inputSearch",
    onClick: (value) => alert(value)
  },
]


export default function PageHeader02({ tagList=[], panelList=[] }:
  {
    tagList: Ttag[]
    panelList: Tpanel[]
  }) {

  const [active, setActive] = useState(0)
  


  return (
    <div className={style.container}>
      {/* tagBox */}
      <div className={style.tagBox}>
        {tagList.map((item, index) => {
          const { label, onClick } = item
          const theOnClick = () => {
            onClick();
            setActive(index)
          }
          const isActive = active === index ? style.active : ""
          return (
            <button key={index} className={isActive}
              onClick={theOnClick}
            >{label}
            </button>
          )
        })}
      </div>
      {/* buttonBox */}
      <div className={style.buttonBox}>
        {panelList.map((item, index) => {
          const { label, type, onClick, placeholder } = item

          return (
            <Fragment key={index}>
              {
                type === "myButton" ? <MyButton {...{ label, onClick }} />
                  : type === "redButton" ? <RedButton {...{ label, onClick }} />
                    : type === "addButton" ? <AddButton {...{ label, onClick }} />
                      : type === "inputSearch" ? <InputSearch {...{ placeholder, onClick }} />
                        : <></>
              }
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}


{/* <div className={style.container}>

<div className={style.tagBox}>
  {fakeTag.map((item, index) => {
    const { label, onClick } = item
    const theOnClick = () => {
      onClick();
      setActive(index)
    }
    const isActive = active === index ? style.active : ""
    return (
      <button key={index} className={isActive}
        onClick={theOnClick}
      >{label}
      </button>
    )
  })}
</div>
<div className={style.buttonBox}>
  {fakeButton.map((item, index) => {
    const { label, type, onClick, placeholder } = item

    return (
      <Fragment key={index}>
        {
          type === "myButton" ? <MyButton {...{ label, onClick }} />
            : type === "redButton" ? <RedButton {...{ label, onClick }} />
              : type === "addButton" ? <AddButton {...{ label, onClick }} />
                : type === "inputSearch" ? <InputSearch {...{ placeholder, onClick }} />
                  : <></>
        }
      </Fragment>
    )
  })}
</div>
</div> */}