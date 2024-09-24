// 追加/追減項目
// QuotationProdChangingRecord

// 展開版本的追加追減紀錄 (在很下面)
// QuotationRecord

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/router';
import _ from 'lodash';
import Decimal from 'decimal.js';
import classNames from 'classnames';
import moment from 'moment';

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, {
  TtagList as TtabList,
  TpanelList,
  Tlink,
  TlinkArr,
} from 'components/PageHeader/PageHeader02/PageHeader02';

// composition
import MeetingMinutes_contract, {
  TimperativeHandle as TimperativeHandle_meetingMinutes,
  Tstate as Tstate_meetingMinutes,
} from 'components/composition/meetingMinutes/contract';
import WorkContactDoc_component, {
  TimperativeHandle,
  TonStateChange,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/workContactDoc_component';
import CertifiedDocument from 'components/composition/certifiedDocument';

// components
// import QuotationProfile from 'components/page/domestic/quotation/quotationProfile_old';
import QuotationProfile, { Tcontrol_profile } from 'components/page/domestic/quotation/quotationProfile';
import QuotationProdChangingRecord from 'components/page/domestic/quotation/quotationProdChangingRecord';
import QuotationRecord from 'components/page/domestic/quotation/quotationRecord';
// import Table_prod from 'components/page/domestic/contract/table/table_prod';
import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
// import Table_com from 'components/page/domestic/contract/table/table_component';
// 報價單使用的Table_com
import Table_com from 'components/page/domestic/quotation/quotation/product/table_component';
import Table_accessories from 'components/page/domestic/contract/table/table_accessories';
import Table_others from 'components/page/domestic/contract/table/table_others';

import ContractReviewForm from 'components/composition/contractReviewForm/contractReviewForm';

import Summary, {
  TsummaryControl,
  TpayInfoControl,
} from 'components/page/domestic/quotation/quotation/summary/summary';
// import QuotationSinature from 'components/page/domestic/quotation/quotationSinature';

import QuotationPdf, {
  useModalQuotationPdf,
} from 'components/page/domestic/pdf/quotationPdf/quotationPdf_new3/modal_quotationPdf';

import QuotationPdf_part, {
  TmainProduct,
  Tpart,
  extractPdfPartFromClassProduct,
} from 'components/page/domestic/pdf/quotationPdf_part/quotationPdf_part';

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// gear

import { RotatingArrow01 } from 'public/image/icon/iconComponent/rotatingArrow';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputModal, { TinputModalProps } from 'components/global/gear/modal/simpleModal/inputModal_v2';
import SignatureBar, { Tcontrol_signatureBar } from 'components/global/gear/signatureBar_v2';

// css
import scss from './quotation.module.scss';

// api
import {
  useGetContract_id_noItems_2,
  useQuotation_id_attachments,
  useGetContract_id_contentProductItems,
  //
  apiGetQuotationProducts,
  apiPatchQuotationContent_id_progress,
} from 'js/api/api_quotation';
import { apiPostEngineeringContact } from 'js/api/api_engineering';

// hook
import { useProductList } from 'hooks/quotation/useProduct';

// type
import type { TquotationContractDto, TquotationContentDto } from 'js/api/api_quotation';
import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

// =============================================================

// region TYPE

// type Tstate_tab = 'contract' | 'contactDoc' | 'meetingMinutes' | 'certifiedDocument';

type Tquery = {
  id: string | undefined;
  version: string | undefined;
  tab: 'contract' | 'contactDoc' | 'meetingMinutes' | 'certifiedDocument';
};

type TpanelListList = {
  panel_quotation01: TpanelList;
  panel_quotation03: TpanelList;
  panel_workContack_disabled: TpanelList;
  panel_workContack: TpanelList;
  panel_workContack_pattern: TpanelList;
  panel_meeting_list: TpanelList;
  panel_meeting_read: TpanelList;
  panel_meeting_edit: TpanelList;
  panel_meeting_add: TpanelList;
};

// =============================================================
// =============================================================
// =============================================================
export default function Quotation() {
  const router = useRouter();
  const isReady = router.isReady;

  if (!isReady) {
    return null;
  }

  return <TheQuotation router={router} />;
}

// ===========================================================
function TheQuotation({ router }: { router: NextRouter }) {
  const query = router.query as Tquery;

  const {
    id, //報價單id
    version,
    tab = 'contract',
  } = query;

  // -----------------------------------------------------------
  const ref_workContact = useRef<TimperativeHandle>(null!);
  const ref_meetingMinutes = useRef<TimperativeHandle_meetingMinutes>(null!);

  // -----------------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  const [reviewFormShow, setReviewFormShow] = useState(false);

  // const [state_tab, setState_tab] = useState<Tstate_tab>('contract');

  const [dynaPanelList, setDynaPanelList] = useState<TpanelList | null | undefined>(null);

  // 合約項目 追加/追減項目的開關
  // 按鈕是profile下面的 "合約項目"與 "追加/追減項目"
  const [switch01, setSwitch01] = useState(true);

  // 展開版本追加追減紀錄的開關
  // 按鈕是panelList的"追加追減報價單"
  const [switch02, setSwitch02] = useState(false);
  //

  // 工程聯絡單的狀態
  const [isShowPattern, setIsShowPattern] = useState(false);
  const [disabed_workContactDoc, setDisabed_workContactDoc] = useState(true);
  const [isLoading_workContact, setIsLoading_workContact] = useState(false);
  //

  const [state_meeting, setState_meeting] = useState<Tstate_meetingMinutes>({
    isAdd: false,
    isEdit: false,
    isRead: false,
    isLoading: false,
  });

  const [fileInfoArr, setFileInfoArr] = useState<TfileInfo[]>([]);

  const [targetProdKey, setTargetProdKey] = useState<string>('n');

  const [inputModalConfig, setInputModalConfig] = useState<TinputModalProps>();

  // const [showPdf, setShowPdf] = useState(false);
  const [showPdf_part, setShowPdf_part] = useState(false);

  // =========================================================

  // region get Data

  // const { data: contract, update } = useGetContract_id_noItems_2(id, { populate: ['content.settleProducts'] });
  // const { data: contract, update } = useGetContract_id_noItems_2(id);
  // 這個技術債以後重構時再還...
  // 貓的，重構之日遙遙無期
  const { data: contract, update } = useGetContract_id_contentProductItems(
    id,

    {
      populate: ['quotation'],
    },

    version
  );
  const engineeringContactId = contract?.engineeringContactId;
  const quotationId = contract?.quotation?.id;

  // 合約項目
  // 選中合約版本的contnet
  // 可以用url的version判斷
  // version===1 是根合約
  // version>1 是子合約
  //
  // 如果是根合約，追加追減項目就取得所有的subContract
  // 如果是子合約，追加追減項目就取得所有比子合約版本小的subContract (包括這個子合約)
  //
  // 原報價項目，就是根合約的content

  // region 前處理
  const { content, rootContent, subContracts, totalInfo } = useMemo(() => {
    if (!contract) {
      return {};
    }

    let subContracts = contract.subContracts.filter((item) => {
      if (version === '1') {
        return true;
      } else {
        return item.version <= Number(version ?? 0);
      }
    });

    subContracts = _.sortBy(subContracts, 'version');

    const rootContent = subContracts[0]?.content;

    const content = (() => {
      if (version === '1') {
        return contract?.content;
      } else if (version) {
        const index = Number(version) - 1;
        const contract = subContracts[index];

        return contract?.content;
      }
    })();

    let subTotal = new Decimal(0);
    let salesTax = new Decimal(0);
    let total = new Decimal(0);

    subContracts.forEach((item) => {
      subTotal = subTotal.plus(item.subTotal);
      salesTax = salesTax.plus(item.salesTax);
      total = total.plus(item.total);
    });

    const totalInfo = {
      subTotal: subTotal.toNumber(),
      salesTax: salesTax.toNumber(),
      total: total.toNumber(),
    };

    return {
      content,
      rootContent,
      subContracts,
      totalInfo,
    };
  }, [contract, version]);

  // _________________________________________________________________________

  // 附件
  const { attachments, updateAttachments, domain } = useQuotation_id_attachments(content?.id);

  // =========================================================

  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------

  // region REQUEST
  const reqPatchQuotationContent_id_progress = async ({
    trackProgress,
    projectProgress,
  }: {
    trackProgress?: string | null;
    projectProgress?: string | null;
  }) => {
    const contentId = content?.id;

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

  // --------------------------Z---------------------------------------------

  // region FUNCTION

  const dynaPanelListReducer = (value: TpanelList | null | undefined) => {
    if (!value) {
      setDynaPanelList(null);
    } else {
      value = [...value];

      if (!value.find((item) => item?.label === '返回')) {
        value.push({ type: 'myButton', label: '返回', onClick: router.back });
      }

      setDynaPanelList(value);
    }
  };

  const onWorkContactStateChange: TonStateChange = ({ disabled, isLoading, isShowPattern }) => {
    setIsShowPattern(isShowPattern);
    setDisabed_workContactDoc(disabled);
    setIsLoading_workContact(isLoading);
  };

  // const clearShow = () => {
  //   setIsShowContract(false);
  //   setIsShowWorkContactDoc(false);1
  //   setIsShowMeetingMinutes(false);
  // };
  // --------------------------Z---------------------------------------------

  // region PROPS
  //
  //
  //
  //

  const {
    visible: visible_pdf,
    setVisible: setVisible_pdf,
    pdfData,
  } = useModalQuotationPdf({
    quotationContent: content,
  });

  // region useProductList

  // 合約項目
  const {
    // reRender,
    // reset,
    //
    productList,
    prodCellConfig,
    prodKeyArr,
    // prodVKeyArr,
    // setProdVKeyArr,
    // addProd,
    changeProdKeyArr,
    //
    // subTotal,
    //
    comKeyArr,
    comVKeyArr,
    comCellConfig,
    changeComKeyArr,
    //
    accessoriesKeyArr,
    changeAccessoriesKeyArr,
    accessoriesCellConfig,
    //
    othersKeyArr,
    othersList,
    othersCellConfig,
    // changeOthersKeyArr,
    // addOthers,
    // getOthersPostBodyArr,
    avgDiscount_withQty,
  } = useProductList({
    productArr: content?.products ?? [],
    others: content?.others ?? [],
    averageDiscount: content?.averageDiscount,
    resetTrigger: content?.products,
    quotationDiscount: Number(content?.discount || '100'),
    discount_fromData: Number(content?.discount || '100'),
  }); // 合約項目

  const targetProd = productList[targetProdKey];

  // ______________________________________________________________________
  // ______________________________________________________________________

  const control_profile = useMemo(() => {
    const control_profile: Tcontrol_profile = {
      quotationNumber: content?.quotationNumber ?? '',
      quotationDate: content?.quotationDate ?? '',
      isLost: {
        value: content?.isLost ?? false,
      },
      customer: {
        value: content?.customer,
      },
      designUnit: {
        value: content?.designUnit,
      },
      itemList: {
        validityPeriod: {
          value: content?.validityPeriod ?? '',
        },
        projectName: {
          value: content?.projectName ?? '',
        },
        county: {
          value: content?.county ?? '',
        },
        district: {
          value: content?.district ?? '',
        },
        address: {
          value: content?.address ?? '',
        },
        contactPerson: {
          value: content?.contactPerson ?? '',
        },
        contactNumber: {
          value: content?.contactNumber ?? '',
        },
        faxNumber: {
          value: content?.faxNumber ?? '',
        },

        designatedBrand: {
          value: content?.designatedBrand ?? '',
        },
        siteManager: {
          value: content?.siteManager ?? '',
        },
        siteManagerNumber: {
          value: content?.siteManagerNumber ?? '',
        },
        requiredDoorType: {
          value: content?.requiredDoorType ?? '',
        },
        requiredDoorQuantity: {
          value: String(content?.requiredDoorQuantity ?? ''),
        },
        estimatedDiscount: {
          value: content?.estimatedDiscount ?? '',
        },
        type: {
          value: content?.type ?? '',
        },
        scheduledProcurementOrBidDate: {
          value: content?.estimatedDiscount ? moment(content.estimatedDiscount) : null,
        },

        trackProgress: {
          value: content?.trackProgress ?? '',

          onClick: () => {
            setInputModalConfig({
              visible: true,
              title: '追蹤進度',
              placeholder: '請輸入追蹤進度',
              onConfirm: async (v) => {
                const res = await reqPatchQuotationContent_id_progress({
                  trackProgress: v,
                });

                if (res) {
                  // const trackProgress = res.trackProgress;
                  // changeProfile('trackProgress', trackProgress);
                  update();
                }

                setInputModalConfig(undefined);
              },
              onCancel: () => setInputModalConfig(undefined),
            });
          },
          disabled: false,
        },
        projectProgress: {
          value: content?.projectProgress ?? '',

          onClick: () => {
            setInputModalConfig({
              visible: true,
              title: '工程進度',
              placeholder: '請輸入工程進度',
              onConfirm: async (v) => {
                const res = await reqPatchQuotationContent_id_progress({
                  projectProgress: v,
                });

                if (res) {
                  // const projectProgress = res.projectProgress;
                  // changeProfile('projectProgress', projectProgress);
                  update();
                }

                setInputModalConfig(undefined);
              },
              onCancel: () => setInputModalConfig(undefined),
            });
          },
          disabled: false,
        },
      },
    };

    return control_profile;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const control_anno: TsummaryControl = {
    stringArr: contract?.annotations ?? [],
    editString: () => {},
    addString: () => {},
    delString: () => {},
    addStrArr: () => {},
    replaceStrArr: () => {},
  };

  const control_qr: TsummaryControl = {
    stringArr: contract?.quotationRanges ?? [],
    editString: () => {},
    addString: () => {},
    delString: () => {},
    addStrArr: () => {},
    replaceStrArr: () => {},
  };

  const payInfoControl: TpayInfoControl = {
    payment: {
      // haveTax: {
      //   // value: !!data?.salesTax,
      //   value: Boolean(data?.salesTax),
      //   onChange: (v) => {
      //     // if (quotationProdSubTotal === '') {
      //     //   calcSubTotalPrice();
      //     // }
      //     // setTaxRate(v ? 0.05 : 0);
      //   },
      // },

      discountRate: {
        inputAttr: {
          disabled: true,
          value: contract?.discount ?? '',
          onChange: () => {},
        },
      },
      tuneTotal: {
        inputAttr: {
          disabled: true,
          value: '',
        },
      },
      subTotal: {
        inputAttr: {
          disabled: true,
          value: totalInfo?.subTotal ?? '',
        },
      },
      salesTax: {
        inputAttr: {
          disabled: true,
          value: totalInfo?.salesTax ?? '',
        },
      },
      total: {
        inputAttr: {
          disabled: true,
          value: totalInfo?.total ?? '',
        },
      },
    },

    delivery: {
      deliveryLocation: {
        value: contract?.deliveryLocation ?? '',
        onChange: () => {},
      },
      deliveryDate: {
        value: contract?.deliveryDate ?? '',
        onChange: () => {},
      },
    },
    paymentMethod: {
      arr:
        contract?.paymentMethods.map((item) => {
          const { milestone, totalPaymentRatio } = item;

          return {
            label: milestone,
            value: totalPaymentRatio === '0' ? '' : totalPaymentRatio,
            onChange: () => {},
            delSelf: () => {},
          };
          //
        }) ?? [],
      addMethod: () => {},
    },
    exchangeRate: {
      // 不確定TquotationContractDto下會不會有exchangeRate
      // 若有，從totalInfo下手
      // FIXME exchangeRate
      value: '',
      onChange: (v) => {},
    },
    usd: {
      // 不確定TquotationContractDto下會不會有usd
      // 若有，從totalInfo下手
      // value: state_summary.usd,
      // FIXME usd
      value: '---',
    },
  };

  const { control_signature } = useMemo(() => {
    const signatureArr: Tcontrol_signatureBar['signatureArr'] = [
      {
        label: '總經理',
        value: contract?.content?.reviewManagerEmployee?.chName ?? '',
        style: { width: '170px' },
      },
      {
        label: '應收帳款',
        value: contract?.content?.reviewCashierEmployee?.chName ?? '',
        style: { width: '170px' },
      },
      {
        label: '應收帳款',
        value: contract?.content?.reviewWorkDirectorEmployee?.chName ?? '',
        style: { width: '170px' },
      },
      {
        label: '業務經理',
        value: contract?.content?.reviewSalesManagerEmployee?.chName ?? '',
        style: { width: '170px' },
      },
      {
        label: '業務主管',
        value: contract?.content?.reviewSupervisorEmployee?.chName ?? '',
        style: { width: '170px' },
      },
      {
        label: '業務',
        value: contract?.content?.reviewSalesEmployee?.chName ?? '',
        style: { width: '170px' },
      },
      {
        label: '經辦',
        value: contract?.content?.agentEmployee?.chName ?? '',
        style: { width: '170px' },
      },
    ];

    const control_signature = {
      signatureArr,
    };

    return { control_signature };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract?.content]);

  const appendixParams = {
    fileInfoArr,
    removeFileInfo: () => {},
    toSetFileInfo: () => {},
  };

  const tabList = useTabList({
    contract,
    engineeringContactId,
    tab,
    id,
    version,
  });

  const panelList = usePanelList({
    id,
    version,
    contract,
    engineeringContactId,
    setIsLoading,
    update,
    setReviewFormShow,
    setSwitch02,
    ref_workContact,
    ref_meetingMinutes,

    tab,
    isShowPattern,
    switch02,
    disabed_workContactDoc,
    state_meeting,
    setVisible_pdf,
    setShowPdf_part,
  });

  const pdfPartPropsArr = useMemo(() => {
    const pdfPartPropsArr_productList = extractPdfPartFromClassProduct({
      quotationNumber: contract?.contractNumber ?? '無報價編號',
      productList,
    });

    // const pdfPartPropsArr_attachProductList = extractPdfPartFromClassProduct({
    //   quotationNumber: latestContent?.quotationNumber ?? '無報價編號',
    //   productList: attachProdList,
    // });

    return [
      ...pdfPartPropsArr_productList,
      // ...pdfPartPropsArr_attachProductList
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // attachProdList,
    productList,
  ]);

  // --------------------------Z---------------------------------------------

  // region useEffect

  useEffect(() => {
    update();
  }, [id]);

  // useEffect(() => {
  //   (async () => {
  //     if (targetProd?.id) {
  //       try {
  //         const res = await apiGetQuotationProducts(targetProd.id);
  //         const componentsArr = res.items?.[0].components ?? [];
  //         const acceArr = res.items?.[0].accessories ?? [];
  //         // creComList_dyna

  //         targetProd.creComList_dyna({ componentsArr: componentsArr });
  //         targetProd.creAcceList_dyna({ acceArr });
  //       } catch (error) {}
  //     }
  //   })();

  //   // apiGetQuotationProducts
  // }, [targetProd]);

  useEffect(() => {
    const arr = attachments?.map((item) => {
      const imageReg = /^image/;
      const pdfReg = /pdf$/;
      const fileType = imageReg.test(item.mime) ? 'image' : pdfReg.test(item.mime) ? 'pdf' : 'other';

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
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // region render
  return (
    <SubLayer
      //
      isLoading_all={isLoading || isLoading_workContact}
      scrollToTopTrigger={useMemo(() => {
        return [tab === 'contactDoc', isShowPattern];
      }, [isShowPattern, tab])}
    >
      <PageHeader02
        tagList={tabList}
        panelList={dynaPanelList || panelList}
        //  linkList={linkArr}
      />
      {/*  */}
      <div>
        {/* <ContractNode /> */}

        {tab === 'contract' && (
          <div className={classNames(scss.quotation)}>
            {/* 報價單基本資料 */}
            <QuotationProfile disabled={true} control={control_profile} />

            {/* switch01 */}
            <div className={scss.switchBar}>
              {!switch02 && (
                <div className={(switch01 && scss.active) || ''} onClick={() => setSwitch01(true)}>
                  合約項目
                </div>
              )}
              <div className={switch02 || !switch01 ? scss.active : ''} onClick={() => setSwitch01(false)}>
                追加 / 追減項目
              </div>
            </div>

            {/* 合約項目 追加/追減項目 */}
            {switch01 || switch02 ? (
              <>
                {/* 主產品設定 */}
                <Table_prod
                  disabled={true}
                  prodList={productList}
                  prodCellConfig={prodCellConfig}
                  prodKeyArr={prodKeyArr}
                  changeProdKeyArr={changeProdKeyArr}
                  addProd={() => {}}
                  setTargetProd={setTargetProdKey}
                  panelBox="easyBox"
                  emptyBlockWidth="80px"
                  rowHeight={'h60'}
                  discountRate={contract?.discount ?? ''} // 報價單總折數
                  changeDiscountRate={(v) => {}}
                />
                {/* 原報價項目 */}

                {switch02 && <OldQuotationProduction rootContent={rootContent} />}
                <br />
                <div className={scss.redWrapper}>
                  {/* 材料配件設定 */}
                  <Table_com
                    disabled={true}
                    // comList={targetProd?.comList}
                    // FIXME 之後要把型別處理好
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    comList={{ ...targetProd?.comList, ...targetProd?.subComList }}
                    comCellConfig={comCellConfig}
                    comKeyArr={comKeyArr}
                    changeComKeyArr={changeComKeyArr}
                    defalutVKeyArr={comVKeyArr}
                  />
                  <hr />
                  {/* 選配設定 */}
                  <br />
                  <Table_accessories
                    disabled={true}
                    list={targetProd?.accessoriesList}
                    cellConfig={accessoriesCellConfig}
                    keyArr={accessoriesKeyArr}
                    changeKeyArr={changeAccessoriesKeyArr}
                    defalutVKeyArr={targetProd?.accessoriesVKeyArr}
                    onVKeyChange={(keyArr) => {
                      if (targetProd) {
                        targetProd.accessoriesVKeyArr = keyArr;
                      }
                    }}
                    doorModel={targetProd?.doorType}
                    onSelectorConfirm={(arr) => {}}
                    panelBox="easyBox"
                    emptyBlockWidth="80px"
                  />
                  <br />
                  {/* 其他設定 */}
                  <Table_others
                    disabled={true}
                    list={othersList}
                    cellConfig={othersCellConfig}
                    keyArr={othersKeyArr}
                    changeKeyArr={() => {}}
                    add={() => {}}
                  />
                </div>
              </>
            ) : (
              // 追加/追減項目
              <QuotationProdChangingRecord subContract={subContracts} />
            )}

            {/* 展開版本的追加追減紀錄 (在很下面)*/}
            {switch02 && <QuotationRecord subContract={subContracts} />}

            <Summary
              disabled={true}
              payInfoControl={payInfoControl}
              control_anno={control_anno}
              control_qr={control_qr}
              appendixParams={appendixParams}
              avgDiscount_withQty={avgDiscount_withQty}
            />

            {/* 簽名 */}
            <SignatureBar control={control_signature} className="mx-[50px] mt-[120px] mb-[40px]" />
          </div>
        )}

        {/*  */}
        {/*  */}
        {/*  */}
        {tab === 'contactDoc' && engineeringContactId && (
          <div>
            <WorkContactDoc_component
              ref={ref_workContact}
              contract={contract}
              engineeringContactId={engineeringContactId}
              onStateChange={onWorkContactStateChange}
            />
          </div>
        )}

        {tab === 'meetingMinutes' && (
          <MeetingMinutes_contract
            //
            ref={ref_meetingMinutes}
            onStateChange={setState_meeting}
            contractIdFromProps={id}
            quotationNumber={contract?.content.quotationNumber}
          />
        )}

        {tab === 'certifiedDocument' && <CertifiedDocument onPanelListChange={dynaPanelListReducer} />}

        <InputModal
          visible={!!inputModalConfig?.visible}
          onConfirm={inputModalConfig?.onConfirm}
          onCancel={inputModalConfig?.onCancel}
          title={inputModalConfig?.title ?? ''}
          placeholder={inputModalConfig?.placeholder}
        />

        <ContractReviewForm
          showModal={reviewFormShow}
          isInContract={true}
          contractId={contract?.id}
          // quotationId={quotationId}
          onCancel={() => setReviewFormShow(false)}
          onConfirm={async () => {
            setIsLoading(true);
            await update();
            setIsLoading(false);
          }}

          // contractNumber={content?.quotationNumber ?? ''}
          // projectName={content?.projectName ?? ''}
          // totalPrice={Number(content?.total ?? '')}
          // contentId={content?.id}
          // verifyForm={content?.verifyForm}
          // quotationContent={content}
        />
      </div>

      <QuotationPdf
        //
        visible={visible_pdf}
        onCancel={() => setVisible_pdf(false)}
        pdfData={pdfData}
        fileName={contract?.contractNumber ?? ''}
      />

      <QuotationPdf_part
        isVisable={showPdf_part}
        onCancel={() => {
          setShowPdf_part(false);
        }}
        mainProductArr={pdfPartPropsArr}
        quotationId={contract?.contractNumber ?? ''}
      />
    </SubLayer>
  );
}

// region END

// ====================================================================
// ====================================================================
// ====================================================================

// ====================================================================
// ====================================================================
// ====================================================================

// region COMPONENT

const OldQuotationProduction = ({
  // prodList,
  // prodCellConfig,
  // prodKeyArr,
  // changeProdKeyArr,
  // setTargetProd,
  rootContent,
}: {
  // prodList: Parameters<typeof Table_prod>[0]['prodList'];
  // prodCellConfig: Parameters<typeof Table_prod>[0]['prodCellConfig'];
  // prodKeyArr: Parameters<typeof Table_prod>[0]['prodKeyArr'];
  // changeProdKeyArr: Parameters<typeof Table_prod>[0]['changeProdKeyArr'];
  // setTargetProd: Parameters<typeof Table_prod>[0]['setTargetProd'];
  rootContent: TquotationContentDto | undefined;
}) => {
  const [isActive, setIsActive] = useState(false);
  const panelSwitch = () => setIsActive(!isActive);

  const {
    // reRender,
    // reset,
    //
    productList,
    prodCellConfig,
    prodKeyArr,
    // prodVKeyArr,
    // setProdVKeyArr,
    // addProd,
    changeProdKeyArr,
    //
    // subTotal,
    //
    // comKeyArr,
    // comVKeyArr,
    // comCellConfig,
    // changeComKeyArr,
    //
    // accessoriesKeyArr,
    // changeAccessoriesKeyArr,
    // accessoriesCellConfig,
    //
    // othersKeyArr,
    // othersList,
    // othersCellConfig,
    // changeOthersKeyArr,
    // addOthers,
    // getOthersPostBodyArr,
    avgDiscount_withQty,
  } = useProductList({
    productArr: rootContent?.products ?? [],
    others: [],
    averageDiscount: rootContent?.averageDiscount,
    resetTrigger: rootContent?.products,
    quotationDiscount: Number(rootContent?.discount || '100'),
    discount_fromData: Number(rootContent?.discount || '100'),
  });

  const [targetProdKey, setTargetProdKey] = useState<string>('n');
  const targetProd = productList[targetProdKey];

  return (
    <Collapse
      className={`${scss.oldQuotationProduction}`}
      expandIcon={() => <></>}
      accordion={false}
      activeKey={+!isActive} //在這個情境 0會開 其他數字會關 所以要把這邊的isActive反轉
    >
      <Panel key={0} header={<OqpHeader isActive={isActive} panelSwitch={panelSwitch} />}>
        <Table_prod
          disabled={true}
          prodList={productList}
          prodCellConfig={prodCellConfig}
          prodKeyArr={prodKeyArr}
          changeProdKeyArr={changeProdKeyArr}
          addProd={() => {}}
          setTargetProd={setTargetProdKey}
          discountRate={undefined}
        />

        {/* <Table_com
          disabled={true}
          comList={targetProd?.comList}
          comCellConfig={comCellConfig}
          comKeyArr={comKeyArr}
          changeComKeyArr={changeComKeyArr}
          defalutVKeyArr={comVKeyArr}
        /> */}

        {/* <Table_accessories
          disabled={true}
          list={targetProd?.accessoriesList}
          cellConfig={accessoriesCellConfig}
          keyArr={accessoriesKeyArr}
          changeKeyArr={changeAccessoriesKeyArr}
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
        /> */}
      </Panel>
    </Collapse>
  );
};

// oqp就是OldQuotationProduction
const OqpHeader = ({ isActive, panelSwitch }: { isActive: boolean; panelSwitch: () => void }) => {
  const active = isActive ? scss.active : '';

  return (
    <div className={`${scss.OqpHeader} ${active}`}>
      <span>原報價項目</span>
      <button className={scss.panelButton} onClick={panelSwitch}>
        <span>展開</span>
        <RotatingArrow01 deg={0} defaultDeg={-180} isActive={!isActive} />
      </button>
    </div>
  );
};

// =============================================================================

// region FUNCTION

const panelListRouter = ({
  panelListList,
  tab,
  isShowPattern,
  switch02,
  disabed_workContactDoc,
  isMeetingAdd,
  isMeetingRead,
  isMeetingEdit,
}: {
  panelListList: TpanelListList;
  tab: Tquery['tab'];
  isShowPattern: boolean;
  switch02: boolean;
  disabed_workContactDoc: boolean;
  isMeetingAdd: boolean;
  isMeetingRead: boolean;
  isMeetingEdit: boolean;
}): TpanelList => {
  const {
    panel_quotation01,
    panel_quotation03,
    panel_workContack_disabled,
    panel_workContack,
    panel_workContack_pattern,
  } = panelListList;

  if (tab === 'contract') {
    if (switch02) {
      return panel_quotation03;
    } else {
      return panel_quotation01;
    }
  }

  if (tab === 'contactDoc') {
    if (isShowPattern) {
      return panel_workContack_pattern;
    } else if (disabed_workContactDoc) {
      return panel_workContack_disabled;
    } else {
      return panel_workContack;
    }
  }

  if (tab === 'meetingMinutes') {
    if (isMeetingAdd) {
      return panelListList.panel_meeting_add;
    } else if (isMeetingEdit) {
      return panelListList.panel_meeting_edit;
    } else if (isMeetingRead) {
      return panelListList.panel_meeting_read;
    } else {
      return panelListList.panel_meeting_list;
    }
  }

  return [];

  //
  //
};

// ===========================================================================

// region hook
//
//
//
//
//
// region usePanelList

const usePanelList = ({
  id,
  version,
  contract,
  engineeringContactId,
  setIsLoading,
  update,
  setReviewFormShow,
  setSwitch02,
  ref_workContact,
  ref_meetingMinutes,
  //
  tab,
  isShowPattern,
  switch02,
  disabed_workContactDoc,
  state_meeting,
  setVisible_pdf,
  setShowPdf_part,
}: {
  id: string | undefined;
  version: string | undefined;
  contract: TquotationContractDto | undefined;
  engineeringContactId: string | undefined | null;
  setIsLoading: (value: React.SetStateAction<boolean>) => void;
  update: () => void;
  setReviewFormShow: (value: React.SetStateAction<boolean>) => void;
  setSwitch02: (value: React.SetStateAction<boolean>) => void;
  ref_workContact: React.MutableRefObject<TimperativeHandle>;
  ref_meetingMinutes: React.MutableRefObject<TimperativeHandle_meetingMinutes>;
  //
  tab: Tquery['tab'];
  isShowPattern: boolean;
  switch02: boolean;
  disabed_workContactDoc: boolean;
  state_meeting: Tstate_meetingMinutes;
  //
  setVisible_pdf: (value: React.SetStateAction<boolean>) => void;
  setShowPdf_part: (value: React.SetStateAction<boolean>) => void;
}) => {
  const router = useRouter();

  const panel_quotation01: TpanelList = [
    // 現在後端會在合約產生時自動產生工程聯絡單，因此把這個按鈕拿掉
    (() =>
      version === '1' && engineeringContactId === null
        ? {
            type: 'myButton',
            label: '新增工程聯絡單',
            onClick: async () => {
              let isOk = true;

              try {
                setIsLoading(true);
                await apiPostEngineeringContact({ contractId: id });
                myAlert.success({ title: '新增工程聯絡單成功' });
              } catch (error) {
                const err = error as Error;
                isOk = false;
                myAlert.err({ title: '新增工程聯絡單失敗', content: err.message });
              } finally {
                setIsLoading(false);
              }

              if (isOk) {
                update();
              }
            },
          }
        : null)(),
    {
      type: 'myButton',
      label: '匯出合約',
      onClick: () => setVisible_pdf(true),
    },
    {
      type: 'myButton',
      label: '單價分析',
      onClick: () => setShowPdf_part(true),
    },
    {
      type: 'myButton',
      label: '合約審核表',
      onClick: () => setReviewFormShow(true),
    },
    {
      type: 'myButton',
      label: '追加追減報價單',
      onClick: () => setSwitch02(() => true),
    },
    {
      type: 'myButton',
      label: '追加追減',
      onClick: () => {
        if (contract) {
          router.push({
            pathname: '/domestic/contract/attachContract',
            query: {
              contractId: contract.id,
            },
          });
        }
      },
    },
    { type: 'myButton', label: '返回', onClick: () => router.back() },
  ];

  const panel_quotation03: TpanelList = [
    {
      type: 'myButton',
      label: '取消',
      onClick: () => setSwitch02(() => false),
    },
  ];

  const panel_workContack_disabled: TpanelList = [
    { type: 'myButton', label: '匯出工程聯絡單', onClick: () => ref_workContact.current.openPdf() },
    {
      type: 'myButton',
      label: '編輯工程聯絡單',
      onClick: () => {
        ref_workContact.current.setDisabled(false);
      },
    },
    { type: 'myButton', label: '返回', onClick: router.back },
  ];
  const panel_workContack: TpanelList = [
    {
      type: 'redButton',
      label: '上傳工程聯絡單',
      onClick: async () => {
        ref_workContact.current.reqPatch();
      },
    },
    {
      type: 'myButton',
      label: '取消編輯',
      onClick: () => {
        ref_workContact.current.setDisabled(true);
      },
    },
  ];

  const panel_workContack_pattern: TpanelList = [
    {
      type: 'myButton',
      label: '關閉工程圖表',
      onClick: () => {
        ref_workContact.current.closePattern();
      },
    },
  ];

  const panel_meeting_list: TpanelList = [
    {
      type: 'myButton',
      label: '新增',
      onClick: () => {
        ref_meetingMinutes.current?.add();
      },
    },
    { type: 'myButton', label: '返回', onClick: router.back },
  ];

  const panel_meeting_read: TpanelList = [
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        ref_meetingMinutes.current?.edit();
      },
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        ref_meetingMinutes.current?.toList();
      },
    },
  ];

  const panel_meeting_edit: TpanelList = [
    {
      type: 'redButton',
      label: '確定',
      onClick: () => {
        ref_meetingMinutes.current?.reqPostPatch();
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        ref_meetingMinutes.current?.cancelEdit();
      },
    },
  ];

  const panel_meeting_add: TpanelList = [
    {
      type: 'redButton',
      label: '確定',
      onClick: () => {
        ref_meetingMinutes.current?.reqPostPatch();
      },
    },
    {
      type: 'myButton',
      label: '返回',
      onClick: () => {
        ref_meetingMinutes.current?.toList();
      },
    },
  ];

  const panelListList: TpanelListList = {
    panel_quotation01,
    panel_quotation03,
    panel_workContack_disabled,
    panel_workContack,
    panel_workContack_pattern,
    panel_meeting_list,
    panel_meeting_read,
    panel_meeting_edit,
    panel_meeting_add,
  };

  const panelList = panelListRouter({
    panelListList,
    tab,
    isShowPattern,
    switch02,
    disabed_workContactDoc,
    isMeetingAdd: state_meeting.isAdd,
    isMeetingEdit: state_meeting.isEdit,
    isMeetingRead: state_meeting.isRead,
  });

  return panelList;
};

// region useTabList
const useTabList = ({
  contract,
  engineeringContactId,
  tab,
  id,
  version,
}: {
  id: string | undefined;
  engineeringContactId: string | undefined | null;
  version: string | undefined;
  contract: TquotationContractDto | undefined;
  tab: Tquery['tab'];
}) => {
  const router = useRouter();

  const tabList: TtabList = [
    {
      label: `合約編號 ${contract?.contractNumber ?? ''}`,
      isActive: tab === 'contract',
      onClick: () => {
        router.replace({
          query: {
            id,
            version,
            tab: 'contract',
          },
        });
      },
    },
    // {
    //   label: `工程聯絡單`,
    //   onClick: () => {
    //     setState_tab('contactDoc');
    //   },
    // },
    {
      label: `會議記錄`,
      isActive: tab === 'meetingMinutes',
      onClick: () => {
        router.replace({
          query: {
            id,
            version,
            tab: 'meetingMinutes',
          },
        });
      },
    },
  ];

  if (engineeringContactId) {
    tabList.splice(
      1,
      0,
      {
        label: `工程聯絡單`,
        isActive: tab === 'contactDoc',
        onClick: () => {
          router.replace({
            query: {
              id,
              version,
              tab: 'contactDoc',
            },
          });
        },
      },
      {
        label: `證明文件`,
        isActive: tab === 'certifiedDocument',
        onClick: () => {
          router.replace({
            query: {
              id,
              version,
              tab: 'certifiedDocument',
            },
          });
        },
      }
    );
  }

  return tabList;
};
