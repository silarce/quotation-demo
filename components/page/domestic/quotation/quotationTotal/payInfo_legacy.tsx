import { useState } from "react"
import classNames from "classnames"

// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel"
import InputModal from "components/global/gear/modal/simpleModal/inputModal"
// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"

// css
import style from "./payInfo.module.scss"

// type
import { Class_legacyQuotation } from "hooks/quotation/useLegacyContract"


export default function PayInfo_legacy(
  { classQuotation, disabled }:
    {
      classQuotation: Class_legacyQuotation
      disabled: boolean
    }) {
  // -----------------------------------------------------------------------
  const [modalIsShow, setModalIsShow] = useState(false)
  // -----------------------------------------------------------------------
  const { classPayInfo } = classQuotation



  const {
    totalDiscount,
    subTotal,
    tax,
    total,
    tradingLocation,
    tradingDate,
    paymentMethods: payWay,

    editPayWay,
    addPayWay,
    removePayWay,


  } = classPayInfo

  // -----------------------------------------------------------------------
  const countList = [
    { label: "小計", key: "subTotal" },
    { label: "營業稅(5%)", key: "tax" },
    { label: "總計", key: "total" },
  ] as const
  // -----------------------------------------------------------------------
  return (

    <div className={classNames(style.container, style.legacy)}>

      <div className={style.payBox}>
        <div className={style.avgDiscount}>
          <span>{"總折數"}</span>
          <div>
            <input type="text" className="bg-transparent"
              value={totalDiscount}
              onChange={(e) => classPayInfo.totalDiscount = e.target.value}
              disabled={disabled}
            />
            <span>%</span>
          </div>
        </div>

        {countList.map((item, index) => {
          let { label, key } = item
          return (
            <div key={index} className={style.avgDiscount}>
              <span>{label}</span>
              <div>
                <input type="text" className="bg-transparent"
                  value={classPayInfo[key]}
                  onChange={(e) => classPayInfo[key] = e.target.value}
                  disabled={disabled}
                />
                <span></span>
              </div>
            </div>
          )
        })}
      </div>

      <hr className={style.grayHr} />
      <div>
        <div className={style.inputBox01}>
          <span>交貨地點</span>
          <InputSel
            inputProps={{
              value: tradingLocation,
              onChange: (v) => { classPayInfo.tradingLocation = v },
            }}
            placeholder={`請輸入交貨地址`}
            disabled={disabled}
          />
        </div>
        <div className={style.inputBox01}>
          <span>交貨日期</span>
          <InputSel
            inputProps={{
              value: tradingDate,
              onChange: (v) => { classPayInfo.tradingDate = v },
            }}
            placeholder={`例 : 100-01-01`}
            disabled={disabled}
          />
        </div>
        {/* 付款辦法 */}
        <div className={style.payMethodContainer}>
          <span>付款辦法</span>

          {payWay.map((way, index) => {
            const { value, label } = way
            return (
              <div key={index}
                className={classNames(style.inputBox02, style.legacy)}>
                <IconRemoveCircle className={style.btn}
                  onClick={() => removePayWay(index)} />
                <span className={style.label}>{index + 1}.{label}</span>
                <InputSel
                  inputProps={{
                    value,
                    onChange: (v) => { editPayWay(index, v) },
                  }}
                  placeholder="請輸入%數"
                  disabled={disabled} />
                <span>%</span>
              </div>
            )
          })}
          <IconAddCircle className={style.btn} onClick={() => { setModalIsShow(true) }} />
        </div>
      </div>
      <InputModal
        visible={modalIsShow}
        title="新增付款辦法"
        placeholder="請輸入付款辦法描述"
        onConfirm={(v) => { addPayWay(v); setModalIsShow(false) }}
        onCancel={() => { setModalIsShow(false) }}
      />
    </div>
  )
} // PayInfo
// ============================
