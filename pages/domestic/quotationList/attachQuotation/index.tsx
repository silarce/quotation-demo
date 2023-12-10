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
// import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';

// components
import QuotationProfile, { Tcontrol_profile } from 'components/page/domestic/quotation/quotationProfile';

import QuotationSinature_3, {
  TemployeeDto,
  Tcontroll_signature,
} from 'components/page/domestic/quotation/quotationSinature_3';
import QuotationPdf from 'components/page/domestic/pdf/quotationPdf/quotationPdf_new';

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
// import EmployeeSelector, { TemployeeDto } from 'components/global/gear/modal/employeeSelector';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import ThreeButtonModal from 'components/global/gear/modal/simpleModal/multButtonModal';

// icon
import iconUpload from 'public/image/icon/upload.svg';

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
  const { userInfo, userGrade } = useContext(AppContext);
  const userId = userInfo?.employee?.id;

  // -----------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  // 是否可編輯
  const [disabled, setDisabled] = useState(true);
  const [disabled_reviewer, setDisabled_reviewer] = useState(true);
  // -----------------------------------------------------
  const [employeeSelectorShow, setEmployeeSelectorShow] = useState(false);
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
          const contact = customer.contacts?.[0];
          const name = contact?.name ?? '';
          const phone = contact?.phone ?? '';

          setCustomer(customer);
          changeProfile('contactPerson', `${name}${phone}`);
          changeProfile('contactNumber', phone);
        },
        onClear: () => {
          setCustomer(null);
          changeProfile('contactPerson', '');
          changeProfile('contactNumber', '');
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
    const { subTotal, salesTax, total } = countPayInfoValue({
      discount: summary.discountRate,
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
  }, [summary.discountRate, attachTotal]);

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
          value: totalPaymentRatio,
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

  // ----------------------------------------------------------------

  const [reviewSales, setReviewSales] = useState<TemployeeDto>();
  const [reviewSupervisor, setReviewSupervisor] = useState<TemployeeDto>();
  const [reviewWorkDirector, setReviewWorkDirector] = useState<TemployeeDto>();

  useEffect(() => {
    if (!latestContent) {
      return;
    }

    setReviewSales(latestContent.reviewSalesEmployee || undefined);
    setReviewSupervisor(latestContent.reviewSupervisorEmployee || undefined);
    setReviewWorkDirector(latestContent.reviewWorkDirectorEmployee || undefined);
  }, [latestContent]);

  // ---------------------------------------------------------
  // const { register, control, reset, watch, setValue, getValues } = useForm<Partial<TquotationContentDto>>();
  // const { data, update } = useGetQuotation_id(id as string);

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
      if (salesReviewedAt && workDirectorReviewedAt && supervisorReviewedAt) {
        isManager = true;
        isReviewer = true;
      }
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

  const [workDirector, setworkDirector] = useState<TemployeeDto | null>();
  const [supervisor, setSupervisor] = useState<TemployeeDto | null>();
  const [sales, setSales] = useState<TemployeeDto | null>();

  useEffect(() => {
    const {
      //
      reviewSalesEmployee,
      reviewSupervisorEmployee,
      reviewWorkDirectorEmployee,
    } = quotationData?.latestContent ?? {};

    setworkDirector(reviewWorkDirectorEmployee);
    setSupervisor(reviewSupervisorEmployee);
    setSales(reviewSalesEmployee);
  }, [quotationData, disabled_reviewer]);

  const control_signature: Tcontroll_signature = {
    manager: {
      employee: quotationData?.latestContent.reviewManagerEmployee,
      forbidden: true,
    },
    workDirector: {
      employee: workDirector,
      onChange: (emp) => {
        console.log(emp);
        setworkDirector(emp);
      },
    },
    supervisor: {
      employee: supervisor,
      onChange: (emp) => {
        setSupervisor(emp);
      },
    },
    sales: {
      employee: sales,
      onChange: (emp) => {
        setSales(emp);
      },
    },
    agent: {
      employee: quotationData?.latestContent.agentEmployee,
      forbidden: true,
    },
  };

  // 在不同的審查階段只顯示不同的審核人員
  if (status === 'Budget' || status === 'Bidding') {
    delete control_signature.manager;
    delete control_signature.workDirector;
    delete control_signature.supervisor;
  }

  if (status === 'Contracting') {
    delete control_signature.manager;
    delete control_signature.workDirector;
  }

  // --------------------------------------------------------------

  // const [empSelConfirmKey, setEmpSelConfirmKey] = useState<
  //   'reviewSales' | 'reviewSupervisor' | 'reviewWorkDirector' | 'undefined'
  // >('undefined');

  // const openEmpSel = (v: 'reviewSales' | 'reviewSupervisor' | 'reviewWorkDirector') => {
  //   setEmpSelConfirmKey(v);
  //   setEmployeeSelectorShow(true);
  // };

  // const onEmpSelCancel = () => {
  //   setEmployeeSelectorShow(false);
  //   setEmpSelConfirmKey('undefined');
  // };

  // const empSelLookup = {
  //   reviewSales: {
  //     label: '請選擇審核業務',
  //     // tip: '可不選，直接按確定',
  //     employee: reviewSales,
  //     onCancel: onEmpSelCancel,
  //     onConfirm: (v: TemployeeDto[]) => {
  //       setReviewSales(v[0]);

  //       if (status === 'Contracting') {
  //         setTimeout(() => {
  //           openEmpSel('reviewSupervisor');
  //         }, 300);
  //       } else {
  //         reqSetReviewer({
  //           reviewSales: v[0],
  //           reviewSupervisor,
  //           reviewWorkDirector,
  //         });
  //       }
  //     },
  //   },
  //   reviewSupervisor: {
  //     label: '請選擇業務主管',
  //     // tip: '可不選，直接按確定',
  //     employee: reviewSupervisor,
  //     onCancel: onEmpSelCancel,
  //     onConfirm: async (v: TemployeeDto[]) => {
  //       setReviewSupervisor(v[0]);
  //       onEmpSelCancel();
  //       setTimeout(() => {
  //         openEmpSel('reviewWorkDirector');
  //       }, 300);
  //     },
  //   },
  //   reviewWorkDirector: {
  //     label: '請選擇應收帳款',
  //     // tip: '可不選，直接按確定',
  //     employee: reviewWorkDirector,
  //     onCancel: onEmpSelCancel,
  //     onConfirm: (v: TemployeeDto[]) => {
  //       setReviewWorkDirector(v[0]);
  //       onEmpSelCancel();
  //       reqSetReviewer({
  //         reviewSales,
  //         reviewSupervisor,
  //         reviewWorkDirector: v[0],
  //       });
  //     },
  //   },
  //   undefined: {
  //     label: '',
  //     tip: '',
  //     employee: undefined,
  //     onCancel: () => {},
  //     onConfirm: () => {},
  //   },
  // };

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

    // (!!isReviewer || null) && { type: 'myButton', label: '審核', onClick: () => reqReview() },
    (!!isReviewer || null) && {
      type: 'myButton',
      label: '審核',
      onClick: () => setReviewModalShow(true),
    },
    // (!!quotationId || null) && { type: 'myButton', label: '送審', onClick: () => openEmpSel('reviewSales') },
    // (!!quotationId || null) && {
    //   type: 'myButton',
    //   label: '送審',
    //   onClick: () => {
    //     openEmpSel('reviewSales');
    //   },
    // },

    quotationId && status !== 'Pending'
      ? {
          type: 'myButton',
          label: '編輯送審人員',
          onClick: () => {
            setDisabled_reviewer(false);
          },
        }
      : null,

    (() => {
      if (status === 'Pending') {
        return { type: 'myButton', label: '合約審核表', onClick: () => setReviewFormShow(true) };
      } else {
        return null;
      }
    })(),
    // { type: 'myButton', label: '編輯', onClick: () => setDisabled(false) },
    { type: 'myButton', label: '返回', onClick: () => router.back() },
  ];

  const panel_editReviewer: TpanelList = [
    {
      type: 'redButton',
      label: '送審',
      onClick: () => reqPatchReviewer(),
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

  const reqUpdateQuotation = async ({ editNotes }: { editNotes: string }) => {
    // const data_watch = watch();

    // 總樘數
    const prodQty = 0;

    // ---------------------------------------------------------

    // 要送給後端的是quanity扣掉reduceQty後的prod
    const divProdArr = (() => {
      const arr = Object.values(productList).map((item) => {
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

    const attachProdArr = Object.values(attachProdList).map((prod) => {
      return prod.body;
    });

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

      return item;
    });

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
  const reqSetReviewer = async ({
    reviewSales,
    reviewWorkDirector,
    reviewSupervisor,
  }: {
    reviewSales?: TemployeeDto | undefined;
    reviewSupervisor?: TemployeeDto | undefined;
    reviewWorkDirector?: TemployeeDto | undefined;
  }) => {
    if (!quotationId) {
      return;
    }

    const reviewSalesEmployeeId = reviewSales?.id || null;
    const reviewWorkDirectorEmployeeId = reviewWorkDirector?.id || null;
    const reviewSupervisorEmployeeId = reviewSupervisor?.id || null;

    try {
      setIsLoading(true);
      await apiQuotationSubmitReview(quotationId, {
        reviewSalesEmployeeId,
        reviewWorkDirectorEmployeeId,
        reviewSupervisorEmployeeId,
      });
      await update();
    } catch (error) {
      myAlert.err({ title: '更新審核人員失敗' });
    } finally {
      setReviewSales(undefined);
      setReviewSupervisor(undefined);
      setIsLoading(false);
    }
  };

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

    const shouldDirect = isPass && status === 'Pending';

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

    setIsLoading(true);

    try {
      await apiQuotationSubmitReview(quotationId, {
        reviewSalesEmployeeId: sales?.id ?? null,
        reviewWorkDirectorEmployeeId: workDirector?.id ?? null,
        reviewSupervisorEmployeeId: supervisor?.id ?? null,
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

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  const pdfPartProps: TmainProduct[] = Object.values(productList).map((prod) => {
    // const lw = Number(prod.fullWidth || 0) || Number(prod.WG || 0) * 100;
    const lw = Number(prod.fullWidth || 0) * 100;
    const h = Number(prod.height || 0) * 100;
    const b = Number(prod.boxB || 0) * 100;

    const size = `${lw} X ${h} + ${b}`;

    const componentArr = Object.values(prod.comList ?? {});

    const part: Tpart[] = componentArr.map((com) => {
      return {
        partName: com.comName,
        material: com.material,
        unit: com.unit,
        qty: com.quantity,
        price: String(com.price || 0),
        totalPrice: com.totalPrice,
        desc: com.desc ?? '',
      };
    });

    return {
      category: prod.itemName,
      material: prod.material,
      surface: prod.surface,
      doorType: prod.doorType,
      size: size,
      priceTotal: prod.totalPrice,
      part: part,
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
          {/* <QuotationSinature signatureArr={signatureArr} disabled={disabled} /> */}
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
          productArr_f={Object.values(productList)}
          basicInfo={latestContent}
          noteArr={anno}
          qrArr={qr}
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
      {/*  */}
      {/* <EmployeeSelector
        showModal={employeeSelectorShow}
        label={empSelLookup[empSelConfirmKey]?.label}
        // tip={empSelLookup[empSelConfirmKey]?.tip}
        onConfirm={(v) => {
          empSelLookup[empSelConfirmKey]?.onConfirm(v);
        }}
        onCancel={() => empSelLookup[empSelConfirmKey]?.onCancel()}
        selLimit={1}
        defaultEmpArr={
          empSelLookup[empSelConfirmKey]?.employee ? [empSelLookup[empSelConfirmKey].employee!] : undefined
        }
      /> */}
      {/* 合約審核表 */}
      <ContractReviewForm
        showModal={reviewFormShow}
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
  discount,
  //
  prodSubTotal,
}: {
  discount: string | number;
  prodSubTotal: string | number;
}) => {
  const discountRate = new Decimal(discount || 0).div(100);

  const subTotal = Decimal.mul(prodSubTotal || 0, discountRate);
  const tax = Decimal.mul(subTotal || 0, 0.05);
  const total = Decimal.add(subTotal || 0, tax || 0);

  const subTotalStr = Number(subTotal.toFixed(0)).toLocaleString();
  const taxStr = Number(tax.toFixed(0)).toLocaleString();
  const totalStr = Number(total.toFixed(0)).toLocaleString();

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
