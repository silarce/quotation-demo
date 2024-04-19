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

// layout
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// composition
import MeetingMinutes_contract, {
  TimperativeHandle as TimperativeHandle_meetingMinutes,
  Tstate as Tstate_meetingMinutes,
} from 'components/composition/meetingMinutes/contract';

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
import WorkContactDoc_component, {
  TimperativeHandle,
  TonStateChange,
} from 'components/page/worksDepartment/contracList/contract/workContactDoc/workContactDoc_component';
import ContractReviewForm from 'components/page/domestic/quotation/quotation/contractReviewForm/contractReviewForm';

import Summary, {
  TsummaryControl,
  TpayInfoControl,
} from 'components/page/domestic/quotation/quotation/summary/summary';
// import QuotationSinature from 'components/page/domestic/quotation/quotationSinature';

// antd
import { Collapse } from 'antd';
const { Panel } = Collapse;

// gear
import PageHeader02, { TtagList, TpanelList, Tlink, TlinkArr } from 'components/PageHeader/PageHeader02/PageHeader02';
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
  apiGetQuotationProducts,
  apiPatchQuotationContent_id_progress,
} from 'js/api/api_quotation';
import { apiPostEngineeringContact } from 'js/api/api_engineering';

// hook
import { useProductList } from 'hooks/quotation/useProduct';

