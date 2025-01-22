import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList, TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Table01, { Ttable, Tcell } from 'components/global/gear/table/table01';
import TabCarousel02, { Tcontrol_tabCarousel } from 'components/page/worksDepartment/outsourcingPricing/tabCarousel02';

// gear
import ProcessChain, { Tcontrol_processChain } from 'components/global/gear/processChain';
import SignatureBar, { Tcontrol_signatureBar } from 'components/global/gear/signatureBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import ThreeButtonModal from 'components/global/gear/modal/simpleModal/multButtonModal';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';

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
  // useGetOutsourcingPayment_id,
  useGetOutsourcingPayment_id_kit,
  useGetOutsourcingPaymentDetail,
  apiPatchOutsourcingPayment,
  TupdateOutsourcingPaymentDto,
  apiPatchOutsourcingPaymentSubmit,
  apiPatchOutsourcingPaymentReview,
} from 'js/api/api_outsourcing';

// type
import { TuserDto, TemployeeDto, TdeductionDto } from 'js/api/dtoTypes';
import { TmyBtn } from 'components/global/gear/button/myButton_v2';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

//

import { useAttachment } from 'hooks/attachment/useAttachment';

// ======================================================================
import type { UploadProps } from 'antd';
import { Button, Upload } from 'antd';

// ======================================================================

type Tquery = {
  paymentId: string | undefined;
};

