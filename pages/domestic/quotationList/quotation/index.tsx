// 報價單
import React, { useState, useReducer, useEffect, useContext, useMemo, memo } from 'react';
import { useRouter, NextRouter } from 'next/router';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _, { set } from 'lodash';
import { AxiosError } from 'axios';

// components

// import QuotationProfile, { Tcontrol_profile } from 'components/page/domestic/quotation/quotationProfile';
import QuotationSinature_3, {
  TemployeeDto,
  Tcontroll_signature,
} from 'components/page/domestic/quotation/quotationSinature_3';

// import QuotationPdf, {
//   quotationContentToBasicInfo,
//   quotationProdToTableProdList,
// } from 'components/page/domestic/pdf/quotationPdf/quotationPdf_new2';

import QuotationPdf, {
  useModalQuotationPdf,
} from 'components/page/domestic/pdf/quotationPdf/quotationPdf_new3/modal_quotationPdf';

import QuotationPdf_part, {
  TmainProduct,
  Tpart,
  usePdfPart,
} from 'components/page/domestic/pdf/quotationPdf_part/quotationPdf_part';
import QuotationStateSel from 'components/page/domestic/budget/quotationStateSel';
import ContractReviewForm, {
  useDefaultPaymentRatio_quotationContent,
} from 'components/composition/contractReviewForm/contractReviewForm';
import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
import Table_com from 'components/page/domestic/quotation/quotation/product/table_component';
import Table_accessories from 'components/page/domestic/quotation/quotation/product/table_accessories';
import Table_others from 'components/page/domestic/quotation/quotation/product/table_others';
import Summary, {
  TsummaryControl,
  TpayInfoControl,
} from 'components/page/domestic/quotation/quotation/summary/summary';
// import DoorSummary from 'components/page/domestic/quotation/doorSummary';

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import TextareaModal from 'components/global/gear/modal/simpleModal/textareaModal';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01'; // import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import ThreeButtonModal from 'components/global/gear/modal/simpleModal/multButtonModal';

import CustomerSelector from 'components/global/gear/modal/customerSelector';
import SignatureBar, { Tcontrol_signatureBar, TsignatureBarItem } from 'components/global/gear/signatureBar_v2';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import Dropdown from 'components/global/gear/dropdown/Dropdown';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// icon
import iconUpload from 'public/image/icon/upload.svg';
import iconRedLock from 'public/image/icon/redLock.svg';

// utils
import { urlToFile } from 'js/utils/helpers/urlToFile';
import {
  init_variable,
  calcNTDToForeignCurrency,
  checkIsReviewer,
  parseQuotationContentSituation,
} from 'components/page/domestic/quotation/function/utils_quotation';

// config
import { quotationStatusLookup } from 'config/lookupTable';

// api
import {
  TquotationDto,
  TquotationContentDto,
  TcreateQuotationContentDto,
  // useGetQuotation_id,
  // useGetQuotation_id_2,
  useGetQuotation_id_3,
  apiPostQuotation,
  apiPatchQuotation,
  apiQuotationSubmitReview,
  apiQuotationReview,
  apiQuotationUnlock,
  //
  useQuotation_id_attachments,
  apiPostQuotation_id_attachments,
  apiDelQuotation_id_attachments,
  //
  useGetQuotationContent_id,
  //
  apiPatchQuotationToPending,
  apiPostCopyQuotation,
  apiPatchQuotationContent_id_progress,
} from 'js/api/api_quotation';

// hook
// import { useProductList } from 'hooks/quotation/useProduct';
// import { useSummary, Tstate_summary } from 'components/page/domestic/quotation/hook/useSummary';

// type
import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';
import { TuserDto, TcreateQuotationProductDto, TcustomerDto } from 'js/api/dtoTypes';

import { checkIsFloat } from 'js/utils/checkValue';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// ======================================================================

// region REFACTOR IMPORT

import { SearchModal_customer } from 'components/composition/searchModal/useSearchModal/useSearchModal_customer';

import type { TstateTotalPrice } from 'components/page/domestic/quotation_v2/hook/quotationProduct/type';
import { useHistory } from 'components/page/domestic/quotation_v2/hook/useHistory';
import { usePanel } from 'components/page/domestic/quotation_v2/hook/usePanel';

import { createProps_payInfo } from 'components/page/domestic/quotation_v2/method/createProps_payInfo';

