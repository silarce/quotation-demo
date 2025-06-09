import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { useQuotationOther } from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationOther';
import { Tinstance_useQuotationProduct } from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationProduct';

import { Tstate_payInfo } from 'components/page/domestic/quotation_v2/hook/usePayInfo';

import type { Tstate_profile } from 'components/page/domestic/quotation_v2/type_quotation';

// api
import {
  TquotationContentDto,
  TcreateQuotationContentDto,
  TcreateQuotationProductDto,
  useGetQuotation_id_3,
  apiQuotationModify,
  apiPostQuotation_id_attachments,
  apiPatchModifyQuotation,
} from 'js/api/api_quotation';

import type { TstateTotalPrice } from 'components/page/domestic/quotation_v2/hook/quotationProduct/type';
import { calcProductBody as _calcProductBody } from '../hook/quotationProduct/method/calcProductBody';

// ===========================================================================

type Tinstance_getQuotationId3 = ReturnType<typeof useGetQuotation_id_3>;

type Tinstance_useQuotationOther = ReturnType<typeof useQuotationOther>;

type TreturnTypeCalcProductBody = ReturnType<typeof _calcProductBody>;
type TcalcProductBody = () => TreturnTypeCalcProductBody;

// ===========================================================================
const kit_req = ({
  userId,
  quotationId,
  contractId,
  instance_quotationProduct,
  instance_quotationProduct_iterative,
  instance_useQuotationOther,
  state_profile,
  state_payInfo,
  annoArr,
  quotationRangeArr,
  // setIsFetching,
  createFileArr,
  // update_quotation,
  setDisabled,
  state_quotationTotal,
  instatnce_getQuotationId3,
  status,
  calcProductBody,
}: {
  userId: string | undefined;
  quotationId: string | undefined;
  contractId: string | undefined;

  instance_quotationProduct: Tinstance_useQuotationProduct;
  instance_quotationProduct_iterative: Tinstance_useQuotationProduct | undefined | null;

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
  calcProductBody: TcalcProductBody;
}) => {
  const { reqPost, reqPatch, reqCopyQuotation } = instatnce_getQuotationId3;

  // MARK: reqPostQuotation
  const reqPostQuotation = async ({ editNote }: { editNote: string }) => {
    if (!userId) {
      myAlert.warning({ title: '沒有使用者ID' });

      return {
        newQuotation: undefined,
      };
    }

    const customer = state_profile.customer;

    if (!customer) {
      myAlert.info({ title: '請選擇客戶' });

      return;
    }

    state_profile.customer = customer;

    const { quotationDiscount, avgDiscount } = instance_quotationProduct;

    const {
      quotationProductArr,
      totalQty,

      isValid,
      invalidMessageArr,
    } = calcProductBody();

    if (!isValid) {
      myAlert.warning({
        title: '部分主產品材料配件無效',
        content: <span className="whitespace-pre-wrap">{invalidMessageArr.join('\n')}</span>,
      });

      return;
    }

    const body = createBody({
      quotationDiscount: quotationDiscount || '0',
      avgDiscount,
      quotationProductArr,
      totalQty,

      instance_useQuotationOther,
      state_profile: { ...state_profile, customer: customer },
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

  // MARK:reqModifyQuotation
  const reqModifyQuotation = async ({ editNote }: { editNote: string }) => {
    const customer = state_profile.customer;

    if (!instance_quotationProduct_iterative) {
      throw new Error('reqModify錯誤，instance_iterative is undefined');
    } else if (!userId) {
      throw new Error('reqModify錯誤，沒有使用者ID');
    } else if (!contractId) {
      throw new Error('reqModify錯誤，沒有contractId');
    } else if (!customer) {
      myAlert.info({ title: '請選擇客戶' });

      return;
    }

    const { quotationDiscount, avgDiscount } = instance_quotationProduct;

    const {
      quotationProductArr,
      totalQty,

      isValid,
      invalidMessageArr,
    } = calcProductBody();

    if (!isValid) {
      myAlert.warning({
        title: '部分主產品材料配件無效',
        content: <span className="whitespace-pre-wrap">{invalidMessageArr.join('\n')}</span>,
      });

      return;
    }

    const body = createBody({
      quotationDiscount: quotationDiscount || '0',
      avgDiscount,
      quotationProductArr,
      totalQty,

      instance_useQuotationOther,
      state_profile: { ...state_profile, customer },
      state_payInfo,
      state_quotationTotal,
      editNote,
      userId,
      annoArr,
      quotationRangeArr,
      status,
    });

    const attachmentArr: FormData[] = createAttachmentArr(await createFileArr());

    const newQuotation = await apiQuotationModify(contractId, body);
    const contentId = newQuotation.latestContent.id;

    let isSomethingWrong = false;

    if (newQuotation) {
      for (const attachment of attachmentArr) {
        await apiPostQuotation_id_attachments(contentId, attachment).catch(() => {
          isSomethingWrong = true;
        });
      }

      isSomethingWrong && myAlert.err({ title: '部分附件上傳失敗' });
    }

    return newQuotation;
  };

  // MARK:reqPatchModifiedQuotation

  const reqPatchModifiedQuotation = async ({ editNote }: { editNote: string }) => {
    if (!quotationId) {
      throw new Error('reqPatchModifiedQuotation錯誤，沒有quotationId');
    }

    const customer = state_profile.customer;

    if (!instance_quotationProduct_iterative) {
      throw new Error('reqModify錯誤，instance_iterative is undefined');
    } else if (!userId) {
      throw new Error('reqModify錯誤，沒有使用者ID');
    } else if (!customer) {
      myAlert.info({ title: '請選擇客戶' });

      return;
    }

    const { quotationDiscount, avgDiscount } = instance_quotationProduct;

    const {
      quotationProductArr,
      totalQty,

      isValid,
      invalidMessageArr,
    } = calcProductBody();

    if (!isValid) {
      myAlert.warning({
        title: '部分主產品材料配件無效',
        content: <span className="whitespace-pre-wrap">{invalidMessageArr.join('\n')}</span>,
      });

      return;
    }

    const body = createBody({
      quotationDiscount: quotationDiscount || '0',
      avgDiscount,
      quotationProductArr,
      totalQty,

      instance_useQuotationOther,
      state_profile: { ...state_profile, customer },
      state_payInfo,
      state_quotationTotal,
      editNote,
      userId,
      annoArr,
      quotationRangeArr,
      status,
    });

    const attachmentArr: FormData[] = createAttachmentArr(await createFileArr());

    const newQuotation = await apiPatchModifyQuotation({
      quotationId: quotationId,
      body,
    });

    const contentId = newQuotation.latestContent.id;
    let isSomethingWrong = false;

    if (newQuotation) {
      for (const attachment of attachmentArr) {
        await apiPostQuotation_id_attachments(contentId, attachment).catch(() => {
          isSomethingWrong = true;
        });
      }

      isSomethingWrong && myAlert.err({ title: '部分附件上傳失敗' });
    }

    return newQuotation;
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

    const customer = state_profile.customer;

    if (!customer) {
      myAlert.info({ title: '請選擇客戶' });

      return;
    }

    const { quotationDiscount, avgDiscount } = instance_quotationProduct;

    const {
      quotationProductArr,
      totalQty,

      isValid,
      invalidMessageArr,
    } = calcProductBody();

    if (!isValid) {
      myAlert.warning({
        title: '部分主產品材料配件無效',
        content: <span className="whitespace-pre-wrap">{invalidMessageArr.join('\n')}</span>,
      });

      return;
    }

    const body = createBody({
      quotationDiscount: quotationDiscount || '0',
      avgDiscount,
      quotationProductArr,
      totalQty,
      instance_useQuotationOther,
      state_profile: { ...state_profile, customer: customer },
      state_payInfo,
      state_quotationTotal,
      editNote,
      userId,
      annoArr,
      quotationRangeArr,
      status,
    });

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
  };

  // MARK:reqCloneQuotation
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
    reqModifyQuotation,
    reqPatchModifiedQuotation,
  };
};

// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================

const createBody = ({
  quotationDiscount,
  avgDiscount,
  quotationProductArr,
  totalQty,
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
  quotationDiscount: `${number}`;
  avgDiscount: number;
  quotationProductArr: TcreateQuotationProductDto[];
  totalQty: number;

  instance_useQuotationOther: Tinstance_useQuotationOther;

  state_profile: Omit<Tstate_profile, 'customer'> & {
    customer: NonNullable<Tstate_profile['customer']>;
  };

  state_payInfo: Tstate_payInfo;
  state_quotationTotal: TstateTotalPrice;
  editNote: string;
  userId: string;
  annoArr: string[];
  quotationRangeArr: string[];
  status: TquotationContentDto['status'];
}) => {
  const { formatToBody_other } = instance_useQuotationOther;

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
