import { useState } from 'react';
// component
import TextListEditor_v2 from '../quotationTotal/TextListEditor_v2';
import PayInfo_legacy from '../quotationTotal/payInfo_legacy';
import Appendix from '../quotationTotal/appendix_legacy_noReview';
// css
import style from '../quotationTotal.module.scss';
// type
import { Class_legacyContract } from 'hooks/quotation/legacy/useLegacyContract';

import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

// gear
import WorkSheetSelector from 'components/global/gear/modal/workSheetSelector';

// type
import { TgetAnnotation, TgetQuotataionRanges } from 'js/api/api_workSheet';

export default function QuotationTotal({
  legacyContract,
  disabled = false,
  appendixParams,
  isAppending,
}: {
  legacyContract: Class_legacyContract;
  disabled: boolean;
  appendixParams: {
    fileInfoArr: TfileInfo[];
    removeFileInfo: (index: number) => void;
    toSetFileInfo: (newImgInfoArr: TfileInfo[]) => void;
  };
  isAppending?: boolean;
}) {
  const [show_anno, setShow_anno] = useState(false);
  const [show_qr, setShow_qr] = useState(false);

  // --------------------
  const { classNotes, classQuoteScopes } = legacyContract;
  // --------------------

  const showAnnoSelector = () => {
    setShow_anno(true);
  };

  const cancelAnnoSelector = () => {
    setShow_anno(false);
  };

  const onConfirm_anno = (v: TgetAnnotation['data']) => {
    const vArr = v.map((item) => item.description);

    if (!vArr[0]) {
      vArr[0] = '';
    }

    annoObj.addString(vArr);
  };

  const showQrSelector = () => {
    setShow_qr(true);
  };

  const cancelQrSelector = () => {
    setShow_qr(false);
  };

  const onConfirm_qr = (v: TgetQuotataionRanges['data']) => {
    const vArr = v.map((item) => item.description);

    if (!vArr[0]) {
      vArr[0] = '';
    }

    quoteRangeObj.addString(vArr);
  };

  // --------------------
  const annoObj = {
    stringArr: classNotes.stringArr,
    editString: classNotes.editString,
    addString: classNotes.addString,
    delString: classNotes.delString,
    showSelector: showAnnoSelector,
  };

  // --------------------
  const quoteRangeObj = {
    stringArr: classQuoteScopes.stringArr,
    editString: classQuoteScopes.editString,
    addString: classQuoteScopes.addString,
    delString: classQuoteScopes.delString,
    showSelector: showQrSelector,
  };

  // ====================================================
  return (
    <div className={style.container}>
      {/* <TextListEditor_v2 stringObj={annoObj} label="備註" disabled={disabled} /> */}
      <TextListEditor_v2 stringObj={annoObj} label="備註" disabled={isAppending ? false : disabled} />
      <div className={style.layer01}>
        <div>
          <TextListEditor_v2 stringObj={quoteRangeObj} label="報價範圍" disabled={disabled} />
          <Appendix disabled={disabled} appendixParams={appendixParams} />
        </div>
        <PayInfo_legacy legacyContract={legacyContract} disabled={disabled} />
      </div>

      <WorkSheetSelector
        label="備註"
        tip="可複選、可不選(按確定即可)"
        showModal={show_anno}
        onConfirm={onConfirm_anno}
        onCancel={cancelAnnoSelector}
        apiFamily="annotation"
      />
      <WorkSheetSelector
        label="報價範圍"
        tip="可複選、可不選(按確定即可)"
        showModal={show_qr}
        onConfirm={onConfirm_qr}
        onCancel={cancelQrSelector}
        apiFamily="quotationRanges"
      />
    </div>
  );
}
