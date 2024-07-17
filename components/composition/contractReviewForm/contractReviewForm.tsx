import {
  //
  useState,
  useEffect,
  useMemo,
  useContext,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import Decimal from 'decimal.js';
import {
  useForm,
  // useFormState
} from 'react-hook-form';

import { AppContext } from 'pages/_app';

// antd
import { Modal } from 'antd';
import { Radio } from 'antd';

//
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';

// gear
// import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
// import CellWithBar from 'components/global/gear/cell/cellWithBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';
import SignatureBar, { TsignatureBarItem } from 'components/global/gear/signatureBar_v2';

// api
import { Tparams, TemployeeDto, useEmployee_infinite } from 'js/api/api_employee';
import {
  TreviewQuotationContentDto,
  //
  apiSubmitContracting,
  apiPatchQuotationVerifyForm,
  apiQuotationReview,
  //
  useGetContract_id,
  useGetQuotation_id,
  useGetQuotationContent_id_2,
} from 'js/api/api_quotation';

// css
import scss from './contractReviewForm.module.scss';

// type
import {
  TpaymentRatioDto,
  TcreateQuotationVerifyFormDto,
  TquotationVerifyFormDto,
  //
  TquotationContentDto,
  TuserDto,
} from 'js/api/dtoTypes';

// utils
import { dlPdf, calcHeight_a4 } from 'js/utils/dlPdf';

// ============================================================================

type Tprops_reviewForm = {
  readOnly?: boolean;

  contractId?: string | undefined; // 有contractId
  quotationId?: string | undefined; // 呼叫 apiQuotationReview 所需
  contentId?: string | undefined; // 呼叫 apiSubmitContracting 所需

  onCancel?: () => void;
  onConfirm?: () => void;

  isInContract?: boolean | undefined; // 為true 呼叫 apiPatchQuotationVerifyForm 否則呼叫 apiSubmitContracting

  // verifyForm: TquotationVerifyFormDto | undefined;

  // contractNumber: string;
  // projectName: string;
  // totalPrice: number;

  // quotationContent?: TquotationContentDto | undefined; // 這是為了取得審核人員的資料

  // defaultPaymentRatioArr?: TpaymentRatioDto[] | undefined;
};

type TpaymentRatio = {
  title: string;
  percent: string;
  price: string;
  note: string;
};

type TpayMethodList = {
  [key: string]: Class_payMethod;
};

type TreviewerItem = {
  reviewer: TemployeeDto | null;
  reviewedAt: string | null;
  toReviewerAt: string | null;
};

type TreviewerList = {
  manager: TreviewerItem;
  workDirector: TreviewerItem;
  cashier: TreviewerItem;
  supervisor: TreviewerItem;
};

export type { TpaymentRatio };

// ============================================================================
// calcHeight_a4
const bodyWidth = 1000;
const bodyHeight = calcHeight_a4(bodyWidth);
const bodyPaddingTop = 30;
const bodyPaddingBottom = 25;
const style_body = {
  width: `${bodyWidth}px`,
  height: `${bodyHeight}px`,
  paddingTop: `${bodyPaddingTop}px`,
  paddingBottom: `${bodyPaddingBottom}px`,
};

// ============================================================================

// region START

function ContractReviewForm({
  showModal,
  ...props_reviewForm
}: Tprops_reviewForm & {
  showModal: boolean;
}) {
  // ----------------------------------------------------------------------------

  return (
    <Modal
      className={scss.modal}
      visible={showModal}
      closable={false}
      centered={true}
      destroyOnClose={true}
      footer={null}
      // width="1000px"
      width="fit-content"
      onCancel={props_reviewForm.onCancel}
    >
      <ReviewForm {...props_reviewForm} />
    </Modal>
  );
}

// endregion START

// MARK: END
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// MARK:ReviewForm

function ReviewForm({
  readOnly,
  contractId,
  quotationId: quotationId_param,
  contentId: contentId_param,
  isInContract,
  onCancel,
  onConfirm,
}: Tprops_reviewForm) {
  //
  const { userInfo } = useContext(AppContext);
  //

  const stateObj_disabled = useState(true);
  let disabled = stateObj_disabled[0];
  const setDisabled = stateObj_disabled[1];
  readOnly && (disabled = true);

  const [forceRender, setForceRender] = useState(0);

  // ----------------------------------------------------------------------------

  const ref_head = useRef<HTMLDivElement>(null);

  // w item從index 1開始加入，所以index 0是undefined
  const ref_itemArr = useRef<HTMLDivElement[]>([]);

  const ref_pdf = useRef<{
    dlPdf: (fileName: string) => void;
  }>(null);

  // ----------------------------------------------------------------------------

  // useGetContract_id
  const { data: data_contract, update: update_contract } = useGetContract_id(contractId, {
    customPopulate: [
      'quotation',
      'content.verifyForm',
      'content.reviewSupervisorEmployee',
      'content.reviewWorkDirectorEmployee',
      'content.reviewCashierEmployee',
      'content.reviewManagerEmployee',
    ],
  });

  const { data: data_quotation, update: update_quotation } = useGetQuotation_id(quotationId_param, {
    params: {
      populate: [
        'latestContent.verifyForm',
        'latestContent.reviewSupervisorEmployee',
        'latestContent.reviewWorkDirectorEmployee',
        'latestContent.reviewCashierEmployee',
        'latestContent.reviewManagerEmployee',
      ],
    },
  });

  const { data: data_quotationContent, update: update_quotationContent } = useGetQuotationContent_id_2(
    contentId_param,
    {
      params: {
        populate: [
          'verifyForm',
          'reviewSupervisorEmployee',
          'reviewWorkDirectorEmployee',
          'reviewCashierEmployee',
          'reviewManagerEmployee',
        ],
      },
    }
  );

  const update = async () => {
    if (contractId) {
      await update_contract();
    } else if (quotationId_param) {
      await update_quotation();
    } else if (contentId_param) {
      await update_quotationContent();
    }
  };

  const {
    contractNumber,
    projectName,
    totalPrice,
    quotationContent,
    verifyForm,
    defaultPaymentRatioArr,
    quotationId,
    contentId,
  } = useMemo(() => {
    const contractNumber = data_contract?.contractNumber ?? '';

    const content = data_contract?.content || data_quotation?.latestContent || data_quotationContent;
    const quotationId = data_contract?.quotation.id || data_quotation?.id;

    const defaultPaymentRatioArr = content ? createDefaultPaymentRatio(content) : undefined;

    return {
      verifyForm: content?.verifyForm,

      contractNumber: contractNumber,

      projectName: content?.projectName ?? '',
      totalPrice: content?.total ?? 0,
      quotationContent: content,

      defaultPaymentRatioArr,

      quotationId,

      contentId: content?.id,
    };
  }, [data_contract, data_quotation, data_quotationContent]);

  // ----------------------------------------------------------------------------

  const { isReviewer, isManager, isWorkDirector, isCashier, isSupervisor } = checkIsReviewer({
    userInfo,
    quotationContent,
  });

  // ----------------------------------------------------------------------------

  const { payMethodList, addMethod, resetMethodList, getMethodBodyArr, allPercentStr } = usePayMethod({
    contractPrice: totalPrice,
  });

  // const { register, control, reset, watch, setValue } = useForm<TcontractReviewForm>();
  const { register, control, reset, watch, setValue, getValues } =
    useForm<Omit<TcreateQuotationVerifyFormDto, 'TpaymentRatioDto'>>();

  const watchData = watch();

  // ----------------------------------------------------------------------------

  // region REQUEST

  const reqSubmitContracting = async () => {
    if (!contentId || disabled) {
      return;
    }

    const preBody = watch();

    if (isNaN(Number(preBody.askForPaymentDate))) {
      preBody.askForPaymentDate = '';
    }

    if (isNaN(Number(preBody.disbursementDate))) {
      preBody.disbursementDate = '';
    }

    const body: TcreateQuotationVerifyFormDto = {
      // array
      paymentRatio: Object.values(payMethodList).map((item) => item.body),
      // date
      askForPaymentDate: preBody.askForPaymentDate,
      disbursementDate: preBody.disbursementDate,
      paymentTenor: preBody.paymentTenor,
      // boolean
      performanceBond: preBody.performanceBond,
      depositPayment: preBody.depositPayment,
      warrantyPayment: preBody.warrantyPayment,
      fireproofCertificate: preBody.fireproofCertificate,
      warranty: preBody.warranty,
      testDrive: preBody.testDrive,
      // string
      warrantyPeriod: preBody.warrantyPeriod ?? '',
      note: preBody.note ?? '',
      debitItem: preBody.debitItem ?? '',

      paymentDateNote: preBody.paymentDateNote ?? '',
      paymentTenorNote: preBody.paymentTenorNote ?? '',
      performanceBondNote: preBody.performanceBondNote ?? '',
      depositPaymentNote: preBody.depositPaymentNote ?? '',
      warrantyPaymentNote: preBody.warrantyPaymentNote ?? '',
      fireproofCertificateNote: preBody.fireproofCertificateNote ?? '',
      warrantyNote: preBody.warrantyNote ?? '',
      testDriveNote: preBody.testDriveNote ?? '',

      fireproofCertificatePercent: Number(preBody.fireproofCertificatePercent) || null,
      warrantyPercent: Number(preBody.warrantyPercent) || null,

      factoryCertificate: preBody.factoryCertificate,
      factoryCertificatePercent: Number(preBody.factoryCertificatePercent) || null,
      factoryCertificateNote: preBody.factoryCertificateNote,

      //
    };

    let isPaymentOk = true;
    body.paymentRatio.forEach((item) => {
      const { level, paymentRatio, price, note } = item;

      if (!level || !paymentRatio || !price) {
        isPaymentOk = false;
      }
    });

    if (!body.askForPaymentDate || !body.disbursementDate || !body.paymentTenor) {
      return myAlert.warning({ title: '請填寫所有日期' });
    } else if (
      body.performanceBond === undefined ||
      body.depositPayment === undefined ||
      body.warrantyPayment === undefined ||
      body.fireproofCertificate === undefined ||
      body.warranty === undefined ||
      body.testDrive === undefined
    ) {
      return myAlert.warning({ title: '請填寫所有二選一選項' });
    } else if (!isPaymentOk) {
      return myAlert.warning({ title: '請確實設定請款比例' });
    }

    try {
      if (isInContract && verifyForm) {
        await apiPatchQuotationVerifyForm({
          verifyForm: verifyForm.id,
          body,
        });
      } else {
        await apiSubmitContracting({ contentId, body });
      }

      await update();
      onConfirm && (await onConfirm());
      setDisabled(true);
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '送出合約審核表失敗', content: err?.message });
    }
  };

  const reqPatchQuotationReview = async ({ reviewResult }: { reviewResult: boolean }) => {
    const userId = userInfo?.employee?.id;

    if (!isReviewer || !userId || !quotationId) {
      return;
    }

    const body: TreviewQuotationContentDto = {
      reviewResult,
    };

    isManager
      ? (body.reviewManagerEmployeeId = userId)
      : isWorkDirector
      ? (body.reviewWorkDirectorEmployeeId = userId)
      : isCashier
      ? (body.reviewCashierEmployeeId = userId)
      : isSupervisor
      ? (body.reviewSupervisorEmployeeId = userId)
      : null;

    await apiQuotationReview({ id: quotationId, body }).then(async () => {
      await update();
      onConfirm && onConfirm();
    });
  };

  // ----------------------------------------------------------------------------

  // region FUNCTION

  const handle_Cancel = () => {
    onCancel?.();
  };

  const handle_confirm = async () => {
    await reqSubmitContracting();

    // close?.();
    // onConfirm && (await onConfirm());
    // setDisabled(true);
  };

  const handle_review = () => {
    const modal = myAlert.btnBar({ title: '合約審核表是否通過審核?' });

    modal.update({
      content: (
        <div className="flex gap-5 mt-10">
          <MyButton_v2
            theme="danger"
            onClick={async () => {
              await reqPatchQuotationReview({ reviewResult: true });
              modal.destroy();
            }}
          >
            審核通過
          </MyButton_v2>
          <MyButton_v2
            onClick={async () => {
              await reqPatchQuotationReview({ reviewResult: false });
              modal.destroy();
            }}
          >
            審核不通過
          </MyButton_v2>
          <MyButton_v2 onClick={modal.destroy}>取消</MyButton_v2>
        </div>
      ),
    });
  };

  const handle_dlPdf = () => {
    ref_pdf.current?.dlPdf(`合約審核表_${contractNumber}_${projectName}`);
  };

  // ----------------------------------------------------------------------------

  // region PROPS

  const reviewerList = useMemo(() => {
    if (!quotationContent) {
      return undefined;
    }

    const {
      // reviewSalesEmployee,
      // salesReviewedAt,
      // toSalesAt,

      reviewSupervisorEmployee,
      supervisorReviewedAt,
      toSupervisorAt,

      reviewWorkDirectorEmployee,
      workDirectorReviewedAt,
      toWorkDirectorAt,

      toCashierAt,
      reviewCashierEmployee,
      cashierReviewedAt,

      reviewManagerEmployee,
      managerReviewedAt,
      toManagerAt,
    } = quotationContent;

    const list: TreviewerList = {
      manager: {
        reviewer: reviewManagerEmployee,
        reviewedAt: managerReviewedAt,
        toReviewerAt: toManagerAt,
      },
      workDirector: {
        reviewer: reviewWorkDirectorEmployee,
        reviewedAt: workDirectorReviewedAt,
        toReviewerAt: toWorkDirectorAt,
      },
      cashier: {
        reviewer: reviewCashierEmployee,
        reviewedAt: cashierReviewedAt,
        toReviewerAt: toCashierAt,
      },
      supervisor: {
        reviewer: reviewSupervisorEmployee,
        reviewedAt: supervisorReviewedAt,
        toReviewerAt: toSupervisorAt,
      },
    };

    return list;
  }, [quotationContent]);

  const signatureArr: TsignatureBarItem[] = useMemo(() => {
    if (!reviewerList) {
      return [];
    }

    const { manager, workDirector, cashier, supervisor } = reviewerList;

    const signatureArr: TsignatureBarItem[] = [
      {
        label: '總經理',
        value: manager.reviewer?.chName ?? '',
        isReviewed: manager.reviewedAt ? true : false,
      },
      {
        label: '應收帳款',
        value: cashier.reviewer?.chName ?? '',
        isReviewed: cashier.reviewedAt ? true : false,
      },
      {
        label: '應收帳款',
        value: workDirector.reviewer?.chName ?? '',
        isReviewed: workDirector.reviewedAt ? true : false,
      },
      {
        label: '業務主管',
        value: supervisor.reviewer?.chName ?? '',
        isReviewed: supervisor.reviewedAt ? true : false,
      },
    ];

    return signatureArr;
  }, [userInfo, reviewerList]);

  // ----------------------------------------------------------------------------

  // region useEffect

  useEffect(() => {
    update();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId, quotationId_param]);

  useEffect(() => {
    // verifyForm

    let methodArr: TpaymentRatio[] | undefined = undefined;

    if (verifyForm) {
      const {
        askForPaymentDate,
        disbursementDate,

        paymentTenor,
        performanceBond,
        depositPayment,
        warrantyPeriod,
        note,
        warrantyPayment,
        fireproofCertificate,
        warranty,
        testDrive,
        debitItem,

        //
        paymentDateNote,
        paymentTenorNote,
        performanceBondNote,
        depositPaymentNote,
        warrantyPaymentNote,
        fireproofCertificateNote,
        warrantyNote,
        testDriveNote,

        fireproofCertificatePercent,
        warrantyPercent,

        factoryCertificate,
        factoryCertificatePercent,
        factoryCertificateNote,
      } = verifyForm;

      reset({
        askForPaymentDate,
        disbursementDate,
        // paymentRatio,
        paymentTenor,
        performanceBond,
        depositPayment,
        warrantyPeriod,
        note,
        warrantyPayment,
        fireproofCertificate,
        warranty,
        testDrive,
        debitItem,
        // workDirectorId,
        paymentDateNote,
        paymentTenorNote,
        performanceBondNote,
        depositPaymentNote,
        warrantyPaymentNote,
        fireproofCertificateNote,
        warrantyNote,
        testDriveNote,

        fireproofCertificatePercent,
        warrantyPercent,

        factoryCertificate,
        factoryCertificatePercent,
        factoryCertificateNote,
      });

      methodArr = verifyForm?.paymentRatio.map((item) => {
        return {
          title: item.level,
          percent: item.paymentRatio,
          price: item.price,
          note: item.note ?? '',
        };
      });
    } else {
      reset({
        askForPaymentDate: undefined,
        disbursementDate: undefined,
        paymentTenor: undefined,
        performanceBond: undefined,
        depositPayment: undefined,
        warrantyPeriod: undefined,
        note: undefined,
        warrantyPayment: undefined,
        fireproofCertificate: undefined,
        factoryCertificate: undefined,
        warranty: undefined,
        testDrive: undefined,
        debitItem: undefined,

        paymentDateNote: undefined,
        paymentTenorNote: undefined,
        performanceBondNote: undefined,
        depositPaymentNote: undefined,
        warrantyPaymentNote: undefined,
        fireproofCertificateNote: undefined,
        factoryCertificateNote: undefined,
        warrantyNote: undefined,
        testDriveNote: undefined,

        fireproofCertificatePercent: 90,
        factoryCertificatePercent: 90,
        warrantyPercent: 100,
      });

      methodArr = defaultPaymentRatioArr?.map((item) => {
        return {
          title: item.level,
          percent: item.paymentRatio,
          price: item.price,
          note: item.note ?? '',
        };
      });
    }

    resetMethodList({ defaultPayMethodArr: methodArr });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled, verifyForm, defaultPaymentRatioArr]);

  // ----------------------------------------------------------------------------

  useEffect(() => {
    // 為了確保匯出時ref的值是新的，
    // 這個做法髒髒的，希望未來能找到更好的解法
    setTimeout(() => {
      setForceRender((state) => state + 1);
    }, 10);
  }, [data_contract, data_quotation, data_quotationContent, disabled]);

  // ----------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <div className={classNames(scss.container, disabled && scss.disabled)}>
      <div className={classNames(scss.btnBar, readOnly && scss.readOnly)}>
        {!disabled && (
          <>
            <MyButton_v2 px="px22" py="py4" theme="danger" onClick={handle_confirm}>
              確定
            </MyButton_v2>
            <MyButton_v2 px="px22" py="py4" onClick={() => setDisabled(true)}>
              取消
            </MyButton_v2>
          </>
        )}

        {disabled && (
          <>
            <MyButton_v2 px="px22" py="py4" onClick={handle_dlPdf}>
              匯出
            </MyButton_v2>
            {isReviewer && isInContract && (
              <MyButton_v2 theme="danger" px="px22" py="py4" onClick={handle_review}>
                審核
              </MyButton_v2>
            )}
            <MyButton_v2 px="px22" py="py4" onClick={() => setDisabled(false)}>
              編輯
            </MyButton_v2>
          </>
        )}
      </div>

      <Body
        style={{
          ...style_body,
          height: 'auto',
        }}
      >
        <div ref={ref_head} className={scss.head}>
          <p className={scss.title}>合約審核表</p>
          {/*  */}
          <div className={scss.subTitle}>
            <span>合約編號</span>
            <span>{contractNumber}</span>
            <span>工程名稱</span>
            <span>{projectName}</span>
          </div>
        </div>
        {/*  */}

        {/* // MARK: 1 */}
        <Item ref={(ele) => (ref_itemArr.current[1] = ele!)}>
          <div className={scss.numIndex}>1</div>
          <div>
            <span>註明請款日</span>
            {/* <InputSel
              className={scss.date}
              disabled={disabled}
              inputProps={{
                props: {
                  value: watchData.askForPaymentDate ?? '',
                  onChange: (e) => {
                    const str = e.target.value;

                    if (str === '') {
                      setValue('askForPaymentDate', str);
                    } else {
                      let num = parseInt(str);
                      num = Math.abs(num);
                      setValue('askForPaymentDate', String(num));
                    }
                  },
                  type: 'number',
                },
              }}
            /> */}

            <InputBox
              className={scss.date}
              disabled={disabled}
              inputAttr={{
                value: watchData.askForPaymentDate ?? '',
                onChange: (e) => {
                  const str = e.target.value;

                  if (str === '') {
                    setValue('askForPaymentDate', str);
                  } else {
                    let num = parseInt(str);
                    num = Math.abs(num);
                    setValue('askForPaymentDate', String(num));
                  }
                },
                type: 'number',
              }}
            />

            <span>，放款日</span>
            {/* <InputSel
              className={scss.date}
              disabled={disabled}
              inputProps={{
                props: {
                  value: watchData.disbursementDate ?? '',
                  onChange: (e) => {
                    const str = e.target.value;

                    if (str === '') {
                      setValue('disbursementDate', str);
                    } else {
                      let num = parseInt(str);
                      num = Math.abs(num);
                      setValue('disbursementDate', String(num));
                    }
                  },
                  type: 'number',
                },
              }}
            /> */}
            <InputBox
              className={scss.date}
              disabled={disabled}
              inputAttr={{
                value: watchData.disbursementDate ?? '',
                onChange: (e) => {
                  const str = e.target.value;

                  if (str === '') {
                    setValue('disbursementDate', str);
                  } else {
                    let num = parseInt(str);
                    num = Math.abs(num);
                    setValue('disbursementDate', String(num));
                  }
                },
                type: 'number',
              }}
            />

            <InputBox
              className="mt-1 w-full"
              prefix="備註 :"
              disabled={disabled}
              inputAttr={{
                placeholder: '',
                value: watchData.paymentDateNote ?? '',
                onChange: (e) => {
                  setValue('paymentDateNote', e.target.value);
                },
              }}
            />
          </div>
        </Item>

        {/* // MARK: 2 */}
        <Item ref={(ele) => (ref_itemArr.current[2] = ele!)}>
          <div className={scss.numIndex}>2</div>
          <div className={scss.item2}>
            <div>
              <span>確定請款比例</span>
              <InputBox disabled={true} inputAttr={{ className: 'pl-4', value: allPercentStr }} />
            </div>
            <div className={scss.payMethodContainer}>
              {Object.values(payMethodList).map((item, index, arr) => {
                let onDel = arr.length > 1 ? item.delSelf : undefined;

                if (disabled) {
                  onDel = undefined;
                }

                return (
                  <Row
                    key={index}
                    disabled={disabled}
                    onAdd={disabled ? undefined : addMethod}
                    onDel={onDel}
                    serialNumber={index + 1}
                    title={{
                      value: item.title,
                      onChange: (e) => {
                        item.title = e.target.value;
                      },
                    }}
                    percent={{
                      value: item.percent,
                      onChange: (e) => {
                        item.percent = e.target.value;
                      },
                    }}
                    price={{
                      value: item.price,
                    }}
                    note={{
                      value: item.note,
                      onChange: (e) => {
                        item.note = e.target.value;
                      },
                    }}
                  />
                );
              })}
            </div>
          </div>
        </Item>

        {/* // MARK: 3 */}
        <Item ref={(ele) => (ref_itemArr.current[3] = ele!)}>
          <div className={scss.numIndex}>3</div>
          <div>
            <div className={scss.paymentTenor}>
              <span>合理的放款票期</span>
              {/* <InputSel
                disabled={disabled}
                inputProps={{
                  props: {
                    value: watchData.paymentTenor ?? '',
                    onChange: (e) => {
                      setValue('paymentTenor', e.target.value);
                    },
                  },
                }}
              /> */}

              <InputBox
                boxStyle={{ width: '200px' }}
                disabled={disabled}
                inputAttr={{
                  value: watchData.paymentTenor ?? '',
                  onChange: (e) => {
                    setValue('paymentTenor', e.target.value);
                  },
                }}
              />
            </div>
            <InputBox
              className="mt-1 w-full"
              prefix="備註 :"
              inputAttr={{
                disabled: disabled,
                placeholder: '',

                value: watchData.paymentTenorNote ?? '',
                onChange: (e) => {
                  setValue('paymentTenorNote', e.target.value);
                },
              }}
            />
          </div>
        </Item>

        {/* // MARK: 4 */}
        <Item ref={(ele) => (ref_itemArr.current[4] = ele!)}>
          <div className={scss.numIndex}>4</div>
          <div>
            <RadioContainer
              disabled={disabled}
              label={'是否出具履約保證票'}
              labelClassName="mr-[48px]"
              value={watchData.performanceBond}
              onChange={(v) => {
                setValue('performanceBond', v);
              }}
            />
            <InputBox
              className="mt-1 w-full"
              prefix="備註 :"
              inputAttr={{
                disabled: disabled,
                value: watchData.performanceBondNote ?? '',
                onChange: (e) => {
                  setValue('performanceBondNote', e.target.value);
                },
                placeholder: '',
              }}
            />
            <p className="text-[13px] text-[red] m-0">嚴禁使用商業本票</p>
          </div>
        </Item>

        {/* //MARK: 5 */}
        <Item ref={(ele) => (ref_itemArr.current[5] = ele!)}>
          <div className={scss.numIndex}>5</div>
          <div>
            <RadioContainer
              disabled={disabled}
              label={'是否可請訂金款'}
              labelClassName="mr-[75px]"
              value={watchData.depositPayment}
              onChange={(v) => {
                setValue('depositPayment', v);
              }}
            />
            <InputBox
              className="mt-1 w-full"
              prefix="備註 :"
              inputAttr={{
                disabled: disabled,
                placeholder: '',
                value: watchData.depositPaymentNote ?? '',
                onChange: (e) => {
                  setValue('depositPaymentNote', e.target.value);
                },
              }}
            />
          </div>
        </Item>

        {/* // MARK: 6 */}
        <Item ref={(ele) => (ref_itemArr.current[6] = ele!)}>
          <div className={scss.numIndex}>6</div>
          <div>
            <InputBox
              prefix="合理的保固期 :"
              suffix="年"
              boxStyle={{ width: '180px' }}
              inputAttr={{
                disabled: disabled,
                value: watchData.warrantyPeriod ?? '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;

                  if (!value.includes('.')) {
                    setValue('warrantyPeriod', Number(value), { shouldValidate: true });
                  }
                },
                type: 'number',
                className: 'text-center',
              }}
            />

            <InputBox
              prefix="備註 :"
              className="mt-1 w-full"
              inputAttr={{
                disabled: disabled,
                ...register('note'),
              }}
            />
          </div>
        </Item>

        {/* // MARK: 7 */}
        <Item ref={(ele) => (ref_itemArr.current[7] = ele!)}>
          <div className={scss.numIndex}>7</div>
          <div>
            <RadioContainer
              disabled={disabled}
              label={'是否出具保固票或保固金'}
              labelClassName="mr-[48px]"
              value={watchData.warrantyPayment}
              onChange={(v) => {
                setValue('warrantyPayment', v);
              }}
            />
            <InputBox
              className="mt-1 w-full"
              prefix="備註 :"
              inputAttr={{
                disabled: disabled,
                value: watchData.warrantyPaymentNote ?? '',
                onChange: (e) => {
                  setValue('warrantyPaymentNote', e.target.value);
                },
                placeholder: '',
              }}
            />
          </div>
        </Item>

        {/* // MARK: 8 */}
        <Item ref={(ele) => (ref_itemArr.current[8] = ele!)}>
          <div className={scss.numIndex}>8</div>
          <div>
            <div>
              <RadioContainer
                disabled={disabled}
                // label={'是否註明收足90%出具防火證明、出廠證明'}
                label={
                  <span>
                    是否註明收足
                    <InputBox
                      className="w-[50px] "
                      inputAttr={{
                        className: 'text-center',
                        disabled: disabled,
                        type: 'number',
                        value: watchData.fireproofCertificatePercent ?? '',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value;

                          if (!value.includes('.')) {
                            setValue('fireproofCertificatePercent', Number(value));
                          }
                        },
                      }}
                    />
                    %出具防火證明
                  </span>
                }
                labelClassName="mr-[48px]"
                value={watchData.fireproofCertificate}
                onChange={(v) => {
                  setValue('fireproofCertificate', v);
                }}
              />
            </div>
            <InputBox
              className="mt-1 w-full"
              prefix="備註 :"
              inputAttr={{
                disabled: disabled,
                placeholder: '',
                value: watchData.fireproofCertificateNote ?? '',
                onChange: (e) => {
                  setValue('fireproofCertificateNote', e.target.value);
                },
              }}
            />
          </div>
        </Item>

        {/* // MARK: 9 */}
        <Item ref={(ele) => (ref_itemArr.current[9] = ele!)}>
          <div className={scss.numIndex}>9</div>
          <div>
            <div>
              <RadioContainer
                disabled={disabled}
                // label={'是否註明收足90%出具防火證明、出廠證明'}
                label={
                  <span>
                    是否註明收足
                    <InputBox
                      className="w-[50px] "
                      inputAttr={{
                        className: 'text-center',
                        disabled: disabled,
                        type: 'number',
                        value: watchData.factoryCertificatePercent ?? '',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value;

                          if (!value.includes('.')) {
                            setValue('factoryCertificatePercent', Number(value));
                          }
                        },
                      }}
                    />
                    %出具出廠證明
                  </span>
                }
                labelClassName="mr-[48px]"
                value={watchData.factoryCertificate}
                onChange={(v) => {
                  setValue('factoryCertificate', v);
                }}
              />
            </div>
            <InputBox
              className="mt-1 w-full"
              prefix="備註 :"
              inputAttr={{
                disabled: disabled,
                placeholder: '',
                value: watchData.factoryCertificateNote ?? '',
                onChange: (e) => {
                  setValue('factoryCertificateNote', e.target.value);
                },
              }}
            />
          </div>
        </Item>

        {/* // MARK: 10 */}
        <Item ref={(ele) => (ref_itemArr.current[10] = ele!)}>
          <div className={scss.numIndex}>10</div>
          <div>
            <div>
              <RadioContainer
                disabled={disabled}
                label={
                  <span>
                    是否註明收足
                    <InputBox
                      className="w-[50px] "
                      inputAttr={{
                        className: 'text-center',
                        disabled: disabled,
                        type: 'number',
                        value: watchData.warrantyPercent ?? '',
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value;

                          if (!value.includes('.')) {
                            setValue('warrantyPercent', Number(value));
                          }
                        },
                      }}
                    />
                    %出具保固書
                  </span>
                }
                labelClassName="mr-[48px]"
                value={watchData.warranty}
                onChange={(v) => {
                  setValue('warranty', v);
                }}
              />
            </div>
            <InputBox
              className="mt-1 w-full"
              prefix="備註 :"
              inputAttr={{
                disabled: disabled,
                placeholder: '',
                value: watchData.warrantyNote ?? '',
                onChange: (e) => {
                  setValue('warrantyNote', e.target.value);
                },
              }}
            />
          </div>
        </Item>

        {/* // MARK: 11 */}
        <Item ref={(ele) => (ref_itemArr.current[11] = ele!)}>
          <div className={scss.numIndex}>11</div>
          <div>
            <div>
              <RadioContainer
                disabled={disabled}
                label={'請按裝款時是否需配合工地試車'}
                labelClassName="mr-[48px]"
                value={watchData.testDrive}
                onChange={(v) => {
                  setValue('testDrive', v);
                }}
              />
            </div>
            <InputBox
              className="mt-1 w-full"
              prefix="備註 :"
              inputAttr={{
                disabled: disabled,
                placeholder: '',
                value: watchData.testDriveNote ?? '',
                onChange: (e) => {
                  setValue('testDriveNote', e.target.value);
                },
              }}
            />
          </div>
        </Item>

        {/* // MARK: 12 */}
        <Item ref={(ele) => (ref_itemArr.current[12] = ele!)}>
          <div className={scss.numIndex}>12</div>
          <div>
            <span>扣款項目及其比例、金額（例如保險費、清潔費...等）：</span>
            <br />
            <div className={classNames(scss.textaraeBox, disabled && scss.disabled)}>
              {/* <textarea disabled={disabled} className="w-full resize-none" placeholder="" {...register('debitItem')} /> */}
              <InputBox
                boxStyle={{ width: '100%' }}
                disabled={disabled}
                textareaProps={{
                  // ...register('debitItem'),
                  value: watchData.debitItem,
                  onChange: (e) => {
                    setValue('debitItem', e.target.value);
                  },
                  minRows: disabled ? undefined : 3,
                  placeholder: '',
                }}
              />
            </div>
          </div>
        </Item>
        {/*  */}
      </Body>

      <div className={scss.footer}>
        <div>
          <IconCaution />
        </div>
        <div>
          <span>
            簽訂合約，須注意以上事項，協助把關以利工務執行順暢、款項順利回收，合約成立後請將此審核表與合約一起轉工務部，謝謝！
          </span>
        </div>
      </div>

      {isInContract && (
        <SignatureBar
          className="m-10 mb-0"
          control={{
            signatureArr: signatureArr,
          }}
        />
      )}

      {/*  */}
      {/*  */}

      <br />
      <br />
      <br />
      <PDFBody ref={ref_pdf} ref_head={ref_head} ref_itemArr={ref_itemArr} />

      {/*  */}
      {/*  */}

      {/*  */}
    </div>
  );
}

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

