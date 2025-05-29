// 報價單
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';

import Decimal from 'decimal.js';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
import QuotationPdf, {
  useModalQuotationPdf,
} from 'components/page/domestic/pdf/quotationPdf/quotationPdf_new3/modal_quotationPdf';
import QuotationPdf_part, { usePdfPart } from 'components/page/domestic/pdf/quotationPdf_part/quotationPdf_part';
import QuotationStateSel from 'components/page/domestic/budget/quotationStateSel';
import ContractReviewForm from 'components/composition/contractReviewForm/contractReviewForm';
import DoorSummary from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/doorSummary';
import VersionLabel from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/versionLabel';

// global gear
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import SignatureBar, { Tcontrol_signatureBar } from 'components/global/gear/signatureBar_v2';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// config
import { quotationStatusLookup } from 'config/lookupTable';

// api
import {
  TquotationDto,
  TquotationContentDto,
  TquotationContractDto,
  useGetQuotation_id_3,
  useGetContract_id_forAttach,
  useIterativeContractProduct,
  parseProdAction,
} from 'js/api/api_quotation';

// type
import { TuserDto, TemployeeDto } from 'js/api/dtoTypes';

// utils
import { calcW } from 'js/utils/product/calc';
import {
  init_variable,
  parseQuotationContentSituation,
} from 'components/page/domestic/quotation/function/utils_quotation';

// hook
import { SearchModal_customer } from 'components/composition/searchModal/useSearchModal/useSearchModal_customer';
import { useHistory } from 'components/page/domestic/quotation_v2/hook/useHistory';
import { usePanel } from 'components/page/domestic/quotation_v2/hook/usePanel';