import { useProfile, createProps_profileForm } from 'components/page/domestic/quotation_v2/hook/useProfile';
import QuotationProfile from 'components/page/domestic/quotation_v2/QuotationProfile';

import { useAnnotations, useQuotationRange } from 'components/page/domestic/quotation_v2/hook/useRemark';
import QuotationRemark from 'components/page/domestic/quotation_v2/QuotationRemark';

import { useAttachment } from 'components/page/domestic/quotation_v2/hook/useAttachment';
import QuotationAttachment from 'components/page/domestic/quotation_v2/QuotationAttachment';

import { usePayInfo } from 'components/page/domestic/quotation_v2/hook/usePayInfo';
import QuotationPayInfo, { Tprops_quotationPayInfo } from 'components/page/domestic/quotation_v2/QuotationPayInfo';

import { useQuotationProduct } from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationProduct';
import QuotationProdTable from 'components/page/domestic/quotation_v2/QuotationProdTable';

import { useQuotationOther } from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationOther';
import QuotationOther from 'components/page/domestic/quotation_v2/QuotationOther';

import { useQuotationTotalPrice } from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationPrice';

import DoorSummary from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/doorSummary';

import { kit_req } from 'components/page/domestic/quotation_v2/method/kit_req';

import VersionLabel from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/versionLabel';

// css
import scss from './index.module.scss';

// ======================================================================
// ======================================================================

// region TYPE

interface Tquery {
  id?: string;
  // 從查詢報價單的展開列表點進來的話query裡就會有contentId
  contentId?: string;
  isContract?: string;
}

interface Tprops_useQuotation {
  quotationId: undefined | string;
  contentId: undefined | string;
  isNew: undefined | boolean;
  quotationNumber: undefined | string;
  content: TquotationContentDto;
}

// ======================================================================

const EmployeeSelectorGroup = selectModalCreator_multi<['employee', 'employee']>({
  selectorArr: [
    {
      key: 'employee',
      caption: '業務',
      limit: 1,
    },
    {
      key: 'employee',
      caption: '業務主管',
      limit: 1,
    },
  ],
});

// ======================================================================