// region COMPONENT

const Body_pre = (props: React.HTMLAttributes<HTMLDivElement>, ref: React.Ref<HTMLDivElement>) => {
  const { children, ...attr } = props;

  return (
    <div
      ref={ref}
      {...attr}
      className={classNames(scss.body, attr.className)}
      style={{
        ...attr.style,
      }}
    >
      {children}
    </div>
  );
};

const Item_pre = (props: React.HTMLAttributes<HTMLDivElement>, ref: React.Ref<HTMLDivElement>) => {
  const { children, ...attr } = props;

  return (
    <div ref={ref} {...attr} className={classNames(scss.item, attr.className)}>
      {children}
    </div>
  );
};

const InputBox = ({
  prefix,
  suffix,
  boxStyle,
  inputAttr,
  textareaProps,
  spanAttr,
  className,
  disabled,
}: {
  prefix?: string;
  suffix?: string;
  boxStyle?: React.CSSProperties;
  inputAttr?: React.InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: TextareaAutosizeProps;
  spanAttr?: React.HTMLAttributes<HTMLSpanElement>;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <div style={boxStyle} className={classNames(scss.inputBox, disabled && scss.disabled, className)}>
      <span>{prefix}</span>
      {/* {disabled && (
        <span {...spanAttr} className={classNames(scss.pdfSpan, spanAttr?.className)}>
          {inputAttr?.value || textareaProps?.value}
        </span>
      )}
      {!disabled && inputAttr && <input type="text" readOnly={disabled} {...inputAttr} />}
      {!disabled && textareaProps && <TextareaAutosize readOnly={disabled} {...textareaProps} />} */}

      {inputAttr && <input type="text" readOnly={disabled} {...inputAttr} />}
      {textareaProps && <TextareaAutosize readOnly={disabled} {...textareaProps} />}
      <span>{suffix}</span>
    </div>
  );
};

