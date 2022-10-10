// 公司資料
// 公司資料

import {
  ChangeEvent,
  useState, useEffect,
} from "react"

const _ = require("lodash")

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"
import Input02 from "components/global/gear/input/input02"
import SelectInput_address from "components/global/gear/HOC/selectInput.tsx/selectInput_address"
import LoadingCover from "components/global/gear/loadingCover"

// api
import {
  useCompanyInfo, TapiCompanyInfo,
  apiPatchCompanyInfo,
  apiUploadCompanyLogo
} from "js/api/api_company-info"

// icon
import { Icondelete01 } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./theCompanyInfo.module.scss"

// fakeData type
import { Toption } from 'fakeDatabase/options/countryAndDistrict'


export default function TheCompanyInfo() {
  // ===================================================
  // 公司資料
  const [companyInfo, setCompanyInfo, updateCompanyInfo]
    = useCompanyInfo()
  const [infoBackup, setInfoBackup] = useState<TapiCompanyInfo>()
  // 更新資料
  const update = async () => {
    const res = await updateCompanyInfo() as TapiCompanyInfo
    if (res) setInfoBackup(_.cloneDeep(res))
  }

  useEffect(() => {
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ===================================================
  // 圖片檔案
  const [imageFile, setImageFile] = useState<File>()
  // 預覽圖片
  const [imgSrc, setImgSrc] = useState<string | null | undefined>("")

  useEffect(() => {
    setImgSrc(companyInfo.logoLink)
  }, [companyInfo.logoLink])
  // ===================================================
  const [editable, setEditable] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // ===================================================
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
      onClick: async () => {
        setIsLoading(true)
        const body = {
          name: companyInfo.name || "",
          phone: companyInfo.phone || "",
          email: companyInfo.email || "",
          county: companyInfo.county || "",
          district: companyInfo.district || "",
          address: companyInfo.address || "",
          fax: companyInfo.fax || "",
          taxId: companyInfo.taxId || "",
        }
        await apiPatchCompanyInfo(body)
        if (imageFile) {
          const formData = new FormData
          formData.append("image", imageFile)
          await apiUploadCompanyLogo(formData)
        }
        await update()
        setIsLoading(false)
        setEditable(false)
      }
    },
    {
      type: "myButton",
      label: "取消",
      onClick: () => {
        setEditable(false)
        setCompanyInfo(_.cloneDeep(infoBackup))
        clearLogo()
      }
    },
  ]
  // ===================================================
  // 地址
  const { county, district, address, logoLink } = companyInfo

  // 選擇城市後清除地區
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

  // 選擇圖片
  const selectImg = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    setImageFile(file)
    // 預覽圖片
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target) return
      setImgSrc(e.target.result as string)
    }
  }
  // 清除
  const clearLogo = () => {
    setImgSrc(companyInfo.logoLink)
    setImageFile(undefined)
  }

  // ===================================================
  return (
    <div className={style.container}>
      <PageHeader02 tag="公司資料"
        panelList={editable ? panalList02 : panalList01}
      />
      <div className={style.mainContainer}>

        {/* 左邊的圖片 */}
        <div className={style.logoBox}>
          {logoLink
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={imgSrc || ""} alt="logo" />
            : <span>LOGO</span>}
          {!editable
            ? ""
            : <div className={style.loadButtonBox}>
              <label className={style.loadPhotoButton}
                htmlFor="uploadLogo">
                <span>上傳公司Logo</span>
                <input id="uploadLogo" type="file"
                  onChange={selectImg}
                />
              </label>
              <span>{"(上限10MB)"}</span>
              <Icondelete01 onClick={clearLogo} />
            </div>
          }
        </div>

        {/* 右邊的表單 */}
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
      <LoadingCover open={isLoading} />
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