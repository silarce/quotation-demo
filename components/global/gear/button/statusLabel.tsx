import classNames from 'classnames';

import scss from './statusLabel.module.scss';

// =================================================================
type TstatusLabelProps = {
  label: React.ReactNode;
  dotColor?: 'green' | 'red' | 'gray';
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
};

export type { TstatusLabelProps };

// =================================================================

export default function StatusLabel({ label, dotColor = 'gray', className, style, onClick }: TstatusLabelProps) {
  return (
    <div className={classNames(scss.step, scss[dotColor], className)} style={style} onClick={onClick}>
      <div className={classNames(scss.spot)} />
      <span>{label}</span>
    </div>
  );
}