const Row = ({
  disabled,
  serialNumber,
  onAdd,
  onDel,
  title,
  percent,
  price,
  note,
}: {
  disabled?: boolean;
  serialNumber: number;
  onAdd?: () => void;
  onDel?: () => void;
  title: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };
  percent: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  price: {
    value: string;
    // onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  note: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };
}) => {
  return (
    <div className={scss.payMethod}>
      <div>
        <InputBox
          prefix={`${serialNumber}.`}
          disabled={disabled}
          // inputAttr={{
          //   disabled: disabled,
          //   value: title.value,
          //   onChange: title.onChange,
          //   placeholder: '請輸入標題',
          // }}
          textareaProps={{
            // disabled: disabled,
            value: title.value,
            onChange: title.onChange,
            placeholder: '',
          }}
        />
        <InputBox
          suffix="%"
          disabled={disabled}
          // className={scss.percent}
          className={'self-end'}
          spanAttr={{
            className: 'text-center',
          }}
          inputAttr={{
            // disabled: disabled,
            className: 'text-center',
            value: percent.value,
            onChange: percent.onChange,
            type: 'number',
            placeholder: '比例',
          }}
        />
        <InputBox
          prefix="$"
          className={'self-end'}
          disabled={disabled}
          spanAttr={{
            className: 'text-center',
          }}
          inputAttr={{
            className: 'text-center',
            value: price.value,
            // onChange: price.onChange,
            type: 'number',
          }}
        />
        <InputBox
          prefix="備註 :"
          textareaProps={{
            disabled: disabled,
            value: note.value,
            onChange: note.onChange,
            placeholder: '',
          }}
          // inputAttr={{
          //   disabled: disabled,
          //   value: note.value,
          //   onChange: note.onChange,
          //   placeholder: '請輸入備註',
          // }}
        />
      </div>

      <div>
        <IconAdd attr={{ onClick: onAdd, className: classNames(!onAdd && scss.hidden) }} />
        {/* {onDel && <IconDel attr={{ onClick: onDel, className: classNames(!onDel && scss.hidden) }} />} */}
        {onDel && <IconDel attr={{ onClick: onDel, className: classNames(!onDel && scss.hidden) }} />}
      </div>
    </div>
  );
};

