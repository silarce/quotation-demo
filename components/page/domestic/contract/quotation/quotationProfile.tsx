import { useState, useMemo } from 'react'
import { format } from 'date-fns'

// components
import ClientSelector from './modal/clientSelector'
// glogal gear
import Input02 from "components/global/gear/input/input02"

// icon
import { IconRemove02 } from 'public/image/icon/svgComponent/svgIcons'

// css
import style from "./quotationProfile.module.scss"

// fakeData/type
import { TuseQuotation, Tquotataion } from "./hook/useProfile"




// ====================================================
const inputStyle = {
  labelWidth: "80px",
  gap: "24px"
}

// ====================================================
export default function QuotationProfile(
  { stateQuotation, disabled }:
    {
      stateQuotation: TuseQuotation
      disabled?: boolean
    }) {

  // ==============================================
  // 報價單資料
  const { quotation, setQuotation } = stateQuotation

  const {
    quotationId, ageing, projectName,
    trackState, schedule, projectAddress,
    clientName, contactPerson, contactPhone, fax,
    clientState

  } = quotation
  const {
    setProjectName, setTrackState, setSchedule,
    setProjectAddress, setClientName, setContactPerson,
    setContactPhone, setFax,
  } = setQuotation

  // ----------------------------------
  const builtDate = format(new Date(quotation.builtDate), "yyyy年MM月dd日")
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
    setClientName("")
    setContactPerson("")
    setContactPhone("")
    setFax("")
  }
  // ==============================================
  // modal
  const [showModal, setShowModal] = useState(false)
  const openModal = () => setShowModal(true)
  // ==============================================

  // console.log(quotationId)



  return (
    <div className={style.container}>
      <div className={style.profile}>
        <span className={style.clientState}>狀態 : {clientState || "尚未選擇客戶"}</span>
        {/* <span className={style.clientState}>狀態 : {"尚未選擇客戶"}</span> */}
        <Input02
          {...{
            label: "工程名稱", stateValue: projectName,
            onChange: (e) => { setProjectName(e.target.value) },
            disabled, ...inputStyle
          }} />
        {/*  */}
        <div className={style.form02}>
          <div className={style.clientName}>
            <Input02
              {...{
                label: "客戶名稱", stateValue: clientName,
                onChange: (e) => {/**/ }, placeholder: "",
                disabled: true, ...inputStyle,
                className: style.clientName
              }} />
            {!clientName && <button onClick={openModal}>請選擇客戶</button>}
            {clientName && <IconRemove02 onClick={clearClient} />}
          </div>
          <div>

            {clientData.map((item, index) => {
              const { label, value, placeholder } = item
              return (
                <Input02 key={index}
                  {...{
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
                label: "追蹤狀態", stateValue: trackState,
                onChange: (e) => { setTrackState(e.target.value) },
                disabled, ...inputStyle
              }} />
            <Input02
              {...{
                label: "工地進度", stateValue: schedule,
                onChange: (e) => { setSchedule(e.target.value) },
                disabled, ...inputStyle
              }} />
          </div>
        </div> {/* form02 */}
        <Input02
          {...{
            label: "工地地點", stateValue: projectAddress,
            onChange: (e) => { setProjectAddress(e.target.value) },
            disabled, ...inputStyle
          }} />
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
      <ClientSelector {...{ showModal, setShowModal, setQuotation }} />

    </div>
  )
}