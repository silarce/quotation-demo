import React, { CSSProperties } from 'react';
import classNames from 'classnames';

export interface TableContentProps {
  value?: React.ReactNode;
  label?: React.ReactNode;
  height?: CSSProperties['height'];
  parentheses?: string;
  parenthesesColor?: string;
  className?: string;
}

export const TableContent2 = ({
  value,
  label,
  height = 23,
  parentheses,
  parenthesesColor = 'text-red-500',
  className,
}: TableContentProps) => {
  return (
    <div className={classNames('flex items-center border-t border-black', className)} style={{ height: height }}>
      {label && <div className="flex-1 flex items-center border-r border-black px-1">{label}</div>}

      <div className="flex-1 px-1">
        {value}
        {parentheses && <span className={parenthesesColor}>{`(${parentheses})`}</span>}
      </div>
    </div>
  );
};
