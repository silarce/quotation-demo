// 公司資料
// 公司資料

import {
  ChangeEvent,
  useState, useEffect,
} from "react"

const _ = require("lodash")

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02"
import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover"
import myAlert from "components/global/gear/modal/simpleModal/alertModals"
import InputSel from "components/global/gear/inputAndSel/inputSel"
import InputSelBar_address from "components/global/gear/inputAndSel/inputSelBar_address/inputSelBar_address"


// api
import {
  useCompanyInfo, TcompanyInfoDto,
  apiPatchCompanyInfo,
  apiUploadCompanyLogo
} from "js/api/api_company-info"

// icon
import { IconDelete01 } from "public/image/icon/svgComponent/svgIcons"

// css
import scss from "./company-info.module.scss"

// fakeData type
import { Toption } from 'fakeDatabase/options/countryAndDistrict'


export default function CompanyInfo() {
  // ===================================================
  // 公司資料
  const {
    data: companyInfo,
    setData: setCompanyInfo,
    update: updateCompanyInfo,
  } = useCompanyInfo()
  const [infoBackup, setInfoBackup] = useState<TcompanyInfoDto>()
  // 更新資料
  const update = async () => {
    const res = await updateCompanyInfo()
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
    setImgSrc(companyInfo?.logoLink)
  }, [companyInfo?.logoLink])
  // ===================================================
  const [editable, setEditable] = useState(false)

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
        const body = {
          name: companyInfo?.name || "",
          phone: companyInfo?.phone || "",
          email: companyInfo?.email || "",
          county: companyInfo?.county || "",
          district: companyInfo?.district || "",
          address: companyInfo?.address || "",
          fax: companyInfo?.fax || "",
          taxId: companyInfo?.taxId || "",
        }
        setRootLoading(true)
        try {
          await apiPatchCompanyInfo(body)
          if (imageFile) {
            const formData = new FormData
            formData.append("image", imageFile)
            await apiUploadCompanyLogo(formData)
          }
          await update()
          myAlert.success({ title: "上傳成功" })
        }
        catch (err) {
          await update()
          myAlert.err({ title: err as string })
        }
        finally {
          setRootLoading(false)
          setEditable(false)
        }
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
  const { county, district, address, logoLink } = companyInfo ?? {}

  // 選擇城市後清除地區
  const clearDistrict = () => {
    companyInfo!.district = ""
    setCompanyInfo({ ...companyInfo! })
  }

  const searchInputProps = {
    county,
    onChangeCounty: (option: Toption | null) => {
      if (!option) return
      if (companyInfo?.county === option.value) return
      companyInfo!.county = option.value
      clearDistrict()
      setCompanyInfo({ ...companyInfo! })
    },
    district,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) return
      if (companyInfo?.district === option.value) return
      companyInfo!.district = option.value
      setCompanyInfo({ ...companyInfo! })
    },
    address,
    onChangeAddress: (value: string) => {
      companyInfo!.address = value
      setCompanyInfo({ ...companyInfo! })
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
    setImgSrc(companyInfo?.logoLink)
    setImageFile(undefined)
  }
  // ===================================================
  return (
    <div className={scss.container}>
      <PageHeader02 tag="公司資料"
        panelList={editable ? panalList02 : panalList01}
      />
      <div className={scss.mainContainer}>

        {/* 左邊的圖片 */}
        <div className={scss.logoBox}>
          {logoLink
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={imgSrc || ""} alt="logo" />
            : <span>LOGO</span>}
          {!editable
            ? ""
            : <div className={scss.loadButtonBox}>
              <label className={scss.loadPhotoButton}
                htmlFor="uploadLogo">
                <span>上傳公司Logo</span>
                <input id="uploadLogo" type="file"
                  onChange={selectImg}
                />
              </label>
              <span>{"(上限10MB)"}</span>
              <IconDelete01 onClick={clearLogo} />
            </div>
          }
        </div>

        {/* 右邊的表單 */}
        <div className={scss.formContainer}>
          {dataIndex.map((key, index) => {
            const { label } = config[key]
            const stateValue = companyInfo?.[key] || ""
            const onChange = (value: string) => {
              companyInfo![key] = value
              setCompanyInfo({ ...companyInfo! })
            }
            // editable
            let styleInput02 = `${scss.input02}`
            if (editable) styleInput02 = `${styleInput02} ${scss.editable}`
            return (
              <InputSel key={index}
                label={label}
                captionWidth="80px"
                gap="50px"
                padding="20px 0 14px 0"
                hrColor={(!editable && scss.colorBorder01) || undefined}
                disabled={!editable}
                inputProps={{
                  value: stateValue,
                  onChange: onChange
                }}
              />
            )
          })}

          <InputSelBar_address
            className={`${scss.selectInput} ${(editable && scss.editable) ?? undefined}`}
            addressProps={searchInputProps}
            label="公司地址"
            captionWidth="80px"
            gap="50px"
            padding="20px 0 14px 0"
            disabled={!editable}
            hrColor={(!editable && scss.colorBorder01) || undefined}
          />
        </div>
      </div>
    </div>
  )
}
// ========================================================


type TapiCompanyInfoKey = keyof TcompanyInfoDto
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