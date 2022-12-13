import {
  ChangeEvent,
  useState, useMemo
} from 'react'
import { format } from 'date-fns'

// components
import ClientSelector from './modal/clientSelector'
// glogal gear
import InputSel from 'components/global/gear/inputAndSel/inputSel'
import InputSelBar_address from 'components/global/gear/inputAndSel/inputSelBar_address/inputSelBar_address'

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons'

// css
import scss from "./quotationProfile.module.scss"

// fakeData/type
import type { TuseProfile } from "./hook/useProfile"
import { Toption, optionsCreator_county, districtOptionsSelector } from 'fakeDatabase/options/countryAndDistrict'



// ====================================================
const inputStyle = {
  captionWidth: "80px",
  gap: "24px",
  padding: "21px 0px 4px 0px",
  labelWidth: "80px",
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
  const styleHaveState = clientState ? scss.haveState : ""
  // ==============================================
  // 工程地點

  // 城市
  const countryOptions = optionsCreator_county()
  const [country, setCountry] = useState<Toption | null>(null)

  // 地區
  const [district, setDistrict] = useState<Toption | null>(null)
  const districtOptions = useMemo(() => {
    setDistrict(null)
    return districtOptionsSelector(country?.value || "")
  }, [country])

  // 剩餘地址
  const [address, setAddress] = useState("")


  const selectInputList = {
    county: country?.value,
    onChangeCounty: (option: Toption | null) => {
      if (!option) return
      setCountry(option)
    },
    district: district?.value,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) return
      setDistrict(option)
    },
    address: address,
    onChangeAddress: (value: string) => setAddress(value),
  }
  // ==============================================
  // modal
  const [showModal, setShowModal] = useState(false)
  const openModal = () => disabled ? "" : setShowModal(true)
  // ==============================================


  return (
    <div className={scss.container}>
      <div className={scss.profile}>
        <span className={`${scss.clientState}  ${styleHaveState}`}>狀態 : {clientState || "尚未選擇客戶"}</span>
        <InputSel
          label="工程名稱"
          disabled={disabled}
          {...{ ...inputStyle }}
          inputProps={{
            value: projectName,
            onChange: onChangeProjectName,
          }}
        />
        {/*  */}
        <div className={scss.form02}>
          <div className={`${scss.clientName} ${disabled ? scss.disabled : ""}`}>
            <div>
              <InputSel
                label={"客戶名稱"}
                placeholder={""}
                disabled={true}
                showBaseline="invisible"
                captionClassName={scss.input02}
                captionWidth={inputStyle.captionWidth}
                gap={inputStyle.gap}
                textareaProps={{
                  value: clientName,
                  onChange: () => { },
                }}
              />
              {!clientName && <button onClick={openModal}>請選擇客戶</button>}
              {clientName && !disabled && <IconRemove02 onClick={clearClient} />}
            </div>
          </div>

          <div>
            {/* 客戶名稱，聯絡人，連絡電話，傳真號碼 */}
            {clientData.map((item, index) => {
              const { label, value, placeholder } = item
              return (
                <InputSel key={index}
                  label={label}
                  placeholder={placeholder}
                  captionClassName={scss.input02}
                  disabled={true}
                  showBaseline="invisible"
                  {...{ ...inputStyle }}
                  inputProps={{
                    value: value,
                    onChange: () => { },
                  }}
                />
              )
            })}
          </div>
          <div>

            <InputSel
              label="追蹤狀態"
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...{ ...inputStyle }}
              inputProps={{
                value: trackState,
                onChange: onChangeTrackState,
              }}
            />

            <InputSel
              label="工地進度"
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...{ ...inputStyle }}
              inputProps={{
                value: schedule,
                onChange: onChangeSchedule,
              }}
            />
          </div>
        </div> {/* form02 */}

        <InputSelBar_address
          label="工程地點"
          captionClassName={scss.input02}
          showBaseline="auto"
          {...{ ...inputStyle }}
          addressProps={selectInputList}
          disabled={disabled}
        />
      </div>

      <div className={scss.time}>
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





















