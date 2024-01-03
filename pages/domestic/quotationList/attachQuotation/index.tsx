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
import QuotationProfile, { Tcontrol_profile } from 'components/page/domestic/quotation/quotationProfile';

import QuotationSinature_3, {
  TemployeeDto,
  Tcontroll_signature,
} from 'components/page/domestic/quotation/quotationSinature_3';
// import QuotationPdf from 'components/page/domestic/pdf/quotationPdf/quotationPdf_new';
import QuotationPdf, {
  quotationContentToBasicInfo,
  quotationProdToTableProdList,
} from 'components/page/domestic/pdf/quotationPdf/quotationPdf_new2';

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
  useGetQuotation_id,
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

import { useProductList } from 'hooks/quotation/useProduct';

import Summary, {
  TsummaryControl,
  TpayInfoControl,
} from 'components/page/domestic/quotation/quotation/summary/summary';

// type
import { TfileInfo } from 'components/page/domestic/quotation/quotationTotal/appendix_legacy_noReview';

import { TcreateQuotationProductDto, TquotationProductDto, TcustomerDto } from 'js/api/dtoTypes';

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
  const [isLoading, setIsLoading] = useState(false);
  // 是否可編輯
  const [disabled, setDisabled] = useState(true);
  const [disabled_reviewer, setDisabled_reviewer] = useState(true);
  // -----------------------------------------------------
  const [reviewFormShow, setReviewFormShow] = useState(false);
  const [reviewModalShow, setReviewModalShow] = useState(false);
  // -----------------------------------------------------

  const [anno, setAnnotation] = useState<string[]>([]);
  const [qr, setQr] = useState<string[]>([]);

  const onDoorTypeChange = ({
    annoShouldRemove,
    annoArr,
    qrShouldRemove,
    qrArr,
  }: {
    annoShouldRemove: string[] | undefined;
    annoArr: string[] | undefined;
    qrShouldRemove: string[] | undefined;
    qrArr: string[] | undefined;
  }) => {
    setAnnotation((anno) => {
      let annoCopy = [...anno];

      // 把應該被移除拿掉
      if (annoShouldRemove) {
        annoShouldRemove.forEach((asmStr) => {
          const delIndex = annoCopy.findIndex((str) => asmStr === str);

          if (delIndex > -1) {
            annoCopy.splice(delIndex, 1);
          }
        });
      }

      // 先把重複的拿掉，再把新的放進去
      if (annoArr) {
        annoArr.forEach((asmStr) => {
          const delIndex = annoCopy.findIndex((str) => asmStr === str);

          if (delIndex > -1) {
            annoCopy.splice(delIndex, 1);
          }
        });

        annoCopy = [...annoCopy, ...annoArr];
      }

      return annoCopy;
    });

    setQr((qr) => {
      let qrCopy = [...qr];

      // 把應該被移除拿掉
      if (qrShouldRemove) {
        qrShouldRemove.forEach((asmStr) => {
          const delIndex = qrCopy.findIndex((str) => asmStr === str);

          if (delIndex > -1) {
            qrCopy.splice(delIndex, 1);
          }
        });
      }

      // 先把重複的拿掉，再把新的放進去
      if (qrArr) {
        qrArr.forEach((asmStr) => {
          const delIndex = qrCopy.findIndex((str) => asmStr === str);

          if (delIndex > -1) {
            qrCopy.splice(delIndex, 1);
          }
        });

        qrCopy = [...qrCopy, ...qrArr];
      }

      return qrCopy;
    });

    // setAnnotation(annoCopy);
  };

  // -----------------------------------------------------
  // 資料
  const { data: quotationData, update } = useGetQuotation_id(quotationId as string);
  const lastestContentId = quotationData?.latestContent.id;
  const latestContent = quotationData?.latestContent;
  // const status = latestContent?.status;
  const verifyForm = latestContent?.verifyForm;

  const isAttach = true;

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
  let agentEmployee: TemployeeDto | undefined | null;

  if (!quotationId) {
    agentEmployee = userInfo?.employee;
  } else {
    agentEmployee = latestContent?.agentEmployee;
  }

  // -----------------------------------------------------
  const [status, setStatus] = useState<TquotationContentDto['status']>('Budget');

  const [customer, setCustomer] = useState<TcustomerDto | undefined | null>();
  const [profile, setProfile] = useState<Tprofile>(creEmptyProfile());

  const changeProfile = (key: keyof Tprofile, value: string) => {
    setProfile((state) => {
      return {
        ...state,
        [key]: value,
      };
    });
  };

  useEffect(() => {
    setStatus(latestContent?.status ?? 'Budget');
    // setEditNotes(latestContent?.editNotes ?? '');

    setCustomer(latestContent?.customer ?? null);

    setProfile({
      validityPeriod: latestContent?.validityPeriod ?? '',
      projectName: latestContent?.projectName ?? '',
      county: latestContent?.county ?? '',
      district: latestContent?.district ?? '',
      address: latestContent?.address ?? '',
      contactPerson: latestContent?.contactPerson ?? '',
      contactNumber: latestContent?.contactNumber ?? '',
      faxNumber: latestContent?.faxNumber ?? '',
      trackProgress: latestContent?.trackProgress ?? '',
      projectProgress: latestContent?.projectProgress ?? '',
    });
  }, [quotationData]);

  const control_profile = useMemo(() => {
    const control_profile: Tcontrol_profile = {
      quotationNumber: latestContent?.quotationNumber ?? '',
      quotationDate: latestContent?.quotationDate ?? '',
      customer: {
        value: customer,
        onChange: (customer) => {
          const customerPhoneNumber = customer.phone || '';
          const contact = customer.contacts?.[0];
          const name = contact?.name ?? '';
          const phone = contact?.phone || customerPhoneNumber || '';
          const fax = customer.fax || '';

          setCustomer(customer);
          changeProfile('contactPerson', `${name}${phone}`);
          changeProfile('contactNumber', customerPhoneNumber);
          changeProfile('faxNumber', fax);
        },
        onClear: () => {
          setCustomer(null);
          changeProfile('contactPerson', '');
          changeProfile('contactNumber', '');
          changeProfile('faxNumber', '');
        },
      },
      itemList: {
        validityPeriod: {
          value: profile.validityPeriod,
          onChange: (v) => changeProfile('validityPeriod', v),
        },
        projectName: {
          value: profile.projectName,
          onChange: (v) => changeProfile('projectName', v),
        },
        county: {
          value: profile.county,
          onChange: (v) => changeProfile('county', v),
        },
        district: {
          value: profile.district,
          onChange: (v) => changeProfile('district', v),
        },
        address: {
          value: profile.address,
          onChange: (v) => changeProfile('address', v),
        },
        contactPerson: {
          value: profile.contactPerson,
          onChange: (v) => changeProfile('contactPerson', v),
        },
        contactNumber: {
          value: profile.contactNumber,
          onChange: (v) => changeProfile('contactNumber', v),
        },
        faxNumber: {
          value: profile.faxNumber,
          onChange: (v) => changeProfile('faxNumber', v),
        },
        trackProgress: {
          value: profile.trackProgress,
          onChange: (v) => changeProfile('trackProgress', v),
        },
        projectProgress: {
          value: profile.projectProgress,
          onChange: (v) => changeProfile('projectProgress', v),
        },
      },
    };

    return control_profile;
  }, [profile]);

  // -----------------------------------------------------
  // -----------------------------------------------------
  // -----------------------------------------------------

  const [summary, setSummary] = useState<{
    discountRate: string;
    subTotal: string;
    salesTax: string;
    total: string;
    deliveryLocation: string;
    deliveryDate: string;
  }>({
    discountRate: '100',
    subTotal: '',
    salesTax: '',
    total: '',
    deliveryLocation: '',
    deliveryDate: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<{ milestone: string; totalPaymentRatio: string }[]>([]);

  // -----------------------------------------------------

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
  } = useProductList({
    productArr: contractArr,
    others: quotationData?.latestContent.others,
    resetTrigger: contractArr,
    onDoorTypeChange: onDoorTypeChange,
    productArr_attach: contentArr,
    quotationDiscount: Number(summary.discountRate || '100'),
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
      subTotal,
      salesTax,
      total,
      deliveryLocation,
      deliveryDate,
      paymentMethods,
      annotations,
      quotationRanges,
    } = quotationData.latestContent;

    setAnnotation(annotations ?? []);
    setQr(quotationRanges ?? []);
    setPaymentMethod(paymentMethods);

    setSummary({
      discountRate: discount,
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
      prodSubTotal: attachTotal,
    });

    setSummary((state) => {
      return {
        ...state,
        subTotal,
        salesTax,
        total,
      };
    });
  }, [
    // summary.discountRate,
    attachTotal,
  ]);

  //
  //
  //

  const control_anno: TsummaryControl = {
    stringArr: anno,
    editString: (index, v) => {
      setAnnotation((state) => {
        const copy = [...state];
        copy[index] = v;

        return copy;
      });
    },
    addString: (v: string) => {
      setAnnotation((state) => {
        const copy = [...state];
        copy.push(v);

        return copy;
      });
    },
    delString: (index: number) => {
      setAnnotation((state) => {
        const copy = [...state];
        copy.splice(index, 1);

        return copy;
      });
    },
    addStrArr: (vArr: string[]) => {
      setAnnotation((state) => {
        const copy = [...state];
        copy.push(...vArr);

        return copy;
      });
    },
  };

  const control_qr: TsummaryControl = {
    stringArr: qr,
    editString: (index, v) => {
      setQr((state) => {
        const copy = [...state];
        copy[index] = v;

        return copy;
      });
    },
    addString: (v: string) => {
      setQr((state) => {
        const copy = [...state];
        copy.push(v);

        return copy;
      });
    },
    delString: (index: number) => {
      setQr((state) => {
        const copy = [...state];
        copy.splice(index, 1);

        return copy;
      });
    },
    addStrArr: (vArr: string[]) => {
      setQr((state) => {
        const copy = [...state];
        copy.push(...vArr);

        return copy;
      });
    },
  };

  // ----------------------------------------------------------------------
  const payInfoControl: TpayInfoControl = {
    payment: {
      discountRate: {
        inputAttr: {
          disabled: disabled,
          value: summary.discountRate,
          onChange: (e) => {
            let v = e.target.value;
            setSummary((state) => {
              const copy = { ...state };

              if ((v as string) === '') {
                v = '0';
              }

              if (Number(v) > 100) {
                v = '100';
              }

              if (v.split('.')[1]?.length > 2) {
                return copy;
              }

              copy.discountRate = v;

              return copy;
            });
          },
        },
      },
      subTotal: {
        inputAttr: {
          disabled: true,
          value: summary.subTotal,
        },
      },
      salesTax: {
        inputAttr: {
          disabled: true,
          value: summary.salesTax,
        },
      },
      total: {
        inputAttr: {
          disabled: true,
          value: summary.total,
        },
      },
    },

    delivery: {
      deliveryLocation: {
        value: summary.deliveryLocation,
        onChange: (v) => {
          setSummary((state) => {
            const copy = { ...state };
            copy.deliveryLocation = v;

            return copy;
          });
        },
      },
      deliveryDate: {
        value: summary.deliveryDate,
        onChange: (v) => {
          setSummary((state) => {
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

  let isReviewer = false;
  let isSales = false;
  let isWorkDirector = false;
  let isSupervisor = false;
  let isManager = false;

  const reviewSalesEmployeeId = latestContent?.reviewSalesEmployee?.id;
  const reviewWorkDirectorEmployeeId = latestContent?.reviewWorkDirectorEmployee?.id;
  const reviewSupervisorEmployeeId = latestContent?.reviewSupervisorEmployee?.id;
  const reviewManagerEmployeeId = latestContent?.reviewManagerEmployee?.id;

  const {
    salesReviewedAt,
    supervisorReviewedAt,
    workDirectorReviewedAt,
    managerReviewedAt,

    toSalesAt,
    toSupervisorAt,
    toWorkDirectorAt,
    toManagerAt,
  } = latestContent ?? {};

  let isAllReviewedBeforePending = false;

  if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
    if (salesReviewedAt && supervisorReviewedAt && managerReviewedAt) {
      isAllReviewedBeforePending = true;
    }
  }

  const isSendToReview = !!(toSupervisorAt || toWorkDirectorAt || toManagerAt);

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
    }
    //  else if (userGrade >= 14) {
    // else if (userId === reviewManagerEmployeeId) {
    else if (
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

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await Promise.all([update(), updateAttachments()]);
      } catch (error) {}

      setIsLoading(false);
    })();
  }, [quotationId]);

  // const [workDirector, setworkDirector] = useState<TemployeeDto | null>();
  // const [supervisor, setSupervisor] = useState<TemployeeDto | null>();
  // const [sales, setSales] = useState<TemployeeDto | null>();

  const [workDirector, setworkDirector] = useState<{
    emp: TemployeeDto | null;
    workDirectorReviewedAt: string | null | undefined;
    toWorkDirectorAt: string | null | undefined;
  }>();
  const [supervisor, setSupervisor] = useState<{
    emp: TemployeeDto | null;
    supervisorReviewedAt: string | null | undefined;
    toSupervisorAt: string | null | undefined;
  }>();
  const [sales, setSales] = useState<{
    emp: TemployeeDto | null;
    salesReviewedAt: string | null | undefined;
    toSalesAt: string | null | undefined;
  }>();

  useEffect(() => {
    const {
      //
      reviewSalesEmployee,
      salesReviewedAt,
      toSalesAt,

      reviewSupervisorEmployee,
      supervisorReviewedAt,
      toSupervisorAt,

      reviewWorkDirectorEmployee,
      workDirectorReviewedAt,
      toWorkDirectorAt,
    } = quotationData?.latestContent ?? {};

    setworkDirector({
      emp: reviewWorkDirectorEmployee ?? null,
      workDirectorReviewedAt: workDirectorReviewedAt ?? null,
      toWorkDirectorAt: toWorkDirectorAt ?? null,
    });
    setSupervisor({
      emp: reviewSupervisorEmployee ?? null,
      supervisorReviewedAt: supervisorReviewedAt ?? null,
      toSupervisorAt: toSupervisorAt ?? null,
    });

    setSales({
      emp: reviewSalesEmployee ?? null,
      salesReviewedAt: salesReviewedAt ?? null,
      toSalesAt: toSalesAt ?? null,
    });
  }, [quotationData, disabled_reviewer]);

  // 已經在後端紀錄的審核人員不可以改變
  const control_signature: Tcontroll_signature = {
    manager: {
      employee: quotationData?.latestContent.reviewManagerEmployee,
      forbidden: true,
    },
    workDirector: {
      employee: workDirector?.emp ?? null,
      onChange: (emp) => {
        setworkDirector((workDirector) => {
          if (!workDirector) {
            return workDirector;
          }

          return { ...workDirector, emp: emp ?? null };
        });
      },
      // forbidden: !!quotationData?.latestContent.reviewWorkDirectorEmployee,
      forbidden: !!quotationData?.latestContent.toWorkDirectorAt,
    },
    supervisor: {
      employee: supervisor?.emp ?? null,
      onChange: (emp) => {
        setSupervisor((supervisor) => {
          if (!supervisor) {
            return supervisor;
          }

          return { ...supervisor, emp: emp ?? null };
        });
      },
      // forbidden: !!quotationData?.latestContent.reviewSupervisorEmployee,
      forbidden: !!quotationData?.latestContent.toSupervisorAt,
    },
    sales: {
      employee: sales?.emp ?? null,
      onChange: (emp) => {
        setSales((sales) => {
          if (!sales) {
            return sales;
          }

          return { ...sales, emp: emp ?? null };
        });
      },
      // forbidden: !!quotationData?.latestContent.reviewSalesEmployee,
      forbidden: !!quotationData?.latestContent.toSalesAt,
    },
    agent: {
      employee: quotationData?.latestContent.agentEmployee,
      forbidden: true,
    },
  };

  // console.log(sales);

  // 在預算、投標、發包 不顯示應收帳款
  if (status === 'Budget' || status === 'Bidding' || status === 'Contracting') {
    delete control_signature.workDirector;
  }

  // 在準合約階段不顯示經辦
  if (status === 'Pending') {
    delete control_signature.agent;
  }

  // --------------------------------------------------------------------------

  const [showPdf, setShowPdf] = useState(false);
  const [showPdf_part, setShowPdf_part] = useState(false);

  // --------------------------------------------------------------------------

  const [showMemoModal, setShowMemoModal] = useState(false);

  const inputModalOnConfirm = (v: string) => {
    if (!v) {
      return myAlert.warning({ title: '請輸入註解' });
    }

    // setValue('editNotes', v);

    setShowMemoModal(false);

    reqUpdateQuotation({ editNotes: v });
  };

  const tagList: TtagList = [
    {
      label: quotationId ? `報價編號 ${quotationData?.latestContent.quotationNumber || ''}` : '新報價單',
      onClick: () => {},
    },
  ];

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
          quotationState={{ value: status, label: status }}
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
    // {
    //   type: 'myButton',
    //   label: '匯出報價單',
    //   img: iconUpload.src,
    //   onClick: () => setShowPdf(true),
    // },
    // {
    //   type: 'myButton',
    //   label: '匯出材料/配件',
    //   img: iconUpload.src,
    //   onClick: () => setShowPdf_part(true),
    // },
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
          label: '編輯審核人員',
          onClick: () => {
            const toSalesAt = sales?.toSalesAt;
            const toSupervisorAt = supervisor?.toSupervisorAt;
            const toWorkDirectorAt = workDirector?.toWorkDirectorAt;

            if (status === 'Pending' && !verifyForm) {
              return myAlert.warning({ title: '請先送出合約審核表' });
            }

            if (status === 'Pending' && (toSupervisorAt || toWorkDirectorAt)) {
              myAlert.info({ title: '此報價單已經送審，不可以變更審核人員' });
            } else if (status !== 'Pending' && (toSalesAt || toSupervisorAt)) {
              myAlert.info({ title: '此報價單已經送審，不可以變更業務與業務主管' });
            } else {
              setDisabled_reviewer(false);
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

    { type: 'myButton', label: '返回', onClick: () => router.back() },
  ];

  const panel_editReviewer: TpanelList = [
    {
      type: 'redButton',
      label: '送審',
      onClick: () => {
        reqPatchReviewer();
      },
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => setDisabled_reviewer(true),
    },
  ];

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  // 實際上追加追減報價單目前是不可以編輯的
  const reqUpdateQuotation = async ({ editNotes }: { editNotes: string }) => {
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
      validityPeriod: profile.validityPeriod ?? '',
      //
      customerId: customer?.id ?? '',
      //
      projectName: profile.projectName ?? '',
      county: profile.county ?? '',
      district: profile.district ?? '',
      address: profile.address ?? '',
      contactPerson: profile.contactPerson ?? '',
      contactNumber: profile.contactNumber ?? '',
      quantity: prodQty ?? 0,
      editNotes: editNotes ?? '',
      status: status ?? 'Budget',

      // managerId: latestContent.managerEmployee?.id ?? null,
      // supervisorId: data_watch.supervisorEmployee?.id ?? null,
      //
      agentId: agentEmployee?.id,
      //
      //
      annotations: anno,
      quotationRanges: qr,
      //
      //
      faxNumber: profile.faxNumber ?? '',
      trackProgress: profile.trackProgress ?? '',
      projectProgress: profile.projectProgress ?? '',

      discount: `${Number(summary.discountRate ?? 0)}` ?? '100',
      subTotal: Number(summary.subTotal.replaceAll(',', '')),
      salesTax: Number(summary.salesTax.replaceAll(',', '')),
      total: Number(summary.total.replaceAll(',', '')),
      deliveryLocation: summary.deliveryLocation,
      deliveryDate: summary.deliveryDate,
      paymentMethods: paymentMethod,
      //
      //
      // products: [...prodArr, ...attachProdArr],
      products: products,
      others: getOthersPostBodyArr(),
      // productsOrder: null,
      //
      //
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
      reviewManagerEmployeeId: isManager ? userId : null,
      reviewResult: isPass,
    };

    if (status === 'Pending' && !verifyForm) {
      if (isPass) {
        return myAlert.warning({ title: '請先送出合約審核表' });
      }
    }

    if (status === 'Pending') {
      if (!reviewSalesEmployeeId || !reviewWorkDirectorEmployeeId || !reviewSupervisorEmployeeId) {
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
  const reqPatchReviewer = async () => {
    if (!quotationId) {
      return;
    }

    const reviewSalesEmployeeId = sales?.emp?.id ?? null;
    const reviewWorkDirectorEmployeeId = workDirector?.emp?.id ?? null;
    const reviewSupervisorEmployeeId = supervisor?.emp?.id ?? null;

    if (
      status === 'Pending' &&
      (!reviewSalesEmployeeId || !reviewWorkDirectorEmployeeId || !reviewSupervisorEmployeeId)
    ) {
      myAlert.info({ title: '請選擇所有審核人員' });

      return;
    } else if (!reviewSalesEmployeeId || !reviewSupervisorEmployeeId) {
      myAlert.info({ title: '請選擇所有審核人員' });

      return;
    }

    try {
      setIsLoading(true);
      await apiQuotationSubmitReview(quotationId, {
        reviewSalesEmployeeId: sales?.emp?.id ?? null,
        reviewWorkDirectorEmployeeId: workDirector?.emp?.id ?? null,
        reviewSupervisorEmployeeId: supervisor?.emp?.id ?? null,
      });
      await update();
      setDisabled_reviewer(true);
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
    if (!quotationId) {
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
      await apiPatchQuotationToPending(quotationId);
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

  const pdfPartProps: TmainProduct[] = Object.values(productList).map((prod) => {
    // const lw = Number(prod.fullWidth || 0) || Number(prod.WG || 0) * 100;

    const lw = new Decimal(prod.fullWidth || 0).mul(100).toNumber();
    const h = new Decimal(prod.height || 0).mul(100).toNumber();
    const b = new Decimal(prod.boxB || 0).mul(100).toNumber();

    const size = `${lw} X ${h} + ${b}`;

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
      quotationNumber: latestContent?.quotationNumber || '無報價編號',
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

  // --------------------------------------------------------------------------

  const panelList = (() => {
    if (!disabled_reviewer) {
      return panel_editReviewer;
    }

    if (disabled) {
      return panel_noEditable;
    } else {
      return panel_editable;
    }
  })();

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  return (
    <div className={classNames(style.container, 'relative')}>
      {/* <PageHeader02 tagList={tagList} panelList={!disabled ? panel_editable : panel_noEditable} /> */}
      <PageHeader02 tagList={tagList} panelList={panelList} />

      <div className={style.mainContainer}>
        <div className={style.quotation}>
          {/* 基本資料 */}
          <QuotationProfile disabled={disabled} control={control_profile} />

          <div className={classNames(style.switchBar)}>
            <div>報價項目</div>
          </div>

          <div className={style.tableWrapper}>
            {/* 主產品設定 */}
            <Table_prod
              disabled={isAttach ? true : disabled}
              exchangeDiabled={disabled}
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
            />

            {/* 材料配件設定 */}
            <div className="relative mt-[14px]">
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
              <LoadingCover01 isLoading={!!targetProd?.isLoading} />
            </div>
          </div>

          <div className={style.redWrapper}>
            {/* 選配設定 */}
            <Table_accessories
              disabled={true}
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
              disabled={true}
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
              disabled={isAttach ? true : disabled}
              disabled_plus={disabled}
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
            />

            {/* 材料配件設定 */}
            <div className="relative mt-[14px]">
              <Table_com
                disabled={true}
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
                disabled={true}
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
          />

          {/* 簽名 */}
          {/*  */}
          {/*  */}
          <QuotationSinature_3 controll={control_signature} disabled={disabled_reviewer} />
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
        tip="最多25字"
        textLength={25}
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
          isVisable={showPdf}
          onCancel={() => {
            setShowPdf(false);
          }}
          // productArr_f={Object.values(productList)}
          // basicInfo={latestContent}
          noteArr={anno}
          qrArr={qr}
          control_basicInfo={quotationContentToBasicInfo(latestContent)}
          control_prodArr={quotationProdToTableProdList({
            classProductArr: Object.values(productList ?? {}),
            classOthersArr: Object.values(othersList ?? {}),
          })}
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
        mainProductArr={pdfPartProps}
        quotationId={latestContent?.quotationNumber ?? ''}
      />

      {/* 合約審核表 */}
      <ContractReviewForm
        showModal={reviewFormShow}
        forbidden={status === 'Pending' && isSendToReview}
        close={() => setReviewFormShow(false)}
        contractIdNumber={quotationData?.latestContent.quotationNumber ?? ''}
        contractName={quotationData?.latestContent.projectName ?? ''}
        contractPrice={Number(summary.total.replaceAll(',', ''))}
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
    </div>
  );
}

// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============
// ------------------------------------------------------------------=============

const countPayInfoValue = ({
  // discount,
  //
  prodSubTotal,
}: {
  // discount: string | number;
  prodSubTotal: string | number;
}) => {
  // const discountRate = new Decimal(discount || 0).div(100);

  // const subTotal = Decimal.mul(prodSubTotal || 0, discountRate);
  const subTotal = prodSubTotal;
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
const creEmptyProfile = (): Tprofile => ({
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
});
