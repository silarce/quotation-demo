// 報價單
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';

import Decimal from 'decimal.js';

// components

import QuotationStateSel from 'components/page/domestic/budget/quotationStateSel';

import DoorSummary from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/doorSummary';
import VersionLabel from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/versionLabel';

// global gear
import PageHeader02 from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// config
import { quotationStatusLookup } from 'config/lookupTable';

// api
import { TquotationDto, TquotationContentDto, TquotationContractDto } from 'js/api/api_quotation';

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
import { usePanel } from 'components/page/domestic/quotation_v2/hook/usePanel';

// abstraction
import { createProps_payInfo } from 'components/page/domestic/quotation_v2/method/createProps_payInfo';
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
import {
  TexportState as TexportState_payInfo,
  usePayInfo,
} from 'components/page/domestic/quotation_v2/hook/usePayInfo';
import QuotationPayInfo from 'components/page/domestic/quotation_v2/QuotationPayInfo';
import {
  TexportState as TexportState_quotationProduct,
  TstateProdDict,
  TprodSource,
  useQuotationProduct,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationProduct';
import QuotationProdTable from 'components/page/domestic/quotation_v2/QuotationProdTable';
//
import {
  TexportState as TexportState_quotationContentOther,
  useQuotationOther,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationOther';
//
import {
  TexportState as TexportState_quotationTotalPrice,
  useQuotationTotalPrice,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/useQuotationPrice';

// ======================================================================
// ======================================================================

import { useInterval } from 'hooks/useInterval';

import { useBackup, exportBackup, importBackup } from 'hooks/useBackup';

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

interface Tbackup {
  status: TquotationContentDto['status'];
  product: TexportState_quotationProduct;
  quotationTotalPrice: TexportState_quotationTotalPrice;
  profile: Tstate_profile;
  annoArr: string[];
  quotationRangeArr: string[];
  payInfo: TexportState_payInfo;
  other: TexportState_quotationContentOther;
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
export default function Quotation() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { id: quotationId, contentId, contractId } = query;

  // ----------------------------------------------------------------------
  const ref_quotationPayInfo = useRef<HTMLFormElement>(null);

  const variable = init_variable();

  const { isAllReviewedBeforePending } = variable;

  // ----------------------------------------------------------------------

  // region GET DATA

  let quotationType: TquotationType = undefined;

  !quotationId && !contentId && (quotationType = 'new');
  (quotationId || contentId) && (quotationType = 'old');
  quotationType === 'new' && !!contractId && (quotationType = 'newAttachment');

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
    //

    changeAllowProdAutoChange,
    state_allowProdAutoChange,

    isBouncing,
  } = useQuotationProduct({
    raw_quotationProductArr: undefined,
    raw_quotationDiscount: undefined,
    iterativeContractProductArr: undefined,
    disabled,
    onProdAllTotalChange: (prodAllTotal) => {
      handleSetQuotationPriceTotal({
        prodPriceAllTotal: prodAllTotal,
        otherPriceAllTotal: instance_useQuotationOther.calcAllOtherTotalPrice(),
      });
    },
    raw_autoRefresh: true,
  });

  const {
    avgDiscount,
    quotationDiscount: state_quotationDiscount, // 總折數
  } = instance_quotationProduct;

  const instance_quotationTotalPrice = useQuotationTotalPrice({
    raw_quotationContent: undefined,
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
    profile: undefined,
  });

  const {
    state: state_payInfo,
    kit: kit_payInfo,

    exportState: exportState_payInfo,
    restoreState: restoreState_payInfo,
  } = usePayInfo({
    disabled,
    raw: undefined,
  });

  const instance_useQuotationOther = useQuotationOther({
    disabled,
    raw_contentOtherArr: undefined,
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

  // MARK: Backup

  const key_useBackup = (() => {
    if (quotationType === 'new') {
      return 'newQuotation';
    }

    if (quotationType === 'newAttachment') {
      return `newAttachmentQuotation-${contractId}`;
    }

    return contentId || quotationId || undefined;
  })();

  const { backup, updateBackup, clearBackup } = useBackup<Tbackup>(key_useBackup, {
    type: 'quotation',
  });

  const createStateForRestore = () => {
    const payInfo_pre = exportState_payInfo({ exportCopy: false });
    const payInfo = {
      ...payInfo_pre,
      // moment是class，不能轉為JSON
      deliveryDate: payInfo_pre.deliveryDate ? payInfo_pre.deliveryDate.toISOString() : null,
    };

    const stateForRestore: Tbackup = {
      status: state_status,
      product: exportState_product(),
      quotationTotalPrice: exportState_quotationTotalPrice({ exportCopy: false }),
      profile: state_profile,

      annoArr: [],
      quotationRangeArr: [],

      payInfo: payInfo,
      other: state_otherArr,
    };

    return stateForRestore;
  };

  const backupState = () => {
    updateBackup && updateBackup(createStateForRestore());
  };

  const doExportBackup = () => {
    exportBackup(createStateForRestore(), `報價單備份-${state_profile.projectName}`);
  };

  const restoreAllState = !backup
    ? undefined
    : () => {
        setState_status(backup.status);
        restoreState_product(backup.product);
        restoreState_quotationTotalPrice(backup.quotationTotalPrice);
        restoreState_profile(backup.profile);
        // restoreState_anno(backup.annoArr);
        // restoreState_quotationRange(backup.quotationRangeArr);
        // restoreState_anno(backup.annoArr);
        // restoreState_quotationRange(backup.quotationRangeArr);
        restoreState_payInfo(backup.payInfo);
        restoreState_other(backup.other);
      };

  const doImportBackup = async () => {
    const backup = (await importBackup()) as Tbackup;

    if (!backup) {
      return;
    }

    const { status, product, quotationTotalPrice, profile, annoArr, quotationRangeArr, payInfo, other } = backup;

    if (
      !status ||
      !product ||
      !quotationTotalPrice ||
      !profile ||
      !annoArr ||
      !quotationRangeArr ||
      !payInfo ||
      !other
    ) {
      myAlert.err({ title: '備份資料格式錯誤' });

      return;
    }

    setState_status(backup.status);
    restoreState_product(backup.product);
    restoreState_quotationTotalPrice(backup.quotationTotalPrice);
    restoreState_profile(backup.profile);
    // restoreState_anno(backup.annoArr);
    // restoreState_quotationRange(backup.quotationRangeArr);
    restoreState_payInfo(backup.payInfo);
    restoreState_other(backup.other);
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

  // const props_profileForm = createProps_profileForm({
  //   state_profile,
  //   setState_profile,
  //   reqPatchTrackProgressOrProjectProgress: reqPatchQuotationContent_id_progress,
  //   allowEditClick: isSendToReview,
  // });

  const props_payInfo = createProps_payInfo({
    instance_quotationPrice: instance_quotationTotalPrice,
    kit_payInfo,
    state_quotationDiscount,
    disabled,
    avgDiscount,
    isAttach: false,
  });

  // MARK:
  const { panelList, customeRight } = usePanel({
    disabled,
    quotationType,
    isReviewer: false,
    status: '',
    isDesignatedContent: false,
    //
    isAllReviewedBeforePending,
    //
    setDisabled,

    handlePatch: () => {},
    handlePost: () => {},
    handleModify: () => {},
    handlePatchModify: () => {},

    handleClone: async () => {},
    handleReqToPending: () => {},

    handleReview: () => {},
    preHandleSubmit: () => {},
    showVerifyForm: () => setReviewFormShow(true),
    handleReqUnlock: () => {},
    //
    showPdf: () => {},
    showPdf_noDiscount: () => {},
    showPdf_part: () => () => {},
    //
    isQuotationExpired: false,
    // quotationExpiredInfo: `報價單建立時的合約版本為${parentSubContract?.version}，但現在最新的版本為${latestSubContract?.version}`,
    quotationExpiredInfo: ``,
    //
    restoreAllState: restoreAllState,
    clearBackup,
    doExportBackup,
    doImportBackup,
  });

  // const history = useHistory({
  //   quotationData,
  // });

  const customeLeft: React.ReactNode[] = [
    <VersionLabel
      key="0"
      version={undefined}
      subTotal={state_quotationTotal.subTotal}
      salesTax={state_quotationTotal.salesTax}
      total={state_quotationTotal.total}
    />,
  ];

  // MARK:control_signature

  // const { control_signature, defaultSeletedDataArrArr, dynaSelectorPropsList } = useReviewrUi({
  //   quotationData: undefined,
  //   agentEmployee,
  //   status: state_status,
  // });

  let tag = `報價編號 ${undefined}`;
  quotationType === 'new' && (tag = '新增報價單');
  quotationType === 'newAttachment' && (tag = '新增追加追減報價單');

  // const doorSummaryArr = Object.values(doorModelSummery).concat(doorModelSummery_reduceModified);
  const doorSummaryArr = [...doorModelSummery_reduceModified, ...Object.values(doorModelSummery)];

  // ----------------------------------------------------------------------
  // region useEffect
  // useEffect(() => {
  //   update_quotation();
  // }, [quotationId]);

  // useEffect(() => {
  //   const status = content?.status || 'Budget';

  //   setState_status(status);
  // }, [content]);

  useInterval(backupState, {
    interval: 5000,
    stop: disabled,
  });

  // MARK: RENDER
  return (
    <div className=" px-40 pb-10">
      <div className={scss.pageHeaderWrapper}>
        <PageHeader02
          // tag={tag}
          panelList={panelList}
          customeLeft={customeLeft}
          customeRight={customeRight}
        />
      </div>
      <div className="relative z-50">
        {/* <QuotationProfile
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
        /> */}

        {/* prod */}
        {/* prod */}
        {/* prod */}
        <br />
        <br />

        <div className={''}>
          <QuotationProdTable
            disabled={disabled}
            instance_useQuotationProductInstance={{ ...instance_quotationProduct }}
            prodTotal={allProdTotal.toLocaleString()}
            changeAllowProdAutoChange={changeAllowProdAutoChange}
            state_allowProdAutoChange={state_allowProdAutoChange}
            // isIterativeProdExist={!!iterativeContractProductArr?.length}
          />
          <br />
          <br />
          <br />
        </div>

        {/* prod */}
        {/* prod */}
        {/* prod */}
        <div className={scss.summary}>
          <div className={scss.left}>
            <div className={''}>
              <InputSel
                caption={'門型彙總'}
                showBaseline="invisible"
                captionStyle={{ width: '120px' }}
                wrapperStyle={{ padding: '21px 0px 4px 0px', gap: '24px' }}
                node={<DoorSummary list={doorSummaryArr} />}
              />
            </div>
          </div>
          {/* 付款資訊 */}
          <form ref={ref_quotationPayInfo}>
            <QuotationPayInfo disabled={disabled} form={props_payInfo} />
          </form>
        </div>
      </div>
    </div>
  );
}
// MARK: END
//
//

export type { TquotationType };
