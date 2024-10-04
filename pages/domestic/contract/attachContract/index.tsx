// reqModify
// apiGetQuotationProducts

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
// import QuotationProfile from 'components/page/domestic/quotation/quotationProfile_old';

import QuotationProfile, {
  Tcontrol_profile,
  Tstate_profile,
  useProfile,
} from 'components/page/domestic/quotation/quotationProfile';
import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
import Table_com from 'components/page/domestic/quotation/quotation/product/table_component';
import Table_accessories from 'components/page/domestic/quotation/quotation/product/table_accessories';
import Table_others from 'components/page/domestic/quotation/quotation/product/table_others';
import Summary, {
  TsummaryControl,
  TpayInfoControl,
  useAnnoAndQr,
} from 'components/page/domestic/quotation/quotation/summary/summary';
// import Signature, { Tcontroll_signature } from 'components/page/domestic/quotation/quotationSinature_3';
import SignatureBar, { Tcontrol_signatureBar, TsignatureBarItem } from 'components/global/gear/signatureBar_v2';

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import {
  useGetContract_id_forAttach,
  apiQuotationModify,
  TcreateModifyQuotationDto,
  TcreateQuotationProductDto,
  TquotationProductDto,
  useQuotation_id_attachments,
  TquotationContentDto,
  TquotationContractDto,
} from 'js/api/api_quotation';
import { TuserDto, TcustomerDto } from 'js/api/dtoTypes';

// hook
import { Class_product } from 'hooks/quotation/useProduct';
import { useSummary, Tstate_summary } from 'components/page/domestic/quotation/hook/useSummary';

// css
import scss from 'pages/domestic/quotationList/quotation/quotation.module.scss';

import { useProductList } from 'hooks/quotation/useProduct';

import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

import { calcNTDToForeignCurrency } from 'components/page/domestic/quotation/function/utils_quotation';

// ===========================================================================

type Tstate_paymentMethodItem = { milestone: string; totalPaymentRatio: string };

// ===========================================================================

// region START

