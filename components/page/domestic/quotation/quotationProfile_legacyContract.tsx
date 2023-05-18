import { useState, } from 'react'
import { format } from 'date-fns'

// components
import CustomerSelector from './modal/customerSelector'
// glogal gear
import InputSel from 'components/global/gear/inputAndSel/inputSel'
import InputSelBar_address from 'components/global/gear/inputAndSel/inputSelBar_address/inputSelBar_address'

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons'

// css
import scss from "./quotationProfile.module.scss"


// import { Class_basicInfo } from 'hooks/quotation/useQuotation'
import { Class_basicInfo, Class_legacyQuotation } from 'hooks/quotation/useLegacyContract'
import { Toption } from 'fakeDatabase/options/countryAndDistrict'
// import { Class_client } from "fakeDatabase/fakeAPI/fakeClientApi";

// type
import { TcustomerDto } from 'js/api/dtoTypes'

// config
import { customerTypesLookup } from 'config/lookupTable'

// ====================================================
const inputStyle = {
  captionWidth: "80px",
  gap: "24px",
  padding: "21px 0px 4px 0px",
  labelWidth: "80px",
}
// ====================================================
export default function QuotationProfile(
  { classLegacyContract, classBasicInfo, customerArr, disabled = false }:
    {
      classLegacyContract: Class_legacyQuotation
      classBasicInfo: Class_basicInfo
      customerArr: TcustomerDto[]
      disabled: boolean
    }) {

  // =============================================
  const { customer } = classLegacyContract

  const {
    contractNumber,
    quoteValidity,
    quoteDate,
    projectName,
    customerName,
    contactPerson,
    contactNumber,
    faxNumber,
    trackingStatus,
    projectProgress,
    projectCity,
    projectDistrict,
    projectAddress,
  } = classBasicInfo

  const customerTypes = (customer?.types?.map((type) => customerTypesLookup[type.name]))?.join("/") ?? "無類別"

  // ==============================================
  // 客戶資料
  // const theClientData = [
  //   { label: "聯絡人", placeholder: "尚未選擇", value: contactPerson },
  //   { label: "聯絡電話", placeholder: "尚未選擇", value: contactNumber },
  //   { label: "傳真號碼", placeholder: "尚未選擇", value: faxNumber },
  // ]
  const theClientData = [
    { label: "聯絡人", placeholder: "尚未選擇", value: contactPerson },
    { label: "聯絡電話", placeholder: "尚未選擇", value: contactNumber },
    { label: "傳真號碼", placeholder: "尚未選擇", value: faxNumber },
  ]

  // ==============================================
  const clearClient = () => {
    if (disabled) return
    classBasicInfo.customerName = ""
    classBasicInfo.contactPerson = ""
    classBasicInfo.contactNumber = ""
    classBasicInfo.faxNumber = ""
  }
  // ==============================================
  const styleHaveState = customerName ? scss.haveState : ""
  // ==============================================
  // 工程地點
  const selectInputList = {
    county: projectCity,
    onChangeCounty: (option: Toption | null) => {
      if (!option) return
      classBasicInfo.projectCity = option.value
      classBasicInfo.projectDistrict = ""
    },
    district: projectDistrict,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) return
      classBasicInfo.projectDistrict = option.value
    },
    address: projectAddress,
    onChangeAddress: (value: string) => classBasicInfo.projectAddress = value,
  }

  // ==============================================
  // modal
  const [showModal, setShowModal] = useState(false)
  const openModal = () => disabled ? "" : setShowModal(true)
  const onConfirmClient = (customer: TcustomerDto) => {
    classLegacyContract.customer = customer
    classBasicInfo.customerName = customer.name
    classBasicInfo.contactPerson = customer.contacts?.[0]?.name ?? ""
    classBasicInfo.contactNumber = customer.contacts?.[0]?.phone ?? ""
    classBasicInfo.faxNumber = customer.fax
  }

  // ==============================================

  return (
    <div className={scss.container}>
      <div className={scss.profile}>
        <span className={`${scss.clientState}  ${styleHaveState}`}>
          類別 : {customerTypes || "尚未選擇客戶"}
        </span>
        <InputSel
          label="工程名稱"
          disabled={disabled}
          {...{ ...inputStyle }}
          inputProps={{
            value: projectName,
            onChange: (v) => { classBasicInfo.projectName = v },
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
                  value: customerName ?? "",
                  onChange: () => { },
                }}
              />
              {!customerName && <button onClick={openModal}>請選擇客戶</button>}
              {customerName && !disabled && <IconRemove02 onClick={clearClient} />}
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
                value: trackingStatus ?? "",
                onChange: (v) => { classBasicInfo.trackingStatus = v },
              }}
            />

            <InputSel
              label="工地進度"
              captionClassName={scss.input02}
              showBaseline="auto"
              disabled={disabled}
              {...{ ...inputStyle }}
              inputProps={{
                value: projectProgress ?? "",
                onChange: (v) => { classBasicInfo.projectProgress = v },
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

      <div className={scss.time_legacy}>
        <InputSel
          label="報價編號"
          showBaseline="invisible"
          inputProps={{
            value: contractNumber,
            onChange: (v) => { classBasicInfo.contractNumber = v }
          }} />
        <InputSel
          label="報價時效"
          showBaseline="invisible"
          inputProps={{
            value: quoteValidity ?? "",
            onChange: (v) => { classBasicInfo.quoteValidity = v }
          }} />
        <InputSel
          label="報價日期"
          showBaseline="invisible"
          inputProps={{
            value: quoteDate ?? "",
            onChange: (v) => { classBasicInfo.quoteDate = v }
          }} />
      </div>


      {/* modal */}
      <CustomerSelector
        {...{ showModal, setShowModal }}
        customerArr={customerArr}
        onConfirm={onConfirmClient}
      />

    </div>
  )
}


// ===================================================














