import style from './_button.module.scss';

export default function RedButton({
  label,
  onClick,
  className,
  img,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  img?: string;
}) {
  return (
    <button className={`${style.redButton} ${className || ''}`} onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {img && <img src={img} alt="" />}
      <span>{label}</span>
    </button>
  );
}
