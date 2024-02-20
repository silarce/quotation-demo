import classNames from 'classnames';

import scss from './wrapper_tab01.module.scss';

type Ttab = {
  label: string;
  isActive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

// ===================================================================
const Wrapper_tab = ({
  children,
  tabBarStyle,
  tabArr = [],
  stickyTop,
  className,
  childrenOption,
}: {
  children?: React.ReactNode;
  tabBarStyle?: React.CSSProperties;
  tabArr?: Ttab[];
  stickyTop?: {
    top: React.CSSProperties['top'];
    background?: React.CSSProperties['background'];
    zIndex?: React.CSSProperties['zIndex'];
    style?: React.CSSProperties;
  };
  className?: string;
  childrenOption?: {
    noBorder?: boolean;
    noBorderTop?: boolean;
  };
}) => {
  //

  const stickyTopHeight = stickyTop?.top || 0;

  //
  return (
    <div className={classNames(scss.wrapper_tab, className)}>
      <div
        className={classNames(scss.stickyCover, !stickyTop && 'hidden')}
        style={{
          height: stickyTopHeight,
          background: stickyTop?.background,
          zIndex: stickyTop?.zIndex,
          ...stickyTop?.style,
        }}
      />
      {/*  */}
      {tabArr.length > 0 && (
        <div
          className={classNames(scss.tabBar)}
          style={{
            position: stickyTop && 'sticky',
            top: stickyTopHeight,
            ...tabBarStyle,
          }}
        >
          {tabArr.map((tab, index) => {
            const { label, isActive, className, style, onClick } = tab;

            return (
              <div
                key={index}
                className={classNames(scss.tab, isActive && scss.active, className)}
                style={style}
                onClick={onClick}
              >
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/*  */}
      <div
        className={classNames(
          scss.childrenContainer,
          childrenOption?.noBorder && scss.noBorder,
          childrenOption?.noBorderTop && scss.noBorderTop
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Wrapper_tab;
export type { Ttab };