// 合約 追加追減介面
export default function AttachContract({
  //
  userInfo,
}: {
  userInfo: TuserDto | undefined;
}) {
  const router = useRouter();
  const contractId = router.query.contractId as string | undefined;

  const userEmp = userInfo?.employee;
  const userId = userEmp?.id;

  let taxRate: number | undefined = undefined;

  // ------------------------------------------------------------------------------
  // region useState

  const [isLoading, setIsLoadding] = useState(false);

  const [fileInfoArr, setFileInfoArr] = useState<TfileInfo[]>([]);

  const [targetProdKey, setTargetProdKey] = useState<string>('n');
  const [targetProdKey_attach, setTargetProdKey_attach] = useState<string>('n');

  const { state_summary, setState_summary, clearSummary } = useSummary();

  const [state_paymentMethod, setState_paymentMethod] = useState<{ milestone: string; totalPaymentRatio: string }[]>(
    []
  );

  const [verticleKeyArr_attach, setVerticleKeyArr_attach] = useState<string[]>();

  // ------------------------------------------------------------------------------

  // region useData

  const {
    data: data_contract,

    update: update_contract,
  } = useGetContract_id_forAttach(contractId);

  taxRate = data_contract?.salesTax ? 0.05 : 0;

  const formatedContent = useMemo(() => {
    if (!data_contract) {
      return undefined;
    }

    const content_copy = _.cloneDeep(data_contract.content);

    let subContracts = data_contract.subContracts;

    subContracts = _.sortBy(subContracts, 'version');

    const list: { [key: string]: TquotationProductDto } = {};

    let subTotal = 0;
    let salesTax = 0;
    let total = 0;

    subContracts.forEach((contract) => {
      subTotal += contract.content.subTotal;
      salesTax += contract.content.salesTax;
      total += contract.content.total;
      const prodArr = contract.content.products;
      prodArr.forEach((prod) => {
        list[prod.rootProductId] = prod;
      });
    });

    content_copy.products = Object.values(list);
    content_copy.subTotal = subTotal;
    content_copy.salesTax = salesTax;
    content_copy.total = total;

    return content_copy;
  }, [data_contract]);

  // ------------------------------------------------------------------

  // region USE HOOK
  //
  //
  //
  //
  //
  // region useProductList
  const {
    productList,
    prodCellConfig,
    prodKeyArr,
    // prodVKeyArr,
    setProdVKeyArr,
    addProd,
    changeProdKeyArr,
    //
    comKeyArr,
    comCellConfig,
    // changeComKeyArr,
    // comVKeyArr,
    //
    accessoriesKeyArr,
    changeAccessoriesKeyArr,
    accessoriesCellConfig,
    //
    othersKeyArr,
    othersList,
    othersCellConfig,
    changeOthersKeyArr,
    // addOthers,
    // getOthersPostBodyArr,
    // //
    subTotal: quotationProdSubTotal,
    // reset: resetClass,
    //
    calcSubTotalPrice,
    attachProdList,
    addProd_attach,
    attachAddTotal,
    attachDivTotal,
    attachTotal,
    avgDiscount_withQty,
  } = useProductList({
    productArr: formatedContent?.products,
    others: formatedContent?.others,
    averageDiscount: '100',
    resetTrigger: data_contract,
    quotationDiscount: Number(formatedContent?.discount || '100'),
    discount_fromData: Number(formatedContent?.discount || '100'),
    quotationDiscount_attach: Number(state_summary.discountRate || '100'),
    isAttach: true,
  });

  const { control_profile, state_profile, state_customer } = useProfile({
    quotationContent: data_contract?.content,
  });

  const { state_anno, state_qr, control_anno, control_qr } = useAnnoAndQr({
    quotationContent: data_contract?.content,
  });

  // 附件
  const { attachments, updateAttachments, domain } = useQuotation_id_attachments(formatedContent?.id);

  // ------------------------------------------------------------------

  // region REQUEST

  const handle_reqModify = () => {
    reqModify({
      setIsLoadding,
      router,
      data_contract,
      attachProdList,
      contractId,
      productList,
      userId,
      state_customer,
      subTotal_calced,
      salesTax_calced,
      total_calced,
      state_profile,
      state_anno,
      state_qr,
      //
      state_paymentMethod,
      state_summary,
      verticleKeyArr_attach,
      //
      discount: state_summary.discountRate,
      averageDiscount: avgDiscount_withQty,
      //
      foreignTotal,
    });
  };

  // ------------------------------------------------------------------

  // region props

  const targetProd = productList[targetProdKey];
  const targetProd_attach = attachProdList[targetProdKey_attach];

  const appendixParams = {
    fileInfoArr,
    removeFileInfo: () => {},
    toSetFileInfo: () => {},
  };

  const subTotal_ori = attachTotal ?? 0;
  const subTotal_calced = new Decimal(subTotal_ori).add(state_summary.tuneTotal || 0).toNumber();
  const salesTax_calced = Number(new Decimal(subTotal_calced).mul(taxRate).toFixed(0));
  const total_calced = new Decimal(subTotal_calced || 0).add(salesTax_calced || 0).toNumber();

  const foreignTotal = String(
    calcNTDToForeignCurrency({
      NTD: total_calced,
      foreignCurrencyToNTD: (state_summary.exchangeRate || '0') as `${number}`,
    })
  ) as `${number}`;

  const payInfoControl: TpayInfoControl = {
    payment: {
      haveTax: {
        // value: !!data?.salesTax,
        value: !!state_summary.salesTax,
        onChange: (v) => {
          // if (quotationProdSubTotal === '') {
          //   calcSubTotalPrice();
          // }
          // setTaxRate(v ? 0.05 : 0);
        },
      },

      discountRate: {
        inputAttr: {
          disabled: true,
          value: state_summary.discountRate ?? '',
          onChange: (e) => {
            setState_summary((state) => ({
              ...state,
              discountRate: e.target.value,
            }));
          },
        },
      },
      tuneTotal: {
        inputAttr: {
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
          value: subTotal_calced,
        },
      },
      salesTax: {
        inputAttr: {
          disabled: true,
          value: salesTax_calced,
        },
      },
      total: {
        inputAttr: {
          disabled: true,
          value: total_calced,
        },
      },
    },

    delivery: {
      deliveryLocation: {
        // value: data_contract?.deliveryLocation ?? '',
        value: state_summary.deliveryLocation ?? '',
        onChange: (v) => {
          setState_summary({ ...state_summary, deliveryLocation: v });
        },
      },
      deliveryDate: {
        // value: data_contract?.deliveryDate ?? '',
        value: state_summary.deliveryDate ?? '',
        onChange: (v) => {
          setState_summary({ ...state_summary, deliveryDate: v });
        },
      },
    },
    paymentMethod: {
      arr:
        state_paymentMethod.map((item, index) => {
          const { milestone, totalPaymentRatio } = item;

          const onChange = (v: string) => {
            if (v === '') {
              v = '0';
            }

            setState_paymentMethod((state) => {
              const copy = [...state];
              copy[index].totalPaymentRatio = v;

              return copy;
            });
          };

          const delSelf = () => {
            setState_paymentMethod((state) => {
              const copy = [...state];
              copy.splice(index, 1);

              return copy;
            });
          };

          return {
            label: milestone,
            value: totalPaymentRatio === '0' ? '' : totalPaymentRatio,
            onChange,
            delSelf,
          };
          //
        }) ?? [],
      addMethod: (v) => {
        setState_paymentMethod((state) => {
          const copy = [...state];
          copy.push({ milestone: v, totalPaymentRatio: '0' });

          return copy;
        });
      },
    },
    exchangeRate: {
      value: state_summary.exchangeRate,
      disabled: true,
    },
    foreignTotal: {
      value: foreignTotal,
    },
    currency: {
      value: state_summary.currency,
      disabled: true,
    },
  };

  // ___________________________________________________________________________
  // ___________________________________________________________________________
  const { control_signature } = useMemo(() => {
    const signatureArr: Tcontrol_signatureBar['signatureArr'] = [
      {
        label: '經辦',
        value: userEmp?.chName ?? '',
        style: { width: '200px' },
      },
    ];

    const control_signature = {
      signatureArr,
    };

    return { control_signature };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmp]);

  // ___________________________________________________________________________
  // ___________________________________________________________________________

  const panel: TpanelList = [
    //
    {
      type: 'redButton',
      label: '上傳',
      onClick: handle_reqModify,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        //
        router.back();
      },
    },
  ];

  // --------------------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    targetProd?.getComAndAcce();
  }, [targetProd]);

  useEffect(() => {
    (async () => {
      try {
        setIsLoadding(true);
        await update_contract();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '讀取追加追減報價單失敗', content: err.message });
      } finally {
        setIsLoadding(false);
      }
    })();
  }, [contractId]);

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

  useEffect(() => {
    if (!data_contract?.content) {
      return;
    }

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
      exchangeRate,
      foreignTotal,
      currency,
    } = data_contract?.content;

    // setAnnotation(annotations ?? []);
    // setQr(quotationRanges ?? []);
    setState_paymentMethod(_.cloneDeep(paymentMethods));

    setState_summary({
      discountRate: discount,
      tuneTotal: '',
      subTotal: String(subTotal),
      salesTax: String(salesTax),
      total: String(total),
      deliveryLocation,
      deliveryDate,
      exchangeRate: exchangeRate || '',
      foreignTotal: foreignTotal || '',
      currency: currency || 'TWD 新臺幣',
    });
  }, [data_contract?.content]);

  // ---------------------------------------------------------------------------
  // region RENDER

  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader02 tag={`合約編號 ${data_contract?.contractNumber}　建立追加追減報價單`} panelList={panel} />{' '}
      <div>
        <div className={scss.quotation}>
          {/*  */}
          <QuotationProfile control={control_profile} disabled={false} />
          {/*  */}
          <div className={classNames(scss.switchBar)}>
            <div>合約項目</div>
          </div>
          {/*  */}

          <div className={scss.tableWrapper}>
            {/* 主產品設定 */}

            <Table_prod
              disabled={true}
              exchangeDiabled={false}
              prodList={productList}
              prodCellConfig={prodCellConfig}
              prodKeyArr={prodKeyArr}
              changeProdKeyArr={changeProdKeyArr}
              addProd={addProd}
              setTargetProd={setTargetProdKey}
              // defalutVKeyArr={prodVKeyArr}
              onVKeyChange={(keyArr) => setProdVKeyArr(keyArr)}
              rowHeight="h60"
              isAttach={true}
              panelBox="resetChangeBox"
              targetProd={targetProd}
              attachTotal={attachDivTotal.toLocaleString()}
              // discountRate={data_contract?.discount ?? ''} // 報價單總折數
              // changeDiscountRate={(v) => {}}
            />

            <br />
            <br />
            <Table_com
              disabled={true}
              // comList={targetProd?.comList}
              // FIXME 之後要把型別處理好
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              comList={{ ...targetProd?.comList, ...targetProd?.subComList }}
              comCellConfig={comCellConfig}
              comKeyArr={comKeyArr}
              changeComKeyArr={() => {}}
              // defalutVKeyArr={comVKeyArr}
            />
            <br />
            <br />
            <Table_accessories
              disabled={true}
              list={targetProd?.accessoriesList}
              cellConfig={accessoriesCellConfig}
              keyArr={accessoriesKeyArr}
              changeKeyArr={changeAccessoriesKeyArr}
              // defalutVKeyArr={}
              // onVKeyChange={}
              doorModel={targetProd?.doorType}
              onSelectorConfirm={() => {}}
              // panelBox={}
              // emptyBlockWidth={}
            />
            <br />
            <br />
            {/* 其他設定 */}
            <Table_others
              disabled={true}
              list={othersList}
              cellConfig={othersCellConfig}
              keyArr={othersKeyArr}
              changeKeyArr={changeOthersKeyArr}
              add={() => {}}
            />
          </div>
          {/*  */}
          {/*  */}
          {/*  */}
          <br />
          <div className={scss.tableWrapper}>
            <Table_prod
              disabled={false}
              exchangeDiabled={true}
              prodList={attachProdList}
              prodCellConfig={prodCellConfig}
              prodKeyArr={prodKeyArr}
              // changeProdKeyArr={changeProdKeyArr}
              // addProd={addProd}
              // setTargetProd={setTargetProdKey}
              changeProdKeyArr={() => {}}
              addProd={addProd_attach}
              setTargetProd={setTargetProdKey_attach}
              defalutVKeyArr={Object.keys(attachProdList)}
              // onVKeyChange={(keyArr) => setProdVKeyArr(keyArr)}
              onVKeyChange={(keyArr) => {
                setVerticleKeyArr_attach(keyArr);
              }}
              rowHeight="h60"
              // isAttach={true}
              // panelBox="resetChangeBox"
              // targetProd={targetProd}
              attachTotal={attachAddTotal}
              isRedBorder={true}
              // discountRate={data_contract?.discount ?? ''} // 報價單總折數
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

                // const isValid = checkIsFloat(v, 3);

                // if (!isValid) {
                //   return;
                // }

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

            <br />
            <br />
            <Table_com
              disabled={false}
              // FIXME 之後要把型別處理好
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              // comList={targetProd_attach?.comList}
              comList={{ ...targetProd_attach?.comList, ...targetProd_attach?.subComList }}
              comCellConfig={comCellConfig}
              comKeyArr={comKeyArr}
              changeComKeyArr={() => {}}
              // defalutVKeyArr={Object.keys(targetProd_attach?.comList ?? {})}
              isRedBorder={true}
            />

            <br />
            <br />

            <Table_accessories
              disabled={false}
              list={targetProd_attach?.accessoriesList}
              cellConfig={accessoriesCellConfig}
              keyArr={accessoriesKeyArr}
              changeKeyArr={() => {}}
              // defalutVKeyArr={}
              // onVKeyChange={}
              doorModel={targetProd_attach?.doorType}
              onSelectorConfirm={(arr) => {
                if (targetProd_attach) {
                  targetProd_attach.addAcce(arr);
                }
              }}
              // panelBox={}
              // emptyBlockWidth={}
              isRedBorder={true}
            />
          </div>

          {/*  */}
        </div>
        {/*  */}
        {/*  */}
        <Summary
          disabled={false}
          payInfoControl={payInfoControl}
          control_anno={control_anno}
          control_qr={control_qr}
          appendixParams={appendixParams}
          avgDiscount_withQty={avgDiscount_withQty}
          disabled_file={true}
        />

        {/* 簽名 */}
        <SignatureBar
          control={control_signature}
          className={classNames('mx-[50px] mt-[130px] mb-[40px]', scss.signatureBar)}
        />
      </div>
    </SubLayer>
  );
}

