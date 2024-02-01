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

// icon
import { IconDetail, IconAddCircle, IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './edit.module.scss';

import { TemployeeDto } from 'js/api/dtoTypes';

//
// fakeData
import { fakeDataArr, fakeDataTempArr, generateMonthsSinceNow } from './index';
//

// ======================================================================

type TfakeData_amountToBeDeducted = {
  type: string;
  item: string;
  subTotal_invoice: number;
};

// ======================================================================
export default function OutsourcingPricingEdit() {
  const router = useRouter();

  // -------------------------------------------------------------------------
  const [disabled, setDisabled] = useState<boolean>(true);
  const [disabled_reviewer, setDisabled__reviewer] = useState<boolean>(true);

  // -------------------------------------------------------------------------
  const [manager, setManager] = useState<TemployeeDto>();
  const [supervisor, setSupervisor] = useState<TemployeeDto>();
  const [accounting, setAccounting] = useState<TemployeeDto>();
  const [checker, setChecker] = useState<TemployeeDto>();
  const [agent, setAgent] = useState<TemployeeDto>();

  // -------------------------------------------------------------------------

  // 接上api時要改為真實資料
  const data_amountToBeDeducted = fakeData_amountToBeDeducted;

  // -------------------------------------------------------------------------

  const [amountToBeDeducted, setAmountToBeDeducted] = useState<TfakeData_amountToBeDeducted[]>([]);

  // -------------------------------------------------------------------------

  useEffect(
    () => {
      // setManager();
      // setSupervisor();
      // setAccounting();
      // setChecker();
      // setAgent();
    },
    [
      // data
    ]
  );

  useEffect(() => {
    setAmountToBeDeducted(_.cloneDeep(data_amountToBeDeducted));
  }, [disabled]);

  // -------------------------------------------------------------------------

  const addAnmountToBeDeducted = () => {
    setAmountToBeDeducted((prev) => {
      return [...prev, create_emptyAmountToBeDeducted()];
    });
  };

  const deleteAnmountToBeDeducted = (index: number) => {
    setAmountToBeDeducted((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const editAnmountToBeDeducted = ({
    index,
    key,
    value,
  }: {
    index: number;
    key: keyof TfakeData_amountToBeDeducted;
    value: string;
  }) => {
    setAmountToBeDeducted((prev) => {
      const newArr = [...prev];

      if (key === 'subTotal_invoice') {
        newArr[index][key] = Number(value);
      } else {
        newArr[index][key] = value;
      }

      return newArr;
    });
  };

  // -------------------------------------------------------------------------

  const { control_table_project, subTotal_project } = useMemo(() => {
    let decimal_subTotal = new Decimal(0);
    const control_tbody: Ttable['tbody'] = (() => {
      const rowArr: Ttable['tbody']['rowArr'] = fakeData_projectArr.map((data, index) => {
        const { projectNumber, projectName, subTotal_invoice } = data;

        decimal_subTotal = decimal_subTotal.add(subTotal_invoice);

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
            children: subTotal_invoice.toLocaleString(),
            ...config_projectTable.subTotal_invoice.tbody,
          },
          {
            children: <IconDetail onClick={() => router.push('./detail')} />,
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
  }, []);

  // -------------------------------------------------------------------------

  const { control_table_amountToBeDeducted, subTotal_amountToBeDeducted } = useMemo(() => {
    //
    let decimal_subTotal = new Decimal(0);
    //
    const control_tbody: Ttable['tbody'] = (() => {
      //
      const rowArr: Ttable['tbody']['rowArr'] = amountToBeDeducted.map((data, index) => {
        const { type, item, subTotal_invoice } = data;

        decimal_subTotal = decimal_subTotal.add(subTotal_invoice);

        const inputWidth_type = config_amountToBeDeducted.type.inputWidth;
        const inputWidth_item = config_amountToBeDeducted.item.inputWidth;
        const inputWidth_subTotal_invoice = config_amountToBeDeducted.subTotal_invoice_enabled.inputWidth;

        const typeChildren = (
          <input
            value={type}
            onChange={(e) => {
              editAnmountToBeDeducted({ index, key: 'type', value: e.target.value });
            }}
            className={classNames(scss.inputInTable, !disabled && scss.enabled)}
            style={{ width: inputWidth_type }}
            readOnly={disabled}
          />
        );

        const itemChildren = (
          <input
            value={item}
            onChange={(e) => {
              editAnmountToBeDeducted({ index, key: 'item', value: e.target.value });
            }}
            className={classNames(scss.inputInTable, !disabled && scss.enabled)}
            style={{ width: inputWidth_item }}
            readOnly={disabled}
          />
        );

        const subTotal_invoiceChildren = (
          <input
            value={disabled ? subTotal_invoice.toLocaleString() : subTotal_invoice}
            onChange={(e) => {
              editAnmountToBeDeducted({ index, key: 'subTotal_invoice', value: e.target.value });
            }}
            type={disabled ? 'text' : 'number'}
            className={classNames(scss.inputInTable, !disabled && scss.enabled)}
            style={{ width: inputWidth_subTotal_invoice }}
            readOnly={disabled}
          />
        );

        const cellArr: Tcell[] = [
          {
            children: typeChildren,
            ...config_amountToBeDeducted.type,
          },
          {
            children: itemChildren,
            ...config_amountToBeDeducted.item,
          },
          {
            children: subTotal_invoiceChildren,
            ...(disabled
              ? config_amountToBeDeducted.subTotal_invoice.tbody
              : config_amountToBeDeducted.subTotal_invoice_enabled.tbody),
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
            ...config_amountToBeDeducted.btn_delete.tbody,
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
      control_table_amountToBeDeducted: control_table,
      subTotal_amountToBeDeducted: decimal_subTotal.toNumber(),
    };
  }, [amountToBeDeducted, disabled]);

  // -------------------------------------------------------------------------

  const { control_table_actualAmountReceived } = useMemo(() => {
    //

    // 本期保留10%
    const periodKeep = new Decimal(subTotal_project).mul(0.1).toNumber();
    // '上期保留10%'
    const latestPeriodKeep = new Decimal(fakeData_latestPeriodKeep.price).mul(0.1).toNumber();

    const subTotal = new Decimal(subTotal_project)
      .sub(periodKeep)
      .add(latestPeriodKeep)
      .sub(subTotal_amountToBeDeducted)
      .toNumber();

    const tax = new Decimal(subTotal).mul(0.05).toDecimalPlaces(0).toNumber();
    const actualAmountReceived = new Decimal(subTotal).add(tax).toNumber();

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
            children: periodKeep.toLocaleString(),
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
            children: subTotal_amountToBeDeducted.toLocaleString(),
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
    };
    //
  }, [subTotal_project, subTotal_amountToBeDeducted]);

  // -------------------------------------------------------------------------

  const control_processChain: Tcontrol_processChain = {
    statusArr: [
      {
        label: (
          <>
            <span className="inline-block mr-2">經辦</span>
            <span className="inline-block">王阿明</span>
          </>
        ),
        dotColor: 'green',
      },
      {
        label: (
          <>
            <span className="inline-block mr-2">核對</span>
            <span className="inline-block">王阿明</span>
          </>
        ),
        dotColor: 'red',
      },
      {
        label: (
          <>
            <span className="inline-block mr-2">會計</span>
            <span className="inline-block">王阿明</span>
          </>
        ),
        dotColor: 'red',
      },
      {
        label: (
          <>
            <span className="inline-block mr-2">主管</span>
            <span className="inline-block">王阿明</span>
          </>
        ),
        dotColor: 'red',
      },
      {
        label: (
          <>
            <span className="inline-block mr-2">核對</span>
            <span className="inline-block">王阿明</span>
          </>
        ),
        dotColor: undefined,
      },
    ],
  };

  // -------------------------------------------------------------------------

  const signatureArr: Tcontrol_signatureBar['signatureArr'] = [
    {
      label: '總經理',
      employee: manager,
      onChange: (employee) => {
        // setManager(employee);
      },
      disabled: true,
    },
    {
      label: '主管',
      employee: supervisor,
      onChange: (employee) => {
        setSupervisor(employee);
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
      label: '核對',
      employee: checker,
      onChange: (employee) => {
        setChecker(employee);
      },
    },
    {
      label: '經辦',
      employee: agent,
      onChange: (employee) => {
        setAgent(employee);
      },
    },
  ];

  const control_signatureBar: Tcontrol_signatureBar = { signatureArr };

  // -------------------------------------------------------------------------

  const panelList_disabled: TpanelList = [
    {
      type: 'redButton',
      label: '送審',
      onClick: () => {
        setDisabled__reviewer(false);
      },
    },
    {
      type: 'myButton',
      label: '編輯審核人員',
      onClick: () => {
        setDisabled__reviewer(false);
      },
    },
    {
      type: 'myButton',
      label: '新增工程',
      onClick: () => {},
    },
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
      onClick: () => {
        alert('test');
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

  const panelList = disabled ? panelList_disabled : panelList_enabled;

  // -------------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader02 tag="外包計價" panelList={panelList} />

      <div>
        <SlideBar className="mt-11" />
        <Table
          caption="工程列表"
          disabled={disabled}
          className="w-fit m-auto mt-[96px]"
          control={control_table_project}
          onAddClick={() => router.push('./detail')}
        />
        <Table
          caption="應扣明細"
          disabled={disabled}
          className="w-fit m-auto mt-[96px]"
          control={control_table_amountToBeDeducted}
          onAddClick={addAnmountToBeDeducted}
        />
        <Table caption="實領金額" className="w-fit m-auto mt-[96px]" control={control_table_actualAmountReceived} />
        {/*  */}
        <div className={classNames(!disabled_reviewer && 'hidden')}>
          <ProcessChain control={control_processChain} className={classNames('w-[1100px] m-auto mt-[80px]')} />
        </div>
        <div className={classNames(disabled_reviewer && 'hidden')}>
          <SignatureBar
            control={control_signatureBar}
            disabled={disabled_reviewer}
            className={classNames('w-[1100px] m-auto mt-[100px]')}
          />
        </div>
        {/*  */}
        <br />
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

const SlideBar = ({ className }: { className?: string }) => {
  const router = useRouter();

  // -------------------------------------------------------------------------
  const [activeTab_vendor, setActiveTab_vendor] = useState<number>(0);

  const tabArr_vendor: Tcontrol_tabCarousel['tabArr'] = useMemo(() => {
    const arr: Tcontrol_tabCarousel['tabArr'] = fakeDataTempArr.map((data, index) => {
      return {
        label: data.name,
        onClick: () => {
          setActiveTab_vendor(index);
        },
      };
    });

    return arr;
  }, []);

  const control_tabCarousel_vendor: Tcontrol_tabCarousel = {
    activeIndex: activeTab_vendor,
    tabArr: tabArr_vendor,
  };

  // -------------------------------------------------------------------------
  const [activeTab_date, setActiveTab_date] = useState<number>(0);

  const tabArr: Tcontrol_tabCarousel['tabArr'] = useMemo(() => {
    const dateList = generateMonthsSinceNow();

    let dateArr: string[] = []; //  [2020年1月,2020年2月,2020年3月]
    Object.entries(dateList).forEach(([year, monthArr]) => {
      monthArr.forEach((month) => {
        const twYear = String(Number(year) - 1911);
        dateArr.push(`${twYear}年${month}月`);
      });
    });

    dateArr = dateArr.reverse();

    const arr: Tcontrol_tabCarousel['tabArr'] = dateArr.map((date, index) => {
      return {
        label: date,
        onClick: ({ ref_slider }) => {
          setActiveTab_date(index);
          ref_slider.current.slickGoTo(index);
        },
      };
    });

    return arr;
  }, []);

  const control_tabCarousel: Tcontrol_tabCarousel = {
    activeIndex: activeTab_date,
    tabArr,
  };
  // -------------------------------------------------------------------------

  return (
    <div className={classNames(className)}>
      <TabCarousel02 control={control_tabCarousel_vendor} className="mb-2" />
      <TabCarousel02
        control={control_tabCarousel}
        theme="dashed"
        props={{
          arrows: false,
        }}
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
type Tconfig = {
  [key: string]: {
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

const config_amountToBeDeducted: Tconfig = {
  type: {
    width: 414,
    // flex: '1 0',
    justifyContent: 'center',
    inputWidth: 394,
  },
  item: {
    width: 414,
    // flex: '1 0',
    justifyContent: 'center',
    inputWidth: 394,
  },
  subTotal_invoice: {
    width: '270px',
    justifyContent: 'center',
    tbody: {
      width: '270px',
      justifyContent: 'flex-end',
    },
  },
  subTotal_invoice_enabled: {
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
      ...config_amountToBeDeducted.type,
    },
    {
      children: '項目',
      ...config_amountToBeDeducted.item,
    },
    {
      children: '請款小計',
      ...config_amountToBeDeducted.subTotal_invoice,
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

const fakeData_projectArr = [
  {
    projectNumber: 'M-110802',
    projectName: '后里拓凱',
    subTotal_invoice: 61960,
  },
  {
    projectNumber: 'M-110802',
    projectName: '環南市場',
    subTotal_invoice: 13010,
  },
  {
    projectNumber: 'M-110802',
    projectName: '元大人壽',
    subTotal_invoice: 5000,
  },
] as const;

const fakeData_amountToBeDeducted: TfakeData_amountToBeDeducted[] = [
  {
    type: '安裝物料',
    item: '項目一',
    subTotal_invoice: 1000,
  },
  {
    type: '保險',
    item: '團保',
    subTotal_invoice: 666,
  },
];

const fakeData_latestPeriodKeep = {
  price: 218350,
};

const create_emptyAmountToBeDeducted = (): TfakeData_amountToBeDeducted => ({
  type: '',
  item: '',
  subTotal_invoice: 0,
});
