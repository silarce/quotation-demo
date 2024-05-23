// reqModify
// apiGetQuotationProducts

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import moment from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// components
// import QuotationProfile from 'components/page/domestic/quotation/quotationProfile_old';
import QuotationProfile, { Tcontrol_profile } from 'components/page/domestic/quotation/quotationProfile';
import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
import Table_com from 'components/page/domestic/quotation/quotation/product/table_component';
import Table_accessories from 'components/page/domestic/quotation/quotation/product/table_accessories';
import Table_others from 'components/page/domestic/quotation/quotation/product/table_others';
import Summary, {
  TsummaryControl,
  TpayInfoControl,
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
} from 'js/api/api_quotation';
import { TuserDto, TcustomerDto } from 'js/api/dtoTypes';

// css
import scss from 'pages/domestic/quotationList/quotation/quotation.module.scss';

import { useProductList } from 'hooks/quotation/useProduct';

import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

// ===========================================================================

type Tstate_profile = {
  validityPeriod: string;
  projectName: string;
  county: string;
  district: string;
  address: string;
  contactPerson: string;
  contactNumber: string;
  faxNumber: string;
  trackProgress: string;
  projectProgress: string;
  isLost: boolean;
};

// ===========================================================================
// 合約 追加追減介面
export default function AttachContract({
  //
  userInfo,
}: {
  userInfo: TuserDto | undefined;
}) {
  const router = useRouter();
  const contractId = router.query.contractId as string | undefined;

  const [isLading, setIsLading] = useState(false);

  // const userId = userInfo?.employee?.id;
  const userEmp = userInfo?.employee;
  const userId = userEmp?.id;

  let taxRate: number | undefined;

  // ----------------------------------------------------

  const reviewSalesEmployeeId: string | undefined = undefined;
  const reviewWorkDirectorEmployeeId: string | undefined = undefined;
  const reviewCashierEmployeeId: string | undefined = undefined;
  const reviewSupervisorEmployeeId: string | undefined = undefined;
  const reviewManagerEmployeeId: string | undefined = undefined;

  const isReviewer = false;
  const isSales = false;
  const isWorkDirector = false;
  const isCashier = false;
  const isSupervisor = false;
  const isManager = false;

  const salesReviewedAt: string | null | undefined = undefined;
  const supervisorReviewedAt: string | null | undefined = undefined;
  const workDirectorReviewedAt: string | null | undefined = undefined;
  const cashierReviewedAt: string | null | undefined = undefined;
  const managerReviewedAt: string | null | undefined = undefined;

  const toSalesAt: string | null | undefined = undefined;
  const toSupervisorAt: string | null | undefined = undefined;
  const toWorkDirectorAt: string | null | undefined = undefined;
  const toCashierAt: string | null | undefined = undefined;
  const toManagerAt: string | null | undefined = undefined;

  const isSendToReview = false;
  const isSendToReview_pending = false;

  //
  const isAttach = undefined;
  //
  const isAllReviewedBeforePending = false;
  //
  const version: number | undefined = undefined;
  const editNotes: string | undefined = undefined;

  // ----------------------------------------------------
  const { data: data_contract, update: update_contract } = useGetContract_id_forAttach(contractId);

  taxRate = data_contract?.salesTax ? 0.05 : 0;

  useEffect(() => {
    (async () => {
      try {
        setIsLading(true);
        await update_contract();
      } catch (error) {
        const err = error as Error;
        myAlert.err({ title: '讀取追加追減報價單失敗', content: err.message });
      } finally {
        setIsLading(false);
      }
    })();
  }, [contractId]);

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
    // subTotal: quotationProdSubTotal,
    // reset: resetClass,
    //
    attachProdList,
    addProd_attach,
    attachAddTotal,
    attachDivTotal,
    attachTotal,
    avgDiscount_withQty,
  } = useProductList({
    productArr: formatedContent?.products,
    others: formatedContent?.others,
    resetTrigger: data_contract,
    quotationDiscount: Number(formatedContent?.discount || '100'),
  });

  const [targetProdKey, setTargetProdKey] = useState<string>('n');
  const targetProd = productList[targetProdKey];

  const [targetProdKey_attach, setTargetProdKey_attach] = useState<string>('n');
  const targetProd_attach = attachProdList[targetProdKey_attach];

  useEffect(() => {
    targetProd?.getComAndAcce();
  }, [targetProd]);

  // ------------------------------------------------------------------
  taxRate = 0.05;

  const subTotal_ori = attachTotal ?? 0;
  const subTotal_calced = subTotal_ori;
  const salesTax_calced = Number(new Decimal(subTotal_calced).mul(taxRate).toFixed(0));
  const total_calced = subTotal_calced + salesTax_calced;

  const payInfoControl: TpayInfoControl = {
    payment: {
      haveTax: {
        // value: !!data?.salesTax,
        value: taxRate === 0.05,
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
          value: data_contract?.discount ?? '',
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
        value: data_contract?.deliveryLocation ?? '',
        onChange: () => {},
      },
      deliveryDate: {
        value: data_contract?.deliveryDate ?? '',
        onChange: () => {},
      },
    },
    paymentMethod: {
      arr:
        data_contract?.paymentMethods.map((item) => {
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

  // 附件
  const { attachments, updateAttachments, domain } = useQuotation_id_attachments(formatedContent?.id);

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

  // ------------------------------------------------------------------

  // region USE HOOK

  const { control_profile, state_profile, state_customer } = useProfile({ content: data_contract?.content });

  const { state_anno, state_qr, control_anno, control_qr } = useAnnoAndQr({ content: data_contract?.content });

  // ------------------------------------------------------------------

  // region REQUEST

  const reqModify = async () => {
    try {
      setIsLading(true);

      if (!data_contract || !attachProdList || !contractId) {
        return;
      }

      const content_copy = _.cloneDeep(data_contract.content);
      const copy_shallow = {
        //
        ...content_copy,
        // 根據api文件，後端不收
        // 但是預防萬一，還是把這些資料清掉比較安心
        reviewSalesEmployee: undefined,
        salesReviewedAt: undefined,
        toSalesAt: undefined,
        reviewSupervisorEmployee: undefined,
        supervisorReviewedAt: undefined,
        toSupervisorAt: undefined,
        reviewWorkDirectorEmployee: undefined,
        workDirectorReviewedAt: undefined,
        toWorkDirectorAt: undefined,
        reviewManagerEmployee: undefined,
        managerReviewedAt: undefined,
        toManagerAt: undefined,
      };

      delete copy_shallow.reviewSalesEmployee;
      delete copy_shallow.salesReviewedAt;
      delete copy_shallow.toSalesAt;
      delete copy_shallow.reviewSupervisorEmployee;
      delete copy_shallow.supervisorReviewedAt;
      delete copy_shallow.toSupervisorAt;
      delete copy_shallow.reviewWorkDirectorEmployee;
      delete copy_shallow.workDirectorReviewedAt;
      delete copy_shallow.toWorkDirectorAt;
      delete copy_shallow.reviewManagerEmployee;
      delete copy_shallow.managerReviewedAt;
      delete copy_shallow.toManagerAt;

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
      const attachProdArr = Object.values(attachProdList).map((prod, index) => {
        if (!prod.isComponentOk) {
          breakComponentProdIndex_attach = breakComponentProdIndex_attach + `${index + 1} `;
        }

        return prod.body;
      });

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
        ...copy_shallow,
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
        discount: copy_shallow.discount as `${number}`,
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
        await apiQuotationModify(contractId, body);
        setIsLading(false);
        router.back();
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

  // ------------------------------------------------------------------

  // ------------------------------------------------------------------

  const panel: TpanelList = [
    //
    {
      type: 'redButton',
      label: '上傳',
      onClick: reqModify,
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

  // ==========================================================================

  // region RENDER

  return (
    <SubLayer isLoading_all={isLading}>
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
              discountRate={data_contract?.discount ?? ''} // 報價單總折數
              changeDiscountRate={(v) => {}}
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
              onVKeyChange={() => {}}
              rowHeight="h60"
              // isAttach={true}
              // panelBox="resetChangeBox"
              // targetProd={targetProd}
              attachTotal={attachAddTotal}
              isRedBorder={true}
              discountRate={data_contract?.discount ?? ''} // 報價單總折數
              changeDiscountRate={(v) => {}}
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

// region HOOK
//
//
//
//
// region USE Profile
const useProfile = ({ content }: { content: TquotationContentDto | undefined }) => {
  const [state_profile, setState_profile] = useState<Tstate_profile>(creEmptyProfile());
  const [state_customer, setState_customer] = useState<TcustomerDto | undefined | null>();

  const changeProfile = (key: keyof Omit<Tstate_profile, 'isLost'>, value: string | boolean) => {
    setState_profile((state) => {
      return {
        ...state,
        [key]: value,
      };
    });
  };

  const control_profile = useMemo(() => {
    const control_profile: Tcontrol_profile = {
      quotationNumber: content?.quotationNumber ?? '',
      quotationDate: moment().format('YYYY-MM-DD'),
      customer: {
        value: state_customer,
        onChange: (customer) => {
          const customerPhoneNumber = customer.phone || '';
          const contact = customer.contacts?.[0];
          const name = contact?.name ?? '';
          const phone = contact?.phone || customerPhoneNumber || '';
          const fax = customer.fax || '';

          setState_customer(customer);
          changeProfile('contactPerson', `${name}`);
          changeProfile('contactNumber', phone);
          changeProfile('faxNumber', fax);
        },
        onClear: () => {
          setState_customer(null);
          changeProfile('contactPerson', '');
          changeProfile('contactNumber', '');
          changeProfile('faxNumber', '');
        },
      },

      isLost: {
        value: state_profile.isLost,
        onChange: (bool) => {
          setState_profile((state) => ({ ...state, isLost: bool }));
        },
      },

      itemList: {
        validityPeriod: {
          value: state_profile.validityPeriod,
          onChange: (v) => changeProfile('validityPeriod', v),
        },
        projectName: {
          value: state_profile.projectName,
          onChange: (v) => changeProfile('projectName', v),
        },
        county: {
          value: state_profile.county,
          onChange: (v) => {
            changeProfile('county', v);
            changeProfile('district', '');
          },
        },
        district: {
          value: state_profile.district,
          onChange: (v) => changeProfile('district', v),
        },
        address: {
          value: state_profile.address,
          onChange: (v) => changeProfile('address', v),
        },
        contactPerson: {
          value: state_profile.contactPerson,
          onChange: (v) => changeProfile('contactPerson', v),
        },
        contactNumber: {
          value: state_profile.contactNumber,
          onChange: (v) => changeProfile('contactNumber', v),
        },
        faxNumber: {
          value: state_profile.faxNumber,
          onChange: (v) => changeProfile('faxNumber', v),
        },
        trackProgress: {
          value: state_profile.trackProgress,

          onChange: (v) => {
            changeProfile('trackProgress', v);
          },

          disabled: false,
        },
        projectProgress: {
          value: state_profile.projectProgress,

          onChange: (v) => {
            changeProfile('projectProgress', v);
          },

          disabled: false,
        },
      },
    };

    return control_profile;
  }, [content?.quotationNumber, state_customer, state_profile]); // memo

  useEffect(() => {
    setState_customer(content?.customer ?? null);

    setState_profile({
      validityPeriod: content?.validityPeriod ?? '',
      projectName: content?.projectName ?? '',
      county: content?.county ?? '',
      district: content?.district ?? '',
      address: content?.address ?? '',
      contactPerson: content?.contactPerson ?? '',
      contactNumber: content?.contactNumber ?? '',
      faxNumber: content?.faxNumber ?? '',
      trackProgress: content?.trackProgress ?? '',
      projectProgress: content?.projectProgress ?? '',
      isLost: content?.isLost ?? false,
    });
  }, [content]);

  //
  return {
    control_profile,
    state_profile,
    state_customer,
  };

  //
};

// region use AnnoAndQr

const useAnnoAndQr = ({ content }: { content: TquotationContentDto | undefined }) => {
  const [state_anno, setState_anno] = useState<string[]>([]);
  const [state_qr, setState_qr] = useState<string[]>([]);

  //
  const control_anno: TsummaryControl = useMemo(() => {
    const control_anno: TsummaryControl = {
      stringArr: state_anno,
      editString: (index, v) => {
        setState_anno((state) => {
          const copy = [...state];
          copy[index] = v;

          return copy;
        });
      },
      addString: (v: string) => {
        setState_anno((state) => {
          const copy = [...state];
          copy.push(v);

          return copy;
        });
      },
      delString: (index: number) => {
        setState_anno((state) => {
          const copy = [...state];
          copy.splice(index, 1);

          return copy;
        });
      },
      addStrArr: (vArr: string[]) => {
        setState_anno((state) => {
          const copy = [...state];
          copy.push(...vArr);

          return copy;
        });
      },
      replaceStrArr: (strArr: string[]) => {
        setState_anno(strArr);
      },
    };

    return control_anno;
  }, [state_anno]);

  const control_qr: TsummaryControl = useMemo(() => {
    const control_qr: TsummaryControl = {
      stringArr: state_qr,
      editString: (index, v) => {
        setState_qr((state) => {
          const copy = [...state];
          copy[index] = v;

          return copy;
        });
      },
      addString: (v: string) => {
        setState_qr((state) => {
          const copy = [...state];
          copy.push(v);

          return copy;
        });
      },
      delString: (index: number) => {
        setState_qr((state) => {
          const copy = [...state];
          copy.splice(index, 1);

          return copy;
        });
      },
      addStrArr: (vArr: string[]) => {
        setState_qr((state) => {
          const copy = [...state];
          copy.push(...vArr);

          return copy;
        });
      },
      replaceStrArr: (strArr: string[]) => {
        setState_qr(strArr);
      },
    };

    return control_qr;
  }, [state_qr]);

  //

  useEffect(() => {
    if (content) {
      const { annotations, quotationRanges } = content;
      setState_anno(annotations ?? []);
      setState_qr(quotationRanges ?? []);
    } else {
      setState_anno([]);
      setState_qr([]);
    }
  }, [content]);

  //

  return {
    state_anno,
    state_qr,
    control_anno,
    control_qr,
  };
};

// ==============================================================================

// region EMPTY

const creEmptyProfile = (): Tstate_profile => ({
  validityPeriod: '',
  projectName: '',
  county: '',
  district: '',
  address: '',
  contactPerson: '',
  contactNumber: '',
  faxNumber: '',
  trackProgress: '',
  projectProgress: '',
  isLost: false,
});

// ==============================================================================
// ==============================================================================
// ==============================================================================
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
