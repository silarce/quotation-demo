import scss from './index.module.scss';

export default function RadiusScrollbarContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`${scss.container} ${className ? className : ''}`} {...props}>
      <div>{children}</div>
    </div>
  );
}
