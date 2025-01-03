import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { useQuotationOther } from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationOther';
import { useQuotationProduct } from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationProduct';
import { useProfile, createProps_profileForm } from 'components/page/domestic/quotation_v2/hook/useProfile';
import { useAnnotations, useQuotationRange } from 'components/page/domestic/quotation_v2/hook/useRemark';
import { useAttachment } from 'components/page/domestic/quotation_v2/hook/useAttachment';
import { usePayInfo, Tstate_payInfo } from 'components/page/domestic/quotation_v2/hook/usePayInfo';

import type { Tstate_profile } from 'components/page/domestic/quotation_v2/type_quotation';

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

import type { TstateTotalPrice } from 'components/page/domestic/quotation_v2/hook/quotationProduct/type';

// ===========================================================================

type Tinstance_getQuotationId3 = ReturnType<typeof useGetQuotation_id_3>;

type Tinstance_useQuotationProduct = ReturnType<typeof useQuotationProduct>;
type Tinstance_useQuotationOther = ReturnType<typeof useQuotationOther>;

// ===========================================================================
const kit_req = ({
  userId,
  quotationId,
  instance_quotationProduct,
  instance_useQuotationOther,
  state_profile,
  state_payInfo,
  annoArr,
  quotationRangeArr,
  setIsFetching,
  createFileArr,
  update_quotation,
  setDisabled,
  state_quotationTotal,
  instatnce_getQuotationId3,
  status,
}: {
  userId: string | undefined;
  quotationId: string | undefined;
  instance_quotationProduct: Tinstance_useQuotationProduct;
  instance_useQuotationOther: Tinstance_useQuotationOther;
  state_profile: Tstate_profile;
  state_payInfo: Tstate_payInfo;
  annoArr: string[];
  quotationRangeArr: string[];
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  createFileArr: () => Promise<File[]>;
  update_quotation: () => Promise<void>;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  state_quotationTotal: TstateTotalPrice;
  instatnce_getQuotationId3: Tinstance_getQuotationId3;
  status: TquotationContentDto['status'];
}) => {
  const { reqPost, reqPatch, reqReview, reqUnlock, reqPatchReviewer, reqCopyQuotation, reqToPending } =
    instatnce_getQuotationId3;

  // MARK: reqPostQuotation
  const reqPostQuotation = async ({ editNote }: { editNote: string }) => {
    if (!userId) {
      myAlert.warning({ title: '沒有使用者ID' });

      return {
        newQuotation: undefined,
      };
    }

    if (!state_profile.customer) {
      myAlert.info({ title: '請選擇客戶' });
    }

    const body = createBody({
      instance_quotationProduct,
      instance_useQuotationOther,
      state_profile,
      state_payInfo,
      state_quotationTotal,
      editNote,
      userId,
      annoArr,
      quotationRangeArr,
      status,
    });

    const attachmentArr: FormData[] = createAttachmentArr(await createFileArr());

    const { isUpdated, newQuotation } = await reqPost({ body, attachmentArr });

    if (isUpdated) {
      setDisabled(true);
    }

    return { newQuotation };
  };

  // -----------------------------------------------------------------------

  // MARK:reqPatchQuotation
  const reqPatchQuotation = async ({ editNote }: { editNote: string }) => {
    const empty = {
      newQuotation: undefined,
      isUpdated: false,
    };

    if (!userId) {
      myAlert.warning({ title: '沒有使用者ID' });

      return empty;
    }

    if (!quotationId) {
      myAlert.warning({ title: '沒有報價單ID' });

      return empty;
    }

    if (!state_profile.customer) {
      myAlert.info({ title: '請選擇客戶' });
    }

    const body = createBody({
      instance_quotationProduct,
      instance_useQuotationOther,
      state_profile,
      state_payInfo,
      state_quotationTotal,
      editNote,
      userId,
      annoArr,
      quotationRangeArr,
      status,
    });

    // const shouldUpdate = false;

    // setIsFetching(true);

    const attachmentArr: FormData[] = createAttachmentArr(await createFileArr());

    const { newQuotation, newAttachmentArr, isUpdated } = await reqPatch({ body, attachmentArr });

    if (isUpdated) {
      setDisabled(true);
    }

    return {
      newQuotation,
      newAttachmentArr,
      isUpdated,
    };

    // try {
    //   const updatedQuotation = await apiPatchQuotation(body, quotationId);
    //   const latestContentId = updatedQuotation.latestContent.id;
    //   shouldUpdate = true;
    //   const fileArr = await createFileArr();

    //   for (const file of fileArr) {
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     await apiPostQuotation_id_attachments(latestContentId, formData);
    //   }
    // } catch (error) {
    // } finally {
    //   if (shouldUpdate) {
    //     await update_quotation();
    //     setDisabled(true);
    //   }

    //   setIsFetching(false);
    // }
  };

  // 複製報價單
  const reqCloneQuotation = async ({
    customerId,
    isRelationQuotation,
  }: {
    customerId: string;
    isRelationQuotation?: boolean | undefined;
  }) => {
    return await reqCopyQuotation({
      customerId,
      isRelationQuotation,
    });
  };

  // MARK: RETURN
  return {
    reqPostQuotation,
    reqPatchQuotation,
    reqCloneQuotation,
  };
};

// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================

const createBody = ({
  instance_quotationProduct,
  instance_useQuotationOther,
  state_profile,
  state_payInfo,
  state_quotationTotal,
  editNote,
  userId,
  annoArr,
  quotationRangeArr,
  status,
}: {
  instance_quotationProduct: Tinstance_useQuotationProduct;
  instance_useQuotationOther: Tinstance_useQuotationOther;
  state_profile: Tstate_profile;
  state_payInfo: Tstate_payInfo;
  state_quotationTotal: TstateTotalPrice;
  editNote: string;
  userId: string;
  annoArr: string[];
  quotationRangeArr: string[];
  status: TquotationContentDto['status'];
}) => {
  const {
    calcProductBody: calcProduct,
    quotationDiscount,
    avgDiscount,
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

  const { deliveryLocation, deliveryDate } = state_payInfo;
  let paymentMethodArr = state_payInfo.paymentMethodArr;
  paymentMethodArr = paymentMethodArr.map((item) => ({ ...item, totalPaymentRatio: item.totalPaymentRatio || '0' }));

  const {
    //
    tuneTotal,
    subTotal,
    salesTax,
    total,
    exchangeRate,
    foreignTotal,
    currency,
  } = state_quotationTotal;

  const body: TcreateQuotationContentDto = {
    quotationDate: new Date().toISOString(),

    validityPeriod,
    customerId: customer!.id,
    projectName,
    county,
    district,
    address,
    contactPerson,
    contactNumber,
    faxNumber,
    designatedBrand: designatedBrand || null,
    siteManager: siteManager || null,
    siteManagerNumber: siteManagerNumber || null,
    // !
    // requiredDoorType: '門型彙總',
    // !
    type: type || null,
    quantity: totalQty,
    editNotes: editNote,
    status: status,
    agentId: userId,
    annotations: annoArr,
    quotationRanges: quotationRangeArr,
    trackProgress,
    projectProgress,
    discount: quotationDiscount || '0',
    averageDiscount: `${avgDiscount}` || null,
    tuneTotal,
    subTotal,
    salesTax,
    total,
    deliveryLocation,
    deliveryDate: deliveryDate && deliveryDate.toISOString(),
    paymentMethods: paymentMethodArr,
    exchangeRate: exchangeRate || null,
    foreignTotal: foreignTotal || null,
    currency,
    products: quotationProductArr,
    others: formatToBody_other(),
    isLost,
    designUnitId: designUnit?.id || null,
  };

  return body;
};

const createAttachmentArr = (fileArr: File[]) => {
  const attachmentArr: FormData[] = [];

  for (const file of fileArr) {
    const formData = new FormData();
    formData.append('file', file);
    attachmentArr.push(formData);
  }

  return attachmentArr;
};

// ==========================================================================

export { kit_req };
