import { forwardRef } from 'react';
import classNames from 'classnames';
import scss from './row.module.scss';

// ========================================================================
const Row_pre = (
  props: React.HTMLAttributes<HTMLDivElement> & {
    thead?: boolean;
    fullWidth?: boolean;
    preStyle?: 'style01';
    sticky?: 'top' | 'bottom';
    gap?: boolean;
  },
  ref: React.Ref<HTMLDivElement>
) => {
  const { thead, fullWidth, preStyle, sticky, gap = true, ...restProps } = props;

  const attributes = {
    ...restProps,
  };

  return (
    <div
      {...attributes}
      ref={ref}
      className={classNames(
        //
        scss.row,
        preStyle && scss[preStyle],
        thead && scss.thead,
        fullWidth && scss.fullWidth,
        sticky === 'top' && scss.stickyTop,
        sticky === 'bottom' && scss.stickyBottom,
        gap && scss.gap,
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

const Cell = ({
  preBuilt = 'flex',
  bgc,
  justifyContent = 'center',
  alignItems = 'center',
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  preBuilt?: 'flex' | 'block' | 'unset';
  bgc?: 'gray' | 'white';
  justifyContent?: 'center' | 'flex-start' | 'flex-end';
  alignItems?: 'center' | 'flex-start' | 'flex-end';
}) => {
  return (
    <div
      className={classNames(
        //
        scss.cell,
        scss[preBuilt],
        bgc && scss[bgc],
        scss[`justifyContent-${justifyContent}`],
        scss[`alignItems-${alignItems}`],
        className
      )}
      {...rest}
    >
      {children}
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
