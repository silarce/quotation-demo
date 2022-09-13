import {
  ChangeEvent,
  useState, useMemo
} from 'react'
import { format } from 'date-fns'

// components
import ClientSelector from './modal/clientSelector'
// glogal gear
import Input02 from "components/global/gear/input/input02"
import SearchInput from 'components/global/gear/HOC/selectInput.tsx/searchInput'

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons'

// css
import style from "./quotationProfile.module.scss"

// fakeData/type
import type { TuseProfile } from "./hook/useProfile"
import { Toption, optionsCreator_country, districtOptionsSelector } from 'fakeDatabase/options/countryAndDistrict'



// ====================================================
const inputStyle = {
  labelWidth: "80px",
  gap: "24px"
}

// ====================================================
export default function QuotationProfile(
  { profileState, disabled = false }:
    {
      profileState: TuseProfile
      disabled: boolean
    }) {

  // ==============================================
  // 報價單資料
  const { profile } = profileState

  const {
    quotationId, ageing, projectName,
    trackState, schedule, projectAddress,
    clientName, contactPerson, contactPhone, fax,
    clientState
  } = profile

  const {
    onChangeProjectName, onChangeTrackState,
    onChangeSchedule, onChangeProjectAddress,
    setClientName, setContactPerson,
    setContactPhone, setFax,
    setClientId, setClientState
  } = profileState

  // ----------------------------------
  const builtDate = format(new Date(profile.builtDate), "yyy年MM月dd日")
  // ----------------------------------
  // ==============================================

  // ==============================================
  // 客戶資料
  const clientData = [
    { label: "聯絡人", placeholder: "尚未選擇", value: contactPerson },
    { label: "聯絡電話", placeholder: "尚未選擇", value: contactPhone },
    { label: "傳真號碼", placeholder: "尚未選擇", value: fax },
  ]

  // ==============================================
  const clearClient = () => {
    if (disabled) return
    setClientId("")
    setClientName("")
    setContactPerson("")
    setContactPhone("")
    setFax("")
    setClientState("")
  }
  // ==============================================
  const styleHaveState = clientState ? style.haveState : ""
  // ==============================================
  // 工程地點

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

  // ==============================================
  // modal
  const [showModal, setShowModal] = useState(false)
  const openModal = () => disabled ? "" : setShowModal(true)
  // ==============================================


  return (
    <div className={style.container}>
      <div className={style.profile}>
        <span className={`${style.clientState}  ${styleHaveState}`}>狀態 : {clientState || "尚未選擇客戶"}</span>
        <Input02
          {...{
            className: style.input02,
            label: "工程名稱", stateValue: projectName,
            onChange: onChangeProjectName,
            disabled, ...inputStyle
          }} />
        {/*  */}
        <div className={style.form02}>
          <div className={`${style.clientName} ${disabled ? style.disabled : ""}`}>
            <div>
              <Input02
                {...{
                  className: `${style.clientName} ${style.input02}`,
                  label: "客戶名稱", stateValue: clientName,
                  onChange: (e) => {/**/ }, placeholder: "",
                  disabled: true, ...inputStyle,
                }} />
              {!clientName && <button onClick={openModal}>請選擇客戶</button>}
              {clientName && !disabled && <IconRemove02 onClick={clearClient} />}
            </div>
          </div>

          <div>
            {/* 客戶名稱，聯絡人，連絡電話，傳真號碼 */}
            {clientData.map((item, index) => {
              const { label, value, placeholder } = item
              return (
                <Input02 key={index}
                  {...{
                    className: style.input02,
                    label, stateValue: value, placeholder,
                    onChange: (e) => { },
                    disabled: true, ...inputStyle
                  }} />
              )
            })}
          </div>
          <div>
            <Input02
              {...{
                className: style.input02,
                label: "追蹤狀態", stateValue: trackState,
                onChange: onChangeTrackState,
                disabled, ...inputStyle
              }} />
            <Input02
              {...{
                className: style.input02,
                label: "工地進度", stateValue: schedule,
                onChange: onChangeSchedule,
                disabled, ...inputStyle
              }} />
          </div>
        </div> {/* form02 */}

        <SearchInput label="工程地點" searchInputPropsList={selectInputList} />

      </div>

      <div className={style.time}>
        <span>報價編號</span>
        <span>{quotationId}</span>
        <span>報價時效</span>
        <span>{ageing}天內</span>
        <span>報價日期</span>
        <span>{builtDate}</span>
      </div>

      {/* modal */}
      <ClientSelector {...{ showModal, setShowModal, profileState }} />

    </div>
  )
}


// ===================================================





















