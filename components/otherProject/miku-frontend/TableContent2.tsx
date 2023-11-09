import React from 'react';

export interface TableContentProps {
  value?: string;
  label?: string;
  height?: number;
  parentheses?: string;
  parenthesesColor?: string;
}

export const TableContent2 = ({
  value,
  label,
  height = 23,
  parentheses,
  parenthesesColor = 'text-red-500',
}: TableContentProps) => {
  return (
    <div className="flex items-center border-t border-black" style={{ height: height }}>
      {label && <div className="flex-1 flex items-center border-r border-black px-1">{label}</div>}

      <div className="flex-1 px-1">
        {value}
        {parentheses && <span className={parenthesesColor}>{`(${parentheses})`}</span>}
      </div>
    </div>
  );
};
