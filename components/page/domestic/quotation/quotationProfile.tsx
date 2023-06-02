import { useState, } from 'react'
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


import { Class_basicInfo } from 'hooks/quotation/useQuotation'
import { Toption } from 'js/utils/options/countryAndDistrict'
import { Class_client } from "fakeDatabase/fakeAPI/fakeClientApi";

// ====================================================
const inputStyle = {
  captionWidth: "80px",
  gap: "24px",
  padding: "21px 0px 4px 0px",
  labelWidth: "80px",
}
// ====================================================
export default function QuotationProfile(
  { classBasicInfo, fakeClientList, disabled = false }:
    {
      classBasicInfo: Class_basicInfo 
      fakeClientList: ReturnType<Class_client["get"]>
      disabled: boolean
    }) {

  // ==============================================

  // 報價單資料
  const { basicInfo, clientProfile } = classBasicInfo.all
  const {
    quotationId,
    tempQuotationAging,
    date,
    constructionName,
    constructionCounty,
    constructionDistrict,
    constructionAddress,
    trackingStatus,
    siteProgress,

  } = basicInfo

  const {
    name: clientName,
    fax,
    clientState,
    contact,
  } = clientProfile ?? {}

  const { setBasicInfoString } = classBasicInfo

  // ----------------------------------
  const builtDate = format(new Date(date), "yyy年MM月dd日")
  // ----------------------------------
  // ==============================================

  // ==============================================
  // 客戶資料
  const theClientData = [
    { label: "聯絡人", placeholder: "尚未選擇", value: contact?.[0].name },
    { label: "聯絡電話", placeholder: "尚未選擇", value: contact?.[0].phone },
    { label: "傳真號碼", placeholder: "尚未選擇", value: fax },
  ]

  // ==============================================
  const clearClient = () => {
    if (disabled) return
    classBasicInfo.clientProfile = undefined
  }
  // ==============================================
  const styleHaveState = clientState ? scss.haveState : ""
  // ==============================================
  // 工程地點
  const selectInputList = {
    county: constructionCounty,
    onChangeCounty: (option: Toption | null) => {
      if (!option) return
      setBasicInfoString("constructionCounty", option.value)
      setBasicInfoString("constructionDistrict", "")
    },
    district: constructionDistrict,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) return
      setBasicInfoString("constructionDistrict", option.value)
    },
    address: constructionAddress,
    onChangeAddress: (value: string) => setBasicInfoString("constructionAddress", value),
  }



  // ==============================================
  // modal
  const [showModal, setShowModal] = useState(false)
  const openModal = () => disabled ? "" : setShowModal(true)
  const onConfirmClient = (client: ReturnType<Class_client["get"]>[0]) => {
    classBasicInfo.clientProfile = client
  }

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
            value: constructionName,
            onChange: (v) => { setBasicInfoString("constructionName", v) },
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
                  value: clientName ?? "",
                  onChange: () => { },
                }}
              />
              {!clientName && <button onClick={openModal}>請選擇客戶</button>}
              {clientName && !disabled && <IconRemove02 onClick={clearClient} />}
            </div>
          </div>

          <div>
            {/* 客戶名稱，聯絡人，連絡電話，傳真號碼 */}
            {theClientData.map((item, index) => {
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
                    value: value ?? "",
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
                value: trackingStatus,
                onChange: (v) => { setBasicInfoString("trackingStatus", v) },
              }}
            />

            <InputSel
              label="工地進度"
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...{ ...inputStyle }}
              inputProps={{
                value: siteProgress,
                onChange: (v) => { setBasicInfoString("siteProgress", v) },
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
        <span>{tempQuotationAging}天內</span>
        <span>報價日期</span>
        <span>{builtDate}</span>
      </div>

      {/* modal */}
      <ClientSelector
        {...{ showModal, setShowModal }}
        fakeClientList={fakeClientList}
        onConfirm={onConfirmClient}
      />

    </div>
  )
}


// ===================================================














