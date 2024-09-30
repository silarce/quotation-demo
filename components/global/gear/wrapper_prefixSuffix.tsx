import classNames from 'classnames';
import scss from './wrapper_prefixSuffix.module.scss';

const Wrapper_prefixSuffix = ({
  className,
  prefix,
  suffix,
  children,
}: {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div className={classNames(scss.currencyBox, className)}>
      {prefix && <span>{prefix}</span>}
      {children}
      {suffix && <span>{suffix}</span>}
    </div>
  );
};

export default Wrapper_prefixSuffix;
