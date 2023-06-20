import { useState } from "react"
// component
import TextListEditor_v2 from "./quotationTotal/TextListEditor_v2"
import PayInfo_legacy from "./quotationTotal/payInfo_legacy"
// import Appendix from "./quotationTotal/appendix_legacy"
import Appendix from "./quotationTotal/appendix_legacy_noReview"
// css
import style from "./quotationTotal.module.scss"
// type
import { Class_legacyContract } from "hooks/quotation/useLegacyContract"

import { TfileInfo } from "components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview"



// gear
import WorkSheetSelector from "components/global/gear/modal/workSheetSelector"

// type
import { Class_listString } from "hooks/quotation/useLegacyContract"
import { TgetAnnotation, TgetQuotataionRanges} from 'js/api/api_workSheet';



export default function QuotationTotal(
  {
    legacyContract,
    disabled = false,
    appendixParams,
  }:
    {
      legacyContract: Class_legacyContract
      disabled: boolean
      appendixParams: {
        fileInfoArr: TfileInfo[]
        // addFile: (file: File) => void
        // removeFile: (index: number) => void
        removeFileInfo: (index: number) => void
        toSetFileInfo: (newImgInfoArr: TfileInfo[]) => void
      }
    }) {

  const [show_anno, setShow_anno] = useState(false)
  const [show_qr, setShow_qr] = useState(false)





  // --------------------
  const { classNotes: classMemo, classQuoteScopes: classQuoteRange } = legacyContract

  // --------------------

  const showAnnoSelector = () => {
    setShow_anno(true)
  }
  const cancelAnnoSelector = () => {
    setShow_anno(false)
  }
  const onConfirm_anno = (v: TgetAnnotation["data"]) => {
    const vArr = v.map((item) => item.description)
    annoObj.addString(vArr)
  }

  const showQrSelector = () => {
    setShow_qr(true)
  }
  const cancelQrSelector = () => {
    setShow_qr(false)
  }
  const onConfirm_qr = (v: TgetQuotataionRanges["data"]) => {
    const vArr = v.map((item) => item.description)
    quoteRangeObj.addString(vArr)
  }

  // --------------------
  const annoObj = {
    stringArr: classMemo.stringArr,
    editString: classMemo.editString,
    addString: classMemo.addString,
    delString: classMemo.delString,
    showSelector: showAnnoSelector
  }

  // --------------------
  const quoteRangeObj = {
    stringArr: classQuoteRange.stringArr,
    editString: classQuoteRange.editString,
    addString: classQuoteRange.addString,
    delString: classQuoteRange.delString,
    showSelector: showQrSelector
  }


  // ====================================================
  return (
    <div className={style.container}>
      <TextListEditor_v2
        stringObj={annoObj}
        searchAlternate={() => { }}
        label="備註"
        disabled={disabled}
      />
      <div className={style.layer01}>
        <div>
          <TextListEditor_v2
            stringObj={quoteRangeObj}
            searchAlternate={() => { }}
            label="報價範圍"
            disabled={disabled} />
          <Appendix disabled={disabled}
            appendixParams={appendixParams}
          />
        </div>
        <PayInfo_legacy
          legacyContract={legacyContract}
          disabled={disabled}
        />
      </div>

      <WorkSheetSelector
        showModal={show_anno}
        onConfirm={onConfirm_anno}
        onCancel={cancelAnnoSelector}
        apiFamily="annotation"
      />
      <WorkSheetSelector
        showModal={show_qr}
        onConfirm={onConfirm_qr}
        onCancel={cancelQrSelector}
        apiFamily="quotationRanges"
      />
    </div >
  )
}