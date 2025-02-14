import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Decimal from 'decimal.js';
import _ from 'lodash';
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
import { Ttable, Tcell } from 'components/global/gear/table/table01';
import Row, { Cell } from 'components/global/gear/table/row';

// icon
import { IconDetail, IconDelete01, IconAddCircle } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './edit.module.scss';

// api
import {
  Tparams,
  ToutsourcingPaymentDetailDto,
  ToutsourcingPaymentDto,
  TupdateOutsourcingPaymentDto,
  useGetOutsourcingPayment_id_kit,
  useGetOutsourcingPaymentDetail,
  apiClearDebt,
} from 'js/api/api_outsourcing';

// type
import { TuserDto, TdeductionDto } from 'js/api/dtoTypes';

import PaymentSelectSlideBar from 'components/page/worksDepartment/outsourcingPricing/edti/paymentSelectSlideBar';
import Table from 'components/page/worksDepartment/outsourcingPricing/edti/table';

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

  // '上期保留10%' // 上期保留款
  const latestPeriodKeep = data_payment?.priorPeriodRetainage ?? 0;

  const {
    subTotal_detail,
    subTotal_deduction,

    retainage,
    subTotal_actualReceived,
    tax,
    actualAmountReceived,
  } = useMemo(() => {
    let subTotal_detail_d = new Decimal(0); // 請款的小計，不是「請款小計」
    let subTotal_deduction_d = new Decimal(0); // 應扣明細的小計

    paymentDetail?.forEach((detail) => {
      const { outsourcingTotal } = detail;
      subTotal_detail_d = subTotal_detail_d.add(outsourcingTotal);
    });

    state_deductionArr?.forEach((deduction) => {
      subTotal_deduction_d = subTotal_deduction_d.add(deduction.price);
    });

    // 本期保留10% // 本期保留款
    const retainage = new Decimal(subTotal_detail_d).mul(0.1).toDecimalPlaces(0).toNumber();

    // 實領金額小計
    const subTotal_actualReceived = new Decimal(subTotal_detail_d)
      .sub(retainage)
      .add(latestPeriodKeep)
      .sub(subTotal_deduction_d)
      .toNumber();

    const tax = new Decimal(subTotal_actualReceived).mul(0.05).toDecimalPlaces(0).toNumber();
    const actualAmountReceived = new Decimal(subTotal_actualReceived).add(tax).toNumber();

    return {
      subTotal_detail: subTotal_detail_d.toNumber(),
      subTotal_deduction: subTotal_deduction_d.toNumber(),
      retainage,
      subTotal_actualReceived,
      tax,
      actualAmountReceived,
    };
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

  const editDeduction = ({ index, key, value }: { index: number; key: keyof TdeductionDto; value: string }) => {
    setState_deductionArr((prev) => {
      const newArr = [...prev];

      if (key === 'price') {
        newArr[index][key] = Number(value);
      } else {
        newArr[index][key] = value;
      }

      return newArr;
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
      paymentSubTotal: subTotal_detail,
      deduction: state_deductionArr,
      deductionTotal: subTotal_deduction,
      retainage: result.retainage,
      subTotal: result.subTotal,
      salesTax: result.salesTax,
      total: result.total,
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

  const { control_table_project, subTotal_project } = useProject({ paymentDetail });

  const {
    control_table_deduction,
    // subTotal_deduction
  } = useDeduction({
    disabled,
    state_deduction: state_deductionArr,
    editDeduction: editDeduction,
    deleteAnmountToBeDeducted: deleteDeduction,
  });

  const { control_table_actualAmountReceived, result } = useTable({
    subTotal_project,
    data_payment,
    subTotal_deduction,
  });

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
      subTotal_detail: subTotal_detail.toLocaleString(),
      latestPeriodRemain: latestPeriodKeep.toLocaleString(), // 上期保留
      subTotal_detailAddLatestPeriodRemain: new Decimal(subTotal_detail)
        .add(latestPeriodKeep)
        .toNumber()
        .toLocaleString(),
      tax: tax.toLocaleString(),
      retainage: retainage.toLocaleString(),
      deduction_installationMaterials: null,
      deduction_laborInsuranceLoan: null,
      subTotal_deduction: subTotal_deduction.toLocaleString(),
      deduction_amount: null,
      actualAmountReceived: actualAmountReceived.toLocaleString(),
      managerName: null,
      supervisorName: null,
      checkerName: null,
      agentName: null,
    };

    return props_pdf;
  }, [
    data_payment,
    subTotal_detail,
    paymentDetail,
    latestPeriodKeep,
    tax,
    retainage,
    subTotal_deduction,
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

    !data_payment?.isPaymentCleared && isAllReviewPass
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
    !(isReviewing || data_payment?.isPaymentCleared || isAllReviewPass)
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
    data_payment?.isPaymentCleared ? (
      <span key="0" className="text-red-500 text-base">
        已結清
      </span>
    ) : null,
  ];

  // -------------------------------------------------------------------------

  // MARK: useEffect

  useEffect(() => {
    // setPayment(paymentOri ?? create_emptyPayment());
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

        {/* <div>
          <Row thead={true}>
            <Cell>序號</Cell>
            <Cell>工程編號</Cell>
            <Cell>工程名稱</Cell>
            <Cell>請款</Cell>
            <Cell></Cell>
          </Row>
        </div> */}

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
              <SquareBtn sharp="mini" className="ml-3">
                新建明細
              </SquareBtn>
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
                    <IconDetail onClick={() => router.push(href)} />
                  </Cell>
                </Row>
              );
            })}
            <Row style={{ width: '100%' }}>
              <Cell style={config_project.label_subTotal.style}>小計</Cell>
              <Cell style={config_project.subTotal.style}>{subTotal_project.toLocaleString()}</Cell>
              <Cell style={config_project.detail.style}></Cell>
            </Row>
          </div>
        </div>

        {/* <Table
          caption={
            <>
              工程列表{' '}
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
                <SquareBtn sharp="mini" className="ml-3">
                  新建明細
                </SquareBtn>
              </Link>
            </>
          }
          disabled={disabled}
          className="w-fit m-auto mt-[96px]"
          control={control_table_project}
        /> */}

        <div className="w-[1100px] m-auto mt-[96px]">
          <div className="mb-2 flex gap-2 items-center">
            <span className="text-main text-lg">應扣明細</span>
            <IconAddCircle className="w-[20px] h-[20px]" onClick={addDeduction} />
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
              <Cell style={config_deduction.subTotal.style}>{subTotal_deduction.toLocaleString()}</Cell>
              <Cell style={config_deduction.btn_delete.style}></Cell>
            </Row>
          </div>
        </div>

        {/* <Table
          caption="應扣明細"
          disabled={disabled}
          className="w-fit m-auto mt-[96px]"
          control={control_table_deduction}
          onAddClick={addDeduction}
        /> */}

        <div className="w-[500px] m-auto mt-[96px] ml-[277.5px]">
          <div className="mb-2 ">
            <span className="text-main text-lg">應扣明細</span>
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
              <Cell style={config_settlement.amounts.style}>{subTotal_detail.toLocaleString()}</Cell>
            </Row>
            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>本期保留10%</Cell>
              <Cell style={config_settlement.amounts.style} className="text-red-500">
                {retainage.toLocaleString()}
              </Cell>
            </Row>
            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>上期保留10%</Cell>
              <Cell style={config_settlement.amounts.style} className="text-green-500">
                {latestPeriodKeep.toLocaleString()}
              </Cell>
            </Row>
            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>應扣明細</Cell>
              <Cell style={config_settlement.amounts.style} className="text-red-500">
                {subTotal_deduction.toLocaleString()}
              </Cell>
            </Row>
            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>小計</Cell>
              <Cell style={config_settlement.amounts.style}>{subTotal_actualReceived.toLocaleString()}</Cell>
            </Row>
            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>稅額5%</Cell>
              <Cell style={config_settlement.amounts.style}>{tax.toLocaleString()}</Cell>
            </Row>
            <Row style={{ width: '100%' }}>
              <Cell style={config_settlement.amountsName.style}>實領金額</Cell>
              <Cell style={config_settlement.amounts.style} className="font-bold">
                {actualAmountReceived.toLocaleString()}
              </Cell>
            </Row>
          </div>
        </div>

        {/* <Table caption="實領金額" className="w-fit m-auto mt-[96px]" control={control_table_actualAmountReceived} /> */}
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

type Tconfig_settlement = Record<'amountsName' | 'amounts', TconfigItem>;

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
      justifyContent: 'center',
      paddingLeft: '20px',
    },
    createNode({ disabled, state_deduction, setDeduction }) {
      return (
        <input
          value={state_deduction.type}
          onChange={(e) => {
            setDeduction((prev) => {
              return { ...prev, type: e.target.value };
            });
          }}
          className={classNames(scss.inputInTable, !disabled && scss.enabled)}
          readOnly={disabled}
        />
      );
    },
  },
  itemName: {
    label: '項目',
    style: {
      // width: 414,
      flex: 'auto',
      justifyContent: 'center',
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
const keyArr_settlement: (keyof Tconfig_settlement)[] = ['amountsName', 'amounts'];
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
      width: '170px',
      justifyContent: 'right',
      paddingRight: '20px',
    },
  },
};

