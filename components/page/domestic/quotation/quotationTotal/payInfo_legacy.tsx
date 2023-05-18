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
import { Class_legacyContract } from "hooks/quotation/useLegacyContract"


export default function PayInfo_legacy(
  { legacyContract,
    disabled }:
    {
      legacyContract: Class_legacyContract
      disabled: boolean
    }) {
  // -----------------------------------------------------------------------
  const [modalIsShow, setModalIsShow] = useState(false)
  // -----------------------------------------------------------------------
  const { classPayInfo } = legacyContract



  const {
    discountRate,
    subTotal,
    salesTax,
    total,
    deliveryLocation,
    deliveryDate,
    paymentMethods,

    editPayMethod,
    addPayMethod,
    removePayMethod,
  } = classPayInfo

  // -----------------------------------------------------------------------
  const countList = [
    { label: "小計", key: "subTotal" },
    { label: "營業稅(5%)", key: "salesTax" },
    { label: "總計", key: "total" },
  ] as const
  // -----------------------------------------------------------------------
  return (

    <div className={classNames(style.container, style.legacy)}>

      <div className={style.payBox}>
        <div className={style.avgDiscount}>
          <span>{"總折數"}</span>
          <div>
            <input type="number" className="bg-transparent"
              value={discountRate}
              onChange={(e) => classPayInfo.discountRate = e.target.value}
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
                <input type="number" className="bg-transparent"
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
              value: deliveryLocation,
              onChange: (v) => { classPayInfo.deliveryLocation = v },
            }}
            placeholder={`請輸入交貨地址`}
            disabled={disabled}
          />
        </div>
        <div className={style.inputBox01}>
          <span>交貨日期</span>
          <InputSel
            inputProps={{
              value: deliveryDate,
              onChange: (v) => { classPayInfo.deliveryDate = v },
            }}
            placeholder={`例 : 100-01-01`}
            disabled={disabled}
          />
        </div>
        {/* 付款辦法 */}
        <div className={style.payMethodContainer}>
          <span>付款辦法</span>

          {paymentMethods.map((method, index) => {
            const { totalPaymentRatio, milestone } = method
            return (
              <div key={index}
                className={classNames(style.inputBox02, style.legacy)}>
                <IconRemoveCircle className={style.btn}
                  onClick={() => removePayMethod(index)} />
                <span className={style.label}>{index + 1}.{milestone}</span>
                <InputSel
                  inputProps={{
                    value: totalPaymentRatio,
                    onChange: (v) => { editPayMethod(index, v) },
                    inputType: "number",
                  }}
                  placeholder="請輸入%數"
                  disabled={disabled} />
                <span>%</span>
              </div>
            )
          })}
          {!disabled && <IconAddCircle className={style.btn} onClick={() => { setModalIsShow(true) }} />}

        </div>
      </div>
      <InputModal
        visible={modalIsShow}
        title="新增付款辦法"
        placeholder="請輸入付款辦法描述"
        onConfirm={(v) => { addPayMethod(v); setModalIsShow(false) }}
        onCancel={() => { setModalIsShow(false) }}
      />
    </div>
  )
} // PayInfo
// ============================
