// 公司資料
// 公司資料

import { useState, useEffect, Dispatch, SetStateAction } from "react"
import Image from "next/image"

import PageHeader from "components/PageTitle/pageHeader"

// css
import style from "./theCompanyInfo.module.scss"

export default function TheCompanyInfo() {

  const list = useInputList()


  return (
    <>
      <PageHeader>
        <div className={style.headerBar}>
          <button>編輯</button>
        </div>
      </PageHeader>
      <div className={style.mainContainer}>
        <div className={style.logoBox}>
          <span>LOGO</span>
        </div>


        <div className={style.formContainer}>
          {list.map((item, index) => {
            const { id, label, value, onChange } = item
            return (
              <label key={index} htmlFor={id}>
                <span>{label}</span>
                <input type="text" placeholder={`請輸入${label}`}
                  id={id}
                  value={value}
                  onChange={(e) => { onChange(e.target.value, index) }}
                />
              </label>
            )
          })}
        </div>
      </div>
    </>
  )
}
// ========================================================

interface inputClass {
  id: string
  label: string
  value: string
  onChange: (value: string, index: number) => void
}
class InputCreator {
  id
  label
  value
  onChange
  constructor(
    id: string, label: string,
    value: string,
    setState: Dispatch<SetStateAction<inputClass[]>>
  ) {
    this.id = id
    this.label = label
    this.value = value
    this.onChange = (newValue: string, index: number) => {
      setState((state) => {
        state[index].value = newValue
        return [...state]
      })
    }
  }
}




const useInputList = () => {
  const [list, setList] = useState<inputClass[]>([])

  useEffect(() => {
    const listInit = [
      new InputCreator(
        "companyName", "公司名稱", "", setList
      ),
      new InputCreator(
        "companyTel", "公司電話", "", setList
      ),
      new InputCreator(
        "companyMail", "公司信箱", "", setList
      ),
    ]
    setList(listInit)
  }, [])
  return list
}

