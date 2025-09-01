import classNames from 'classnames';

import scss from './index.module.scss';

type Tprops = {
  theme?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
} & React.HTMLAttributes<HTMLDivElement>;

export default function Badge({ className, theme, ...props }: Tprops) {
  return <div className={classNames(scss.badge, theme && scss[theme], className)} {...props} />;
}
