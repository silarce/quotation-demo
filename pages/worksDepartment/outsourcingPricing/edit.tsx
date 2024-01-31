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

  // -------------------------------------------------------------------------
  return (
    <SubLayer>
      <PageHeader02 tag="外包計價" />

      <div>
        <SlideBar className="mt-11" />
        <ProjecTable className="w-fit m-auto mt-5" />
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

//  工程列表

const ProjecTable = ({ className }: { className?: string }) => {
  //
  const control_tbody: Ttable['tbody'] = useMemo(() => {
    let decimal_subTotal = new Decimal(0);

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

    //
  }, []);

  const control_table: Ttable = {
    thead: thead_projectTable,
    tbody: control_tbody,
    haveBorder: true,
  };

  return (
    <div className={classNames(className)}>
      <Table01 {...control_table} />
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
    flex: '1',
    justifyContent: 'center',
  },
  projectName: {
    flex: '1',
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
      children: '發票小計',
      ...config_projectTable.subTotal_invoice,
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
];
