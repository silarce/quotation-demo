import {
  Dispatch, SetStateAction, ChangeEvent,
  useState, useMemo
} from "react"

// globale gear
import SelectInput from "components/global/gear/HOC/selectInput.tsx/selectInput"

// css
import style from "./editStaffProfile01.module.scss"

// gear
import {
  Tdata,
  Input, Select
} from "./gear"

// data type
import { Toption, optionsCreator_country, districtOptionsSelector } from 'fakeDatabase/options/countryAndDistrict'
import { TstaffInfo } from "fakeDatabase/staff/fakeStaffList";
type TsetSelStaffInfo = Dispatch<SetStateAction<TstaffInfo>>


export default function EditStaffProfile01(
  { selStaffInfo, setSelStaffInfo }:
    {
      selStaffInfo: TstaffInfo,
      setSelStaffInfo: TsetSelStaffInfo
    }
) {


  // ===========================================================
  // 戶籍地址
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
  // --------------------------------
  // 聯絡地址
  // 城市
  const contactCountryOptions = optionsCreator_country()
  const [contactCountry, setContactCountry] = useState<Toption | null>(null)

  // 地區
  const [contactDistrict, setContactDistrict] = useState<Toption | null>(null)
  const contactDistrictOptions = useMemo(() => {
    setContactDistrict(null)
    return districtOptionsSelector(contactCountry?.value || "")
  }, [contactCountry])

  // 剩餘地址
  const [contactAddress, setContactAddress] = useState("")

  const contactSelectInputList = [
    {
      stateValue: contactCountry,
      options: contactCountryOptions,
      placeholder: "選擇縣市",
      width: "90px",
      onChange: (option: Toption | null) => {
        if (!option) return
        setContactCountry(option)
      }
    },
    {
      stateValue: contactDistrict,
      options: contactDistrictOptions,
      placeholder: "選擇地區",
      width: "90px",
      onChange: (option: Toption | null) => {
        if (!option) return
        setContactDistrict(option)
      }
    },
    {
      stateValue: contactAddress,
      placeholder: "請輸入剩餘地址",
      onChange: (e: ChangeEvent<HTMLInputElement>) => setContactAddress(e.target.value)
    },
  ]


  // ===========================================================


  return (
    <div className={style.container}>
      <p>員工個人資料</p>
      <div className={style.main}>
        <div className={style.form01}>
          <div >
            {list01.map((item, index) => {
              const stateData = selStaffInfo[item.key]
              if (typeof stateData === "object" || stateData === undefined) return null

              return (
                <Input key={index} data={item}
                  {...{ stateData, setSelStaffInfo }}
                />
              )
            })}
          </div>
          {/* 垂直分隔線 */}
          <div className={style.vr} />
          <div>
            <Input data={list02.birthday}
              {...{
                stateData: selStaffInfo.birthday, setSelStaffInfo,
                width: "237px", labelWidth: "40px"
              }} />
            <Select data={list02.sex}
              {...{
                stateData: selStaffInfo.sex, setSelStaffInfo,
                width: "237px", labelWidth: "40px"
              }} />
            <Select data={list02.marital}
              {...{
                stateData: selStaffInfo.marital, setSelStaffInfo,
                width: "237px", labelWidth: "40px"
              }} />
            <Input data={list02.education}
              {...{
                stateData: selStaffInfo.education, setSelStaffInfo,
                width: "478px", labelWidth: "40px"
              }} />
            <Input data={list02.expertise}
              {...{
                stateData: selStaffInfo.expertise, setSelStaffInfo,
                width: "478px", labelWidth: "40px"
              }} />
          </div>
          {/* 地址 grid-column設為 span 3*/}
          <div >
            <SelectInput className={style.selectInput}
              label="戶籍地址" searchInputPropsList={selectInputList}
              labelWidth="110px" />
            <SelectInput className={style.selectInput}
              label="聯絡地址" searchInputPropsList={contactSelectInputList}
              labelWidth="110px" />
          </div>



        </div>
      </div>
    </div>
  )
}

// ==========================================================


const list01: Tdata[] = [
  { key: "chName", label: "中文姓名", placeholder: "請輸入中文姓名" },
  { key: "enName", label: "英文姓名", placeholder: "請輸入英文姓名" },
  { key: "idNumber", label: "身分證字號", placeholder: "請輸入身分證字號" },
  { key: "phone01", label: "連絡電話 1", placeholder: "請輸入連絡電話 1" },
  { key: "phone02", label: "連絡電話 2", placeholder: "請輸入連絡電話 2" },
]

const list03: Tdata[] = [
  { key: "residenceAddress", label: "戶籍地址", placeholder: "請輸入戶籍地址" },
  { key: "contactAddress", label: "聯絡地址", placeholder: "請輸入聯絡地址" },
]

// ----------------------------------------------


const selOptionsSex = [
  { value: "男", label: "男" },
  { value: "女", label: "女" },
]
const selOptionsMarital = [
  { value: "已婚", label: "未婚" },
  { value: "未婚", label: "已婚" },
]

const list02: { [key: string]: Tdata } = {
  birthday: { key: "birthday", label: "生日", placeholder: "例 : 1990-01-01" },
  sex: {
    key: "sex", label: "性別", placeholder: "請選擇性別",
    options: selOptionsSex
  },
  marital: {
    key: "marital", label: "婚姻", placeholder: "請選擇狀態",
    options: selOptionsMarital
  },
  education: { key: "education", label: "學歷", placeholder: "請輸入學歷" },
  expertise: { key: "expertise", label: "專長", placeholder: "請輸入專長" },
}

