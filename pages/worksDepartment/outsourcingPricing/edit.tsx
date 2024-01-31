import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import Decimal from 'decimal.js';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList, TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';
import Table01, { Ttable, Tcell } from 'components/global/gear/table/table01';
import DateCollapse, { Tcontrol_dateCollapse } from 'components/page/worksDepartment/outsourcingPricing/dateCollapse';
import TabCarousel02, { Tcontrol_tabCarousel } from 'components/page/worksDepartment/outsourcingPricing/tabCarousel02';

// icon
import { IconDetail } from 'public/image/icon/svgComponent/svgIcons';

// css
import scss from './edit.module.scss';

//
// fakeData
import { fakeDataArr, fakeDataTempArr, generateMonthsSinceNow } from './index';
//

// ======================================================================
export default function OutsourcingPricingEdit() {
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
            children: <IconDetail onClick={() => alert('test')} />,
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
    let decimal_subTotal = new Decimal(0);
    const control_tbody: Ttable['tbody'] = (() => {
      const rowArr: Ttable['tbody']['rowArr'] = fakeData_amountToBeDeducted.map((data, index) => {
        const { type, item, subTotal_invoice } = data;

        decimal_subTotal = decimal_subTotal.add(subTotal_invoice);

        const cellArr: Tcell[] = [
          {
            children: type,
            ...config_amountToBeDeducted.type,
          },
          {
            children: item,
            ...config_amountToBeDeducted.item,
          },
          {
            children: subTotal_invoice.toLocaleString(),
            ...config_amountToBeDeducted.subTotal_invoice,
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
      thead: thead_amountToBeDeducted,
      tbody: control_tbody,
      haveBorder: true,
    };

    return {
      control_table_amountToBeDeducted: control_table,
      subTotal_amountToBeDeducted: decimal_subTotal.toNumber(),
    };
  }, []);

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
  return (
    <SubLayer>
      <PageHeader02 tag="外包計價" />

      <div>
        <SlideBar className="mt-11" />
        <Table caption="工程列表" className="w-fit m-auto mt-[96px]" control={control_table_project} />
        <Table caption="應扣明細" className="w-fit m-auto mt-[96px]" control={control_table_amountToBeDeducted} />
        <Table caption="實領金額" className="w-fit m-auto mt-[96px]" control={control_table_actualAmountReceived} />
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
const Table = ({ caption, control, className }: { caption: string; control: Ttable; className?: string }) => {
  return (
    <div className={classNames(className)}>
      <p className={scss.tableCaption}>{caption}</p>
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
    flex: '1 0',
    justifyContent: 'center',
  },
  item: {
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

const fakeData_amountToBeDeducted = [
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
] as const;

const fakeData_latestPeriodKeep = {
  price: 218350,
};
