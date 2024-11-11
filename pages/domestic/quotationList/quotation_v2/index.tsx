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

// utils
import { urlToFile } from 'js/utils/helpers/urlToFile';
import {
  init_variable,
  calcNTDToForeignCurrency,
  checkIsReviewer,
} from 'components/page/domestic/quotation/function/utils_quotation';

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
// import { useProductList } from 'hooks/quotation/useProduct';
// import { useSummary, Tstate_summary } from 'components/page/domestic/quotation/hook/useSummary';

// type
import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';
import { TuserDto, TcreateQuotationProductDto, TcustomerDto } from 'js/api/dtoTypes';

import { checkIsFloat } from 'js/utils/checkValue';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// ======================================================================
// ======================================================================
// ======================================================================

// region TYPE

interface Tquery {
  id?: string;
  // 從查詢報價單的展開列表點進來的話query裡就會有contentId
  contentId?: string;
  isContract?: string;
}

interface Tstate {
  quotationId: string | null;
  contentId: string | null;
  isNew: boolean | null;

  quotationNumber: string | null;

  profile: {
    projectName: string;
    validityPeriod: string;
    county: string;
    district: string;
    address: string;
    contactPerson: string;
    contactNumber: string;
    faxNumber: string;
    trackProgress: string;
    projectProgress: string;

    designatedBrand: string;
    siteManager: string;
    siteManagerNumber: string;
    requiredDoorType: string;
    requiredDoorQuantity: string;
    estimatedDiscount: string;
    scheduledProcurementOrBidDate: Moment | null;
    type: string;

    isLost: boolean; // 失單
  };
}

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
  // region PROPS

  const panelList = useQuotation({
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
    },
  });

  // ----------------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02 tag="報價單" panelList={panelList} />
      <div></div>
    </SubLayer>
  );
}
// MARK: END

// ======================================================================

// region HOOK

const useQuotation = ({
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
      type: 'myButton',
      label: '取消',
      onClick: props_panelList_02.onCancel,
    },
  ];

  const panelList = disabled ? panelList_01 : panelList_02;

  return panelList;
};
