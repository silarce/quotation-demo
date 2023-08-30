import { ReactNode } from 'react';
import classNames from 'classnames';

// css
import scss from './cellWithBar.module.scss';

export default function CellWithBar({
  children,
  isActive,
  className,
  onClick,
  divAttr,
}: {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
  divAttr?: React.HTMLAttributes<HTMLDivElement>;
}) {
  return (
    <div
      className={classNames(scss.container, isActive && scss.active, className)}
      //
      {...divAttr}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
