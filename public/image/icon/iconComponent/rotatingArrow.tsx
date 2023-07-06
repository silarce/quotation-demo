import { useEffect } from 'react';

import style from './iconComponent.module.scss';

export const RotatingArrow01 = ({
  className = '',
  deg,
  isActive,
  defaultDeg,
}: {
  className?: string;
  deg: number;
  isActive: boolean;
  defaultDeg?: number;
}) => {
  className = `${className} ${style.svg} ${style.transition}`;

  const transform = `rotate(${isActive ? deg : defaultDeg ? defaultDeg : 0}deg)`;
  const theStyle = { transform };

  return (
    <svg
      className={className}
      style={theStyle}
      width="11"
      height="13"
      viewBox="0 0 11 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 4L5.5 9L10 4" stroke="#404040" />
    </svg>
  );
};
