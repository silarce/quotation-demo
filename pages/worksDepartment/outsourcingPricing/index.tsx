// 這裡一系列的介面切換
// 其實都是同一個資料來源，不同的呈現方式

// 每個外包廠商每個月只會有一張外包計價單

// UX改善
// 關於tabBar，被選中者置中應該會比較好，方便使用者點擊上一個被選中者

import { useState, useEffect, useMemo, useRef } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { useRouter } from 'next/router';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';
import Table01, { Ttable } from 'components/global/gear/table/table01';
import DateCollapse, { Tcontrol_dateCollapse } from 'components/page/worksDepartment/outsourcingPricing/dateCollapse';
import TabCarousel02, {
  Tcontrol_tabCarousel,
  TimperativeHandle,
} from 'components/page/worksDepartment/outsourcingPricing/tabCarousel02';
import VendorMonthPanel from 'components/page/worksDepartment/outsourcingPricing/vendorMonthPanel';
import OutsourcingList from 'components/page/worksDepartment/outsourcingPricing/outsourcingList';
import DateList from 'components/page/worksDepartment/outsourcingPricing/dateList';

// css
import scss from './index.module.scss';

// api
import { Tparams, ToutsourcingDto, useGetOutsourcing, useGetOutsourcingPayment } from 'js/api/api_outsourcing';

// utils
import { getAllMonthByRange, getAllyearMonthListByRange } from 'js/utils/helpers/date/calcDate';

// ========================================================
type TfilterBy = 'vendor' | 'month';

type TcellConfig = {
  [key: string]: {
    label: string;
    width?: React.CSSProperties['width'];
    flex?: React.CSSProperties['flex'];
  };
};

// ========================================================

// MARK: START

export default function OutsourcingPricing() {
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

  // MARK: RENDER

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

// MARK: END

// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================

// ====================================================================

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

  const ref_carousel = useRef<TimperativeHandle>(null!);

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

  useEffect(() => {
    ref_carousel.current.slideToIndex(defaultCarouselIndex);
  }, []);

  // ----------------------------------------------------------------------
  return (
    <div className={classNames(className)}>
      <TabCarousel02 ref={ref_carousel} control={control_tabCarousel} />
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

// ====================================================================

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

//
//
//
//
export { generateMonthsSinceNow };

export type { TcellConfig };

export { tableConfig, cellCofig };
