import classNames from 'classnames';

import scss from './index.module.scss';

export default function Tab({ className, ...props }: Tprops_btn) {
  return <button className={classNames(scss.btn, className)} {...props} />;
}

type Tprops_btn = React.HTMLAttributes<HTMLButtonElement>;
