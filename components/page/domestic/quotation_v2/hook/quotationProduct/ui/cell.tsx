// icon
import { IconDelete01, IconCopy } from 'public/image/icon/svgComponent/svgIcons';
import iconReset from 'public/image/icon/reset.svg';
import iconChange from 'public/image/icon/change.svg';

import classNames from 'classnames';

// component
import {
  Tprops_cell,
  //
  Cell,
} from 'components/page/domestic/quotation_v2/quotationRow';

const Cell_indexNumber = ({ className, ...props }: Tprops_cell) => {
  return <Cell className={classNames(className, 'w-5')} {...props} />;
};

const Cell_delete = ({
  //
  onClick,
  className,
  ...props
}: Omit<Tprops_cell, 'children' | 'onClick'> & {
  onClick: () => void;
}) => {
  return (
    <Cell className={classNames('w-5 text-center', className)} {...props}>
      <IconDelete01 onClick={onClick} />
    </Cell>
  );
};

const Cell_copy = ({
  //
  onClick,
  className,
  ...props
}: Omit<Tprops_cell, 'children' | 'onClick'> & {
  onClick: () => void;
}) => {
  return (
    <Cell className={classNames('w-5 text-center', className)} {...props}>
      <IconCopy onClick={onClick} />
    </Cell>
  );
};

export { Cell_indexNumber, Cell_delete, Cell_copy };
