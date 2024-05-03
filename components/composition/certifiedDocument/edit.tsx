import { useState, useEffect, useMemo, useRef, memo } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import { useRouter, NextRouter } from 'next/router';
import { nanoid } from 'nanoid';

// layout
import { TtagList as TtabList, TpanelList, Tlink, TlinkArr } from 'components/PageHeader/PageHeader02/PageHeader02';
import { Wrapper, Wrapper_inpuSel_01, WrappedTextarea } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';

// ui
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import SignatureBar, {
  // Tcontrol_signatureBar,
  // TsignatureBarItem,
  TemployeeDto,
} from 'components/global/gear/signatureBar_v2';
import { selectModalCreator_multi } from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';

// options
import { optionsCreator_certifyType } from 'js/utils/options/productOptions';

// icon
import { IconAddCircle, IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';

// type
import { TdocType, TquotationContractDto } from 'js/api/dtoTypes';

// css
import scss from './edit.module.scss';

// =========================================================================

type Tquery = {
  editCertifiedDocument: 'true' | undefined;
  certifiedDocumentId: string | undefined;
  contractId: string | undefined;
};

type Tstate_info = {
  documentType: string;
  applicationDate: Moment | null;
  projectNumber: string;
  projectName: string;
  contractor: string;
  thisPeriodPrice: string;
  thisPeriodPayment: string;
  retainage: string; // 保留款
  askForPaymentDate: Moment | null;
  loanDate: Moment | null;
  warrantyDate: Moment | null; // 保固日
};
type Tstate_itemList = {
  [key: string]: string;
};
type Tstate_description = string;
type Tstate_remark = string;

// =========================================================================

const Selector = selectModalCreator_multi<['employee']>({
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

const Selector_memo = memo(Selector, (preState, nextState) => {
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
}: {
  className?: string;
  onPanelChange: (panel: TpanelList | undefined) => void;
  contract?: TquotationContractDto;
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { contractId, editCertifiedDocument, certifiedDocumentId } = query;
  const isNew = !certifiedDocumentId;

  // ---------------------------------------------------------------------------

  const [disabled, setDisabled] = useState(!isNew);
  const [state_showSelector, setState_showSelector] = useState(false);

  // ---------------------------------------------------------------------------

  const [state_info, setState_info] = useState<Tstate_info>(createEmptyState_info);

  const [state_itemList, setState_itemList] = useState<Tstate_itemList>({});
  const [state_description, setState_description] = useState<Tstate_description>('');
  const [state_remark, setState_remark] = useState<Tstate_remark>('');

  // 擔保人
  const [state_guarantor, setState_guarantor] = useState<TemployeeDto | undefined>(undefined);

  // const [state_activeReviewer, setState_activeReviewer] = useState<{
  //   guarantor: TemployeeDto | undefined;
  //   tabulator: TemployeeDto | undefined;
  // }>({
  //   guarantor: undefined,
  //   tabulator: undefined,
  // });

  // ---------------------------------------------------------------------------

  const { data: data_certifiedDocument, update: update_data_CertifiedDocument } = useFakeGetApi(certifiedDocumentId);

  // ---------------------------------------------------------------------------

  const editInfo = (
    key: keyof Omit<Tstate_info, 'applicationDate' | 'askForPaymentDate' | 'loanDate'>,
    value: string
  ) => {
    setState_info((state) => {
      return {
        ...state,
        [key]: value,
      };
    });
  };

  const editDate = (
    key: 'applicationDate' | 'askForPaymentDate' | 'loanDate' | 'warrantyDate',
    value: Moment | null
  ) => {
    setState_info((state) => {
      return {
        ...state,
        [key]: value,
      };
    });
  };

  const editItem = (key: string, value: string) => {
    setState_itemList((state) => {
      return {
        ...state,
        [key]: value,
      };
    });
  };

  // ---------------------------------------------------------------------------

  const { control_signature, defaultSeletedDataArrArr } = useMemo(() => {
    const fakeArr = [
      {
        label: '總經理',
        className: 'w-[210px]',
      },
      {
        label: '擔保人',
        className: 'w-[210px]',
        value: state_guarantor?.chName,
      },
      {
        label: '製表人',
        className: 'w-[210px]',
        // value: state_activeReviewer.tabulator?.chName,
      },
    ];

    const defaultSeletedDataArrArr: Parameters<typeof Selector>[0]['defaultSeletedDataArrArr'] = [
      state_guarantor ? [state_guarantor] : [],
      // state_activeReviewer.tabulator ? [state_activeReviewer.tabulator] : [],
    ];

    const control_signature = {
      signatureArr: fakeArr,
    };

    return {
      control_signature,
      defaultSeletedDataArrArr,
    };
  }, [state_guarantor, disabled]);

  const panelList = usePanelList({
    disabled,
    isNew,
    query,
    router,
    setDisabled,
    setState_showSelector,
  });

  // --------------------------------------------------------------------------

  const control_table = useControl_table({
    disabled,
    data: state_itemList,
    editItem,
  });

  // --------------------------------------------------------------------------

  useEffect(() => {
    onPanelChange(panelList);

    return () => {
      onPanelChange(undefined);
    };
  }, [panelList]);

  useEffect(() => {
    update_data_CertifiedDocument();
  }, []);

  useEffect(() => {
    if (!data_certifiedDocument) {
      setState_info(createEmptyState_info);
      setState_itemList({});
      setState_description('');
      setState_remark('');
    } else {
      setState_info({
        documentType: data_certifiedDocument.documentType,
        applicationDate: data_certifiedDocument.applicationDate ? moment(data_certifiedDocument.applicationDate) : null,
        projectNumber: data_certifiedDocument.projectNumber,
        projectName: data_certifiedDocument.projectName,
        contractor: data_certifiedDocument.contractor,
        thisPeriodPrice: String(data_certifiedDocument.thisPeriodPrice),
        thisPeriodPayment: String(data_certifiedDocument.thisPeriodPayment),
        retainage: String(data_certifiedDocument.retainage),
        askForPaymentDate: data_certifiedDocument.askForPaymentDate
          ? moment(data_certifiedDocument.askForPaymentDate)
          : null,
        loanDate: data_certifiedDocument.loanDate ? moment(data_certifiedDocument.loanDate) : null,
        warrantyDate: data_certifiedDocument.warrantyDate ? moment(data_certifiedDocument.warrantyDate) : null,
      });

      setState_itemList(() => {
        const list: Tstate_itemList = {};

        data_certifiedDocument.itemArr.forEach((item) => {
          list[item.id] = String(item.needToCreatedQty);
        });

        return list;
      });

      setState_description(data_certifiedDocument.description);
      setState_remark(data_certifiedDocument.remark);
    }
  }, [disabled, data_certifiedDocument]);

  // ---------------------------------------------------------------------------

  // ██████  ███████ ███    ██ ██████  ███████ ██████
  // ██   ██ ██      ████   ██ ██   ██ ██      ██   ██
  // ██████  █████   ██ ██  ██ ██   ██ █████   ██████
  // ██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
  // ██   ██ ███████ ██   ████ ██████  ███████ ██   ██
  return (
    <div className={classNames(className)}>
      <div className="w-[1100px] ml-10">
        <InputGroup disabled={disabled} data={state_info} editInfo={editInfo} editDate={editDate} />

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
              value: state_remark,
              onChange: (e) => {
                setState_remark(e.target.value);
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
      <Selector_memo
        showModal={state_showSelector}
        defaultSeletedDataArrArr={defaultSeletedDataArrArr}
        onConfirm={(arr) => {
          const guarantor = arr[0][0];

          setState_guarantor(guarantor);
        }}
        onCancel={() => {
          setState_showSelector(false);
        }}
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
  data,
  editInfo,
  editDate,
}: {
  disabled?: boolean;
  data: {
    documentType: string;
    applicationDate: Moment | null;
    projectNumber: string;
    projectName: string;
    contractor: string;
    thisPeriodPrice: string;
    thisPeriodPayment: string;
    retainage: string; // 保留款
    askForPaymentDate: Moment | null;
    loanDate: Moment | null;
  };
  editInfo: (key: keyof Omit<Tstate_info, 'applicationDate' | 'askForPaymentDate' | 'loanDate'>, value: string) => void;
  editDate: (key: 'applicationDate' | 'askForPaymentDate' | 'loanDate' | 'warrantyDate', value: Moment | null) => void;
}) => {
  return (
    <Wrapper_inpuSel_01 className="w-[845px]">
      <InputSel
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
            value: data.documentType
              ? {
                  value: data.documentType,
                  label: data.documentType,
                }
              : null,
            onChange: (option) => {
              editInfo('documentType', option?.value ?? '');
            },
          },
        }}
      />
      <InputSel
        caption="申請日期"
        disabled={disabled}
        datePickerProps={{
          props: {
            value: data.applicationDate,
            onChange: (m) => {
              editDate('applicationDate', m);
            },
          },
        }}
      />
      <InputSel
        caption="工程編號"
        disabled={disabled}
        inputProps={{
          props: {
            value: data.projectNumber,
            onChange: (e) => {
              editInfo('projectNumber', e.target.value);
            },
          },
        }}
      />
      <InputSel
        caption="工程名稱"
        disabled={disabled}
        inputProps={{
          props: {
            value: data.projectName,
            onChange: (e) => {
              editInfo('projectName', e.target.value);
            },
          },
        }}
      />
      <InputSel
        caption="承包商"
        disabled={disabled}
        inputProps={{
          props: {
            value: data.contractor,
            onChange: (e) => {
              editInfo('contractor', e.target.value);
            },
          },
        }}
      />
      <InputSel
        caption="本期計價"
        disabled={disabled}
        inputProps={{
          props: {
            value: data.thisPeriodPrice,
            onChange: (e) => {
              editInfo('thisPeriodPrice', e.target.value);
            },
          },
        }}
      />
      <InputSel
        caption="本期請款"
        disabled={disabled}
        inputProps={{
          props: {
            value: data.thisPeriodPayment,
            onChange: (e) => {
              editInfo('thisPeriodPayment', e.target.value);
            },
          },
        }}
      />
      <InputSel
        caption="保留款"
        disabled={disabled}
        inputProps={{
          props: {
            value: data.retainage,
            onChange: (e) => {
              editInfo('retainage', e.target.value);
            },
          },
        }}
      />
      <InputSel
        caption="請款日"
        disabled={disabled}
        datePickerProps={{
          props: {
            value: data.askForPaymentDate,
            onChange: (m) => {
              editDate('askForPaymentDate', m);
            },
          },
        }}
      />
      <InputSel
        caption="放款日"
        disabled={disabled}
        datePickerProps={{
          props: {
            value: data.loanDate,
            onChange: (m) => {
              editDate('loanDate', m);
            },
          },
        }}
      />

      <InputSel
        caption="保固日"
        disabled={disabled}
        datePickerProps={{
          props: {
            value: data.loanDate,
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
  data,
  editItem,
}: {
  disabled?: boolean;
  data: Tstate_itemList;
  editItem: (key: string, value: string) => void;
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
          children: <IconAddCircle className={classNames(scss.btn_svg, scss.btn_add, disabled && 'hidden')} />,
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
          children: cellConfig.createdQty.label,
          ...cellConfig.createdQty,
        },
        {
          children: cellConfig.needToCreatedQty.label,
          ...cellConfig.needToCreatedQty,
        },
      ],
    };

    const rowArr = Object.entries(data).map(([key, value], index) => {
      return {
        minHeight: tableConfig.row.minHeight,
        onClick: () => {},
        cellArr: [
          {
            children: <IconRemoveCircle className={classNames(scss.btn_svg, disabled && 'hidden')} />,
            ...cellConfig.btn,
          },
          {
            children: 'SD-1',
            ...cellConfig.itemName,
          },
          {
            children: '99*99+99',
            ...cellConfig.size,
          },
          {
            children: 'SJ-302',
            ...cellConfig.doorModel,
          },
          {
            children: 99,
            ...cellConfig.contractProdQty,
          },
          {
            children: 88,
            ...cellConfig.createdQty,
          },
          {
            children: (
              <InputSel
                disabled={disabled}
                showBaseline="auto"
                inputProps={{
                  props: {
                    value: value,
                    onChange: (e) => {
                      editItem(key, e.target.value);
                    },
                    type: 'number',
                    className: 'text-center',
                  },
                }}
              />
            ),
            ...cellConfig.needToCreatedQty,
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
  }, [data, disabled]);

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
  setState_showSelector,
}: {
  disabled: boolean;
  isNew: boolean;
  query: Tquery;
  router: NextRouter;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setState_showSelector: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const panelList = useMemo(() => {
    // const turnBack = () => {
    //   // const query_copy = { ...query };
    //   // delete query_copy.editCertifiedDocument;
    //   // delete query_copy.certifiedDocumentId;
    //   // router.replace({
    //   //   query: query_copy,
    //   // });
    //   router.back();
    // };

    const panelList_new: TpanelList = [
      {
        type: 'redButton',
        label: '確定',
        onClick: () => {
          setDisabled((state) => !state);
        },
      },
      {
        type: 'myButton',
        label: '返回',
        onClick: router.back,
      },
    ];

    const panelList_disabled: TpanelList = [
      {
        type: 'redButton',
        label: '送審',
        onClick: () => {
          setState_showSelector(true);
        },
      },
      {
        type: 'redButton',
        label: '審核',
        onClick: () => {
          alert('審核');
        },
      },
      {
        type: 'myButton',
        label: '開立證明書',
        onClick: () => {
          router.push({
            query: {
              certificateId: 'c-001',
            },
          });
        },
      },
      {
        type: 'myButton',
        label: '編輯',
        onClick: () => {
          setDisabled(false);
        },
      },
      {
        type: 'myButton',
        label: '返回',
        onClick: router.back,
      },
    ];

    const panelList_abled: TpanelList = [
      {
        type: 'redButton',
        label: '確定',
        onClick: () => {
          setDisabled(false);
        },
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
  }, [disabled, isNew]);

  return panelList;
};

// ==============================================================================

//  ██████  ██████  ███    ██ ███████ ██  ██████
// ██      ██    ██ ████   ██ ██      ██ ██
// ██      ██    ██ ██ ██  ██ █████   ██ ██   ███
// ██      ██    ██ ██  ██ ██ ██      ██ ██    ██
//  ██████  ██████  ██   ████ ██      ██  ██████

type TcellKeyArr =
  | 'btn'
  //
  | 'itemName'
  | 'size'
  | 'doorModel'
  | 'contractProdQty'
  | 'createdQty'
  | 'needToCreatedQty';

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
  createdQty: {
    label: '總開立數量',
    width: 130,
    justifyContent: 'center',
  },
  needToCreatedQty: {
    label: '需開立數量',
    flex: 'auto',
    justifyContent: 'center',
  },
};

// ███████  █████  ██   ██ ███████     ██████   █████  ████████  █████
// ██      ██   ██ ██  ██  ██          ██   ██ ██   ██    ██    ██   ██
// █████   ███████ █████   █████       ██   ██ ███████    ██    ███████
// ██      ██   ██ ██  ██  ██          ██   ██ ██   ██    ██    ██   ██
// ██      ██   ██ ██   ██ ███████     ██████  ██   ██    ██    ██   ██

type TfakeCertifiedDocument = {
  id?: string | undefined;
  documentType: string;
  applicationDate: string;
  projectNumber: string;
  projectName: string;
  contractor: string;
  thisPeriodPrice: number;
  thisPeriodPayment: number;
  retainage: number; // 保留款
  askForPaymentDate: string;
  loanDate: string;
  description: string;
  remark: string;
  warrantyDate: string;
  itemArr: {
    id: string;
    itemName: string;
    size: string;
    doorModel: string;
    contractProdQty: number;
    createdQty: number;
    needToCreatedQty: number;
  }[];
};

const fakeCertifiedDocument: TfakeCertifiedDocument = {
  id: nanoid(),
  documentType: '防火證明預先開立保證書',
  applicationDate: '2011-01-01',
  projectNumber: 'P-001',
  projectName: '喵喵工程計畫',
  contractor: '阿喵喵',
  thisPeriodPrice: 99999,
  thisPeriodPayment: 88888,
  retainage: 77777,
  askForPaymentDate: '2011-01-01',
  loanDate: '2011-01-01',
  description: '喵喵喵',
  remark: '喵喵喵',
  warrantyDate: '2022-02-02',
  itemArr: [
    {
      id: 'i-001',
      itemName: 'SD-1',
      size: '99*99+99',
      doorModel: 'SJ-302',
      contractProdQty: 99,
      createdQty: 88,
      needToCreatedQty: 8,
    },
    {
      id: 'i-002',
      itemName: 'SD-1',
      size: '99*99+99',
      doorModel: 'SJ-302',
      contractProdQty: 99,
      createdQty: 88,
      needToCreatedQty: 10,
    },
  ],
};

// const emptyCertifiedDocument: TfakeCertifiedDocument = {
//   documentType: '',
//   applicationDate: '',
//   projectNumber: '',
//   projectName: '',
//   contractor: '',
//   thisPeriodPrice: 0,
//   thisPeriodPayment: 0,
//   retainage: 0,
//   askForPaymentDate: '',
//   loanDate: '',
//   description: '',
//   remark: '',
//   itemArr: [],
// };

const createEmptyState_info = (): Tstate_info => ({
  documentType: '',
  applicationDate: null,
  projectNumber: '',
  projectName: '',
  contractor: '',
  thisPeriodPrice: '',
  thisPeriodPayment: '',
  retainage: '',
  askForPaymentDate: null,
  loanDate: null,
  warrantyDate: null,
});

const useFakeGetApi = (id: string | undefined) => {
  const [res, setRes] = useState<TfakeCertifiedDocument | undefined>(undefined);

  const update = async () => {
    if (!id) {
      return;
    }

    setRes(fakeCertifiedDocument);
  };

  return {
    data: res,
    update,
  };
};
