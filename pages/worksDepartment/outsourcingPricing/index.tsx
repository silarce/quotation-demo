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
import MonthVendorPanel from 'components/page/worksDepartment/outsourcingPricing/monthVendorPanel';

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

  const showComponent = {
    vendor: targetOutsourcingId ? 'showVendorMonthList' : 'showVendorList',
    month: targetOutsourcingId ? 'showMonthVendorList' : 'showDateList',
  }[showListBy];

  // ------------------------------------------------------------------------

  const params: Tparams = {
    sort: 'createdAt',
    order: 'DESC',
  };

  const { dataArr: outsourcingArr, viewRef_bottom, reset } = useGetOutsourcing({ customParams: params });

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

  // ------------------------------------------------------------------------
  // MARK: useEffect

  useEffect(() => {
    reset();
  }, []);

  // ------------------------------------------------------------------------

  // MARK: RENDER

  return (
    <SubLayer bodyClassName={classNames(scss.subLayerBody, scss.plus)}>
      <PageHeader02 tagList={tagList} />
      <div>
        {showComponent === 'showVendorList' && (
          <OutsourcingList
            className={classNames('m-auto mb-5')}
            outsourcingArr={outsourcingArr}
            onRowClick={(outsourcingId: string) => {
              setTargetOutsourcingId(outsourcingId);
            }}
            viewRef_bottom={viewRef_bottom}
          />
        )}

        <DateList
          className={classNames('m-auto mb-5 mt-[40px]', showComponent !== 'showDateList' && 'hidden')}
          onCardClick={(dateStr) => {
            setTargetIsoDate(new Date(dateStr).toISOString());
          }}
        />

        {showComponent === 'showVendorMonthList' && (
          <VendorMonthPanel
            outsourcingArr={outsourcingArr}
            viewRef_bottom={viewRef_bottom}
            className={classNames('m-auto mb-5 mt-[40px]')}
            targetOutsourcingId={targetOutsourcingId}
            onTabClick={(outsourcingId) => {
              setTargetOutsourcingId(outsourcingId);
            }}
          />
        )}

        {showComponent === 'showMonthVendorList' && (
          <MonthVendorPanel
            targetDate={targetIsoDate}
            onDateTabClick={(isoString) => {
              setTargetIsoDate(isoString);
            }}
            className={classNames('m-auto mb-5 mt-[40px]')}
          />
        )}
      </div>
    </SubLayer>
  );
}

// MARK: END

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

export type { TcellConfig };

export { tableConfig, cellCofig };
