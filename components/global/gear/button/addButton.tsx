// icon
import iconAdd from 'public/image/icon/add.svg';

import style from './_button.module.scss';

export default function AddButton({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button className={`${style.addButton} ${className || ''}`} onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={iconAdd.src} alt="add" />
      <span>{label}</span>
    </button>
  );
}
