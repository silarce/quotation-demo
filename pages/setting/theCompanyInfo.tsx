// 公司資料
// 公司資料

import {
  useState, useMemo,
  ChangeEvent,
} from "react"


// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"
import Input02 from "components/global/gear/input/input02"
import SelectInput from "components/global/gear/HOC/selectInput.tsx/selectInput"
import SelectInput_address from "components/global/gear/HOC/selectInput.tsx/selectInput_address"

// api
import { useCompanyInfo, TapiCompanyInfo } from "js/api/company-info"

// icon
import { Icondelete01 } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./theCompanyInfo.module.scss"

// fakeData type
import { Toption } from 'fakeDatabase/options/countryAndDistrict'

export default function TheCompanyInfo() {
  // ===================================================
  const [companyInfo, setCompanyInfo, updateCompanyInfo]
    = useCompanyInfo()
  // ===================================================
  const [editable, setEditable] = useState(false)
  // ===================================================
  // pageHeader
  const panalList01: TpanelList = [
    {
      type: "myButton",
      label: "編輯",
      onClick: () => { setEditable(true) }
    }
  ]
  const panalList02: TpanelList = [
    {
      type: "redButton",
      label: "上傳",
      onClick: () => { }
    },
    {
      type: "myButton",
      label: "取消",
      onClick: () => { setEditable(false) }
    },
  ]

  // ===================================================
  // 地址
  const { county, district, address } = companyInfo

  const clearDistrict = () => {
    companyInfo.district = null
    setCompanyInfo({ ...companyInfo })
  }

  const searchInputProps = {
    county,
    onChangeCountry: (option: Toption | null) => {
      if (!option) return
      if (companyInfo.county === option.value) return
      companyInfo.county = option.value
      clearDistrict()
      setCompanyInfo({ ...companyInfo })
    },
    district,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) return
      if (companyInfo.district === option.value) return
      companyInfo.district = option.value
      setCompanyInfo({ ...companyInfo })
    },
    address,
    onChangeAddress: (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      companyInfo.address = value
      setCompanyInfo({ ...companyInfo })
    },
  }


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

  // ===================================================
  return (
    <div className={style.container}>

      <PageHeader02 tag="公司資料"
        panelList={editable ? panalList02 : panalList01}
      />

      <div className={style.mainContainer}>

        <div className={style.logoBox}>
          {imgSrc
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={imgSrc} alt="logo" />
            : <span>LOGO</span>}
          {editable
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
          {dataIndex.map((key, index) => {
            const { label } = config[key]
            const stateValue = companyInfo[key] || ""
            const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
              const value = e.target.value
              companyInfo[key] = value
              setCompanyInfo({ ...companyInfo })
            }
            return (
              <Input02 key={index}
                className={style.input02}
                label={label}
                stateValue={stateValue}
                onChange={onChange}
                disabled={!editable}
              />
            )
          })}

          <SelectInput_address
            searchInputProps={searchInputProps}
            disabled={!editable}
            className={style.selectInput}
          />
        </div>
      </div>
    </div>
  )
}
// ========================================================


type TapiCompanyInfoKey = keyof TapiCompanyInfo
type TconfigKeys = Extract<TapiCompanyInfoKey,
  "name" | "phone" | "fax" | "email" | "taxId"
>

type Tconfig = {
  [key in TconfigKeys]: {
    key: string
    label: string
  }
}

const config: Tconfig = {
  "name": {
    key: "name",
    label: "公司名稱"
  },
  "phone": {
    key: "phone",
    label: "公司電話"
  },
  "fax": {
    key: "fax",
    label: "公司傳真"
  },
  "email": {
    key: "email",
    label: "公司信箱"
  },
  "taxId": {
    key: "taxId",
    label: "公司統編"
  },
}

const dataIndex: (keyof Tconfig)[] = [
  "name",
  "phone",
  "fax",
  "email",
  "taxId",
]