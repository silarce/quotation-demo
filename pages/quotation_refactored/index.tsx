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

import { exportBackup, importBackup } from 'hooks/useBackup';
import { useQuotationBackup } from 'hooks/useQuotationBackup';

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

  const { backup, updateBackup, clearBackup } = useQuotationBackup<Tbackup>();

  // 進入page時把當下載入到的備份釘在ref，避免被自動備份覆寫
  const ref_initialBackup = useRef<Tbackup | null>(null);
  const [hasInitialBackup, setHasInitialBackup] = useState(false);

  useEffect(() => {
    if (backup === undefined || ref_initialBackup.current) {
      return;
    }

    ref_initialBackup.current = backup;
    setHasInitialBackup(!!backup);
  }, [backup]);

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
    void updateBackup(createStateForRestore());
  };

  const doExportBackup = () => {
    exportBackup(createStateForRestore(), `報價單備份-${state_profile.projectName}`);
  };

  const restoreAllState = !hasInitialBackup
    ? undefined
    : () => {
        const backup = ref_initialBackup.current;

        if (!backup) {
          return;
        }

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
      <section className="my-6 rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
        <header className="border-b border-slate-200 px-5 py-3">
          <h2 className="text-xl font-semibold text-slate-800">說明</h2>
          <p className="mt-1 text-base text-slate-500">
            此 demo 為過去做過的報價單的簡化版，移除了所有涉及 API 的業務邏輯，並大幅簡化與減少欄位。
          </p>
        </header>

        <div className="grid gap-x-8 gap-y-5 px-5 py-4 text-lg leading-8 md:grid-cols-2">
          <div>
            <h3 className="mb-1 font-medium text-slate-800">基本操作</h3>
            <ul className="ml-4 list-disc space-y-1">
              <li>新增產品後，先選擇「種類」再選擇「型號」，該產品的組件便會出現。</li>
              <li>點擊產品列（粉紅色狀態）會顯示其組件與選配，即可開始編輯。</li>
              <li>輸入寬、高會自動計算面積。</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-1 font-medium text-slate-800">尺寸與材料連動</h3>
            <ul className="ml-4 list-disc space-y-1">
              <li>寬與面積會連動到組件的數量：單位為 M 者跟著寬、單位為 ㎡ 者跟著面積。</li>
              <li>變更產品材料會套用到其所有組件；反之，變更單一組件材料只影響該組件。</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-1 font-medium text-slate-800">金額計算</h3>
            <ul className="ml-4 list-disc space-y-1">
              <li>產品牌價 = 組件與選配的「牌價複價」總和；產品單價 = 組件與選配的「複價」總和。</li>
              <li>
                組件單價 = <span className="font-mono text-base">牌價 × 折數/100 × 總折數/100</span>。
              </li>
              <li>折數為單一產品的折扣，總折數為套用到所有產品的第二次折扣。</li>
              <li>計算金額設有防抖，停止輸入 300 毫秒後才會重算。</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-1 font-medium text-slate-800">排序與列操作</h3>
            <ul className="ml-4 list-disc space-y-1">
              <li>主產品列最左側圖示可按住拖拉排序，其後為刪除與複製。</li>
              <li>組件可排序；選配可排序、刪除，但不可複製。</li>
              <li>主產品可拖拉排序欄位：點「編輯欄位排序」按鈕後即可開始調整。</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-1 font-medium text-slate-800">備份</h3>
            <ul className="ml-4 list-disc space-y-1">
              <li>每 5 秒自動備份；可重新整理頁面後按「回復備份狀態」測試。</li>
              <li>另提供匯出 / 匯入功能。</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-1 font-medium text-slate-800">其他</h3>
            <ul className="ml-4 list-disc space-y-1">
              <li>左上角與右下角顯示小計與總計。</li>
              <li>左下角為彙總。</li>
            </ul>
          </div>
        </div>
      </section>

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
                caption={'彙總'}
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
