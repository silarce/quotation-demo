import React from 'react';

export interface TableHeaderProps {
  title?: string;
}

export const TableHeader4 = ({ title }: TableHeaderProps) => {
  return (
    <div className="flex justify-center items-center border-t-4 border-b border-black" style={{ height: 23 }}>
      {title}
    </div>
  );
};
