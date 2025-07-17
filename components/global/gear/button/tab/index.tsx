import classNames from 'classnames';

import scss from './index.module.scss';

export default function Tab({ className, active, ...props }: Tprops_btn & { active?: boolean }) {
  return <button className={classNames(scss.btn, active && scss.active, className)} {...props} />;
}

type Tprops_btn = React.HTMLAttributes<HTMLButtonElement>;
