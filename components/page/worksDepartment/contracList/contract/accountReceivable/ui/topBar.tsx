import classNames from 'classnames';
import scss from './topBar.module.scss';

export default function TopBar({
  className,
  caption,
  children,
}: {
  className?: string;
  caption?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={classNames(scss.topBar, className)}>
      {caption !== undefined && <div className={scss.tab}>{caption}</div>}
      {children}
    </div>
  );
}
