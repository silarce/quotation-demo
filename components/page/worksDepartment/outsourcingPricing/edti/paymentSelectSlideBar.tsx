import { useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

// gear
import TabCarousel02, { Tcontrol_tabCarousel } from 'components/page/worksDepartment/outsourcingPricing/tabCarousel02';

import { Tparams, useGetOutsourcing, useGetOutsourcingPayment } from 'js/api/api_outsourcing';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

export default function PaymentSelectSlideBar({
  className,
  targetOutsourcingId,
  onTabClick_outsourcing,
  targetPaymentId,
  onTabClick_date,
}: {
  className?: string;
  targetOutsourcingId: string;
  onTabClick_outsourcing: (id: string) => void;
  targetPaymentId: string | undefined;
  onTabClick_date: (date: string | undefined) => void;
}) {
  // -------------------------------------------------------------------------

  const [activeIndex_outsourcing, setActiveIndex_outsourcing] = useState<number>(-1);
  const [activeIndex_id, setActiveIndex_id] = useState<number>(-1);

  const [slideToIndex, setSlideToIndex] = useState<number>();
  const [slideToIndex_date, setSlideToIndex_date] = useState<number>();

  // -------------------------------------------------------------------------

  const params: Tparams = {
    // filter,
    sort: 'createdAt',
    order: 'DESC',
  };

  const {
    dataList: outsourcingList,
    viewRef_bottom,
    reset,
    nextPage,
    isLoading,
  } = useGetOutsourcing({ customParams: params });

  const outsourcingArr = useMemo(() => {
    return _.flatten(Object.values(outsourcingList)) as (typeof outsourcingList)[`${number}`];
  }, [outsourcingList]);

  // _______________________________________________________________

  const params_payment: Tparams = {
    filter: {
      outsourcingId: { $eq: targetOutsourcingId },
    },
    pageSize: 99999,
    sort: 'date',
    order: 'ASC',
  };

  const {
    //
    dataList: dataList_payment,
    reset: reset_payment,
  } = useGetOutsourcingPayment({ customParams: params_payment });

  const paymentArr = useMemo(() => {
    return _.flatten(Object.values(dataList_payment)) as (typeof dataList_payment)[`${number}`];
  }, [dataList_payment]);

  // -------------------------------------------------------------------------

  const { tabArr: tabArr_api, defaultActiveIndex } = useMemo(() => {
    let defaultActiveIndex = -1;

    const arr: Tcontrol_tabCarousel['tabArr'] = outsourcingArr.map((data, index) => {
      const viewRef = index === outsourcingArr.length - 1 ? viewRef_bottom : undefined;

      if (data.id === targetOutsourcingId) {
        defaultActiveIndex = index;
      }

      return {
        label: data.name,
        viewRef,
        // isActive: targetOutsourcingId === data.id,
        onClick: () => {
          onTabClick_outsourcing(data.id);
          setActiveIndex_outsourcing(index);
          setActiveIndex_id(-1);
        },
      };
    });

    return {
      tabArr: arr,
      defaultActiveIndex,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outsourcingArr]);

  const control_tabCarousel_api: Tcontrol_tabCarousel = {
    activeIndex: activeIndex_outsourcing,
    tabArr: tabArr_api,
  };

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------

  const { tabArr_date, defaultIndex_date } = useMemo(() => {
    let defaultIndex_date = -1;

    const dateArr = paymentArr.map((payment) => {
      return payment;
    });

    const arr: Tcontrol_tabCarousel['tabArr'] = dateArr.map((payment, index) => {
      const twDate = getTaiwanDateStr(payment.date);

      if (payment.id === targetPaymentId) {
        defaultIndex_date = index;
      }

      return {
        label: twDate ?? '',
        onClick: ({ ref_slider }) => {
          ref_slider.current.slickGoTo(index);
          onTabClick_date(payment.id);
        },
      };
    });

    return { tabArr_date: arr, defaultIndex_date };
  }, [paymentArr]);

  const control_tabCarousel: Tcontrol_tabCarousel = {
    activeIndex: activeIndex_id,
    tabArr: tabArr_date,
  };

  // -------------------------------------------------------------------------

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    reset_payment();
    onTabClick_date(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetOutsourcingId]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (defaultActiveIndex === -1) {
      nextPage();
    } else {
      setActiveIndex_outsourcing(defaultActiveIndex);
      setSlideToIndex(defaultActiveIndex);
    }
  }, [isLoading, defaultActiveIndex === -1]);

  useEffect(() => {
    if (defaultIndex_date !== -1) {
      setActiveIndex_id(defaultIndex_date);
      setSlideToIndex_date(defaultIndex_date);
    } else {
      if (!targetPaymentId) {
        onTabClick_date(paymentArr[0]?.id);
        setActiveIndex_id(0);
      }
    }
    //
  }, [paymentArr, defaultIndex_date === -1, targetPaymentId]);

  // -------------------------------------------------------------------------

  return (
    <div className={classNames(className)}>
      <TabCarousel02
        className={'mb-2'}
        control={control_tabCarousel_api}
        //
        // 只有在mount時觸發(以isShowVendorMonthList切換是否被mount)，
        // 藉以移動到在OutsourcingList選中的廠商
        // 在被渲染後，activeIndex不管怎麼改變，都不會再次觸發
        // onMount={({ ref_slider }) => {
        //   ref_slider.current.slickGoTo(activeIndex);
        // }}
        slideToIndex={slideToIndex}
      />
      <TabCarousel02
        className="min-h-[56px]"
        control={control_tabCarousel}
        theme="dashed"
        props={{
          arrows: false,
        }}
        slideToIndex={slideToIndex_date}
      />
    </div>
  );
}