// MARK: START
export default function Quotation({ userInfo }: { userInfo?: TuserDto }) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { id: quotationId, contentId, isContract } = query;

  const userId = userInfo?.employee?.id;

  const isNewQuotation = !quotationId && !contentId;
  const isQuotation = !!quotationId;
  const isContent = !!contentId;

  // ----------------------------------------------------------------------

  let {
    // reviewSalesEmployeeId,
    // reviewWorkDirectorEmployeeId,
    // reviewCashierEmployeeId,
    // reviewSupervisorEmployeeId,
    // reviewSalesManagerEmployeeId,
    // reviewManagerEmployeeId,
    // isReviewer,
    // isSales,
    // isWorkDirector,
    // isCashier,
    // isSupervisor,
    // eslint-disable-next-line prefer-const
    // isSalesManagerEmployee,
    // isManager,
    // salesReviewedAt,
    // supervisorReviewedAt,
    // salesManagerReviewedAt,
    // workDirectorReviewedAt,
    // cashierReviewedAt,
    managerReviewedAt,
    toSalesAt,
    toSupervisorAt,
    toSalesManagerAt,
    toWorkDirectorAt,
    toCashierAt,
    toManagerAt,
    // isSendToReview,
    // isSendToReview_pending,
    isAttach,
    isAllReviewedBeforePending,
    // version,
    // editNotes,
  } = init_variable();

  // ----------------------------------------------------------------------

  // region GET DATA

  const instatnce_getQuotationId3 = useGetQuotation_id_3(quotationId as string, {
    preBuiltPopulate: ['simple', 'attached'],
  });
  const {
    isFetching: isFetching_update,
    //
    raw: quotationData,
    update: update_quotation,
    // attachment
    attachmentArr,
    domain,
    //
    // reqPost,
    // reqPatch,
    reqReview,
    reqUnlock,
    reqPatchReviewer,
    reqCopyQuotation,
    reqPatchQuotationContent_id_progress,
    reqToPending,
  } = instatnce_getQuotationId3;

  const {
    data: quotationContentData,
    update: updateContent,
    clearData: clearData_content,
  } = useGetQuotationContent_id(contentId as string);

  const content = quotationData?.latestContent || quotationContentData;

  const haveVerifyForm = content?.verifyForm;

  const attachedToContract = quotationData?.attachedToContract;
  isAttach = attachedToContract ? true : undefined;

  managerReviewedAt = content?.managerReviewedAt;
  toSalesAt = content?.toSalesAt;
  toSupervisorAt = content?.toSupervisorAt;
  toSalesManagerAt = content?.toSalesManagerAt;
  toWorkDirectorAt = content?.toWorkDirectorAt;
  toCashierAt = content?.toCashierAt;
  toManagerAt = content?.toManagerAt;

  const agentEmployee = !quotationId ? userInfo?.employee : content?.agentEmployee;

  const {
    isSendToReview,
    isSendToReview_pending,
    //
    isReviewer,
    isSales,
    isWorkDirector,
    isCashier,
    isSupervisor,
    isManager,
  } =
    (content &&
      parseQuotationContentSituation({
        quotationContent: content,
        userId,
      })) ??
    {};

  if (content?.status === 'Budget' || content?.status === 'Bidding' || content?.status === 'Contracting') {
    managerReviewedAt && (isAllReviewedBeforePending = true);
  }

  // ----------------------------------------------------------------------

  // region STATE MANAGEMENT

  const [disabled, setDisabled] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [state_status, setState_status] = useState<TquotationContentDto['status']>('Budget');

  const [showEmployeSelector, setShowEmployeSelector] = useState(false);

  const [reviewFormShow, setReviewFormShow] = useState(false);

  // const { state_quotationTotal, setQuotationPriceTotal, setTuneTotal, setCurrency, setExchangeRate } =
  //   useQuotationTotalPrice({
  //     raw_quotationContent: content,
  //     disabled,
  //   });
  const instance_quotationPrice = useQuotationTotalPrice({
    raw_quotationContent: content,
    disabled,
  });

  const { state_quotationTotal, setQuotationPriceTotal, setTuneTotal, setCurrency, setExchangeRate } =
    instance_quotationPrice;

  const instance_quotationProduct = useQuotationProduct({
    raw_quotationContent: content,
    disabled,
    onProdAllTotalChange: (prodAllTotal) => {
      handleSetQuotationPriceTotal({
        prodPriceAllTotal: prodAllTotal,
        otherPriceAllTotal: instance_useQuotationOther.calcAllOtherTotalPrice(),
      });
    },
  });

  const { avgDiscount, doorModelSummery } = instance_quotationProduct;

  const {
    quotationDiscount: state_quotationDiscount, // 總折數
    // setQuotationDiscount,
    //
    // state_totalPrice, // 完整狀態
    // setProdPriceTotal,
    // setTuneTotal,
    // setCurrency,
    // setExchangeRate,
  } = instance_quotationProduct;

  const { state_profile, setState_profile } = useProfile({
    disabled,
    quotationContent: content,
  });

  const {
    annoArr,
    addAnno,
    openSelector: openSelector_anno,
  } = useAnnotations({
    disabled: true,
    raw_remarkArr: content?.annotations,
  });

  const {
    quotationRangeArr,
    addQuotationRange,
    openSelector: openSelector_qr,
  } = useQuotationRange({
    disabled: true,
    raw_remarkArr: content?.quotationRanges,
  });

  const {
    //
    fileInfoKitArr,
    addFile,
    createFileArr, // 要呼叫patch時使用
  } = useAttachment({
    resetTrigger: disabled,
    rawArr: attachmentArr,
    kit: {
      removeWithConfirm: false,
    },
  });

  const { state: state_payInfo, kit: kit_payInfo } = usePayInfo({
    disabled,
    raw: content,
  });

  const instance_useQuotationOther = useQuotationOther({
    disabled,
    raw_contentOtherArr: content?.others,
    onOtherPriceAllTotalChange(total) {
      handleSetQuotationPriceTotal({
        prodPriceAllTotal: instance_quotationProduct.calcProdAllTotal(),
        otherPriceAllTotal: total,
      });
    },
  });

  // ----------------------------------------------------------------------

  // region REQUEST
  //
  //
  //
  //
  //

  const { reqPostQuotation, reqPatchQuotation, reqCloneQuotation } = kit_req({
    userId,
    quotationId,
    instance_quotationProduct,
    instance_useQuotationOther,
    state_profile,
    state_payInfo,
    annoArr: annoArr.map((anno) => anno.value),
    quotationRangeArr: quotationRangeArr.map((qr) => qr.value),
    setIsFetching,
    createFileArr,
    update_quotation: async () => {
      await update_quotation();
    },
    setDisabled,
    state_quotationTotal,
    instatnce_getQuotationId3,
    status: state_status,
  });

  const handlePatch = () => {
    const { destroy } = myAlert.input({
      isTextArea: true,
      title: '報價單註解',
      width: 500,
      onConfirm: async (editNote) => {
        destroy();
        const { newQuotation } = await reqPatchQuotation({ editNote });

        if (newQuotation) {
          router.replace({
            query: {
              ...query,
              status: newQuotation.latestContent.status,
            },
          });
        }
      },
    });
  };

  const handlePost = () => {
    const { destroy } = myAlert.input({
      isTextArea: true,
      title: '報價單註解',
      width: 500,
      onConfirm: async (editNote) => {
        destroy();
        const { newQuotation } = await reqPostQuotation({ editNote });

        if (newQuotation) {
          router.replace({
            query: {
              ...query,
              id: newQuotation.id,
              status: newQuotation.latestContent.status,
            },
          });
        }
      },
    });
  };

  const handleClone = async (isRelationQuotation?: boolean | undefined) => {
    const { destroy } = myAlert.clear({
      content: (
        <SearchModal_customer
          onRowClick={async (customer) => {
            const customerId = customer.id;
            destroy();
            const res = await reqCloneQuotation({ customerId, isRelationQuotation });
            setDisabled(true);

            if (res) {
              router.replace({
                query: {
                  id: res.id,
                },
              });
            }
          }}
        />
      ),
      onCancel: () => destroy(),
    });
  };

  // 轉為準合約
  const handleReqToPending = async () => {
    if (!content) {
      return;
    }

    if (!isAllReviewedBeforePending) {
      myAlert.info({ title: '此報價單尚未審核完畢' });

      return;
    }

    if (content.status === 'Pending') {
      myAlert.info({ title: '此報價單已經是準合約' });
    }

    if (content.status === 'Contract') {
      myAlert.info({ title: '此報價單已是合約' });
    }

    const { quotation } = (await reqToPending(content.id)) ?? {};

    router.replace({
      query: {
        ...query,
        status: quotation?.latestContent.status,
      },
    });
  };

  // MARK: 送審
  const handleSubmit = async ({
    sales,
    supervisor,
  }: {
    sales: TemployeeDto | undefined;
    supervisor: TemployeeDto | undefined;
  }) => {
    if (!isQuotation) {
      return;
    }

    const reviewSalesEmployeeId = sales?.id ?? null;
    const reviewSupervisorEmployeeId = supervisor?.id ?? null;

    if (status === 'Pending' && !reviewSalesEmployeeId) {
      return myAlert.err({ title: '沒有業務' });
    }

    if (status === 'TempPending') {
      if (!reviewSalesEmployeeId) {
        return myAlert.info({ title: '請選擇業務' });
      }
    } else if (!reviewSalesEmployeeId || !reviewSupervisorEmployeeId) {
      return myAlert.info({ title: '請選擇所有審核人員' });
    }

    const body = { reviewSalesEmployeeId, reviewSupervisorEmployeeId };

    reqPatchReviewer({
      body,
    });

    setShowEmployeSelector(false);
  };

  // MARK: 審核
  const handleReview = async () => {
    const callReq = async (isPass: boolean) => {
      if (isPass && content?.status === 'Pending' && !haveVerifyForm) {
        myAlert.warning({ title: '請先送出合約審核表' });

        return;
      }

      const body = {
        reviewSalesEmployeeId: isSales ? userId : null,
        reviewSupervisorEmployeeId: isSupervisor ? userId : null,
        // reviewSalesManagerEmployeeId: isSalesManagerEmployee ? userId : null,
        reviewWorkDirectorEmployeeId: isWorkDirector ? userId : null,
        reviewCashierEmployeeId: isCashier ? userId : null,
        reviewManagerEmployeeId: isManager ? userId : null,
        reviewResult: isPass,
      };

      const res = await reqReview(body);

      if (res?.status === 'Contract') {
        router.back();
      } else {
        update_quotation();
      }
    };

    const { destroy } = myAlert.clear({
      content: (
        <AskRevier
          //
          onPass={async () => {
            await callReq(true);
            destroy();
          }}
          onNoPass={async () => {
            await callReq(false);
            destroy();
          }}
          onCancel={() => destroy()}
        />
      ),
    });
  };

  // MARK: 解除鎖定
  const handleReqUnlock = async () => {
    myAlert.confirm({
      title: '確定要解除鎖定?',
      content: '此報價單將需要重新送審並回到發包狀態',
      props: {
        onOk: async () => {
          const { quotation } = (await reqUnlock()) ?? {};

          if (quotation) {
            router.replace({
              query: {
                ...query,
                status: quotation.latestContent.status,
              },
            });
          }
        },
      },
    });
  };

  // ----------------------------------------------------------------------

  // region METHOD

  function handleSetQuotationPriceTotal({
    prodPriceAllTotal,
    otherPriceAllTotal,
  }: {
    prodPriceAllTotal: number | `${number}`;
    otherPriceAllTotal: number | `${number}`;
  }) {
    const quotationPriceTotal = new Decimal(prodPriceAllTotal).add(otherPriceAllTotal).toNumber();

    setQuotationPriceTotal(quotationPriceTotal);
  }

  // ----------------------------------------------------------------------
  // region PROPS

  const {
    visible: pdfModalVisible,
    // setVisible: setPdfModalVisible,
    showPdf,
    showPdf_noDiscount,
    hidePdf,
    pdfData,
  } = useModalQuotationPdf({
    quotationContent: content,
    emptySomeProperty: state_status === 'Bidding',
  });

  const { pdfPartProps, show_pdfPart, setShow_pdfPart } = usePdfPart({
    quotationContent: content,
  });

  const props_profileForm = createProps_profileForm({
    state_profile,
    setState_profile,
    reqPatchTrackProgressOrProjectProgress: reqPatchQuotationContent_id_progress,
    isSendToReview,
  });

  const props_payInfo = createProps_payInfo({
    instance_quotationPrice,
    kit_payInfo,
    state_quotationDiscount,
    disabled,
    avgDiscount,
  });

  const { panelList, customeRight } = usePanel({
    disabled,
    isNewQuotation,
    isQuotation,
    isReviewer,
    status: content?.status ?? '',
    //
    isAllReviewedBeforePending,
    //
    btnEditOnClick: () => {
      setDisabled(false);
    },
    btnCancelOnClick: () => {
      setDisabled(true);
    },
    btnPatchOnClick: handlePatch,
    btnPostOnClick: handlePost,

    cloneQuotation: () => {
      handleClone();
    },
    cloneQuotation_relation: () => {
      handleClone(true);
    },
    handleReqToPending,

    handleReview,
    handleSubmit: () => setShowEmployeSelector(true),
    showVerifyForm: () => setReviewFormShow(true),
    handleReqUnlock,
    //
    showPdf,
    showPdf_noDiscount,
    showPdf_part: () => setShow_pdfPart(true),
  });

  const history = useHistory({
    quotationData,
  });

  const customeLeft: React.ReactNode[] = [
    <VersionLabel
      key="0"
      version={content?.version}
      subTotal={state_quotationTotal.subTotal}
      salesTax={state_quotationTotal.salesTax}
      total={state_quotationTotal.total}
    />,
  ];

  // MARK:control_signature

  const { control_signature, defaultSeletedDataArrArr, dynaSelectorPropsList } = useReviewrUi({
    quotationData,
    agentEmployee,
    status: state_status,
  });

  // ----------------------------------------------------------------------
  // region useEffect
  useEffect(() => {
    if (quotationId) {
      update_quotation();
    } else if (contentId) {
      updateContent();
    }
  }, [quotationId, contentId]);

  useEffect(() => {
    const status = content?.status || 'Budget';

    setState_status(status);
  }, [content]);

  // ----------------------------------------------------------------------

  // MARK: RENDER
  return (
    <SubLayer
      isLoading_all={isFetching_update || isFetching}
      // isLoading_subLayer={true}
    >
      <PageHeader02
        tag={quotationId ? `報價編號 ${content?.quotationNumber}` : '新增報價單'}
        panelList={panelList}
        customeLeft={customeLeft}
        customeRight={customeRight}
      />

      <div>
        <QuotationProfile
          disabled={disabled}
          form={props_profileForm}
          quotationNumber={content?.quotationNumber ?? '---'}
          editNotes={content?.editNotes}
          additionRight={
            <QuotationStateSel
              key="0"
              quotationState={{ value: state_status, label: quotationStatusLookup[state_status] }}
              setQuotationState={(option) => {
                setState_status(option.value as TquotationContentDto['status']);
              }}
              history={history}
              isNew={isNewQuotation}
              disabled={disabled}
            />
          }
        />

        <InputSel
          className={'ml-[50px]'}
          caption={'門型彙總'}
          showBaseline="invisible"
          captionStyle={{ width: '120px' }}
          wrapperStyle={{ padding: '21px 0px 4px 0px', gap: '24px' }}
          node={
            <DoorSummary
              list={Object.values(doorModelSummery).map((item) => {
                return {
                  doorModel: item.doorModel,
                  quantity: item.quantity,
                  avgDiscount: item.avgDiscount,
                };
              })}
            />
          }
        />

        {/* prod */}
        {/* prod */}
        {/* prod */}
        <br />
        <br />
        <div className={'px-[50px]'}>
          <QuotationProdTable disabled={disabled} instance_useQuotationProductInstance={instance_quotationProduct} />
          <QuotationOther disabled={disabled} instance_useQuotationOther={instance_useQuotationOther} />
        </div>

        {/* prod */}
        {/* prod */}
        {/* prod */}
        <div className={scss.summary}>
          <div className={scss.left}>
            {/* 備註 */}
            <QuotationRemark
              label="備註"
              disabled={disabled}
              remarkArr={annoArr}
              onUpponAddClick={openSelector_anno}
              onAddClick={addAnno}
            />
            <QuotationRemark
              label="報價範圍"
              disabled={disabled}
              remarkArr={quotationRangeArr}
              onUpponAddClick={openSelector_qr}
              onAddClick={addQuotationRange}
            />
            {/* 附件 */}
            <QuotationAttachment disabled={disabled} fileArr={fileInfoKitArr} addFile={addFile} />
          </div>
          {/* 付款資訊 */}
          <div className={scss.right}>
            {/* <div className="w-[400px] border border-border">付款資訊</div> */}
            <QuotationPayInfo disabled={disabled} form={props_payInfo} />
          </div>
        </div>
        <SignatureBar
          //
          className={'mx-[50px] mt-[130px] mb-[40px]'}
          control={control_signature}
        />
        {/*  */}
        {/*  */}
        {/*  */}

        <ContractReviewForm
          showModal={reviewFormShow}
          readOnly={state_status === 'Pending' && isSendToReview_pending}
          onCancel={() => setReviewFormShow(false)}
          contentId={content?.id}
          // contractNumber={latestContent?.quotationNumber ?? ''}
          // projectName={latestContent?.projectName ?? ''}
          // totalPrice={Number(state_summary.total.replaceAll(',', ''))}
          // verifyForm={verifyForm}
          onConfirm={update_quotation}
          // defaultPaymentRatioArr={useDefaultPaymentRatio_quotationContent(latestContent)}
        />

        <QuotationPdf
          visible={pdfModalVisible}
          pdfData={pdfData}
          onCancel={hidePdf}
          fileName={content?.quotationNumber ?? ''}
        />

        <QuotationPdf_part
          isVisable={show_pdfPart}
          onCancel={() => {
            setShow_pdfPart(false);
          }}
          mainProductArr={pdfPartProps}
          quotationId={content?.quotationNumber ?? ''}
        />

        <EmployeeSelectorGroup
          showModal={showEmployeSelector}
          caption="請選擇審核人員"
          isCancelOnConfirm={false}
          defaultSeletedDataArrArr={defaultSeletedDataArrArr}
          dynaSelectorPropsList={dynaSelectorPropsList}
          onConfirm={(arr) => {
            // 在Pedding，sales的選擇器會被跳過不顯示，但是arr結構不會變
            const sales = arr[0][0] as TemployeeDto | undefined;
            const supervisor = arr[1][0] as TemployeeDto | undefined;

            myAlert.confirm({
              title: '確定送審',
              props: {
                onOk: () => {
                  handleSubmit({
                    sales,
                    supervisor,
                  });
                },
              },
            });
          }}
          onCancel={() => {
            setShowEmployeSelector(false);
          }}
        />
        {/*  */}
        {/*  */}
        {/*  */}
      </div>
    </SubLayer>
  );
}
// MARK: END
//
//

