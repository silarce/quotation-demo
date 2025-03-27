import classNames from 'classnames';

import Row, { Cell } from 'components/global/gear/table/row';

import type { ToutsourcingDto } from 'js/api/dtoTypes';

import { cellCofig } from 'pages/worksDepartment/outsourcingPricing';
import scss from './outsourcingList.module.scss';

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

  const style_vendor = {
    width: cellCofig.vendor.width,
    flex: cellCofig.vendor.flex,
  };

  const style_phoneNumber = {
    width: cellCofig.phoneNumber.width,
    flex: cellCofig.phoneNumber.flex,
  };

  return (
    <div className={classNames(scss.table, className)}>
      <Row thead={true} fullWidth={true} className={scss.thead}>
        <Cell style={style_vendor}>{cellCofig.vendor.label}</Cell>
        <Cell style={style_phoneNumber}>{cellCofig.phoneNumber.label}</Cell>
      </Row>
      {outsourcingArr.map(({ id, name, contactNumber }, index) => {
        const viewRef = index === outsourcingArr.length - 5 ? viewRef_bottom : undefined;

        return (
          <Row
            key={id}
            ref={viewRef}
            className="hover:bg-hoverBgc cursor-pointer"
            fullWidth={true}
            onClick={() => {
              onRowClick(id);
            }}
          >
            <Cell style={style_vendor} className="border-r-[1px] border-border">
              {name}
            </Cell>
            <Cell style={style_phoneNumber}>{contactNumber}</Cell>
          </Row>
        );
      })}
    </div>
  );
};

// ==============================================================

export default OutsourcingList;