const IconAdd = ({ attr }: { attr?: React.SVGProps<SVGSVGElement> }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      //
      {...attr}
    >
      <circle cx="9" cy="9" r="8.5" stroke="#14256A" />
      <line x1="4.5" y1="9" x2="13.5" y2="9" stroke="#14256A" />
      <line x1="9" y1="4.5" x2="9" y2="13.5" stroke="#14256A" />
    </svg>
  );
};

const IconDel = ({ attr }: { attr?: React.SVGProps<SVGSVGElement> }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      //
      {...attr}
    >
      <circle cx="9" cy="9" r="8.5" stroke="#14256A" />
      <line x1="4.5" y1="9" x2="13.5" y2="9" stroke="#14256A" />
    </svg>
  );
};

const IconCaution = ({ attr }: { attr?: React.SVGProps<SVGSVGElement> }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8.5" stroke="#14256A" />
      <path d="M9.83333 10.5H8.16667L7.75 7.26923V3.5H10.25V7.26923L9.83333 10.5Z" fill="#14256A" />
      <circle cx="9" cy="13.25" r="1.25" fill="#14256A" />
    </svg>
  );
};

const RadioContainer = ({
  label,
  className,
  labelClassName,
  value,
  onChange,
  disabled,
}: {
  label: React.ReactNode;
  className?: string;
  labelClassName?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <div className={classNames(className)}>
      <span className={classNames('inline-block', labelClassName)}>{label}</span>
      <Radio.Group disabled={disabled} onChange={(e) => onChange(e.target.value)} value={value}>
        <Radio value={true}>是</Radio>
        <Radio value={false}>否</Radio>
      </Radio.Group>
    </div>
  );
};

