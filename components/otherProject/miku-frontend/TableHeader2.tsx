import React from 'react';

export interface TableHeaderProps {
  title?: string;
  parentheses?: string;
  parenthesesColor?: string;
}

export const TableHeader2 = ({ title, parentheses, parenthesesColor = 'text-red-500' }: TableHeaderProps) => {
  return (
    <div className="flex justify-center items-center border-t-2 border-b border-black" style={{ height: 23 }}>
      {title}
      {parentheses && <span className={parenthesesColor}>{`${parentheses}`}</span>}
    </div>
  );
};