// =============================================================================

type Tconfig_legency<keys extends string = string> = {
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

const config_public: Tconfig_legency = {
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

const config_projectTable: Tconfig_legency = {
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
      children: '請款',
      ...config_projectTable.subTotal_invoice,
    },
  ],
};
// ---------------------

const config_deduction_legacy: Tconfig_legency<
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
      ...config_deduction_legacy.type,
    },
    {
      children: '項目',
      ...config_deduction_legacy.itemName,
    },
    {
      children: '應扣額',
      ...config_deduction_legacy.price,
    },
  ],
};

// ======================================================================

const config_actualAmountReceived: Tconfig_legency = {
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

    return {
      //
      control_table_project: control_table,
      subTotal_project: decimal_subTotal.toNumber(),
    };
  }, [paymentDetail]);
};

// MARK:useDeduction
const useDeduction = ({
  disabled,
  state_deduction,
  editDeduction,
  deleteAnmountToBeDeducted,
}: {
  disabled: boolean;
  state_deduction: TdeductionDto[];
  editDeduction: ({ index, key, value }: { index: number; key: keyof TdeductionDto; value: string }) => void;
  deleteAnmountToBeDeducted: (index: number) => void;
}) => {
  return useMemo(() => {
    //
    let decimal_subTotal = new Decimal(0);
    //
    const control_tbody: Ttable['tbody'] = (() => {
      //
      const rowArr: Ttable['tbody']['rowArr'] = state_deduction.map((data, index) => {
        const { type, itemName, price } = data;

        decimal_subTotal = decimal_subTotal.add(price);

        const inputWidth_type = config_deduction_legacy.type.inputWidth;
        const inputWidth_item = config_deduction_legacy.itemName.inputWidth;
        const inputWidth_price = config_deduction_legacy.price_enabled.inputWidth;

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
            ...config_deduction_legacy.type,
          },
          {
            children: itemChildren,
            ...config_deduction_legacy.itemName,
          },
          {
            children: subTotal_invoiceChildren,
            ...(disabled ? config_deduction_legacy.price.tbody : config_deduction_legacy.price_enabled.tbody),
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
            ...config_deduction_legacy.btn_delete.tbody,
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
  }, [state_deduction, disabled]);
};

// MARK: useTable
const useTable = ({
  subTotal_project,
  data_payment,
  subTotal_deduction,
}: {
  subTotal_project: number;
  data_payment: ToutsourcingPaymentDto | undefined | null;
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