// const RowArr = ({
//   empArr,
//   selEmployeeIdArr,
//   // skipArr,
//   viewRef_bottom,
//   // exceptEmpArr,
//   onClick,
// }: // exceptEmpCheck,
// {
//   empArr: TemployeeDto[];
//   selEmployeeIdArr: string[];
//   // skipArr?: TemployeeDto[];
//   onClick: (v: TemployeeDto) => void;
//   // exceptEmpArr?: { id: string }[];
//   viewRef_bottom?: (node?: Element | null | undefined) => void;
//   // exceptEmpCheck: ((emp: TemployeeDto) => boolean) | undefined;
// }) => {
//   return (
//     <>
//       {empArr.map((emp, index, arr) => {
//         const { idNumber, chName, jobs } = emp;
//         const { name, grade, department } = jobs?.[0] ?? {};

//         const theViewRef = (() => {
//           if (arr.length - 11 === index) {
//             return viewRef_bottom;
//           }

//           return undefined;
//         })();

//         const isActive = selEmployeeIdArr.some((selEmpId) => selEmpId === emp.id);

//         return (
//           <CellWithBar key={index} isActive={isActive}>
//             <div className={classNames(scss.row)} onClick={() => onClick(emp)} ref={theViewRef}>
//               <span className={scss.idNumber}>{idNumber}</span>
//               <span>{chName}</span>
//               <span>{name ? `${department?.name} / ${name}` : ''}</span>
//               <span>{grade && `Level ${grade}`}</span>
//             </div>
//           </CellWithBar>
//         );
//       })}
//     </>
//   );
// };

