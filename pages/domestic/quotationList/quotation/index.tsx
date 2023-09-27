// 常用變數目錄
/**
 * useProductList
 * reqUpdateQuotation
 * useGetQuotation_id
 * fileInfoArr
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
import QuotationPdf from 'components/page/domestic/pdf/quotationPdf/quotationPdf';
import QuotationPdf_part from 'components/page/domestic/pdf/quotationPdf_part/quotationPdf_part';
import QuotationStateSel from 'components/page/domestic/budget/quotationStateSel';
import QuotationAdditions from 'components/page/domestic/quotation/quotationAdditions';

// global gear
import PageHeader02, { TtagList, TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import TextareaModal from 'components/global/gear/modal/simpleModal/textareaModal';
import EmployeeSelector, { TemployeeDto } from 'components/global/gear/modal/employeeSelector';
import LoadingCover01 from 'components/global/gear/loadingCover/loadingCover01';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import { showRootLoading } from 'components/global/gear/loadingCover/rootLoadingCover';

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

import { Class_product, useProductList } from 'hooks/quotation/useProduct';

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
  const { userInfo } = useContext(AppContext);
  const userId = userInfo?.employee?.id;
  // -----------------------------------------------------
  const [isLoading, setIsLoading] = useState(false);
  // 是否可編輯
  const [disabled, setDisabled] = useState(true);
  // -----------------------------------------------------
  const [employeeSelectorShow, setEmployeeSelectorShow] = useState(false);
  // -----------------------------------------------------
  // 資料
  const { data: quotationData, update } = useGetQuotation_id(quotationId as string);
  const lasttestContentId = quotationData?.latestContent.id;
  // -----------------------------------------------------

  const [targetProd, setTargetProd] = useState<Class_product>();

  // -----------------------------------------------------
  // -----------------------------------------------------
  // -----------------------------------------------------
  // -----------------------------------------------------

  const { attachments, updateAttachments, domain } = useQuotation_id_attachments(lasttestContentId);

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
    subTotal: prodSubTotal,
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
  } = useProductList({
    productArr: quotationData?.latestContent.products,
    others: quotationData?.latestContent.others,
    resetTrigger: quotationData,
  });

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

  const [anno, setAnnotation] = useState<string[]>([]);
  const [qr, setQr] = useState<string[]>([]);

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
      prodSubTotal: prodSubTotal,
    });

    setSummary((state) => {
      return {
        ...state,
        subTotal,
        salesTax,
        total,
      };
    });
  }, [summary.discountRate, prodSubTotal]);

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

  // ---------------------------------------------------------
  const { register, control, reset, watch, setValue } = useForm<Partial<TquotationContentDto>>();
  // const { data, update } = useGetQuotation_id(id as string);

  let isReviewer = false;
  const reviewSalesEmployeeId = quotationData?.latestContent?.reviewSalesEmployee?.id;
  const reviewSupervisorEmployeeId = quotationData?.latestContent?.reviewSupervisorEmployee?.id;

  if (userId) {
    if (userId === reviewSalesEmployeeId || userId === reviewSupervisorEmployeeId) {
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
      managerEmployee: latestContent?.managerEmployee,
      supervisorEmployee: latestContent?.supervisorEmployee,
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
    'manager' | 'supervisor' | 'reviewSales' | 'reviewSupervisor'
  >();

  const openEmpSel = (v: 'manager' | 'supervisor' | 'reviewSales' | 'reviewSupervisor') => {
    setEmpSelConfirmKey(v);
    setEmployeeSelectorShow(true);
  };

  const onEmpSelCancel = () => {
    setEmployeeSelectorShow(false);
    setEmpSelConfirmKey(undefined);
  };

  const empSelProps = (() => {
    if (empSelConfirmKey === 'manager') {
      return {
        label: '請選擇經理',
        onCancel: onEmpSelCancel,
        onConfirm: (v: TemployeeDto[]) => {
          setValue('managerEmployee', v[0]);
          onEmpSelCancel();
        },
      };
    }

    if (empSelConfirmKey === 'supervisor') {
      return {
        label: '請選擇主管',
        onCancel: onEmpSelCancel,
        onConfirm: (v: TemployeeDto[]) => {
          setValue('supervisorEmployee', v[0]);
          onEmpSelCancel();
        },
      };
    }

    if (empSelConfirmKey === 'reviewSales') {
      return {
        label: '請選擇審核業務',
        tip: '可不選，直接按確定',
        onCancel: onEmpSelCancel,
        onConfirm: (v: TemployeeDto[]) => {
          setReviewSales(v[0]);
          onEmpSelCancel();
          setTimeout(() => {
            openEmpSel('reviewSupervisor');
          }, 300);
        },
      };
    }

    if (empSelConfirmKey === 'reviewSupervisor') {
      return {
        label: '請選擇審核經理',
        tip: '可不選，直接按確定',
        onCancel: onEmpSelCancel,
        onConfirm: async (v: TemployeeDto[]) => {
          setReviewSupervisor(v[0]);
          onEmpSelCancel();
          reqSetReviewer({
            reviewSales,
            reviewSupervisor: v[0],
          });
        },
      };
    }
  })();

  // --------------------------------------------------------------------------

  // ---------------------------------------------------------
  const fakeApiQuotaion = fakeApi_quotation_creator(router.query.quotationId as string);

  const { classQuotation, reNew: reNewClassQuotation } = useQuotation(fakeApiQuotaion?.get());
  const signatureArr: TsignatureProps[] = [
    {
      label: '經理',
      inputProps: {
        props: {
          value: watch('managerEmployee')?.chName ?? '',
          onClick: () => {
            openEmpSel('manager');
          },
        },
      },
    },
    {
      label: '主管',
      inputProps: {
        props: {
          value: watch('supervisorEmployee')?.chName ?? '',
          onClick: () => {
            openEmpSel('supervisor');
          },
        },
      },
    },
    {
      label: '經辦',
      inputProps: {
        props: {
          value: watch('agentEmployee')?.chName ?? '',
          onChange: () => {},
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
    const content = quotationData?.contents ?? [];

    return content.map((item, index, arr) => {
      const { status, quotationDate } = item;
      const preStatus = arr[index - 1]?.status;

      return {
        state_from: quotationStatusLookup[preStatus] ?? '建立',
        state_to: quotationStatusLookup[status] ?? '',
        isoString: moment(quotationDate).toISOString(),
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
    { type: 'myButton', label: '取消', onClick: () => setDisabled(true) },
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
    (!!isReviewer || null) && { type: 'myButton', label: '審核', onClick: () => reqReview() },
    (!!quotationId || null) && { type: 'myButton', label: '送審', onClick: () => openEmpSel('reviewSales') },
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
      // 目前只有admin可以呼叫這系列的api，但是agentId必須送，暫時先這樣處理
      agentId: data_watch.agentEmployee?.id ?? '16f60f1c-8005-4c59-81ac-f3006bc2fc2a',
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
      return myAlert.warning({ title: '請選擇交貨日期' });
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
    reviewSupervisor,
  }: {
    reviewSales: TemployeeDto | undefined;
    reviewSupervisor: TemployeeDto | undefined;
  }) => {
    if (!quotationId) {
      return;
    }

    const reviewSalesEmployeeId = reviewSales?.id || null;
    const reviewSupervisorEmployeeId = reviewSupervisor?.id || null;

    try {
      setIsLoading(true);
      await apiQuotationSubmitReview(quotationId, {
        reviewSalesEmployeeId,
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
  const reqReview = async () => {
    if (!quotationId) {
      return;
    }

    try {
      setIsLoading(true);
      await apiQuotationReview(quotationId);
      await update();
    } catch (error) {
      myAlert.err({ title: '審核失敗' });
    } finally {
      setIsLoading(false);
    }
  };

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
              disabled={disabled}
              prodList={productList}
              prodCellConfig={prodCellConfig}
              prodKeyArr={prodKeyArr}
              changeProdKeyArr={changeProdKeyArr}
              addProd={addProd}
              setTargetProd={setTargetProd}
              // defalutVKeyArr={prodVKeyArr}
              onVKeyChange={(keyArr) => setProdVKeyArr(keyArr)}
              rowHeight="h106"
            />

            {/* 材料配件設定 */}
            <div className="relative mt-[14px]">
              <Table_com
                disabled={disabled}
                comList={targetProd?.comList}
                comCellConfig={comCellConfig}
                comKeyArr={comKeyArr}
                changeComKeyArr={changeComKeyArr}
                defalutVKeyArr={comVKeyArr}
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

          {/* 審核人員 */}
          <div className="mt-10 grid grid-cols-3 gap-[30px] px-[50px]">
            <InputSel
              caption="審核業務"
              inputProps={{
                props: {
                  disabled: true,
                  value:
                    (quotationData?.latestContent.reviewSalesEmployee?.chName ||
                      quotationData?.latestContent.reviewSalesEmployee?.enName) ??
                    '',
                },
              }}
            />
            <InputSel
              caption="審核主管"
              inputProps={{
                props: {
                  disabled: true,
                  value:
                    (quotationData?.latestContent.reviewSupervisorEmployee?.chName ||
                      quotationData?.latestContent.reviewSupervisorEmployee?.enName) ??
                    '',
                },
              }}
            />
          </div>
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
      {/* <QuotationPdf
        isVisable={showPdf}
        onCancel={() => {
          setShowPdf(false);
        }}
        classQuotation={classQuotation}
      /> */}
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
      {/* <QuotationPdf_part
        isVisable={showPdf_part}
        onCancel={() => {
          setShowPdf_part(false);
        }}
        mainProductArr={quotationPdf_part_mainProductArr}
        quotationId={classQuotation.quotationId}
      /> */}
      {/*  */}
      <EmployeeSelector
        showModal={employeeSelectorShow}
        label={empSelProps?.label}
        tip={empSelProps?.tip}
        onConfirm={(v) => {
          empSelProps?.onConfirm(v);
        }}
        onCancel={() => empSelProps?.onCancel()}
        selLimit={1}
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

  const subTotalStr = subTotal.ceil().toLocaleString();
  const taxStr = tax.ceil().toLocaleString();
  const totalStr = total.ceil().toLocaleString();

  return {
    subTotal: subTotalStr,
    salesTax: taxStr,
    total: totalStr,
  };
};
