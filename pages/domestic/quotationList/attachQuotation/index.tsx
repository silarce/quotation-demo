// 常用變數目錄
/**
 * useProductList
 * reqUpdateQuotation
 * useGetQuotation_id
 * fileInfoArr
 * reqReview 審核
 *
 */
// =============================================================
// =============================================================
// =============================================================

// 報價單
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useRouter, NextRouter } from 'next/router';
import moment from 'moment';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';
import { AxiosError } from 'axios';

// components
import QuotationProfile, { Tcontrol_profile, useProfile } from 'components/page/domestic/quotation/quotationProfile';

import QuotationSinature_3, {
  TemployeeDto,
  Tcontroll_signature,
} from 'components/page/domestic/quotation/quotationSinature_3';
// import QuotationPdf from 'components/page/domestic/pdf/quotationPdf/quotationPdf_new';
import QuotationPdf, {
  useModalQuotationPdf,
} from 'components/page/domestic/pdf/quotationPdf/quotationPdf_new3/modal_quotationPdf';

import QuotationPdf_part, {
  TmainProduct,
  Tpart,
} from 'components/page/domestic/pdf/quotationPdf_part/quotationPdf_part';
import QuotationStateSel from 'components/page/domestic/budget/quotationStateSel';

import ContractReviewForm from 'components/page/domestic/quotation/quotation/contractReviewForm/contractReviewForm';

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import TextareaModal from 'components/global/gear/modal/simpleModal/textareaModal';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import ThreeButtonModal from 'components/global/gear/modal/simpleModal/multButtonModal';
import SignatureBar, { Tcontrol_signatureBar, TsignatureBarItem } from 'components/global/gear/signatureBar_v2';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// icon
import iconUpload from 'public/image/icon/upload.svg';
import iconRedLock from 'public/image/icon/redLock.svg';

// css
import style from './quotation.module.scss';

import { AppContext } from 'pages/_app';

// ------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------
import Table_prod from 'components/page/domestic/quotation/quotation/product/table_prod';
import Table_com from 'components/page/domestic/quotation/quotation/product/table_component';
import Table_accessories from 'components/page/domestic/quotation/quotation/product/table_accessories';
import Table_others from 'components/page/domestic/quotation/quotation/product/table_others';

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
  apiPatchQuotationToPending,
} from 'js/api/api_quotation';

import { Class_product, useProductList } from 'hooks/quotation/useProduct';

import Summary, {
  TsummaryControl,
  TpayInfoControl,
  useAnnoAndQr,
} from 'components/page/domestic/quotation/quotation/summary/summary';

// type
import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

import { TcreateQuotationProductDto, TquotationProductDto, TcustomerDto } from 'js/api/dtoTypes';

import { checkIsFloat } from 'js/utils/checkValue';

// ------------------------------------------------------------------

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