const PDFBody_pre = (
  {
    ref_head,
    ref_itemArr,
  }: {
    ref_head: React.RefObject<HTMLDivElement> | null;
    ref_itemArr: React.MutableRefObject<HTMLDivElement[]>; // w index 0 is undefined
  },
  ref: React.ForwardedRef<unknown>
) => {
  // -----------------------------------------------------------------------

  const ref_pdf = useRef<HTMLDivElement[]>([]);

  // -----------------------------------------------------------------------
  // 將頁面分割，避免A4超出範圍
  type TrefArr = (HTMLDivElement | null)[];
  const allowHeight = bodyHeight - bodyPaddingTop - bodyPaddingBottom;
  let remainHeight = allowHeight;
  const pageArr: TrefArr[] = [];
  let refArr: TrefArr = [];

  const height_head = ref_head?.current?.offsetHeight ?? 0;
  refArr.push(ref_head?.current || null);
  remainHeight -= height_head;

  ref_itemArr.current.forEach((item, index) => {
    const height = item?.offsetHeight ?? 0;

    if (remainHeight - height < 0) {
      pageArr.push(refArr);
      refArr = [];
      remainHeight = allowHeight;
    }

    refArr.push(item);
    remainHeight -= height;

    if (index === ref_itemArr.current.length - 1) {
      pageArr.push(refArr);
    }
  });
  // -----------------------------------------------------------------------

  useImperativeHandle(ref, () => ({
    dlPdf: (flleName: string) => {
      dlPdf({
        divElementArr: ref_pdf.current,
        fileName: flleName,
      });
    },
  }));

  // -----------------------------------------------------------------------

  return (
    <div className={scss.pdfWrapper}>
      {pageArr.map((page, index) => {
        return (
          <Body
            //
            style={style_body}
            ref={(ele) => (ref_pdf.current[index] = ele!)}
            key={index}
            className={scss.pdfBody}
          >
            {page.map((item, index) => {
              return <div key={index} dangerouslySetInnerHTML={{ __html: item?.outerHTML || '' }} />;
            })}
          </Body>
        );
      })}
    </div>
  );
};

