import { MouseEvent } from 'react';
import classNames from 'classnames';

// css
import scss from './pageHeader02.module.scss';

/** 單一tag */
export default function Tag({
  tag,
  className,
  onClick,
}: {
  tag?: string;
  className?: string;
  onClick?: (e: MouseEvent) => void;
}) {
  if (!tag) {
    return null;
  }

  return (
    <div className={classNames(className)} onClick={onClick}>
      <span>{tag}</span>
      <hr className={scss.bottomBar} />
    </div>
  );
}
