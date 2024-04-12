// https://cssload.net/en/horizontal-bars

import classNames from 'classnames';

import scss from './dotdotdot.module.scss';

export default function Dotdotdot({ className }: { className?: string }) {
  return (
    <div className={classNames(scss.circleG_wrapper, className)}>
      <div className={classNames(scss.circleG, scss.circleG_1)}></div>
      <div className={classNames(scss.circleG, scss.circleG_2)}></div>
      <div className={classNames(scss.circleG, scss.circleG_3)}></div>
    </div>
  );
}
