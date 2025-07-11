// css
import style from './checkbox.module.scss';

import checkIcon from 'public/image/icon/check.svg?url';

export default function Checkbox01({
  stateValue,
  onClick,
  className,
  cursor,
  disabled,
}: {
  stateValue: boolean;
  onClick?: () => void;
  className?: string;
  cursor?: string;
  disabled?: boolean;
}) {
  const theStyle = {
    cursor: disabled ? 'auto' : cursor ? cursor : undefined,
  };

  return (
    <div className={`${style.checkbox01} ${className}`} style={theStyle} onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {stateValue && <img src={checkIcon.src} alt="" />}
    </div>
  );
}
