import { useState } from 'react';
// component
import TextListEditor_v2 from '../../quotationTotal/TextListEditor_v2';
import PayInfo, { Tcontrol as TpayInfoControl } from './payInfo';
import Appendix from '../../quotationTotal/appendix_legacy_noReview';

// css
import scss from './summary.module.scss';
// type

import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

// gear
// import WorkSheetSelector from 'components/global/gear/modal/workSheetSelector';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// type
// import { TgetAnnotation, TgetQuotataionRanges } from 'js/api/api_workSheet';

type Tcontrol = {
  stringArr: string[];
  editString: (index: number, v: string) => void;
  addString: (v: string) => void;
  delString: (index: number) => void;
  addStrArr: (vArr: string[]) => void;
  replaceStrArr: (vArr: string[]) => void;
};

// ===============================================================================

const AnnoSelectorGroup = selectModalCreator_multi<['annotation']>({
  selectorArr: [
    {
      key: 'annotation',
      caption: '備註',
      // limit: 1,
    },
  ],
});

const RangeSelectorGroup = selectModalCreator_multi<['quotationRange']>({
  selectorArr: [
    {
      key: 'quotationRange',
      caption: '報價範圍',
      // limit: 1,
    },
  ],
});

// ===============================================================================
export default function Summary({
  // legacyContract,
  appendixParams,
  disabled = false,
  payInfoControl,
  control_anno,
  control_qr,
}: {
  // legacyContract: Class_legacyContract;
  disabled: boolean;
  payInfoControl: TpayInfoControl;
  control_anno: Tcontrol;
  control_qr: Tcontrol;

  // 等api可已上傳附件時再做appendixParams
  appendixParams: {
    fileInfoArr: TfileInfo[];
    removeFileInfo: (index: number) => void;
    toSetFileInfo: (newImgInfoArr: TfileInfo[]) => void;
  };
}) {
  const [show_anno, setShow_anno] = useState(false);
  const [show_qr, setShow_qr] = useState(false);

  const showAnnoSelector = () => {
    setShow_anno(true);
  };

  const cancelAnnoSelector = () => {
    setShow_anno(false);
  };

  // const onConfirm_anno = (v: TgetAnnotation['data']) => {
  //   const vArr = v.map((item) => item.description);

  //   if (!vArr[0]) {
  //     vArr[0] = '';
  //   }

  //   control_anno.addStrArr(vArr);
  // };

  const onConfirm_anno = (arr: { description: string }[]) => {
    const vArr = arr.map((item) => item.description);

    if (!vArr[0]) {
      vArr[0] = '';
    }

    // control_anno.addStrArr(vArr);
    control_anno.replaceStrArr(vArr);
  };

  const showQrSelector = () => {
    setShow_qr(true);
  };

  const cancelQrSelector = () => {
    setShow_qr(false);
  };

  const onConfirm_qr = (arr: { description: string }[]) => {
    const vArr = arr.map((item) => item.description);

    if (!vArr[0]) {
      vArr[0] = '';
    }

    control_qr.replaceStrArr(vArr);
  };

  // --------------------
  const annoObj = {
    ...control_anno,
    showSelector: showAnnoSelector,
  };

  const quoteRangeObj = {
    ...control_qr,
    showSelector: showQrSelector,
  };

  const defalutAnno = annoObj.stringArr.map((str, index) => {
    return {
      // 選擇器需要id建立list
      id: String(index),
      description: str,
    };
  });

  const defaultQrArr = quoteRangeObj.stringArr.map((str, index) => {
    return {
      // 選擇器需要id建立list
      id: String(index),
      description: str,
    };
  });

  // ====================================================
  return (
    <div className={scss.container}>
      <TextListEditor_v2 stringObj={annoObj} label="備註" disabled={disabled} />
      <div className={scss.block02}>
        <div>
          <TextListEditor_v2 stringObj={quoteRangeObj} label="報價範圍" disabled={disabled} />
          <Appendix disabled={disabled} appendixParams={appendixParams} />
        </div>
        <PayInfo disabled={disabled} control={payInfoControl} />
      </div>

      {/* <WorkSheetSelector
        label="備註"
        tip="可複選、可不選(按確定即可)"
        showModal={show_anno}
        onConfirm={onConfirm_anno}
        onCancel={cancelAnnoSelector}
        apiFamily="annotation"
      /> */}
      {/* <WorkSheetSelector
        label="報價範圍"
        tip="可複選、可不選(按確定即可)"
        showModal={show_qr}
        onConfirm={onConfirm_qr}
        onCancel={cancelQrSelector}
        apiFamily="quotationRanges"
      /> */}
      <AnnoSelectorGroup
        //
        showModal={show_anno}
        onConfirm={(arr) => {
          onConfirm_anno(arr[0]);
        }}
        onCancel={cancelAnnoSelector}
        // TODO 以後再處理型別問題，selectModalCreator_multi
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        defaultSeletedDataArrArr={[defalutAnno]}
      />

      <RangeSelectorGroup
        showModal={show_qr}
        onConfirm={(arr) => {
          onConfirm_qr(arr[0]);
        }}
        onCancel={cancelQrSelector}
        // TODO 以後再處理型別問題，selectModalCreator_multi
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        defaultSeletedDataArrArr={[defaultQrArr]}
      />
    </div>
  );
}

export type { TpayInfoControl, Tcontrol as TsummaryControl };
