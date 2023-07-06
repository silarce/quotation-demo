import React from 'react';
import style from './loadingCover.module.scss';

import LoadingCover01 from './loadingCover01';

export default function LoadingCoverWrapper01({
  children,
  isLoading,
  size,
  className = '',
}: {
  children: React.ReactNode;
  isLoading: boolean;
  size?: number;
  className?: string;
}) {
  className = `${className} ${style.loadingCoverWrapper} `;

  return (
    <div className={className}>
      {children}
      <LoadingCover01 isLoading={isLoading} size={size} />
    </div>
  );
}