// =============================================================================

// MARK:useReviewr
const useReviewrUi = ({
  quotationData,
  agentEmployee,
  status,
}: {
  quotationData: TquotationDto | undefined | null;
  agentEmployee: TemployeeDto | undefined | null;
  status: TquotationContentDto['status'];
}) => {
  const { control_signature, defaultSeletedDataArrArr, dynaSelectorPropsList } = useMemo(() => {
    const latestContent = quotationData?.latestContent;

    const signatureArr: Tcontrol_signatureBar['signatureArr'] = [
      {
        label: '總經理',
        value: latestContent?.reviewManagerEmployee?.chName,
        style: { width: '180px' },
        isReviewed: !!latestContent?.managerReviewedAt,
      },
      {
        label: '應收帳款',
        value: latestContent?.reviewCashierEmployee?.chName,
        style: { width: '180px' },
        isReviewed: !!latestContent?.cashierReviewedAt,
      },
      {
        label: '應收帳款',
        value: latestContent?.reviewWorkDirectorEmployee?.chName,
        style: { width: '180px' },
        isReviewed: !!latestContent?.workDirectorReviewedAt,
      },
      // {
      //   label: '業務經理',
      //   value: quotationData?.latestContent.reviewSalesManagerEmployee?.chName,
      //   style: { width: '180px' },
      //   isReviewed: !!quotationData?.latestContent.salesManagerReviewedAt,
      // },
      {
        label: '業務主管',
        value: latestContent?.reviewSupervisorEmployee?.chName,
        style: { width: '180px' },
        isReviewed: !!latestContent?.supervisorReviewedAt,
      },
      {
        label: '業務',
        value: latestContent?.reviewSalesEmployee?.chName,
        style: { width: '180px' },
        isReviewed: !!latestContent?.salesReviewedAt,
      },
      {
        label: '經辦',
        value: agentEmployee?.chName,
        style: { width: '180px' },
      },
    ];

    if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
      signatureArr.splice(1, 2);
    }

    // if (status === 'Pending') {
    //   signatureArr.splice(5, 1);
    // }

    const control_signature = {
      signatureArr,
    };

    const defaultSeletedDataArrArr: Parameters<typeof EmployeeSelectorGroup>[0]['defaultSeletedDataArrArr'] = [
      latestContent?.reviewSalesEmployee ? [latestContent.reviewSalesEmployee] : undefined,
      latestContent?.reviewSupervisorEmployee ? [latestContent.reviewSupervisorEmployee] : undefined,
    ];

    const dynaSelectorPropsList: Parameters<typeof EmployeeSelectorGroup>[0]['dynaSelectorPropsList'] = [{}, {}];

    if (status === 'TempPending') {
      // if (latestContent?.toSalesAt) {
      //   dynaSelectorPropsList[0] && (dynaSelectorPropsList[0].isSkip = true);
      // }

      // if (latestContent?.toSupervisorAt) {
      //   dynaSelectorPropsList[1] && (dynaSelectorPropsList[1].isSkip = true);
      // }
      dynaSelectorPropsList[1] && (dynaSelectorPropsList[1].isSkip = true);
    }

    if (status === 'Pending') {
      // dynaSelectorPropsList[0] && (dynaSelectorPropsList[0].isSkip = true);

      // dynaSelectorPropsList[0].isSkip = true;

      if (latestContent?.toSalesAt) {
        dynaSelectorPropsList[0] && (dynaSelectorPropsList[0].isSkip = true);
      }

      if (latestContent?.toSupervisorAt) {
        dynaSelectorPropsList[1] && (dynaSelectorPropsList[1].isSkip = true);
      }
    }

    return {
      control_signature,
      defaultSeletedDataArrArr,
      dynaSelectorPropsList,
    };
  }, [agentEmployee?.chName, quotationData?.latestContent, status]);

  return {
    control_signature,
    defaultSeletedDataArrArr,
    dynaSelectorPropsList,
  };
};

// ================================================================================

const AskRevier = ({
  onPass,
  onNoPass,
  onCancel,
}: {
  onPass: () => void;
  onNoPass: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="p-10">
      <p className="text-center text-2xl text-main mb-10">是否通過審核?</p>
      <div className="flex justify-center gap-10 mt-4">
        <MyButton_v2 onClick={onPass} theme="danger">
          通過審核
        </MyButton_v2>
        <MyButton_v2 onClick={onNoPass}>不通過審核</MyButton_v2>
        <MyButton_v2 onClick={onCancel}>取消</MyButton_v2>
      </div>
    </div>
  );
};
