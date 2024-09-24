// 送了合約審核表就會被鎖定

// 常用變數目錄

// useProductList
// reqUpdateQuotation
// useGetQuotation_id
// fileInfoArr
// reqReview 審核
// reqPatchReviewer 送審
// 編輯審核人員

// 業務與業務主管審核過後，status就會自動轉為Pending

//只是送審，不會被後端鎖住
//有人審核過了就會被後端鎖住
//在Pending狀態會被後端鎖住

// =============================================================
// =============================================================
// =============================================================

// 報價單
import React, { useState, useReducer, useEffect, useContext, useMemo, memo } from 'react';
import { useRouter, NextRouter } from 'next/router';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';
import { AxiosError } from 'axios';

// components
import QuotationProfile, { Tcontrol_profile } from 'components/page/domestic/quotation/quotationProfile';
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
import DoorSummary from 'components/page/domestic/quotation/doorSummary';

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

// css
import style from './quotation.module.scss';

import { AppContext } from 'pages/_app';

// ------------------------------------------------------------------

// utils
import { urlToFile } from 'js/utils/helpers/urlToFile';
import { init_variable, calcNTDToUSD } from 'components/page/domestic/quotation/function/utils_quotation';

// config
import { quotationStatusLookup } from 'config/lookupTable';

// api
import {
  TquotationDto,
  TquotationContentDto,
  TcreateQuotationContentDto,
  // useGetQuotation_id,
  useGetQuotation_id_2,
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
import { useProductList } from 'hooks/quotation/useProduct';
import { useSummary, Tstate_summary } from 'components/page/domestic/quotation/hook/useSummary';

// type
import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';
import { TcreateQuotationProductDto, TcustomerDto } from 'js/api/dtoTypes';

import { checkIsFloat } from 'js/utils/checkValue';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// ------------------------------------------------------------------

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

// ------------------------------------------------------------------

type Tprofile = {
  validityPeriod: string;
  projectName: string;
  county: string;
  district: string;
  address: string;
  contactPerson: string;
  contactNumber: string;
  faxNumber: string;
  trackProgress: string;
  projectProgress: string;
  isLost: boolean;

  //
  designatedBrand: string;
  siteManager: string;
  siteManagerNumber: string;
  requiredDoorType: string;
  requiredDoorQuantity: string;
  estimatedDiscount: string; // number
  scheduledProcurementOrBidDate: Moment | null;
  type: string;
};

type Tquery = {
  id: string | undefined;
  // 從查詢報價單的展開列表點進來的話query裡就會有contentId
  contentId: string | undefined;
  isContract: string | undefined;
};

// type Tstate_summary = {
//   discountRate: string;
//   tuneTotal: string;
//   subTotal: string;
//   salesTax: string;
//   total: string;
//   deliveryLocation: string;
//   deliveryDate: string;
//   exchangeRate: string;
//   usd: string;
// };

type TcustomerSelectorShow = {
  show: boolean;
  isRelationQuotation: boolean | undefined;
};

// ------------------------------------------------------------------

const QuotationProfile_memo = memo(QuotationProfile);
const Summary_memo = memo(Summary);

// ------------------------------------------------------------------
export default function Quotation() {
  const router = useRouter();
  const isReady = router.isReady;

  if (!isReady) {
    return null;
  }

  return <TheQuotation router={router} />;
}

// =================================================================
// =================================================================
// =================================================================

function TheQuotation({ router }: { router: NextRouter }) {
  const {
    id: quotationId, //報價單id //若為新增報價單則為undefined
    // 從查詢報價單的展開列表點進來的話query裡就會有contentId
    contentId,
    isContract,
  } = router.query as Tquery;
  const { userInfo } = useContext(AppContext);
  const userId = userInfo?.employee?.id;
  const isNewQuotation = !quotationId && !contentId;

  // -----------------------------------------------------

  // region  判斷用的參數

  let {
    reviewSalesEmployeeId,
    reviewWorkDirectorEmployeeId,
    reviewCashierEmployeeId,
    reviewSupervisorEmployeeId,
    reviewSalesManagerEmployeeId,
    reviewManagerEmployeeId,
    isReviewer,
    isSales,
    isWorkDirector,
    isCashier,
    isSupervisor,
    isSalesManagerEmployee,
    isManager,
    salesReviewedAt,
    supervisorReviewedAt,
    salesManagerReviewedAt,
    workDirectorReviewedAt,
    cashierReviewedAt,
    managerReviewedAt,
    toSalesAt,
    toSupervisorAt,
    toSalesManagerAt,
    toWorkDirectorAt,
    toCashierAt,
    toManagerAt,
    isSendToReview,
    isSendToReview_pending,
    isAttach,
    isAllReviewedBeforePending,
    version,
    editNotes,
  } = init_variable();

  // -----------------------------------------------------

  // region useState

  const [isLoading, setIsLoading] = useState(false);

  // 是否可編輯
  const [disabled, setDisabled] = useState(!isNewQuotation);

  const [reviewFormShow, setReviewFormShow] = useState(false);
  const [reviewModalShow, setReviewModalShow] = useState(false);
  const [showEmployeSelector, setShowEmployeSelector] = useState(false);

  // const [showPdf, setShowPdf] = useState(false);
  const [showPdf_part, setShowPdf_part] = useState(false);

  const [showMemoModal, setShowMemoModal] = useState(false);

  // __________________________________________________________

  const [taxRate, setTaxRate] = useState(0.05);

  // 複製報價單之客戶狀態
  const [customerSelectorShow, setCustomerSelectorShow] = useReducer(
    (state: TcustomerSelectorShow, action: TcustomerSelectorShow | boolean) => {
      let copy = { ...state };

      if (action === false) {
        copy = {
          show: false,
          isRelationQuotation: undefined,
        };
      } else if (action === true) {
        copy = {
          show: true,
          isRelationQuotation: undefined,
        };
      } else {
        copy = action;
      }

      return copy;
    },
    {
      show: false,
      isRelationQuotation: undefined,
    }
  );

  const [status, setStatus] = useState<TquotationContentDto['status']>('Budget');

  const [customer, setCustomer] = useState<TcustomerDto | undefined | null>();
  const [designUnit, setDesignUnit] = useState<TcustomerDto | undefined | null>();

  const [fileInfoArr, setFileInfoArr] = useState<TfileInfo[]>([]);

  const [state_profile, setState_profile] = useState<Tprofile>(creEmptyProfile());

  const [state_anno, setState_annotation] = useState<string[]>([]);
  const [state_qr, setState_qr] = useState<string[]>([]);

  const { state_summary, setState_summary, clearSummary } = useSummary();

  const [state_paymentMethod, setState_PaymentMethod] = useState<{ milestone: string; totalPaymentRatio: string }[]>(
    []
  );

  const [targetProdKey, setTargetProdKey] = useState<string>('n');

  // -----------------------------------------------------
  // region get Data

  const { data: quotationData, update } = useGetQuotation_id_2(quotationId as string, {
    preBuiltPopulate: ['simple', 'attached'],
  });
  // 沒記錯的話，從查詢報價單點進來會有contentId，就會用quotationContentData
  const {
    data: quotationContentData,
    update: updateContent,
    clearData: clearData_content,
  } = useGetQuotationContent_id(contentId as string);

  const latestContent = quotationData?.latestContent ?? quotationContentData;

  const lastestContentId = latestContent?.id;
  // const status = latestContent?.status;
  const verifyForm = latestContent?.verifyForm;
  const attachedToContract = quotationData?.attachedToContract;

  // 是否為追加減報價單 // 其實在這邊用不到，會導到這個page的都會是一般報價單
  // 追加減報價單會導到 pages/domestic/quotationList/attachQuotation/index.tsx
  isAttach = attachedToContract ? true : undefined;

  const { attachments, updateAttachments, domain } = useQuotation_id_attachments(lastestContentId);

  // ----------------------------------------------------------------------

  // region 身分判斷

  reviewSalesEmployeeId = latestContent?.reviewSalesEmployee?.id;
  reviewWorkDirectorEmployeeId = latestContent?.reviewWorkDirectorEmployee?.id;
  reviewCashierEmployeeId = latestContent?.reviewCashierEmployee?.id;
  reviewSupervisorEmployeeId = latestContent?.reviewSupervisorEmployee?.id;
  reviewSalesManagerEmployeeId = latestContent?.reviewSalesManagerEmployee?.id;
  reviewManagerEmployeeId = latestContent?.reviewManagerEmployee?.id;

  salesReviewedAt = latestContent?.salesReviewedAt;
  supervisorReviewedAt = latestContent?.supervisorReviewedAt;
  salesManagerReviewedAt = latestContent?.salesManagerReviewedAt;
  workDirectorReviewedAt = latestContent?.workDirectorReviewedAt;
  cashierReviewedAt = latestContent?.cashierReviewedAt;
  managerReviewedAt = latestContent?.managerReviewedAt;

  toSalesAt = latestContent?.toSalesAt;
  toSupervisorAt = latestContent?.toSupervisorAt;
  toSalesManagerAt = latestContent?.toSalesManagerAt;
  toWorkDirectorAt = latestContent?.toWorkDirectorAt;
  toCashierAt = latestContent?.toCashierAt;
  toManagerAt = latestContent?.toManagerAt;

  isSendToReview = !!(
    toSalesAt ||
    toSupervisorAt ||
    toSalesManagerAt ||
    toWorkDirectorAt ||
    toCashierAt ||
    toManagerAt
  );
  isSendToReview_pending = !!(toSupervisorAt || toSalesManagerAt || toWorkDirectorAt || toCashierAt || toManagerAt);

  version = latestContent?.version;
  editNotes = latestContent?.editNotes;

  let agentEmployee: TemployeeDto | undefined | null;

  if (!quotationId) {
    agentEmployee = userInfo?.employee;
  } else {
    agentEmployee = latestContent?.agentEmployee;
  }

  if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
    // if (salesReviewedAt && supervisorReviewedAt && salesManagerReviewedAt && managerReviewedAt) {
    //   isAllReviewedBeforePending = true;
    // }
    managerReviewedAt && (isAllReviewedBeforePending = true);
  }

  if (userId) {
    if (userId === reviewSalesEmployeeId && toSalesAt) {
      isSales = true;
      isReviewer = true;
    } else if (userId === reviewSupervisorEmployeeId && toSupervisorAt) {
      if (salesReviewedAt) {
        isSupervisor = true;
        isReviewer = true;
      }
    } else if (userId === reviewSalesManagerEmployeeId && toSalesManagerAt) {
      if (salesReviewedAt && supervisorReviewedAt) {
        isSalesManagerEmployee = true;
        isReviewer = true;
      }
    } else if (userId === reviewWorkDirectorEmployeeId && toWorkDirectorAt) {
      if (
        (salesReviewedAt && supervisorReviewedAt && salesManagerReviewedAt) ||
        // 正常的流程，在這個步驟toSalesManager一定有值，若在這個步驟toSalesManager是null
        // 代表這個content是在SalesManager這個property被加進來之前的content
        (salesReviewedAt && supervisorReviewedAt && !toSalesManagerAt)
      ) {
        isWorkDirector = true;
        isReviewer = true;
      }
    } else if (userId === reviewCashierEmployeeId && toCashierAt) {
      if (salesReviewedAt && supervisorReviewedAt && salesManagerReviewedAt && toWorkDirectorAt) {
        isCashier = true;
        isReviewer = true;
      }
    } else if (
      userId === reviewManagerEmployeeId ||
      // 總經理ID
      userId === '01f55698-49bb-4501-b432-1157a5109554'
    ) {
      if (status !== 'Pending' && salesReviewedAt && supervisorReviewedAt) {
        isManager = true;
        isReviewer = true;
      } else if (
        salesReviewedAt &&
        supervisorReviewedAt &&
        salesManagerReviewedAt &&
        workDirectorReviewedAt &&
        cashierReviewedAt
      ) {
        isManager = true;
        isReviewer = true;
      }
    }
  }

  // 如果是準合約，如果業務與業務主管為同一人，視為業務主管
  // 因為在準合約時業務預設為已審核過(salesReviewedAt不為null)所以可以這樣處理
  if (status === 'Pending') {
    if (userId === reviewSupervisorEmployeeId) {
      isSupervisor = true;
      isSales = false;
      isReviewer = true;
    }
  }

  // --------------------------------------------------------------------------

  // region function

  const uploadAttachment = async (newContentId: string) => {
    // 移除附件
    const theFileInfoArr = fileInfoArr.filter((info) => {
      const { fileId, willDelete, isNew } = info;

      // 如果 fileId 存在、willDelete 為 true 且 isNew 為 false，則移除該元素
      return !(fileId && willDelete && !isNew);
    });
    setFileInfoArr(theFileInfoArr);

    // 現在每個content都是獨立的，因此每次都必須重新上傳舊有的附件
    // 因此以url取得File後上傳
    // 上傳附件
    for (const info of theFileInfoArr) {
      const { fileId, willDelete, isNew, fileSrc } = info;
      let file = info.file;

      if (!file && fileSrc) {
        file = await urlToFile({
          url: fileSrc,
          fileName: info.fileName,
          mimeType: info.fileType,
        });
      }

      // if (fileId || !file || willDelete || !isNew) {
      //   continue;
      // }
      if (!file) {
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        await apiPostQuotation_id_attachments(newContentId, formData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // ____________________________________________________________________
  // ____________________________________________________________________

  const changeProfile = (key: keyof Omit<Tprofile, 'isLost'>, value: string | boolean) => {
    setState_profile((state) => {
      return {
        ...state,
        [key]: value,
      };
    });
  };

  // ____________________________________________________________________
  // ____________________________________________________________________

  const inputModalOnConfirm = (v: string) => {
    if (!v) {
      return myAlert.warning({ title: '請輸入註解' });
    }

    setShowMemoModal(false);
    reqUpdateQuotation({ editNotes: v });
  };

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  // region REQUEST

  const reqUpdateQuotation = async ({ editNotes }: { editNotes: string }) => {
    if (!userId) {
      return myAlert.warning({ title: '沒有使用者ID' });
    }

    if (status === 'Pending') {
      return myAlert.info({ title: '在準合約階段不可以編輯報價單' });
    }

    setIsLoading(true);

    let isGetDetailSpecSuccess = true;

    for (const prod of Object.values(productList)) {
      try {
        await prod.reqGetDetailSpec();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得細部規格失敗', content: err.message });
        isGetDetailSpecSuccess = false;
        setIsLoading(false);
        break;
      }
    }

    if (!isGetDetailSpecSuccess) {
      setIsLoading(false);

      return;
    }

    // 總樘數
    let prodQty = 0;
    let isDoorModalNameEmpty = false;

    // 材料配件有問題的主產品
    let breakComponentProdIndex = '';

    // prodVKeyArr 會在每一次垂直拖拉時更新
    const prodArr: TcreateQuotationProductDto[] =
      prodVKeyArr?.map((key, index) => {
        const prod = productList[key];

        if (!prod.isComponentOk) {
          breakComponentProdIndex = breakComponentProdIndex + `${index + 1} `;
        }

        if (!prod.doorType) {
          isDoorModalNameEmpty = true;
        }

        const quantity = Number(prod.quantity);
        // const originProd = prod.originProd;

        prodQty = prodQty + quantity;

        const preBody = {
          ...prod.body,
          order: index,
        };

        // 不記得當初是為了解決什麼問題才寫這個，但是這個造成了問題了，isEqual似乎恆為true
        // const isEqual = _.isEqual(originProd, preBody);
        // if (!isEqual) {
        //   preBody.id = undefined;
        // }

        // 後端收到id會400錯誤，所以id全部拿掉
        preBody.id = undefined;

        return preBody;
      }) ?? [];

    if (breakComponentProdIndex) {
      setIsLoading(false);

      return myAlert.warning({
        title: '主產品材料配件有誤',
        content: `請檢查第${breakComponentProdIndex}項主產品是否正確`,
      });
    }

    if (isDoorModalNameEmpty) {
      setIsLoading(false);

      return myAlert.warning({ title: '請確認所有主產品都有門型' });
    }

    if (!agentEmployee?.id) {
      setIsLoading(false);

      return myAlert.err({ title: '沒有取得經辦資料', content: '請聯絡開發人員' });
    }

    const emptyBomList: { [key: string]: boolean } = {};
    prodArr.forEach((prod, pIndex) => {
      const componentArr = prod.components;
      componentArr.forEach((com) => {
        const bom = com.bom;

        if (!bom) {
          emptyBomList[pIndex + 1] = true;
        }
      });
    });
    const emptyBomKeyArr = Object.keys(emptyBomList);

    if (emptyBomKeyArr.length > 0) {
      const str = emptyBomKeyArr.join('、');

      myAlert.warning({ title: '上傳失敗', content: `請檢查第${str}項規格是否正確` });
      setIsLoading(false);

      return;
    }

    const body: TcreateQuotationContentDto = {
      // quotationDate: data_watch.quotationDate ?? '',
      // 使用者需求:報價時間應為更新時間，也就會是上傳的時間
      quotationDate: new Date().toISOString(),

      validityPeriod: state_profile.validityPeriod ?? '',
      //
      customerId: customer?.id ?? '',
      //
      projectName: state_profile.projectName ?? '',
      county: state_profile.county ?? '',
      district: state_profile.district ?? '',
      address: state_profile.address ?? '',
      contactPerson: state_profile.contactPerson ?? '',
      contactNumber: state_profile.contactNumber ?? '',
      faxNumber: state_profile.faxNumber ?? '',

      designatedBrand: state_profile.designatedBrand ?? '',
      siteManager: state_profile.siteManager ?? '',
      siteManagerNumber: state_profile.siteManagerNumber ?? '',
      requiredDoorType: doorModelSummary || null,

      // requiredDoorQuantity: state_profile.requiredDoorQuantity ? Number(state_profile.requiredDoorQuantity) : null,
      // estimatedDiscount: state_profile.estimatedDiscount || null,
      // scheduledProcurementOrBidDate:
      //   state_profile.scheduledProcurementOrBidDate &&
      //   moment(state_profile.scheduledProcurementOrBidDate).toISOString(),

      type: state_profile.type ?? '',

      quantity: prodQty ?? 0,
      editNotes: editNotes ?? '',
      status: status ?? 'Budget',
      //
      // agentId: agentEmployee?.id || '',
      agentId: userId,
      //
      //
      annotations: state_anno,
      quotationRanges: state_qr,
      //
      //
      // faxNumber: data_watch.customer?.fax ?? '',
      trackProgress: state_profile.trackProgress ?? '',
      projectProgress: state_profile.projectProgress ?? '',

      discount: `${Number(state_summary.discountRate ?? 0)}` ?? '100',
      averageDiscount: avgDiscount_withQty || null,
      tuneTotal: state_summary.tuneTotal || '0',
      subTotal: Number(state_summary.subTotal.replaceAll(',', '')),
      salesTax: Number(state_summary.salesTax.replaceAll(',', '')),
      total: Number(state_summary.total.replaceAll(',', '')),
      deliveryLocation: state_summary.deliveryLocation,
      deliveryDate: state_summary.deliveryDate,
      paymentMethods: state_paymentMethod,
      exchangeRate: state_summary.exchangeRate,
      usd: state_summary.usd.replaceAll(',', ''),

      //
      products: prodArr,
      others: getOthersPostBodyArr(),
      // productsOrder: null,
      //
      isLost: state_profile.isLost,
      //
      designUnitId: designUnit?.id ?? null,
    };

    if (!body.customerId) {
      setIsLoading(false);

      return myAlert.warning({ title: '請選擇客戶' });
    }

    if (!body.deliveryDate) {
      body.deliveryDate = null;
    }

    try {
      setIsLoading(true);

      if (quotationId) {
        const res = await apiPatchQuotation(body, quotationId);

        await uploadAttachment(res.latestContent.id);

        const query = { ...router.query };
        delete query.contentId;

        router.push({
          query: {
            ...query,
            status: status,
          },
        });

        await Promise.all([update(), updateAttachments()]);
        clearData_content();
      } else {
        const res = await apiPostQuotation(body);

        await uploadAttachment(res.latestContent.id);

        router.push({
          query: {
            id: res.id,
            // status: data_watch.status,
          },
        });
      }

      setDisabled(true);
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '更新報價單失敗', content: err.message });
    } finally {
      setIsLoading(false);
      showRootLoading(false);
    }
  }; // reqUpdateQuotation

  // ____________________________________________________________________
  // ____________________________________________________________________

  const reqReview = async (isPass: boolean) => {
    if (!quotationId || !isReviewer) {
      return;
    }

    const body = {
      reviewSalesEmployeeId: isSales ? userId : null,
      reviewSupervisorEmployeeId: isSupervisor ? userId : null,
      reviewSalesManagerEmployeeId: isSalesManagerEmployee ? userId : null,
      reviewWorkDirectorEmployeeId: isWorkDirector ? userId : null,
      reviewCashierEmployeeId: isCashier ? userId : null,
      reviewManagerEmployeeId: isManager ? userId : null,
      reviewResult: isPass,
    };

    if (status === 'Pending' && !verifyForm) {
      if (isPass) {
        return myAlert.warning({ title: '請先送出合約審核表' });
      }
    }

    if (status === 'Pending') {
      if (
        !reviewSalesEmployeeId ||
        !reviewWorkDirectorEmployeeId ||
        !reviewCashierEmployeeId ||
        !reviewSupervisorEmployeeId ||
        !reviewSalesManagerEmployeeId
      ) {
        return myAlert.warning({ title: '請先設定所有審核人員' });
      }
    }

    if (isSales && salesReviewedAt && body.reviewResult) {
      return myAlert.warning({ title: '您已經審核過此報價單' });
    } else if (isSupervisor && supervisorReviewedAt && body.reviewResult) {
      return myAlert.warning({ title: '您已經審核過此報價單' });
    } else if (isSalesManagerEmployee && salesManagerReviewedAt && body.reviewResult) {
      return myAlert.warning({ title: '您已經審核過此報價單' });
    } else if (isWorkDirector && workDirectorReviewedAt && body.reviewResult) {
      return myAlert.warning({ title: '您已經審核過此報價單' });
    } else if (isCashier && cashierReviewedAt && body.reviewResult) {
      return myAlert.warning({ title: '您已經審核過此報價單' });
    } else if (isManager && managerReviewedAt && body.reviewResult) {
      return myAlert.warning({ title: '您已經審核過此報價單' });
    }

    try {
      setIsLoading(true);
      const res = await apiQuotationReview({ id: quotationId, body });

      if (res.status === 'Contract') {
        // router.push({
        //   pathname: '/domestic/contract',
        // });

        router.back();
      } else {
        await update();
      }
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '審核發生錯誤', content: err.message });
      console.log(error);
    } finally {
      setIsLoading(false);
      setReviewModalShow(false);
    }
  };

  // ____________________________________________________________________
  // ____________________________________________________________________

  const reqUnlock = async () => {
    if (!quotationId) {
      return;
    }

    try {
      setIsLoading(true);
      await apiQuotationUnlock(quotationId);
      await update();
      myAlert.success({ title: '解除鎖定成功', content: '該報價單改為發包' });
      router.replace({
        query: {
          ...router.query,
          status: 'Contracting',
        },
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      myAlert.err({ title: '解除鎖定發生錯誤', content: err.response?.data.message });
    } finally {
      setIsLoading(false);
    }
  };

  // ____________________________________________________________________
  // ____________________________________________________________________
  // 送審
  const reqPatchReviewer = async ({
    sales,
    supervisor,
  }: {
    sales: TemployeeDto | undefined;
    supervisor: TemployeeDto | undefined;
  }) => {
    if (!quotationId) {
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

    try {
      setIsLoading(true);
      await apiQuotationSubmitReview(quotationId, {
        reviewSalesEmployeeId,
        reviewSupervisorEmployeeId,
      });
      await update();
      // setDisabled_reviewer(true);
      setShowEmployeSelector(false);
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '更新審核人員失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 轉為準合約
  const reqToPending = async () => {
    if (!latestContent) {
      return;
    }

    if (!isAllReviewedBeforePending) {
      myAlert.info({ title: '此報價單尚未審核完畢' });

      return;
    }

    if (status === 'Pending') {
      myAlert.info({ title: '此報價單已經是準合約' });
    }

    if (status === 'Contract') {
      myAlert.info({ title: '此報價單已是合約' });
    }

    try {
      setIsLoading(true);
      await apiPatchQuotationToPending({ contentId: latestContent.id });
      await update();
      router.replace({
        query: {
          ...router.query,
          status: 'Pending',
        },
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // 複製報價單
  const reqCopyQuotation = async ({ customerId }: { customerId: string | undefined }) => {
    if (!quotationId) {
      myAlert.info({ title: '無報價單編號' });

      return;
    }

    if (!customerId) {
      myAlert.info({ title: '請選擇複製報價單之客戶' });

      return;
    }

    try {
      setIsLoading(true);
      const res = await apiPostCopyQuotation({
        quotationId,
        customerId,
        isRelationQuotation: customerSelectorShow.isRelationQuotation || false,
      });

      if (res) {
        router.replace({
          query: {
            ...router.query,
            id: res.id,
          },
        });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // apiPatchQuotationContent_id_Progress

  const reqPatchQuotationContent_id_progress = async ({
    trackProgress,
    projectProgress,
  }: {
    trackProgress?: string | null;
    projectProgress?: string | null;
  }) => {
    const contentId = latestContent?.id;

    if (!contentId) {
      return;
    }

    try {
      setIsLoading(true);

      const res = await apiPatchQuotationContent_id_progress(contentId, {
        trackProgress,
        projectProgress,
      });

      return res;
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  // region use Hook
  //
  //
  //
  //

  // region !!! useProductList !!!

  const {
    productList,
    prodCellConfig,
    prodKeyArr,
    prodVKeyArr,
    setProdVKeyArr,
    addProd,
    changeProdKeyArr,
    //
    comKeyArr,
    comCellConfig,
    changeComKeyArr,
    comVKeyArr,
    //
    accessoriesKeyArr,
    changeAccessoriesKeyArr,
    accessoriesCellConfig,
    //
    othersKeyArr,
    othersList,
    othersCellConfig,
    changeOthersKeyArr,
    addOthers,
    getOthersPostBodyArr,
    //
    subTotal: quotationProdSubTotal,
    reset: resetClass,
    //
    calcSubTotalPrice,
    // changeAllProdQuotationDiscount,
    // changeAllProductDiscount,
    // avgDiscount,
    avgDiscount_withQty,
    //
    doorModelSummary,
  } = useProductList({
    // productArr: quotationData?.latestContent.products,
    // others: quotationData?.latestContent.others,
    productArr: latestContent?.products,
    others: latestContent?.others,
    averageDiscount: latestContent?.averageDiscount,
    resetTrigger: quotationData ?? quotationContentData,
    // onDoorTypeChange: onDoorTypeChange, // 棄用
    discount_fromData: Number(latestContent?.discount ?? 0),
    quotationDiscount: Number(state_summary.discountRate || '100'),
  });

  const targetProd = productList[targetProdKey];

  const comList = useMemo(() => {
    return { ...targetProd?.comList, ...targetProd?.subComList };
  }, [targetProd?.comList, targetProd?.subComList]);

  // __________________________________________________________________________
  // __________________________________________________________________________

  const {
    visible: pdfModalVisible,
    setVisible: setPdfModalVisible,
    pdfData,
  } = useModalQuotationPdf({
    quotationContent: latestContent,
    emptySomeProperty: status === 'Bidding',
  });

  // --------------------------------------------------------------------------

  // region props

  const control_anno: TsummaryControl = useMemo(() => {
    const control_anno: TsummaryControl = {
      stringArr: state_anno,
      editString: (index, v) => {
        setState_annotation((state) => {
          const copy = [...state];
          copy[index] = v;

          return copy;
        });
      },
      addString: (v: string) => {
        setState_annotation((state) => {
          const copy = [...state];
          copy.push(v);

          return copy;
        });
      },
      delString: (index: number) => {
        setState_annotation((state) => {
          const copy = [...state];
          copy.splice(index, 1);

          return copy;
        });
      },
      addStrArr: (vArr: string[]) => {
        setState_annotation((state) => {
          const copy = [...state];
          copy.push(...vArr);

          return copy;
        });
      },
      replaceStrArr: (strArr: string[]) => {
        setState_annotation(strArr);
      },
    };

    return control_anno;
  }, [state_anno]);

  const control_qr: TsummaryControl = useMemo(() => {
    const control_qr: TsummaryControl = {
      stringArr: state_qr,
      editString: (index, v) => {
        setState_qr((state) => {
          const copy = [...state];
          copy[index] = v;

          return copy;
        });
      },
      addString: (v: string) => {
        setState_qr((state) => {
          const copy = [...state];
          copy.push(v);

          return copy;
        });
      },
      delString: (index: number) => {
        setState_qr((state) => {
          const copy = [...state];
          copy.splice(index, 1);

          return copy;
        });
      },
      addStrArr: (vArr: string[]) => {
        setState_qr((state) => {
          const copy = [...state];
          copy.push(...vArr);

          return copy;
        });
      },
      replaceStrArr: (strArr: string[]) => {
        setState_qr(strArr);
      },
    };

    return control_qr;
  }, [state_qr]);

  // ____________________________________________________________________
  // ____________________________________________________________________

  const control_profile = useMemo(() => {
    const control_profile: Tcontrol_profile = {
      quotationNumber: latestContent?.quotationNumber ?? '',
      quotationDate: latestContent?.quotationDate ?? '',
      customer: {
        value: customer,
        onChange: (customer) => {
          const customerPhoneNumber = customer.phone || '';
          const contact = customer.contacts?.[0];
          const name = contact?.name ?? '';
          const phone = contact?.phone || customerPhoneNumber || '';
          const fax = customer.fax || '';

          setCustomer(customer);
          changeProfile('contactPerson', `${name}`);
          changeProfile('contactNumber', phone);
          changeProfile('faxNumber', fax);
        },
        onClear: () => {
          setCustomer(null);
          changeProfile('contactPerson', '');
          changeProfile('contactNumber', '');
          changeProfile('faxNumber', '');
        },
      },
      designUnit: {
        value: designUnit,
        onChange: (customer) => setDesignUnit(customer),
        onClear: () => setDesignUnit(null),
      },

      isLost: {
        value: state_profile.isLost,
        onChange: (bool) => {
          setState_profile((state) => ({ ...state, isLost: bool }));
        },
      },

      itemList: {
        validityPeriod: {
          value: state_profile.validityPeriod,
          onChange: (v) => changeProfile('validityPeriod', v),
        },
        projectName: {
          value: state_profile.projectName,
          onChange: (v) => changeProfile('projectName', v),
        },
        county: {
          value: state_profile.county,
          onChange: (v) => {
            changeProfile('county', v);
            changeProfile('district', '');
          },
        },
        district: {
          value: state_profile.district,
          onChange: (v) => changeProfile('district', v),
        },
        address: {
          value: state_profile.address,
          onChange: (v) => changeProfile('address', v),
        },
        contactPerson: {
          value: state_profile.contactPerson,
          onChange: (v) => changeProfile('contactPerson', v),
        },
        contactNumber: {
          value: state_profile.contactNumber,
          onChange: (v) => changeProfile('contactNumber', v),
        },
        faxNumber: {
          value: state_profile.faxNumber,
          onChange: (v) => changeProfile('faxNumber', v),
        },

        designatedBrand: {
          value: state_profile.designatedBrand,
          onChange: (v) => {
            changeProfile('designatedBrand', v);
          },
        },
        siteManager: {
          value: state_profile.siteManager,
          onChange: (v) => {
            changeProfile('siteManager', v);
          },
        },
        siteManagerNumber: {
          value: state_profile.siteManagerNumber,
          onChange: (v) => {
            changeProfile('siteManagerNumber', v);
          },
        },
        requiredDoorType: {
          value: state_profile.requiredDoorType,
          onChange: (v) => {
            changeProfile('requiredDoorType', v);
          },
        },
        requiredDoorQuantity: {
          value: state_profile.requiredDoorQuantity,
          onChange: (v) => {
            changeProfile('requiredDoorQuantity', v);
          },
        },
        estimatedDiscount: {
          value: state_profile.estimatedDiscount,
          onChange: (v) => {
            changeProfile('estimatedDiscount', v);
          },
        },
        type: {
          value: state_profile.type,
          onChange: (v) => {
            changeProfile('type', v);
          },
        },
        scheduledProcurementOrBidDate: {
          value: state_profile.scheduledProcurementOrBidDate,
          onChange: (v) => {
            setState_profile((state) => ({ ...state, scheduledProcurementOrBidDate: v }));
          },
        },

        //
        trackProgress: {
          value: state_profile.trackProgress,
          onChange: (v) => {
            !disabled && changeProfile('trackProgress', v);
          },
          // onChange: isSendToReview
          //   ? undefined
          //   : (v) => {
          //       !isSendToReview && changeProfile('trackProgress', v);
          //     },

          onClick:
            !isSendToReview || !disabled
              ? undefined
              : () => {
                  const modal = myAlert.input({
                    title: '追蹤進度',
                    placeholder: '追蹤進度',
                    defaultValue: state_profile.trackProgress,
                    isTextArea: true,
                    width: 656,
                    onConfirm: async (v) => {
                      const res = await reqPatchQuotationContent_id_progress({
                        trackProgress: v,
                      });

                      if (res) {
                        const trackProgress = res.trackProgress;
                        changeProfile('trackProgress', trackProgress);
                        modal.destroy();
                      }
                    },
                  });
                },
          disabled: isSendToReview ? false : undefined,
        },
        projectProgress: {
          value: state_profile.projectProgress,

          onChange: (v) => {
            !disabled && changeProfile('projectProgress', v);
          },
          // onChange: isSendToReview
          //   ? undefined
          //   : (v) => {
          //       !isSendToReview && changeProfile('projectProgress', v);
          //     },
          onClick:
            !isSendToReview || !disabled
              ? undefined
              : () => {
                  const modal = myAlert.input({
                    title: '工程進度',
                    placeholder: '工程進度',
                    defaultValue: state_profile.projectProgress,
                    isTextArea: true,
                    width: 656,
                    onConfirm: async (v) => {
                      const res = await reqPatchQuotationContent_id_progress({
                        projectProgress: v,
                      });

                      if (res) {
                        const projectProgress = res.projectProgress;
                        changeProfile('projectProgress', projectProgress);
                        modal.destroy();
                      }
                    },
                  });
                },
          disabled: isSendToReview ? false : undefined,
        },
      },
    };

    return control_profile;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state_profile, designUnit]);

  // ____________________________________________________________________
  // ____________________________________________________________________

  const appendixParams = useMemo(() => {
    const removeFileInfo = (index: number) => {
      fileInfoArr[index].willDelete = true;
      setFileInfoArr([...fileInfoArr]);
      // removeFile(index)
    };

    const toSetFileInfo = (newImgInfoArr: TfileInfo[]) => {
      setFileInfoArr([...newImgInfoArr]);
    };

    return {
      fileInfoArr,
      removeFileInfo,
      toSetFileInfo,
    };
  }, [fileInfoArr]);

  // ____________________________________________________________________
  // ____________________________________________________________________

  const payInfoControl: TpayInfoControl = useMemo(() => {
    const payInfoControl: TpayInfoControl = {
      payment: {
        haveTax: {
          value: !!taxRate,
          onChange: (v) => {
            if (quotationProdSubTotal === '') {
              calcSubTotalPrice();
            }

            setTaxRate(v ? 0.05 : 0);
          },
        },

        discountRate: {
          inputAttr: {
            // disabled: disabled,
            disabled: true,
            value: state_summary.discountRate,
            onChange: (e) => {
              // // 如果quotationProdSubTotal為空字串會算出錯誤的值，
              // // 所以必須先計算出quotationProdSubTotal
              // if (quotationProdSubTotal === '') {
              //   calcSubTotalPrice();
              // }
              // let v = e.target.value;
              // if ((v as string) === '') {
              //   v = '0';
              // }
              // if (Number(v) > 500) {
              //   v = '500';
              // }
              // setSummary((state) => {
              //   const copy = { ...state };
              //   if (v.split('.')[1]?.length > 3) {
              //     return copy;
              //   }
              //   copy.discountRate = v;
              //   // changeAllProdQuotationDiscount(Number(v));
              //   // changeAllProductDiscount(Number(v));
              //   return copy;
              // });
            },
          },
        },
        tuneTotal: {
          inputAttr: {
            disabled,
            value: state_summary.tuneTotal,
            placeholder: '範圍正負1000',
            onChange: (e) => {
              const value_num = Number(e.target.value);

              if (Math.abs(value_num) > 1000) {
                return;
              }

              setState_summary((state) => ({
                ...state,
                tuneTotal: e.target.value,
              }));
            },
          },
        },
        subTotal: {
          inputAttr: {
            disabled: true,
            value: state_summary.subTotal,
          },
        },
        salesTax: {
          inputAttr: {
            disabled: true,
            value: state_summary.salesTax,
          },
        },
        total: {
          inputAttr: {
            disabled: true,
            value: state_summary.total,
          },
        },
      },

      delivery: {
        deliveryLocation: {
          value: state_summary.deliveryLocation,
          onChange: (v) => {
            setState_summary((state) => {
              const copy = { ...state };
              copy.deliveryLocation = v;

              return copy;
            });
          },
        },
        deliveryDate: {
          value: state_summary.deliveryDate,
          onChange: (v) => {
            setState_summary((state) => {
              const copy = { ...state };
              copy.deliveryDate = v;

              return copy;
            });
          },
        },
      },
      paymentMethod: {
        arr: state_paymentMethod.map((item, index) => {
          const { milestone, totalPaymentRatio } = item;

          const onChangeMilestone = (v: string) => {
            setState_PaymentMethod((state) => {
              const copy = [...state];
              copy[index].milestone = v;

              return copy;
            });
          };

          const onChange = (v: string) => {
            if (v === '') {
              v = '0';
            }

            setState_PaymentMethod((state) => {
              const copy = [...state];
              copy[index].totalPaymentRatio = v;

              return copy;
            });
          };

          const delSelf = () => {
            setState_PaymentMethod((state) => {
              const copy = [...state];
              copy.splice(index, 1);

              return copy;
            });
          };

          return {
            label: milestone,
            value: totalPaymentRatio === '0' ? '' : totalPaymentRatio,
            onChange,
            onChangeMilestone,
            delSelf,
          };
          //
        }),
        addMethod: (v) => {
          setState_PaymentMethod((state) => {
            const copy = [...state];
            copy.push({ milestone: v, totalPaymentRatio: '0' });

            return copy;
          });
        },
      },

      exchangeRate: {
        value: state_summary.exchangeRate,
        onChange: (v) => {
          setState_summary((state) => {
            const copy = { ...state };
            copy.exchangeRate = v;

            const total_num = copy.total.replaceAll(',', '') as `${number}`;

            copy.usd = calcNTDToUSD({
              NTD: total_num,
              USDtoNTD: (copy.exchangeRate || '0') as `${number}`,
            }).toLocaleString();

            return copy;
          });
        },
      },
      usd: {
        value: state_summary.usd,
      },
    };

    return payInfoControl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    calcSubTotalPrice,
    state_paymentMethod,
    quotationProdSubTotal,
    // summary.deliveryDate,
    // summary.deliveryLocation,
    // summary.discountRate,
    // summary.salesTax,
    // summary.subTotal,
    // summary.total,
    state_summary,
    taxRate,
  ]);
  // ____________________________________________________________________
  // ____________________________________________________________________

  const { control_signature, defaultSeletedDataArrArr, dynaSelectorPropsList } = useMemo(() => {
    const signatureArr: Tcontrol_signatureBar['signatureArr'] = [
      {
        label: '總經理',
        value: quotationData?.latestContent.reviewManagerEmployee?.chName,
        style: { width: '180px' },
        isReviewed: !!quotationData?.latestContent.managerReviewedAt,
      },
      {
        label: '應收帳款',
        value: quotationData?.latestContent.reviewCashierEmployee?.chName,
        style: { width: '180px' },
        isReviewed: !!quotationData?.latestContent.cashierReviewedAt,
      },
      {
        label: '應收帳款',
        value: quotationData?.latestContent.reviewWorkDirectorEmployee?.chName,
        style: { width: '180px' },
        isReviewed: !!quotationData?.latestContent.workDirectorReviewedAt,
      },
      {
        label: '業務經理',
        value: quotationData?.latestContent.reviewSalesManagerEmployee?.chName,
        style: { width: '180px' },
        isReviewed: !!quotationData?.latestContent.salesManagerReviewedAt,
      },
      {
        label: '業務主管',
        value: quotationData?.latestContent.reviewSupervisorEmployee?.chName,
        style: { width: '180px' },
        isReviewed: !!quotationData?.latestContent.supervisorReviewedAt,
      },
      {
        label: '業務',
        value: quotationData?.latestContent.reviewSalesEmployee?.chName,
        style: { width: '180px' },
        isReviewed: !!quotationData?.latestContent.salesReviewedAt,
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
      quotationData?.latestContent.reviewSalesEmployee ? [quotationData.latestContent.reviewSalesEmployee] : undefined,
      quotationData?.latestContent.reviewSupervisorEmployee
        ? [quotationData.latestContent.reviewSupervisorEmployee]
        : undefined,
    ];

    const dynaSelectorPropsList: Parameters<typeof EmployeeSelectorGroup>[0]['dynaSelectorPropsList'] = [{}, {}];

    if (status === 'TempPending' && dynaSelectorPropsList[1]) {
      dynaSelectorPropsList[1].isSkip = true;
    }

    if (status === 'Pending' && dynaSelectorPropsList[0]) {
      dynaSelectorPropsList[0].isSkip = true;
    }

    return { control_signature, defaultSeletedDataArrArr, dynaSelectorPropsList };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, quotationData?.latestContent]);

  // ____________________________________________________________________
  // ____________________________________________________________________

  const pdfPartProps: TmainProduct[] = Object.values(productList).map((prod) => {
    const lw = new Decimal(prod.fullWidth || 0).mul(100).toNumber();
    const h = new Decimal(prod.height || 0).mul(100).toNumber();
    const b = new Decimal(prod.boxB || 0).mul(100).toNumber();
    const bounceDoorWidth = prod.bounceDoorWidth_cm;
    const bounceDoorWidth_formated = bounceDoorWidth ? `＋${bounceDoorWidth}` : '';

    const size = `${lw}${bounceDoorWidth_formated} X ${h} + ${b}`;

    const list_com = { ...prod.comList, ...prod.subComList };

    if (list_com.sidePlate?.totalPrice === '0') {
      delete list_com['sidePlate'];
    }

    delete list_com['motorAccessories'];

    const list_acce = prod.accessoriesList;

    const componentArr = Object.values(list_com ?? {});

    let totalPrice = 0;

    const part: Tpart[] = componentArr.map((com) => {
      totalPrice += Number(com.totalPrice || 0);

      let unit_str = '';

      if (typeof com.unit === 'object') {
        unit_str = 'm\u00B2'; // m2
      } else {
        unit_str = com.unit as string;
      }

      let desc = com.desc ?? '';

      if (com.comName === '門箱') {
        desc = desc.replaceAll('捲+機', '');
        desc = desc.replaceAll('方型捲箱', '');
      }

      return {
        partName: com.comName,
        material: com.material,
        unit: com.unit,
        unit_str,
        qty: new Decimal(com.quantity || 0).toFixed(2),
        desc,
        price: com.unitPrice_locale,
        totalPrice: Number(com.totalPrice || 0).toLocaleString(),
      };
    });

    const part_acce: Tpart[] = Object.values(list_acce).map((acce) => {
      totalPrice += Number(acce.totalPrice || 0);

      let unit_str = '';

      if (typeof acce.unit === 'object') {
        unit_str = 'm\u00B2'; // m2
      } else {
        unit_str = acce.unit as string;
      }

      const partName = acce.name.replaceAll('60A', '');

      return {
        partName,
        material: '',
        unit: acce.unit,
        unit_str,
        // FIXME 型別為number，但實際上為string
        // hooks/quotation/classAccessories.tsx // get quantity
        // qty: Number(acce.quantity).toFixed(2),
        qty: new Decimal(acce.quantity || 0).toFixed(2),
        price: acce.unitPrice_locale,
        desc: '',
        totalPrice: acce.totalPrice_locale,
      };
    });

    return {
      quotationNumber: latestContent?.quotationNumber || '無報價編號',
      category: prod.itemName,
      material: prod.material,
      surface: prod.surface,
      doorType: prod.doorType,
      size: size,
      part: [...part, ...part_acce],
      // priceTotal: totalPrice.toLocaleString(),
      priceTotal: totalPrice.toLocaleString(),
    };
  });

  // ____________________________________________________________________
  // ____________________________________________________________________

  // region layer props

  const tagList: TtagList = [
    {
      label: quotationId ? `報價編號 ${latestContent?.quotationNumber || ''}` : '新報價單',
      onClick: () => {},
    },
  ];

  const VersionLabel = () => {
    return (
      <div className="ml-2 mb-1 mt-auto">
        <div>版本 : {version}</div>
        <div>
          {/* 總計 : {latestContent?.total ? latestContent.total.toLocaleString() : ''} */}
          小計 : {state_summary.subTotal}　 營業稅: {state_summary.salesTax}　 總計 : {state_summary.total}
          {/*  */}
        </div>
      </div>
    );
  };

  const customeLeft: React.ReactNode[] = [<VersionLabel key="0" />];

  const history = useMemo(() => {
    let content = quotationData?.contents ?? [];

    if (content) {
      content = _.sortBy(content, (item) => item.createdAt);
    }

    return content.map((item, index, arr) => {
      const { status, quotationDate, createdAt } = item;
      const preStatus = arr[index - 1]?.status;

      return {
        state_from: quotationStatusLookup[preStatus] ?? '建立',
        state_to: quotationStatusLookup[status] ?? '',
        isoString: moment(createdAt).toISOString(),
      };
    });
  }, [quotationData]);

  const panel_editable: TpanelList = [
    {
      // 報價/歷史狀態狀態
      custom: (
        <QuotationStateSel
          quotationState={{ value: status, label: quotationStatusLookup[status] }}
          setQuotationState={(option) => {
            setStatus(option.value as TquotationContentDto['status']);
          }}
          history={history}
          isNew={isNewQuotation}
        />
      ),
    },
    { type: 'redButton', label: '上傳', onClick: () => setShowMemoModal(true) },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
        resetClass();
        setTargetProdKey('n');
      },
    },
  ];

  const panel_noEditable: TpanelList = [
    isAllReviewedBeforePending && quotationId
      ? {
          type: 'redButton',
          label: '轉為準合約',
          onClick: () => {
            myAlert.confirm({
              title: '確定轉為準合約',
              props: {
                onOk: () => {
                  reqToPending();
                },
              },
            });
          },
        }
      : null,
    // {
    //   type: 'myButton',
    //   label: '匯出報價單',
    //   img: iconUpload.src,
    //   // onClick: () => setShowPdf(true),

    //   onClick: () => setPdfModalVisible(true),
    // },
    // {
    //   type: 'myButton',
    //   label: '單價分析',
    //   img: iconUpload.src,
    //   onClick: () => {
    //     setShowPdf_part(true);
    //   },
    // },

    !contentId && isReviewer
      ? {
          type: 'myButton',
          label: '審核',
          onClick: () => setReviewModalShow(true),
        }
      : null,

    !contentId && quotationId
      ? {
          type: 'myButton',
          label: '送審',
          onClick: () => {
            if (status === 'Pending' && !verifyForm) {
              return myAlert.warning({ title: '請先送出合約審核表' });
            }

            if (status === 'Pending' && toSupervisorAt) {
              myAlert.info({ title: '此報價單已經送審，不可以變更審核人員' });
            } else if (status !== 'Pending' && (toSalesAt || toSupervisorAt)) {
              myAlert.info({ title: '此報價單已經送審，不可以變更業務與業務主管' });
            } else {
              setShowEmployeSelector(true);
            }

            if (status === 'Pending') {
              myAlert.info({
                title: '送審後合約審核表將被鎖定',
                content: '建議先確認合約審核表是否正確',
                props: { width: 450 },
              });
            }
          }, // onClick close
        }
      : null,

    !contentId && status === 'Pending'
      ? { type: 'myButton', label: '合約審核表', onClick: () => setReviewFormShow(true) }
      : null,

    // !contentId && status !== 'Pending' ? { type: 'myButton', label: '編輯', onClick: () => setDisabled(false) } : null,
    /*!isSendToReview && */ /*!contentId &&*/ !isContract && status !== 'Pending'
      ? { type: 'myButton', label: '編輯', onClick: () => setDisabled(false) }
      : null,

    // !contentId && status === 'Bidding'
    // !contentId && (status === 'Budget' || status === 'Bidding' || status === 'Contracting')
    //   ? {
    //       type: 'myButton',
    //       label: '複製報價單',
    //       onClick: () => {
    //         myAlert.confirm({
    //           title: '確定複製報價單?',
    //           props: {
    //             onOk: () => {
    //               setCustomerSelectorShow(true);
    //             },
    //           },
    //         });
    //       },
    //     }
    //   : null,

    status === 'Pending' || status === 'TempPending'
      ? {
          type: 'myButton',
          label: '解除鎖定並退回發包',
          img: iconRedLock.src,
          onClick: () => {
            myAlert.confirm({
              title: '確定要解除鎖定?',
              content: '此報價單將需要重新送審並回到發包狀態',
              props: {
                onOk: () => {
                  reqUnlock();
                },
              },
            });
          },
        }
      : null,

    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        if (window.history.length === 1) {
          router.push({
            pathname: '/domestic/quotationList',
            query: {
              status: latestContent?.status,
            },
          });
        } else {
          router.back();
        }
      },
    },
  ];

  // const panel_editReviewer: TpanelList = [
  //   {
  //     type: 'redButton',
  //     label: '送審',
  //     onClick: () => reqPatchReviewer(),
  //   },
  //   {
  //     type: 'myButton',
  //     label: '取消',
  //     onClick: () => setDisabled_reviewer(true),
  //   },
  // ];

  const panelList = (() => {
    // if (!disabled_reviewer) {
    //   return panel_editReviewer;
    // }

    if (disabled) {
      return panel_noEditable;
    } else {
      return panel_editable;
    }
  })();

  const customeRight = [
    !contentId && (status === 'Budget' || status === 'Bidding' || status === 'Contracting') ? (
      <Dropdown
        key="0"
        // placement="bottomRight"
        itemArr={[
          //
          <MyButton_v2 key="1" onClick={() => setCustomerSelectorShow(true)}>
            一般複製
          </MyButton_v2>,
          <MyButton_v2
            key="2"
            onClick={() =>
              setCustomerSelectorShow({
                show: true,
                isRelationQuotation: true,
              })
            }
          >
            關聯報價
          </MyButton_v2>,
        ]}
      >
        複製報價單
      </Dropdown>
    ) : null,

    <Dropdown
      key="1"
      // placement="bottomRight"
      itemArr={[
        //
        <MyButton_v2 key="1" img={iconUpload.src} onClick={() => setPdfModalVisible(true)}>
          匯出報價單
        </MyButton_v2>,
        <MyButton_v2 key="2" img={iconUpload.src} onClick={() => setShowPdf_part(true)}>
          單價分析
        </MyButton_v2>,
      ]}
    >
      匯出
    </Dropdown>,
  ];

  // --------------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    const arr = attachments?.map((item) => {
      const imageReg = /^image/;
      const pdfReg = /pdf$/;
      const fileType = imageReg.test(item.mime) ? 'image' : pdfReg.test(item.mime) ? 'pdf' : 'other';
      // const fileType = 'other';

      return {
        fileId: item.id,
        fileType,
        fileName: item.name,
        fileSrc: `${domain}/file/download/${item.id}`,
        isNew: false,
      };
    });
    setFileInfoArr(arr ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachments]);

  useEffect(() => {
    setStatus(latestContent?.status ?? 'Budget');
    // setEditNotes(latestContent?.editNotes ?? '');

    setCustomer(latestContent?.customer ?? null);
    setDesignUnit(latestContent?.designUnit ?? null);

    setState_profile({
      validityPeriod: latestContent?.validityPeriod ?? '',
      projectName: latestContent?.projectName ?? '',
      county: latestContent?.county ?? '',
      district: latestContent?.district ?? '',
      address: latestContent?.address ?? '',
      contactPerson: latestContent?.contactPerson ?? '',
      contactNumber: latestContent?.contactNumber ?? '',
      faxNumber: latestContent?.faxNumber ?? '',
      trackProgress: latestContent?.trackProgress ?? '',
      projectProgress: latestContent?.projectProgress ?? '',
      isLost: latestContent?.isLost ?? false,

      designatedBrand: latestContent?.designatedBrand ?? '',
      siteManager: latestContent?.siteManager ?? '',
      siteManagerNumber: latestContent?.siteManagerNumber ?? '',
      requiredDoorType: latestContent?.requiredDoorType ?? '',
      requiredDoorQuantity: String(latestContent?.requiredDoorQuantity ?? ''),
      estimatedDiscount: latestContent?.estimatedDiscount ?? '',
      scheduledProcurementOrBidDate: latestContent?.scheduledProcurementOrBidDate
        ? moment(latestContent.scheduledProcurementOrBidDate)
        : null,
      type: latestContent?.type ?? '',
    });
  }, [quotationData, quotationContentData, disabled]);

  useEffect(() => {
    if (targetProd) {
      targetProd.callApiAndGetOptions();
    }
  }, [targetProd]);

  useEffect(() => {
    if (latestContent) {
      const {
        //
        discount,
        tuneTotal,
        subTotal,
        salesTax,
        total,
        deliveryLocation,
        deliveryDate,
        paymentMethods,
        annotations,
        quotationRanges,
        //
        exchangeRate,
        usd,
      } = latestContent;

      const haveTax = !!salesTax;

      setState_annotation(annotations ?? []);
      setState_qr(quotationRanges ?? []);
      setState_PaymentMethod(paymentMethods);

      setState_summary({
        discountRate: discount,
        tuneTotal: tuneTotal ?? '',
        subTotal: subTotal.toLocaleString(),
        salesTax: salesTax.toLocaleString(),
        total: total.toLocaleString(),
        deliveryLocation,
        deliveryDate,
        exchangeRate: exchangeRate || '',
        usd: usd || '',
      });

      setTaxRate(haveTax ? 0.05 : 0);
    } else {
      setState_annotation([]);
      setState_qr([]);
      setState_PaymentMethod([
        {
          milestone: '訂製同時付總金額',
          totalPaymentRatio: '0',
        },
        {
          milestone: '門軌安裝完成付總金額',
          totalPaymentRatio: '0',
        },
        {
          milestone: '門扇安裝完成付總金額',
          totalPaymentRatio: '0',
        },
        {
          milestone: '驗收完成(保留款)付總金額',
          totalPaymentRatio: '0',
        },
      ]);

      // setState_summary({
      //   discountRate: '100',
      //   tuneTotal: '',
      //   subTotal: '',
      //   salesTax: '',
      //   total: '',
      //   deliveryLocation: '',
      //   deliveryDate: '',
      //   exchangeRate: '',
      //   usd: '',
      // });
      clearSummary();

      setTaxRate(0.05);
    }
  }, [quotationData, quotationContentData, disabled]);

  useEffect(() => {
    // quotationProdSubTotal或為'' ，代表剛進入page，這時可以用summary.subTotal
    const prodSubTotal =
      quotationProdSubTotal || (latestContent?.subTotal ?? 0) - Number(latestContent?.tuneTotal || 0);

    const { subTotal, salesTax, total } = countPayInfoValue({
      tuneTotal: state_summary.tuneTotal,
      prodSubTotal: prodSubTotal,
      taxRate,
    });

    const usd = calcNTDToUSD({
      NTD: total.replaceAll(',', '') as `${number}`,
      USDtoNTD: (state_summary.exchangeRate || '0') as `${number}`,
    }).toLocaleString();

    setState_summary((state) => {
      return {
        ...state,
        subTotal,
        salesTax,
        total,
        usd,
      };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // summary.discountRate,
    // 現在summary.discountRate改變時就會改變quotationProdSubTotal
    // 其實現在quotationProdSubTotal === ''也不會造成問題了
    quotationProdSubTotal,
    taxRate,
    state_summary.tuneTotal,
  ]);

  // useEffect(() => {
  //   setSummary((state) => {
  //     return {
  //       ...state,
  //       discountRate: String(avgDiscount_withQty),
  //     };
  //   });
  // }, [avgDiscount_withQty]);

  useEffect(() => {
    if (contentId) {
      (async () => {
        try {
          setIsLoading(true);
          await Promise.all([
            updateContent(),
            //  updateAttachments()
          ]);
        } catch (error) {}

        setIsLoading(false);
      })();
    } else {
      (async () => {
        try {
          setIsLoading(true);
          await Promise.all([
            update(),
            // updateAttachments()
          ]);
        } catch (error) {}

        setIsLoading(false);
      })();
    }
  }, [quotationId]);

  useEffect(() => {
    (async () => {
      try {
        await updateAttachments();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '取得附件失敗', content: err.message });
      }
    })();
  }, [lastestContentId]);

  // --------------------------------------------------------------------------

  // region RENDER

  return (
    <div className={classNames(style.container, 'relative')}>
      <PageHeader02
        //
        tagList={tagList}
        customeLeft={customeLeft}
        customeRight={customeRight}
        panelList={panelList}
      />

      <div className={style.mainContainer}>
        <div className={style.quotation}>
          {/* 基本資料 */}
          <QuotationProfile_memo disabled={disabled} control={control_profile} editNotes={editNotes} />
          <InputSel
            className={'ml-[50px]'}
            caption={'門型彙總'}
            showBaseline="invisible"
            captionStyle={{ width: '120px', fontSize: '18px', fontWeight: 400 }}
            wrapperStyle={{ padding: '21px 0px 4px 0px', gap: '24px' }}
            node={<DoorSummary doorModelSummary={DoorSummary.format(doorModelSummary)} />}
          />
          <div className={classNames(style.switchBar)}>
            <div>報價項目</div>
          </div>
          <div className={style.tableWrapper}>
            {/* 主產品設定 */}
            <Table_prod
              disabled={isAttach ? true : disabled}
              prodList={productList}
              prodCellConfig={prodCellConfig}
              prodKeyArr={prodKeyArr}
              changeProdKeyArr={changeProdKeyArr}
              addProd={addProd}
              setTargetProd={setTargetProdKey}
              // defalutVKeyArr={prodVKeyArr}
              onVKeyChange={(keyArr) => setProdVKeyArr(keyArr)}
              rowHeight="h60"
              isAttach={isAttach}
              // changeAllProductDiscount={changeAllProductDiscount}
              // avgDiscount={avgDiscount}
              discountRate={state_summary.discountRate} // 報價單總折數
              changeDiscountRate={(v) => {
                // 如果quotationProdSubTotal為空字串會算出錯誤的值，
                // 所以必須先計算出quotationProdSubTotal
                if (quotationProdSubTotal === '') {
                  calcSubTotalPrice();
                }

                if (v === '') {
                  v = '0';
                }

                if (Number(v) > 500) {
                  v = '500';
                }

                const isValid = checkIsFloat(v, 3);

                if (!isValid) {
                  return;
                }

                setState_summary((state) => {
                  // changeAllProdQuotationDiscount(Number(v));
                  // changeAllProductDiscount(Number(v));
                  return {
                    ...state,
                    discountRate: v,
                  };
                });
              }}
            />

            {/* 材料配件設定 */}
            <div className="relative mt-[14px]">
              <Table_com
                disabled={disabled}
                // comList={targetProd?.comList}

                // FIXME 之後要把型別處理好
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // comList={{ ...targetProd?.comList, ...targetProd?.subComList }}
                comList={comList}
                comCellConfig={comCellConfig}
                comKeyArr={comKeyArr}
                changeComKeyArr={() => {}}
                // defalutVKeyArr={comVKeyArr}
              />
              <LoadingCover01 isLoading={!!targetProd?.isLoading} />
            </div>
          </div>
          <div className={style.redWrapper}>
            {/* 選配設定 */}
            <Table_accessories
              disabled={disabled}
              list={targetProd?.accessoriesList}
              cellConfig={accessoriesCellConfig}
              keyArr={accessoriesKeyArr}
              changeKeyArr={changeAccessoriesKeyArr}
              // add={() => {
              //   targetProd?.addAcce();
              // }}
              defalutVKeyArr={targetProd?.accessoriesVKeyArr}
              onVKeyChange={(keyArr) => {
                if (targetProd) {
                  targetProd.accessoriesVKeyArr = keyArr;
                }
              }}
              doorModel={targetProd?.doorType}
              onSelectorConfirm={(arr) => {
                if (targetProd) {
                  targetProd.addAcce(arr);
                }
              }}
            />
          </div>
          <div className={style.tableWrapper}>
            {/* 其他設定 */}
            <Table_others
              disabled={disabled}
              list={othersList}
              cellConfig={othersCellConfig}
              keyArr={othersKeyArr}
              changeKeyArr={changeOthersKeyArr}
              add={addOthers}
            />
          </div>
          {/* 備註/報價範圍/付款資訊 */}
          <Summary_memo
            disabled={disabled}
            payInfoControl={payInfoControl}
            control_anno={control_anno}
            control_qr={control_qr}
            appendixParams={appendixParams}
            avgDiscount_withQty={avgDiscount_withQty}
          />
          {/* 簽名 */}
          <SignatureBar className={'mx-[50px] mt-[130px] mb-[40px]'} control={control_signature} />
        </div>
      </div>
      <LoadingCover01 isLoading={isLoading} />
      <TextareaModal
        visible={showMemoModal}
        setVisible={setShowMemoModal}
        title={'更新備註'}
        placeholder={'請輸入備註'}
        // tip="最多100字"
        // textLength={100}
        onConfirm={inputModalOnConfirm}
        autoCloseOnConfirm={false}
      />
      {/* 
      注意，在PDF裡的商品複價不是主產品設定裡顯示的複價
      而是 主產品設定裡顯示的複價 * 右下方的總折數
      另外在PDF裡面 "1 1/2HP"要改成1.5HP
      有沒有更大的數?
      
      輸出PDF的部分
      關於支板
      金額為0時，不要顯示出來
      */}
      {/* 
      注意，在PDF裡的商品複價不是主產品設定裡顯示的複價
      而是 主產品設定裡顯示的複價 * 右下方的總折數
      另外在PDF裡面 "1 1/2HP"要改成1.5HP
      有沒有更大的數?
      
      輸出PDF的部分
      關於支板
      金額為0時，不要顯示出來
      */}

      {/* {latestContent && (
        <QuotationPdf
          isVisable={showPdf}
          onCancel={() => {
            setShowPdf(false);
          }}
          // productArr_f={Object.values(productList)}
          // basicInfo={latestContent}
          noteArr={state_anno}
          qrArr={state_qr}
          control_basicInfo={quotationContentToBasicInfo(latestContent)}
          control_prodArr={quotationProdToTableProdList({
            classProductArr: Object.values(productList ?? {}),
            classOthersArr: Object.values(othersList ?? {}),
          })}
          isBidding={status === 'Bidding'}
        />
      )} */}

      {latestContent && (
        <QuotationPdf
          visible={pdfModalVisible}
          pdfData={pdfData}
          onCancel={() => {
            setPdfModalVisible(false);
          }}
          fileName={latestContent.quotationNumber}
        />
      )}

      {/* 
      注意，在PDF裡的商品複價不是主產品設定裡顯示的複價
      而是 主產品設定裡顯示的複價 * 右下方的總折數
      另外在PDF裡面 "1 1/2HP"要改成1.5HP
      有沒有更大的數?
      
      輸出PDF的部分
      關於支板
      金額為0時，不要顯示出來
      */}

      {/*  */}

      <QuotationPdf_part
        isVisable={showPdf_part}
        onCancel={() => {
          setShowPdf_part(false);
        }}
        mainProductArr={pdfPartProps}
        quotationId={latestContent?.quotationNumber ?? ''}
      />

      {/*  */}
      {/* 合約審核表 */}
      <ContractReviewForm
        showModal={reviewFormShow}
        readOnly={status === 'Pending' && isSendToReview_pending}
        onCancel={() => setReviewFormShow(false)}
        contentId={lastestContentId}
        // contractNumber={latestContent?.quotationNumber ?? ''}
        // projectName={latestContent?.projectName ?? ''}
        // totalPrice={Number(state_summary.total.replaceAll(',', ''))}
        // verifyForm={verifyForm}
        onConfirm={async () => {
          setIsLoading(true);
          await update();
          setIsLoading(false);
        }}
        // defaultPaymentRatioArr={useDefaultPaymentRatio_quotationContent(latestContent)}
      />
      <ThreeButtonModal
        visible={reviewModalShow}
        text={'是否通過審核?'}
        onCancel={() => setReviewModalShow(false)}
        modalWidth={600}
        btnPropsArr={[
          {
            label: '通過審核',
            theme: 'danger',
            onClick: () => reqReview(true),
          },
          {
            label: '不通過審核',
            onClick: () => reqReview(false),
          },
          {
            label: '取消',
            onClick: () => setReviewModalShow(false),
          },
        ]}
      />
      {/*  客戶選擇器 */}
      <CustomerSelector
        showModal={customerSelectorShow.show}
        label="複製報價單之客戶"
        onConfirm={(customerArr) => {
          const customerId = customerArr[0]?.id;

          reqCopyQuotation({ customerId });
        }}
        onCancel={() => {
          setCustomerSelectorShow(false);
        }}
        selLimit={1}
      />
      {/*  */}

      {/* 審核人員選擇器 */}
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
                reqPatchReviewer({
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
    </div>
  );
}

// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============

const countPayInfoValue = ({
  // discount,
  //
  tuneTotal,
  prodSubTotal,
  taxRate,
}: {
  // discount: string | number;

  tuneTotal: string | number;
  prodSubTotal: string | number;
  taxRate: number;
}) => {
  // const discountRate = new Decimal(discount || 0).div(100);

  // const subTotal = Decimal.mul(prodSubTotal || 0, discountRate);

  const subTotal = Number(prodSubTotal || 0) + Number(tuneTotal || 0);
  const tax = Decimal.mul(subTotal || 0, taxRate);
  const total = Decimal.add(subTotal || 0, tax || 0);

  // const subTotalStr = Number(subTotal.toFixed(0)).toLocaleString();
  // const taxStr = Number(tax.toFixed(0)).toLocaleString();
  // const totalStr = Number(total.toFixed(0)).toLocaleString();
  const subTotalStr = Number(new Decimal(subTotal).toFixed(0)).toLocaleString();
  const taxStr = Number(new Decimal(tax).toFixed(0)).toLocaleString();
  const totalStr = Number(new Decimal(total).toFixed(0)).toLocaleString();

  return {
    subTotal: subTotalStr,
    salesTax: taxStr,
    total: totalStr,
  };
};

// =================================================================

const creEmptyProfile = (): Tprofile => ({
  validityPeriod: '',
  projectName: '',
  county: '',
  district: '',
  address: '',
  contactPerson: '',
  contactNumber: '',
  faxNumber: '',
  trackProgress: '',
  projectProgress: '',
  isLost: false,

  designatedBrand: '',
  siteManager: '',
  siteManagerNumber: '',
  requiredDoorType: '',
  requiredDoorQuantity: '',
  estimatedDiscount: '',
  scheduledProcurementOrBidDate: null,
  type: '',
});

// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================
// 2024-05-28
// 備用或做參考，再兩個月後應該就能刪掉了
// 這個寫得不好，若要恢復這個功能到時候直接重寫比較好
// 功能是改變主產品的門型時，要取得對應的備註與報價範圍
// const onDoorTypeChange = ({
//   annoShouldRemove,
//   annoArr,
//   qrShouldRemove,
//   qrArr,
// }: {
//   annoShouldRemove: string[] | undefined;
//   annoArr: string[] | undefined;
//   qrShouldRemove: string[] | undefined;
//   qrArr: string[] | undefined;
// }) => {
//   setAnnotation((anno) => {
//     let annoCopy = [...anno];

//     // 把應該被移除拿掉
//     if (annoShouldRemove) {
//       annoShouldRemove.forEach((asmStr) => {
//         const delIndex = annoCopy.findIndex((str) => asmStr === str);

//         if (delIndex > -1) {
//           annoCopy.splice(delIndex, 1);
//         }
//       });
//     }

//     // 把新的放進去，並拿掉重複的值
//     if (annoArr) {
//       annoCopy = [...annoCopy, ...annoArr];
//       // annoCopy = [...new Set(annoCopy)];
//       annoCopy = _.uniq(annoCopy);
//     }

//     return annoCopy;
//   });

//   setQr((qr) => {
//     let qrCopy = [...qr];

//     // 把應該被移除拿掉
//     if (qrShouldRemove) {
//       qrShouldRemove.forEach((asmStr) => {
//         const delIndex = qrCopy.findIndex((str) => asmStr === str);

//         if (delIndex > -1) {
//           qrCopy.splice(delIndex, 1);
//         }
//       });
//     }

//     // 把新的放進去，並拿掉重複的值
//     if (qrArr) {
//       qrCopy = [...qrCopy, ...qrArr];
//       // qrCopy = [...new Set(qrCopy)];
//       qrCopy = _.uniq(qrCopy);
//     }

//     return qrCopy;
//   });

//   // setAnnotation(annoCopy);
// };

// ===================================================================

// 2024-05-28
// 再兩個月就可以考慮刪掉了

// const payInfoControl_old: TpayInfoControl = {
//   payment: {
//     haveTax: {
//       value: !!taxRate,
//       onChange: (v) => {
//         if (quotationProdSubTotal === '') {
//           calcSubTotalPrice();
//         }

//         setTaxRate(v ? 0.05 : 0);
//       },
//     },

//     discountRate: {
//       inputAttr: {
//         // disabled: disabled,
//         disabled: true,
//         value: summary.discountRate,
//         onChange: (e) => {
//           // // 如果quotationProdSubTotal為空字串會算出錯誤的值，
//           // // 所以必須先計算出quotationProdSubTotal
//           // if (quotationProdSubTotal === '') {
//           //   calcSubTotalPrice();
//           // }
//           // let v = e.target.value;
//           // if ((v as string) === '') {
//           //   v = '0';
//           // }
//           // if (Number(v) > 500) {
//           //   v = '500';
//           // }
//           // setSummary((state) => {
//           //   const copy = { ...state };
//           //   if (v.split('.')[1]?.length > 3) {
//           //     return copy;
//           //   }
//           //   copy.discountRate = v;
//           //   // changeAllProdQuotationDiscount(Number(v));
//           //   // changeAllProductDiscount(Number(v));
//           //   return copy;
//           // });
//         },
//       },
//     },
//     subTotal: {
//       inputAttr: {
//         disabled: true,
//         value: summary.subTotal,
//       },
//     },
//     salesTax: {
//       inputAttr: {
//         disabled: true,
//         value: summary.salesTax,
//       },
//     },
//     total: {
//       inputAttr: {
//         disabled: true,
//         value: summary.total,
//       },
//     },
//   },

//   delivery: {
//     deliveryLocation: {
//       value: summary.deliveryLocation,
//       onChange: (v) => {
//         setSummary((state) => {
//           const copy = { ...state };
//           copy.deliveryLocation = v;

//           return copy;
//         });
//       },
//     },
//     deliveryDate: {
//       value: summary.deliveryDate,
//       onChange: (v) => {
//         setSummary((state) => {
//           const copy = { ...state };
//           copy.deliveryDate = v;

//           return copy;
//         });
//       },
//     },
//   },
//   paymentMethod: {
//     arr: paymentMethod.map((item, index) => {
//       const { milestone, totalPaymentRatio } = item;

//       const onChangeMilestone = (v: string) => {
//         setPaymentMethod((state) => {
//           const copy = [...state];
//           copy[index].milestone = v;

//           return copy;
//         });
//       };

//       const onChange = (v: string) => {
//         if (v === '') {
//           v = '0';
//         }

//         setPaymentMethod((state) => {
//           const copy = [...state];
//           copy[index].totalPaymentRatio = v;

//           return copy;
//         });
//       };

//       const delSelf = () => {
//         setPaymentMethod((state) => {
//           const copy = [...state];
//           copy.splice(index, 1);

//           return copy;
//         });
//       };

//       return {
//         label: milestone,
//         value: totalPaymentRatio === '0' ? '' : totalPaymentRatio,
//         onChange,
//         onChangeMilestone,
//         delSelf,
//       };
//       //
//     }),
//     addMethod: (v) => {
//       setPaymentMethod((state) => {
//         const copy = [...state];
//         copy.push({ milestone: v, totalPaymentRatio: '' });

//         return copy;
//       });
//     },
//   },
// };
