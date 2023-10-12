// 常用變數目錄
/**
 * useProductList
 * reqUpdateQuotation
 * useGetQuotation_id
 * fileInfoArr
 * reqReview 送審
 *
 */
// =============================================================
// =============================================================
// =============================================================

// 報價單
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useRouter, NextRouter } from 'next/router';
import moment from 'moment';
import { useForm, useFormState } from 'react-hook-form';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';

// components
import QuotationProfile, { TreturnBody } from 'components/page/domestic/quotation/quotationProfile';
import QuotationProduction from 'components/page/domestic/quotation/quotationProduct';
import QuotationComponent from 'components/page/domestic/quotation/quotationComponent';
import QuotationAccessory from 'components/page/domestic/quotation/quotationAccessory';
import QuotationTotal from 'components/page/domestic/quotation/quotationTotal';
import QuotationSinature, { TsignatureProps } from 'components/page/domestic/quotation/quotationSinature';
// import QuotationProdChangingRecord from "components/page/domestic/quotation/quotationProdChangingRecord"
// import QuotationRecord from "components/page/domestic/quotation/quotationRecord"
// import QuotationPdf from 'components/page/domestic/pdf/quotationPdf/quotationPdf';
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
import EmployeeSelector, { TemployeeDto } from 'components/global/gear/modal/employeeSelector';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';
import ThreeButtonModal from 'components/global/gear/modal/simpleModal/multButtonModal';

// icon
import iconUpload from 'public/image/icon/upload.svg';

// css
import style from './quotation.module.scss';

import { AppContext } from 'pages/_app';

// ------------------------------------------------------------------

// 假資料與fake api
import { useQuotation } from 'hooks/quotation/useQuotation';
import { fakeApi_quotation_creator } from 'fakeDatabase/fakeAPI/fakeQuotationApi';

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
  apiQuotationunLock,
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

import { TcreateQuotationProductDto } from 'js/api/dtoTypes';

