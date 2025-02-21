import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import moment from 'moment';
import Link from 'next/link';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Pdf_outsourcingPaymentMonthlyTable, {
  Tprops as Tprop_pdf,
} from 'components/page/worksDepartment/outsourcingPricing/pdf_outsourcingPaymentMonthlyTable';

// antd
import { Upload } from 'antd';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import ReviewFlowSelector from 'components/composition/review/reviewFlowSelector';
import Row, { Cell } from 'components/global/gear/table/row';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// icon
import { IconDetail, IconDelete01, IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './edit.module.scss';

// api
import {
  Tparams,
  useGetOutsourcingPayment_id_kit,
  useGetOutsourcingPaymentDetail,
  apiClearDebt,
} from 'js/api/api_outsourcing';

// type
import { TuserDto, TdeductionDto } from 'js/api/dtoTypes';

import PaymentSelectSlideBar from 'components/page/worksDepartment/outsourcingPricing/edti/paymentSelectSlideBar';

import { useAttachment } from 'hooks/attachment/useAttachment';
import { useReviewFlow } from 'components/composition/review/reviewFlow';

// ======================================================================

// ======================================================================

type Tquery = {
  paymentId: string | undefined;
};

// ======================================================================

// MARK: START

export default function OutsourcingPricingEdit({
  //
  userInfo,
  readOnly,
}: {
  userInfo: TuserDto | undefined;
  readOnly?: boolean;
}) {
  const userId = userInfo?.employee?.id;

  const router = useRouter();

  const query = router.query as Tquery;
  const { paymentId } = query as Tquery;

  // -------------------------------------------------------------------------
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  const [targetOutsourcingId, setTargetOutsourcingId] = useState<string>();
  // const [targetPaymentId, setTargetPaymentId] = useState<string>();

  // -------------------------------------------------------------------------
  // const [payment, setPayment] = useState<TupdateOutsourcingPaymentDto>(create_emptyPayment());
  const [state_deductionArr, setState_deductionArr] = useState<TdeductionDto[]>([]);

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
  const outsourcingId = data_payment?.outsourcing.id;
  const isPaymentCleared = data_payment?.isPaymentCleared;

  const {
    fileInfoArr,
    willDeleteArr,
    addFile,
    removeFile,
    // createFileArr,
    getAttachmentFormData,
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

  const { ReviewFlow, reqAddReview, reviewFlow, isAllReviewPass } = useReviewFlow({
    uuid: data_payment?.id,
    document_id: data_payment?.createdAt ? moment(data_payment.createdAt).format('YYYY-MM-DD hh:mm:ss') : '',
  });

  const isReviewing = !!reviewFlow;

  const paymentOri = data_payment;

  const {
    detailTotal,
    latestPeriodKeep,
    currentPayment,
    retainage,
    deduction_installationMaterials,
    deduction_laborInsuranceLoan,
    deductionSubtotal,
    tax,
    actualAmountReceived,

    deductionTotal,
    actualAmountReceivedProcess,

    installationMaterialsArr,
    laborInsuranceLoanArr,
  } = useMemo(() => {
    // a + b = c
    // d + e + f = g
    // (c - d)*0.05 = h
    // c - g + h = i

    let a_detailTotal = new Decimal(0); // 請款合計 // 工程列表的小計
    const b_latestPeriodKeep = data_payment?.priorPeriodRetainage ?? 0; // 上期保留
    let c_currentPayment = new Decimal(0); // 本期應付款
    let d_retainage = new Decimal(0); // 本期保留
    let e_installationMaterials = new Decimal(0); // 按裝物料
    let f_laborInsuranceLoan = new Decimal(0); // 借支勞保
    let g_deductionSubtotal = new Decimal(0); // 應扣合計
    let h_tax = new Decimal(0); // 稅額5%
    let i_actualAmountReceived = new Decimal(0); // 實領金額

    const installationMaterialsArr: { label: string; amount: string }[] = [];
    const laborInsuranceLoanArr: { label: string; amount: string }[] = [];

    paymentDetail?.forEach((detail) => {
      const { outsourcingTotal } = detail;
      a_detailTotal = a_detailTotal.add(outsourcingTotal);
    });

    c_currentPayment = a_detailTotal.add(b_latestPeriodKeep);

    d_retainage = a_detailTotal.mul(0.1).toDecimalPlaces(0);

    state_deductionArr?.forEach((deduction) => {
      const type = deduction.type;

      if (type === '按裝物料') {
        e_installationMaterials = e_installationMaterials.add(deduction.price);
        installationMaterialsArr.push({ label: deduction.itemName, amount: deduction.price.toLocaleString() });
      } else if (type === '借支勞保') {
        f_laborInsuranceLoan = f_laborInsuranceLoan.add(deduction.price);
        laborInsuranceLoanArr.push({ label: deduction.itemName, amount: deduction.price.toLocaleString() });
      }
    });

    g_deductionSubtotal = d_retainage.add(e_installationMaterials).add(f_laborInsuranceLoan);
    h_tax = c_currentPayment.minus(d_retainage).mul(0.05).toDecimalPlaces(0);
    i_actualAmountReceived = c_currentPayment.minus(g_deductionSubtotal).add(h_tax);

    const deductionTotal = e_installationMaterials.add(f_laborInsuranceLoan).toNumber();

    const currentPayment = c_currentPayment.toNumber();
    const deductionSubtotal = g_deductionSubtotal.toNumber();
    const tax = h_tax.toNumber();
    const actualAmountReceived = i_actualAmountReceived.toNumber();

    const actualAmountReceivedProcess = `${currentPayment.toLocaleString()} - ${deductionSubtotal.toLocaleString()} + ${tax.toLocaleString()} = ${actualAmountReceived.toLocaleString()}`;

    return {
      detailTotal: a_detailTotal.toNumber(),
      latestPeriodKeep: b_latestPeriodKeep,
      currentPayment: currentPayment,
      retainage: d_retainage.toNumber(),
      deduction_installationMaterials: e_installationMaterials.toNumber(),
      deduction_laborInsuranceLoan: f_laborInsuranceLoan.toNumber(),
      deductionSubtotal: deductionSubtotal,
      tax: tax,
      actualAmountReceived: actualAmountReceived,
      //
      deductionTotal,
      actualAmountReceivedProcess,
      installationMaterialsArr,
      laborInsuranceLoanArr,
    };

    // let subTotal_detail_d = new Decimal(0); // 請款的小計，不是「請款小計」
    // let subTotal_deduction_d = new Decimal(0); // 應扣明細的小計

    // paymentDetail?.forEach((detail) => {
    //   const { outsourcingTotal } = detail;
    //   subTotal_detail_d = subTotal_detail_d.add(outsourcingTotal);
    // });

    // state_deductionArr?.forEach((deduction) => {
    //   subTotal_deduction_d = subTotal_deduction_d.add(deduction.price);
    // });

    // // 本期保留10% // 本期保留款
    // const retainage = new Decimal(subTotal_detail_d).mul(0.1).toDecimalPlaces(0).toNumber();

    // // 實領金額小計
    // const subTotal_actualReceived = new Decimal(subTotal_detail_d)
    //   .sub(retainage)
    //   .add(latestPeriodKeep)
    //   .sub(subTotal_deduction_d)
    //   .toNumber();

    // const tax = new Decimal(subTotal_actualReceived).mul(0.05).toDecimalPlaces(0).toNumber();
    // const actualAmountReceived = new Decimal(subTotal_actualReceived).add(tax).toNumber();

    // return {
    //   subTotal_detail: subTotal_detail_d.toNumber(),
    //   subTotal_deduction: subTotal_deduction_d.toNumber(),
    //   retainage,
    //   subTotal_actualReceived,
    //   tax,
    //   actualAmountReceived,
    // };
  }, [paymentDetail, state_deductionArr, data_payment]);

  // -------------------------------------------------------------------------

  const addDeduction = () => {
    setState_deductionArr((prev) => {
      return [...prev, create_emptyDeduction()];
    });
  };

  const deleteDeduction = (index: number) => {
    setState_deductionArr((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const createSetDeduction = (index: number) => {
    const func: React.Dispatch<React.SetStateAction<TdeductionDto>> = (setStateAction) => {
      setState_deductionArr((prev) => {
        const copy = [...prev];
        copy[index] = typeof setStateAction === 'function' ? setStateAction(copy[index]) : setStateAction;

        return copy;
      });
    };

    return func;
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
      // paymentSubTotal: detailTotal,
      deduction: state_deductionArr,
      // deductionTotal: deductionTotal,
      // retainage: retainage,
      // subTotal: deductionSubtotal,
      // salesTax: tax,
      // total: actualAmountReceived,
      reviewCheckerEmployeeId: undefined,
      reviewSupervisorEmployeeId: undefined,
      reviewAccountingEmployeeId: undefined,
      reviewCashierEmployeeId: undefined,
    };

    const attachmentArr = await getAttachmentFormData();
    const attachmentIdArr_willDelete = willDeleteArr.map((file) => file.uid);

    try {
      setIsLoading(true);

      await patchOutsourcingPayment({ body, attachmentArr, attachmentIdArr_willDelete });
      await update_payment();
      setDisabled(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------

  const props_pdf = useMemo(() => {
    const rowArr: Tprop_pdf['rowArr'] = (paymentDetail ?? []).map((detail, index) => {
      const { outsourcingTotal, engineeringContact: { projectName, projectNumber } = {} } = detail;

      const row: Tprop_pdf['rowArr'][number] = {
        indexNumber: index + 1,
        projectNumber: projectNumber,
        projectName,
        installPrice: null,
        supplyPrice: null,
        subTotal: outsourcingTotal,
        priceCheck: null,
      };

      return row;
    });

    const { date: paymentDate } = data_payment ?? {};

    const date = paymentDate ? moment(paymentDate) : null;
    const year = date && date.year() - 1911;
    const month = date && date.month() + 1;

    const props_pdf: Tprop_pdf = {
      rowArr,
      year,
      month,
      signer: null,
      detailTotal: detailTotal.toLocaleString(),
      latestPeriodKeep: latestPeriodKeep.toLocaleString(),
      currentPayment: currentPayment.toLocaleString(),
      tax: tax.toLocaleString(),
      retainage: retainage.toLocaleString(),
      deduction_installationMaterials: deduction_installationMaterials,
      deduction_laborInsuranceLoan: deduction_laborInsuranceLoan,
      deductionSubtotal: deductionSubtotal.toLocaleString(),
      // deduction_amount: null,
      // actualAmountReceived: actualAmountReceived.toLocaleString(),
      actualAmountReceivedProcess,

      managerName: null,
      supervisorName: null,
      checkerName: null,
      agentName: null,

      installationMaterialsArr,
      laborInsuranceLoanArr,
    };

    return props_pdf;
  }, [
    data_payment,
    detailTotal,
    paymentDetail,
    latestPeriodKeep,
    tax,
    retainage,
    deductionTotal,
    actualAmountReceived,
  ]);

  // -------------------------------------------------------------------------

  const panelList_disabled: TpanelList = [
    !isAllReviewPass
      ? {
          type: 'redButton',
          label: '送審',
          onClick: () => {
            if (!userId) {
              return myAlert.info({ title: '沒有userId' });
            }

            const { destroy } = ReviewFlowSelector.open2({
              userId,
              onConfirm({ reviewFlowId, purpose }) {
                if (reviewFlowId) {
                  reqAddReview({
                    review_id: reviewFlowId,
                    document_title: purpose,
                    document_type: '外包計價',
                    user_id: userId,
                    query: query,
                  }).then(destroy);
                }
              },
            });
          },
        }
      : null,

    !isPaymentCleared && isAllReviewPass
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
    {
      type: 'myButton',
      label: '匯出',
      onClick: () => {
        setShowPdfModal(true);
      },
    },
    !(isReviewing || isPaymentCleared || isAllReviewPass)
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

  const customerRight = [
    isPaymentCleared ? (
      <span key="0" className="text-red-500 text-base">
        已結清
      </span>
    ) : null,
  ];

  // -------------------------------------------------------------------------

  // MARK: useEffect

  useEffect(() => {
    setState_deductionArr(paymentOri?.deduction ?? []);
  }, [paymentOri, disabled]);

  useEffect(() => {
    update_payment();
    update_detail();
  }, [paymentId]);

  useEffect(() => {
    if (data_payment) {
      setTargetOutsourcingId(data_payment.outsourcing.id);
    }
  }, [!!data_payment]);

  // -------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer isLoading_all={isLoading}>
      <PageHeader02
        tag="外包計價"
        panelList={readOnly ? undefined : panelList}
        customeRight={readOnly ? undefined : customerRight}
      />

      <div className={classNames(!data_payment)}>
        {targetOutsourcingId && (
          <PaymentSelectSlideBar
            className={classNames('mt-11', readOnly && 'pointer-events-none')}
            targetOutsourcingId={targetOutsourcingId}
            onTabClick_outsourcing={(id) => {
              setTargetOutsourcingId(id);
              router.replace({
                query: {
                  ...query,
                  paymentId: undefined,
                },
              });
            }}
            targetPaymentId={query.paymentId}
            onTabClick_date={(id) => {
              router.replace({
                query: {
                  ...query,
                  paymentId: id,
                },
              });
            }}
          />
        )}

        <div className="w-[1100px] m-auto mt-[96px]">
          <div className="mb-2">
            <span className="text-main text-lg">工程列表</span>
            <Link
              href={{
                pathname: './detail',
                query: {
                  outsourcingId,
                  paymentId,
                  isNew: 'true',
                },
              }}
            >
              {disabled && !isPaymentCleared && (
                <SquareBtn sharp="mini" className="ml-3">
                  新建明細
                </SquareBtn>
              )}
            </Link>
          </div>
          <div className="border border-b-0">
            <Row thead={true} style={{ width: '100%' }}>
              {keyArr_project.map((key) => {
                const config = config_project[key];

                return (
                  <Cell key={key} style={config.style}>
                    {config.label}
                  </Cell>
                );
              })}
            </Row>

            {paymentDetail?.map((detail, index_d) => {
              const { id, outsourcingTotal, engineeringContact } = detail;
              const { projectName = '', projectNumber = '' } = engineeringContact ?? {};

              const href = {
                pathname: './detail',
                query: {
                  paymentDetailId: id,
                },
              };

              return (
                <Row key={id} style={{ width: '100%' }}>
                  <Cell style={config_project.indexNumber.style}>{index_d + 1}</Cell>
                  <Cell style={config_project.projectNumber.style}>{projectNumber}</Cell>
                  <Cell style={config_project.projectName.style}>{projectName}</Cell>
                  <Cell style={config_project.outsourcingTotal.style}>{outsourcingTotal.toLocaleString()}</Cell>
                  <Cell style={config_project.detail.style}>
                    {disabled && (
                      <Link href={href}>
                        <IconDetail />
                      </Link>
                    )}
                  </Cell>
                </Row>
              );
            })}
            <Row style={{ width: '100%' }}>
              <Cell style={config_project.label_subTotal.style}>小計</Cell>
              <Cell style={config_project.subTotal.style}>{detailTotal.toLocaleString()}</Cell>
              <Cell style={config_project.detail.style}></Cell>
            </Row>
          </div>
        </div>

        <div className="w-[1100px] m-auto mt-[96px]">
          <div className="mb-2 flex gap-2 items-center">
            <span className="text-main text-lg">應扣明細</span>
            {!disabled && <IconAddCircle className="w-[20px] h-[20px]" onClick={addDeduction} />}
          </div>
          <div className="border border-b-0">
            <Row thead={true} style={{ width: '100%' }}>
              {keyArr_deduction.map((key) => {
                const config = config_deduction[key];

                return (
                  <Cell key={key} style={config.style}>
                    {config.label}
                  </Cell>
                );
              })}
              <Cell style={config_deduction.btn_delete.style}></Cell>
            </Row>

            {state_deductionArr.map((state_deduction, index) => {
              return (
                <Row key={index} style={{ width: '100%' }}>
                  {keyArr_deduction.map((key) => {
                    const { style, createNode } = config_deduction[key];
                    const node = createNode({
                      disabled,
                      state_deduction,
                      setDeduction: createSetDeduction(index),
                    });

                    return (
                      <Cell key={key} style={style}>
                        {node}
                      </Cell>
                    );
                  })}
                  <Cell style={config_deduction.btn_delete.style}>
                    {!disabled && <IconDelete01 onClick={() => deleteDeduction(index)} />}
                  </Cell>
                </Row>
              );
            })}

            <Row style={{ width: '100%' }}>
              <Cell style={config_deduction.label_subTotal.style}>小計</Cell>
              <Cell style={config_deduction.subTotal.style}>{deductionTotal.toLocaleString()}</Cell>
              <Cell style={config_deduction.btn_delete.style}></Cell>
            </Row>
          </div>
        </div>

        <div className="w-[400px] m-auto mt-[96px] ml-[277.5px]">
          <div className="mb-2 ">
            <span className="text-main text-lg">結算</span>
          </div>
          <div className="border border-b-0">
            <Row thead={true} style={{ width: '100%' }}>
              {keyArr_settlement.map((key) => {
                const config = config_settlement[key];

                return (
                  <Cell key={key} style={config.style}>
                    {config.label}
                  </Cell>
                );
              })}
            </Row>

            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>請款合計</Cell>
              <Cell style={config_settlement.amounts.style}>{detailTotal.toLocaleString()}</Cell>
              <Cell style={config_settlement.subTotal.style}>{}</Cell>
            </Row>

            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>上期保留10%</Cell>
              <Cell style={config_settlement.amounts.style}>{latestPeriodKeep.toLocaleString()}</Cell>
              <Cell style={config_settlement.subTotal.style}>{}</Cell>
            </Row>

            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>請款金額</Cell>
              <Cell style={config_settlement.amounts.style}>{}</Cell>
              <Cell style={config_settlement.subTotal.style}>{currentPayment.toLocaleString()}</Cell>
            </Row>

            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>本期保留10%</Cell>
              <Cell style={config_settlement.amounts.style} className="text-red-500">
                {retainage.toLocaleString()}
              </Cell>
              <Cell style={config_settlement.subTotal.style}></Cell>
            </Row>

            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>按裝物料</Cell>
              <Cell style={config_settlement.amounts.style} className="text-red-500">
                {deduction_installationMaterials.toLocaleString()}
              </Cell>
              <Cell style={config_settlement.subTotal.style}>{}</Cell>
            </Row>

            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>借支勞保</Cell>
              <Cell style={config_settlement.amounts.style} className="text-red-500">
                {deduction_laborInsuranceLoan.toLocaleString()}
              </Cell>
              <Cell style={config_settlement.subTotal.style}>{}</Cell>
            </Row>

            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>應扣合計</Cell>
              <Cell style={config_settlement.amounts.style}>{}</Cell>
              <Cell style={config_settlement.subTotal.style} className="text-red-500">
                {deductionSubtotal.toLocaleString()}
              </Cell>
            </Row>

            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>稅額5%</Cell>
              <Cell style={config_settlement.subTotal.style}>{tax.toLocaleString()}</Cell>
            </Row>

            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>實領金額</Cell>
              <Cell style={config_settlement.subTotal.style}>{actualAmountReceived.toLocaleString()}</Cell>
            </Row>
          </div>
        </div>

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
            <SquareBtn sharp="long" className={classNames(disabled && 'invisible')}>
              新增附件
            </SquareBtn>
          </Upload>
        </div>

        <br />

        <Pdf_outsourcingPaymentMonthlyTable
          visible={showPdfModal}
          onCancel={() => setShowPdfModal(false)}
          {...props_pdf}
          // rowArr={fakeRow}
        />

        <ReviewFlow className="w-3/4 m-auto mt-5" />
      </div>
    </SubLayer>
  );
}

// MARK: END
//
//
//
// =============================================================================

interface TconfigItem {
  label?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
interface TconfigItem_deduction extends TconfigItem {
  createNode: ({
    disabled,
    state_deduction,
    setDeduction,
  }: {
    disabled: boolean;
    state_deduction: TdeductionDto;
    setDeduction: React.Dispatch<React.SetStateAction<TdeductionDto>>;
  }) => React.ReactNode;
}

type Tconfig_project = Record<
  'indexNumber' | 'projectNumber' | 'projectName' | 'outsourcingTotal' | 'detail' | 'label_subTotal' | 'subTotal',
  TconfigItem
>;

type Tconfig_deduction = Record<
  'type' | 'itemName' | 'price' | 'btn_delete' | 'label_subTotal' | 'subTotal',
  TconfigItem_deduction
>;

type Tconfig_settlement = Record<'amountsName' | 'amounts' | 'subTotal', TconfigItem>;

// MARK:config_project
const keyArr_project: (keyof Tconfig_project)[] = [
  'indexNumber',
  'projectNumber',
  'projectName',
  'outsourcingTotal',
  'detail',
];
const config_project: Tconfig_project = {
  indexNumber: {
    label: '序號',
    style: {
      width: '60px',
      justifyContent: 'center',
    },
  },
  projectNumber: {
    label: '工程編號',
    style: {
      flex: '1 0',
      justifyContent: 'left',
    },
  },
  projectName: {
    label: '工程名稱',
    style: {
      flex: '1 0',
      justifyContent: 'left',
    },
  },
  outsourcingTotal: {
    label: '請款',
    style: {
      width: '200px',
      justifyContent: 'flex-end',
    },
  },
  detail: {
    style: {
      width: '70px',
      justifyContent: 'center',
    },
  },
  label_subTotal: {
    style: {
      flex: 'auto',
      justifyContent: 'flex-end',
    },
  },
  subTotal: {
    style: {
      width: '80px',
      justifyContent: 'flex-end',
    },
  },
};

// MARK:config_deduction
const keyArr_deduction: (keyof Tconfig_deduction)[] = ['type', 'itemName', 'price'];
const config_deduction: Tconfig_deduction = {
  type: {
    label: '類別',
    style: {
      width: 414,
      justifyContent: 'left',
      paddingLeft: '20px',
    },
    createNode({ disabled, state_deduction, setDeduction }) {
      const options = [
        { value: '按裝物料', label: '按裝物料' },
        { value: '借支勞保', label: '借支勞保' },
      ];

      const value = options.find((option) => option.value === state_deduction.type) ?? {
        value: state_deduction.type,
        label: state_deduction.type,
      };

      return (
        <InputSel
          disabled={disabled}
          showBaseline="auto"
          selectProps={{
            props: {
              options: [
                { value: '按裝物料', label: '按裝物料' },
                { value: '借支勞保', label: '借支勞保' },
              ],
              value,
              onChange(option) {
                const value = option?.value ?? '';
                setDeduction((prev) => {
                  return { ...prev, type: value };
                });
              },
            },
          }}
        />
      );
    },
  },
  itemName: {
    label: '項目',
    style: {
      // width: 414,
      flex: 'auto',
      justifyContent: 'left',
      paddingLeft: '20px',
    },
    createNode({ disabled, state_deduction, setDeduction }) {
      return (
        <input
          value={state_deduction.itemName}
          onChange={(e) => {
            setDeduction((prev) => {
              return { ...prev, itemName: e.target.value };
            });
          }}
          className={classNames(scss.inputInTable, !disabled && scss.enabled)}
          readOnly={disabled}
        />
      );
    },
  },
  price: {
    label: '應扣額',
    style: {
      width: 200,
      justifyContent: 'flex-end',
      paddingLeft: '20px',
    },
    createNode({ disabled, state_deduction, setDeduction }) {
      return (
        <input
          value={disabled ? state_deduction.price.toLocaleString() : state_deduction.price}
          onChange={(e) => {
            setDeduction((prev) => {
              return { ...prev, price: Number(e.target.value) };
            });
          }}
          type={disabled ? 'text' : 'number'}
          className={classNames(scss.inputInTable, scss.textRight, !disabled && scss.enabled)}
          readOnly={disabled}
        />
      );
    },
  },
  btn_delete: {
    label: '',
    style: { width: '70px', justifyContent: 'center' },
    createNode: () => null,
  },

  label_subTotal: {
    style: {
      flex: 'auto',
      justifyContent: 'flex-end',
    },
    createNode: () => null,
  },
  subTotal: {
    style: {
      width: '80px',
      justifyContent: 'flex-end',
    },
    createNode: () => null,
  },
};

// MARK:config_settlement
const keyArr_settlement: (keyof Tconfig_settlement)[] = ['amountsName', 'amounts', 'subTotal'];
const config_settlement: Tconfig_settlement = {
  amountsName: {
    label: '金額名稱',
    style: {
      flex: '1',
      justifyContent: 'left',
      paddingLeft: '20px',
    },
  },
  amounts: {
    label: '金額',
    style: {
      width: '100px',
      justifyContent: 'right',
      paddingRight: '20px',
    },
  },
  subTotal: {
    label: '小計',
    style: {
      width: '100px',
      justifyContent: 'right',
      paddingRight: '20px',
    },
  },
};

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================

const create_emptyDeduction = (): TdeductionDto => ({
  type: '',
  itemName: '',
  price: 0,
});

// const fakeData = {
//   indexNumber: 'put array index',
//   idNumber: 'Meow',
//   projectName: 'Meow',
//   installPrice: 'Meow',
//   supplyPrice: 'Meow',
//   subTotal: 9999,
//   priceCheck: 'Meow',
// };
// const fakeData_2 = {
//   indexNumber: 'put array index',
//   idNumber: 'Meow',
//   projectName: 'MEOWMEOW MEOWMEOW MEOWMEOWMEOW MEOWMEOW',
//   installPrice: 'Meow',
//   supplyPrice: 'Meow',
//   subTotal: 9999,
//   priceCheck: 'Meow',
// };
// const fakeData_3 = {
//   indexNumber: 'put array index',
//   idNumber: 'Meow',
//   projectName: 'WoofWoof WoofWoof',
//   installPrice: 'Meow',
//   supplyPrice: 'Meow',
//   subTotal: 9999,
//   priceCheck: 'Meow',
// };

// const fakeRow_pre = [
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData_2,
//   fakeData_3,
//   fakeData_3,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData_2,
//   fakeData_3,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData_3,
//   fakeData_3,
//   fakeData_3,
//   fakeData_3,
//   fakeData_3,
//   fakeData_3,
//   fakeData_3,
//   fakeData_3,
//   fakeData_3,
//   fakeData_3,

//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
//   fakeData,
// ];

// const fakeRow = fakeRow_pre.map((item, index) => {
//   return {
//     ...item,
//     indexNumber: index + 1,
//   };
// });
