// 報價單
import React, { useState, useReducer, useEffect, useContext, useMemo, memo } from 'react';
import { useRouter, NextRouter } from 'next/router';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';
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

// ======================================================================

// MARK: START
export default function Quotation({ userInfo }: { userInfo?: TuserDto }) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { id: quotationId, contentId, isContract } = query;

  const userId = userInfo?.employee?.id;

  const isNewQuotation = !quotationId && !contentId;

  // ----------------------------------------------------------------------

  const [disabled, setDisabled] = useState(true);

  const [isFeching, setIsFeching] = useState(false);

  // ----------------------------------------------------------------------

  const {
    isFetching,
    //
    raw: quotationData,
    update: update_quotation,
    // attachment
    attachmentArr,
    domain,
    //
    reqPost,
    reqPatch,
    reqReview,
    reqUnlock,
    reqPatchReviewer,
    reqCopyQuotation,
    reqPatchQuotationContent_id_progress,
    reqToPending,
  } = useGetQuotation_id_3(quotationId as string, {
    preBuiltPopulate: ['simple', 'attached'],
  });

  const {
    data: quotationContentData,
    update: updateContent,
    clearData: clearData_content,
  } = useGetQuotationContent_id(contentId as string);

  const content = quotationData?.latestContent || quotationContentData;

  const {
    isSendToReview,
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

  // ----------------------------------------------------------------------

  // region STATE MANAGEMENT

  // instance_quotationTotalPrice
  const { state_quotationTotal, setQuotationPriceTotal, setTuneTotal, setCurrency, setExchangeRate } =
    useQuotationTotalPrice({
      raw_quotationContent: content,
      disabled,
    });

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
  // MARK:reqPatchQuotation
  const reqPatchQuotation = async ({ editNote }: { editNote: string }) => {
    if (!userId) {
      return myAlert.warning({ title: '沒有使用者ID' });
    }

    if (!quotationId) {
      myAlert.warning({ title: '沒有報價單ID' });

      return;
    }

    const {
      calcProductBody: calcProduct,
      quotationDiscount,
      // state_totalPrice: {
      //   prodPriceTotal,
      //   averageDiscount,
      //   tuneTotal,
      //   subTotal,
      //   salesTax,
      //   total,
      //   currency,
      //   exchangeRate,
      //   foreignTotal,
      // },
    } = instance_quotationProduct;

    const { formatToBody_other } = instance_useQuotationOther;

    // if (status === 'Pending') {
    //   return myAlert.info({ title: '在準合約階段不可以編輯報價單' });
    // }

    const { quotationProductArr, isAllDoorModalValid, invalidComponentArr, totalQty } = calcProduct();
    const {
      projectName,
      validityPeriod,
      county,
      district,
      address,
      contactPerson,
      contactNumber,
      faxNumber,
      trackProgress,
      projectProgress,
      designatedBrand,
      siteManager,
      siteManagerNumber,
      type,
      isLost,
      customer,
      designUnit,
    } = state_profile;

    const { deliveryLocation, deliveryDate, paymentMethodArr } = state_payInfo;

    if (!customer) {
      myAlert.info({ title: '請選擇客戶' });

      return;
    }

    const { tuneTotal, subTotal, salesTax, total, exchangeRate, foreignTotal, currency } = state_quotationTotal;

    const body: TcreateQuotationContentDto = {
      quotationDate: new Date().toISOString(),

      validityPeriod,
      customerId: customer?.id,
      projectName,
      county,
      district,
      address,
      contactPerson,
      contactNumber,
      faxNumber,
      designatedBrand,
      siteManager,
      siteManagerNumber,
      // !
      requiredDoorType: '門型彙總',
      // !
      type,
      quantity: totalQty,
      editNotes: editNote,
      // !
      status: 'Budget',
      // !
      agentId: userId,
      annotations: annoArr.map((anno) => anno.value),
      quotationRanges: quotationRangeArr.map((qr) => qr.value),
      trackProgress,
      projectProgress,
      discount: quotationDiscount || '100',
      // !
      averageDiscount: '999',
      // !
      tuneTotal,
      subTotal,
      salesTax,
      total,
      deliveryLocation,
      deliveryDate: deliveryDate && deliveryDate.toISOString(),
      paymentMethods: paymentMethodArr,
      exchangeRate,
      foreignTotal,
      currency,
      products: quotationProductArr,
      others: formatToBody_other(),
      isLost,
      designUnitId: designUnit?.id || null,
    };

    let shouldUpdate = false;

    try {
      const updatedQuotation = await apiPatchQuotation(body, quotationId);
      const latestContentId = updatedQuotation.latestContent.id;
      shouldUpdate = true;
      const fileArr = await createFileArr();

      for (const file of fileArr) {
        const formData = new FormData();
        formData.append('file', file);
        await apiPostQuotation_id_attachments(latestContentId, formData);
      }
    } catch (error) {
    } finally {
      if (shouldUpdate) {
        await update_quotation();
        setDisabled(true);
      }
    }

    setIsFeching(true);
  };

  // ----------------------------------------------------------------------

  // region METHOD

  const handleUpload = () => {
    const { destroy } = myAlert.input({
      title: '報價單註解',
      onConfirm: (editNote) => {
        reqPatchQuotation({ editNote });
        destroy();
      },
    });
  };

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

  const props_profileForm = createProps_profileForm({
    state_profile,
    setState_profile,
    reqPatchTrackProgressOrProjectProgress: reqPatchQuotationContent_id_progress,
    isSendToReview,
  });

  const props_payInfo: Tprops_quotationPayInfo['form'] = {
    haveTax: { value: true },
    discountRate: { value: state_quotationDiscount },
    tuneTotal: {
      // value: state_totalPrice.tuneTotal,
      value: disabled ? Number(state_quotationTotal.tuneTotal).toLocaleString() : state_quotationTotal.tuneTotal,
      onChange(value) {
        setTuneTotal(value);
      },
    },
    currency: {
      value: state_quotationTotal.currency,
      onChange(value) {
        setCurrency(value);
      },
    },
    exchangeRate: {
      value: state_quotationTotal.exchangeRate,
      onChange(value) {
        setExchangeRate(value);
      },
    },
    avgDiscount_withQty: state_quotationTotal.averageDiscount,
    subTotal: Number(state_quotationTotal.subTotal).toLocaleString(),
    salesTax: Number(state_quotationTotal.salesTax).toLocaleString(),
    total: Number(state_quotationTotal.total).toLocaleString(),
    foreignTotal: Number(state_quotationTotal.foreignTotal).toLocaleString(),

    // deliveryLocation: kit_payInfo.deliveryLocation,
    // deliveryDate: kit_payInfo.deliveryDate,
    // paymentMethodArr: kit_payInfo.paymentMethodArr,
    // addPaymentMethod: kit_payInfo.addPaymentMethod,

    ...kit_payInfo,
  };

  const panelList = usePanel({
    disabled,
    props_panelList_01: {
      onEdit: () => {
        setDisabled(false);
      },
    },
    props_panelList_02: {
      onCancel: () => {
        setDisabled(true);
      },
      onUpload: handleUpload,
    },
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

  // ----------------------------------------------------------------------

  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02 tag="報價單" panelList={panelList} />
      <div>
        <QuotationProfile
          disabled={disabled}
          form={props_profileForm}
          quotationNumber={content?.quotationNumber ?? '---'}
          editNotes={content?.editNotes}
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
      </div>
    </SubLayer>
  );
}
// MARK: END
//
//

// ======================================================================

//
// MARK: usePanel
const usePanel = ({
  disabled,
  props_panelList_01,
  props_panelList_02,
}: {
  disabled: boolean;
  props_panelList_01: {
    onEdit: () => void;
  };
  props_panelList_02: {
    onCancel: () => void;
    onUpload: () => void;
  };
}): TpanelList => {
  const panelList_01: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: props_panelList_01.onEdit,
    },
  ];
  const panelList_02: TpanelList = [
    {
      type: 'redButton',
      label: '上傳',
      onClick: props_panelList_02.onUpload,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: props_panelList_02.onCancel,
    },
  ];

  const panelList = disabled ? panelList_01 : panelList_02;

  return panelList;
};
