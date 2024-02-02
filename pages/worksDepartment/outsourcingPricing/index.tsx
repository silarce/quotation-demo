// 這裡一系列的介面切換
// 其實都是同一個資料來源，不同的呈現方式

import { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList, TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';
import Table01, { Ttable } from 'components/global/gear/table/table01';
import DateCollapse, { Tcontrol_dateCollapse } from 'components/page/worksDepartment/outsourcingPricing/dateCollapse';
import TabCarousel02, { Tcontrol_tabCarousel } from 'components/page/worksDepartment/outsourcingPricing/tabCarousel02';

// css
import scss from './index.module.scss';

// api
import {
  Tparams,
  ToutsourcingDto,
  ToutsourcingPaymentDto,
  useGetOutsourcing,
  useGetOutsourcingPayment,
} from 'js/api/api_outsourcing';

// ========================================================
type TfilterBy = 'vendor' | 'month';

// ========================================================
export default function OutsourcingPricing() {
  const router = useRouter();

  // ------------------------------------------------------------------------
  const [showListBy, setShowListBy] = useState<TfilterBy>('vendor');

  // const [isVendorMonth, setVendorMonth] = useState<string>();
  // const [isMonthVendor, setMonthVendor] = useState<`${number}-${number}`>();

  const [targetOutsourcingId, setTargetOutsourcingId] = useState<string>();
  const [targetDate, setTargetDate] = useState<string>();

  // ------------------------------------------------------------------------

  const isShowVendorList = showListBy === 'vendor' && !targetOutsourcingId;
  const isShowDateList = showListBy === 'month' && !targetDate;
  const isShowVendorMonthList = showListBy === 'vendor' && targetOutsourcingId;
  const isShowMonthVendorList = showListBy === 'month' && targetDate;

  // ------------------------------------------------------------------------

  const params: Tparams = {
    // filter,
    sort: 'createdAt',
    order: 'DESC',
  };

  const { dataArr: outsourcingArr, viewRef_bottom, reset } = useGetOutsourcing({ customParams: params });

  // ------------------------------------------------------------------------

  useEffect(() => {
    reset();
  }, []);

  // ------------------------------------------------------------------------
  const tagList: TtagList = [
    {
      label: '外包廠商',
      onClick: () => {
        setShowListBy('vendor');
        setTargetOutsourcingId(undefined);
        setTargetDate(undefined);
      },
    },
    {
      label: '月份排列',
      onClick: () => {
        setShowListBy('month');
        setTargetOutsourcingId(undefined);
        setTargetDate(undefined);
      },
    },
  ];

  return (
    <SubLayer bodyClassName={classNames(scss.subLayerBody, scss.plus)}>
      <PageHeader02 tagList={tagList} />
      <div>
        {/*  */}
        {isShowVendorList && (
          <OutsourcingList
            className={classNames('m-auto mb-5')}
            outsourcingArr={outsourcingArr}
            onRowClick={(outsourcingId: string) => {
              setTargetOutsourcingId(outsourcingId);
            }}
            viewRef_bottom={viewRef_bottom}
          />
        )}
        {/*  */}
        <DateList
          className={classNames('m-auto mb-5 mt-[40px]', !isShowDateList && 'hidden')}
          onCardClick={(dateStr) => {
            setTargetDate(dateStr);
          }}
        />

        {/*  */}
        {isShowVendorMonthList && (
          <VendorMonthPanel
            outsourcingArr={outsourcingArr}
            viewRef_bottom={isShowVendorMonthList ? viewRef_bottom : undefined}
            className={classNames('m-auto mb-5 mt-[40px]')}
            targetOutsourcingId={targetOutsourcingId}
            onTabClick={(outsourcingId) => {
              setTargetOutsourcingId(outsourcingId);
            }}
          />
        )}
        {/*  */}
        <MonthVendorPanel className={classNames('m-auto mb-5 mt-[40px]', !isShowMonthVendorList && 'hidden')} />
        {/*  */}
      </div>
    </SubLayer>
  );
}

// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================

const OutsourcingList = ({
  className,
  outsourcingArr,
  onRowClick,
  viewRef_bottom,
}: {
  className?: string;
  outsourcingArr: ToutsourcingDto[];
  onRowClick: (outsourcingId: string) => void;
  viewRef_bottom: (node?: Element | null | undefined) => void;
}) => {
  //
  const thead: Ttable['thead'] = {
    stickyTop: {
      top: '40px',
    },
    rowProps: {
      minHeight: tableConfig.row.minHeight,
    },
    cellArr: [
      {
        children: cellCofig.vendor.label,
        width: cellCofig.vendor.width,
      },
      {
        children: cellCofig.phoneNumber.label,
        width: cellCofig.phoneNumber.width,
        // flex: cellCofig.phoneNumber.flex,
      },
    ],
  };

  const rowArr: Ttable['tbody']['rowArr'] = useMemo(() => {
    return outsourcingArr.map((data, index) => {
      const viewRef = index === outsourcingArr.length - 5 ? viewRef_bottom : undefined;

      return {
        minHeight: tableConfig.row.minHeight,
        onClick: () => {
          onRowClick(data.id);
        },
        viewRef,
        cellArr: [
          {
            children: data.name,
            width: cellCofig.vendor.width,
          },
          {
            children: data.contactNumber,
            width: cellCofig.phoneNumber.width,
          },
        ],
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outsourcingArr]);

  const control_table: Ttable = {
    thead: thead,
    tbody: {
      rowArr,
    },
    haveBorder: false,
  };

  return (
    <Wrapper_tab
      className={classNames(className)}
      // className={classNames('m-auto mb-5', !isShowVendorList && 'hidden')}
      childrenOption={{
        noBorderTop: true,
      }}
      stickyTop={{
        top: 40,
      }}
    >
      <Table01 {...control_table} />
    </Wrapper_tab>
  );
};
//--------------------------------------------------------

const DateList = ({ className, onCardClick }: { className?: string; onCardClick: (dateString: string) => void }) => {
  const control_dateCollapse: Tcontrol_dateCollapse = useMemo(() => {
    const yearMonthList = generateMonthsSinceNow();

    let panelArr: Tcontrol_dateCollapse['panelArr'] = Object.entries(yearMonthList).map(([year, monthArr]) => {
      const twYear = String(Number(year) - 1911);

      const cardList = monthArr.map((month) => {
        return {
          label: `${month}月`,
          onClick: () => {
            onCardClick(`${year}-${month}`);
          },
        };
      });

      return {
        label: twYear,
        cardArr: cardList,
      };
    });

    panelArr = panelArr.reverse();

    return {
      panelArr,
    };
  }, []);

  return <DateCollapse className={classNames(className)} control={control_dateCollapse} />;
};

// ====================================================================

const VendorMonthPanel = ({
  //
  outsourcingArr,
  className,
  viewRef_bottom,
  targetOutsourcingId,
  onTabClick,
}: {
  outsourcingArr: ToutsourcingDto[];
  className?: string;
  viewRef_bottom?: (node?: Element | null | undefined) => void;
  targetOutsourcingId: string | undefined;
  onTabClick: (outsourcingId: string) => void;
}) => {
  const router = useRouter();

  // ----------------------------------------------------------------------
  const [activeTab_vendor, setActiveTab_vendor] = useState<number>(0);

  // ----------------------------------------------------------------------

  const filter = {
    outsourcingId: { $eq: targetOutsourcingId },
  };

  const params: Tparams = {
    pageSize: 99999,
    filter,
  };

  const {
    dataArr: paymentArr,
    isLoading,
    reset: reset_payment,
  } = useGetOutsourcingPayment({
    customParams: params,
  });

  useEffect(() => {
    reset_payment();
  }, [targetOutsourcingId]);

  // ----------------------------------------------------------------------

  const { tabArr, activeIndex } = useMemo(() => {
    let activeIndex = -1;

    const arr: Tcontrol_tabCarousel['tabArr'] = outsourcingArr.map((data, index) => {
      const viewRef = index === outsourcingArr.length - 1 ? viewRef_bottom : undefined;

      if (data.id === targetOutsourcingId) {
        setActiveTab_vendor(index);
        activeIndex = index;
      }

      return {
        label: data.name,
        viewRef,
        // isActive: targetOutsourcingId === data.id,
        onClick: () => {
          setActiveTab_vendor(index);
          onTabClick(data.id);
        },
      };
    });

    return {
      tabArr: arr,
      activeIndex,
    };
  }, [outsourcingArr]);

  const control_tabCarousel: Tcontrol_tabCarousel = {
    activeIndex: activeTab_vendor,
    tabArr,
  };
  // ----------------------------------------------------------------------

  const control_dateCollapse: Tcontrol_dateCollapse = useMemo(() => {
    const yearMonthList = getPaymentDateList(paymentArr);

    let panelArr: Tcontrol_dateCollapse['panelArr'] = Object.entries(yearMonthList).map(([year, monthList]) => {
      const twYear = String(Number(year) - 1911);

      const cardList = Object.entries(monthList).map(([month, paymentInfo]) => {
        return {
          label: `${month}月`,
          onClick: () => {
            router.push({
              pathname: router.pathname + '/edit',
              query: {
                paymentId: paymentInfo?.id,
              },
            });
          },
          forbidden: !paymentInfo,
        };
      });

      return {
        label: twYear,
        cardArr: cardList,
      };
    });

    panelArr = panelArr.reverse();

    return {
      panelArr,
    };
  }, [paymentArr]);

  // ----------------------------------------------------------------------

  return (
    <div className={className}>
      <TabCarousel02
        control={control_tabCarousel}
        //
        // 只有在mount時觸發(以isShowVendorMonthList切換是否被mount)，
        // 藉以移動到在OutsourcingList選中的廠商
        // 在被渲染後，activeIndex不管怎麼改變，都不會再次觸發
        onMount={({ ref_slider }) => {
          ref_slider.current.slickGoTo(activeIndex);
        }}
      />
      <DateCollapse className={classNames('m-auto mt-1')} control={control_dateCollapse} />
    </div>
  );
};

const MonthVendorPanel = ({ className }: { className?: string }) => {
  const router = useRouter();

  // ----------------------------------------------------------------------

  const [activeTab_vendor, setActiveTab_vendor] = useState<number>(0);

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
          setActiveTab_vendor(index);
          ref_slider.current.slickGoTo(index);
        },
      };
    });

    return arr;
  }, []);

  const control_tabCarousel: Tcontrol_tabCarousel = {
    activeIndex: activeTab_vendor,
    tabArr,
  };

  // ----------------------------------------------------------------------

  const control_table: Ttable['tbody']['rowArr'] = useMemo(() => {
    return fakeDataArr.map((data) => {
      return {
        minHeight: tableConfig.row.minHeight,
        onClick: () => {
          router.push({
            pathname: router.pathname + '/edit',
          });
        },
        cellArr: [
          {
            children: data.name,
            width: cellCofig.vendor.width,
          },
          {
            children: data.phoneNumber,
            width: cellCofig.phoneNumber.width,
          },
        ],
      };
    });
  }, []);

  const fakeTable: Ttable = {
    thead: fakeThead,
    tbody: {
      rowArr: control_table,
    },
    haveBorder: false,
  };

  // ----------------------------------------------------------------------
  return (
    <div className={classNames(className)}>
      <TabCarousel02 control={control_tabCarousel} />
      <Wrapper_tab
        className={classNames('m-auto')}
        childrenOption={{
          noBorderTop: true,
        }}
        stickyTop={{
          top: 40,
        }}
      >
        <Table01 {...fakeTable} />
      </Wrapper_tab>
    </div>
  );
};

// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================

function generateRandomDate(): string {
  const start = moment().year(2022).startOf('year');
  const end = moment().year(2024).endOf('year');
  const randomDate = start.add(Math.random() * end.diff(start));

  return randomDate.toISOString();
}

const fakeDataTempArr = [
  {
    name: '王小名',
    phoneNumber: '0928-777-777',
  },
  {
    name: '林小美',
    phoneNumber: '0928-666-666',
  },
  {
    name: '陳小華',
    phoneNumber: '0928-555-555',
  },
  {
    name: '張小英',
    phoneNumber: '0928-444-444',
  },
  {
    name: '黃小強',
    phoneNumber: '0928-333-333',
  },
  {
    name: '很長的名字很長的名字很長的名字',
    phoneNumber: '0911-123-123',
  },
  {
    name: '陳喵喵',
    phoneNumber: '0911-111-111',
  },
  {
    name: '林汪汪',
    phoneNumber: '0911-111-222',
  },
  {
    name: '嗚呼呼',
    phoneNumber: '0911-111-456',
  },
  {
    name: '屋咪茂',
    phoneNumber: '0911-111-888',
  },
];

const getRandomItem = () => {
  const index = Math.floor(Math.random() * fakeDataTempArr.length);

  return fakeDataTempArr[index];
};