const Body = forwardRef(Body_pre);
const Item = forwardRef(Item_pre);
const PDFBody = forwardRef(PDFBody_pre);

// endregion COMPONENT

// ============================================================================

// MARK: FUNCTION HOOK

const checkIsReviewer = ({
  userInfo,
  // reviewerList,
  quotationContent,
}: {
  userInfo: TuserDto | undefined;
  // reviewerList: TreviewerList;
  quotationContent: TquotationContentDto | undefined;
}) => {
  const {
    //
    reviewManagerEmployee,
    managerReviewedAt,

    reviewWorkDirectorEmployee,
    workDirectorReviewedAt,

    reviewCashierEmployee,
    toCashierAt,

    reviewSupervisorEmployee,
    supervisorReviewedAt,
  } = quotationContent ?? {};

  let isSupervisor = reviewSupervisorEmployee && reviewSupervisorEmployee?.id === userInfo?.employee?.id;
  let isWorkDirector = reviewWorkDirectorEmployee && reviewWorkDirectorEmployee?.id === userInfo?.employee?.id;
  let isCashier = reviewCashierEmployee && reviewCashierEmployee?.id === userInfo?.employee?.id;
  let isManager = reviewManagerEmployee && reviewManagerEmployee?.id === userInfo?.employee?.id;

  let isReviewer = false;

  if (!supervisorReviewedAt) {
    isSupervisor && (isReviewer = true);
    isWorkDirector = false;
    isCashier = false;
    isManager = false;
  } else if (!workDirectorReviewedAt) {
    isWorkDirector && (isReviewer = true);
    isSupervisor = false;
    isCashier = false;
    isManager = false;
  } else if (toCashierAt) {
    isCashier && (isReviewer = true);
    isSupervisor = false;
    isWorkDirector = false;
    isManager = false;
  } else if (!managerReviewedAt) {
    isManager && (isReviewer = true);
    isSupervisor = false;
    isWorkDirector = false;
    isCashier = false;
  }

  // isSupervisor && !supervisorReviewedAt && (isReviewer = true);
  // isCashier && !toCashierAt && supervisorReviewedAt && (isReviewer = true);

  return {
    isReviewer,
    isManager,
    isWorkDirector,
    isCashier,
    isSupervisor,
  };
};

