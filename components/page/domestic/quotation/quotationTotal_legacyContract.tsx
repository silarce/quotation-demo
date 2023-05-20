// component
import StringList from "./quotationTotal/TextListEditor"
import PayInfo_legacy from "./quotationTotal/payInfo_legacy"
import Appendix from "./quotationTotal/appendix_legacy"
// css
import style from "./quotationTotal.module.scss"
// type
import { Class_legacyContract } from "hooks/quotation/useLegacyContract"



export default function QuotationTotal(
  {
    legacyContract,
    disabled = false,
    addFile: addFile,
    removeFile
  }:
    {
      legacyContract: Class_legacyContract
      disabled: boolean
      addFile: (file: File) => void
      removeFile: (index: number) => void
    }) {


  // --------------------
  const { classMemo, classQuoteRange } = legacyContract
  // --------------------
  const memoObj = {
    stringArr: classMemo.stringArr,
    editString: classMemo.editString,
    addString: classMemo.addString,
    delString: classMemo.delString,
  }

  // --------------------
  const quoteRangeObj = {
    stringArr: classQuoteRange.stringArr,
    editString: classQuoteRange.editString,
    addString: classQuoteRange.addString,
    delString: classQuoteRange.delString,
  }


  // ====================================================
  return (
    <div className={style.container}>
      <StringList
        stringObj={memoObj}
        alternateArr={undefined} searchAlternate={() => { }}
        label="備註"
        disabled={disabled} />
      <div className={style.layer01}>
        <div>
          <StringList
            stringObj={quoteRangeObj}
            alternateArr={undefined} searchAlternate={() => { }}
            label="報價範圍"
            disabled={disabled} />
          {/* <Appendix disabled={disabled}
            addFile={addFile}
            removeFile={removeFile}
          /> */}
        </div>
        <PayInfo_legacy
          legacyContract={legacyContract}
          disabled={disabled}
        />
      </div>
    </div >
  )
}