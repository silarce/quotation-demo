// 報價單
import React, { useState, useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';
import moment from 'moment';
import classNames from 'classnames';

// components
import QuotationProfile, { TprofileReturnBody } from 'components/page/domestic/quotation/quotationProfile';
import QuotationProduction from 'components/page/domestic/quotation/quotationProduct';
import QuotationComponent from 'components/page/domestic/quotation/quotationComponent';
import QuotationAccessory from 'components/page/domestic/quotation/quotationAccessory';
import QuotationTotal from 'components/page/domestic/quotation/quotationTotal';
import QuotationSinature from 'components/page/domestic/quotation/quotationSinature';
// import QuotationProdChangingRecord from "components/page/domestic/quotation/quotationProdChangingRecord"
// import QuotationRecord from "components/page/domestic/quotation/quotationRecord"
import QuotationPdf from 'components/page/domestic/pdf/quotationPdf/quotationPdf';
import QuotationPdf_part from 'components/page/domestic/pdf/quotationPdf_part/quotationPdf_part';
import QuotationStateSel from 'components/page/domestic/budget/quotationStateSel';
import QuotationAdditions from 'components/page/domestic/quotation/quotationAdditions';

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import TextareaModal from 'components/global/gear/modal/simpleModal/textareaModal';
import EmployeeSelector from 'components/global/gear/modal/employeeSelector';

// icon
import iconUpload from 'public/image/icon/upload.svg';

// option
import { optionsCreator_quotationState, Toption } from 'js/utils/options/options';
const optionQuotationState = optionsCreator_quotationState();

// css
import style from './quotation.module.scss';

// =============================================================

// 假資料與fake api
import { fakeApi_quotation_creator } from 'fakeDatabase/fakeAPI/fakeQuotationApi';
import { useQuotation } from 'hooks/quotation/useQuotation';
import { fakeApi_client } from 'fakeDatabase/fakeAPI/fakeClientApi';
import { fakeApi_memo } from 'fakeDatabase/fakeAPI/fakeMemoApi';
import { fakeApi_quoteRange } from 'fakeDatabase/fakeAPI/fakeQuoteRangeApi';

// =============================================================
// =============================================================
// =============================================================

import { useGetQuotation_id, TquotationDto } from 'js/api/api_quotation';

// =============================================================
// =============================================================
// =============================================================
export default function Quotation() {
  const router = useRouter();
  const isReady = router.isReady;

  if (!isReady) {
    return null;
  }

  return <TheQuotation router={router} />;
}

function TheQuotation({ router }: { router: NextRouter }) {
  const {
    id, //報價單id //若為新增報價單則為newQuotation
    // isNewQuotationId, // 新增報價單的id // 若不是新增報價單則為undefined
  } = router.query as { id: string | undefined };

  const [employeeSelectorShow, setEmployeeSelectorShow] = useState(false);

  // =========================================================
  // =========================================================
  // =========================================================
  const { data, update } = useGetQuotation_id(id as string);

  useEffect(() => {
    update();
  }, [id]);

  // =========================================================
  // =========================================================
  // =========================================================

  // 正式接上api前先這樣處理，但是我已經忘記這是在處理什麼了.....
  // let quotationData: Tquotation | undefined;
  // if (typeof quotationId === "string" && quotationId !== "newQuotation") {
  //   quotationData = fakeQuotationObjList[quotationId]
  //   if (!quotationData) quotationData = undefined
  // }
  // --------------------------------------------------------------------------
  // 是否可編輯
  // const [allowEdit, setAllowEdit] =
  //   useState(quotationId === "newQuotation" ? true : false)
  const [allowEdit, setAllowEdit] = useState(false);
  // =========================================================
  const fakeApiQuotaion = fakeApi_quotation_creator(router.query.quotationId as string);

  const { classQuotation, reNew: reNewClassQuotation } = useQuotation(fakeApiQuotaion?.get());
  const fakeClientList = fakeApi_client.get();
  const classSignature = classQuotation?.classSignature;
  const signatureArr = [
    {
      label: '經理',
      signature: classSignature?.manager ?? '',
      onChange: (v: string) => {
        if (classSignature) {
          classSignature.manager = v;
        }
      },
    },
    {
      label: '主管',
      signature: classSignature?.director ?? '',
      onChange: (v: string) => {
        if (classSignature) {
          classSignature.director = v;
        }
      },
    },
    {
      label: '經辦',
      signature: classSignature?.attn ?? '',
      onChange: (v: string) => {
        if (classSignature) {
          classSignature.attn = v;
        }
      },
    },
  ];

  const getFakeMemo = fakeApi_memo.get;
  const getFakeQuotaRange = fakeApi_quoteRange.get;

  useEffect(() => {
    reNewClassQuotation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowEdit]);

  // =========================================================
  // =========================================================
  // =========================================================
  // =========================================================

  // --------------------------------------------------------------------------

  const [showPdf, setShowPdf] = useState(false);
  const [showPdf_part, setShowPdf_part] = useState(false);

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  const [quotationState, setQuotationState] = useState<Toption>({ value: '預算', label: '預算' });

  const [showMemoModal, setShowMemoModal] = useState(false);

  const inputModalOnConfirm = (v: string) => {
    if (!fakeApiQuotaion || !classQuotation) {
      return myAlert.warning({ title: 'fakeApiQuotaion或classQuotation為undefined' });
    }

    if (!v) {
      return myAlert.warning({ title: '請輸入註解' });
    }

    // if (isNewQuotationId) {
    //   fakeApiQuotaion.post(classQuotation.postData);
    // } else {
    //   fakeApiQuotaion.put(classQuotation.postData);
    // }

    setShowMemoModal(false);
    setAllowEdit(false);
  };

  const tagList: TtagList = [
    {
      label: id ? `報價編號 ${data?.latestContent.quotationNumber || ''}` : '新報價單',
      onClick: () => alert(id),
    },
    { label: '工程聯絡單', onClick: () => alert('工程聯絡單') },
  ];

  // optionQuotationState
  const panel_editable: TpanelList = [
    {
      // 報價/歷史狀態狀態
      custom: (
        <QuotationStateSel
          quotationState={quotationState}
          setQuotationState={setQuotationState}
          history={fakeQuotationStateHistory}
        />
      ),
    },
    { type: 'redButton', label: '上傳', onClick: () => setShowMemoModal(true) },
    { type: 'myButton', label: '取消', onClick: () => setAllowEdit(false) },
  ];
  const panel_noEditable: TpanelList = [
    {
      type: 'myButton',
      label: '匯出報價單',
      img: iconUpload.src,
      onClick: () => setShowPdf(true),
    },
    {
      type: 'myButton',
      label: '匯出材料/配件',
      img: iconUpload.src,
      onClick: () => setShowPdf_part(true),
    },
    { type: 'myButton', label: '編輯', onClick: () => setAllowEdit(true) },
    { type: 'myButton', label: '送審', onClick: () => setEmployeeSelectorShow(true) },
    { type: 'myButton', label: '返回', onClick: () => router.back() },
  ];

  // --------------------------------------------------------------------------
  // 如果報價單編號錯誤(找不到這筆報價單)，就return NoQuotation
  // if (quotationId !== "newQuotation" && !quotationData)
  //   return <NoQuotation quotationId={quotationId as string} />
  // if (quotationId !== "newQuotation")
  //   return <NoQuotation quotationId={quotationId as string} />
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  if (!classQuotation) {
    return null;
  }

  // --------------------------------------------------------------------------
  const quotationPdf_part_mainProductArr = (() => {
    const theArr = classQuotation.mainProductArr.map((mp) => {
      return {
        ...mp.allData,
        part: mp.partArr.map((part) => part.allData),
      };
    });

    return theArr;
  })();

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  const onProfileChange = (v: TprofileReturnBody) => {
    console.log(v);
  };

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  return (
    <div className={style.container}>
      <PageHeader02 tagList={tagList} panelList={allowEdit ? panel_editable : panel_noEditable} />

      <div className={style.mainContainer}>
        <div className={style.quotation}>
          {/* 基本資料 */}
          <QuotationProfile //
            profile={data?.latestContent}
            disabled={!allowEdit}
            onProfileChange={onProfileChange}
          />

          <div className={style.switchBar}>
            <div className={style.active}>合約項目</div>
          </div>

          {/* 主產品設定 */}
          {/* <QuotationProduction classQuotation={classQuotation} disabled={!allowEdit} /> */}

          <div className={style.redWrapper}>
            {/* 材料配件設定 */}
            {/* <QuotationComponent classQuotation={classQuotation} disabled={!allowEdit} /> */}
            <hr />
            {/* 選配設定 */}
            {/* <QuotationAccessory activeRow={classQuotation.activeMainProd} disabled={!allowEdit} /> */}
          </div>
          {/* 其他設定 */}
          {/* <QuotationAdditions disabled={!allowEdit} /> */}

          {/* 備註/報價範圍/付款資訊 */}
          {/* <QuotationTotal
            classQuotation={classQuotation}
            getFakeMemo={getFakeMemo}
            getFakeQuotaRange={getFakeQuotaRange}
            disabled={!allowEdit}
          /> */}
          {/* 簽名 */}
          {/* <QuotationSinature signatureArr={signatureArr} disabled={!allowEdit} /> */}
        </div>
      </div>
      <TextareaModal
        visible={showMemoModal}
        setVisible={setShowMemoModal}
        title={'追加追減備註'}
        placeholder={'請輸入備註'}
        tip="最多25字"
        textLength={25}
        onConfirm={inputModalOnConfirm}
        autoCloseOnConfirm={false}
      />
      {/* <QuotationPdf
        isVisable={showPdf}
        onCancel={() => {
          setShowPdf(false);
        }}
        classQuotation={classQuotation}
      /> */}

      {/*  */}
      {/* <QuotationPdf_part
        isVisable={showPdf_part}
        onCancel={() => {
          setShowPdf_part(false);
        }}
        mainProductArr={quotationPdf_part_mainProductArr}
        quotationId={classQuotation.quotationId}
      /> */}
      {/*  */}
      <EmployeeSelector
        showModal={employeeSelectorShow}
        label="請選擇審核人員"
        onConfirm={(arr) => {
          setEmployeeSelectorShow(false);
        }}
        onCancel={() => {
          setEmployeeSelectorShow(false);
        }}
      />
    </div>
  );
}

// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
const NoQuotation = ({ quotationId }: { quotationId: string }) => {
  const router = useRouter();

  const toBack = () => {
    router.back();
  };

  return (
    <div className={style.noQuotation}>
      <span>沒有這個報價單ID</span>
      <span>{quotationId}</span>
      <button onClick={toBack}>回上一頁</button>
    </div>
  );
};

// ==========================================================================
// ==========================================================================
// ==========================================================================

const fakeQuotationStateHistory = [
  {
    state_from: '預算',
    state_to: '投標',
    isoString: moment('0111-02-03 05:11:05').toISOString(),
  },
  {
    state_from: '預算',
    state_to: '發包',
    isoString: moment('0111-02-10 09:15:08').toISOString(),
  },
  {
    state_from: '預算',
    state_to: '發包',
    isoString: moment('0111-03-05 15:01:46').toISOString(),
  },
  {
    state_from: '預算',
    state_to: '投標',
    isoString: moment('0111-03-23 13:45:11').toISOString(),
  },
];

// 先把api client建立起來，然後建立幾筆資料
// 先把api client建立起來，然後建立幾筆資料
// 先把api client建立起來，然後建立幾筆資料
// 先把api client建立起來，然後建立幾筆資料
// 先把api client建立起來，然後建立幾筆資料
// 先把api client建立起來，然後建立幾筆資料
