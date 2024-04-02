// 這裡一系列的介面切換
// 其實都是同一個資料來源，不同的呈現方式

// 每個外包廠商每個月只會有一張外包計價單

// UX改善
// 關於tabBar，被選中者置中應該會比較好，方便使用者點擊上一個被選中者

import { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList, TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';
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

// utils
import { getAllMonthByRange, getAllyearMonthListByRange } from 'js/utils/helpers/date/calcDate';

// ========================================================
type TfilterBy = 'vendor' | 'month';

// ========================================================
export default function OutsourcingPricing() {
  // ------------------------------------------------------------------------
  const [showListBy, setShowListBy] = useState<TfilterBy>('vendor');

  const [targetOutsourcingId, setTargetOutsourcingId] = useState<string>();
  const [targetIsoDate, setTargetIsoDate] = useState<string>();

  // ------------------------------------------------------------------------

  const isShowVendorList = showListBy === 'vendor' && !targetOutsourcingId;
  const isShowDateList = showListBy === 'month' && !targetIsoDate;
  const isShowVendorMonthList = showListBy === 'vendor' && targetOutsourcingId;
  const isShowMonthVendorList = showListBy === 'month' && targetIsoDate;

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
        setTargetIsoDate(undefined);
      },
    },
    {
      label: '月份排列',
      onClick: () => {
        setShowListBy('month');
        setTargetOutsourcingId(undefined);
        setTargetIsoDate(undefined);
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
            setTargetIsoDate(new Date(dateStr).toISOString());
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
        {isShowMonthVendorList && (
          <MonthVendorPanel
            targetDate={targetIsoDate}
            onDateTabClick={(isoString) => {
              setTargetIsoDate(isoString);
            }}
            className={classNames('m-auto mb-5 mt-[40px]')}
          />
        )}
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
  const params: Tparams = {
    sort: 'date',
    order: 'ASC',
  };

  const { dataArr, reset } = useGetOutsourcingPayment({ customParams: params });

  const oldestDate = dataArr[0]?.date;

  useEffect(() => {
    reset();
  }, []);

  // ----------------------------------------------------------------------
  const control_dateCollapse: Tcontrol_dateCollapse = useMemo(() => {
    const yearMonthList = getAllyearMonthListByRange({
      start: oldestDate,
      end: undefined,
    });

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

const MonthVendorPanel = ({
  //
  targetDate,
  className,
  onDateTabClick,
}: {
  targetDate: string | undefined;
  className?: string;
  onDateTabClick: (isoString: string) => void;
}) => {
  const router = useRouter();

  // ----------------------------------------------------------------------
  const [activeTab_date, setActiveTab_date] = useState<number>(0);

  // ----------------------------------------------------------------------

  const monthStart = moment(targetDate).startOf('month').toISOString();
  const monthEnd = moment(targetDate).endOf('month').toISOString();

  const filter = {
    date: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  };

  const params: Tparams = {
    pageSize: 99999,
    filter,
  };

  const { dataArr: paymentArr, reset: reset_payment } = useGetOutsourcingPayment({ customParams: params });

  // ----------------------------------------------------------------------

  useEffect(() => {
    reset_payment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  // ----------------------------------------------------------------------

  const { tabArr, defaultCarouselIndex } = useMemo(() => {
    //
    const dateArr = getAllMonthByRange({
      start: 2022,
      end: undefined,
    }).reverse();

    let defaultCarouselIndex = -1;

    const tabArr: Tcontrol_tabCarousel['tabArr'] = dateArr.map((date, index) => {
      const twDate = moment(date).subtract(1911, 'years');

      if (date === moment(targetDate).format('yy-MM')) {
        defaultCarouselIndex = index;
        setActiveTab_date(index);
      }

      return {
        label: twDate.format('yy-MM'),
        onClick: ({ ref_slider }) => {
          setActiveTab_date(index);
          ref_slider.current.slickGoTo(index);
          const theDate = moment(date);
          onDateTabClick(theDate.toISOString());
        },
      };
    });

    return { tabArr, defaultCarouselIndex };
  }, []);

  const control_tabCarousel: Tcontrol_tabCarousel = {
    activeIndex: activeTab_date,
    tabArr,
  };

  // ----------------------------------------------------------------------

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
      },
    ],
  };

  const control_rowArr: Ttable['tbody']['rowArr'] = useMemo(() => {
    return paymentArr.map((paymentInfo) => {
      const { outsourcing } = paymentInfo;

      return {
        minHeight: tableConfig.row.minHeight,
        onClick: () => {
          router.push({
            pathname: router.pathname + '/edit',
            query: {
              paymentId: paymentInfo?.id,
            },
          });
        },
        cellArr: [
          {
            children: outsourcing.name,
            width: cellCofig.vendor.width,
          },
          {
            children: outsourcing.contactNumber,
            width: cellCofig.phoneNumber.width,
          },
        ],
      };
    });
  }, [paymentArr]);

  const control_table: Ttable = {
    thead: thead,
    tbody: {
      rowArr: control_rowArr,
    },
    haveBorder: false,
  };

  // ----------------------------------------------------------------------
  return (
    <div className={classNames(className)}>
      <TabCarousel02
        control={control_tabCarousel}
        onMount={({ ref_slider }) => {
          ref_slider.current.slickGoTo(defaultCarouselIndex);
        }}
      />
      <Wrapper_tab
        className={classNames('m-auto')}
        childrenOption={{
          noBorderTop: true,
        }}
        stickyTop={{
          top: 40,
        }}
      >
        <Table01 {...control_table} />
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
    // width: '180px',
    flex: 'auto',
  },
};

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
    const month = (date.month() + 1).toString();

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
export {
  VendorMonthPanel,
  //
  generateMonthsSinceNow,
};