// type
import type { TquotationContentDto } from 'js/api/api_quotation';
import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

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
  const {
    id, //報價單id
    version,
  } = router.query as {
    id: string | undefined;
    version: string | undefined;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [reviewFormShow, setReviewFormShow] = useState(false);

  // -----------------------------------------------------------\
  const [isShowContract, setIsShowContract] = useState(true);
  const [isShowWorkContactDoc, setIsShowWorkContactDoc] = useState(false);
  const [isShowMeetingMinutes, setIsShowMeetingMinutes] = useState(false);

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

  // -----------------------------------------------------------

  const clearShow = () => {
    setIsShowContract(false);
    setIsShowWorkContactDoc(false);
    setIsShowMeetingMinutes(false);
  };

  const ref_workContact = useRef<TimperativeHandle>(null!);
  const ref_meetingMinutes = useRef<TimperativeHandle_meetingMinutes>(null!);

  const onWorkContactStateChange: TonStateChange = ({ disabled, isLoading, isShowPattern }) => {
    setIsShowPattern(isShowPattern);
    setDisabed_workContactDoc(disabled);
    setIsLoading_workContact(isLoading);
  };

  // =========================================================

  const { data: contract, update } = useGetContract_id_noItems_2(id as string | undefined);
  const engineeringContactId = contract?.engineeringContactId;

  useEffect(() => {
    update();
  }, [id]);

  // =========================================================

  // const [showPdf, setShowPdf] = useState(false);
  // const [showPdf_part, setShowPdf_part] = useState(false);

  // =========================================================

  /**
合約項目
選中合約版本的contnet
可以用url的version判斷
version===1 是根合約
version>1 是子合約

如果是根合約，追加追減項目就取得所有的subContract
如果是子合約，追加追減項目就取得所有比子合約版本小的subContract (包括這個子合約)

原報價項目，就是根合約的content
 */

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
    resetTrigger: content?.products,
    quotationDiscount: Number(content?.discount || '100'),
  }); // 合約項目

  const [targetProdKey, setTargetProdKey] = useState<string>('n');
  const targetProd = productList[targetProdKey];

  useEffect(() => {
    (async () => {
      if (targetProd?.id) {
        try {
          const res = await apiGetQuotationProducts(targetProd.id);
          const componentsArr = res.items?.[0].components ?? [];
          const acceArr = res.items?.[0].accessories ?? [];
          // creComList_dyna

          targetProd.creComList_dyna({ componentsArr: componentsArr });
          targetProd.creAcceList_dyna({ acceArr });
        } catch (error) {}
      }
    })();

    // apiGetQuotationProducts
  }, [targetProd]);

  // -----------------------------------------------------------------
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
  };

  const { control_signature } = useMemo(() => {
    const signatureArr: Tcontrol_signatureBar['signatureArr'] = [
      {
        label: '總經理',
        value: contract?.content?.reviewManagerEmployee?.chName ?? '',
        style: { width: '200px' },
      },
      {
        label: '應收帳款',
        value: contract?.content?.reviewCashierEmployee?.chName ?? '',
        style: { width: '200px' },
      },
      {
        label: '應收帳款',
        value: contract?.content?.reviewWorkDirectorEmployee?.chName ?? '',
        style: { width: '200px' },
      },
      {
        label: '業務主管',
        value: contract?.content?.reviewSupervisorEmployee?.chName ?? '',
        style: { width: '200px' },
      },
      {
        label: '業務',
        value: contract?.content?.reviewSalesEmployee?.chName ?? '',
        style: { width: '200px' },
      },
      {
        label: '經辦',
        value: contract?.content?.agentEmployee?.chName ?? '',
        style: { width: '200px' },
      },
    ];

    const control_signature = {
      signatureArr,
    };

    return { control_signature };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract?.content]);

  // 附件
  const { attachments, updateAttachments, domain } = useQuotation_id_attachments(content?.id);

  const [fileInfoArr, setFileInfoArr] = useState<TfileInfo[]>([]);

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

  const appendixParams = {
    fileInfoArr,
    removeFileInfo: () => {},
    toSetFileInfo: () => {},
  };

  // -----------------------------------------------------------------

  // =========================================================

  const tagList: TtagList = [
    {
      label: `合約編號 ${contract?.contractNumber ?? ''}`,
      onClick: () => {
        clearShow();
        setIsShowContract(true);
      },
    },
    {
      label: `工程聯絡單`,
      onClick: () => {
        clearShow();
        setIsShowWorkContactDoc(true);
      },
    },
    {
      label: `會議記錄`,
      onClick: () => {
        clearShow();
        setIsShowMeetingMinutes(true);
      },
    },
  ];

  if (!engineeringContactId) {
    tagList.pop();
  }

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
    {
      type: 'myButton',
      label: '編輯工程聯絡單',
      onClick: () => {
        ref_workContact.current.setDisabled(false);
      },
    },
    { type: 'myButton', label: '返回', onClick: () => router.back() },
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

  // const panelList = (() => {
  //   if (isShowWorkContactDoc) {
  //     if (isShowPattern) {
  //       return panel_workContack_pattern;
  //     }

  //     return disabed_workContactDoc ? panel_workContack_disabled : panel_workContack;
  //   }

  //   if (switch02) {
  //     return panel_quotation03;
  //   } else {
  //     return panel_quotation01;
  //   }
  // })();

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

    isShowContract,
    switch02,

    isShowWorkContactDoc,
    isShowPattern,
    disabed_workContactDoc,

    isShowMeetingMinutes,
    isMeetingAdd: state_meeting.isAdd,
    isMeetingEdit: state_meeting.isEdit,
    isMeetingRead: state_meeting.isRead,
  });

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  const [inputModalConfig, setInputModalConfig] = useState<TinputModalProps>();

  const control_profile = useMemo(() => {
    const control_profile: Tcontrol_profile = {
      quotationNumber: content?.quotationNumber ?? '',
      quotationDate: content?.quotationDate ?? '',
      isLost: {
        value: content?.isLost ?? false,
      },
      customer: {
        value: content?.customer,
        // onChange: (customer) => {
        //   const customerPhoneNumber = customer.phone || '';
        //   const contact = customer.contacts?.[0];
        //   const name = contact?.name ?? '';
        //   const phone = contact?.phone || customerPhoneNumber || '';
        //   const fax = customer.fax || '';

        //   setCustomer(customer);
        //   changeProfile('contactPerson', `${name}`);
        //   changeProfile('contactNumber', phone);
        //   changeProfile('faxNumber', fax);
        // },
        // onClear: () => {
        //   setCustomer(null);
        //   changeProfile('contactPerson', '');
        //   changeProfile('contactNumber', '');
        //   changeProfile('faxNumber', '');
        // },
      },
      itemList: {
        validityPeriod: {
          value: content?.validityPeriod ?? '',
          // onChange: (v) => changeProfile('validityPeriod', v),
        },
        projectName: {
          value: content?.projectName ?? '',
          // onChange: (v) => changeProfile('projectName', v),
        },
        county: {
          value: content?.county ?? '',
          // onChange: (v) => {
          //   changeProfile('county', v);
          //   changeProfile('district', '');
          // },
        },
        district: {
          value: content?.district ?? '',
          // onChange: (v) => changeProfile('district', v),
        },
        address: {
          value: content?.address ?? '',
          // onChange: (v) => changeProfile('address', v),
        },
        contactPerson: {
          value: content?.contactPerson ?? '',
          // onChange: (v) => changeProfile('contactPerson', v),
        },
        contactNumber: {
          value: content?.contactNumber ?? '',
          // onChange: (v) => changeProfile('contactNumber', v),
        },
        faxNumber: {
          value: content?.faxNumber ?? '',
          // onChange: (v) => changeProfile('faxNumber', v),
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

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  return (
    <SubLayer
      //
      isLoading_all={isLoading || isLoading_workContact}
      scrollToTopTrigger={[isShowWorkContactDoc, isShowPattern]}
    >
      <PageHeader02
        tagList={tagList}
        panelList={panelList}
        //  linkList={linkArr}
      />
      {/*  */}
      <div>
        {/* <ContractNode /> */}

        {isShowContract && (
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
        {isShowWorkContactDoc && engineeringContactId && (
          <div>
            <WorkContactDoc_component
              ref={ref_workContact}
              contract={contract}
              engineeringContactId={engineeringContactId}
              onStateChange={onWorkContactStateChange}
            />
          </div>
        )}

        {isShowMeetingMinutes && (
          <MeetingMinutes_contract
            //
            ref={ref_meetingMinutes}
            onStateChange={setState_meeting}
            contractIdFromProps={id}
            quotationNumber={contract?.content.quotationNumber}
          />
        )}

        <InputModal
          visible={!!inputModalConfig?.visible}
          onConfirm={inputModalConfig?.onConfirm}
          onCancel={inputModalConfig?.onCancel}
          title={inputModalConfig?.title ?? ''}
          placeholder={inputModalConfig?.placeholder}
        />

        <ContractReviewForm
          showModal={reviewFormShow}
          forbidden={true}
          close={() => setReviewFormShow(false)}
          contractIdNumber={content?.quotationNumber ?? ''}
          contractName={content?.projectName ?? ''}
          contractPrice={Number(content?.total ?? '')}
          lastestContentId={content?.id}
          verifyForm={content?.verifyForm}
          onConfirm={async () => {
            setIsLoading(true);
            await update();
            setIsLoading(false);
          }}
        />
      </div>
    </SubLayer>
  );
}

// ====================================================================
// ====================================================================
// ====================================================================

// ====================================================================
// ====================================================================
// ====================================================================

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
    resetTrigger: rootContent?.products,
    quotationDiscount: Number(rootContent?.discount || '100'),
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

const panelListRouter = ({
  panelListList,

  isShowContract,
  switch02,

  isShowWorkContactDoc,
  isShowPattern,
  disabed_workContactDoc,

  isShowMeetingMinutes,
  isMeetingAdd,
  isMeetingRead,
  isMeetingEdit,
}: {
  panelListList: TpanelListList;

  isShowContract: boolean;
  switch02: boolean;

  isShowWorkContactDoc: boolean;
  isShowPattern: boolean;
  disabed_workContactDoc: boolean;

  isShowMeetingMinutes: boolean;
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

  if (isShowContract) {
    if (switch02) {
      return panel_quotation03;
    } else {
      return panel_quotation01;
    }
  }

  if (isShowWorkContactDoc) {
    if (isShowPattern) {
      return panel_workContack_pattern;
    } else if (disabed_workContactDoc) {
      return panel_workContack_disabled;
    } else {
      return panel_workContack;
    }
  }

  if (isShowMeetingMinutes) {
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