// region END

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================

// region reqModify

const reqModify = async ({
  //
  setIsLoadding: setIsLading,
  router,
  data_contract,
  attachProdList,
  contractId,
  productList,
  userId,
  state_customer,
  subTotal_calced,
  salesTax_calced,
  total_calced,
  state_profile,
  state_anno,
  state_qr,
  //
  state_paymentMethod,
  state_summary,
  verticleKeyArr_attach,
  //
  discount,
  averageDiscount,
  //
  foreignTotal,
}: {
  router: ReturnType<typeof useRouter>;
  setIsLoadding: React.Dispatch<React.SetStateAction<boolean>>;
  data_contract: TquotationContractDto | undefined;
  attachProdList: {
    [key: string]: Class_product;
  };
  contractId: string | undefined;
  productList: {
    [key: string]: Class_product;
  };
  userId: string | undefined;
  state_customer: TcustomerDto | null | undefined;
  subTotal_calced: number;
  salesTax_calced: number;
  total_calced: number;
  state_profile: Tstate_profile;
  state_anno: string[];
  state_qr: string[];
  //
  state_paymentMethod: Tstate_paymentMethodItem[];
  state_summary: Tstate_summary;
  verticleKeyArr_attach: string[] | undefined;
  discount: string;
  averageDiscount: string;
  //
  foreignTotal: `${number}`;
}) => {
  try {
    setIsLading(true);

    if (!data_contract || !attachProdList || !contractId) {
      return;
    }

    // const content_copy = _.cloneDeep(data_contract.content);

    const content_copy = (() => {
      const {
        reviewSalesEmployee,
        salesReviewedAt,
        toSalesAt,
        reviewSupervisorEmployee,
        supervisorReviewedAt,
        toSupervisorAt,
        reviewWorkDirectorEmployee,
        workDirectorReviewedAt,
        toWorkDirectorAt,
        reviewManagerEmployee,
        managerReviewedAt,
        toManagerAt,
        ...content_copy
      } = _.cloneDeep(data_contract.content);
      content_copy.discount = discount;

      return content_copy;
    })();

    // const copy_shallow = {
    //   //
    //   ...content_copy,
    //   discount: discount,
    //   // 根據api文件，後端不收
    //   // 但是預防萬一，還是把這些資料清掉比較安心
    //   reviewSalesEmployee: undefined,
    //   salesReviewedAt: undefined,
    //   toSalesAt: undefined,
    //   reviewSupervisorEmployee: undefined,
    //   supervisorReviewedAt: undefined,
    //   toSupervisorAt: undefined,
    //   reviewWorkDirectorEmployee: undefined,
    //   workDirectorReviewedAt: undefined,
    //   toWorkDirectorAt: undefined,
    //   reviewManagerEmployee: undefined,
    //   managerReviewedAt: undefined,
    //   toManagerAt: undefined,
    // };

    // delete copy_shallow.reviewSalesEmployee;
    // delete copy_shallow.salesReviewedAt;
    // delete copy_shallow.toSalesAt;
    // delete copy_shallow.reviewSupervisorEmployee;
    // delete copy_shallow.supervisorReviewedAt;
    // delete copy_shallow.toSupervisorAt;
    // delete copy_shallow.reviewWorkDirectorEmployee;
    // delete copy_shallow.workDirectorReviewedAt;
    // delete copy_shallow.toWorkDirectorAt;
    // delete copy_shallow.reviewManagerEmployee;
    // delete copy_shallow.managerReviewedAt;
    // delete copy_shallow.toManagerAt;

    // 材料配件有問題的主產品
    let breakComponentProdIndex_div = '';
    let breakComponentProdIndex_attach = '';

    // 追減，要送給後端的是追減後的資料
    // 例如原本五個，追減兩個，送給後端的要是三個
    const divProdArr = (() => {
      const arr = Object.values(productList).map((item, index) => {
        if (item.isAttachDiv) {
          if (item && !item.isComponentOk) {
            breakComponentProdIndex_div = breakComponentProdIndex_div + `${index + 1} `;
          }

          return item.body_attachDiv;
        }

        return undefined;
      });

      return arr.filter((item) => !!item) as (TcreateQuotationProductDto & {
        id: string | undefined;
      })[];
    })();

    if (breakComponentProdIndex_div) {
      return myAlert.warning({
        title: '追減主產品之材料配件有誤',
        content: `請檢查第${breakComponentProdIndex_div}項主產品是否正確`,
      });
    }

    // 追加跟變更
    // const attachProdArr = Object.values(attachProdList).map((prod, index) => {
    //   if (!prod.isComponentOk) {
    //     breakComponentProdIndex_attach = breakComponentProdIndex_attach + `${index + 1} `;
    //   }

    //   return prod.body;
    // });
    // verticleKeyArr_attach
    const attachProdArr = (() => {
      if (verticleKeyArr_attach) {
        return verticleKeyArr_attach.map((key, index) => {
          const prod = attachProdList[key];

          if (!prod.isComponentOk) {
            breakComponentProdIndex_attach = breakComponentProdIndex_attach + `${index + 1} `;
          }

          const body = prod.body;
          body.order = index;
          // attachProdList裡的是追加或追加變更的主產品
          // 這兩種都不送attachedToProductId
          body.attachedToProductId = undefined;

          return body;
        });
      }

      return Object.values(attachProdList).map((prod, index) => {
        if (!prod.isComponentOk) {
          breakComponentProdIndex_attach = breakComponentProdIndex_attach + `${index + 1} `;
        }

        const body = prod.body;
        body.order = index;

        return body;
      });
    })();

    // console.log('attachProdArr', attachProdArr);

    if (breakComponentProdIndex_attach) {
      return myAlert.warning({
        title: '追加/變更主產品之材料配件有誤',
        content: `請檢查第${breakComponentProdIndex_attach}項主產品是否正確`,
      });
    }

    if (!userId) {
      return myAlert.warning({
        title: '沒有userInfo.employee.id',
      });
    }

    const customerId = state_customer?.id;

    if (!customerId) {
      return myAlert.warning({
        title: '請選擇客戶',
      });
    }

    const body: TcreateModifyQuotationDto = {
      ...content_copy,
      products: [...divProdArr, ...attachProdArr],

      // agentId: content.agentEmployee?.id,
      agentId: userId,
      // managerId: content.managerEmployee?.id,
      // supervisorId: content.supervisorEmployee?.id,
      subTotal: subTotal_calced,
      salesTax: salesTax_calced,
      total: total_calced,
      //
      // 其他設定有金錢，沒有參與追加追減，出現在追加追減報價單裡可能會被誤解
      // 應該不送才是對的
      others: [],
      discount: content_copy.discount as `${number}`,
      //

      validityPeriod: state_profile.validityPeriod ?? '',
      //
      customerId,
      //
      projectName: state_profile.projectName ?? '',
      county: state_profile.county ?? '',
      district: state_profile.district ?? '',
      address: state_profile.address ?? '',
      contactPerson: state_profile.contactPerson ?? '',
      contactNumber: state_profile.contactNumber ?? '',
      faxNumber: state_profile.faxNumber ?? '',
      trackProgress: state_profile.trackProgress ?? '',
      projectProgress: state_profile.projectProgress ?? '',
      //
      annotations: state_anno,
      quotationRanges: state_qr,
      //
      deliveryLocation: state_summary.deliveryLocation,
      deliveryDate: state_summary.deliveryDate,
      paymentMethods: state_paymentMethod,
      //
      averageDiscount,
      //
      foreignTotal,
      tuneTotal: state_summary.tuneTotal || '0',
    };

    let isDoorModalNameEmpty = false;
    body.products?.forEach((prod) => {
      if (!prod.doorModelName) {
        isDoorModalNameEmpty = true;
      }
    });

    if (isDoorModalNameEmpty) {
      myAlert.info({ title: '請確認所有主產品都有門型' });

      return;
    }

    try {
      const res = await apiQuotationModify(contractId, body);
      setIsLading(false);
      // router.back();
      router.push(`/domestic/quotationList/attachQuotation?id=${res.id}`);
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '上傳失敗', content: err.message });
    }
  } catch (error) {
    const err = error as Error;
    myAlert.err({ title: '上傳失敗', content: err.message });
  } finally {
    setIsLading(false);
  }
};

