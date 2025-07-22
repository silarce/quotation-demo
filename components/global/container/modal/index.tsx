import classNames from 'classnames';
import scss from './index.module.scss';

function Container_confirm({
  title,
  footerLeft,
  footerRight,
  children,
  props_footer: { className: className_footer, ...props_footer } = {},
  theme = '01',
}: {
  title?: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  children: React.ReactNode;
  props_footer?: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;
  theme?: '01' | '02';
}) {
  return (
    <div className={classNames(scss.confirm)}>
      <div className={classNames(scss.title, scss[`s${theme}`])}>{title}</div>
      <div>{children}</div>
      <div className={classNames(scss.footer, className_footer)} {...props_footer}>
        <div>{footerLeft}</div>
        <div>{footerRight}</div>
      </div>
    </div>
  );
}

export { Container_confirm };
