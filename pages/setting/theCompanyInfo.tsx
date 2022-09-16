// 公司資料
// 公司資料

import {
  useState, useMemo,
  ChangeEvent,
} from "react"

// components
import PageHeader from "components/PageHeader/pageHeader"
// global gear
import MyButton from "components/global/gear/button/myButton"
import RedButton from "components/global/gear/button/redButton"
import SelectInput from "components/global/gear/HOC/selectInput.tsx/selectInput"


// icon
import iconDelete from "public/image/icon/delete01.svg"
import { Icondelete01 } from "public/image/icon/svgComponent/svgIcons"


// css
import style from "./theCompanyInfo.module.scss"


// fakeData type
import { Toption, optionsCreator_country, districtOptionsSelector } from 'fakeDatabase/options/countryAndDistrict'

export default function TheCompanyInfo() {
  // ===================================================
  // input list
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({})
  const [disable, setDisable] = useState(true)
  const onChange = (key: string, value: string) => {
    setInputValues(state => {
      state[key] = value
      return { ...state }
    })
  }
  // ===================================================
  // 地址
  // 城市
  const countryOptions = optionsCreator_country()
  const [country, setCountry] = useState<Toption | null>(null)

  // 地區
  const [district, setDistrict] = useState<Toption | null>(null)
  const districtOptions = useMemo(() => {
    setDistrict(null)
    return districtOptionsSelector(country?.value || "")
  }, [country])

  // 剩餘地址
  const [address, setAddress] = useState("")


  const selectInputList = [
    {
      stateValue: country,
      options: countryOptions,
      placeholder: "選擇縣市",
      width: "90px",
      onChange: (option: Toption | null) => {
        if (!option) return
        setCountry(option)
      }
    },
    {
      stateValue: district,
      options: districtOptions,
      placeholder: "選擇地區",
      width: "90px",
      onChange: (option: Toption | null) => {
        if (!option) return
        setDistrict(option)
      }
    },
    {
      stateValue: address,
      placeholder: "請輸入剩餘地址",
      onChange: (e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)
    },
  ]







  // ===================================================
  // 上傳照片
  const [upload, setUpload] = useState(false)
  const [imgSrc, setImgSrc] = useState("")

  const preloadImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target) return
      setImgSrc(e.target.result as string)
    }
  }

  return (
    // <div className="container">
    <div className={style.container}>
      <PageHeader>
        <div>
          {disable
            ? <ButtonBar01 setDisable={setDisable} />
            : <ButtonBar02 setDisable={setDisable}
              upload={upload}
              setUpload={setUpload}
            />}
        </div>
      </PageHeader>
      <div className={style.mainContainer}>
        <div className={style.logoBox}>
          {imgSrc
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={imgSrc} alt="logo" />
            : <span>LOGO</span>}
          {disable
            ? ""
            : <div className={style.loadButtonBox}>
              <label className={style.loadPhotoButton} htmlFor="uploadLogo">
                <span>上傳公司Logo</span>
                <input id="uploadLogo" type="file"
                  onChange={preloadImg}
                />
              </label>
              <span>{"(上限10MB)"}</span>
              <Icondelete01 />
            </div>
          }
        </div>

        <div className={style.formContainer}>
          {inputList.map((item, index) => {
            const { id, label } = item
            return (
              <label key={index} htmlFor={id}>
                <span>{label}</span>
                <input type="text" placeholder={`請輸入${label}`}
                  autoComplete="off"
                  id={id}
                  disabled={disable}
                  value={inputValues[id] || ""}
                  onChange={(e) => { onChange(id, e.target.value) }}
                />
                <div />
              </label>
            )
          })}

          <SelectInput className={style.selectInput}
            label="公司地址" searchInputPropsList={selectInputList}
            disabled={disable} />
        </div>
      </div>
    </div>
  )
}
// ========================================================


const ButtonBar01 = ({ setDisable }: { setDisable: (b: boolean) => void }) => {
  return (
    <MyButton label="編輯" onClick={() => setDisable(false)} />
  )
}
const ButtonBar02 = ({ setDisable, upload, setUpload }
  : {
    setDisable: (b: boolean) => void,
    upload: boolean,
    setUpload: (b: boolean) => void
  }) => {

  const cancer = () => {
    setDisable(true)
    setUpload(false)
  }

  return (
    <div className={style.headerBar}>
      <RedButton label="上傳" onClick={() => { setUpload(true) }} />
      <MyButton label="取消" onClick={cancer} />
    </div>
  )
}



// ========================================================

const inputList = [
  {
    id: "companyName",
    label: "公司名稱",
  },
  {
    id: "companyTel",
    label: "公司電話",
  },
  {
    id: "companyFax",
    label: "公司傳真",
  },
  {
    id: "companyMail",
    label: "公司信箱",
  },
  {
    id: "companyTaxId",
    label: "公司統編",
  },
  // {
  //   id: "companyAddress",
  //   label: "公司地址",
  // },
]






