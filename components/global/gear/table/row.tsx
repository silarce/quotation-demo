import { forwardRef } from 'react';
import classNames from 'classnames';
import scss from './row.module.scss';

// ========================================================================
const Row_pre = (
  props: React.HTMLAttributes<HTMLDivElement> & {
    thead?: boolean;
    fullWidth?: boolean;
  },
  ref: React.Ref<HTMLDivElement>
) => {
  const { thead, fullWidth } = props;

  const attributes = {
    ...props,
  };

  delete attributes.thead;
  delete attributes.fullWidth;

  return (
    <div
      {...attributes}
      ref={ref}
      className={classNames(
        //
        scss.row,
        thead && scss.thead,
        fullWidth && scss.fullWidth,
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

const Cell = (
  props: React.HTMLAttributes<HTMLDivElement> & {
    preBuilt?: 'flex' | 'block' | 'unset';
    bgc?: 'gray' | 'white';
  }
) => {
  const { preBuilt = 'flex', bgc } = props;

  return (
    <div {...props} className={classNames(scss.cell, scss[preBuilt], bgc && scss[bgc], props.className)}>
      {props.children}
    </div>
  );
};

// ===================================================================

const Row = forwardRef(Row_pre);

// ===================================================================

type Tprops_row = Parameters<typeof Row>[0];
type Tprops_cell = Parameters<typeof Cell>[0];

// ===================================================================
export default Row;
export { Cell };
export type { Tprops_row, Tprops_cell };