// ====================================================================

type TcellConfig = {
  [key: string]: {
    label: string;
    width?: React.CSSProperties['width'];
    flex?: React.CSSProperties['flex'];
  };
};

const tableConfig = {
  row: {
    minHeight: '40px',
  },
};

const cellCofig: TcellConfig = {
  vendor: {
    label: '外包廠商',
    width: '160px',
  },
  phoneNumber: {
    label: '連絡電話',
    width: '180px',
    // flex: 'auto',
  },
};

const fakeThead: Ttable['thead'] = {
  stickyTop: {
    top: '40px',
  },
  rowProps: {
    minHeight: tableConfig.row.minHeight,
  },
  cellArr: [
    {
      children: cellCofig.vendor.label,
      width: cellCofig.vendor.width,
    },
    {
      children: cellCofig.phoneNumber.label,
      width: cellCofig.phoneNumber.width,
      // flex: cellCofig.phoneNumber.flex,
    },
  ],
};

type TfakeData = {
  id: string;
  name: string;
  phoneNumber: string;
  date: string;
};

const fakeDataArr: TfakeData[] = [
  // 生成30筆，id要依序
  ...Array.from({ length: 30 }, (v, index) => ({
    id: `${index}`,
    // name: '王小名',
    // phoneNumber: '0928-777-777',
    name: getRandomItem().name,
    phoneNumber: getRandomItem().phoneNumber,
    date: generateRandomDate(),
  })),
];

// ====================================================================

function generateMonthsSinceNow(): { [key: `${number}`]: number[] } {
  const currentYear = new Date().getFullYear();
  const result: { [key: string]: number[] } = {};

  for (let year = 2020; year <= currentYear; year++) {
    result[year.toString()] = Array.from({ length: 12 }, (_, i) => i + 1);
  }

  return result;
}

const getPaymentDateList = (paymentArr: ToutsourcingPaymentDto[]) => {
  const result: {
    [year: string]: {
      [month: string]: { id: string } | undefined;
    };
  } = {};

  paymentArr.forEach((payment) => {
    const date = moment(payment.date);
    const year = date.year().toString();
    const month = date.month().toString();

    if (!result[year]) {
      result[year] = {
        '1': undefined,
        '2': undefined,
        '3': undefined,
        '4': undefined,
        '5': undefined,
        '6': undefined,
        '7': undefined,
        '8': undefined,
        '9': undefined,
        '10': undefined,
        '11': undefined,
        '12': undefined,
      };
    }

    result[year][month] = { id: payment.id };
  });

  return result;
}; // getPaymentDateList

//
//
//
//
export { fakeDataArr, generateMonthsSinceNow, fakeDataTempArr };
