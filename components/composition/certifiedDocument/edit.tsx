import { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';

// layout
import { TtagList as TtabList, TpanelList, Tlink, TlinkArr } from 'components/PageHeader/PageHeader02/PageHeader02';
import { Wrapper, Wrapper_inpuSel_01, WrappedTextarea } from 'components/page/worksDepartment/ui/wrapper_inpuSel_01';

// ui
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import SignatureBar, {
  Tcontrol_signatureBar,
  TsignatureBarItem,
  TemployeeDto,
} from 'components/global/gear/signatureBar_v2';
import {
  selectModalCreator_multi,
  TselectorProps_simple,
} from 'components/global/gear/modal/selectorModalCreator_multi/selectorModalCreator_multi';

// component
import Table01, { Ttable, Tconfig_table } from 'components/global/gear/table/table01';

// options
import { optionsCreator_certifyType } from 'js/utils/options/productOptions';

// =========================================================================

type Tquery = {
  editCertifiedDocument: 'true' | undefined;
  certifiedDocumentId: string | undefined;
};

// =========================================================================

const Selector = selectModalCreator_multi<['employee', 'employee']>({
  selectorArr: [
    {
      key: 'employee',
      caption: '擔保人',
      limit: 1,
    },
    {
      key: 'employee',
      caption: '製表人',
      limit: 1,
    },
  ],
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
}: {
  className?: string;
  onPanelChange: (panel: TpanelList | undefined) => void;
}) {
  const router = useRouter();
  const query = router.query as Tquery;
  const { editCertifiedDocument, certifiedDocumentId } = query;
  const isNew = !certifiedDocumentId;

  // ---------------------------------------------------------------------------

  const ref_form = useRef<HTMLFormElement>(null!);

  // ---------------------------------------------------------------------------

  const [disabled, setDisabled] = useState(!isNew);
  const [state_showSelector, setState_showSelector] = useState(false);

  // ---------------------------------------------------------------------------

  const [state_activeReviewer, setState_activeReviewer] = useState<{
    guarantor: TemployeeDto | undefined;
    tabulator: TemployeeDto | undefined;
  }>({
    guarantor: undefined,
    tabulator: undefined,
  });

  // ---------------------------------------------------------------------------

  const inputGroupDefaultData = useMemo(() => {
    return {
      id: nanoid(),
      documentType: '',
      applicationDate: undefined,
      projectNumber: '',
      projectName: '',
      contractor: '',
      thisPeriodPrice: '',
      thisPeriodPayment: '',
      retainage: '',
      askForPaymentDate: undefined,
      loanDate: undefined,
    };
  }, [disabled]);

  const panelList = useMemo(() => {
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
        onClick: () => {
          const query_copy = { ...query };
          delete query_copy.editCertifiedDocument;
          delete query_copy.certifiedDocumentId;
          router.replace({
            query: query_copy,
          });
        },
      },
    ];

    if (isNew) {
      return panelList_new;
    }

    return undefined;
  }, [disabled, isNew]);

  const { control_signature, defaultSeletedDataArrArr } = useMemo(() => {
    const fakeArr = [
      {
        label: '總經理',
        className: 'w-[210px]',
      },
      {
        label: '擔保人',
        className: 'w-[210px]',
        value: state_activeReviewer.guarantor?.chName,
        onClick: () => setState_showSelector(true),
      },
      {
        label: '製表人',
        className: 'w-[210px]',
        value: state_activeReviewer.tabulator?.chName,
        onClick: () => setState_showSelector(true),
      },
    ];

    const defaultSeletedDataArrArr: Parameters<typeof Selector>[0]['defaultSeletedDataArrArr'] = [
      state_activeReviewer.guarantor ? [state_activeReviewer.guarantor] : [],
      state_activeReviewer.tabulator ? [state_activeReviewer.tabulator] : [],
    ];

    const control_signature = {
      signatureArr: fakeArr,
    };

    return {
      control_signature,
      defaultSeletedDataArrArr,
    };
  }, [state_activeReviewer]);

  // --------------------------------------------------------------------------

  const control_table = useControl_table();

  // --------------------------------------------------------------------------

  useEffect(() => {
    onPanelChange(panelList);

    return () => {
      onPanelChange(undefined);
    };
  }, [panelList]);

  // ---------------------------------------------------------------------------

  // ██████  ███████ ███    ██ ██████  ███████ ██████
  // ██   ██ ██      ████   ██ ██   ██ ██      ██   ██
  // ██████  █████   ██ ██  ██ ██   ██ █████   ██████
  // ██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
  // ██   ██ ███████ ██   ████ ██████  ███████ ██   ██
  return (
    <div className={classNames(className)}>
      {/* <button
        onClick={() => {
          const {
            documentType,
            applicationDate,
            projectNumber,
            projectName,
            contractor,
            thisPeriodPrice,
            thisPeriodPayment,
            retainage,
            askForPaymentDate,
            loanDate,
            //
            needToCreatedQty, //
            //
            description,
          } = ref_form.current;

          //

          // const list: { [key: string]: string } = {};

          // for (const value of needToCreatedQty) {
          //   list[value.id] = value.value;
          // }
        }}
      >
        test
      </button> */}

      <form ref={ref_form} className="w-[1100px] ml-10">
        {/* key 是為了重置元件，以替換進新的預設值 */}
        <InputGroup key={inputGroupDefaultData.id} defaultData={inputGroupDefaultData} />
        <Table01 className="mt-10" style={{ width: '100%' }} {...control_table} />

        <WrappedTextarea
          inputSelProps={{ caption: '說明' }}
          textareaProps={{
            props: {
              name: 'description',
              maxRows: 4,
              minRows: 4,
              // value: state_memorandum.description,
              // onChange: (e) => editStateMemorandum('description', e.target.value),
            },
          }}
        />

        <WrappedTextarea
          inputSelProps={{ caption: '備註' }}
          textareaProps={{
            props: {
              name: 'remark',
              maxRows: 6,
              minRows: 6,
              // value: state_memorandum.description,
              // onChange: (e) => editStateMemorandum('description', e.target.value),
            },
          }}
        />

        <SignatureBar
          className="mt-10 mb-10 w-fit"
          control={control_signature}
          style={{ justifyContent: 'flex-start', gap: '50px' }}
        />
      </form>
      <Selector
        showModal={state_showSelector}
        defaultSeletedDataArrArr={defaultSeletedDataArrArr}
        onConfirm={(arr) => {
          const guarantor = arr[0][0];
          const tabulator = arr[1][0];

          setState_activeReviewer({
            guarantor,
            tabulator,
          });
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
  defaultData,
}: {
  defaultData: {
    documentType: string;
    applicationDate: Moment | undefined;
    projectNumber: string;
    projectName: string;
    contractor: string;
    thisPeriodPrice: string;
    thisPeriodPayment: string;
    retainage: string;
    askForPaymentDate: Moment | undefined;
    loanDate: Moment | undefined;
  };
}) => {
  return (
    <Wrapper_inpuSel_01 className="w-[845px]">
      <InputSel
        name="documentType"
        caption="文件種類"
        selectProps={{
          props: {
            options: optionsCreator_certifyType(),
            defaultValue: defaultData.documentType
              ? {
                  value: defaultData.documentType,
                  label: defaultData.documentType,
                }
              : null,
            value: undefined,
            onChange: undefined,
          },
        }}
      />
      <InputSel
        name="applicationDate"
        caption="申請日期"
        datePickerProps={{
          props: {
            defaultValue: defaultData.applicationDate,
            // defaultValue: defaultData.applicationDate,
            // value: undefined,
            // onChange: undefined,
          },
        }}
      />
      <InputSel
        name="projectNumber"
        caption="工程編號"
        inputProps={{
          props: {
            defaultValue: defaultData.projectNumber,
            value: undefined,
            onChange: undefined,
          },
        }}
      />
      <InputSel
        name="projectName"
        caption="工程名稱"
        inputProps={{
          props: {
            defaultValue: defaultData.projectName,
            value: undefined,
            onChange: undefined,
          },
        }}
      />
      <InputSel
        name="contractor"
        caption="承包商"
        inputProps={{
          props: {
            defaultValue: defaultData.contractor,
            value: undefined,
            onChange: undefined,
          },
        }}
      />
      <InputSel
        name="thisPeriodPrice"
        caption="本期計價"
        inputProps={{
          props: {
            defaultValue: defaultData.thisPeriodPrice,
            value: undefined,
            onChange: undefined,
          },
        }}
      />
      <InputSel
        name="thisPeriodPayment"
        caption="本期請款"
        inputProps={{
          props: {
            defaultValue: defaultData.thisPeriodPayment,
            value: undefined,
            onChange: undefined,
          },
        }}
      />
      <InputSel
        name="retainage"
        caption="保留款"
        inputProps={{
          props: {
            defaultValue: defaultData.retainage,
            value: undefined,
            onChange: undefined,
          },
        }}
      />
      <InputSel
        name="askForPaymentDate"
        caption="請款日"
        datePickerProps={{
          props: {
            defaultValue: defaultData.askForPaymentDate,
            value: undefined,
            onChange: undefined,
          },
        }}
      />
      <InputSel
        name="loanDate"
        caption="放款日"
        datePickerProps={{
          props: {
            defaultValue: defaultData.loanDate,
            value: undefined,
            onChange: undefined,
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

const useControl_table = (): Ttable => {
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

    const rowArr = [
      {
        minHeight: tableConfig.row.minHeight,
        onClick: () => {},
        cellArr: [
          {
            children: 'aaa',
            ...cellConfig.itemName,
          },
          {
            children: 'aaa',
            ...cellConfig.size,
          },
          {
            children: 'aaa',
            ...cellConfig.doorModel,
          },
          {
            children: 'aaa',
            ...cellConfig.contractProdQty,
          },
          {
            children: 'aaa',
            ...cellConfig.createdQty,
          },
          {
            children: (
              <InputSel
                name="needToCreatedQty"
                inputProps={{
                  props: {
                    id: '0001',
                    defaultValue: undefined,
                    value: undefined,
                    onChange: undefined,
                  },
                }}
              />
            ),
            ...cellConfig.needToCreatedQty,
          },
        ],
      },
    ];

    const control_table: Ttable = {
      thead,
      tbody: {
        rowArr,
      },
      haveBorder: true,
    };

    return control_table;
    //
  }, []);

  return control_table;
};

// ==============================================================================

//  ██████  ██████  ███    ██ ███████ ██  ██████
// ██      ██    ██ ████   ██ ██      ██ ██
// ██      ██    ██ ██ ██  ██ █████   ██ ██   ███
// ██      ██    ██ ██  ██ ██ ██      ██ ██    ██
//  ██████  ██████  ██   ████ ██      ██  ██████

type TcellKeyArr =
  | 'itemName'
  //
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
    label: '總數量',
    width: 70,
    justifyContent: 'center',
  },
  needToCreatedQty: {
    label: '需開立數量',
    flex: 'auto',
    justifyContent: 'center',
  },
};
