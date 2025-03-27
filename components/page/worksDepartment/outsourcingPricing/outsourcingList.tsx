import { useMemo } from 'react';
import classNames from 'classnames';

import Table01, { Ttable } from 'components/global/gear/table/table01';
import Wrapper_tab from 'components/global/gear/wrapper_tab/wrapper_tab01';

import type { ToutsourcingDto } from 'js/api/dtoTypes';

import { tableConfig, cellCofig } from 'pages/worksDepartment/outsourcingPricing';

// ===============================================================

// ===============================================================
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

// ==============================================================

export default OutsourcingList;
