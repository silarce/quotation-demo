import { useState, useEffect, useMemo, useRef } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useRouter } from 'next/router';

// component
import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';
import Table01, { Ttable } from 'components/global/gear/table/table01';
import TabCarousel02, {
  Tcontrol_tabCarousel,
  TimperativeHandle,
} from 'components/page/worksDepartment/outsourcingPricing/tabCarousel02';

// api
import { Tparams, useGetOutsourcingPayment } from 'js/api/api_outsourcing';

// utils
import { getAllMonthByRange } from 'js/utils/helpers/date/calcDate';

import { tableConfig, cellCofig } from 'pages/worksDepartment/outsourcingPricing';

// =========================================================================
// MARK:START
const MonthVendorPanel = ({
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

  const params: Tparams = {
    pageSize: 99999,
    filter: {
      date: {
        $gte: dayjs(targetDate).startOf('month').toISOString(),
        $lte: dayjs(targetDate).endOf('month').toISOString(),
      },
    },
  };

  const { dataArr: paymentArr, reset: reset_payment } = useGetOutsourcingPayment({ customParams: params });

  // ----------------------------------------------------------------------

  const { tabArr, defaultCarouselIndex } = useMemo(() => {
    //
    const dateArr = getAllMonthByRange({
      start: new Date('2022/01/01'),
      end: new Date(),
    }).reverse();

    let defaultCarouselIndex = -1;

    const tabArr: Tcontrol_tabCarousel['tabArr'] = dateArr.map((date, index) => {
      const twDate = dayjs(date).subtract(1911, 'years');

      if (date === dayjs(targetDate).format('yy-MM')) {
        defaultCarouselIndex = index;
        setActiveTab_date(index);
      }

      return {
        label: twDate.format('yy-MM'),
        onClick: ({ ref_slider }) => {
          setActiveTab_date(index);
          ref_slider.current.slickGoTo(index);
          const theDate = dayjs(date);
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

  // MARK: useEffect

  useEffect(() => {
    reset_payment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

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

export default MonthVendorPanel;
