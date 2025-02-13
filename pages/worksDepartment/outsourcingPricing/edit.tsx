import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Table01, { Ttable, Tcell } from 'components/global/gear/table/table01';
import TabCarousel02, { Tcontrol_tabCarousel } from 'components/page/worksDepartment/outsourcingPricing/tabCarousel02';

// gear
import ProcessChain, { Tcontrol_processChain } from 'components/global/gear/processChain';
import SignatureBar, { Tcontrol_signatureBar } from 'components/global/gear/signatureBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import ThreeButtonModal from 'components/global/gear/modal/simpleModal/multButtonModal';

// icon
import { IconDetail, IconAddCircle, IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './edit.module.scss';

// api
import {
  Tparams,
  ToutsourcingDto,
  ToutsourcingPaymentDto,
  useGetOutsourcing,
  useGetOutsourcingPayment,
  useGetOutsourcingPayment_id,
  useGetOutsourcingPaymentDetail,
  apiPatchOutsourcingPayment,
  TupdateOutsourcingPaymentDto,
  apiPatchOutsourcingPaymentSubmit,
  apiPatchOutsourcingPaymentReview,
  apiClearDebt,
} from 'js/api/api_outsourcing';

// type
import { TuserDto, TemployeeDto, TdeductionDto, ToutsourcingPaymentDetailDto } from 'js/api/dtoTypes';
import { TmyBtn } from 'components/global/gear/button/myButton_v2';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import { useReviewFlow } from 'components/composition/review/reviewFlow';
import ReviewFlowSelector from 'components/composition/review/reviewFlowSelector';

import PaymentSelectSlideBar from 'components/page/worksDepartment/outsourcingPricing/edti/paymentSelectSlideBar';
import Table from 'components/page/worksDepartment/outsourcingPricing/edti/table';

// ======================================================================

type Tquery = {
  paymentId: string | undefined;
};

// ======================================================================

// MARK: START

export default function OutsourcingPricingEdit({ userInfo }: { userInfo: TuserDto | undefined }) {
  const router = useRouter();
  const { paymentId } = router.query as Tquery;

  // -------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  // 審核modal
  const [showReiveModal, setShowReiveModal] = useState<boolean>(false);
  // -------------------------------------------------------------------------
  const [manager, setManager] = useState<TemployeeDto>();
  const [supervisor, setSupervisor] = useState<TemployeeDto>();
  const [accounting, setAccounting] = useState<TemployeeDto>();
  const [checker, setChecker] = useState<TemployeeDto>();
  const [cashier, setCashier] = useState<TemployeeDto>();

  // -------------------------------------------------------------------------

  const [targetOutsourcingId, setTargetOutsourcingId] = useState<string>();
  const [targetPaymentId, setTargetPaymentId] = useState<string>();

  // -------------------------------------------------------------------------
  const [payment, setPayment] = useState<TupdateOutsourcingPaymentDto>(create_emptyPayment());

  // -------------------------------------------------------------------------
  const params: Tparams = {
    populate: [
      'outsourcing',
      'agentEmployee',
      'reviewCheckerEmployee',
      'reviewSupervisorEmployee',
      'reviewManagerEmployee',
      'reviewAccountingEmployee',
      'reviewCashierEmployee',
    ],
  };

  const { data: data_payment, update: update_payment } = useGetOutsourcingPayment_id(paymentId, params);

  const params_paymentDetail: Tparams = {
    populate: ['engineeringContact'],
    pageSize: 99999,
  };

  const { data: paymentDetail, update: update_detail } = useGetOutsourcingPaymentDetail(
    paymentId,
    params_paymentDetail
  );

  const {
    paymentOri,
    reviewStatus_checker,
    reviewStatus_accounting,
    reviewStatus_cashier,
    reviewStatus_supervisor,
    reviewStatus_manager,
    isReviewer,
    isReviewing,
    isReviewDone,
  } = useMemo(() => {
    const payment = data_payment;

    const {
      checkerReviewedAt,
      supervisorReviewedAt,
      managerReviewedAt,
      accountingReviewedAt,
      cashierReviewedAt,

      toReviewCheckerAt,
      toReviewSupervisorAt,
      toManagerAt,
      toAccountingAt,
      toCashierAt,

      reviewCheckerEmployee,
      reviewSupervisorEmployee,
      reviewManagerEmployee,
      reviewAccountingEmployee,
      reviewCashierEmployee,
    } = payment ?? {};
    const userId = userInfo?.employee?.id;

    type TdotColor = Tcontrol_processChain['statusArr'][number]['dotColor'];

    const reviewStatus_checker: TdotColor = !toReviewCheckerAt ? 'gray' : checkerReviewedAt ? 'green' : 'red';
    const reviewStatus_accounting: TdotColor = !toAccountingAt ? 'gray' : accountingReviewedAt ? 'green' : 'red';
    const reviewStatus_cashier: TdotColor = !toCashierAt ? 'gray' : cashierReviewedAt ? 'green' : 'red';
    const reviewStatus_supervisor: TdotColor = !toReviewSupervisorAt ? 'gray' : supervisorReviewedAt ? 'green' : 'red';
    const reviewStatus_manager: TdotColor = !toManagerAt ? 'gray' : managerReviewedAt ? 'green' : 'red';

    const isReviewing = toReviewCheckerAt || toReviewSupervisorAt || toManagerAt || toAccountingAt || toCashierAt;

    // 影響到送審按鈕是否出現
    const isReviewer =
      (userId === reviewCheckerEmployee?.id && toReviewCheckerAt) ||
      (userId === reviewSupervisorEmployee?.id && toReviewSupervisorAt) ||
      (userId === reviewManagerEmployee?.id && toManagerAt) ||
      (userId === reviewAccountingEmployee?.id && toAccountingAt) ||
      (userId === reviewCashierEmployee?.id && toCashierAt);

    const isReviewDone =
      checkerReviewedAt && supervisorReviewedAt && managerReviewedAt && accountingReviewedAt && cashierReviewedAt;

    return {
      paymentOri: payment,
      reviewStatus_checker,
      reviewStatus_accounting,
      reviewStatus_cashier,
      reviewStatus_supervisor,
      reviewStatus_manager,
      isReviewer,
      isReviewing,
      isReviewDone,
    };
  }, [data_payment]);

  // -------------------------------------------------------------------------

  const addAnmountToBeDeducted = () => {
    setPayment((prev) => {
      return {
        ...prev,
        deduction: [...(prev.deduction ?? []), create_emptyDeduction()],
      };
    });
  };

  const deleteAnmountToBeDeducted = (index: number) => {
    setPayment((prev) => {
      return {
        ...prev,
        deduction: prev.deduction?.filter((_, i) => i !== index) ?? [],
      };
    });
  };

  const editDeduction = ({ index, key, value }: { index: number; key: keyof TdeductionDto; value: string }) => {
    setPayment((prev) => {
      const newArr = [...(prev.deduction ?? [])];

      if (key === 'price') {
        newArr[index][key] = Number(value);
      } else {
        newArr[index][key] = value;
      }

      return {
        ...prev,
        deduction: newArr,
      };
    });
  };

  // -------------------------------------------------------------------------

  // MARK API
  // 確認
  const reqPatchOutsourcingPayment = async () => {
    if (!paymentId || isLoading) {
      return;
    }

    const body = {
      date: new Date().toISOString(),
      paymentSubTotal: subTotal_project,
      deduction: payment.deduction ?? [],
      deductionTotal: subTotal_deduction,
      retainage: result.retainage,
      subTotal: result.subTotal,
      salesTax: result.salesTax,
      total: result.total,
      reviewCheckerEmployeeId: checker?.id,
      reviewSupervisorEmployeeId: supervisor?.id,
      reviewAccountingEmployeeId: accounting?.id,
      reviewCashierEmployeeId: cashier?.id,
    };

    try {
      setIsLoading(true);
      await apiPatchOutsourcingPayment(paymentId, body);
      await update_payment();
      setDisabled(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const reqPatchOutsourcingPaymentSubmit = async () => {
    if (!paymentId || isLoading) {
      return;
    }

    const reviewCheckerEmployeeId = checker?.id;
    const reviewSupervisorEmployeeId = supervisor?.id;
    const reviewAccountingEmployeeId = accounting?.id;
    const reviewCashierEmployeeId = cashier?.id;

    if (
      !reviewCheckerEmployeeId ||
      !reviewSupervisorEmployeeId ||
      !reviewAccountingEmployeeId ||
      !reviewCashierEmployeeId
    ) {
      myAlert.info({
        title: '請填寫完整審核人員',
      });

      return;
    }

    try {
      setIsLoading(true);
      await apiPatchOutsourcingPaymentSubmit(paymentId);
      myAlert.success({ title: '送審完成' });
      await update_payment();
      setDisabled(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // 審核
  const reqPatchOutsourcingPaymentReview = async (reviewResult: boolean) => {
    if (!paymentId || isLoading) {
      return;
    }

    const text = reviewResult ? '通過' : '不通過';

    const body = {
      reviewResult,
    };

    try {
      setIsLoading(true);
      await apiPatchOutsourcingPaymentReview(paymentId, body);
      myAlert.success({ title: `審核${text}` });
      await update_payment();
      setDisabled(true);
      setShowReiveModal(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------

  // MARK: PROPS

  const { control_table_project, subTotal_project } = useProject({ paymentDetail });

  const { control_table_deduction, subTotal_deduction } = useDeduction({
    disabled,
    payment,
    editDeduction,
    deleteAnmountToBeDeducted,
  });

  const { control_table_actualAmountReceived, result } = useTable({
    subTotal_project,
    data_payment,
    subTotal_deduction,
  });

  const control_processChain: Tcontrol_processChain = {
    statusArr: [
      {
        label: (
          <>
            <span className="inline-block mr-2">經辦</span>
            <span className="inline-block">{paymentOri?.agentEmployee?.chName}</span>
          </>
        ),
        dotColor: 'green',
      },
      {
        label: (
          <>
            <span className="inline-block mr-2">核對</span>
            <span className="inline-block">{paymentOri?.reviewCheckerEmployee.chName}</span>
          </>
        ),
        dotColor: reviewStatus_checker,
      },
      {
        label: (
          <>
            <span className="inline-block mr-2">工務</span>
            <span className="inline-block">{paymentOri?.reviewSupervisorEmployee.chName}</span>
          </>
        ),
        dotColor: reviewStatus_supervisor,
      },
      {
        label: (
          <>
            <span className="inline-block mr-2">總經理</span>
            <span className="inline-block">{paymentOri?.reviewManagerEmployee.chName}</span>
          </>
        ),
        dotColor: reviewStatus_manager,
      },
      {
        label: (
          <>
            <span className="inline-block mr-2">會計</span>
            <span className="inline-block">{paymentOri?.reviewAccountingEmployee.chName}</span>
          </>
        ),
        dotColor: reviewStatus_accounting,
      },
      {
        label: (
          <>
            <span className="inline-block mr-2">出納</span>
            <span className="inline-block">{paymentOri?.reviewCashierEmployee.chName}</span>
          </>
        ),
        dotColor: reviewStatus_cashier,
      },
    ],
  };

  const signatureArr: Tcontrol_signatureBar['signatureArr'] = [
    {
      label: '出納',
      employee: cashier,
      onChange: (employee) => {
        setCashier(employee);
      },
    },
    {
      label: '會計',
      employee: accounting,
      onChange: (employee) => {
        setAccounting(employee);
      },
    },
    {
      label: '總經理',
      employee: manager,
      onChange: (employee) => {
        // setManager(employee);
      },
      disabled: true,
    },
    {
      label: '工務',
      employee: supervisor,
      onChange: (employee) => {
        setSupervisor(employee);
      },
    },
    {
      label: '核對',
      employee: checker,
      onChange: (employee) => {
        setChecker(employee);
      },
    },
    {
      label: '經辦',
      employee: paymentOri?.agentEmployee,
      onChange: (employee) => {
        // setAgent(employee);
      },
      disabled: true,
    },
  ];

  const control_signatureBar: Tcontrol_signatureBar = { signatureArr };

  const reviewModalBtnArr: TmyBtn[] = [
    {
      label: '通過',
      theme: 'danger',
      onClick: () => reqPatchOutsourcingPaymentReview(true),
      isLoading,
    },
    {
      label: '不通過',
      onClick: () => reqPatchOutsourcingPaymentReview(false),
      isLoading,
    },
    {
      label: '取消',
      onClick: () => setShowReiveModal(false),
      isLoading,
    },
  ];

  const panelList_disabled: TpanelList = [
    isReviewer
      ? {
          type: 'redButton',
          label: '審核',
          onClick: () => {
            setShowReiveModal(true);
          },
        }
      : null,
    !isReviewing
      ? {
          type: 'redButton',
          label: '送審',
          onClick: reqPatchOutsourcingPaymentSubmit,
        }
      : null,

    !data_payment?.isPaymentCleared && isReviewDone
      ? {
          type: 'myButton',
          label: '結清',
          onClick: () => {
            myAlert.confirm({
              title: '確定結清?',
              content: '結清後無法復原',
              props: {
                onOk: async () => {
                  if (!paymentId) {
                    myAlert.err({ title: '沒有外包計價單id' });
                  } else {
                    await apiClearDebt(paymentId);
                    await update_payment();
                  }
                },
              },
            });
          },
        }
      : null,
    !(isReviewing || data_payment?.isPaymentCleared || isReviewDone)
      ? {
          type: 'myButton',
          label: '編輯',
          onClick: () => {
            setDisabled(false);
          },
        }
      : null,
  ];

  const panelList_enabled: TpanelList = [
    {
      type: 'redButton',
      label: '確認',
      onClick: reqPatchOutsourcingPayment,
    },
    {
      type: 'myButton',
      label: '取消',
      onClick: () => {
        setDisabled(true);
      },
    },
  ];

  const panelList: TpanelList = disabled ? panelList_disabled : panelList_enabled;

  // -------------------------------------------------------------------------

  // MARK: useEffect

  useEffect(() => {
    if (!paymentOri) {
      return;
    }

    const {
      reviewCheckerEmployee, //  '核對人員'
      reviewSupervisorEmployee, //  '審核主管'
      reviewManagerEmployee, //  '總經理'
      reviewAccountingEmployee, //  '會計'
      reviewCashierEmployee, //  '出納'
    } = paymentOri;

    setManager(reviewManagerEmployee);
    setSupervisor(reviewSupervisorEmployee);
    setAccounting(reviewAccountingEmployee);
    setChecker(reviewCheckerEmployee);
    setCashier(reviewCashierEmployee);
  }, [paymentOri, disabled]);

  useEffect(() => {
    setPayment(paymentOri ?? create_emptyPayment());
  }, [paymentOri, disabled]);

  useEffect(() => {
    update_payment();
    update_detail();
  }, [paymentId]);

  useEffect(() => {
    if (data_payment) {
      setTargetOutsourcingId(data_payment.outsourcing.id);
      setTargetPaymentId(data_payment.id);
    }
  }, [!!data_payment]);

  useEffect(() => {
    router.push({
      query: {
        paymentId: targetPaymentId,
      },
    });
  }, [targetPaymentId]);

  // -------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader02 tag="外包計價" panelList={panelList} />

      <div className={classNames(!data_payment && 'hidden')}>
        {targetOutsourcingId && (
          <PaymentSelectSlideBar
            //
            className="mt-11"
            targetOutsourcingId={targetOutsourcingId}
            onTabClick_outsourcing={(id) => {
              setTargetOutsourcingId(id);
              // setTargetPaymentId(undefined);
            }}
            targetPaymentId={targetPaymentId}
            onTabClick_date={setTargetPaymentId}
          />
        )}
        <Table
          caption="工程列表"
          disabled={disabled}
          className="w-fit m-auto mt-[96px]"
          control={control_table_project}
        />
        <Table
          caption="應扣明細"
          disabled={disabled}
          className="w-fit m-auto mt-[96px]"
          control={control_table_deduction}
          onAddClick={addAnmountToBeDeducted}
        />
        <Table caption="實領金額" className="w-fit m-auto mt-[96px]" control={control_table_actualAmountReceived} />
        {/*  */}
        <div className={classNames(!disabled && 'hidden')}>
          <ProcessChain control={control_processChain} className={classNames('w-[1250px] m-auto mt-[80px]')} />
        </div>
        <div className={classNames(disabled && 'hidden')}>
          <SignatureBar
            control={control_signatureBar}
            disabled={disabled}
            className={classNames('w-[1100px] m-auto mt-[100px]')}
          />
        </div>
        {/*  */}
        <br />

        <ThreeButtonModal
          visible={showReiveModal}
          text={'是否通過審核?'}
          modalWidth={620}
          btnPropsArr={reviewModalBtnArr}
          onCancel={() => setShowReiveModal(false)}
        />
      </div>
    </SubLayer>
  );
}

// MARK: END
//
//
//

type Tconfig<keys extends string = string> = {
  [key in keys]: {
    width?: React.CSSProperties['width'];
    flex?: React.CSSProperties['flex'];
    justifyContent?: React.CSSProperties['justifyContent'];
    className?: string;
    style?: React.CSSProperties;
    tbody?: {
      width?: React.CSSProperties['width'];
      flex?: React.CSSProperties['flex'];
      justifyContent?: React.CSSProperties['justifyContent'];
      className?: string;
      style?: React.CSSProperties;
    };
    inputWidth?: React.CSSProperties['width'];
  };
};

const config_public: Tconfig = {
  left: {
    tbody: {
      flex: 'auto',
      justifyContent: 'flex-end',
    },
  },
  right: {
    tbody: {
      width: '270px',
      justifyContent: 'flex-end',
    },
  },
};

const config_projectTable: Tconfig = {
  indexNumber: {
    width: '60px',
    justifyContent: 'center',
  },
  projectNumber: {
    flex: '1 0',
    justifyContent: 'center',
  },
  projectName: {
    flex: '1 0',
    justifyContent: 'center',
  },
  subTotal_invoice: {
    width: '270px',
    justifyContent: 'center',
    tbody: {
      width: '200px',
      justifyContent: 'flex-end',
    },
  },
  btn_info: {
    tbody: {
      width: '70px',
      justifyContent: 'center',
    },
  },
  label_subTotal: config_public.left,
  subtotal: config_public.right,
};

const thead_projectTable: Ttable['thead'] = {
  cellArr: [
    {
      children: '序號',
      ...config_projectTable.indexNumber,
    },
    {
      children: '工程編號',
      ...config_projectTable.projectNumber,
    },
    {
      children: '工程名稱',
      ...config_projectTable.projectName,
    },
    {
      children: '請款小計',
      ...config_projectTable.subTotal_invoice,
    },
  ],
};
// ---------------------

const config_deduction: Tconfig<
  'type' | 'itemName' | 'price' | 'price_enabled' | 'btn_delete' | 'label_subTotal' | 'subtotal'
> = {
  type: {
    width: 414,
    // flex: '1 0',
    justifyContent: 'center',
    inputWidth: 394,
  },
  itemName: {
    width: 414,
    // flex: '1 0',
    justifyContent: 'center',
    inputWidth: 394,
  },
  price: {
    width: '270px',
    justifyContent: 'center',
    tbody: {
      width: '270px',
      justifyContent: 'flex-end',
    },
  },
  price_enabled: {
    inputWidth: 180,
    tbody: {
      width: 200,
      justifyContent: 'flex-end',
    },
  },
  btn_delete: {
    tbody: {
      width: '70px',
      justifyContent: 'center',
    },
  },
  label_subTotal: config_public.left,
  subtotal: config_public.right,
};

const thead_amountToBeDeducted: Ttable['thead'] = {
  cellArr: [
    {
      children: '類別',
      ...config_deduction.type,
    },
    {
      children: '項目',
      ...config_deduction.itemName,
    },
    {
      children: '請款小計',
      ...config_deduction.price,
    },
  ],
};

// ======================================================================

const config_actualAmountReceived: Tconfig = {
  caption: {
    flex: '1',
    justifyContent: 'center',
    tbody: {
      flex: '1',
      justifyContent: 'flex-end',
    },
  },
  subTotal_invoice: {
    width: '270px',
    justifyContent: 'center',
    tbody: {
      width: '270px',
      justifyContent: 'flex-end',
    },
  },
};

const thead_actualAmountReceived: Ttable['thead'] = {
  cellArr: [
    {
      children: '金額名稱',
      ...config_actualAmountReceived.caption,
    },
    {
      children: '金額',
      ...config_actualAmountReceived.subTotal_invoice,
    },
  ],
};

// ======================================================================

// MARK: useProject
const useProject = ({ paymentDetail }: { paymentDetail: ToutsourcingPaymentDetailDto[] | undefined }) => {
  const router = useRouter();

  return useMemo(() => {
    let decimal_subTotal = new Decimal(0);
    const control_tbody: Ttable['tbody'] = (() => {
      const rowArr: Ttable['tbody']['rowArr'] = (paymentDetail ?? []).map((data, index) => {
        const { outsourcingTotal, engineeringContact } = data;

        const { projectName = '', projectNumber = '' } = engineeringContact ?? {};

        decimal_subTotal = decimal_subTotal.add(outsourcingTotal);

        const href = {
          pathname: './detail',
          query: {
            paymentDetailId: data.id,
          },
        };

        const cellArr: Tcell[] = [
          {
            children: index + 1,
            ...config_projectTable.indexNumber,
          },
          {
            children: projectNumber,
            ...config_projectTable.projectNumber,
          },
          {
            children: projectName,
            ...config_projectTable.projectName,
          },
          {
            children: outsourcingTotal.toLocaleString(),
            ...config_projectTable.subTotal_invoice.tbody,
          },
          {
            children: <IconDetail onClick={() => router.push(href)} />,
            ...config_projectTable.btn_info.tbody,
          },
        ];

        return {
          cellArr,
        };
      });

      rowArr.push({
        cellArr: [
          {
            children: '小計',
            ...config_projectTable.label_subTotal.tbody,
          },
          {
            children: decimal_subTotal.toNumber().toLocaleString(),
            ...config_projectTable.subtotal.tbody,
          },
        ],
      });

      return {
        rowArr,
      };
    })();

    const control_table: Ttable = {
      thead: thead_projectTable,
      tbody: control_tbody,
      haveBorder: true,
    };

    return { control_table_project: control_table, subTotal_project: decimal_subTotal.toNumber() };
  }, [paymentDetail]);
};

// MARK:useDeduction
const useDeduction = ({
  disabled,
  payment,
  editDeduction,
  deleteAnmountToBeDeducted,
}: {
  disabled: boolean;
  payment: TupdateOutsourcingPaymentDto;
  editDeduction: ({ index, key, value }: { index: number; key: keyof TdeductionDto; value: string }) => void;
  deleteAnmountToBeDeducted: (index: number) => void;
}) => {
  return useMemo(() => {
    //
    let decimal_subTotal = new Decimal(0);
    //
    const control_tbody: Ttable['tbody'] = (() => {
      //
      const rowArr: Ttable['tbody']['rowArr'] = (payment.deduction ?? []).map((data, index) => {
        const { type, itemName, price } = data;

        decimal_subTotal = decimal_subTotal.add(price);

        const inputWidth_type = config_deduction.type.inputWidth;
        const inputWidth_item = config_deduction.itemName.inputWidth;
        const inputWidth_price = config_deduction.price_enabled.inputWidth;

        const typeChildren = (
          <input
            value={type}
            onChange={(e) => {
              editDeduction({ index, key: 'type', value: e.target.value });
            }}
            className={classNames(scss.inputInTable, !disabled && scss.enabled)}
            style={{ width: inputWidth_type }}
            readOnly={disabled}
          />
        );

        const itemChildren = (
          <input
            value={itemName}
            onChange={(e) => {
              editDeduction({ index, key: 'itemName', value: e.target.value });
            }}
            className={classNames(scss.inputInTable, !disabled && scss.enabled)}
            style={{ width: inputWidth_item }}
            readOnly={disabled}
          />
        );

        const subTotal_invoiceChildren = (
          <input
            value={disabled ? price.toLocaleString() : price}
            onChange={(e) => {
              editDeduction({ index, key: 'price', value: e.target.value });
            }}
            type={disabled ? 'text' : 'number'}
            className={classNames(scss.inputInTable, !disabled && scss.enabled)}
            style={{ width: inputWidth_price }}
            readOnly={disabled}
          />
        );

        const cellArr: Tcell[] = [
          {
            children: typeChildren,
            ...config_deduction.type,
          },
          {
            children: itemChildren,
            ...config_deduction.itemName,
          },
          {
            children: subTotal_invoiceChildren,
            ...(disabled ? config_deduction.price.tbody : config_deduction.price_enabled.tbody),
          },
        ];

        if (!disabled) {
          cellArr.push({
            children: (
              <IconDelete01
                onClick={() => {
                  myAlert.confirm({
                    title: '確定要刪除嗎?',
                    props: {
                      onOk: () => {
                        deleteAnmountToBeDeducted(index);
                      },
                    },
                  });
                }}
              />
            ),
            ...config_deduction.btn_delete.tbody,
          });
        }

        return {
          cellArr,
        };
      });

      rowArr.push({
        cellArr: [
          {
            children: '小計',
            ...config_projectTable.label_subTotal.tbody,
          },
          {
            children: decimal_subTotal.toNumber().toLocaleString(),
            ...config_projectTable.subtotal.tbody,
          },
        ],
      });

      return {
        rowArr,
      };
    })();

    const control_table: Ttable = {
      thead: thead_amountToBeDeducted,
      tbody: control_tbody,
      haveBorder: true,
    };

    return {
      control_table_deduction: control_table,
      subTotal_deduction: decimal_subTotal.toNumber(),
    };
  }, [payment.deduction, disabled]);
};

// MARK: useTable
const useTable = ({
  subTotal_project,
  data_payment,
  subTotal_deduction,
}: {
  subTotal_project: number;
  data_payment: ToutsourcingPaymentDto | undefined;
  subTotal_deduction: number;
}) => {
  return useMemo(() => {
    //

    // 本期保留10% // 本期保留款
    const retainage = new Decimal(subTotal_project).mul(0.1).toNumber();
    // '上期保留10%' // 上期保留款
    const latestPeriodKeep = data_payment?.priorPeriodRetainage ?? 0;

    const subTotal = new Decimal(subTotal_project)
      .sub(retainage)
      .add(latestPeriodKeep)
      .sub(subTotal_deduction)
      .toNumber();

    const tax = new Decimal(subTotal).mul(0.05).toDecimalPlaces(0).toNumber();
    const actualAmountReceived = new Decimal(subTotal).add(tax).toNumber();

    const result = {
      retainage: retainage, // 本期保留款項
      subTotal: subTotal,
      salesTax: tax,
      total: actualAmountReceived, // 實領總計
    };

    //
    const rowArr: Ttable['tbody']['rowArr'] = [
      //
      {
        cellArr: [
          {
            children: '請款合計',
            ...config_actualAmountReceived.caption,
          },
          {
            children: subTotal_project.toLocaleString(),
            ...config_actualAmountReceived.subTotal_invoice.tbody,
          },
        ],
      },
      //
      {
        cellArr: [
          {
            children: '本期保留10%',
            ...config_actualAmountReceived.caption,
          },
          {
            children: retainage.toLocaleString(),
            ...config_actualAmountReceived.subTotal_invoice.tbody,
            className: scss.textRed,
          },
        ],
      },
      //
      {
        cellArr: [
          {
            children: '上期保留10%',
            ...config_actualAmountReceived.caption,
          },
          {
            children: latestPeriodKeep.toLocaleString(),
            ...config_actualAmountReceived.subTotal_invoice.tbody,
            className: scss.textGreen,
          },
        ],
      },
      //
      {
        cellArr: [
          {
            children: '應扣明細',
            ...config_actualAmountReceived.caption,
          },
          {
            children: subTotal_deduction.toLocaleString(),
            ...config_actualAmountReceived.subTotal_invoice.tbody,
            className: scss.textRed,
          },
        ],
      },
      //
      {
        cellArr: [
          {
            children: '小計',
            ...config_actualAmountReceived.caption.tbody,
          },
          {
            children: subTotal.toLocaleString(),
            ...config_actualAmountReceived.subTotal_invoice.tbody,
          },
        ],
      },
      {
        cellArr: [
          {
            children: '稅額5%',
            ...config_actualAmountReceived.caption.tbody,
          },
          {
            children: tax.toLocaleString(),
            ...config_actualAmountReceived.subTotal_invoice.tbody,
          },
        ],
      },
      {
        cellArr: [
          {
            children: '實領金額',
            ...config_actualAmountReceived.caption.tbody,
          },
          {
            children: actualAmountReceived.toLocaleString(),
            ...config_actualAmountReceived.subTotal_invoice.tbody,
            className: scss.textBold,
          },
        ],
      },
    ]; // rowArr

    const tbody = {
      rowArr,
    };

    const control_table: Ttable = {
      thead: thead_actualAmountReceived,
      tbody,
      haveBorder: true,
    };

    return {
      control_table_actualAmountReceived: control_table,
      result,
    };
    //
  }, [subTotal_project, subTotal_deduction, data_payment?.priorPeriodRetainage]);
};

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================

const create_emptyPayment = (): TupdateOutsourcingPaymentDto => ({
  date: '',
  paymentSubTotal: 0,
  deduction: [],
  deductionTotal: 0,
  retainage: 0,
  subTotal: 0,
  salesTax: 0,
  total: 0,
});

const create_emptyDeduction = (): TdeductionDto => ({
  type: '',
  itemName: '',
  price: 0,
});
