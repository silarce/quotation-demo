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
}: {
  userId: string | undefined;
  quotationId: string | undefined;
  instance_quotationProduct: ReturnType<typeof useQuotationProduct>;
  instance_useQuotationOther: ReturnType<typeof useQuotationOther>;
  state_profile: Tstate_profile;
  state_payInfo: Tstate_payInfo;
  annoArr: string[];
  quotationRangeArr: string[];
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  createFileArr: () => Promise<File[]>;
  update_quotation: () => Promise<void>;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  state_quotationTotal: TstateTotalPrice;
}) => {
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
      // annotations: annoArr.map((anno) => anno.value),
      // quotationRanges: quotationRangeArr.map((qr) => qr.value),
      annotations: annoArr,
      quotationRanges: quotationRangeArr,
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

    setIsFetching(true);

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

      setIsFetching(false);
    }
  };

  // -----------------------------------------------------------------------
  return {
    reqPatchQuotation,
  };
};

export { kit_req };
