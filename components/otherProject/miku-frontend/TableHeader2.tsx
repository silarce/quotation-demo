import React from 'react';
import classNames from 'classnames';

export interface TableHeaderProps {
  title?: string;
  parentheses?: string;
  parenthesesColor?: string;
  className?: string;
}

export const TableHeader2 = ({
  title,
  parentheses,
  parenthesesColor = 'text-red-500',
  className,
}: TableHeaderProps) => {
  return (
    <div
      className={classNames(
        'flex justify-center items-center border-t-2 border-b border-black',

        className
      )}
      style={{ height: 23 }}
    >
      {title}
      {parentheses && <span className={parenthesesColor}>{`${parentheses}`}</span>}
    </div>
  );
};
