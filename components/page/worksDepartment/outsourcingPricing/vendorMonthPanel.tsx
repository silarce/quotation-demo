import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import dayjs from 'dayjs';

import TabCarousel02, {
  Tcontrol_tabCarousel,
  TimperativeHandle,
} from 'components/page/worksDepartment/outsourcingPricing/tabCarousel02';
import DateCollapse, { Tcontrol_dateCollapse } from 'components/page/worksDepartment/outsourcingPricing/dateCollapse';

// api
import { Tparams, ToutsourcingDto, useGetOutsourcingPayment, ToutsourcingPaymentDto } from 'js/api/api_outsourcing';

// ======================================================================
// MARK:START

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
  const ref_carousel = useRef<TimperativeHandle>(null!);
  const [activeTabIndex_vendor, setActiveTabIndex_vendor] = useState<number>(0);

  // ----------------------------------------------------------------------

  const customParams: Tparams = {
    pageSize: 99999,
    filter: {
      outsourcingId: { $eq: targetOutsourcingId },
    },
  };

  const {
    dataArr: paymentArr,
    // isLoading,
    reset: reset_payment,
  } = useGetOutsourcingPayment({
    customParams,
  });

  // ----------------------------------------------------------------------

  const { tabArr, activeIndex } = useMemo(() => {
    let activeIndex = -1;

    const arr: Tcontrol_tabCarousel['tabArr'] = outsourcingArr.map((data, index) => {
      const viewRef = index === outsourcingArr.length - 1 ? viewRef_bottom : undefined;

      if (data.id === targetOutsourcingId) {
        setActiveTabIndex_vendor(index);
        activeIndex = index;
      }

      return {
        label: data.name,
        viewRef,
        // isActive: targetOutsourcingId === data.id,
        onClick: () => {
          setActiveTabIndex_vendor(index);
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
    activeIndex: activeTabIndex_vendor,
    tabArr,
  };
  // ----------------------------------------------------------------------

  const control_dateCollapse: Tcontrol_dateCollapse = useMemo(() => {
    const yearMonthList = getPaymentDateList(paymentArr);

    let panelArr: Tcontrol_dateCollapse['panelArr'] = Object.entries(yearMonthList).map(([year, monthList]) => {
      const twYear = String(Number(year) - 1911);

      const cardList = Object.entries(monthList).map(([month, paymentInfo]) => {
        const forbidden = !paymentInfo;

        return {
          label: `${month}月`,
          onClick: () => {
            if (forbidden) {
              return;
            }

            router.push({
              pathname: router.pathname + '/edit',
              query: {
                paymentId: paymentInfo?.id,
              },
            });
          },
          forbidden,
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

  // region: useEffect

  useEffect(() => {
    reset_payment();
  }, [targetOutsourcingId]);

  useEffect(() => {
    ref_carousel.current.slideToIndex(activeIndex);
  }, []);

  // endregion

  // ----------------------------------------------------------------------

  return (
    <div className={className}>
      <TabCarousel02 ref={ref_carousel} control={control_tabCarousel} />
      <DateCollapse className={classNames('m-auto mt-1')} control={control_dateCollapse} />
    </div>
  );
};

// MARK: END

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================

const getPaymentDateList = (paymentArr: ToutsourcingPaymentDto[]) => {
  const result: {
    [year: string]: {
      [month: string]: { id: string } | undefined;
    };
  } = {};

  paymentArr.forEach((payment) => {
    const date = dayjs(payment.date);

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

export default VendorMonthPanel;