// ======================================================================
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

  const {
    data: data_payment,
    attachments,
    update: update_payment,
    handlePatch: patchOutsourcingPayment,
  } = useGetOutsourcingPayment_id_kit(paymentId, {
    customerParams: params,
    autoUpdate: false,
  });

  const {
    fileInfoArr,
    willDeleteArr,
    addFile,
    removeFile,
    createFileArr,
    // removeFile_withConfirm,

    // fileInfoKitArr,
  } = useAttachment({
    rawArr: attachments,
    kitOption: {
      removeWithConfirm: true,
    },
  });

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

    return {
      paymentOri: payment,
      reviewStatus_checker,
      reviewStatus_accounting,
      reviewStatus_cashier,
      reviewStatus_supervisor,
      reviewStatus_manager,
      isReviewer,
      isReviewing,
    };
  }, [data_payment]);

  // _______________________________________________________________________
  // -------------------------------------------------------------------------

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

  // _req
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
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  const { control_table_project, subTotal_project } = useMemo(() => {
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

  // -------------------------------------------------------------------------

  const { control_table_deduction, subTotal_deduction } = useMemo(() => {
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

  // -------------------------------------------------------------------------

  const { control_table_actualAmountReceived, result } = useMemo(() => {
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
  }, [subTotal_project, subTotal_deduction, payment]);

  // -------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------

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
    // {
    //   type: 'myButton',
    //   label: '編輯審核人員',
    //   onClick: () => {
    //     setDisabled__reviewer(false);
    //     setDisabled(true);
    //   },
    // },
    // {
    //   type: 'myButton',
    //   label: '新增工程',
    //   onClick: () => {},
    // },
    {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    },
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

        <div className="w-fit m-auto ml-[275px] mt-[96px]">
          <Upload
            multiple={true}
            fileList={fileInfoArr}
            onChange={(e) => {
              const file = e.file.originFileObj as File;
              const isExist = fileInfoArr.some((file) => file.uid === file.uid);
              !isExist && file && addFile(file);
            }}
            onRemove={(e) => {
              const uid = e.uid;
              removeFile(uid);
            }}
          >
            <SquareBtn sharp="long">新增附件</SquareBtn>
          </Upload>
        </div>

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

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================

const PaymentSelectSlideBar = ({
  //
  className,
  targetOutsourcingId,
  onTabClick_outsourcing,
  targetPaymentId,
  onTabClick_date,
}: {
  className?: string;
  targetOutsourcingId: string;
  onTabClick_outsourcing: (id: string) => void;
  targetPaymentId: string | undefined;
  onTabClick_date: (date: string | undefined) => void;
}) => {
  // -------------------------------------------------------------------------

  const [activeIndex_outsourcing, setActiveIndex_outsourcing] = useState<number>(-1);
  const [activeIndex_id, setActiveIndex_id] = useState<number>(-1);

  const [slideToIndex, setSlideToIndex] = useState<number>();
  const [slideToIndex_date, setSlideToIndex_date] = useState<number>();

  // -------------------------------------------------------------------------

  const params: Tparams = {
    // filter,
    sort: 'createdAt',
    order: 'DESC',
  };

  const {
    dataList: outsourcingList,
    viewRef_bottom,
    reset,
    nextPage,
    isLoading,
  } = useGetOutsourcing({ customParams: params });

  const outsourcingArr = useMemo(() => {
    return _.flatten(Object.values(outsourcingList)) as (typeof outsourcingList)[`${number}`];
  }, [outsourcingList]);

  // _______________________________________________________________

  const params_payment: Tparams = {
    filter: {
      outsourcingId: { $eq: targetOutsourcingId },
    },
    pageSize: 99999,
    sort: 'date',
    order: 'ASC',
  };

  const {
    //
    dataList: dataList_payment,
    reset: reset_payment,
  } = useGetOutsourcingPayment({ customParams: params_payment });

  const paymentArr = useMemo(() => {
    return _.flatten(Object.values(dataList_payment)) as (typeof dataList_payment)[`${number}`];
  }, [dataList_payment]);

  // -------------------------------------------------------------------------

  const { tabArr: tabArr_api, defaultActiveIndex } = useMemo(() => {
    let defaultActiveIndex = -1;

    const arr: Tcontrol_tabCarousel['tabArr'] = outsourcingArr.map((data, index) => {
      const viewRef = index === outsourcingArr.length - 1 ? viewRef_bottom : undefined;

      if (data.id === targetOutsourcingId) {
        defaultActiveIndex = index;
      }

      return {
        label: data.name,
        viewRef,
        // isActive: targetOutsourcingId === data.id,
        onClick: () => {
          onTabClick_outsourcing(data.id);
          setActiveIndex_outsourcing(index);
          setActiveIndex_id(-1);
        },
      };
    });

    return {
      tabArr: arr,
      defaultActiveIndex,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outsourcingArr]);

  const control_tabCarousel_api: Tcontrol_tabCarousel = {
    activeIndex: activeIndex_outsourcing,
    tabArr: tabArr_api,
  };

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  const { tabArr_date, defaultIndex_date } = useMemo(() => {
    let defaultIndex_date = -1;

    const dateArr = paymentArr.map((payment) => {
      return payment;
    });

    const arr: Tcontrol_tabCarousel['tabArr'] = dateArr.map((payment, index) => {
      const twDate = getTaiwanDateStr(payment.date);

      if (payment.id === targetPaymentId) {
        defaultIndex_date = index;
      }

      return {
        label: twDate ?? '',
        onClick: ({ ref_slider }) => {
          ref_slider.current.slickGoTo(index);
          onTabClick_date(payment.id);
        },
      };
    });

    return { tabArr_date: arr, defaultIndex_date };
  }, [paymentArr]);

  const control_tabCarousel: Tcontrol_tabCarousel = {
    activeIndex: activeIndex_id,
    tabArr: tabArr_date,
  };

  // -------------------------------------------------------------------------

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    reset_payment();
    onTabClick_date(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetOutsourcingId]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (defaultActiveIndex === -1) {
      nextPage();
    } else {
      setActiveIndex_outsourcing(defaultActiveIndex);
      setSlideToIndex(defaultActiveIndex);
    }
  }, [isLoading, defaultActiveIndex === -1]);

  useEffect(() => {
    if (defaultIndex_date !== -1) {
      setActiveIndex_id(defaultIndex_date);
      setSlideToIndex_date(defaultIndex_date);
    } else {
      if (!targetPaymentId) {
        onTabClick_date(paymentArr[0]?.id);
        setActiveIndex_id(0);
      }
    }
    //
  }, [paymentArr, defaultIndex_date === -1, targetPaymentId]);

  // -------------------------------------------------------------------------

  return (
    <div className={classNames(className)}>
      <TabCarousel02
        className={'mb-2'}
        control={control_tabCarousel_api}
        //
        // 只有在mount時觸發(以isShowVendorMonthList切換是否被mount)，
        // 藉以移動到在OutsourcingList選中的廠商
        // 在被渲染後，activeIndex不管怎麼改變，都不會再次觸發
        // onMount={({ ref_slider }) => {
        //   ref_slider.current.slickGoTo(activeIndex);
        // }}
        slideToIndex={slideToIndex}
      />
      <TabCarousel02
        className="min-h-[56px]"
        control={control_tabCarousel}
        theme="dashed"
        props={{
          arrows: false,
        }}
        slideToIndex={slideToIndex_date}
      />
    </div>
  );
};

// ======================================================================
const Table = ({
  caption,
  control,
  className,
  onAddClick,
  disabled,
}: {
  caption: string;
  control: Ttable;
  className?: string;
  onAddClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <div className={classNames(className)}>
      <div className={scss.captionBar}>
        <p className={scss.tableCaption}>{caption}</p>
        <IconAddCircle onClick={onAddClick} className={classNames((!onAddClick || disabled) && 'invisible')} />
      </div>
      <Table01 {...control} />
    </div>
  );
};

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
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