// ------------------------------------------------------------------
// ------------------------------------------------------------------
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
  const status = latestContent?.status;
  const verifyForm = latestContent?.verifyForm;
  const attachedToContract = quotationData?.attachedToContract;

  const isAttach = attachedToContract ? true : undefined;

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
    changeComKeyArr,
    comVKeyArr,
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
    subTotal: quotationProdSubTotal,
    reset: resetClass,
    //
  } = useProductList({
    productArr: quotationData?.latestContent.products,
    others: quotationData?.latestContent.others,
    resetTrigger: quotationData,
    onDoorTypeChange: onDoorTypeChange,
  });

  // const [targetProd, setTargetProd] = useState<Class_product>();
  const [targetProdKey, setTargetProdKey] = useState<string>('n');
  const targetProd = productList[targetProdKey];

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
    if (quotationData) {
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
    } else {
      setAnnotation([]);
      setQr([]);
      setPaymentMethod([]);

      setSummary({
        discountRate: '100',
        subTotal: '',
        salesTax: '',
        total: '',
        deliveryLocation: '',
        deliveryDate: '',
      });
    }
  }, [quotationData, disabled]);

  useEffect(() => {
    const { subTotal, salesTax, total } = countPayInfoValue({
      discount: summary.discountRate,
      prodSubTotal: quotationProdSubTotal,
    });

    setSummary((state) => {
      return {
        ...state,
        subTotal,
        salesTax,
        total,
      };
    });
  }, [summary.discountRate, quotationProdSubTotal]);

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

        const onChangeMilestone = (v: string) => {
          setPaymentMethod((state) => {
            const copy = [...state];
            copy[index].milestone = v;

            return copy;
          });
        };

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
          onChangeMilestone,
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

  // ---------------------------------------------------------
  const { register, control, reset, watch, setValue, getValues } = useForm<Partial<TquotationContentDto>>();
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

  const salesReviewedAt = latestContent?.salesReviewedAt;
  const supervisorReviewedAt = latestContent?.supervisorReviewedAt;
  const workDirectorReviewedAt = latestContent?.workDirectorReviewedAt;
  const managerReviewedAt = latestContent?.managerReviewedAt;

  if (userId) {
    if (userId === reviewSalesEmployeeId) {
      isSales = true;
      isReviewer = true;
    } else if (userId === reviewSupervisorEmployeeId) {
      if (salesReviewedAt) {
        isSupervisor = true;
        isReviewer = true;
      }
    } else if (userId === reviewWorkDirectorEmployeeId) {
      if (salesReviewedAt && supervisorReviewedAt) {
        isWorkDirector = true;
        isReviewer = true;
      }
    }
    //  else if (userGrade >= 14) {
    // else if (userId === reviewManagerEmployeeId) {
    else if (userId === reviewManagerEmployeeId || userId === '01f55698-49bb-4501-b432-1157a5109554') {
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

  useEffect(() => {
    const latestContent = quotationData?.latestContent;

    let agentEmployee;

    if (!quotationId) {
      agentEmployee = userInfo?.employee;
    } else {
      agentEmployee = latestContent?.agentEmployee;
    }

    const quotationDate = latestContent?.quotationDate
      ? latestContent?.quotationDate
      : moment(latestContent?.quotationDate).toISOString();

    reset({
      quotationDate: quotationDate,
      validityPeriod: latestContent?.validityPeriod,
      // customerId: lContent.customer.id,
      customer: latestContent?.customer,
      projectName: latestContent?.projectName,
      county: latestContent?.county,
      district: latestContent?.district,
      address: latestContent?.address,
      contactPerson: latestContent?.contactPerson,
      contactNumber: latestContent?.contactNumber,
      discount: latestContent?.discount,
      quantity: latestContent?.quantity,
      editNotes: latestContent?.editNotes,
      status: latestContent?.status ?? 'Budget',
      // managerEmployee: latestContent?.managerEmployee,
      // supervisorEmployee: latestContent?.supervisorEmployee,
      // 審核流程改變，下方簽名bar的人等同審核人員(除了經辦)
      managerEmployee: latestContent?.reviewSupervisorEmployee,
      supervisorEmployee: latestContent?.reviewSalesEmployee,
      //
      //
      agentEmployee: agentEmployee,
      //
      //
      trackProgress: latestContent?.trackProgress,
      projectProgress: latestContent?.projectProgress,
    });
  }, [quotationData]);

  const onProfileChange = (v: Partial<TreturnBody>) => {
    setValue('validityPeriod', v.validityPeriod ?? '');
    setValue('customer', v.customer);
    setValue('projectName', v.projectName ?? '');
    setValue('county', v.county ?? '');
    setValue('district', v.district ?? '');
    setValue('address', v.address ?? '');
    setValue('contactPerson', v.contactPerson ?? '');
    setValue('contactNumber', v.contactNumber ?? '');
    setValue('trackProgress', v.trackProgress ?? '');
    setValue('projectProgress', v.projectProgress ?? '');
  };

  // --------------------------------------------------------------

  const [empSelConfirmKey, setEmpSelConfirmKey] = useState<
    'reviewSales' | 'reviewSupervisor' | 'reviewWorkDirector' | 'undefined'
  >('undefined');

  const openEmpSel = (v: 'reviewSales' | 'reviewSupervisor' | 'reviewWorkDirector') => {
    setEmpSelConfirmKey(v);
    setEmployeeSelectorShow(true);
  };

  const onEmpSelCancel = () => {
    setEmployeeSelectorShow(false);
    setEmpSelConfirmKey('undefined');
  };

  const empSelLookup = {
    reviewSales: {
      label: '請選擇審核業務',
      // tip: '可不選，直接按確定',
      onCancel: onEmpSelCancel,
      onConfirm: (v: TemployeeDto[]) => {
        setReviewSales(v[0]);

        if (status === 'Contracting') {
          setTimeout(() => {
            openEmpSel('reviewSupervisor');
          }, 300);
        } else {
          reqSetReviewer({
            reviewSales: v[0],
            reviewSupervisor,
            reviewWorkDirector,
          });
        }
      },
    },
    reviewSupervisor: {
      label: '請選擇業務主管',
      // tip: '可不選，直接按確定',
      onCancel: onEmpSelCancel,
      onConfirm: async (v: TemployeeDto[]) => {
        setReviewSupervisor(v[0]);
        onEmpSelCancel();
        setTimeout(() => {
          openEmpSel('reviewWorkDirector');
        }, 300);
      },
    },
    reviewWorkDirector: {
      label: '請選擇應收帳款',
      // tip: '可不選，直接按確定',
      onCancel: onEmpSelCancel,
      onConfirm: (v: TemployeeDto[]) => {
        setReviewWorkDirector(v[0]);
        onEmpSelCancel();
        reqSetReviewer({
          reviewSales,
          reviewSupervisor,
          reviewWorkDirector: v[0],
        });
      },
    },
    undefined: {
      label: '',
      tip: '',
      onCancel: () => {},
      onConfirm: () => {},
    },
  };

  // --------------------------------------------------------------------------

  // ---------------------------------------------------------
  const fakeApiQuotaion = fakeApi_quotation_creator(router.query.quotationId as string);

  const { classQuotation, reNew: reNewClassQuotation } = useQuotation(fakeApiQuotaion?.get());
  const signatureArr: TsignatureProps[] = [
    {
      label: '總經理',
      inputProps: {
        props: {
          value: (latestContent?.reviewManagerEmployee?.chName || latestContent?.reviewManagerEmployee?.enName) ?? '',
          placeholder: '尚未選擇',
          disabled: true,
        },
      },
    },
    {
      label: '應收帳款',
      inputProps: {
        props: {
          value:
            (latestContent?.reviewWorkDirectorEmployee?.chName || latestContent?.reviewWorkDirectorEmployee?.enName) ??
            '',
          placeholder: '尚未選擇',
          disabled: true,
        },
      },
    },

    {
      label: '業務主管',
      inputProps: {
        props: {
          value:
            (latestContent?.reviewSupervisorEmployee?.chName || latestContent?.reviewSupervisorEmployee?.enName) ?? '',
          placeholder: '尚未選擇',
          disabled: true,
        },
      },
    },
    {
      label: '業務',
      inputProps: {
        props: {
          value: (latestContent?.reviewSalesEmployee?.chName || latestContent?.reviewSalesEmployee?.enName) ?? '',
          placeholder: '尚未選擇',
          disabled: true,
        },
      },
    },
    {
      label: '經辦',
      inputProps: {
        props: {
          // value: (latestContent?.agentEmployee?.chName || latestContent?.agentEmployee?.enName) ?? '',
          value: getValues('agentEmployee.chName') || getValues('agentEmployee.enName') || '',
          disabled: true,
        },
      },
    },
  ];

  useEffect(() => {
    reNewClassQuotation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------

  // --------------------------------------------------------------------------

  const [showPdf, setShowPdf] = useState(false);
  const [showPdf_part, setShowPdf_part] = useState(false);

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------

  const [showMemoModal, setShowMemoModal] = useState(false);

  const inputModalOnConfirm = (v: string) => {
    if (!v) {
      return myAlert.warning({ title: '請輸入註解' });
    }

    setValue('editNotes', v);

    setShowMemoModal(false);

    setTimeout(() => {
      reqUpdateQuotation();
    }, 10);
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
          quotationState={{ value: watch('status')!, label: quotationStatusLookup[watch('status')!] }}
          setQuotationState={(option) => {
            setValue('status', option.value as TquotationContentDto['status']);
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
      onClick: () => setShowPdf(true),
    },
    {
      type: 'myButton',
      label: '匯出材料/配件',
      img: iconUpload.src,
      onClick: () => setShowPdf_part(true),
    },

    // (!!isReviewer || null) && { type: 'myButton', label: '審核', onClick: () => reqReview() },
    (!!isReviewer || null) && {
      type: 'myButton',
      label: '審核',
      onClick: () => setReviewModalShow(true),
    },
    // (!!quotationId || null) && { type: 'myButton', label: '送審', onClick: () => openEmpSel('reviewSales') },
    (!!quotationId || null) && {
      type: 'myButton',
      label: '送審',
      onClick: () => {
        openEmpSel('reviewSales');
      },
    },
    // status
    // { type: 'myButton', label: '合約審核表', onClick: () => setReviewFormShow(true) },
    (() => {
      if (status === 'Contracting') {
        return { type: 'myButton', label: '合約審核表', onClick: () => setReviewFormShow(true) };
      } else {
        return null;
      }
    })(),
    { type: 'myButton', label: '編輯', onClick: () => setDisabled(false) },
    { type: 'myButton', label: '返回', onClick: () => router.back() },
  ];

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  if (!classQuotation) {
    return null;
  }

  // --------------------------------------------------------------------------
  const quotationPdf_part_mainProductArr = (() => {
    const theArr = classQuotation.mainProductArr.map((mp) => {
      return {
        ...mp.allData,
        part: mp.partArr.map((part) => part.allData),
      };
    });

    return theArr;
  })();

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  const reqUpdateQuotation = async () => {
    const data_watch = watch();

    // 總樘數
    let prodQty = 0;

    // prodVKeyArr 會在每一次垂直拖拉時更新
    const prodArr: TcreateQuotationProductDto[] =
      prodVKeyArr?.map((key, index) => {
        const prod = productList[key];

        const quantity = Number(prod.quantity);
        const originProd = prod.originProd;

        prodQty = prodQty + quantity;

        const preBody = {
          ...prod.body,
          order: index,
        };

        const isEqual = _.isEqual(originProd, preBody);

        if (!isEqual) {
          preBody.id = undefined;
        }

        return preBody;
      }) ?? [];

    if (!data_watch.agentEmployee?.id) {
      return myAlert.err({ title: '沒有取得經辦資料', content: '請聯絡開發人員' });
    }

    const body: TcreateQuotationContentDto = {
      quotationDate: data_watch.quotationDate ?? '',
      validityPeriod: data_watch.validityPeriod ?? '',
      //
      customerId: data_watch.customer?.id ?? '',
      //
      projectName: data_watch.projectName ?? '',
      county: data_watch.county ?? '',
      district: data_watch.district ?? '',
      address: data_watch.address ?? '',
      contactPerson: data_watch.contactPerson ?? '',
      contactNumber: data_watch.contactNumber ?? '',
      quantity: prodQty ?? 0,
      editNotes: data_watch.editNotes ?? '',
      status: data_watch.status ?? 'Budget',

      managerId: data_watch.managerEmployee?.id ?? null,
      supervisorId: data_watch.supervisorEmployee?.id ?? null,
      //
      agentId: data_watch.agentEmployee?.id,
      //
      //
      annotations: anno,
      quotationRanges: qr,
      //
      //
      faxNumber: data_watch.customer?.fax ?? '',
      trackProgress: data_watch.trackProgress ?? '',
      projectProgress: data_watch.projectProgress ?? '',

      discount: `${Number(summary.discountRate ?? 0)}` ?? '100',
      subTotal: Number(summary.subTotal.replaceAll(',', '')),
      salesTax: Number(summary.salesTax.replaceAll(',', '')),
      total: Number(summary.total.replaceAll(',', '')),
      deliveryLocation: summary.deliveryLocation,
      deliveryDate: summary.deliveryDate,
      paymentMethods: paymentMethod,
      //
      //
      products: prodArr,
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
        // res跟api文件不一樣，現在沒時間修正
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore

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

    //
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

  // 現在只有admin可以呼叫這系列的api，所以無法測試
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

    if (status === 'Contracting' && !verifyForm) {
      return myAlert.warning({ title: '請先送出合約審核表' });
    }

    try {
      setIsLoading(true);

      try {
        await apiQuotationReview({ id: quotationId, body });
      } catch (error) {
        myAlert.err({ title: '審核發生錯誤' });
        console.log(error);
      }

      await update();
    } catch (error) {
    } finally {
      setIsLoading(false);
      setReviewModalShow(false);
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

    // const foo = prod.comList;

    const componentArr = Object.values(prod.comList ?? {});

    const part: Tpart[] = componentArr.map((com) => {
      return {
        partName: com.comName,
        material: com.material,
        unit: com.unit,
        qty: com.quantity,
        price: String(com.price || 0),
        totalPrice: com.totalPrice,
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
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  return (
    <div className={classNames(style.container, 'relative')}>
      <PageHeader02 tagList={tagList} panelList={!disabled ? panel_editable : panel_noEditable} />

      <div className={style.mainContainer}>
        <div className={style.quotation}>
          {/* 基本資料 */}
          <QuotationProfile //
            profile={quotationData?.latestContent}
            disabled={disabled}
            onProfileChange={onProfileChange}
          />

          <div className={classNames(style.switchBar)}>
            <div>報價項目</div>
          </div>

          <div className={style.tableWrapper}>
            {/* 主產品設定 */}
            <Table_prod
              disabled={isAttach ? true : disabled}
              prodList={productList}
              prodCellConfig={prodCellConfig}
              prodKeyArr={prodKeyArr}
              changeProdKeyArr={changeProdKeyArr}
              addProd={addProd}
              setTargetProd={setTargetProdKey}
              // defalutVKeyArr={prodVKeyArr}
              onVKeyChange={(keyArr) => setProdVKeyArr(keyArr)}
              rowHeight="h106"
              isAttach={isAttach}
            />

            {/* 材料配件設定 */}
            <div className="relative mt-[14px]">
              <Table_com
                disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
              list={othersList}
              cellConfig={othersCellConfig}
              keyArr={othersKeyArr}
              changeKeyArr={changeOthersKeyArr}
              add={addOthers}
            />
          </div>
          {/* 備註/報價範圍/付款資訊 */}

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
          <QuotationSinature signatureArr={signatureArr} disabled={disabled} />
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
      <EmployeeSelector
        showModal={employeeSelectorShow}
        label={empSelLookup[empSelConfirmKey]?.label}
        // tip={empSelLookup[empSelConfirmKey]?.tip}
        onConfirm={(v) => {
          empSelLookup[empSelConfirmKey]?.onConfirm(v);
        }}
        onCancel={() => empSelLookup[empSelConfirmKey]?.onCancel()}
        selLimit={1}
      />
      {/* 合約審核表 */}
      <ContractReviewForm
        showModal={reviewFormShow}
        close={() => setReviewFormShow(false)}
        contractIdNumber={quotationData?.latestContent.quotationNumber ?? ''}
        contractName={quotationData?.latestContent.projectName ?? ''}
        contractPrice={Number(summary.total.replaceAll(',', ''))}
        lastestContentId={lastestContentId}
        verifyForm={verifyForm}
        onConfirm={() => update()}
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