// abstraction
import { createProps_payInfo } from 'components/page/domestic/quotation_v2/method/createProps_payInfo';
import { kit_req } from 'components/page/domestic/quotation_v2/method/kit_req';
import {
  calcQtyModify,
  calcPriceDiscount_percent,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/method/calcProd';

// css
import scss from './index.module.scss';

// ======================================================================

// component and data hook
import {
  Tstate_profile,
  useProfile,
  createProps_profileForm,
  Traw_profile,
} from 'components/page/domestic/quotation_v2/hook/useProfile';
import QuotationProfile from 'components/page/domestic/quotation_v2/QuotationProfile';
//
import { useAnnotations, useQuotationRange } from 'components/page/domestic/quotation_v2/hook/useRemark';
import QuotationRemark from 'components/page/domestic/quotation_v2/QuotationRemark';
//
import { useAttachment } from 'components/page/domestic/quotation_v2/hook/useAttachment';
import QuotationAttachment from 'components/page/domestic/quotation_v2/QuotationAttachment';
//
import { usePayInfo } from 'components/page/domestic/quotation_v2/hook/usePayInfo';
import QuotationPayInfo from 'components/page/domestic/quotation_v2/QuotationPayInfo';
import {
  TstateProdDict,
  TprodSource,
  useQuotationProduct,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationProduct';
import QuotationProdTable from 'components/page/domestic/quotation_v2/QuotationProdTable';
//
import { useQuotationOther } from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationOther';
import QuotationOther from 'components/page/domestic/quotation_v2/QuotationOther';
//
import { useQuotationTotalPrice } from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationPrice';

// ======================================================================
// ======================================================================

import { useInterval } from 'hooks/useInterval';

// ======================================================================
// ======================================================================

// region TYPE

// 沒有id - 新增報價單
// 有id，其他都沒有 - 編輯報價單
// 有id，有contentId - 編輯報價單，但是以指定content取代latestContent
interface Tquery {
  id?: string;
  // 從查詢報價單的展開列表點進來的話query裡就會有contentId
  contentId?: string;
  contractId?: string;
}
// 三個資料來源 quotationId contentId contractId

type TquotationType = 'new' | 'old' | 'newAttachment' | 'oldAttachment' | undefined;

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
  const { id: quotationId, contentId, contractId } = query;

  const userId = userInfo?.employee?.id;

  let quotationType: TquotationType = undefined;

  // ----------------------------------------------------------------------

  let { managerReviewedAt, toSalesAt, toSupervisorAt, toCashierAt, isAttach, isAllReviewedBeforePending } =
    init_variable();

  // ----------------------------------------------------------------------

  // region GET DATA

  const {
    //
    instatnce_getQuotationId3,
    content,
    contractProfile,
    prodArr,
    iterativeContractProductArr,
    prodArrForPDf,
    isQuotationExpired,
    latestSubContract,
    parentSubContract,
  } = useData();

  isAttach = !!iterativeContractProductArr?.length;

  !quotationId && !contentId && (quotationType = 'new');
  quotationId && !contentId && (quotationType = 'old');
  quotationType === 'new' && !!contractId && (quotationType = 'newAttachment');
  quotationType === 'old' && !!iterativeContractProductArr?.length && (quotationType = 'oldAttachment');

  const isOldQuotation = quotationType === 'old' || quotationType === 'oldAttachment';

  const {
    isFetching: isFetching_update,

    raw: quotationData,
    update: update_quotation,
    attachmentArr,
    isDesignatedContent,
    reqReview,
    reqUnlock,
    reqPatchReviewer,
    reqPatchQuotationContent_id_progress,
    reqToPending,
  } = instatnce_getQuotationId3;

  const haveVerifyForm = content?.verifyForm;

  managerReviewedAt = content?.managerReviewedAt;
  toSalesAt = content?.toSalesAt;
  toSupervisorAt = content?.toSupervisorAt;
  toCashierAt = content?.toCashierAt;

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

  const [disabled, setDisabled] = useState(!(quotationType === 'new' || quotationType === 'newAttachment'));
  const [isFetching, setIsFetching] = useState(false);
  const [state_status, setState_status] = useState<TquotationContentDto['status']>('Budget');

  const [showEmployeSelector, setShowEmployeSelector] = useState(false);

  const [reviewFormShow, setReviewFormShow] = useState(false);

  const {
    instance: instance_quotationProduct,
    instance_iterative,
    allProdTotal,
    allProdTotal_iterative,
    theProductTotal,
    calcProductBody,
    doorModelSummery,
    doorModelSummery_reduceModified,
    checkIsIterativeProdValid,
    //
    exportState: exportState_product,
    restoreState: restoreState_product,
  } = useQuotationProduct({
    raw_quotationProductArr: prodArr,
    raw_quotationDiscount: content?.discount,
    iterativeContractProductArr: iterativeContractProductArr,
    disabled,
    onProdAllTotalChange: (prodAllTotal) => {
      handleSetQuotationPriceTotal({
        prodPriceAllTotal: prodAllTotal,
        otherPriceAllTotal: instance_useQuotationOther.calcAllOtherTotalPrice(),
      });
    },
  });

  const {
    avgDiscount,
    quotationDiscount: state_quotationDiscount, // 總折數
  } = instance_quotationProduct;

  const instance_quotationTotalPrice = useQuotationTotalPrice({
    raw_quotationContent: content,
    disabled,
  });
  const {
    state_quotationTotal,
    setQuotationPriceTotal,
    exportState: exportState_quotationTotalPrice,
    restoreState: restoreState_quotationTotalPrice,
  } = instance_quotationTotalPrice;

  const {
    state_profile,
    setState_profile,
    restoreState: restoreState_profile,
  } = useProfile({
    disabled,
    profile: quotationType === 'newAttachment' ? contractProfile : content,
  });

  const {
    annoKitArr,
    annoArr,
    addAnno,
    openSelector: openSelector_anno,
    restoreState: restoreState_anno,
  } = useAnnotations({
    disabled: true,
    raw_remarkArr: content?.annotations,
  });

  const {
    quotationRangeKitArr,
    quotationRangeArr,
    addQuotationRange,
    openSelector: openSelector_qr,
    restoreState: restoreState_quotationRange,
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

  const {
    state: state_payInfo,
    kit: kit_payInfo,

    exportState: exportState_payInfo,
    restoreState: restoreState_payInfo,
  } = usePayInfo({
    disabled,
    raw: content,
  });

  const instance_useQuotationOther = useQuotationOther({
    disabled,
    raw_contentOtherArr: content?.others,
    onOtherPriceAllTotalChange(total) {
      handleSetQuotationPriceTotal({
        // prodPriceAllTotal: instance_quotationProduct.calcProdAllTotal(),
        prodPriceAllTotal: theProductTotal,
        otherPriceAllTotal: total,
      });
    },
  });
  const { state_otherArr, restoreState: restoreState_other } = instance_useQuotationOther;

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------

  const backupState = () => {
    const storageItemName = 'backup-' + (quotationId || contentId || 'newQuotation');

    const {
      state_quotationDiscount,
      prodKeyArr,
      cellKeyArr,
      cellKeyArr_component,
      cellKeyArr_accessory,
      state_prodDict,
      state_iterativeProdDict,
    } = exportState_product();

    const stateForRestore = {
      type: 'quotation',
      backupTime: new Date().toISOString(),

      status: state_status,
      product: {
        state_quotationDiscount,
        prodKeyArr,
        cellKeyArr,
        cellKeyArr_component,
        cellKeyArr_accessory,
        state_prodDict,
        state_iterativeProdDict,
      },
      quotationTotalPrice: exportState_quotationTotalPrice({ exportCopy: false }),
      profile: state_profile,

      annoArr,
      quotationRangeArr,

      payInfo: exportState_payInfo({ exportCopy: false }),
      other: state_otherArr,
    };
    const json = JSON.stringify(stateForRestore);

    window.localStorage.setItem(storageItemName, json);
  };

  const storageItemName = 'backup-' + (quotationId || contentId || 'newQuotation');
  const isBackupAvailable = useMemo(() => {
    return !!window.localStorage.getItem(storageItemName);
  }, [storageItemName]);

  const restoreAllState = !isBackupAvailable
    ? undefined
    : () => {
        // const storageItemName = 'backup-' + (quotationId || contentId || 'newQuotation');
        const json = window.localStorage.getItem(storageItemName)!;

        const restoreAllState = () => {
          const stateForRestore = JSON.parse(json) as {
            type: 'quotation';
            backupTime: string;
            status: TquotationContentDto['status'];
            product: Partial<ReturnType<typeof exportState_product>>;
            quotationTotalPrice: ReturnType<typeof exportState_quotationTotalPrice>;
            profile: Tstate_profile;
            annoArr: typeof annoArr;
            quotationRangeArr: typeof quotationRangeArr;
            payInfo: ReturnType<typeof exportState_payInfo>;
            state_otherArr: typeof state_otherArr;
          };

          setState_status(stateForRestore.status);

          restoreState_product(stateForRestore.product);
          restoreState_quotationTotalPrice(stateForRestore.quotationTotalPrice);

          restoreState_profile(stateForRestore.profile);
          restoreState_anno(stateForRestore.annoArr);
          restoreState_quotationRange(stateForRestore.quotationRangeArr);
          restoreState_payInfo(stateForRestore.payInfo);
          restoreState_other(stateForRestore.state_otherArr);
        };

        setDisabled(false);
        restoreAllState();
      };

  useInterval(backupState, { interval: 5000, stop: disabled });

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------

  // region REQUEST
  //
  //
  //
  //
  //

  const { reqPostQuotation, reqPatchQuotation, reqCloneQuotation, reqModifyQuotation, reqPatchModifiedQuotation } =
    kit_req({
      userId,
      quotationId,
      contractId,
      instance_quotationProduct,
      instance_quotationProduct_iterative: instance_iterative,
      instance_useQuotationOther,
      state_profile,
      state_payInfo,
      annoArr: annoKitArr.map((anno) => anno.value),
      quotationRangeArr: quotationRangeKitArr.map((qr) => qr.value),
      setIsFetching,
      createFileArr,
      update_quotation: async () => {
        await update_quotation();
      },
      setDisabled,
      state_quotationTotal,
      instatnce_getQuotationId3,
      status: state_status,
      calcProductBody,
    });

  // MARK:更新報價單
  const handlePatch = () => {
    const { destroy } = myAlert.input({
      props_input: {
        isTextArea: true,
      },
      title: '報價單註解',
      width: 500,
      onConfirm: async (editNote) => {
        destroy();
        const { newQuotation } = await reqPatchQuotation({ editNote });

        if (newQuotation) {
          const {
            contentId,
            // contractId,
            ...rest
          } = query;
          router.replace({
            query: {
              ...rest,
              status: newQuotation.latestContent.status,
            },
          });
        }
      },
    });
  };

  // MARK:新增報價單
  const handlePost = () => {
    const { destroy } = myAlert.input({
      props_input: {
        isTextArea: true,
      },
      title: '報價單註解',
      width: 500,
      onConfirm: async (editNote) => {
        destroy();
        const { newQuotation } = await reqPostQuotation({ editNote });

        if (newQuotation) {
          const {
            contentId,
            //  contractId,
            ...rest
          } = query;
          router.replace({
            query: {
              ...rest,
              id: newQuotation.id,
              status: newQuotation.latestContent.status,
            },
          });
        }
      },
    });
  };

  // MARK:追加追減報價單
  const handleModify = () => {
    const { destroy } = myAlert.input({
      props_input: {
        isTextArea: true,
      },
      title: '報價單註解',
      width: 500,
      onConfirm: async (editNote) => {
        destroy();
        const newQuotation = await reqModifyQuotation({ editNote });

        if (newQuotation) {
          const { contentId, contractId, ...rest } = query;
          router.replace({
            query: {
              ...rest,
              id: newQuotation.id,
              status: newQuotation.latestContent.status,
            },
          });
          setDisabled(true);
        }
      },
    });
  };

  // MARK:更新追加追減報價單
  const handlePatchModify = () => {
    if (!checkIsIterativeProdValid()) {
      myAlert.warning({ title: '總主產品的剩餘數量低於追加追減數量' });

      return;
    }

    const { destroy } = myAlert.input({
      props_input: {
        isTextArea: true,
      },
      title: '報價單註解',
      width: 500,
      onConfirm: async (editNote) => {
        destroy();
        const newQuotation = await reqPatchModifiedQuotation({ editNote });

        if (newQuotation) {
          update_quotation();
          setDisabled(true);
        }
      },
    });
  };

  // MARK:複製報價單
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

  // MARK:轉為準合約
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
    if (!isOldQuotation) {
      return;
    }

    const reviewSalesEmployeeId = sales?.id ?? null;
    const reviewSupervisorEmployeeId = supervisor?.id ?? null;

    if (content?.status === 'Pending' && !reviewSalesEmployeeId) {
      return myAlert.err({ title: '沒有業務' });
    }

    if (content?.status === 'TempPending') {
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

  const handleSubmit_pending = async () => {
    if (!isOldQuotation) {
      return;
    }

    const body = {};

    reqPatchReviewer({
      body,
    });

    setShowEmployeSelector(false);
  };

  // MARK: 審核
  const handleReview = async () => {
    if (!checkIsIterativeProdValid()) {
      myAlert.warning({ title: '總主產品的剩餘數量低於追加追減數量' });

      return;
    }

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

      if (
        res?.status === 'Contract' // 沒有給status.....
        // 可以這樣判斷是否已被審核完畢並轉為合約
        // content?.status==="Pending" && !!res.managerReviewedAt
        // 但是原本的錯誤一直都沒有被使用者反應，所以決定不修正
      ) {
        // res中沒有contract的id，無法導向到合約頁面
        // router.replace({
        //   pathname: '/domestic/contract/quotation',
        //   query: {
        //     id: res.id,
        //     version: '1',
        //   },
        // });
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

  const preHandleSubmit = () => {
    if (content?.status === 'Pending') {
      if (!haveVerifyForm) {
        myAlert.warning({ title: '請先送出合約審核表' });

        return;
      }

      if (toCashierAt) {
        myAlert.info({ title: '此報價單已經送審' });

        return;
      }

      myAlert.confirm({
        title: '送審後合約審核表將被鎖定',
        content: '建議先確認合約審核表是否正確',
        // props: { width: 450, onOk: reqPatchReviewer_pending, okText: '確定送審', cancelText: '取消' },
        props: {
          width: 450,
          onOk: () => {
            if (!content?.toSupervisorAt) {
              setShowEmployeSelector(true);
            } else {
              handleSubmit_pending();
            }
          },
          okText: '確定送審',
          cancelText: '取消',
        },
      });

      return;
    }

    if (toSalesAt || toSupervisorAt) {
      myAlert.info({ title: '此報價單已經送審，不可以變更業務與業務主管' });
    } else {
      setShowEmployeSelector(true);
    }
  };

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
    attachedProdArr: prodArrForPDf,
    emptySomeProperty: state_status === 'Bidding',
  });

  const { pdfPartProps, show_pdfPart, setShow_pdfPart } = usePdfPart({
    quotationContent: content,
    prodArrForPDf,
  });

  const props_profileForm = createProps_profileForm({
    state_profile,
    setState_profile,
    reqPatchTrackProgressOrProjectProgress: reqPatchQuotationContent_id_progress,
    allowEditClick: isSendToReview,
  });

  const props_payInfo = createProps_payInfo({
    instance_quotationPrice: instance_quotationTotalPrice,
    kit_payInfo,
    state_quotationDiscount,
    disabled,
    avgDiscount,
    isAttach,
  });

  // MARK:
  const { panelList, customeRight } = usePanel({
    disabled,

    // isQuotation,
    // isAttachmentQuotation: isAttach,
    // isNewQuotation,
    // isNewAttachmentQuotation,
    quotationType,

    isReviewer,
    status: content?.status ?? '',
    isDesignatedContent,
    //
    isAllReviewedBeforePending,
    //
    btnEditOnClick: () => {
      setDisabled(false);
    },
    btnCancelOnClick: () => {
      myAlert.confirm({
        title: '確定要取消編輯?',
        content: '所有未儲存的變更將會被捨棄',
        props: {
          onOk: () => {
            setDisabled(true);
          },
        },
      });
    },
    btnPatchOnClick: handlePatch,
    btnPostOnClick: handlePost,
    btnModifyOnClick: handleModify,
    btnPatchModifyOnClick: handlePatchModify,

    cloneQuotation: () => {
      handleClone();
    },
    cloneQuotation_relation: () => {
      handleClone(true);
    },
    handleReqToPending,

    handleReview,
    handleSubmit: preHandleSubmit,
    showVerifyForm: () => setReviewFormShow(true),
    handleReqUnlock,
    //
    showPdf,
    showPdf_noDiscount,
    showPdf_part: () => setShow_pdfPart(true),
    //
    isQuotationExpired,
    quotationExpiredInfo: `報價單建立時的合約版本為${parentSubContract?.version}，但現在最新的版本為${latestSubContract?.version}`,
    //
    restoreAllState: restoreAllState,
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

  let tag = `報價編號 ${content?.quotationNumber}`;
  quotationType === 'new' && (tag = '新增報價單');
  quotationType === 'newAttachment' && (tag = '新增追加追減報價單');

  // const doorSummaryArr = Object.values(doorModelSummery).concat(doorModelSummery_reduceModified);
  const doorSummaryArr = [...doorModelSummery_reduceModified, ...Object.values(doorModelSummery)];

  // ----------------------------------------------------------------------
  // region useEffect
  useEffect(() => {
    update_quotation();
  }, [quotationId]);

  useEffect(() => {
    const status = content?.status || 'Budget';

    setState_status(status);
  }, [content]);

  // MARK: RENDER
  return (
    <SubLayer isLoading_all={isFetching_update || isFetching}>
      <PageHeader02 tag={tag} panelList={panelList} customeLeft={customeLeft} customeRight={customeRight} />

      <div className="relative z-50">
        <QuotationProfile
          disabled={disabled}
          form={props_profileForm}
          quotationNumber={content?.quotationNumber ?? '---'}
          editNotes={content?.editNotes}
          additionRight={
            quotationType === 'newAttachment' ? null : (
              <QuotationStateSel
                key="0"
                quotationState={{ value: state_status, label: quotationStatusLookup[state_status] }}
                setQuotationState={(option) => {
                  setState_status(option.value as TquotationContentDto['status']);
                }}
                history={history}
                isNew={!isOldQuotation}
                disabled={disabled}
              />
            )
          }
        />
        <div className={'ml-[50px]'}>
          <InputSel
            caption={'門型彙總'}
            showBaseline="invisible"
            captionStyle={{ width: '120px' }}
            wrapperStyle={{ padding: '21px 0px 4px 0px', gap: '24px' }}
            node={<DoorSummary list={doorSummaryArr} />}
          />
        </div>

        {/* prod */}
        {/* prod */}
        {/* prod */}
        <br />
        <br />
        {instance_iterative && (
          <>
            <div className={'px-[48px]'}>
              <div className="border border-red-500">
                <span className="inline-block pl-[10px] text-2xl text-main ">合約總主產品</span>
                <QuotationProdTable
                  disabled={true}
                  disabled_iterativeProd={disabled}
                  instance_useQuotationProductInstance={instance_iterative}
                  showQuotationDiscount={false}
                  // isIterativeProd={true}
                  prodTotal={allProdTotal_iterative.toLocaleString()}
                />
              </div>
            </div>
            <br />
            <br />
          </>
        )}

        <div className={'px-[50px]'}>
          <QuotationProdTable
            disabled={disabled}
            instance_useQuotationProductInstance={{ ...instance_quotationProduct }}
            prodTotal={allProdTotal.toLocaleString()}
            // isIterativeProdExist={!!iterativeContractProductArr?.length}
          />
          <br />
          <br />
          <br />
          <QuotationOther disabled={isAttach || disabled} instance_useQuotationOther={instance_useQuotationOther} />
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
              remarkArr={annoKitArr}
              onUpponAddClick={openSelector_anno}
              onAddClick={addAnno}
            />
            <QuotationRemark
              label="報價範圍"
              disabled={disabled}
              remarkArr={quotationRangeKitArr}
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

// ================================================================================

// MARK:useData
const useData = () => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { id: quotationId, contentId, contractId } = query;

  const instatnce_getQuotationId3 = useGetQuotation_id_3(quotationId as string, {
    designatedContentId: contentId,
  });

  const { data: raw_contract, update: update_contract } = useGetContract_id_forAttach(contractId);

  const quotationData = instatnce_getQuotationId3.raw;

  const attachedToContract = quotationData?.attachedToContract || raw_contract;

  const content = quotationData?.designatedContent;

  const { isQuotationExpired, latestSubContract, parentSubContract } = useMemo(() => {
    const result: {
      isQuotationExpired: boolean;
      latestSubContract: TquotationContractDto | undefined;
      parentSubContract: TquotationContractDto | undefined;
    } = {
      isQuotationExpired: false,
      latestSubContract: undefined,
      parentSubContract: undefined,
    };

    if (!attachedToContract?.subContracts.length || !quotationData) {
      return result;
    }

    const subContracts = _.orderBy(attachedToContract.subContracts ?? [], 'version');
    const latestSubContract = subContracts[subContracts.length - 1];
    const latestSubContractCreatedAt = new Date(latestSubContract.createdAt);
    const quotationCreatedAt = new Date(quotationData.createdAt);

    const subContractBelongedArr = subContracts.filter(({ createdAt }) => {
      return quotationCreatedAt > new Date(createdAt);
    });

    const parentSubContract = subContractBelongedArr[subContractBelongedArr.length - 1];

    if (latestSubContractCreatedAt > quotationCreatedAt) {
      result.isQuotationExpired = true;
      result.latestSubContract = latestSubContract;
      result.parentSubContract = parentSubContract;

      return result;
    }

    return result;
  }, [quotationData, attachedToContract]);

  // iterativeContractProductDict為原合約以及所有追加追減合約的主產品迭代後的結果
  const iterativeContractProductDict = useIterativeContractProduct({
    contract: attachedToContract,
    untilVersion: parentSubContract?.version,
  });

  const { iterativeContractProductArr, prodArr } = useMemo(() => {
    const arr = Object.values(iterativeContractProductDict);
    let prodArr = content?.products ? [...content.products] : [];
    prodArr = _.sortBy(prodArr, 'order');

    let parsedProdArr = prodArr.map((_prod) => {
      const prod = { ..._prod, addition: {} } as TprodSource;

      const action = parseProdAction({
        quotationProduct: prod,
        quotationProductArr: prodArr,
      });

      let W: number | `${number}` = calcW({
        WG: prod.WG,
        G: prod.guideRailG || 0, // 若是特殊門，guideRailG應該會是0
      });
      W = new Decimal(W).div(1000).toString() as `${number}`;

      prod.addition.action = action;
      prod.addition.W = W;

      return prod;
    });

    if (!arr.length) {
      return {
        iterativeContractProductArr: undefined,
        prodArr: parsedProdArr,
      };
    }

    const dict = Object.entries(iterativeContractProductDict).reduce((acc, [key, prod]) => {
      const { discount, quotationDiscount } = prod;

      const priceDiscount_percent = calcPriceDiscount_percent({
        prodDiscount: Number(discount || 0),
        quotationDiscount: quotationDiscount,
      });

      let W: number | `${number}` = calcW({
        WG: prod.WG,
        G: prod.guideRailG || 0, // 若是特殊門，guideRailG應該會是0
      });
      W = new Decimal(W).div(1000).toString() as `${number}`;

      acc[key] = {
        ...prod,
        addition: {
          qty_reduce: 0,
          deductedPrice: 0,
          latestIterativeId: prod.latestIterativeId,
          modifyedProduct: {},
          action: undefined,
          quotationDiscount,
          priceDiscount_percent,
          W,
        },
      };

      return acc;
    }, {} as Record<string, TprodSource>);

    const parsedProdArr_modify = parsedProdArr.filter((prod) => prod.addition.action === '變更追加');
    const parsedProdArr_modifyReduce = parsedProdArr.filter((prod) => prod.addition.action === '變更追減');

    parsedProdArr?.forEach((prod) => {
      const action = prod.addition.action;

      if (action === '追減') {
        const rootProd = dict[prod.rootProductId];

        const rootProdQty = rootProd.quantity;
        rootProd.addition.qty_reduce = new Decimal(rootProdQty).sub(prod.quantity).toNumber();
        rootProd.addition.deductedPrice = new Decimal(rootProd.addition.qty_reduce)
          .mul(rootProd.unitPrice)
          .mul(-1)
          .toNumber();
      } else if (action === '變更追減') {
        const attachedToProductId = prod.attachedToProductId;

        const rootProd = dict[prod.rootProductId];
        const rootProdQty = rootProd.quantity;

        const modifyBelong = parsedProdArr_modify.filter((modifyedProd) => {
          return modifyedProd.attachedToProductId === attachedToProductId;
        });

        const qty_modify = modifyBelong
          .reduce((acc, prod) => {
            acc = acc.add(prod.quantity || 0);

            return acc;
          }, new Decimal(0))
          .toNumber();

        rootProd.addition.qty_reduce = new Decimal(rootProdQty).sub(prod.quantity).sub(qty_modify).toNumber();
        rootProd.addition.deductedPrice = new Decimal(rootProd.addition.qty_reduce)
          .add(qty_modify)
          .mul(rootProd.unitPrice)
          .mul(-1)
          .toNumber();
      } else if (action === '變更追加') {
        const attachedToProductId = prod.attachedToProductId;
        const prod_modifyReduce = parsedProdArr_modifyReduce.find(
          (prod) => prod.attachedToProductId === attachedToProductId
        );

        if (!prod_modifyReduce) {
          throw new Error('useData，變更追加找不到對應的變更追減');
        }

        const rootProductId = prod_modifyReduce.rootProductId;
        const rootProd = dict[rootProductId];
        rootProd.addition.modifyedProduct![prod.id] = {
          key: prod.id,
          quantity: prod.quantity,
        };
        prod.addition.rootRootProductKey = rootProductId;
        // const rootProdQty = rootProd.quantity;
      }
      //
    });

    parsedProdArr = parsedProdArr.filter(
      (prod) => prod.addition.action !== '追減' && prod.addition.action !== '變更追減'
    );

    const iterativeContractProductArr = Object.values(dict);

    return { iterativeContractProductArr, prodArr: parsedProdArr };
  }, [iterativeContractProductDict, content?.products]);
  //

  const prodArrForPDf = useMemo(() => {
    let iterativeContractProductArr_modifyed = (iterativeContractProductArr ?? []).filter((prod) => {
      let pass = false;
      const { qty_reduce, modifyedProduct } = prod.addition;
      !!qty_reduce && (pass = true);
      !!Object.keys(modifyedProduct ?? {}).length && (pass = true);

      return pass;
    });

    iterativeContractProductArr_modifyed = _.cloneDeep(iterativeContractProductArr_modifyed);

    iterativeContractProductArr_modifyed = iterativeContractProductArr_modifyed?.map((prod) => {
      const modifyedProduct = prod.addition.modifyedProduct;

      const qty_modify = calcQtyModify({ modifyedProduct: modifyedProduct ?? {} });
      const qty_reduce = prod.addition.qty_reduce;
      prod.quantity = new Decimal(qty_modify)
        .add(qty_reduce || 0)
        .mul(-1)
        .toNumber();

      prod.dualPrice = new Decimal(prod.quantity).mul(prod.price).toNumber();
      // 其實addition.deductionPrice就等於算出來的prod.totalPrice了`，不一樣的話不正常
      prod.totalPrice = new Decimal(prod.quantity).mul(prod.unitPrice).toNumber();

      return prod;
    });

    let prodArrForPDf = [...iterativeContractProductArr_modifyed, ...prodArr];
    prodArrForPDf = prodArrForPDf.map((prod, index) => {
      prod.order = index;

      return prod;
    });

    return prodArrForPDf;
    //
  }, [prodArr, iterativeContractProductArr]);

  // ----------------------------------------------------------------------

  const contractProfile = useMemo(() => {
    if (!raw_contract) {
      return undefined;
    }

    const contractContent = raw_contract.content;

    const defaultProfile: Traw_profile = {
      projectName: contractContent.projectName,
      validityPeriod: contractContent.validityPeriod,
      county: contractContent.county,
      district: contractContent.district,
      address: contractContent.address,
      contactPerson: contractContent.contactPerson,
      contactNumber: contractContent.contactNumber,
      faxNumber: contractContent.faxNumber,
      trackProgress: contractContent.trackProgress,
      projectProgress: contractContent.projectProgress,
      designatedBrand: contractContent.designatedBrand,
      siteManager: contractContent.siteManager,
      siteManagerNumber: contractContent.siteManagerNumber,
      type: contractContent.type,
      isLost: contractContent.isLost,
      customer: contractContent.customer,
      designUnit: contractContent.designUnit,
    };

    return defaultProfile;
  }, [raw_contract]);

  // ----------------------------------------------------------------------

  useEffect(() => {
    // quotation如果並不歸屬於該contract會出問題
    // 所以要確保若是能取得quotation就不取得contract
    if (contractId && !quotationId && !contentId) {
      update_contract();
    }
  }, [quotationId, contentId, contractId]);

  return {
    instatnce_getQuotationId3,
    content,
    attachedToContract,
    contractProfile,
    //
    prodArr,
    iterativeContractProductArr,
    //
    prodArrForPDf,
    //
    isQuotationExpired,
    latestSubContract,
    parentSubContract,
  };
};

export type { TquotationType };