// ------------------------------------------------------------------
type Tprofile = {
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

// ------------------------------------------------------------------
export default function Quotation() {
  const router = useRouter();
  const isReady = router.isReady;

  if (!isReady) {
    return null;
  }

  return <TheQuotation router={router} />;
}

// =================================================================
// =================================================================
// =================================================================

function TheQuotation({ router }: { router: NextRouter }) {
  const {
    id: quotationId, //報價單id //若為新增報價單則為undefined
  } = router.query as { id: string | undefined };
  const { userInfo } = useContext(AppContext);
  const userId = userInfo?.employee?.id;

  // -----------------------------------------------------

  let reviewSalesEmployeeId: string | undefined = undefined;
  let reviewWorkDirectorEmployeeId: string | undefined = undefined;
  let reviewCashierEmployeeId: string | undefined = undefined;
  let reviewSupervisorEmployeeId: string | undefined = undefined;
  let reviewManagerEmployeeId: string | undefined = undefined;

  let isReviewer = false;
  let isSales = false;
  let isWorkDirector = false;
  let isCashier = false;
  let isSupervisor = false;
  let isManager = false;

  let salesReviewedAt: string | null | undefined = undefined;
  let supervisorReviewedAt: string | null | undefined = undefined;
  let workDirectorReviewedAt: string | null | undefined = undefined;
  let cashierReviewedAt: string | null | undefined = undefined;
  let managerReviewedAt: string | null | undefined = undefined;

  let toSalesAt: string | null | undefined = undefined;
  let toSupervisorAt: string | null | undefined = undefined;
  let toWorkDirectorAt: string | null | undefined = undefined;
  let toCashierAt: string | null | undefined = undefined;
  let toManagerAt: string | null | undefined = undefined;

  let isSendToReview = false;
  let isSendToReview_pending = false;

  let version: number | undefined = undefined;
  let editNotes: string | undefined = undefined;

  //
  const isAttach = true;
  //
  let isAllReviewedBeforePending = false;

  // -----------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  // 是否可編輯
  const [disabled, setDisabled] = useState(true);
  // const [disabled_reviewer, setDisabled_reviewer] = useState(true);
  const disabled_static = true;

  // -----------------------------------------------------
  const [reviewFormShow, setReviewFormShow] = useState(false);
  const [reviewModalShow, setReviewModalShow] = useState(false);
  const [showEmployeSelector, setShowEmployeSelector] = useState(false);

  // const [showPdf, setShowPdf] = useState(false);
  const [showPdf_part, setShowPdf_part] = useState(false);

  const [showMemoModal, setShowMemoModal] = useState(false);
  // -----------------------------------------------------
  const [status, setStatus] = useState<TquotationContentDto['status']>('Budget');

  // const [anno, setAnnotation] = useState<string[]>([]);
  // const [qr, setQr] = useState<string[]>([]);

  // const onDoorTypeChange = ({
  //   annoShouldRemove,
  //   annoArr,
  //   qrShouldRemove,
  //   qrArr,
  // }: {
  //   annoShouldRemove: string[] | undefined;
  //   annoArr: string[] | undefined;
  //   qrShouldRemove: string[] | undefined;
  //   qrArr: string[] | undefined;
  // }) => {
  //   setAnnotation((anno) => {
  //     let annoCopy = [...anno];

  //     // 把應該被移除拿掉
  //     if (annoShouldRemove) {
  //       annoShouldRemove.forEach((asmStr) => {
  //         const delIndex = annoCopy.findIndex((str) => asmStr === str);

  //         if (delIndex > -1) {
  //           annoCopy.splice(delIndex, 1);
  //         }
  //       });
  //     }

  //     // 先把重複的拿掉，再把新的放進去
  //     if (annoArr) {
  //       annoArr.forEach((asmStr) => {
  //         const delIndex = annoCopy.findIndex((str) => asmStr === str);

  //         if (delIndex > -1) {
  //           annoCopy.splice(delIndex, 1);
  //         }
  //       });

  //       annoCopy = [...annoCopy, ...annoArr];
  //     }

  //     return annoCopy;
  //   });

  //   setQr((qr) => {
  //     let qrCopy = [...qr];

  //     // 把應該被移除拿掉
  //     if (qrShouldRemove) {
  //       qrShouldRemove.forEach((asmStr) => {
  //         const delIndex = qrCopy.findIndex((str) => asmStr === str);

  //         if (delIndex > -1) {
  //           qrCopy.splice(delIndex, 1);
  //         }
  //       });
  //     }

  //     // 先把重複的拿掉，再把新的放進去
  //     if (qrArr) {
  //       qrArr.forEach((asmStr) => {
  //         const delIndex = qrCopy.findIndex((str) => asmStr === str);

  //         if (delIndex > -1) {
  //           qrCopy.splice(delIndex, 1);
  //         }
  //       });

  //       qrCopy = [...qrCopy, ...qrArr];
  //     }

  //     return qrCopy;
  //   });

  //   // setAnnotation(annoCopy);
  // };

  // -----------------------------------------------------
  // 資料
  const { data: quotationData, update } = useGetQuotation_id_2(quotationId as string, {
    preBuiltPopulate: ['simple', 'attached'],
  });
  const lastestContentId = quotationData?.latestContent.id;
  const latestContent = quotationData?.latestContent;
  const verifyForm = latestContent?.verifyForm;

  // --------------------------------------------------------------------

  // --------------------------------------------------------------------
  isReviewer = false;
  isSales = false;
  isWorkDirector = false;
  isSupervisor = false;
  isManager = false;

  reviewSalesEmployeeId = latestContent?.reviewSalesEmployee?.id;
  reviewWorkDirectorEmployeeId = latestContent?.reviewWorkDirectorEmployee?.id;
  reviewCashierEmployeeId = latestContent?.reviewCashierEmployee?.id;
  reviewSupervisorEmployeeId = latestContent?.reviewSupervisorEmployee?.id;
  reviewManagerEmployeeId = latestContent?.reviewManagerEmployee?.id;

  salesReviewedAt = latestContent?.salesReviewedAt;
  supervisorReviewedAt = latestContent?.supervisorReviewedAt;
  workDirectorReviewedAt = latestContent?.workDirectorReviewedAt;
  cashierReviewedAt = latestContent?.cashierReviewedAt;
  managerReviewedAt = latestContent?.managerReviewedAt;

  toSalesAt = latestContent?.toSalesAt;
  toSupervisorAt = latestContent?.toSupervisorAt;
  toWorkDirectorAt = latestContent?.toWorkDirectorAt;
  toCashierAt = latestContent?.toCashierAt;
  toManagerAt = latestContent?.toManagerAt;

  editNotes = latestContent?.editNotes;

  let agentEmployee: TemployeeDto | undefined | null;

  if (!quotationId) {
    agentEmployee = userInfo?.employee;
  } else {
    agentEmployee = latestContent?.agentEmployee;
  }

  isSendToReview = !!(toSalesAt || toSupervisorAt || toWorkDirectorAt || toCashierAt || toManagerAt);
  isSendToReview_pending = !!(toSupervisorAt || toWorkDirectorAt || toCashierAt || toManagerAt);

  version = latestContent?.version;
  editNotes = latestContent?.editNotes;

  if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
    if (salesReviewedAt && supervisorReviewedAt && managerReviewedAt) {
      isAllReviewedBeforePending = true;
    }
  }

  if (userId) {
    if (userId === reviewSalesEmployeeId && toSalesAt) {
      isSales = true;
      isReviewer = true;
    } else if (userId === reviewSupervisorEmployeeId && toSupervisorAt) {
      if (salesReviewedAt) {
        isSupervisor = true;
        isReviewer = true;
      }
    } else if (userId === reviewWorkDirectorEmployeeId && toWorkDirectorAt) {
      if (salesReviewedAt && supervisorReviewedAt) {
        isWorkDirector = true;
        isReviewer = true;
      }
    } else if (userId === reviewCashierEmployeeId && toCashierAt) {
      if (salesReviewedAt && supervisorReviewedAt && toWorkDirectorAt) {
        isCashier = true;
        isReviewer = true;
      }
    } else if (
      userId === reviewManagerEmployeeId ||
      // 總經理ID
      userId === '01f55698-49bb-4501-b432-1157a5109554'
    ) {
      if (status !== 'Pending' && salesReviewedAt && supervisorReviewedAt) {
        isManager = true;
        isReviewer = true;
      } else if (salesReviewedAt && workDirectorReviewedAt && supervisorReviewedAt) {
        isManager = true;
        isReviewer = true;
      }
    }
  }

  // 如果是準合約，如果業務與業務主管為同一人，視為業務主管
  // 因為在準合約時業務預設為已審核過(salesReviewedAt不為null)所以可以這樣處理
  if (status === 'Pending') {
    if (userId === reviewSupervisorEmployeeId) {
      isSupervisor = true;
      isSales = false;
      isReviewer = true;
    }
  }

  // --------------------------------------------------------------------
  const { contractArr, contentArr, contentProdList } = useMemo(() => {
    if (!quotationData) {
      return {};
    }

    const latestContent = quotationData.latestContent;
    const attachedToContract = quotationData.attachedToContract;
    let subContracts = attachedToContract?.subContracts;
    subContracts = _.sortBy(subContracts, 'version');
    // 主合約與所有子合約的主產品，迭代後的列表
    const latestVersionProductList: { [key: string]: TquotationProductDto } = {};

    subContracts?.forEach((item) => {
      const prod = item.content.products;
      prod.forEach((item) => {
        latestVersionProductList[item.rootProductId] = item;
      });
    });

    /**
latestVersionProductList為所有主產品迭代後的結果
latestContentProdArr為這次追加追減的主產品
有rootProductId的prod代表是追減而來的主產品，簡稱追減主產品
將 latestVersionProductList[追減主產品.rootProductId].quantity
減掉 追減主產品.quantity 即可得到 追減主產品的reduceQty

    */

    const latestContentProdArr = latestContent?.products;

    // 上面的，被追減的主產品
    const contractProdList: { [key: string]: TquotationProductDto } = {};
    // 下面的，追加的主產品
    const contentProdList: { [key: string]: TquotationProductDto } = {};

    latestContentProdArr?.forEach((prod) => {
      const { rootProductId, quantity } = prod;

      if (latestVersionProductList[rootProductId]) {
        const latestVersionQty = latestVersionProductList[rootProductId].quantity;
        contractProdList[rootProductId] = _.cloneDeep(latestVersionProductList[rootProductId]);
        contractProdList[rootProductId].reduceQty = latestVersionQty - quantity;
      } else {
        contentProdList[rootProductId] = prod;
      }
    });

    return {
      contractArr: Object.values(contractProdList),
      contentArr: Object.values(contentProdList),
      contentProdList,
    };
  }, [quotationData]);

  const {
    visible: pdfModalVisible,
    setVisible: setPdfModalVisible,
    pdfData,
  } = useModalQuotationPdf({
    quotationContent: quotationData?.latestContent,
    attachedProdArr: [...(contractArr ?? []), ...(contentArr ?? [])],
  });

  // -----------------------------------------------------
  // -----------------------------------------------------
  // -----------------------------------------------------
  // -----------------------------------------------------
  // -----------------------------------------------------

  const { attachments, updateAttachments, domain } = useQuotation_id_attachments(lastestContentId);

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

  const removeFileInfo = (index: number) => {
    fileInfoArr[index].willDelete = true;
    setFileInfoArr([...fileInfoArr]);
    // removeFile(index)
  };

  const toSetFileInfo = (newImgInfoArr: TfileInfo[]) => {
    setFileInfoArr([...newImgInfoArr]);
  };

  const uploadAttachment = async (newContentId: string) => {
    // 移除附件
    for (const info of fileInfoArr) {
      const { fileId, willDelete, isNew } = info;

      if (!fileId || !willDelete || isNew) {
        continue;
      }

      try {
        await apiDelQuotation_id_attachments(newContentId, fileId);
      } catch (error) {
        console.log(error);
      }
    }

    // 上傳附件
    for (const info of fileInfoArr) {
      const { fileId, willDelete, isNew, file } = info;

      if (fileId || !file || willDelete || !isNew) {
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        await apiPostQuotation_id_attachments(newContentId, formData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const appendixParams = {
    fileInfoArr,
    removeFileInfo,
    toSetFileInfo,
  };

  // -----------------------------------------------------

  // -----------------------------------------------------

  useEffect(() => {
    setStatus(latestContent?.status ?? 'Budget');
    // setEditNotes(latestContent?.editNotes ?? '');
  }, [quotationData, disabled]);

  const { control_profile, state_profile, state_customer } = useProfile({
    quotationContent: quotationData?.latestContent,
    disabled,
  });

  const { state_anno, state_qr, control_anno, control_qr } = useAnnoAndQr({
    quotationContent: quotationData?.latestContent,
    disabled,
  });

  // -----------------------------------------------------
  // -----------------------------------------------------
  // -----------------------------------------------------

  const [state_summary, setState_Summary] = useState<{
    discountRate: string;
    tuneTotal: string;
    subTotal: string;
    salesTax: string;
    total: string;
    deliveryLocation: string;
    deliveryDate: string;
  }>({
    discountRate: '100',
    tuneTotal: '',
    subTotal: '',
    salesTax: '',
    total: '',
    deliveryLocation: '',
    deliveryDate: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<{ milestone: string; totalPaymentRatio: string }[]>([]);

  // -----------------------------------------------------

  // region useProductList

  const {
    productList,
    prodCellConfig,
    prodKeyArr,
    prodVKeyArr,
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
    addOthers,
    getOthersPostBodyArr,
    //
    // subTotal: quotationProdSubTotal,
    reset: resetClass,
    //
    attachProdList,
    addProd_attach,
    attachAddTotal,
    attachDivTotal,
    attachTotal,
    avgDiscount_withQty,
  } = useProductList({
    productArr: contractArr,
    others: quotationData?.latestContent.others,
    resetTrigger: contractArr,
    // onDoorTypeChange: onDoorTypeChange,
    productArr_attach: contentArr,
    quotationDiscount: Number(state_summary.discountRate || '100'),
  });

  const [targetProdKey, setTargetProdKey] = useState<string>('n');
  const targetProd = productList[targetProdKey];

  const [targetProdKey_attach, setTargetProdKey_attach] = useState<string>('n');
  const targetProd_attach = attachProdList[targetProdKey_attach];

  useEffect(() => {
    if (!productList) {
      return;
    }

    Object.values(productList).forEach((prod) => {
      const childContent = prod.id ? contentProdList?.[prod.id] : undefined;
      const qty = childContent?.quantity ? childContent?.quantity : undefined;

      if (qty !== undefined) {
        prod.reduceQty = String(Number(prod.quantity) - qty);
      }
    });
  }, [productList]);

  // -------------------------------------------------------
  // -------------------------------------------------------
  // -------------------------------------------------------

  useEffect(() => {
    if (!quotationData) {
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
    } = quotationData.latestContent;

    // setAnnotation(annotations ?? []);
    // setQr(quotationRanges ?? []);
    setPaymentMethod(paymentMethods);

    setState_Summary({
      discountRate: discount,
      tuneTotal,
      subTotal: String(subTotal),
      salesTax: String(salesTax),
      total: String(total),
      deliveryLocation,
      deliveryDate,
    });
  }, [quotationData]);

  useEffect(() => {
    // 進入page後會自動計算attachTotal
    // 所以沒有報價單那邊那樣的的問題

    const { subTotal, salesTax, total } = countPayInfoValue({
      // discount: summary.discountRate,
      tuneTotal: state_summary.tuneTotal,
      prodSubTotal: attachTotal,
    });

    setState_Summary((state) => {
      return {
        ...state,
        subTotal,
        salesTax,
        total,
      };
    });
  }, [
    // summary.discountRate,
    state_summary.tuneTotal,
    attachTotal,
  ]);

  //
  //
  //

  // const control_anno: TsummaryControl = {
  //   stringArr: anno,
  //   editString: (index, v) => {
  //     setAnnotation((state) => {
  //       const copy = [...state];
  //       copy[index] = v;

  //       return copy;
  //     });
  //   },
  //   addString: (v: string) => {
  //     setAnnotation((state) => {
  //       const copy = [...state];
  //       copy.push(v);

  //       return copy;
  //     });
  //   },
  //   delString: (index: number) => {
  //     setAnnotation((state) => {
  //       const copy = [...state];
  //       copy.splice(index, 1);

  //       return copy;
  //     });
  //   },
  //   addStrArr: (vArr: string[]) => {
  //     setAnnotation((state) => {
  //       const copy = [...state];
  //       copy.push(...vArr);

  //       return copy;
  //     });
  //   },
  //   replaceStrArr: (strArr: string[]) => {
  //     setAnnotation(strArr);
  //   },
  // };

  // const control_qr: TsummaryControl = {
  //   stringArr: qr,
  //   editString: (index, v) => {
  //     setQr((state) => {
  //       const copy = [...state];
  //       copy[index] = v;

  //       return copy;
  //     });
  //   },
  //   addString: (v: string) => {
  //     setQr((state) => {
  //       const copy = [...state];
  //       copy.push(v);

  //       return copy;
  //     });
  //   },
  //   delString: (index: number) => {
  //     setQr((state) => {
  //       const copy = [...state];
  //       copy.splice(index, 1);

  //       return copy;
  //     });
  //   },
  //   addStrArr: (vArr: string[]) => {
  //     setQr((state) => {
  //       const copy = [...state];
  //       copy.push(...vArr);

  //       return copy;
  //     });
  //   },
  //   replaceStrArr: (strArr: string[]) => {
  //     setQr(strArr);
  //   },
  // };

  // ----------------------------------------------------------------------
  const payInfoControl: TpayInfoControl = {
    payment: {
      haveTax: {
        // value: !!taxRate,
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
          disabled: disabled_static,
          value: state_summary.discountRate,
          onChange: (e) => {
            let v = e.target.value;
            setState_Summary((state) => {
              const copy = { ...state };

              if ((v as string) === '') {
                v = '0';
              }

              if (Number(v) > 500) {
                v = '500';
              }

              if (v.split('.')[1]?.length > 3) {
                return copy;
              }

              copy.discountRate = v;

              return copy;
            });
          },
        },
      },
      tuneTotal: {
        inputAttr: {
          disabled: disabled,
          value: state_summary.tuneTotal,
          onChange: (e) => {
            const value_num = Number(e.target.value);

            if (Math.abs(value_num) > 10) {
              return;
            }

            setState_Summary((state) => ({
              ...state,
              tuneTotal: e.target.value,
            }));
          },
        },
      },
      subTotal: {
        inputAttr: {
          disabled: disabled_static,
          value: state_summary.subTotal,
        },
      },
      salesTax: {
        inputAttr: {
          disabled: disabled_static,
          value: state_summary.salesTax,
        },
      },
      total: {
        inputAttr: {
          disabled: disabled_static,
          value: state_summary.total,
        },
      },
    },

    delivery: {
      deliveryLocation: {
        value: state_summary.deliveryLocation,
        onChange: (v) => {
          setState_Summary((state) => {
            const copy = { ...state };
            copy.deliveryLocation = v;

            return copy;
          });
        },
      },
      deliveryDate: {
        value: state_summary.deliveryDate,
        onChange: (v) => {
          setState_Summary((state) => {
            const copy = { ...state };
            copy.deliveryDate = v;

            return copy;
          });
        },
      },
    },
    paymentMethod: {
      arr: paymentMethod.map((item, index) => {
        const { milestone, totalPaymentRatio } = item;

        const onChange = (v: string) => {
          if (v === '') {
            v = '0';
          }

          setPaymentMethod((state) => {
            const copy = [...state];
            copy[index].totalPaymentRatio = v;

            return copy;
          });
        };

        const delSelf = () => {
          setPaymentMethod((state) => {
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
      }),
      addMethod: (v) => {
        setPaymentMethod((state) => {
          const copy = [...state];
          copy.push({ milestone: v, totalPaymentRatio: '' });

          return copy;
        });
      },
    },
  };

  // ----------------------------------------------------------------

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await Promise.all([update(), updateAttachments()]);
      } catch (error) {}

      setIsLoading(false);
    })();
  }, [quotationId]);

  const { control_signature, defaultSeletedDataArrArr, dynaSelectorPropsList } = useMemo(() => {
    const signatureArr: Tcontrol_signatureBar['signatureArr'] = [
      {
        label: '總經理',
        value: quotationData?.latestContent.reviewManagerEmployee?.chName,
        style: { width: '200px' },
      },
      {
        label: '應收帳款',
        value: quotationData?.latestContent.reviewCashierEmployee?.chName,
        style: { width: '200px' },
      },
      {
        label: '應收帳款',
        value: quotationData?.latestContent.reviewWorkDirectorEmployee?.chName,
        style: { width: '200px' },
      },
      {
        label: '業務主管',
        value: quotationData?.latestContent.reviewSupervisorEmployee?.chName,
        style: { width: '200px' },
      },
      {
        label: '業務',
        value: quotationData?.latestContent.reviewSalesEmployee?.chName,
        style: { width: '200px' },
      },
      {
        label: '經辦',
        value: agentEmployee?.chName,
        style: { width: '200px' },
      },
    ];

    if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
      signatureArr.splice(1, 2);
    }

    if (status === 'Pending') {
      signatureArr.splice(5, 1);
    }

    const control_signature = {
      signatureArr,
    };

    const defaultSeletedDataArrArr: Parameters<typeof EmployeeSelectorGroup>[0]['defaultSeletedDataArrArr'] = [
      quotationData?.latestContent.reviewSalesEmployee ? [quotationData.latestContent.reviewSalesEmployee] : undefined,
      quotationData?.latestContent.reviewSupervisorEmployee
        ? [quotationData.latestContent.reviewSupervisorEmployee]
        : undefined,
    ];

    const dynaSelectorPropsList: Parameters<typeof EmployeeSelectorGroup>[0]['dynaSelectorPropsList'] = [{}, {}];

    if (status === 'Pending' && dynaSelectorPropsList[0]) {
      dynaSelectorPropsList[0].isSkip = true;
    }

    return { control_signature, defaultSeletedDataArrArr, dynaSelectorPropsList };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, quotationData?.latestContent]);

  // --------------------------------------------------------------------------

  const inputModalOnConfirm = (v: string) => {
    if (!v) {
      return myAlert.warning({ title: '請輸入註解' });
    }

    setShowMemoModal(false);
    reqUpdateQuotation({ editNotes: v });
  };

  const history = useMemo(() => {
    let content = quotationData?.contents ?? [];

    if (content) {
      content = _.sortBy(content, (item) => item.createdAt);
    }

    return content.map((item, index, arr) => {
      const { status, quotationDate, createdAt } = item;
      const preStatus = arr[index - 1]?.status;

      return {
        state_from: quotationStatusLookup[preStatus] ?? '建立',
        state_to: quotationStatusLookup[status] ?? '',
        isoString: moment(createdAt).toISOString(),
      };
    });
  }, [quotationData]);

  // optionQuotationState
  const panel_editable: TpanelList = [
    {
      // 報價/歷史狀態狀態
      custom: (
        <QuotationStateSel
          quotationState={{ value: status, label: quotationStatusLookup[status] }}
          setQuotationState={(option) => {
            setStatus(option.value as TquotationContentDto['status']);
          }}
          history={history}
        />
      ),
    },
    { type: 'redButton', label: '上傳', onClick: () => setShowMemoModal(true) },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
        resetClass();
        setTargetProdKey('n');
      },
    },
  ];
  const panel_noEditable: TpanelList = [
    {
      type: 'myButton',
      label: '匯出報價單',
      img: iconUpload.src,
      onClick: () => setPdfModalVisible(true),
    },
    {
      type: 'myButton',
      label: '匯出材料/配件',
      img: iconUpload.src,
      onClick: () => setShowPdf_part(true),
    },
    isAllReviewedBeforePending && quotationId
      ? {
          type: 'redButton',
          label: '轉為準合約',
          onClick: () => {
            myAlert.confirm({
              title: '確定轉為準合約',
              props: {
                onOk: () => {
                  reqToPending();
                },
              },
            });
          },
        }
      : null,

    (!!isReviewer || null) && {
      type: 'myButton',
      label: '審核',
      onClick: () => setReviewModalShow(true),
    },

    quotationId
      ? {
          type: 'myButton',
          label: '送審',
          onClick: () => {
            if (status === 'Pending' && !verifyForm) {
              return myAlert.warning({ title: '請先送出合約審核表' });
            }

            if (status === 'Pending' && toSupervisorAt) {
              myAlert.info({ title: '此報價單已經送審，不可以變更審核人員' });
            } else if (status !== 'Pending' && (toSalesAt || toSupervisorAt)) {
              myAlert.info({ title: '此報價單已經送審，不可以變更業務與業務主管' });
            } else {
              setShowEmployeSelector(true);
            }

            if (status === 'Pending') {
              myAlert.info({
                title: '送審後合約審核表將被鎖定',
                content: '建議先確認合約審核表是否正確',
                props: { width: 450 },
              });
            }
          }, // onClick close
        }
      : null,

    (() => {
      if (status === 'Pending') {
        return { type: 'myButton', label: '合約審核表', onClick: () => setReviewFormShow(true) };
      } else {
        return null;
      }
    })(),

    status === 'Pending'
      ? {
          type: 'myButton',
          label: '解除鎖定',
          img: iconRedLock.src,
          onClick: () => {
            myAlert.confirm({
              title: '確定要解除鎖定?',
              content: '此報價單將需要重新送審並回到發包狀態',
              props: {
                onOk: () => {
                  reqUnlock();
                },
              },
            });
          },
        }
      : null,

    { type: 'myButton', label: '編輯', onClick: () => setDisabled(false) },

    { type: 'myButton', label: '返回', onClick: () => router.back() },
  ];

  // const panel_editReviewer: TpanelList = [
  //   {
  //     type: 'redButton',
  //     label: '送審',
  //     onClick: () => {
  //       reqPatchReviewer();
  //     },
  //   },
  //   {
  //     type: 'myButton',
  //     label: '取消',
  //     onClick: () => setDisabled_reviewer(true),
  //   },
  // ];

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  // region REQUEST

  const reqUpdateQuotation = async ({ editNotes }: { editNotes: string }) => {
    if (!userId) {
      return myAlert.warning({ title: '沒有使用者ID' });
    }

    // 總樘數
    const prodQty = 0;
    let isDoorModalNameEmpty = false;

    // ---------------------------------------------------------
    // 材料配件有問題的主產品
    let breakComponentProdIndex_div = '';
    let breakComponentProdIndex_attach = '';

    // 要送給後端的是quanity扣掉reduceQty後的prod
    const divProdArr = (() => {
      const arr = Object.values(productList).map((item, index) => {
        if (item && !item.isComponentOk) {
          breakComponentProdIndex_div = breakComponentProdIndex_div + `${index + 1} `;
        }

        // 這個page的主產品介面，新增與複製都被鎖住了，所以不需要判斷isAttachDiv
        return item.body_attachDiv;

        // if (item.isAttachDiv) {
        //   return item.body_attachDiv;
        //   // return item.body;
        // }
        // return undefined;
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

    /**
      FIXME 有id的話後端不收
      {"message":"欲更新的product不可帶Id","error":"Bad Request","statusCode":400}
      所以把id拿掉
      但是更新後的資料，
      原本的attachedToProductId變成null
      rootProductId也變成新的prod的id
      追減追蹤鍊斷掉了
     */
    let products = [...divProdArr, ...attachProdArr];
    products = products.map((item) => {
      item.id = undefined;

      if (!item.doorModelName) {
        isDoorModalNameEmpty = true;
      }

      return item;
    });

    if (isDoorModalNameEmpty) {
      return myAlert.warning({ title: '請確認所有主產品都有門型' });
    }

    // ---------------------------------------------------------
    if (!agentEmployee?.id) {
      return myAlert.err({ title: '沒有取得經辦資料', content: '請聯絡開發人員' });
    }

    const body: TcreateQuotationContentDto = {
      quotationDate: latestContent?.quotationDate ?? '',
      validityPeriod: state_profile.validityPeriod ?? '',
      //
      customerId: state_customer?.id ?? '',
      //
      projectName: state_profile.projectName ?? '',
      county: state_profile.county ?? '',
      district: state_profile.district ?? '',
      address: state_profile.address ?? '',
      contactPerson: state_profile.contactPerson ?? '',
      contactNumber: state_profile.contactNumber ?? '',
      quantity: prodQty ?? 0,
      editNotes: editNotes ?? '',
      status: status ?? 'Budget',

      // managerId: latestContent.managerEmployee?.id ?? null,
      // supervisorId: data_watch.supervisorEmployee?.id ?? null,
      //
      agentId: userId,
      //
      //
      annotations: state_anno,
      quotationRanges: state_qr,
      //
      //
      faxNumber: state_profile.faxNumber ?? '',
      trackProgress: state_profile.trackProgress ?? '',
      projectProgress: state_profile.projectProgress ?? '',

      discount: `${Number(state_summary.discountRate ?? 0)}` ?? '100',
      tuneTotal: state_summary.tuneTotal ?? '0',
      subTotal: Number(state_summary.subTotal.replaceAll(',', '')),
      salesTax: Number(state_summary.salesTax.replaceAll(',', '')),
      total: Number(state_summary.total.replaceAll(',', '')),
      deliveryLocation: state_summary.deliveryLocation,
      deliveryDate: state_summary.deliveryDate,
      paymentMethods: paymentMethod,
      //
      //
      // products: [...prodArr, ...attachProdArr],
      products: products,
      others: getOthersPostBodyArr(),
      // productsOrder: null,
      //
      //
      isLost: state_profile.isLost ?? false,
    };

    if (!body.customerId) {
      return myAlert.warning({ title: '請選擇客戶' });
    }

    if (!body.deliveryDate) {
      body.deliveryDate = null;
    }

    let hasSurface = true;
    body.products.forEach((item) => {
      if (!item.materialSurface) {
        hasSurface = false;
      }
    });

    if (!hasSurface) {
      return myAlert.warning({ title: '所有主產品必須選擇表面' });
    }

    try {
      setIsLoading(true);

      if (quotationId) {
        const res = await apiPatchQuotation(body, quotationId);
        showRootLoading(true, '正在更新附件');
        await uploadAttachment(res.latestContent.id);
        await Promise.all([update(), updateAttachments()]);
      } else {
        const res = await apiPostQuotation(body);
        showRootLoading(true, '正在更新附件');
        await uploadAttachment(res.latestContent.id);
        router.push({
          query: {
            id: res.id,
          },
        });
      }

      setDisabled(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      showRootLoading(false);
    }
  }; // reqUpdateQuotation

  // --------------------------------------------

  const reqReview = async (isPass: boolean) => {
    if (!quotationId || !isReviewer) {
      return;
    }

    const body = {
      reviewSalesEmployeeId: isSales ? userId : null,
      reviewSupervisorEmployeeId: isSupervisor ? userId : null,
      reviewWorkDirectorEmployeeId: isWorkDirector ? userId : null,
      reviewCashierEmployeeId: isCashier ? userId : null,
      reviewManagerEmployeeId: isManager ? userId : null,
      reviewResult: isPass,
    };

    if (status === 'Pending' && !verifyForm) {
      if (isPass) {
        return myAlert.warning({ title: '請先送出合約審核表' });
      }
    }

    if (status === 'Pending') {
      if (
        !reviewSalesEmployeeId ||
        !reviewWorkDirectorEmployeeId ||
        !reviewCashierEmployeeId ||
        !reviewSupervisorEmployeeId
      ) {
        return myAlert.warning({ title: '請先設定所有審核人員' });
      }
    }

    const shouldDirect = isManager && status === 'Pending';

    if (isSales && salesReviewedAt && body.reviewResult) {
      return myAlert.warning({ title: '您已經審核過此報價單' });
    } else if (isSupervisor && supervisorReviewedAt && body.reviewResult) {
      return myAlert.warning({ title: '您已經審核過此報價單' });
    } else if (isWorkDirector && workDirectorReviewedAt && body.reviewResult) {
      return myAlert.warning({ title: '您已經審核過此報價單' });
    } else if (isCashier && cashierReviewedAt && body.reviewResult) {
      return myAlert.warning({ title: '您已經審核過此報價單' });
    } else if (isManager && managerReviewedAt && body.reviewResult) {
      return myAlert.warning({ title: '您已經審核過此報價單' });
    }

    try {
      setIsLoading(true);
      await apiQuotationReview({ id: quotationId, body });

      if (shouldDirect) {
        router.push({
          pathname: '/domestic/contract',
        });
      } else {
        await update();
      }
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '審核發生錯誤', content: err.message });
      console.log(error);
    } finally {
      setIsLoading(false);
      setReviewModalShow(false);
    }
  };

  // 送審
  const reqPatchReviewer = async ({
    sales,
    supervisor,
  }: {
    sales: TemployeeDto | undefined;
    supervisor: TemployeeDto | undefined;
  }) => {
    if (!quotationId) {
      return;
    }

    const reviewSalesEmployeeId = sales?.id ?? null;
    const reviewSupervisorEmployeeId = supervisor?.id ?? null;

    if (status === 'Pending' && !reviewSalesEmployeeId) {
      return myAlert.err({ title: '沒有業務' });
    }

    if (!reviewSalesEmployeeId || !reviewSupervisorEmployeeId) {
      return myAlert.info({ title: '請選擇所有審核人員' });
    }

    try {
      setIsLoading(true);
      await apiQuotationSubmitReview(quotationId, {
        reviewSalesEmployeeId,
        reviewSupervisorEmployeeId,
      });
      await update();
      setShowEmployeSelector(false);
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '更新審核人員失敗', content: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const reqUnlock = async () => {
    if (!quotationId) {
      return;
    }

    try {
      setIsLoading(true);
      await apiQuotationUnlock(quotationId);
      await update();
      myAlert.success({ title: '解除鎖定成功' });
      router.push({
        query: {
          ...router.query,
          status: 'Contracting',
        },
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      myAlert.err({ title: '解除鎖定發生錯誤', content: err.response?.data.message });
    } finally {
      setIsLoading(false);
    }
  };

  // 轉為準合約
  const reqToPending = async () => {
    if (!lastestContentId) {
      return;
    }

    if (!isAllReviewedBeforePending) {
      myAlert.info({ title: '此報價單尚未審核完畢' });

      return;
    }

    if (status === 'Pending') {
      myAlert.info({ title: '此報價單已經是準合約' });
    }

    if (status === 'Contract') {
      myAlert.info({ title: '此報價單已是合約' });
    }

    try {
      setIsLoading(true);
      await apiPatchQuotationToPending({ contentId: lastestContentId });
      await update();
      router.push({
        query: {
          ...router.query,
          status: 'Pending',
        },
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  const pdfPartPropsArr = useMemo(() => {
    const pdfPartPropsArr_productList = extractPdfPartFromClassProduct({
      quotationNumber: latestContent?.quotationNumber ?? '無報價編號',
      productList,
    });

    const pdfPartPropsArr_attachProductList = extractPdfPartFromClassProduct({
      quotationNumber: latestContent?.quotationNumber ?? '無報價編號',
      productList: attachProdList,
    });

    return [...pdfPartPropsArr_productList, ...pdfPartPropsArr_attachProductList];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachProdList, productList]);

  // --------------------------------------------------------------------------

  const panelList = (() => {
    if (disabled) {
      return panel_noEditable;
    } else {
      return panel_editable;
    }
  })();

  const VersionLabel = () => {
    return (
      <div className="ml-2 mb-1 mt-auto">
        <div>版本 : {version}</div>
        <div>
          {/* 總計 : {latestContent?.total ? latestContent.total.toLocaleString() : ''} */}
          小計 : {state_summary.subTotal}　 營業稅: {state_summary.salesTax}　 總計 : {state_summary.total}
          {/*  */}
        </div>
      </div>
    );
  };

  const customeLeft: React.ReactNode[] = [<VersionLabel key="0" />];

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  // region RENDER

  return (
    <div className={classNames(style.container, 'relative')}>
      {/* <PageHeader02 tagList={tagList} panelList={!disabled ? panel_editable : panel_noEditable} /> */}
      <PageHeader02
        tag={`報價編號 ${quotationData?.latestContent.quotationNumber || ''}　追加追減報價單`}
        customeLeft={customeLeft}
        panelList={panelList}
      />

      <div className={style.mainContainer}>
        <div className={style.quotation}>
          {/* 基本資料 */}
          <QuotationProfile disabled={disabled} control={control_profile} editNotes={editNotes} />

          <div className={classNames(style.switchBar)}>
            <div>報價項目</div>
          </div>

          <div className={style.tableWrapper}>
            {/* 主產品設定 */}
            <Table_prod
              disabled={isAttach ? true : disabled_static}
              exchangeDiabled={disabled_static}
              prodList={productList}
              prodCellConfig={prodCellConfig}
              prodKeyArr={prodKeyArr}
              changeProdKeyArr={changeProdKeyArr}
              addProd={addProd}
              setTargetProd={setTargetProdKey}
              // defalutVKeyArr={prodVKeyArr}
              onVKeyChange={(keyArr) => setProdVKeyArr(keyArr)}
              rowHeight="h60"
              isAttach={isAttach}
              attachTotal={attachDivTotal}
              discountRate={state_summary.discountRate} // 報價單總折數
              changeDiscountRate={(v) => {
                if (v === '') {
                  v = '0';
                }

                if (Number(v) > 500) {
                  v = '500';
                }

                const isValid = checkIsFloat(v, 3);

                if (!isValid) {
                  return;
                }

                setState_Summary((state) => {
                  return {
                    ...state,
                    discountRate: v,
                  };
                });
              }}
            />

            {/* 材料配件設定 */}
            <div className="relative mt-[14px]">
              <Table_com
                disabled={disabled_static}
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
              <LoadingCover01 isLoading={!!targetProd?.isLoading} />
            </div>
          </div>

          <div className={style.redWrapper}>
            {/* 選配設定 */}
            <Table_accessories
              disabled={disabled_static}
              list={targetProd?.accessoriesList}
              cellConfig={accessoriesCellConfig}
              keyArr={accessoriesKeyArr}
              changeKeyArr={changeAccessoriesKeyArr}
              // add={() => {
              //   targetProd?.addAcce();
              // }}
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
            />
          </div>

          <div className={style.tableWrapper}>
            {/* 其他設定 */}
            <Table_others
              disabled={disabled_static}
              list={othersList}
              cellConfig={othersCellConfig}
              keyArr={othersKeyArr}
              changeKeyArr={changeOthersKeyArr}
              add={addOthers}
            />
          </div>
          {/* 備註/報價範圍/付款資訊 */}
          {/*  */}

          <div className={style.tableWrapper}>
            {/* 主產品設定 */}
            <Table_prod
              disabled={isAttach ? true : disabled_static}
              disabled_plus={disabled_static}
              disabledExceptionArr={['quantity']}
              // exchangeDiabled={disabled}
              prodList={attachProdList}
              prodCellConfig={prodCellConfig}
              prodKeyArr={prodKeyArr}
              changeProdKeyArr={changeProdKeyArr}
              addProd={addProd_attach}
              setTargetProd={setTargetProdKey_attach}
              // defalutVKeyArr={prodVKeyArr}
              // onVKeyChange={(keyArr) => setProdVKeyArr(keyArr)}
              onVKeyChange={() => {}}
              rowHeight="h60"
              attachTotal={attachAddTotal}
              discountRate={state_summary.discountRate} // 報價單總折數
              changeDiscountRate={(v) => {
                if (v === '') {
                  v = '0';
                }

                if (Number(v) > 500) {
                  v = '500';
                }

                const isValid = checkIsFloat(v, 3);

                if (!isValid) {
                  return;
                }

                setState_Summary((state) => {
                  return {
                    ...state,
                    discountRate: v,
                  };
                });
              }}
            />

            {/* 材料配件設定 */}
            <div className="relative mt-[14px]">
              <Table_com
                disabled={disabled_static}
                // comList={targetProd?.comList}

                // FIXME 之後要把型別處理好
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                comList={{ ...targetProd_attach?.comList, ...targetProd_attach?.subComList }}
                comCellConfig={comCellConfig}
                comKeyArr={comKeyArr}
                changeComKeyArr={() => {}}
                // defalutVKeyArr={comVKeyArr}
              />
              <LoadingCover01 isLoading={!!targetProd?.isLoading} />
            </div>

            <div className="relative mt-[14px]">
              <Table_accessories
                disabled={disabled_static}
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
              <LoadingCover01 isLoading={!!targetProd?.isLoading} />
            </div>
          </div>

          {/*  */}
          <Summary
            disabled={disabled}
            payInfoControl={payInfoControl}
            control_anno={control_anno}
            control_qr={control_qr}
            appendixParams={appendixParams}
            avgDiscount_withQty={avgDiscount_withQty}
            disabled_file={disabled_static}
          />

          {/* 簽名 */}
          {/*  */}
          {/*  */}
          <SignatureBar className={'mx-[50px] mt-[130px] mb-[40px]'} control={control_signature} />
          {/*  */}
          {/*  */}
        </div>
      </div>
      <LoadingCover01 isLoading={isLoading} />
      <TextareaModal
        visible={showMemoModal}
        setVisible={setShowMemoModal}
        title={'追加追減備註'}
        placeholder={'請輸入備註'}
        // tip="最多25字"
        // textLength={25}
        onConfirm={inputModalOnConfirm}
        autoCloseOnConfirm={false}
      />
      {/* 
      注意，在PDF裡的商品複價不是主產品設定裡顯示的複價
      而是 主產品設定裡顯示的複價 * 右下方的總折數
      另外在PDF裡面 "1 1/2HP"要改成1.5HP
      有沒有更大的數?
      
      輸出PDF的部分
      關於支板
      只有型號 doorModel為 303A 303AS 時才要呈現出支板 其他doorModel都隱藏
      */}
      {/* 
      注意，在PDF裡的商品複價不是主產品設定裡顯示的複價
      而是 主產品設定裡顯示的複價 * 右下方的總折數
      另外在PDF裡面 "1 1/2HP"要改成1.5HP
      有沒有更大的數?

      輸出PDF的部分
      關於支板
      只有型號 doorModel為 303A 303AS 時才要呈現出支板 其他doorModel都隱藏
      */}

      {latestContent && (
        <QuotationPdf
          visible={pdfModalVisible}
          onCancel={() => {
            setPdfModalVisible(false);
          }}
          pdfData={pdfData}
          fileName={`報價單-${latestContent?.quotationNumber}`}
          // productArr_f={Object.values(productList)}
          // basicInfo={latestContent}

          // isBidding={status === 'Bidding'}
          // if (isBidding) {
          //   customerName = '';
          //   contactPerson = '';
          //   contactNumber = '';
          //   faxNumber = '';
          // }
        />
      )}

      {/* 
      注意，在PDF裡的商品複價不是主產品設定裡顯示的複價
      而是 主產品設定裡顯示的複價 * 右下方的總折數
      另外在PDF裡面 "1 1/2HP"要改成1.5HP
      有沒有更大的數?
      
      輸出PDF的部分
      關於支板
      只有型號 doorModel為 303A 303AS 時才要呈現出支板 其他doorModel都隱藏
      */}
      {/* 
      注意，在PDF裡的商品複價不是主產品設定裡顯示的複價
      而是 主產品設定裡顯示的複價 * 右下方的總折數
      另外在PDF裡面 "1 1/2HP"要改成1.5HP
      有沒有更大的數?
      
      輸出PDF的部分
      關於支板
      只有型號 doorModel為 303A 303AS 時才要呈現出支板 其他doorModel都隱藏
      */}

      {/*  */}
      <QuotationPdf_part
        isVisable={showPdf_part}
        onCancel={() => {
          setShowPdf_part(false);
        }}
        mainProductArr={pdfPartPropsArr}
        quotationId={latestContent?.quotationNumber ?? ''}
      />

      {/* 合約審核表 */}
      <ContractReviewForm
        showModal={reviewFormShow}
        forbidden={status === 'Pending' && isSendToReview_pending}
        close={() => setReviewFormShow(false)}
        contractIdNumber={quotationData?.latestContent.quotationNumber ?? ''}
        contractName={quotationData?.latestContent.projectName ?? ''}
        contractPrice={Number(state_summary.total.replaceAll(',', ''))}
        lastestContentId={lastestContentId}
        verifyForm={verifyForm}
        onConfirm={async () => {
          setIsLoading(true);
          await update();
          setIsLoading(false);
        }}
      />
      <ThreeButtonModal
        visible={reviewModalShow}
        text={'是否通過審核?'}
        onCancel={() => setReviewModalShow(false)}
        modalWidth={600}
        btnPropsArr={[
          {
            label: '通過審核',
            theme: 'danger',
            onClick: () => reqReview(true),
          },
          {
            label: '不通過審核',
            onClick: () => reqReview(false),
          },
          {
            label: '取消',
            onClick: () => setReviewModalShow(false),
          },
        ]}
      />

      {/* 審核人員選擇器 */}
      <EmployeeSelectorGroup
        showModal={showEmployeSelector}
        caption="請選擇審核人員"
        isCancelOnConfirm={false}
        defaultSeletedDataArrArr={defaultSeletedDataArrArr}
        dynaSelectorPropsList={dynaSelectorPropsList}
        onConfirm={(arr) => {
          // 在Pedding，sales的選擇器會被跳過不顯示，但是arr結構不會變
          const sales = arr[0][0] as TemployeeDto | undefined;
          const supervisor = arr[1][0] as TemployeeDto | undefined;

          myAlert.confirm({
            title: '確定送審',
            props: {
              onOk: () => {
                reqPatchReviewer({
                  sales,
                  supervisor,
                });
              },
            },
          });
        }}
        onCancel={() => {
          setShowEmployeSelector(false);
        }}
      />
    </div>
  );
}

// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================
// ===============================================================================

// region HOOK
//
//
//
//
// region use AnnoAndQr

// ===============================================================================
// region FUNCTION

const countPayInfoValue = ({
  // discount,
  //
  tuneTotal,
  prodSubTotal,
}: {
  // discount: string | number;
  tuneTotal: string | number;
  prodSubTotal: string | number;
}) => {
  // const discountRate = new Decimal(discount || 0).div(100);

  // const subTotal = Decimal.mul(prodSubTotal || 0, discountRate);
  const subTotal = Number(prodSubTotal || 0) + Number(tuneTotal || 0);
  const tax = Decimal.mul(subTotal || 0, 0.05);
  const total = Decimal.add(subTotal || 0, tax || 0);

  // const subTotalStr = Number(subTotal.toFixed(0)).toLocaleString();
  // const taxStr = Number(tax.toFixed(0)).toLocaleString();
  // const totalStr = Number(total.toFixed(0)).toLocaleString();
  const subTotalStr = Number(new Decimal(subTotal).toFixed(0)).toLocaleString();
  const taxStr = Number(new Decimal(tax).toFixed(0)).toLocaleString();
  const totalStr = Number(new Decimal(total).toFixed(0)).toLocaleString();

  return {
    subTotal: subTotalStr,
    salesTax: taxStr,
    total: totalStr,
  };
};

// ========================================================================

const extractPdfPartFromClassProduct = ({
  quotationNumber,
  productList,
}: {
  quotationNumber: string;
  productList: { [key: string]: Class_product };
}) => {
  const pdfPartProps: TmainProduct[] = Object.values(productList).map((prod) => {
    // const lw = Number(prod.fullWidth || 0) || Number(prod.WG || 0) * 100;

    const lw = new Decimal(prod.fullWidth || 0).mul(100).toNumber();
    const h = new Decimal(prod.height || 0).mul(100).toNumber();
    const b = new Decimal(prod.boxB || 0).mul(100).toNumber();
    const bounceDoorWidth = prod.bounceDoorWidth_cm;
    const bounceDoorWidth_formated = bounceDoorWidth ? `＋${bounceDoorWidth}` : '';

    const size = `${lw}${bounceDoorWidth_formated} X ${h} + ${b}`;

    const list_com = { ...prod.comList, ...prod.subComList };

    if (list_com.sidePlate?.totalPrice === '0') {
      delete list_com['sidePlate'];
    }

    delete list_com['motorAccessories'];

    const list_acce = prod.accessoriesList;

    const componentArr = Object.values(list_com ?? {});

    let totalPrice = 0;

    const part: Tpart[] = componentArr.map((com) => {
      totalPrice += Number(com.totalPrice || 0);

      let unit_str = '';

      if (typeof com.unit === 'object') {
        unit_str = 'm\u00B2';
      } else {
        unit_str = com.unit as string;
      }

      return {
        partName: com.comName,
        material: com.material,
        unit: com.unit,
        unit_str,
        // qty: Number(com.quantity).toFixed(2),
        qty: new Decimal(com.quantity || 0).toFixed(2),
        desc: com.desc ?? '',
        // price: Number(com.price || 0).toLocaleString(),
        price: com.unitPrice_locale,
        totalPrice: Number(com.totalPrice || 0).toLocaleString(),
      };
    });

    const part_acce: Tpart[] = Object.values(list_acce).map((acce) => {
      totalPrice += Number(acce.totalPrice || 0);

      let unit_str = '';

      if (typeof list_acce.unit === 'object') {
        unit_str = 'm\u00B2';
      } else {
        unit_str = list_acce.unit as string;
      }

      const partName = acce.name.replaceAll('60A', '');

      return {
        partName,
        material: '',
        unit: acce.unit,
        unit_str,
        // FIXME 型別為number，但實際上為string
        // hooks/quotation/classAccessories.tsx // get quantity
        // qty: Number(acce.quantity).toFixed(2),
        qty: new Decimal(acce.quantity || 0).toFixed(2),
        price: acce.unitPrice_locale,
        desc: '',
        totalPrice: acce.totalPrice_locale,
      };
    });

    return {
      quotationNumber: quotationNumber,
      category: prod.itemName,
      material: prod.material,
      surface: prod.surface,
      doorType: prod.doorType,
      size: size,
      part: [...part, ...part_acce],
      // priceTotal: totalPrice.toLocaleString(),
      priceTotal: totalPrice.toLocaleString(),
    };
  });

  return pdfPartProps;
};
