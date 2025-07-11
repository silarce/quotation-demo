import classNames from 'classnames';

import scss from './index.module.scss';

export default function Btn_fong({
  theme = 'normal',
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & {
  theme?: 'normal' | 'large';
}) {
  return (
    <button
      className={classNames(
        className,
        scss.btn,
        theme === 'normal' && [scss.normal],
        theme === 'large' && [scss.large]
      )}
      {...props}
    />
  );
}
