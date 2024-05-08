import { useState, useEffect, useMemo, useCallback, memo, useContext } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import { useRouter, NextRouter } from 'next/router';
import Decimal from 'decimal.js';

// layout
import { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';
import { Wrapper_inpuSel_01, WrappedTextarea } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';

// ui
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import SignatureBar, {
  // Tcontrol_signatureBar,
  // TsignatureBarItem,
  TemployeeDto,
} from 'components/global/gear/signatureBar_v2';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// options
import { optionsCreator_certifyType } from 'js/utils/options/productOptions';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

// type
import { TdocType, TquotationContractDto, TuserDto } from 'js/api/dtoTypes';

// css
import scss from './edit.module.scss';

// api
import {
  TsettleProductDto,
  TcertificatedDocDto,
  TcreateCertificatedDocDto,
  TupdateCertificatedDocDto,
  useGetCertificatedDoc_id,
  apiPostCertificatedDoc,
  apiPatchCertificatedDoc,
  apiPatchCertificatedDoc_submit,
  apiPatchCertificatedDoc_review,
} from 'js/api/api_certificated-doc';

// context
import { AppContext } from 'pages/_app';

// =========================================================================

type Tquery = {
  editCertifiedDocument: 'true' | undefined;
  certifiedDocumentId: string | undefined;
  contractId: string | undefined;
};

type Tstate_info = {
  // docStyle: string; //文件種類
  applicationDate: Moment | null; // 申請日期
  projectNumber: string; // 工程編號
  projectName: string; //  工程名稱
  contractor: string; // 承包商
  valuation: string; // 本期計價
  payment: string; // 本期請款
  retainage: string; // 保留款
  paymentDate: Moment | null; // 請款日
  disbursementDate: Moment | null; // 放款日
  warrantyDate: Moment | null; // 保固日
};

type Tstate_itemList = {
  [key: string]: {
    itemName: string;
    size: string;
    doorModelName: string;
    contractProdQty: number;
    certificatedAllQty: number;
    qty: number;
  };
};

type Tstate_description = string;
type Tstate_note = string;

type TeditInfo = (
  key: keyof Omit<Tstate_info, 'applicationDate' | 'paymentDate' | 'disbursementDate' | 'warrantyDate'>,
  value: string
) => void;

type TeditDate = (
  key: 'applicationDate' | 'paymentDate' | 'disbursementDate' | 'warrantyDate',
  value: Moment | null
) => void;

// =========================================================================

const Selector_employee = selectModalCreator_multi<['employee']>({
  selectorArr: [
    {
      key: 'employee',
      caption: '擔保人',
      limit: 1,
    },
    // {
    //   key: 'employee',
    //   caption: '製表人',
    //   limit: 1,
    // },
  ],
});

const Selector_settleProduct = selectModalCreator_multi<['settleProduct']>({
  selectorArr: [
    {
      key: 'settleProduct',
      caption: '結算產品',
    },
  ],
});

const Selector_employee_memo = memo(Selector_employee, (preState, nextState) => {
  return preState.showModal === nextState.showModal;
});

const Selector_settleProduct_memo = memo(Selector_settleProduct, (preState, nextState) => {
  return preState.showModal === nextState.showModal;
});

// =========================================================================

// ███████ ████████  █████  ██████  ████████
// ██         ██    ██   ██ ██   ██    ██
// ███████    ██    ███████ ██████     ██
//      ██    ██    ██   ██ ██   ██    ██
// ███████    ██    ██   ██ ██   ██    ██
export default function Edit({
  className,
  onPanelChange,
  contract,
  update_contract,
}: {
  className?: string;
  onPanelChange: (panel: TpanelList | undefined) => void;
  contract: TquotationContractDto | undefined;
  update_contract: () => Promise<unknown>;
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { contractId, editCertifiedDocument, certifiedDocumentId } = query;
  const isNew = !certifiedDocumentId;

  // ---------------------------------------------------------------------------

  const [disabled, setDisabled] = useState(!isNew);
  const [isFetching, setIsFetching] = useState(false);

  const [state_showSelector_employee, setState_showSelector_employee] = useState(false);
  const [state_showSelector_settleProduct, setState_showSelector_settleProduct] = useState(false);

  // ---------------------------------------------------------------------------

  const [state_docStyle, setState_docStyle] = useState<TdocType>();
  const [state_info, setState_info] = useState<Tstate_info>(createEmptyState_info);
  const [state_itemList, setState_itemList] = useState<Tstate_itemList>({});
  const [state_description, setState_description] = useState<Tstate_description>('');
  const [state_note, setState_note] = useState<Tstate_note>('');

  // ---------------------------------------------------------------------------

  const { userInfo } = useContext(AppContext);

  // ---------------------------------------------------------------------------

  const { data: data_certifiedDocument, update: update_data_CertifiedDocument } =
    useGetCertificatedDoc_id(certifiedDocumentId);

  const {
    //
    agentEmployee,

    reviewGuarantorEmployee,
    // guarantorReviewedAt,

    // reviewAccountingEmployee,
    // accountingReviewedAt,

    // reviewAuditorEmployee,
    // auditorReviewedAt,

    reviewManagerEmployee,
    // managerReviewedAt,

    status,
  } = data_certifiedDocument ?? {};

  const isReviewer = checkReviewer(userInfo, data_certifiedDocument);

  const isSealed = status === '已用印';

  // ---------------------------------------------------------------------------

  const editInfo: TeditInfo = (key, value) => {
    setState_info((state) => {
      return {
        ...state,
        [key]: value,
      };
    });
  };

  const editDate: TeditDate = (key, value) => {
    setState_info((state) => {
      return {
        ...state,
        [key]: value,
      };
    });
  };

  const editItem = (key: string, value: string) => {
    setState_itemList((state) => {
      const copy = { ...state };

      const item = copy[key];
      const { contractProdQty, certificatedAllQty } = item;

      const allowQty = new Decimal(contractProdQty).minus(certificatedAllQty).toNumber();

      if (Number(value) <= allowQty) {
        copy[key].qty = Number(value);
      }

      return copy;
    });
  };

  const removeItem = (key: string) => {
    setState_itemList((state) => {
      const copy = { ...state };
      delete copy[key];

      return copy;
    });
  };

  // ---------------------------------------------------------------------------

  // ██████  ███████  ██████  ███████ ███████ ████████
  // ██   ██ ██      ██    ██ ██      ██         ██
  // ██████  █████   ██    ██ █████   ███████    ██
  // ██   ██ ██      ██ ▄▄ ██ ██           ██    ██
  // ██   ██ ███████  ██████  ███████ ███████    ██

  const reqPostCertificatedDoc = useCallback(async () => {
    const {
      applicationDate,
      projectNumber,
      projectName,
      contractor,
      valuation,
      payment,
      retainage,
      paymentDate,
      disbursementDate,
      warrantyDate,
    } = state_info;

    if (!state_docStyle) {
      return myAlert.info({ title: '請選擇文件種類' });
    }

    const products = Object.entries(state_itemList).map(([key, item]) => {
      return {
        settleProductId: key,
        quantity: item.qty,
      };
    });

    // _______________________________________________________________
    const isPass = checkProduct(products);

    if (!isPass) {
      return;
    }
    // _______________________________________________________________

    const body: TcreateCertificatedDocDto = {
      projectNumber,
      contractor,
      payment: payment ? Number(payment) : null,
      paymentDate: paymentDate ? paymentDate.toISOString() : null,
      applicationDate: applicationDate ? applicationDate.toISOString() : null,
      projectName,
      valuation: valuation ? Number(valuation) : null,
      retainage: retainage ? Number(retainage) : null,
      disbursementDate: disbursementDate ? disbursementDate.toISOString() : null,
      warrantyDate: warrantyDate ? warrantyDate.toISOString() : null,
      description: state_description,
      docStyle: state_docStyle,
      status: '審核中',
      products,
      note: state_note,
    };
    // certifiedDocumentId
    setIsFetching(true);
    await apiPostCertificatedDoc(body).then(async (res) => {
      const id = res.id;
      router.replace({
        query: {
          ...query,
          certifiedDocumentId: id,
        },
      });
      await update_contract();
      await update_data_CertifiedDocument();
    });
    setDisabled(true);
    setIsFetching(false);
  }, [
    //
    query,
    router,
    state_description,
    state_docStyle,
    state_info,
    state_itemList,
    state_note,
    update_contract,
    update_data_CertifiedDocument,
  ]);

  const reqPatchCertificatedDoc = useCallback(async () => {
    const {
      applicationDate,
      projectNumber,
      projectName,
      contractor,
      valuation,
      payment,
      retainage,
      paymentDate,
      disbursementDate,
      warrantyDate,
    } = state_info;

    if (!certifiedDocumentId) {
      return console.log('certifiedDocumentId為空');
    }

    if (!state_docStyle) {
      return myAlert.info({ title: '請選擇文件種類' });
    }

    const products = Object.entries(state_itemList).map(([key, item]) => {
      return {
        settleProductId: key,
        quantity: item.qty,
      };
    });

    // ______________________________________________________________
    const isPass = checkProduct(products);

    if (!isPass) {
      return;
    }
    // ______________________________________________________________

    const body: TupdateCertificatedDocDto = {
      projectNumber,
      contractor,
      payment: payment ? Number(payment) : null,
      paymentDate: paymentDate ? paymentDate.toISOString() : null,
      applicationDate: applicationDate ? applicationDate.toISOString() : null,
      projectName,
      valuation: valuation ? Number(valuation) : null,
      retainage: retainage ? Number(retainage) : null,
      disbursementDate: disbursementDate ? disbursementDate.toISOString() : null,
      warrantyDate: warrantyDate ? warrantyDate.toISOString() : null,
      description: state_description,
      docStyle: state_docStyle,
      status: '審核中',
      products,
      note: state_note,
      // snapShot
    };

    setIsFetching(true);
    await apiPatchCertificatedDoc(certifiedDocumentId, body).then(() => update_data_CertifiedDocument());
    setDisabled(true);
    setIsFetching(false);
  }, [
    certifiedDocumentId,
    state_description,
    state_docStyle,
    state_info,
    state_itemList,
    state_note,
    update_data_CertifiedDocument,
  ]);

  const reqPatchCertificatedDoc_submit = useCallback(
    async (guarantor: TemployeeDto) => {
      if (!certifiedDocumentId) {
        return console.log('certifiedDocumentId為空');
      }

      // if (!state_guarantor) {
      //   return myAlert.info({ title: '請選擇擔保人' });
      // }

      setIsFetching(true);
      await apiPatchCertificatedDoc_submit(certifiedDocumentId, {
        reviewGuarantorEmployeeId: guarantor.id,
      }).then(() => update_data_CertifiedDocument());
      setIsFetching(false);
    },
    [certifiedDocumentId, update_data_CertifiedDocument]
  );

  // 審核
  const reqPatchCertificatedDoc_review = useCallback(
    async (reviewResult: boolean) => {
      if (!certifiedDocumentId) {
        return console.log('certifiedDocumentId為空');
      }

      setIsFetching(true);
      await apiPatchCertificatedDoc_review(certifiedDocumentId, { reviewResult }).then(() =>
        update_data_CertifiedDocument()
      );
      setIsFetching(false);
    },
    [certifiedDocumentId, update_data_CertifiedDocument]
  );

  // ---------------------------------------------------------------------------

  // ███    ███ ███████ ███    ███  ██████
  // ████  ████ ██      ████  ████ ██    ██
  // ██ ████ ██ █████   ██ ████ ██ ██    ██
  // ██  ██  ██ ██      ██  ██  ██ ██    ██
  // ██      ██ ███████ ██      ██  ██████

  const settleProductList = useMemo(() => {
    const list: { [key: string]: TsettleProductDto } = {};

    contract?.content.settleProducts.forEach((item) => {
      list[item.id] = item;
    });

    return list;
  }, [contract?.content.settleProducts]);

  const { control_signature, defaultSeletedDataArrArr } = useMemo(() => {
    const signatureArr = [
      {
        label: '總經理',
        className: 'w-[210px]',
        value: reviewManagerEmployee?.chName ?? '',
      },
      {
        label: '擔保人',
        className: 'w-[210px]',
        value: reviewGuarantorEmployee?.chName ?? '',
      },
      {
        label: '製表人',
        className: 'w-[210px]',
        value: agentEmployee?.chName ?? '',
      },
    ];

    const defaultSeletedDataArrArr: Parameters<typeof Selector_employee>[0]['defaultSeletedDataArrArr'] = [
      reviewGuarantorEmployee ? [reviewGuarantorEmployee] : [],
      // state_activeReviewer.tabulator ? [state_activeReviewer.tabulator] : [],
    ];

    const control_signature = {
      signatureArr,
    };

    return {
      control_signature,
      defaultSeletedDataArrArr,
    };
  }, [reviewGuarantorEmployee, disabled]);

  // _________________________________________________________________________
  // _________________________________________________________________________

  const panelList = usePanelList({
    disabled,
    isNew,
    query,
    router,
    setDisabled,
    setState_showSelector_employee,
    reqPostCertificatedDoc,
    reqPatchCertificatedDoc,
    reqPatchCertificatedDoc_review,
    // certificateId: certifiedDocumentId ?? '',
    isReviewer,
    isSealed,
  });

  // _________________________________________________________________________
  // _________________________________________________________________________

  const control_table = useControl_table({
    disabled,
    state_itemList,
    editItem,
    removeItem,
    setState_showSelector_settleProduct,
  });

  // _________________________________________________________________________
  // _________________________________________________________________________

  // const selectedSettleProduct = useMemo(() => {
  //   const settleProducts = contract?.content.settleProducts;

  //   const arr: TsettleProductDto[] = [];

  //   settleProducts?.forEach((prod) => {
  //     if (state_itemList[prod.id]) {
  //       arr.push(prod);
  //     }
  //   });

  //   return arr;
  // }, [contract, state_itemList]);

  // --------------------------------------------------------------------------

  // ███████ ███████ ███████ ███████  ██████ ████████
  // ██      ██      ██      ██      ██         ██
  // █████   █████   █████   █████   ██         ██
  // ██      ██      ██      ██      ██         ██
  // ███████ ██      ██      ███████  ██████    ██

  useEffect(() => {
    if (state_docStyle !== '保固書') {
      editDate('warrantyDate', null);
    }
  }, [state_docStyle]);

  useEffect(() => {
    onPanelChange(panelList);

    return () => {
      onPanelChange(undefined);
    };
  }, [panelList]);

  useEffect(() => {
    update_data_CertifiedDocument();
  }, [certifiedDocumentId]);

  useEffect(() => {
    let projectNumber = '';
    let projectName = '';
    let contractor = '';

    if (data_certifiedDocument) {
      projectNumber = data_certifiedDocument.projectNumber ?? '';
      projectName = data_certifiedDocument.projectName ?? '';
      contractor = data_certifiedDocument.contractor ?? '';
    } else if (contract?.engineeringContact) {
      const engineeringContact = contract.engineeringContact;
      projectNumber = engineeringContact.projectNumber;
      projectName = engineeringContact.projectName;
      contractor = engineeringContact.contractor;
    }

    setState_info((state) => {
      return {
        ...state,
        projectNumber,
        projectName,
        contractor,
      };
    });
  }, [contract?.engineeringContact, data_certifiedDocument]);

  useEffect(() => {
    if (!data_certifiedDocument) {
      setState_docStyle(undefined);
      setState_info(createEmptyState_info);
      setState_itemList({});
      setState_description('');
      setState_note('');
    } else {
      const { products, reviewGuarantorEmployee } = data_certifiedDocument;

      const list: Tstate_itemList = {};

      products.forEach((prod) => {
        const {
          // itemName,
          // fullWidth,
          // height,
          // boxB,
          // doorModelName,
          // quantity,
          // firePreventionCertificated,
          // factoryCertificated,
          // warrantyCertificated,
          settleProductId,
          // settleProduct, // 為了優化後端效能，不拿這邊的settleProduct
        } = prod;

        if (!settleProductId) {
          return;
        }

        if (!list[settleProductId]) {
          const settleProduct = settleProductList[settleProductId];
          const {
            itemName,
            fullWidth,
            height,
            boxB,
            doorModelName,
            quantity,
            factoryCertificatedQuantity,
            firePreventionCertificatedQuantity,
            preFactoryCertificatedQuantity,
            preFirePreventionCertificatedQuantity,
            preWarrantyCertificatedQuantity,
            warrantyCertificatedQuantity,
          } = settleProduct;

          const size = calcSize({
            fullWidth,
            height,
            boxB: boxB,
          });

          const certificatedAllQty = calcCertificatedAllQty({
            factoryCertificatedQuantity: factoryCertificatedQuantity ?? 0,
            firePreventionCertificatedQuantity: firePreventionCertificatedQuantity ?? 0,
            preFactoryCertificatedQuantity: preFactoryCertificatedQuantity ?? 0,
            preFirePreventionCertificatedQuantity: preFirePreventionCertificatedQuantity ?? 0,
            preWarrantyCertificatedQuantity: preWarrantyCertificatedQuantity ?? 0,
            warrantyCertificatedQuantity: warrantyCertificatedQuantity ?? 0,
          });

          list[settleProductId] = {
            itemName,
            size,
            doorModelName,
            contractProdQty: quantity,
            certificatedAllQty,
            qty: 1,
          };
        } else {
          list[settleProductId].qty++;
        }

        //
      });

      setState_docStyle(data_certifiedDocument.docStyle);

      setState_info({
        // docStyle: data_certifiedDocument.docStyle,
        applicationDate: data_certifiedDocument.applicationDate ? moment(data_certifiedDocument.applicationDate) : null,
        projectNumber: data_certifiedDocument.projectNumber ?? '',
        projectName: data_certifiedDocument.projectName ?? '',
        contractor: data_certifiedDocument.contractor ?? '',
        valuation: String(data_certifiedDocument.valuation),
        payment: String(data_certifiedDocument.payment),
        retainage: String(data_certifiedDocument.retainage),
        paymentDate: data_certifiedDocument.paymentDate ? moment(data_certifiedDocument.paymentDate) : null,
        disbursementDate: data_certifiedDocument.disbursementDate
          ? moment(data_certifiedDocument.disbursementDate)
          : null,
        warrantyDate: data_certifiedDocument.warrantyDate ? moment(data_certifiedDocument.warrantyDate) : null,
      });

      setState_itemList(list);

      setState_description(data_certifiedDocument.description ?? '');
      setState_note(data_certifiedDocument.note ?? '');
    }
  }, [disabled, data_certifiedDocument, settleProductList]);

  // ---------------------------------------------------------------------------

  // ██████  ███████ ███    ██ ██████  ███████ ██████
  // ██   ██ ██      ████   ██ ██   ██ ██      ██   ██
  // ██████  █████   ██ ██  ██ ██   ██ █████   ██████
  // ██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
  // ██   ██ ███████ ██   ████ ██████  ███████ ██   ██
  return (
    <div className={classNames(className)}>
      <div className="w-[1100px] ml-10">
        <InputGroup
          disabled={disabled}
          //
          state_info={state_info}
          state_docStyle={state_docStyle}
          editInfo={editInfo}
          editDate={editDate}
          setState_docStyle={setState_docStyle}
        />

        <Table01 className="mt-10" style={{ width: '100%' }} {...control_table} />

        <WrappedTextarea
          disabled={disabled}
          inputSelProps={{ caption: '說明' }}
          textareaProps={{
            props: {
              name: 'description',
              maxRows: 6,
              minRows: 6,
              value: state_description,
              onChange: (e) => {
                setState_description(e.target.value);
              },
            },
          }}
        />

        <WrappedTextarea
          disabled={disabled}
          inputSelProps={{ caption: '備註' }}
          textareaProps={{
            props: {
              name: 'remark',
              maxRows: 4,
              minRows: 4,
              value: state_note,
              onChange: (e) => {
                setState_note(e.target.value);
              },
            },
          }}
        />

        <SignatureBar
          className="mt-10 w-fit"
          disabled={disabled}
          control={control_signature}
          style={{ justifyContent: 'flex-start', gap: '50px' }}
        />
      </div>
      <Selector_employee_memo
        showModal={state_showSelector_employee}
        defaultSeletedDataArrArr={defaultSeletedDataArrArr}
        onConfirm={(arr) => {
          const guarantor = arr[0][0];

          // setState_guarantor(guarantor);
          reqPatchCertificatedDoc_submit(guarantor);
        }}
        onCancel={() => {
          setState_showSelector_employee(false);
        }}
      />

      <Selector_settleProduct_memo
        //
        showModal={state_showSelector_settleProduct}
        onConfirm={(arr) => {
          const settleProductArr = arr[0];

          const itemList: Tstate_itemList = {};

          settleProductArr.forEach((prod) => {
            const {
              fullWidth,
              height,
              boxB,
              id,
              itemName,
              doorModelName,
              factoryCertificatedQuantity,
              firePreventionCertificatedQuantity,
              preFactoryCertificatedQuantity,
              preFirePreventionCertificatedQuantity,
              preWarrantyCertificatedQuantity,
              warrantyCertificatedQuantity,
              quantity,
            } = prod;

            const certificatedAllQty = calcCertificatedAllQty({
              factoryCertificatedQuantity: factoryCertificatedQuantity ?? 0,
              firePreventionCertificatedQuantity: firePreventionCertificatedQuantity ?? 0,
              preFactoryCertificatedQuantity: preFactoryCertificatedQuantity ?? 0,
              preFirePreventionCertificatedQuantity: preFirePreventionCertificatedQuantity ?? 0,
              preWarrantyCertificatedQuantity: preWarrantyCertificatedQuantity ?? 0,
              warrantyCertificatedQuantity: warrantyCertificatedQuantity ?? 0,
            });

            const size = calcSize({
              fullWidth,
              height,
              boxB: boxB,
            });

            itemList[id] = {
              itemName,
              size,
              doorModelName,
              contractProdQty: quantity,
              certificatedAllQty,
              qty: 0,
            };
          }); // foreach

          setState_itemList((state) => {
            return {
              ...state,
              ...itemList,
            };
          });
        }} // confirm
        onCancel={() => {
          setState_showSelector_settleProduct(false);
        }}
        dynaSelectorPropsList={[
          {
            useNoMetaProps: {
              id: contract?.content.id ?? '',
            },
            forbiddenCheck_dataList: (data) => {
              return !!state_itemList[data.id];
            },
          },
        ]}
        // defaultSeletedDataArrArr={[selectedSettleProduct]}
      />
    </div>
  );
}
// ███████ ███    ██ ██████
// ██      ████   ██ ██   ██
// █████   ██ ██  ██ ██   ██
// ██      ██  ██ ██ ██   ██
// ███████ ██   ████ ██████

// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================

//  ██████  ██████  ███    ███ ██████   ██████  ███    ██ ███████ ███    ██ ████████
// ██      ██    ██ ████  ████ ██   ██ ██    ██ ████   ██ ██      ████   ██    ██
// ██      ██    ██ ██ ████ ██ ██████  ██    ██ ██ ██  ██ █████   ██ ██  ██    ██
// ██      ██    ██ ██  ██  ██ ██      ██    ██ ██  ██ ██ ██      ██  ██ ██    ██
//  ██████  ██████  ██      ██ ██       ██████  ██   ████ ███████ ██   ████    ██

const InputGroup = ({
  disabled,
  state_info,
  editInfo,
  editDate,
  state_docStyle,
  setState_docStyle,
}: {
  disabled?: boolean;
  state_info: Tstate_info;
  state_docStyle: string | undefined;
  editInfo: TeditInfo;
  editDate: TeditDate;
  setState_docStyle: React.Dispatch<React.SetStateAction<TdocType | undefined>>;
}) => {
  return (
    <Wrapper_inpuSel_01 className="w-[845px]">
      <InputSel
        {...infoConfig}
        caption="文件種類"
        disabled={disabled}
        selectProps={{
          props: {
            menuPortalTarget: undefined,
            styles: {
              menuPortal: (base) => ({
                ...base,
                zIndex: 3,
              }),
            },
            options: optionsCreator_certifyType(),
            value: state_docStyle
              ? {
                  value: state_docStyle,
                  label: state_docStyle,
                }
              : null,
            onChange: (option) => {
              const value = option?.value as TdocType | undefined;

              setState_docStyle(value);
            },
          },
        }}
      />
      <InputSel
        {...infoConfig}
        caption="申請日期"
        disabled={disabled}
        datePickerProps={{
          props: {
            value: state_info.applicationDate,
            onChange: (m) => {
              editDate('applicationDate', m);
            },
          },
        }}
      />
      <InputSel
        {...infoConfig}
        caption="工程編號"
        disabled={true}
        showBaseline="invisible"
        inputProps={{
          props: {
            value: state_info.projectNumber,
            onChange: (e) => {
              // editInfo('projectNumber', e.target.value);
            },
            placeholder: '無資料',
          },
        }}
      />
      <InputSel
        {...infoConfig}
        caption="工程名稱"
        disabled={true}
        showBaseline="invisible"
        inputProps={{
          props: {
            value: state_info.projectName,
            onChange: (e) => {
              // editInfo('projectName', e.target.value);
            },
            placeholder: '無資料',
          },
        }}
      />
      <InputSel
        {...infoConfig}
        caption="承包商"
        disabled={true}
        showBaseline="invisible"
        inputProps={{
          props: {
            value: state_info.contractor,
            onChange: (e) => {
              // editInfo('contractor', e.target.value);
            },
            placeholder: '無資料',
          },
        }}
      />
      <InputSel
        {...infoConfig}
        caption="本期計價"
        disabled={disabled}
        inputProps={{
          props: {
            type: 'number',
            value: state_info.valuation,
            onChange: (e) => {
              editInfo('valuation', e.target.value);
            },
          },
        }}
      />
      <InputSel
        {...infoConfig}
        caption="本期請款"
        disabled={disabled}
        inputProps={{
          props: {
            type: 'number',
            value: state_info.payment,
            onChange: (e) => {
              editInfo('payment', e.target.value);
            },
          },
        }}
      />
      <InputSel
        {...infoConfig}
        caption="保留款"
        disabled={disabled}
        inputProps={{
          props: {
            type: 'number',
            value: state_info.retainage,
            onChange: (e) => {
              editInfo('retainage', e.target.value);
            },
          },
        }}
      />
      <InputSel
        {...infoConfig}
        caption="請款日"
        disabled={disabled}
        datePickerProps={{
          props: {
            value: state_info.paymentDate,
            onChange: (m) => {
              editDate('paymentDate', m);
            },
          },
        }}
      />
      <InputSel
        {...infoConfig}
        caption="放款日"
        disabled={disabled}
        datePickerProps={{
          props: {
            value: state_info.disbursementDate,
            onChange: (m) => {
              editDate('disbursementDate', m);
            },
          },
        }}
      />

      <InputSel
        {...infoConfig}
        className={classNames(state_docStyle !== '保固書' && 'invisible')}
        caption="保固日"
        disabled={disabled}
        datePickerProps={{
          props: {
            value: state_info.warrantyDate,
            onChange: (m) => {
              editDate('warrantyDate', m);
            },
          },
        }}
      />
    </Wrapper_inpuSel_01>
  );
};

// ==============================================================================

// ██   ██  ██████   ██████  ██   ██
// ██   ██ ██    ██ ██    ██ ██  ██
// ███████ ██    ██ ██    ██ █████
// ██   ██ ██    ██ ██    ██ ██  ██
// ██   ██  ██████   ██████  ██   ██

const useControl_table = ({
  disabled,
  state_itemList,
  editItem,
  setState_showSelector_settleProduct,
  removeItem,
}: {
  disabled?: boolean;
  state_itemList: Tstate_itemList;
  editItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  setState_showSelector_settleProduct: React.Dispatch<React.SetStateAction<boolean>>;
}): Ttable => {
  //
  const control_table: Ttable = useMemo(() => {
    const thead: Ttable['thead'] = {
      // stickyTop: {
      //   top: '40px',
      // },
      rowProps: {
        minHeight: tableConfig.row.minHeight,
      },
      cellArr: [
        {
          children: (
            <IconAddCircle
              className={classNames(scss.btn_svg, scss.btn_add, disabled && 'hidden')}
              onClick={() => setState_showSelector_settleProduct(true)}
            />
          ),
          ...cellConfig.btn,
        },
        {
          children: cellConfig.itemName.label,
          ...cellConfig.itemName,
        },
        {
          children: cellConfig.size.label,
          ...cellConfig.size,
        },
        {
          children: cellConfig.doorModel.label,
          ...cellConfig.doorModel,
        },
        {
          children: cellConfig.contractProdQty.label,
          ...cellConfig.contractProdQty,
        },
        {
          children: cellConfig.certificatedAllQty.label,
          ...cellConfig.certificatedAllQty,
        },
        {
          children: cellConfig.qty.label,
          ...cellConfig.qty,
        },
      ],
    };

    const rowArr = Object.entries(state_itemList).map(([key, item], index) => {
      return {
        minHeight: tableConfig.row.minHeight,
        onClick: () => {},
        cellArr: [
          {
            children: (
              <IconRemoveCircle
                className={classNames(scss.btn_svg, disabled && 'hidden')}
                onClick={() => removeItem(key)}
              />
            ),
            ...cellConfig.btn,
          },
          {
            children: item.itemName,
            ...cellConfig.itemName,
          },
          {
            children: item.size,
            ...cellConfig.size,
          },
          {
            children: item.doorModelName,
            ...cellConfig.doorModel,
          },
          {
            children: item.contractProdQty,
            ...cellConfig.contractProdQty,
          },
          {
            children: item.certificatedAllQty,
            ...cellConfig.certificatedAllQty,
          },
          {
            children: (
              <InputSel
                disabled={disabled}
                showBaseline="auto"
                inputProps={{
                  props: {
                    value: item.qty,
                    onChange: (e) => {
                      editItem(key, e.target.value);
                    },
                    type: 'number',
                    className: 'text-center',
                  },
                }}
              />
            ),
            ...cellConfig.qty,
          },
        ],
      };
    });

    const control_table: Ttable = {
      thead,
      tbody: {
        rowArr,
      },
      haveBorder: true,
    };

    return control_table;
    //
  }, [state_itemList, disabled]);

  return control_table;
};

// ---------------------------------------------------------------

const usePanelList = ({
  //
  disabled,
  isNew,
  query,
  router,
  setDisabled,
  setState_showSelector_employee: setState_showSelector,
  reqPostCertificatedDoc,
  reqPatchCertificatedDoc,
  reqPatchCertificatedDoc_review,
  isReviewer,
  isSealed,
}: // certificateId,
{
  disabled: boolean;
  isNew: boolean;
  query: Tquery;
  router: NextRouter;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setState_showSelector_employee: React.Dispatch<React.SetStateAction<boolean>>;
  reqPostCertificatedDoc: () => void;
  reqPatchCertificatedDoc: () => void;
  reqPatchCertificatedDoc_review: (reviewResult: boolean) => void;
  isReviewer: boolean;
  isSealed: boolean;
  // certificateId: string;
}) => {
  const panelList = useMemo(() => {
    const isSealedBtn: TpanelList[number] = {
      type: 'redButton',
      label: '已用印',
      onClick: () => {},
    };

    const submitBtn: TpanelList[number] = {
      type: 'redButton',
      label: '送審',
      onClick: () => {
        setState_showSelector(true);
      },
    };

    const reviewBtn: TpanelList[number] = {
      type: 'redButton',
      label: '審核',
      onClick: () => {
        const modal = myAlert.btnBar({
          title: '是否通過審核',
          btnPropsArr: [
            {
              label: '審核通過',
              onClick: () => reqPatchCertificatedDoc_review(true),
              theme: 'danger',
            },
            {
              label: '審核不通過',
              onClick: () => reqPatchCertificatedDoc_review(false),
            },
            {
              label: '取消',
              onClick: () => {
                modal.destroy();
              },
            },
          ],
        });
      },
    };

    const editBtn: TpanelList[number] = {
      type: 'myButton',
      label: '編輯',
      onClick: () => {
        setDisabled(false);
      },
    };

    // -------------------------

    const panelList_new: TpanelList = [
      {
        type: 'redButton',
        label: '確定',
        onClick: reqPostCertificatedDoc,
      },
      {
        type: 'myButton',
        label: '返回',
        onClick: router.back,
      },
    ];

    const panelList_disabled: TpanelList = [
      isSealed ? isSealedBtn : null,
      !isSealed ? submitBtn : null,
      !isSealed && isReviewer ? reviewBtn : null,

      {
        type: 'myButton',
        label: '開立證明書',
        onClick: () => {
          const query_copy = { ...query };
          delete query_copy.editCertifiedDocument;

          router.push({
            query: {
              ...query_copy,
              certifiedDocumentId: query.certifiedDocumentId,
              showCertificate: 'true',
            },
          });
        },
      },

      !isSealed ? editBtn : null,

      {
        type: 'myButton',
        label: '返回',
        // onClick: router.back,
        onClick: router.back,
      },
    ];

    const panelList_abled: TpanelList = [
      {
        type: 'redButton',
        label: '確定',
        onClick: reqPatchCertificatedDoc,
      },
      {
        type: 'myButton',
        label: '取消',
        onClick: () => {
          setDisabled(true);
        },
      },
    ];

    if (isNew) {
      return panelList_new;
    } else if (disabled) {
      return panelList_disabled;
    } else {
      return panelList_abled;
    }
  }, [
    disabled,
    isNew,
    query,
    reqPatchCertificatedDoc,
    reqPatchCertificatedDoc_review,
    reqPostCertificatedDoc,
    router,
    setDisabled,
    setState_showSelector,
    isReviewer,
    isSealed,
  ]);

  return panelList;
};

// const useSelecotr_settleProduct = () => {
//   const Selector = useMemo(() => {
//     const Selector_settleProduct = selectModalCreator_multi<['settleProduct']>({
//       selectorArr: [
//         {
//           key: 'settleProduct',
//           caption: '結算產品',
//         },
//       ],
//     });

//     const Selector_settleProduct_memo = memo(Selector_settleProduct, (preState, nextState) => {
//       return preState.showModal === nextState.showModal;
//     });

//     return Selector_settleProduct_memo;
//   }, []);

//   return Selector;
// };

// ==============================================================================

//  ██████  ██████  ███    ██ ███████ ██  ██████
// ██      ██    ██ ████   ██ ██      ██ ██
// ██      ██    ██ ██ ██  ██ █████   ██ ██   ███
// ██      ██    ██ ██  ██ ██ ██      ██ ██    ██
//  ██████  ██████  ██   ████ ██      ██  ██████

const infoConfig: TinputSelProps = {
  showBaseline: 'auto',
  captionStyle: { width: 80 },
};

type TcellKeyArr =
  | 'btn'
  //
  | 'itemName'
  | 'size'
  | 'doorModel'
  | 'contractProdQty'
  | 'certificatedAllQty'
  | 'qty';

const tableConfig = {
  row: {
    minHeight: '40px',
  },
};

const cellConfig: { [key in TcellKeyArr]: Tconfig_table } = {
  btn: {
    label: '',
    width: 60,
    justifyContent: 'center',
  },
  itemName: {
    label: '項目',
    width: 150,
    justifyContent: 'center',
  },
  size: {
    label: '尺寸',
    width: 150,
    justifyContent: 'center',
  },
  doorModel: {
    label: '門型',
    width: 100,
    justifyContent: 'center',
  },
  contractProdQty: {
    label: '合約數量',
    width: 90,
    justifyContent: 'center',
  },
  certificatedAllQty: {
    label: '總開立數量',
    width: 130,
    justifyContent: 'center',
  },
  qty: {
    label: '需開立數量',
    flex: 'auto',
    justifyContent: 'center',
  },
};

const createEmptyState_info = (): Tstate_info => ({
  applicationDate: null,
  projectNumber: '',
  projectName: '',
  contractor: '',
  valuation: '',
  payment: '',
  retainage: '',
  paymentDate: null,
  disbursementDate: null,
  warrantyDate: null,
});

const calcSize = ({
  fullWidth,
  height,
  boxB,
}: {
  fullWidth: number | string;
  height: number | string;
  boxB: number | string | null;
}) => {
  let size = `${fullWidth} x ${height}`;

  if (boxB !== null) {
    size = `${size} + ${boxB}`;
  }

  return size;
};

const calcCertificatedAllQty = ({
  firePreventionCertificatedQuantity,
  factoryCertificatedQuantity,
  warrantyCertificatedQuantity,
  preFirePreventionCertificatedQuantity,
  preFactoryCertificatedQuantity,
  preWarrantyCertificatedQuantity,
}: {
  firePreventionCertificatedQuantity: number;
  factoryCertificatedQuantity: number;
  warrantyCertificatedQuantity: number;
  preFirePreventionCertificatedQuantity?: number;
  preFactoryCertificatedQuantity: number;
  preWarrantyCertificatedQuantity: number;
}) => {
  const certificatedAllQty = new Decimal(firePreventionCertificatedQuantity ?? 0)
    .add(factoryCertificatedQuantity ?? 0)
    .add(warrantyCertificatedQuantity ?? 0)
    .add(preFirePreventionCertificatedQuantity ?? 0)
    .add(preFactoryCertificatedQuantity ?? 0)
    .add(preWarrantyCertificatedQuantity ?? 0)
    .toNumber();

  return certificatedAllQty;
};

const checkProduct = (
  products: Exclude<TcreateCertificatedDocDto['products'] | TupdateCertificatedDocDto['products'], undefined>
) => {
  if (products.length === 0) {
    myAlert.info({ title: '必須選擇產品' });

    return false;
  }

  const zeroIndexArr: number[] = [];

  products.forEach((prod, index) => {
    if (prod.quantity === 0) {
      zeroIndexArr.push(index + 1);
    }
  });

  if (zeroIndexArr.length > 0) {
    const str = zeroIndexArr.map((item) => item).join(', ');

    myAlert.info({ title: '產品開立數量不可為0', content: `請檢查第${str}項` });

    return false;
  }

  return true;
};

const checkReviewer = (userInfo: TuserDto | undefined, data_certifiedDocument: TcertificatedDocDto | undefined) => {
  if (!userInfo || !userInfo.employee) {
    return false;
  }

  // type Tstep = 'guarantor' | 'accounting' | 'auditor' | 'manager';

  // type TcheckObj = {
  //   [key in Tstep]: {
  //     reviewerId: string | undefined;
  //     reviewedAt: string | null | undefined;
  //   };
  // };

  const empId = userInfo.employee?.id;

  const {
    reviewGuarantorEmployee,
    guarantorReviewedAt,

    reviewAccountingEmployee,
    accountingReviewedAt,

    reviewAuditorEmployee,
    auditorReviewedAt,

    reviewManagerEmployee,
    managerReviewedAt,
  } = data_certifiedDocument ?? {};

  const checkObj = {
    guarantor: {
      reviewerId: reviewGuarantorEmployee?.id,
      reviewedAt: guarantorReviewedAt,
    },
    accounting: {
      reviewerId: reviewAccountingEmployee?.id,
      reviewedAt: accountingReviewedAt,
    },
    auditor: {
      reviewerId: reviewAuditorEmployee?.id,
      reviewedAt: auditorReviewedAt,
    },
    manager: {
      reviewerId: reviewManagerEmployee?.id,
      reviewedAt: managerReviewedAt,
    },
  } as const;

  let isReviewer = false;
  let stopChecking = false;

  Object.entries(checkObj).forEach(([key, obj]) => {
    if (stopChecking) {
      return;
    }

    // 如果這筆未審核過，之後的不用再檢查
    if (!obj.reviewedAt) {
      stopChecking = true;
    }

    if (obj.reviewerId === empId) {
      isReviewer = true;
    }
  });

  return isReviewer;
};