// ==============================================================================
/**

// 這段沒過期 2024-05-23
Gina說product裡面帶id，之後這個product就會有attachedToProductId

// w 以下資訊大部分應該已過期 2024-05-23
追加追減流程
在發包列表選擇合約，開始該合約的追加追減
page url
/domestic/contract/attachContract?contractId=uuid
在這個介面可以設定、編輯要 追加追減 的主產品
然後把 追加的主產品 還有 計入追加追減主產品後的 小計、營業稅、總計 送去給後端
所以要怎麼把追減的部分交給後端?
Gina說product裡面帶id，之後這個product就會有attachedToProductId
可以用這個來判斷是不是追減的產品
跟其他追加的產品同樣放在products這個property裡?
這樣是不是怪怪的? products裡面可以放虛(追減)的資料嗎
在追加追減後新增的報價單，我要怎麼呈現追減的資料?


我覺得追加追減這樣處理應該會比較直觀且簡單
在追加追減時，送給後端所有還存在的主產品
就是包括原本的主產品，還有追加的主產品

請後端在CreateModifyQuotationDto設一個property，只要可以存字串就好了
由前端這裡紀錄該次追加追減的資料，轉成JSON後送給後端紀錄，這樣後端應該也不用加開資料表

於是在追加追減比較表的追加追減項目的部分，我可以直接用這個property來呈現追加追減紀錄
合約項目的部分也可以直接取content的products，
而不用分析比較sunContract裡的資料，找出哪些是該呈現的哪些是不該呈現的



其他問題
追加追減介面一開始呈現的資料，是根合約，還是最新版的合約?
是最新版的合約的合約的話，是應該只呈現追加的主產品，還是應該呈現所有還存在的主產品?

以追加追減程序新增的報價單，是否可以被編輯?


 */