const creEmptyMethod = () => {
  return {
    title: '',
    percent: '',
    price: '',
    note: '',
  };
};

const usePayMethod = ({ contractPrice }: { contractPrice: number }) => {
  const [render, setRender] = useState(0);
  const [payMethodList, setPayMethodList] = useState<TpayMethodList>({});

  const reRender = () => {
    setRender((state) => state + 1);
  };

  const creDelMethod = (list: TpayMethodList) => {
    return (key: string) => {
      delete list[key];
      reRender();
    };
  };

  const addMethod = () => {
    const newKey = nanoid();
    payMethodList[newKey] = new Class_payMethod({
      reRender,
      payMethod: creEmptyMethod(),
      delSelf: () => creDelMethod(payMethodList)(newKey),
      contractPrice,
    });
    reRender();
  };

  const resetMethodList = ({ defaultPayMethodArr }: { defaultPayMethodArr?: TpaymentRatio[] } = {}) => {
    const newList: TpayMethodList = {};

    if (defaultPayMethodArr) {
      defaultPayMethodArr.forEach((item) => {
        const newKey = nanoid();
        newList[newKey] = new Class_payMethod({
          reRender,
          payMethod: item,
          delSelf: () => creDelMethod(newList)(newKey),
          contractPrice,
        });
      });
    } else {
      const newKey = nanoid();
      newList[newKey] = new Class_payMethod({
        reRender,
        payMethod: creEmptyMethod(),
        delSelf: () => creDelMethod(newList)(newKey),
        contractPrice,
      });
    }

    setPayMethodList(newList);
  };

  useEffect(() => {
    resetMethodList();
  }, []);

  const getMethodBodyArr = () => {
    const arr = Object.values(payMethodList).map((item) => item.body);

    return arr;
  };

  let allPercentStr = '';
  Object.values(payMethodList).forEach((item, index, arr) => {
    if (item.percent) {
      allPercentStr = allPercentStr + item.percent + '%';

      if (index !== arr.length - 1) {
        allPercentStr = allPercentStr + ',';
      }
    }
  });

  return {
    payMethodList,
    addMethod,
    resetMethodList,
    getMethodBodyArr,
    allPercentStr,
  };
}; // usePayMethod

// ============================================================================

// MARK: Class payMethod
class Class_payMethod {
  constructor({
    //
    reRender,
    payMethod,
    contractPrice,
    delSelf,
  }: {
    reRender: () => void;
    payMethod: TpaymentRatio;
    contractPrice: number;
    delSelf: () => void;
  }) {
    this.reRender = reRender;
    this._payMethod = _.cloneDeep(payMethod);
    this.contractPrice = contractPrice;

    this.delSelf = delSelf;
  } // constructor

  readonly reRender;
  readonly delSelf;
  private _payMethod;
  readonly contractPrice;

  get title() {
    return this._payMethod.title;
  }
  set title(v) {
    this._payMethod.title = v;
    this.reRender();
  }

  get percent() {
    return this._payMethod.percent;
  }
  set percent(str) {
    const num = Number(str || 0);
    this._payMethod.percent = str;
    this._payMethod.price = new Decimal(this.contractPrice).mul(num).div(100).toString();
    this.reRender();
  }

  get price() {
    return this._payMethod.price;
  }
  // set price(v) {
  //   this._payMethod.price = v;
  //   this.reRender();
  // }

  get note() {
    return this._payMethod.note;
  }
  set note(v) {
    this._payMethod.note = v;
    this.reRender();
  }

  get body(): TpaymentRatioDto {
    return {
      level: this.title,
      paymentRatio: this.percent,
      price: this.price,
      note: this.note,
    };
  }
}

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

const createDefaultPaymentRatio = (quotationContent: TquotationContentDto): TpaymentRatioDto[] => {
  const { paymentMethods, total } = quotationContent;

  const arr: TpaymentRatioDto[] = paymentMethods.map((item) => {
    const { milestone, totalPaymentRatio } = item;

    const price = new Decimal(total)
      .mul(totalPaymentRatio || 0)
      .div(100)
      .toString();

    return {
      level: milestone,
      paymentRatio: totalPaymentRatio,
      price,
      note: '',
    };
  });

  return arr;
};

const useDefaultPaymentRatio_quotationContent = (
  quotationContent: TquotationContentDto | undefined
): TpaymentRatioDto[] | undefined => {
  const arr: TpaymentRatioDto[] | undefined = useMemo(() => {
    if (!quotationContent) {
      return undefined;
    }

    return createDefaultPaymentRatio(quotationContent);

    // const { paymentMethods, total } = quotationContent;

    // const arr: TpaymentRatioDto[] = paymentMethods.map((item) => {
    //   const { milestone, totalPaymentRatio } = item;

    //   const price = new Decimal(total)
    //     .mul(totalPaymentRatio || 0)
    //     .div(100)
    //     .toString();

    //   return {
    //     level: milestone,
    //     paymentRatio: totalPaymentRatio,
    //     price,
    //     note: '',
    //   };
    // });

    // return arr;
  }, [quotationContent]);

  return arr;
};

// ============================================================================
// ============================================================================
// ============================================================================

export default ContractReviewForm;
export { ReviewForm, useDefaultPaymentRatio_quotationContent };
