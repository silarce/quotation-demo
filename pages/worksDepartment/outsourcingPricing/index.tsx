import { useState, useEffect } from 'react';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import VendorMonthPanel from 'components/page/worksDepartment/outsourcingPricing/vendorMonthPanel';
import OutsourcingList from 'components/page/worksDepartment/outsourcingPricing/outsourcingList';
import DateList from 'components/page/worksDepartment/outsourcingPricing/dateList';
import MonthVendorPanel from 'components/page/worksDepartment/outsourcingPricing/monthVendorPanel';

// css
import scss from './index.module.scss';

// api
import { Tparams, useGetOutsourcing } from 'js/api/api_outsourcing';

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

        {showComponent === 'showDateList' && (
          <DateList
            className={classNames('m-auto mb-5 mt-[40px]')}
            onCardClick={(dateStr) => {
              setTargetIsoDate(new Date(dateStr).toISOString());
              setTargetOutsourcingId('true');
            }}
          />
        )}

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
